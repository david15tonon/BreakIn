"""Fairness utilities for matching."""
from typing import List, Dict, Set, Optional
import numpy as np
from datetime import datetime, timedelta

def compute_representation_ratio(group: List[Dict],
                               attribute: str,
                               value: str) -> float:
    """Compute representation ratio for an attribute value.
    
    Args:
        group: List of profiles 
        attribute: Attribute to check
        value: Target value
        
    Returns:
        Ratio between 0 and 1
    """
    if not group:
        return 0.0
        
    count = sum(1 for p in group 
               if p.get(attribute) == value)
               
    return count / len(group)

def get_attribute_distribution(group: List[Dict],
                             attribute: str) -> Dict[str, float]:
    """Get distribution of values for an attribute.
    
    Args:
        group: List of profiles
        attribute: Attribute to analyze
        
    Returns:
        Dict mapping values to frequencies
    """
    if not group:
        return {}
        
    values = [p.get(attribute) for p in group]
    total = len(values)
    
    counts = {}
    for val in values:
        if val is not None:
            counts[val] = counts.get(val, 0) + 1
            
    return {
        val: count/total
        for val, count in counts.items()
    }

def compute_demographic_parity(scores: Dict[str, List[float]],
                             min_ratio: float = 0.8) -> bool:
    """Check if scores satisfy demographic parity.
    
    Args:
        scores: Dict mapping groups to score lists
        min_ratio: Minimum ratio between means
        
    Returns:
        True if parity satisfied
    """
    if not scores:
        return True
        
    means = {
        group: np.mean(group_scores)
        for group, group_scores in scores.items()
        if group_scores
    }
    
    if not means:
        return True
        
    min_mean = min(means.values())
    max_mean = max(means.values())
    
    if min_mean == 0:
        return False
        
    return (min_mean / max_mean) >= min_ratio

def get_group_representation(profiles: List[Dict],
                           attribute: str,
                           target_ratios: Dict[str, float],
                           tolerance: float = 0.1) -> Dict[str, float]:
    """Check group representation vs targets.
    
    Args:
        profiles: List of profiles
        attribute: Attribute to check  
        target_ratios: Target ratios per value
        tolerance: Acceptable deviation
        
    Returns:
        Dict with actual ratios
    """
    if not profiles or not target_ratios:
        return {}
        
    actual = get_attribute_distribution(profiles, attribute)
    
    deviations = {}
    for value, target in target_ratios.items():
        current = actual.get(value, 0.0)
        dev = abs(current - target)
        deviations[value] = dev
        
    return deviations

def normalize_scores(scores: List[float],
                    target_mean: float = 0.5,
                    target_std: float = 0.15) -> List[float]:
    """Normalize scores to target distribution.
    
    Args:
        scores: Raw scores
        target_mean: Desired mean
        target_std: Desired standard deviation
        
    Returns:
        Normalized scores
    """
    if not scores:
        return []
        
    scores = np.array(scores)
    
    # Get current stats
    curr_mean = np.mean(scores)
    curr_std = np.std(scores)
    
    if curr_std == 0:
        return [target_mean] * len(scores)
        
    # Normalize
    z_scores = (scores - curr_mean) / curr_std
    normalized = z_scores * target_std + target_mean
    
    # Clip to [0,1]
    return list(np.clip(normalized, 0, 1))
