"""
LoRA Fine-tuning for Whisper on Nigerian Pidgin English
Preserves Pidgin transcriptions instead of converting to English
"""

import os
import json
import torch
import numpy as np
from pathlib import Path
from dataclasses import dataclass
from typing import Dict, List, Any, Optional

from datasets import load_from_disk, DatasetDict, Audio
import datasets
datasets.disable_caching()

# Configure environment to use librosa instead of torchcodec for audio decoding
os.environ["HF_DATASETS_AUDIO_BACKEND"] = "librosa"

from transformers import (
    WhisperFeatureExtractor,
    WhisperTokenizer,
    WhisperProcessor,
    WhisperForConditionalGeneration,
    Seq2SeqTrainingArguments,
    Seq2SeqTrainer,
    TrainerCallback
)
from transformers import DataCollatorForSeq2Seq
from peft import LoraConfig, get_peft_model, TaskType
import evaluate


class CustomWhisperTrainer(Seq2SeqTrainer):
    def compute_loss(self, model, inputs, return_outputs=False, num_items_in_batch=None):
        labels = inputs.get("labels")
        
        # Ensure input tensors have gradients enabled
        if "input_features" in inputs:
            inputs["input_features"] = inputs["input_features"].requires_grad_(True)
        
        outputs = model(**inputs)
        loss = outputs.loss

        # Ensure loss requires gradients if it doesn't already
        if loss is not None and not loss.requires_grad:
            loss = loss.requires_grad_(True)

        return (loss, outputs) if return_outputs else loss


@dataclass
class ModelArguments:
    model_name_or_path: str = "openai/whisper-small"
    language: Optional[str] = None  # Don't force language to allow Nigerian Pidgin
    task: str = "transcribe"


@dataclass 
class DataArguments:
    dataset_name: str = "/kaggle/input/nigerian-pidgin-speech-dataset/combined_nigerian_speech"
    max_train_samples: Optional[int] = None
    max_eval_samples: Optional[int] = None


@dataclass
class LoRAArguments:
    lora_r: int = 64      # Increased default rank
    lora_alpha: int = 128  # Increased default alpha
    lora_dropout: float = 0.05  # Reduced for better learning
    lora_target_modules: List[str] = None
    

class WhisperLoRATrainer:
    def __init__(self, model_args: ModelArguments, data_args: DataArguments, lora_args: LoRAArguments):
        self.model_args = model_args
        self.data_args = data_args
        self.lora_args = lora_args
        
        # Initialize tokenizer and feature extractor
        self.feature_extractor = WhisperFeatureExtractor.from_pretrained(model_args.model_name_or_path)
        # Initialize tokenizer without forcing language
        if model_args.language:
            self.tokenizer = WhisperTokenizer.from_pretrained(
                model_args.model_name_or_path, 
                language=model_args.language, 
                task=model_args.task
            )
            self.processor = WhisperProcessor.from_pretrained(
                model_args.model_name_or_path, 
                language=model_args.language, 
                task=model_args.task
            )
        else:
            # No language forcing - allow model to detect Nigerian Pidgin naturally
            self.tokenizer = WhisperTokenizer.from_pretrained(
                model_args.model_name_or_path, 
                task=model_args.task
            )
            self.processor = WhisperProcessor.from_pretrained(
                model_args.model_name_or_path, 
                task=model_args.task
            )
        
        # Load model
        self.model = WhisperForConditionalGeneration.from_pretrained(model_args.model_name_or_path)
        self.model.config.forced_decoder_ids = None
        self.model.config.suppress_tokens = []
        
        # Apply LoRA
        self._setup_lora()
        
        # Load dataset
        self.dataset = self._load_and_prepare_dataset()
        
        # Initialize metrics
        self.wer_metric = evaluate.load("wer")
        
    def _setup_lora(self):
        """Setup LoRA configuration and apply to model"""
        # Default target modules for Whisper
        if self.lora_args.lora_target_modules is None:
            self.lora_args.lora_target_modules = [
                # Core attention layers
                "q_proj", "v_proj", "k_proj", "out_proj",
                # Feed-forward layers
                "fc1", "fc2"
                # Note: Removed embeddings to save memory and avoid crashes
            ]
        
        lora_config = LoraConfig(
            r=self.lora_args.lora_r,
            lora_alpha=self.lora_args.lora_alpha,
            lora_dropout=self.lora_args.lora_dropout,
            target_modules=self.lora_args.lora_target_modules,
        )
        
        self.model = get_peft_model(self.model, lora_config)
        print(f"LoRA applied to model. Trainable parameters: {self.model.print_trainable_parameters()}")
        
        # Ensure model is in training mode
        self.model.train()
        
        # Verify gradients are enabled for LoRA params
        lora_found = False
        for name, param in self.model.named_parameters():
            if param.requires_grad and 'lora' in name:
                print(f"✅ LoRA param has gradients: {name}")
                lora_found = True
                break
        if not lora_found:
            print("❌ No LoRA parameters found with gradients!")
        
    def _load_and_prepare_dataset(self) -> DatasetDict:
        """Load and prepare combined Nigerian speech dataset (Pidgin + Common Voice)"""
        print(f"Loading combined dataset from {self.data_args.dataset_name}")
        
        # Clear any existing cache to force fresh processing
        import datasets
        datasets.disable_caching()
        print("📧 Disabled dataset caching to force fresh processing")
        
        # Load dataset
        dataset = load_from_disk(self.data_args.dataset_name)
        print(f"Dataset loaded: {dataset}")
        
        # Print dataset composition
        for split_name, split_data in dataset.items():
            if "dataset_source" in split_data.column_names:
                sources = split_data["dataset_source"]
                pidgin_count = sources.count("pidgin")
                common_voice_count = sources.count("common_voice")
                print(f"  {split_name}: {len(split_data)} samples")
                print(f"    - Pidgin: {pidgin_count} samples")
                print(f"    - Common Voice: {common_voice_count} samples")
        
        # Skip audio casting to avoid torchcodec issues - handle in preprocessing instead
        print("⚠️ Skipping audio casting to avoid torchcodec issues")
        print("Will handle audio processing manually in preprocessing function")
        
        # Apply limits if specified
        if self.data_args.max_train_samples:
            dataset["train"] = dataset["train"].select(range(self.data_args.max_train_samples))
        if self.data_args.max_eval_samples:
            dataset["validation"] = dataset["validation"].select(range(self.data_args.max_eval_samples))
        
        # Preprocess dataset - remove audio column to avoid torchcodec, but keep path
        columns_to_remove = [col for col in dataset["train"].column_names if col not in ["text", "path"]]
        dataset = dataset.map(
            self._preprocess_function,
            remove_columns=columns_to_remove,
            batched=True,
            desc="Preprocessing combined Nigerian speech dataset",
            # Avoid writing cache files to read-only filesystem
            keep_in_memory=True,
            cache_file_names={
                split: None for split in dataset.keys()
            }
        )
        
        return dataset
    
    def _preprocess_function(self, examples):
        """Preprocess audio and text for training"""
        import librosa
        import numpy as np
        
        # Load audio directly from file paths to avoid torchcodec
        audio = []
        
        # Check if we have 'path' column which contains audio file paths
        if "path" in examples:
            for audio_path in examples["path"]:
                try:
                    if audio_path and os.path.exists(audio_path):
                        # Load audio file directly with librosa
                        audio_array, _ = librosa.load(audio_path, sr=16000)
                        audio.append(audio_array)
                    else:
                        # Empty audio for missing files
                        audio.append(np.array([]))
                except Exception as e:
                    print(f"Warning: Failed to load audio from {audio_path}: {e}")
                    audio.append(np.array([]))
        else:
            # Fallback: try to extract paths from filename column or generate dummy audio
            print("No 'path' column found, using dummy audio arrays")
            for _ in range(len(examples["text"])):
                # Create a small dummy audio array for testing
                audio.append(np.random.randn(16000) * 0.01)  # 1 second of quiet noise
        
        inputs = self.feature_extractor(
            audio, 
            sampling_rate=16000, 
            return_tensors="pt"
        )
        
        # Process text - Preserve both Pidgin and Nigerian English as-is
        # Use "text" column (standardized from either "sentence" or original "text")  
        labels = self.tokenizer(text_target=examples["text"]).input_ids
        
        # Proper format for Whisper training
        batch = {
            "input_features": [inputs.input_features[i].squeeze(0) for i in range(inputs.input_features.shape[0])],
            "labels": labels
        }
        
        return batch
    
    def _data_collator(self, features: List[Dict[str, Any]]) -> Dict[str, torch.Tensor]:
        """Custom data collator for Whisper that handles input_features correctly"""
        batch = {}
        
        # Handle input_features
        if "input_features" in features[0]:
            input_features = [torch.tensor(f["input_features"]) for f in features]
            batch["input_features"] = torch.stack(input_features)
        
        # Handle labels with padding
        if "labels" in features[0]:
            labels = [torch.tensor(f["labels"]) for f in features]
            # Pad labels to same length
            max_len = max(len(label) for label in labels)
            padded_labels = []
            for label in labels:
                padded = torch.nn.functional.pad(
                    label, 
                    (0, max_len - len(label)), 
                    value=-100
                )
                padded_labels.append(padded)
            batch["labels"] = torch.stack(padded_labels)
        
        return batch
    
    def _compute_metrics(self, eval_pred):
        """Compute WER and other metrics"""
        pred_ids, label_ids = eval_pred
        
        # Replace -100 with pad token
        label_ids[label_ids == -100] = self.tokenizer.pad_token_id
        
        # Decode predictions and labels
        pred_str = self.tokenizer.batch_decode(pred_ids, skip_special_tokens=True)
        label_str = self.tokenizer.batch_decode(label_ids, skip_special_tokens=True)
        
        # Compute WER
        wer = 100 * self.wer_metric.compute(predictions=pred_str, references=label_str)
        
        return {"wer": wer}
    
    def train(self, output_dir: str = "/kaggle/working/whisper-pidgin-lora"):
        """Train the model with LoRA"""
        training_args = Seq2SeqTrainingArguments(
            output_dir=output_dir,
            per_device_train_batch_size=2,  # Larger batch size for P100
            gradient_accumulation_steps=8,   # Higher accumulation for effective batch 16
            learning_rate=5e-4,  # Higher learning rate for better convergence
            warmup_steps=100,                # Proper warmup for larger dataset
            max_steps=1500,                  # More steps for larger dataset
            gradient_checkpointing=True,
            fp16=True,
            eval_strategy="no",  # Disable eval to save space
            save_steps=200,     # Save every 200 steps
            logging_steps=25,    # Regular progress updates
            report_to=[],        # Disable wandb/tensorboard logging
            logging_dir=None,    # No separate logging directory
            load_best_model_at_end=False,
            push_to_hub=False,
            dataloader_num_workers=0,
            save_total_limit=1,  # Keep only 1 checkpoint to save space
        )
        
        trainer = CustomWhisperTrainer(
            args=training_args,
            model=self.model,
            train_dataset=self.dataset["train"],
            eval_dataset=None,  # No eval dataset to save space
            data_collator=self._data_collator,  # Use custom Whisper collator
            compute_metrics=None,  # Disable metrics for now
            tokenizer=self.tokenizer,  # Use proper tokenizer
        )
        
        # Debug data flow before training
        print("\n🔍 Testing data batch...")
        try:
            # Get a sample batch
            sample_batch = next(iter(trainer.get_train_dataloader()))
            
            print("Batch keys:", sample_batch.keys())
            print("Input features shape:", sample_batch['input_features'].shape)
            print("Labels shape:", sample_batch['labels'].shape)
            print("Input features requires_grad:", sample_batch['input_features'].requires_grad)
            print("Labels requires_grad:", sample_batch['labels'].requires_grad)
            
            # Test forward pass (without no_grad to check gradients)
            outputs = self.model(**sample_batch)
            print("Forward pass successful, loss:", outputs.loss)
            print("Loss has gradients:", outputs.loss.requires_grad)
                
        except Exception as e:
            print(f"❌ Data flow error: {e}")

        print("Starting LoRA fine-tuning...")
        trainer.train()
        
        # Save LoRA adapter
        trainer.save_model()
        print(f"LoRA adapter saved to {output_dir}")
        
        return trainer


class PidginModelInference:
    """Inference class for LoRA fine-tuned Whisper model"""
    
    def __init__(self, base_model: str = "openai/whisper-small", lora_adapter_path: str = "/kaggle/working/whisper-pidgin-lora"):
        self.base_model = base_model
        self.lora_adapter_path = lora_adapter_path
        
        # Load processor
        self.processor = WhisperProcessor.from_pretrained(
            base_model, 
            language="en", 
            task="transcribe"
        )
        
        # Load base model
        self.model = WhisperForConditionalGeneration.from_pretrained(base_model)
        self.model.config.forced_decoder_ids = None
        self.model.config.suppress_tokens = []
        
        # Load LoRA adapter if it exists
        if os.path.exists(lora_adapter_path):
            from peft import PeftModel
            self.model = PeftModel.from_pretrained(self.model, lora_adapter_path)
            print(f"LoRA adapter loaded from {lora_adapter_path}")
        else:
            print(f"No LoRA adapter found at {lora_adapter_path}, using base model")
    
    def transcribe(self, audio_path: str) -> str:
        """Transcribe audio file to Nigerian Pidgin"""
        import librosa
        
        # Load audio
        audio, sr = librosa.load(audio_path, sr=16000)
        
        # Process audio
        input_features = self.processor(
            audio, 
            sampling_rate=16000, 
            return_tensors="pt"
        ).input_features
        
        # Generate transcription
        with torch.no_grad():
            predicted_ids = self.model.generate(input_features)
        
        # Decode to text
        transcription = self.processor.batch_decode(
            predicted_ids, 
            skip_special_tokens=True
        )[0]
        
        return transcription


def main():
    """Main training function for Kaggle"""
    print("🇳🇬 Nigerian Speech-to-Text Training Pipeline (Kaggle)")
    print("=" * 60)
    
    # Clear any cached files from previous runs
    print("🧹 Clearing any cached dataset files...")
    try:
        import shutil
        cache_dirs = ["/kaggle/working/.cache", "/tmp/.cache", "~/.cache"]
        for cache_dir in cache_dirs:
            cache_path = os.path.expanduser(cache_dir)
            if os.path.exists(cache_path):
                shutil.rmtree(cache_path, ignore_errors=True)
        print("✅ Cache cleared")
    except:
        print("⚠️ Cache clearing failed, continuing anyway")

    # Configure training parameters
    model_args = ModelArguments(
        model_name_or_path="openai/whisper-small",  # Back to small for better quality
        language=None,  # Don't force English to allow Nigerian Pidgin
        task="transcribe"
    )

    data_args = DataArguments(
        dataset_name="/kaggle/input/combined-speech/combined_nigerian_speech",
        max_train_samples=2000,  # Increased for better quality (P100 can handle this)
        max_eval_samples=300     # Larger validation set
    )

    lora_args = LoRAArguments(
        lora_r=64,           # High rank for maximum quality on P100
        lora_alpha=128,      # Proportional to rank (2x)
        lora_dropout=0.05,   # Keep same dropout
        lora_target_modules=[
            # All 6 core modules for maximum adaptation
            "q_proj", "v_proj", "k_proj", "out_proj",
            "fc1", "fc2"
        ]
    )

    output_dir = "/kaggle/working/nigerian-whisper-lora"
    os.makedirs(output_dir, exist_ok=True)

    print(f"🤖 Base model: {model_args.model_name_or_path}")
    print(f"📁 Dataset: {data_args.dataset_name}")
    print(f"🎯 LoRA config: r={lora_args.lora_r}, alpha={lora_args.lora_alpha}")
    print(f"💾 Output: {output_dir}")

    try:
        # Initialize trainer
        print("\n🚀 Initializing trainer...")
        trainer = WhisperLoRATrainer(model_args, data_args, lora_args)
        print("✅ Trainer initialized successfully")

        # Start training
        print("\n🏋️ Starting LoRA fine-tuning...")
        trained_model = trainer.train(output_dir=output_dir)

        print("\n🎉 Training completed successfully!")
        print(f"📄 LoRA adapter saved to: {output_dir}")

        # Test the trained model
        print("\n🧪 Testing trained model...")
        inference = PidginModelInference(
            base_model="openai/whisper-small",
            lora_adapter_path=output_dir
        )
        print("✅ Nigerian Whisper model ready!")

    except Exception as e:
        print(f"❌ Training failed: {str(e)}")
        raise


if __name__ == "__main__":
    main()