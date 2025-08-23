"""
Data preparation script using soundfile backend from the start
This avoids torchcodec issues entirely
"""

import os
# Set soundfile backend BEFORE importing datasets
os.environ["DATASETS_AUDIO_BACKEND"] = "soundfile"

from datasets import load_dataset, concatenate_datasets, DatasetDict, Audio
from pathlib import Path

def prepare_nigerian_datasets_with_soundfile():
    """Prepare datasets using soundfile backend from the start"""
    print("🇳🇬 Preparing Nigerian datasets with soundfile backend")
    print("=" * 60)
    
    # Step 1: Load Nigerian Pidgin dataset
    print("\n📊 Loading Nigerian Pidgin ASR dataset...")
    try:
        pidgin_ds = load_dataset("asr-nigerian-pidgin/nigerian-pidgin-1.0")
        print(f"✅ Pidgin dataset loaded: {pidgin_ds}")
        
        # Cast to soundfile right away
        pidgin_ds = pidgin_ds.cast_column("audio", Audio(sampling_rate=16000))
        print("✅ Pidgin audio cast to soundfile backend")
        
    except Exception as e:
        print(f"❌ Failed to load Pidgin dataset: {e}")
        return None
    
    # Step 2: Load Nigerian Common Voice dataset
    print("\n📊 Loading Nigerian Common Voice dataset...")
    try:
        cv_train = load_dataset("benjaminogbonna/nigerian_common_voice_dataset", "english", split="train")
        
        # Create splits
        train_size = int(0.8 * len(cv_train))
        val_size = int(0.1 * len(cv_train))
        
        cv_dataset = DatasetDict({
            "train": cv_train.select(range(train_size)),
            "validation": cv_train.select(range(train_size, train_size + val_size)),
            "test": cv_train.select(range(train_size + val_size, len(cv_train)))
        })
        
        print(f"✅ Common Voice dataset loaded: {cv_dataset}")
        
        # Cast to soundfile right away
        cv_dataset = cv_dataset.cast_column("audio", Audio(sampling_rate=16000))
        print("✅ Common Voice audio cast to soundfile backend")
        
    except Exception as e:
        print(f"❌ Failed to load Common Voice dataset: {e}")
        return None
    
    # Step 3: Standardize and combine
    print("\n📊 Standardizing and combining datasets...")
    try:
        # Standardize Pidgin dataset
        for split in pidgin_ds.keys():
            if "sentence" in pidgin_ds[split].column_names:
                pidgin_ds[split] = pidgin_ds[split].rename_column("sentence", "text")
            pidgin_ds[split] = pidgin_ds[split].add_column(
                "dataset_source", 
                ["pidgin"] * len(pidgin_ds[split])
            )
        
        # Standardize Common Voice dataset
        for split in cv_dataset.keys():
            if "sentence" in cv_dataset[split].column_names:
                cv_dataset[split] = cv_dataset[split].rename_column("sentence", "text")
            cv_dataset[split] = cv_dataset[split].add_column(
                "dataset_source", 
                ["common_voice"] * len(cv_dataset[split])
            )
        
        # Combine datasets
        combined_ds = DatasetDict()
        for split in ["train", "validation", "test"]:
            if split in pidgin_ds and split in cv_dataset:
                combined_ds[split] = concatenate_datasets([
                    pidgin_ds[split], 
                    cv_dataset[split]
                ])
        
        print(f"✅ Combined dataset: {combined_ds}")
        
        # Save to disk
        output_dir = "ml/datasets/combined_nigerian_speech_soundfile"
        os.makedirs(output_dir, exist_ok=True)
        combined_ds.save_to_disk(output_dir)
        
        print(f"💾 Combined dataset saved to: {output_dir}")
        
        return combined_ds
        
    except Exception as e:
        print(f"❌ Failed to combine datasets: {e}")
        return None

def test_soundfile_dataset():
    """Test that our soundfile dataset works"""
    print("\n🧪 Testing soundfile dataset...")
    
    try:
        dataset = load_dataset("asr-nigerian-pidgin/nigerian-pidgin-1.0")
        dataset = dataset.cast_column("audio", Audio(sampling_rate=16000))
        
        # Try to access audio
        sample = dataset["train"][0]
        audio_data = sample["audio"]
        
        print(f"✅ Audio data type: {type(audio_data)}")
        print(f"✅ Audio keys: {list(audio_data.keys()) if isinstance(audio_data, dict) else 'Not a dict'}")
        
        if isinstance(audio_data, dict) and "array" in audio_data:
            print(f"✅ Audio array shape: {audio_data['array'].shape}")
            print(f"✅ Sampling rate: {audio_data['sampling_rate']}")
        
        return True
        
    except Exception as e:
        print(f"❌ Soundfile test failed: {e}")
        return False

def main():
    """Main function"""
    print("Starting dataset preparation with soundfile backend...")
    
    # Test soundfile first
    if test_soundfile_dataset():
        print("\n✅ Soundfile test passed, proceeding with full preparation...")
        dataset = prepare_nigerian_datasets_with_soundfile()
        
        if dataset:
            print("\n🎉 Dataset preparation completed successfully!")
        else:
            print("\n❌ Dataset preparation failed")
    else:
        print("\n❌ Soundfile test failed, check your setup")

if __name__ == "__main__":
    main()