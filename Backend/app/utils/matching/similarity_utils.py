"""Similarity computation utilities."""
from typing import List, Set, Dict
import numpy as np
from datetime import datetime, timedelta

def compute_skill_overlap(skills1: Set[str], skills2: Set[str]) -> float:
    """Compute Jaccard similarity between skill sets.
    
    Args:
        skills1: First set of skills
        skills2: Second set of skills
        
    Returns:
        Similarity score between 0 and 1
    """
    if not skills1 or not skills2:
        return 0.0
        
    intersection = len(skills1.intersection(skills2))
    union = len(skills1.union(skills2))
    
    return intersection / union

def compute_culture_match(tags1: List[str], tags2: List[str]) -> float:
    """Compute culture tag overlap.
    
    Args:
        tags1: First set of tags
        tags2: Second set of tags
        
    Returns:
        Match score between 0 and 1
    """
    if not tags1 or not tags2:
        return 0.0
        
    set1 = set(tags1)
    set2 = set(tags2)
    
    intersection = len(set1.intersection(set2))
    total = min(len(set1), len(set2))
    
    return intersection / total

def compute_vector_similarity(vec1: List[float], vec2: List[float]) -> float:
    """Compute cosine similarity between vectors.
    
    Args:
        vec1: First vector
        vec2: Second vector
        
    Returns:
        Similarity score between 0 and 1
    """
    if len(vec1) != len(vec2):
        raise ValueError("Vectors must have same length")
        
    # Convert to numpy arrays
    a = np.array(vec1)
    b = np.array(vec2)
    
    # Handle zero vectors
    if not np.any(a) or not np.any(b):
        return 0.0
        
    return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))

def get_sector_alignment(sector_sprints: int) -> float:
    """Convert sector sprint count to alignment score.
    
    Args:
        sector_sprints: Number of sprints in sector
        
    Returns:
        Alignment score between 0 and 1
    """
    # Sigmoid function to map count to 0-1 score
    return 2 / (1 + np.exp(-sector_sprints/2)) - 1

def compute_timezone_overlap(tz1: str, tz2: str) -> float:
    """Compute timezone overlap ratio.
    
    Args:
        tz1: First timezone (e.g., "+03:00")
        tz2: Second timezone
        
    Returns:
        Overlap ratio between 0 and 1
    """
    # Convert to hours
    h1 = float(tz1.replace("+", ""))
    h2 = float(tz2.replace("+", ""))
    
    # Assume 8-hour workday
    diff = abs(h1 - h2)
    if diff > 12:
        diff = 24 - diff
        
    overlap = max(0, 8 - diff)
    return overlap / 8

def weight_by_recency(scores: List[float],
                     timestamps: List[datetime],
                     half_life_days: int = 90) -> float:
    """Weight scores by recency using exponential decay.
    
    Args:
        scores: List of scores
        timestamps: List of timestamps
        half_life_days: Days for score to halve
        
    Returns:
        Weighted average score
    """
    if not scores:
        return 0.0
        
    now = datetime.utcnow()
    weights = []
    
    for ts in timestamps:
        days = (now - ts).days
        weight = np.exp(-days * np.log(2)/half_life_days)
        weights.append(weight)
        
    # Normalize weights
    weights = np.array(weights)
    weights = weights / np.sum(weights)
    
    return float(np.average(scores, weights=weights))

def get_similarity_threshold(context: str) -> float:
    """Get similarity threshold based on context.
    
    Args:
        context: Type of similarity comparison
        
    Returns:
        Threshold value between 0 and 1
    """
    thresholds = {
        "must_have_skills": 0.8,
        "nice_to_have_skills": 0.6,
        "culture_tags": 0.5,
        "sector_match": 0.3,
        "timezone_overlap": 0.25
    }
    return thresholds.get(context, 0.5)
