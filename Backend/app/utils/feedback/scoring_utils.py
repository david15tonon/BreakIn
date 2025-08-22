"""Utility functions for scoring and statistics."""

from typing import Dict, List, Optional, Union
import numpy as np
from scipy import stats

def calculate_normalized_score(raw_score: float, 
                            population_mean: float,
                            population_std: float,
                            min_score: float = 0,
                            max_score: float = 100) -> float:
    """Calculate normalized score using z-score and min-max scaling.
    
    Args:
        raw_score: The raw score to normalize
        population_mean: Mean of the population
        population_std: Standard deviation of the population
        min_score: Minimum score in output range (default 0)
        max_score: Maximum score in output range (default 100)
        
    Returns:
        float: Normalized score between min_score and max_score
    """
    if population_std == 0:
        return raw_score
        
    # Calculate z-score
    z_score = (raw_score - population_mean) / population_std
    
    # Convert to 0-1 range using sigmoid function
    normalized = 1 / (1 + np.exp(-z_score))
    
    # Scale to desired range
    return normalized * (max_score - min_score) + min_score

def calculate_weighted_average(scores: Dict[str, float],
                            weights: Dict[str, float]) -> float:
    """Calculate weighted average of scores.
    
    Args:
        scores: Dict mapping components to scores
        weights: Dict mapping components to weights
        
    Returns:
        float: Weighted average score
    """
    if not scores or not weights:
        return 0.0
        
    weighted_sum = sum(
        scores.get(component, 0) * weight
        for component, weight in weights.items()
    )
    
    total_weight = sum(weights.values())
    
    if total_weight == 0:
        return 0.0
        
    return weighted_sum / total_weight

def calculate_trimmed_mean(scores: List[float],
                         trim_percent: float = 10.0) -> float:
    """Calculate trimmed mean by removing extreme values.
    
    Args:
        scores: List of scores
        trim_percent: Percentage to trim from each end (default 10%)
        
    Returns:
        float: Trimmed mean score
    """
    if not scores:
        return 0.0
        
    return stats.trim_mean(scores, trim_percent/100)

def detect_outliers(scores: List[float],
                   threshold: float = 2.0) -> List[int]:
    """Detect outlier scores using z-score method.
    
    Args:
        scores: List of scores
        threshold: Z-score threshold for outliers (default 2.0)
        
    Returns:
        List of indices of outlier scores
    """
    if not scores:
        return []
        
    z_scores = np.abs(stats.zscore(scores))
    return [i for i, z in enumerate(z_scores) if z > threshold]

def calculate_agreement_metrics(scores: List[Dict[str, float]]) -> Dict[str, float]:
    """Calculate inter-rater agreement metrics.
    
    Args:
        scores: List of score dicts from different reviewers
        
    Returns:
        Dict with agreement metrics
    """
    if not scores:
        return {}
        
    # Get all components
    components = set().union(*(s.keys() for s in scores))
    
    results = {}
    for component in components:
        component_scores = [s.get(component) for s in scores if component in s]
        if len(component_scores) > 1:
            # Calculate various agreement metrics
            results[f"{component}_std"] = np.std(component_scores)
            results[f"{component}_range"] = max(component_scores) - min(component_scores)
            results[f"{component}_icc"] = calculate_icc(component_scores)
            
    # Calculate overall agreement
    results["overall_agreement"] = np.mean([
        v for k, v in results.items() if k.endswith("_icc")
    ])
    
    return results

def calculate_icc(scores: List[float]) -> float:
    """Calculate Intraclass Correlation Coefficient.
    
    This is a simplified version - production code would use
    a proper ICC implementation from a statistical package.
    
    Args:
        scores: List of scores from different raters
        
    Returns:
        float: ICC value between 0 and 1
    """
    if len(scores) < 2:
        return 1.0
        
    # Simplified ICC calculation
    mean = np.mean(scores)
    total_variance = np.var(scores)
    if total_variance == 0:
        return 1.0
        
    within_variance = np.mean([
        (score - mean) ** 2 
        for score in scores
    ])
    
    icc = 1 - (within_variance / total_variance)
    return max(0.0, min(1.0, icc))

def bootstrap_confidence_interval(scores: List[float],
                               n_resamples: int = 1000,
                               confidence: float = 0.95) -> tuple:
    """Calculate bootstrap confidence interval for mean score.
    
    Args:
        scores: List of scores
        n_resamples: Number of bootstrap resamples
        confidence: Confidence level (default 0.95 for 95% CI)
        
    Returns:
        Tuple of (lower bound, upper bound)
    """
    if not scores:
        return (0.0, 0.0)
        
    resampled_means = []
    for _ in range(n_resamples):
        sample = np.random.choice(scores, size=len(scores), replace=True)
        resampled_means.append(np.mean(sample))
        
    lower = np.percentile(resampled_means, (1 - confidence) * 100 / 2)
    upper = np.percentile(resampled_means, (1 + confidence) * 100 / 2)
    
    return (lower, upper)
