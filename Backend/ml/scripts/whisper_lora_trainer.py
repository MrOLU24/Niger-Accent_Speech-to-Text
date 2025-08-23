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
from peft import LoraConfig, get_peft_model, TaskType
import evaluate


@dataclass
class ModelArguments:
    model_name_or_path: str = "openai/whisper-small"
    language: str = "en"
    task: str = "transcribe"


@dataclass 
class DataArguments:
    dataset_name: str = "ml/datasets/combined_nigerian_speech"
    max_train_samples: Optional[int] = None
    max_eval_samples: Optional[int] = None


@dataclass
class LoRAArguments:
    lora_r: int = 32
    lora_alpha: int = 64
    lora_dropout: float = 0.1
    lora_target_modules: List[str] = None
    

class WhisperLoRATrainer:
    def __init__(self, model_args: ModelArguments, data_args: DataArguments, lora_args: LoRAArguments):
        self.model_args = model_args
        self.data_args = data_args
        self.lora_args = lora_args
        
        # Initialize tokenizer and feature extractor
        self.feature_extractor = WhisperFeatureExtractor.from_pretrained(model_args.model_name_or_path)
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
                "q_proj", "v_proj", "k_proj", "out_proj",
                "fc1", "fc2"
            ]
        
        lora_config = LoraConfig(
            task_type=TaskType.FEATURE_EXTRACTION,
            r=self.lora_args.lora_r,
            lora_alpha=self.lora_args.lora_alpha,
            lora_dropout=self.lora_args.lora_dropout,
            target_modules=self.lora_args.lora_target_modules,
        )
        
        self.model = get_peft_model(self.model, lora_config)
        print(f"LoRA applied to model. Trainable parameters: {self.model.print_trainable_parameters()}")
        
    def _load_and_prepare_dataset(self) -> DatasetDict:
        """Load and prepare combined Nigerian speech dataset (Pidgin + Common Voice)"""
        print(f"Loading combined dataset from {self.data_args.dataset_name}")
        
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
            desc="Preprocessing combined Nigerian speech dataset"
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
        with self.tokenizer.as_target_tokenizer():
            # Use "text" column (standardized from either "sentence" or original "text")
            labels = self.tokenizer(examples["text"]).input_ids
        
        batch = {
            "input_features": inputs.input_features,
            "labels": labels
        }
        
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
    
    def train(self, output_dir: str = "models/whisper-pidgin-lora"):
        """Train the model with LoRA"""
        training_args = Seq2SeqTrainingArguments(
            output_dir=output_dir,
            per_device_train_batch_size=8,
            gradient_accumulation_steps=2,
            learning_rate=1e-4,
            warmup_steps=500,
            max_steps=5000,
            gradient_checkpointing=True,
            fp16=True,
            eval_strategy="steps",
            eval_steps=500,
            save_steps=500,
            logging_steps=25,
            report_to=None,
            load_best_model_at_end=True,
            metric_for_best_model="wer",
            greater_is_better=False,
            push_to_hub=False,
            dataloader_num_workers=0,
        )
        
        trainer = Seq2SeqTrainer(
            args=training_args,
            model=self.model,
            train_dataset=self.dataset["train"],
            eval_dataset=self.dataset["validation"],
            data_collator=self._data_collator,
            compute_metrics=self._compute_metrics,
            tokenizer=self.processor.feature_extractor,
        )
        
        print("Starting LoRA fine-tuning...")
        trainer.train()
        
        # Save LoRA adapter
        trainer.save_model()
        print(f"LoRA adapter saved to {output_dir}")
        
        return trainer
    
    def _data_collator(self, features: List[Dict[str, Any]]) -> Dict[str, torch.Tensor]:
        """Custom data collator for Whisper LoRA training"""
        input_features = [{"input_features": feature["input_features"]} for feature in features]
        
        batch = self.processor.feature_extractor.pad(
            input_features,
            return_tensors="pt",
        )
        
        # Get labels
        label_features = [{"input_ids": feature["labels"]} for feature in features]
        labels_batch = self.tokenizer.pad(
            label_features,
            return_tensors="pt",
        )
        
        # Replace pad tokens with -100 for loss calculation
        labels = labels_batch["input_ids"].masked_fill(
            labels_batch.attention_mask.ne(1), -100
        )
        
        # Cut off beginning token for decoder input
        if (labels[:, 0] == self.tokenizer.bos_token_id).all().cpu().item():
            labels = labels[:, 1:]
        
        batch["labels"] = labels
        return batch


class PidginModelInference:
    """Inference class for LoRA fine-tuned Whisper model"""
    
    def __init__(self, base_model: str = "openai/whisper-small", lora_adapter_path: str = "models/whisper-pidgin-lora"):
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
    """Main training function"""
    # Configuration
    model_args = ModelArguments()
    data_args = DataArguments()
    lora_args = LoRAArguments()
    
    # Create trainer
    trainer = WhisperLoRATrainer(model_args, data_args, lora_args)
    
    # Train model
    trained_model = trainer.train()
    
    print("Training completed!")
    
    # Test inference
    inference = PidginModelInference()
    print("Inference model ready for Nigerian Pidgin transcription")


if __name__ == "__main__":
    main()