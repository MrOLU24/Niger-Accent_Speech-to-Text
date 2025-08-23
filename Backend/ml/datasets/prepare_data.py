from datasets import load_dataset, concatenate_datasets, DatasetDict, Audio
import os
from pathlib import Path

# Configure environment to use librosa instead of torchcodec for audio decoding
os.environ["HF_DATASETS_AUDIO_BACKEND"] = "librosa"

def prepare_asr_nigerian_pidgin(output_dir="ml/datasets/nigeria_pidgin_asr"):
    """Load and save Nigerian Pidgin ASR dataset locally."""
    print("Loading asr-nigerian-pidgin/nigerian-pidgin-1.0 dataset...")
    ds = load_dataset("asr-nigerian-pidgin/nigerian-pidgin-1.0")
    
    # Create output directory
    os.makedirs(output_dir, exist_ok=True)
    
    # Save dataset to disk
    ds.save_to_disk(output_dir)
    print(f"Dataset saved to {output_dir}")
    
    # Print dataset info
    print(f"Dataset structure: {ds}")
    print(f"Total samples: {sum(len(split) for split in ds.values())}")
    
    return ds

def prepare_nigerian_common_voice(output_dir="ml/datasets/nigerian_common_voice"):
    """Load and save Nigerian English from benjaminogbonna/nigerian_common_voice_dataset."""
    print("Loading benjaminogbonna/nigerian_common_voice_dataset...")
    
    try:
        # Load Nigerian Common Voice dataset
        ds = load_dataset("benjaminogbonna/nigerian_common_voice_dataset", "english", split="train")
        
        print(f"Loaded {len(ds)} Nigerian Common Voice samples")
        print(f"Sample columns: {ds.column_names}")
        
        # Create train/validation/test splits
        train_size = int(0.8 * len(ds))
        val_size = int(0.1 * len(ds))
        
        train_ds = ds.select(range(train_size))
        val_ds = ds.select(range(train_size, train_size + val_size))
        test_ds = ds.select(range(train_size + val_size, len(ds)))
        
        dataset_dict = DatasetDict({
            "train": train_ds,
            "validation": val_ds,
            "test": test_ds
        })
        
        # Create output directory
        os.makedirs(output_dir, exist_ok=True)
        
        # Save dataset to disk
        dataset_dict.save_to_disk(output_dir)
        print(f"Nigerian Common Voice dataset saved to {output_dir}")
        print(f"Splits: train={len(train_ds)}, validation={len(val_ds)}, test={len(test_ds)}")
        
        return dataset_dict
        
    except Exception as e:
        print(f"Error loading Nigerian Common Voice: {e}")
        return None

def combine_nigerian_datasets(
    pidgin_dir="ml/datasets/nigeria_pidgin_asr",
    common_voice_dir="ml/datasets/nigerian_common_voice", 
    output_dir="ml/datasets/combined_nigerian_speech"
):
    """Combine Nigerian Pidgin ASR and Nigerian Common Voice datasets."""
    print("Combining Nigerian Pidgin and Common Voice datasets...")
    
    try:
        # Load both datasets
        from datasets import load_from_disk
        
        pidgin_ds = load_from_disk(pidgin_dir)
        common_voice_ds = load_from_disk(common_voice_dir)
        
        print(f"Pidgin dataset: {pidgin_ds}")
        print(f"Common Voice dataset: {common_voice_ds}")
        
        # Standardize column names if needed
        def standardize_dataset(ds, dataset_type):
            """Standardize column names across datasets."""
            # Map different column names to standard format
            column_mapping = {}
            
            if dataset_type == "pidgin":
                # Nigerian Pidgin dataset columns
                if "sentence" in ds["train"].column_names:
                    column_mapping["sentence"] = "text"
            elif dataset_type == "common_voice":
                # Common Voice dataset columns  
                if "sentence" in ds["train"].column_names:
                    column_mapping["sentence"] = "text"
                    
            # Apply column renaming if needed
            if column_mapping:
                for split in ds.keys():
                    ds[split] = ds[split].rename_columns(column_mapping)
            
            # Add dataset source label
            for split in ds.keys():
                ds[split] = ds[split].add_column("dataset_source", [dataset_type] * len(ds[split]))
            
            return ds
        
        # Standardize both datasets
        pidgin_ds = standardize_dataset(pidgin_ds, "pidgin")
        common_voice_ds = standardize_dataset(common_voice_ds, "common_voice")
        
        # Combine datasets for each split
        combined_ds = DatasetDict()
        
        for split in ["train", "validation", "test"]:
            if split in pidgin_ds and split in common_voice_ds:
                # Cast audio columns to same format
                pidgin_ds[split] = pidgin_ds[split].cast_column("audio", Audio(sampling_rate=16000))
                common_voice_ds[split] = common_voice_ds[split].cast_column("audio", Audio(sampling_rate=16000))
                
                # Concatenate datasets
                combined_ds[split] = concatenate_datasets([
                    pidgin_ds[split], 
                    common_voice_ds[split]
                ])
            elif split in pidgin_ds:
                combined_ds[split] = pidgin_ds[split]
            elif split in common_voice_ds:
                combined_ds[split] = common_voice_ds[split]
        
        # Create output directory
        os.makedirs(output_dir, exist_ok=True)
        
        # Save combined dataset
        combined_ds.save_to_disk(output_dir)
        
        print(f"Combined dataset saved to {output_dir}")
        print(f"Combined dataset structure: {combined_ds}")
        for split, ds in combined_ds.items():
            print(f"  {split}: {len(ds)} samples")
            
        return combined_ds
        
    except Exception as e:
        print(f"Error combining datasets: {e}")
        return None

def load_local_dataset(dataset_dir="ml/datasets/nigeria_pidgin_asr"):
    """Load the locally saved Nigerian Pidgin dataset."""
    from datasets import load_from_disk
    try:
        ds = load_from_disk(dataset_dir)
        print(f"Loaded local dataset from {dataset_dir}")
        return ds
    except Exception as e:
        print(f"Error loading local dataset: {e}")
        print("Run prepare_asr_nigerian_pidgin() first to download and save the dataset")
        return None

def prepare_all_datasets():
    """Prepare all Nigerian speech datasets for training."""
    print("🚀 Preparing Nigerian speech datasets for training")
    print("=" * 60)
    
    # Step 1: Prepare Nigerian Pidgin ASR dataset
    print("\n📊 Step 1: Preparing Nigerian Pidgin ASR dataset...")
    pidgin_ds = prepare_asr_nigerian_pidgin()
    
    # Step 2: Prepare Nigerian Common Voice dataset  
    print("\n📊 Step 2: Preparing Nigerian Common Voice dataset...")
    common_voice_ds = prepare_nigerian_common_voice()
    
    # Step 3: Combine both datasets
    if pidgin_ds and common_voice_ds:
        print("\n📊 Step 3: Combining datasets...")
        combined_ds = combine_nigerian_datasets()
        
        if combined_ds:
            print("\n✅ All datasets prepared successfully!")
            print(f"📁 Combined dataset location: ml/datasets/combined_nigerian_speech")
            print(f"🎯 Ready for Whisper LoRA fine-tuning")
            return combined_ds
    
    print("\n⚠️ Some datasets failed to prepare")
    return None

if __name__ == "__main__":
    prepare_all_datasets()