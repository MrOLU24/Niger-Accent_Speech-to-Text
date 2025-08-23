"""
Modified training script that bypasses torchcodec issues
Uses soundfile for audio processing instead
"""

import os
import sys
from pathlib import Path
import numpy as np

# Add project root to path
project_root = Path(__file__).parent.parent.parent
sys.path.append(str(project_root))

# Set environment variable to use soundfile instead of torchcodec
os.environ["DATASETS_AUDIO_BACKEND"] = "soundfile"

from datasets import load_from_disk, DatasetDict, Audio
from transformers import (
    WhisperFeatureExtractor,
    WhisperTokenizer, 
    WhisperProcessor,
    WhisperForConditionalGeneration,
    Seq2SeqTrainingArguments,
    Seq2SeqTrainer
)
from peft import LoraConfig, get_peft_model, TaskType
import torch


def test_audio_processing():
    """Test if we can process audio without torchcodec"""
    print("🧪 Testing audio processing with soundfile backend...")
    
    try:
        # Load dataset
        dataset = load_from_disk("ml/datasets/combined_nigerian_speech")
        
        # Try to access first audio sample
        sample = dataset["train"][0]
        print(f"✅ Sample loaded: {list(sample.keys())}")
        
        # Try to access audio
        audio_data = sample["audio"]
        print(f"✅ Audio data type: {type(audio_data)}")
        
        if isinstance(audio_data, dict) and "array" in audio_data:
            audio_array = audio_data["array"]
            print(f"✅ Audio array shape: {np.array(audio_array).shape}")
            print(f"✅ Audio sample rate: {audio_data.get('sampling_rate', 'unknown')}")
        
        return True
        
    except Exception as e:
        print(f"❌ Audio processing failed: {e}")
        return False


def test_whisper_with_audio():
    """Test Whisper processing with our audio data"""
    print("\n🧪 Testing Whisper with actual audio data...")
    
    try:
        # Load a small subset
        dataset = load_from_disk("ml/datasets/combined_nigerian_speech")
        
        # Load Whisper processor
        processor = WhisperProcessor.from_pretrained("openai/whisper-small", language="en", task="transcribe")
        
        # Get first sample
        sample = dataset["train"][0]
        print(f"Text: {sample['text']}")
        print(f"Source: {sample['dataset_source']}")
        
        # Process audio
        audio_data = sample["audio"]
        if isinstance(audio_data, dict) and "array" in audio_data:
            audio_array = audio_data["array"]
            
            # Use Whisper processor
            inputs = processor.feature_extractor(
                audio_array,
                sampling_rate=16000,
                return_tensors="pt"
            )
            
            print(f"✅ Whisper input features shape: {inputs.input_features.shape}")
            return True
        else:
            print("❌ Could not extract audio array")
            return False
            
    except Exception as e:
        print(f"❌ Whisper audio processing failed: {e}")
        return False


def test_lora_setup():
    """Test LoRA configuration"""
    print("\n🧪 Testing LoRA setup...")
    
    try:
        # Load model
        model = WhisperForConditionalGeneration.from_pretrained("openai/whisper-small")
        model.config.forced_decoder_ids = None
        model.config.suppress_tokens = []
        
        # Configure LoRA
        lora_config = LoraConfig(
            task_type=TaskType.FEATURE_EXTRACTION,
            r=32,
            lora_alpha=64,
            lora_dropout=0.1,
            target_modules=["q_proj", "v_proj", "k_proj", "out_proj", "fc1", "fc2"],
        )
        
        # Apply LoRA
        model = get_peft_model(model, lora_config)
        print(f"✅ LoRA applied successfully")
        model.print_trainable_parameters()
        
        return True
        
    except Exception as e:
        print(f"❌ LoRA setup failed: {e}")
        return False


def main():
    """Run comprehensive tests"""
    print("🇳🇬 Nigerian Speech-to-Text Training Test (Soundfile Backend)")
    print("=" * 65)
    
    tests = [
        test_audio_processing,
        test_whisper_with_audio,
        test_lora_setup
    ]
    
    results = []
    for test in tests:
        result = test()
        results.append(result)
        print()
    
    print(f"📊 Test Results: {sum(results)}/{len(results)} passed")
    
    if all(results):
        print("🎉 All tests passed! Training pipeline is ready.")
        print("💡 You can now proceed with full LoRA training using soundfile backend.")
    else:
        print("⚠️ Some tests failed. Check the errors above.")


if __name__ == "__main__":
    main()