"""
Simple test to verify our dataset and training setup works
"""

import torch
from datasets import load_from_disk
from transformers import WhisperProcessor, WhisperForConditionalGeneration

def test_dataset_loading():
    """Test that we can load and access our combined dataset"""
    print("🧪 Testing dataset loading...")
    
    try:
        # Load dataset
        dataset = load_from_disk("ml/datasets/combined_nigerian_speech")
        print(f"✅ Dataset loaded: {dataset}")
        
        # Check first sample
        sample = dataset["train"][0]
        print(f"✅ Sample columns: {list(sample.keys())}")
        print(f"✅ Text: {sample['text'][:100]}...")
        print(f"✅ Dataset source: {sample['dataset_source']}")
        
        return True
        
    except Exception as e:
        print(f"❌ Dataset loading failed: {e}")
        return False

def test_whisper_model():
    """Test that we can load Whisper model"""
    print("\n🧪 Testing Whisper model loading...")
    
    try:
        # Load processor and model
        processor = WhisperProcessor.from_pretrained("openai/whisper-small")
        model = WhisperForConditionalGeneration.from_pretrained("openai/whisper-small")
        
        print("✅ Whisper model loaded successfully")
        print(f"✅ Model parameters: {model.num_parameters():,}")
        
        return True
        
    except Exception as e:
        print(f"❌ Model loading failed: {e}")
        return False

def test_basic_transcription():
    """Test basic transcription without training"""
    print("\n🧪 Testing basic transcription...")
    
    try:
        import numpy as np
        
        # Create dummy audio (1 second of silence)
        dummy_audio = np.zeros(16000)
        
        processor = WhisperProcessor.from_pretrained("openai/whisper-small")
        model = WhisperForConditionalGeneration.from_pretrained("openai/whisper-small")
        
        # Process audio
        inputs = processor(dummy_audio, sampling_rate=16000, return_tensors="pt")
        
        # Generate transcription
        with torch.no_grad():
            predicted_ids = model.generate(inputs.input_features)
        
        # Decode
        transcription = processor.batch_decode(predicted_ids, skip_special_tokens=True)[0]
        
        print(f"✅ Basic transcription works: '{transcription}'")
        return True
        
    except Exception as e:
        print(f"❌ Basic transcription failed: {e}")
        return False

def main():
    """Run all tests"""
    print("🇳🇬 Nigerian Speech-to-Text Setup Verification")
    print("=" * 50)
    
    tests = [
        test_dataset_loading,
        test_whisper_model, 
        test_basic_transcription
    ]
    
    results = []
    for test in tests:
        result = test()
        results.append(result)
    
    print(f"\n📊 Test Results: {sum(results)}/{len(results)} passed")
    
    if all(results):
        print("🎉 All tests passed! Your setup is ready for training.")
    else:
        print("⚠️ Some tests failed. Check the errors above.")

if __name__ == "__main__":
    main()