"""
Nigerian Pidgin speech transcription processor.
Preserves authentic Pidgin speech without converting to standard English.
"""

import re
import json
from typing import Dict, List
from pathlib import Path


class PidginProcessor:
    """Processes transcribed text to preserve authentic Nigerian Pidgin."""
    
    def __init__(self):
        self.pidgin_indicators = self._load_pidgin_indicators()
        self.common_patterns = self._load_patterns()
        self.corrections = {
            "waiting": "wetin",
            "wala": "wahala",
            "wallah": "wahala",
            "shorty": "shotti",
            "shotty": "shotti",
            "surely": "shorle",
            "show": "sho",
            "damn": "dem",
            "them": "dem",
            "day": "dey",
            "de": "dey",
            "chow": "chop",
            "job": "chop",
            "sharp": "shap",
            "palava": "wahala",
            "plava": "wahala",
            "brother": "broda",
            "sister": "sista",
            "mother": "mama",
            "father": "papa",
            "oga": "oga",
            "guy": "guy",
            "no wah la": "no wahala",
            "wetting": "wetin",
            "gon": "go",
            "wan": "wan",
            "one": "wan",
            "naija": "naija",
            "want": "wan",
        }
    
    def _load_pidgin_indicators(self) -> set:
        """Load Nigerian Pidgin words to identify authentic Pidgin speech."""
        # Core Pidgin words from the dataset analysis
        pidgin_words = {
            'di', 'dey', 'wey', 'dem', 'na', 'wetin', 'fit', 'tok', 'say',
            'wen', 'make', 'no', 'don', 'get', 'dis', 'hin', 'am', 'pipo',
            'dia', 'com', 'im', 'oga', 'dat', 'afta', 'govnor', 'wan',
            'becos', 'buhari', 'pikin', 'hapun', 'tori', 'enta', 'comot',
            'bin', 'con', 'epp', 'tin', 'chop', 'waka', 'yarn', 'sabi',
            'oya', 'abeg', 'wahala', 'palava', 'katakata', 'gbege', 
            'shey', 'abi'
        }
        
        # Try to load additional indicators from dataset analysis
        indicators_path = Path(__file__).parent.parent.parent / "data" / "dataset_analysis.json"
        
        try:
            with open(indicators_path, 'r', encoding='utf-8') as f:
                analysis = json.load(f)
                # Add high-frequency words from dataset
                for word, freq in analysis.get('word_freq', []):
                    if freq > 50:  # High frequency threshold
                        pidgin_words.add(word)
                        
                print(f"✅ Loaded {len(pidgin_words)} Pidgin indicators")
                
        except FileNotFoundError:
            print("⚠️ Dataset analysis not found, using core Pidgin indicators")
            
        return pidgin_words
    
    def _load_patterns(self) -> List[tuple]:
        """Load common Nigerian Pidgin phrases to preserve authentic expressions."""
        return [
            # Common Pidgin phrases - preserve as-is, just normalize spelling
            (r'\bwetin be dis\b', 'wetin be dis'),
            (r'\bwetin dey happen\b', 'wetin dey happen'),
            (r'\bhow far\b', 'how far'),
            (r'\bno wahala\b', 'no wahala'),
            (r'\bi dey come\b', 'i dey come'),
            (r'\byou dey go\b', 'you dey go'),
            (r'\bwe dey here\b', 'we dey here'),
            (r'\bdem dey come\b', 'dem dey come'),
            (r'\bfit do am\b', 'fit do am'),
            (r'\bno fit do\b', 'no fit do'),
            (r'\bmake i tell you\b', 'make i tell you'),
            (r'\bmake we go\b', 'make we go'),
            (r'\bna so\b', 'na so'),
            (r'\bna true\b', 'na true'),
            (r'\bna lie\b', 'na lie'),
            (r'\bchop money\b', 'chop money'),
            (r'\bwaka pass\b', 'waka pass'),
            (r'\bcarry go\b', 'carry go'),
            (r'\bcomot for here\b', 'comot for here'),
            (r'\benter inside\b', 'enter inside'),
            (r'\bgive am\b', 'give am'),
            (r'\bshow me\b', 'show me'),
            (r'\btell am say\b', 'tell am say'),
            (r'\bno be so\b', 'no be so'),
            (r'\bna small thing\b', 'na small thing'),
            (r'\bwey dey\b', 'wey dey'),
            (r'\bfor where\b', 'for where'),
            (r'\bon top\b', 'on top'),
            (r'\bwell done\b', 'well done'),
        ]
    
    def process_text(self, text: str, preserve_pidgin: bool = True) -> str:
        """
        Process transcribed text to preserve authentic Nigerian Pidgin.
        
        Args:
            text: Raw transcribed text
            preserve_pidgin: Whether to preserve Pidgin expressions (default: True)
            
        Returns:
            Cleaned text preserving authentic Pidgin
        """
        if not text:
            return text
        
        # Clean and normalize text
        processed = self._clean_text(text)

        # Step 2: Apply word-level ASR corrections (e.g., 'chow' → 'chop')
        processed = self._apply_corrections(processed)
        
        # Apply Pidgin pattern normalization (not conversion)
        if preserve_pidgin:
            processed = self._normalize_pidgin_patterns(processed)
            processed = self._apply_pidgin_phrases(processed)
        
        # Final cleanup
        processed = self._final_cleanup(processed)
        
        return processed
    
    def _clean_text(self, text: str) -> str:
        """Clean and normalize the text."""
        # Convert to lowercase for processing
        text = text.lower().strip()
        
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text)
        
        # Fix common punctuation issues
        text = re.sub(r'\s+([,.!?])', r'\1', text)
        
        return text
    
    def _apply_patterns(self, text: str) -> str:
        """Apply pattern-based replacements."""
        for pattern, replacement in self.common_patterns:
            text = re.sub(pattern, replacement, text, flags=re.IGNORECASE)
        
        return text
    
    def _apply_corrections(self, text: str) -> str:
        """Apply word-level corrections."""
        words = text.split()
        corrected_words = []
        
        for word in words:
            # Remove punctuation for lookup, but preserve it
            clean_word = re.sub(r'[^\w]', '', word.lower())
            punctuation = re.sub(r'[\w]', '', word)
            
            # Apply correction if found
            if clean_word in self.corrections:
                corrected_word = self.corrections[clean_word] + punctuation
            else:
                corrected_word = word
            
            corrected_words.append(corrected_word)
        
        return ' '.join(corrected_words)
    
    def _final_cleanup(self, text: str) -> str:
        """Final text cleanup and formatting."""
        # Capitalize first letter
        if text:
            text = text[0].upper() + text[1:] if len(text) > 1 else text.upper()
        
        # Fix spacing around punctuation
        text = re.sub(r'\s+([,.!?])', r'\1', text)
        text = re.sub(r'([,.!?])\s*([a-zA-Z])', r'\1 \2', text)
        
        return text.strip()
    
    def _normalize_pidgin_patterns(self, text: str) -> str:
        """Normalize common Pidgin words to standard spellings."""
        # Fix common transcription errors for individual Pidgin words
        pidgin_normalizations = [
            # Single word normalizations
            (r'\bde\b', 'di'),       # "de" -> "di" (the)
            (r'\bdem\b', 'dem'),     # Keep "dem" as is  
            (r'\bdey\b', 'dey'),     # Keep "dey" as is
            (r'\bna\b', 'na'),       # Keep "na" as is
            (r'\bwetin\b', 'wetin'), # Keep "wetin" as is
            (r'\bfit\b', 'fit'),     # Keep "fit" as is
            (r'\bcomot\b', 'comot'), # Keep "comot" as is
            (r'\bchop\b', 'chop'),   # Keep "chop" as is
            (r'\bwaka\b', 'waka'),   # Keep "waka" as is
            (r'\bsabi\b', 'sabi'),   # Keep "sabi" as is
            (r'\boya\b', 'oya'),     # Keep "oya" as is
            (r'\babeg\b', 'abeg'),   # Keep "abeg" as is
            (r'\bwahala\b', 'wahala'), # Keep "wahala" as is
            (r'\bpikin\b', 'pikin'), # Keep "pikin" as is
            (r'\btori\b', 'tori'),   # Keep "tori" as is
            (r'\bhapun\b', 'hapun'), # Keep "hapun" as is
        ]
        
        for pattern, replacement in pidgin_normalizations:
            text = re.sub(pattern, replacement, text, flags=re.IGNORECASE)
        
        return text
    
    def _apply_pidgin_phrases(self, text: str) -> str:
        """Apply phrase-level Pidgin pattern preservation."""
        for pattern, replacement in self.common_patterns:
            text = re.sub(pattern, replacement, text, flags=re.IGNORECASE)
        
        return text
    
    def get_pidgin_confidence(self, text: str) -> float:
        """
        Estimate confidence that the text contains Nigerian Pidgin.
        Returns a score between 0 and 1.
        """
        if not text:
            return 0.0
        
        words = text.lower().split()
        pidgin_words = 0
        
        for word in words:
            clean_word = re.sub(r'[^\w]', '', word)
            if clean_word in self.pidgin_indicators:
                pidgin_words += 1
        
        # Check for common patterns
        pattern_matches = 0
        for pattern, _ in self.common_patterns:
            if re.search(pattern, text, re.IGNORECASE):
                pattern_matches += 1
        
        # Calculate confidence score
        if len(words) == 0:
            return 0.0
        
        word_score = pidgin_words / len(words)
        pattern_score = min(pattern_matches / len(self.common_patterns), 1.0)
        
        # Weighted combination
        confidence = (word_score * 0.7) + (pattern_score * 0.3)
        
        return min(confidence, 1.0)