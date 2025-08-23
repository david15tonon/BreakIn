"""Feature extraction and processing utilities."""
from typing import List, Set, Dict, Optional
import numpy as np
from collections import Counter

def extract_key_terms(text: str,
                     stop_words: Optional[Set[str]] = None,
                     max_terms: int = 10) -> List[str]:
    """Extract key terms from text using TF-IDF scoring.
    
    Args:
        text: Input text
        stop_words: Set of words to filter out
        max_terms: Maximum number of terms to return
        
    Returns:
        List of key terms
    """
    if not text:
        return []
        
    # Normalize and tokenize
    words = text.lower().split()
    
    if stop_words:
        words = [w for w in words if w not in stop_words]
        
    # Get term frequencies
    word_freq = Counter(words)
    
    # Get unique terms by frequency
    terms = sorted(word_freq.items(),
                  key=lambda x: x[1],
                  reverse=True)
                  
    return [term for term, _ in terms[:max_terms]]

def get_weighted_terms(terms: List[str],
                      weights: Optional[Dict[str, float]] = None) -> Dict[str, float]:
    """Apply weights to terms.
    
    Args:
        terms: List of terms
        weights: Optional term weight mapping
        
    Returns:
        Dict mapping terms to weights
    """
    if not terms:
        return {}
        
    if not weights:
        # Equal weights if not specified
        weight = 1.0 / len(terms)
        return {term: weight for term in terms}
        
    # Get weights, default to min weight
    min_weight = min(weights.values())
    weighted = {
        term: weights.get(term, min_weight)
        for term in terms
    }
    
    # Normalize
    total = sum(weighted.values())
    return {
        term: weight/total
        for term, weight in weighted.items()
    }

def get_concept_vector(text: str,
                      concept_map: Dict[str, List[float]],
                      stop_words: Optional[Set[str]] = None) -> List[float]:
    """Convert text to concept vector using pretrained embeddings.
    
    Args:
        text: Input text
        concept_map: Mapping from terms to vectors 
        stop_words: Optional stop words to filter
        
    Returns:
        Concept vector for text
    """
    if not text or not concept_map:
        return []
        
    # Get terms
    terms = extract_key_terms(text,
                            stop_words=stop_words)
                            
    # Get vectors for terms
    vectors = []
    for term in terms:
        if term in concept_map:
            vectors.append(concept_map[term])
            
    if not vectors:
        return []
        
    # Average vectors
    return list(np.mean(vectors, axis=0))

def get_numeric_features(profile: Dict) -> Dict[str, float]:
    """Extract numeric features from profile.
    
    Args:
        profile: User/company profile dict
        
    Returns:
        Dict of numeric features
    """
    features = {}
    
    # Experience years
    if "experience_years" in profile:
        features["experience"] = min(profile["experience_years"] / 10.0, 1.0)
        
    # Team size
    if "team_size" in profile:
        size = profile["team_size"]
        features["team_size"] = min(np.log2(size)/8, 1.0)
        
    # Activity level 
    if "activity_score" in profile:
        features["activity"] = min(profile["activity_score"] / 100.0, 1.0)
        
    # Responsiveness
    if "response_rate" in profile:
        features["responsiveness"] = profile["response_rate"]
        
    return features

def aggregate_features(features: List[Dict[str, float]],
                      weights: Optional[Dict[str, float]] = None) -> float:
    """Aggregate feature dict list into single score.
    
    Args:
        features: List of feature dicts
        weights: Optional feature weights
        
    Returns:
        Aggregate score between 0 and 1
    """
    if not features:
        return 0.0
        
    # Get all feature names
    all_features = set()
    for f in features:
        all_features.update(f.keys())
        
    if not weights:
        # Equal weights
        weights = {f: 1.0/len(all_features)
                  for f in all_features}
                  
    # Sum weighted features
    score = 0.0
    for fname in all_features:
        weight = weights.get(fname, 0.0)
        values = [f.get(fname, 0.0) for f in features]
        score += weight * np.mean(values)
        
    return min(score, 1.0)
