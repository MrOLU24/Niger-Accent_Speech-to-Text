"""
Script to load and analyze the Nigerian Pidgin ASR dataset 
to extract correction patterns for our dictionary.
"""

from datasets import load_dataset
import json
import re
from collections import Counter, defaultdict
from typing import Dict, List, Tuple

def load_nigerian_pidgin_dataset():
    """Load the Nigerian Pidgin ASR dataset from Hugging Face."""
    try:
        print("Loading asr-nigerian-pidgin/nigerian-pidgin-1.0 dataset...")
        dataset = load_dataset("asr-nigerian-pidgin/nigerian-pidgin-1.0")
        print(f"Dataset loaded successfully!")
        print(f"Dataset structure: {dataset}")
        return dataset
    except Exception as e:
        print(f"Error loading dataset: {e}")
        return None

def analyze_text_patterns(dataset):
    """Analyze text patterns to identify common Pidgin phrases."""
    if not dataset:
        return {}
    
    # Get all text samples
    texts = []
    for split in dataset.keys():
        if 'sentence' in dataset[split].column_names:
            texts.extend(dataset[split]['sentence'])
        elif 'text' in dataset[split].column_names:
            texts.extend(dataset[split]['text'])
    
    print(f"Analyzing {len(texts)} text samples...")
    
    # Extract common patterns
    word_freq = Counter()
    bigram_freq = Counter()
    trigram_freq = Counter()
    
    for text in texts:
        if not text:
            continue
            
        # Clean and tokenize
        clean_text = text.lower().strip()
        words = clean_text.split()
        
        # Count word frequencies
        word_freq.update(words)
        
        # Count bigrams
        for i in range(len(words) - 1):
            bigram_freq[(words[i], words[i+1])] += 1
            
        # Count trigrams
        for i in range(len(words) - 2):
            trigram_freq[(words[i], words[i+1], words[i+2])] += 1
    
    return {
        'word_freq': word_freq.most_common(100),
        'bigram_freq': bigram_freq.most_common(50),
        'trigram_freq': trigram_freq.most_common(30),
        'total_texts': len(texts),
        'sample_texts': texts[:10]  # First 10 for inspection
    }

def extract_pidgin_corrections(analysis):
    """Extract potential Pidgin to English corrections from analysis."""
    corrections = {}
    
    # Common Pidgin words found in the dataset (expanded based on real data)
    pidgin_mappings = {
        # Core dataset words (top frequency)
        'di': 'the',
        'dey': 'are',
        'wey': 'that',
        'dem': 'them',
        'go': 'will',
        'na': 'is',
        'wetin': 'what',
        'fit': 'can',
        'tok': 'talk',
        'say': 'said',
        'wen': 'when',
        'how': 'how',
        'make': 'let',
        'come': 'come',
        'no': 'not',
        'don': 'have',
        'get': 'have',
        'see': 'see',
        'know': 'know',
        'want': 'want',
        'like': 'like',
        'think': 'think',
        'good': 'good',
        'bad': 'bad',
        'small': 'small',
        'big': 'big',
        # Traditional additions
        'chop': 'eat',
        'waka': 'walk',
        'yarn': 'talk',
        'sabi': 'know',
        'oya': 'come on',
        'abeg': 'please',
        'wahala': 'problem',
        'palava': 'trouble',
        'katakata': 'chaos',
        'gbege': 'problem',
        'shey': 'right',
        'abi': 'right',
        'comot': 'leave',
        'enter': 'come in',
        'carry': 'take',
        'drop': 'put down',
        'find': 'look for',
        'hear': 'listen',
    }
    
    # Analyze word frequencies to find Pidgin patterns
    word_freq = dict(analysis.get('word_freq', []))
    
    # Extract high-frequency Pidgin words
    for word, freq in word_freq.items():
        if freq > 5 and word in pidgin_mappings:  # Threshold for common words
            corrections[word] = pidgin_mappings[word]
    
    return corrections

def save_corrections_dict(corrections, filename="nigerian_corrections.json"):
    """Save extracted corrections to a JSON file."""
    filepath = f"/Users/mubarakojewale/Documents/Ravens/Niger-Accent_Speech-to-Text/Backend/data/{filename}"
    
    # Create data directory if it doesn't exist
    import os
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(corrections, f, indent=2, ensure_ascii=False)
    
    print(f"Corrections saved to {filepath}")
    return filepath

def main():
    """Main function to run the dataset analysis."""
    print("Starting Nigerian Pidgin dataset analysis...")
    
    # Load dataset
    dataset = load_nigerian_pidgin_dataset()
    if not dataset:
        print("Failed to load dataset. Exiting.")
        return
    
    # Analyze patterns
    analysis = analyze_text_patterns(dataset)
    print(f"\nDataset Analysis Results:")
    print(f"Total texts analyzed: {analysis['total_texts']}")
    print(f"Top 10 words: {analysis['word_freq'][:10]}")
    print(f"Top 5 bigrams: {analysis['bigram_freq'][:5]}")
    
    # Extract corrections
    corrections = extract_pidgin_corrections(analysis)
    print(f"\nExtracted {len(corrections)} correction mappings")
    
    # Save results
    save_corrections_dict(corrections)
    
    # Save analysis for review
    analysis_file = "/Users/mubarakojewale/Documents/Ravens/Niger-Accent_Speech-to-Text/Backend/data/dataset_analysis.json"
    with open(analysis_file, 'w', encoding='utf-8') as f:
        # Convert Counter objects to regular dicts for JSON serialization
        serializable_analysis = {
            'word_freq': analysis['word_freq'],
            'bigram_freq': [{'bigram': ' '.join(bg[0]), 'count': bg[1]} for bg in analysis['bigram_freq']],
            'trigram_freq': [{'trigram': ' '.join(tg[0]), 'count': tg[1]} for tg in analysis['trigram_freq']],
            'total_texts': analysis['total_texts'],
            'sample_texts': analysis['sample_texts']
        }
        json.dump(serializable_analysis, f, indent=2, ensure_ascii=False)
    
    print(f"Analysis saved to {analysis_file}")
    print("Dataset analysis complete!")

if __name__ == "__main__":
    main()