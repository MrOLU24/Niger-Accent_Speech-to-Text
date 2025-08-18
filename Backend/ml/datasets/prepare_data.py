from datasets import load_dataset
import os

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

if __name__ == "__main__":
    prepare_asr_nigerian_pidgin()