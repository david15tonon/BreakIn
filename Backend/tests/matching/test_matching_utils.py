"""Test utilities for matching."""
from typing import List, Dict, Optional
import numpy as np
from datetime import datetime, timedelta
import pytest

from app.utils.matching.similarity_utils import (
    compute_skill_overlap,
    compute_culture_match,
    compute_vector_similarity,
    get_sector_alignment,
    compute_timezone_overlap,
    weight_by_recency,
    get_similarity_threshold
)

from app.utils.matching.feature_utils import (
    extract_key_terms,
    get_weighted_terms,
    get_concept_vector,
    get_numeric_features,
    aggregate_features
)

from app.utils.matching.fairness_utils import (
    compute_representation_ratio,
    get_attribute_distribution,
    compute_demographic_parity,
    get_group_representation,
    normalize_scores
)

def test_skill_overlap():
    """Test skill overlap computation."""
    skills1 = {"python", "java", "sql"}
    skills2 = {"python", "sql", "javascript"}
    
    overlap = compute_skill_overlap(skills1, skills2)
    assert overlap == 2/4  # 2 common out of 4 unique
    
    # Empty sets
    assert compute_skill_overlap(set(), skills1) == 0.0
    assert compute_skill_overlap(skills1, set()) == 0.0
    
def test_culture_match():
    """Test culture tag matching."""
    tags1 = ["agile", "remote", "startup"]
    tags2 = ["remote", "startup", "fast-paced"]
    
    match = compute_culture_match(tags1, tags2)
    assert match == 2/3  # 2 matches out of min(3,3)
    
    # Empty lists
    assert compute_culture_match([], tags1) == 0.0
    assert compute_culture_match(tags1, []) == 0.0
    
def test_vector_similarity():
    """Test vector similarity computation."""
    vec1 = [1.0, 0.5, 0.0]
    vec2 = [0.5, 1.0, 0.0]
    
    sim = compute_vector_similarity(vec1, vec2)
    assert 0.0 <= sim <= 1.0
    
    # Test invalid inputs
    with pytest.raises(ValueError):
        compute_vector_similarity(vec1, [1.0])
        
    # Zero vectors
    assert compute_vector_similarity([0,0], [0,0]) == 0.0
    
def test_sector_alignment():
    """Test sector alignment scoring."""
    score0 = get_sector_alignment(0)
    score3 = get_sector_alignment(3)
    
    assert 0.0 <= score0 <= score3 <= 1.0
    
def test_timezone_overlap():
    """Test timezone overlap calculation."""
    # Same timezone
    assert compute_timezone_overlap("+00:00", "+00:00") == 1.0
    
    # No overlap - 12 hour difference
    assert compute_timezone_overlap("+00:00", "+12:00") == 0.0
    
    # Partial overlap
    overlap = compute_timezone_overlap("+01:00", "+03:00")
    assert 0.0 < overlap < 1.0
    
def test_recency_weighting():
    """Test recency-based score weighting."""
    now = datetime.utcnow()
    week_ago = now - timedelta(days=7)
    month_ago = now - timedelta(days=30)
    
    scores = [0.8, 0.9, 0.7]
    times = [now, week_ago, month_ago]
    
    weighted = weight_by_recency(scores, times)
    assert 0.7 <= weighted <= 0.9
    
    # Empty inputs
    assert weight_by_recency([], []) == 0.0
    
def test_similarity_thresholds():
    """Test similarity threshold retrieval."""
    assert 0.0 <= get_similarity_threshold("must_have_skills") <= 1.0
    assert get_similarity_threshold("unknown") == 0.5  # Default
    
def test_key_term_extraction():
    """Test key term extraction."""
    text = "python developer with machine learning experience"
    stop_words = {"with"}
    
    terms = extract_key_terms(text, stop_words)
    assert isinstance(terms, list)
    assert all(isinstance(t, str) for t in terms)
    assert "with" not in terms
    
    # Empty text
    assert extract_key_terms("") == []
    
def test_weighted_terms():
    """Test term weighting."""
    terms = ["python", "java", "sql"]
    weights = {"python": 0.5, "java": 0.3}
    
    weighted = get_weighted_terms(terms, weights)
    assert sum(weighted.values()) == pytest.approx(1.0)
    assert weighted["python"] > weighted["sql"]
    
    # No weights provided
    equal = get_weighted_terms(terms)
    assert all(v == 1.0/len(terms) for v in equal.values())
    
def test_concept_vectors():
    """Test concept vector generation."""
    concept_map = {
        "python": [1.0, 0.0],
        "java": [0.0, 1.0]
    }
    
    vec = get_concept_vector("python java code", concept_map)
    assert len(vec) == 2
    assert all(0.0 <= v <= 1.0 for v in vec)
    
    # Unknown terms
    assert get_concept_vector("unknown", concept_map) == []
    
def test_numeric_features():
    """Test numeric feature extraction."""
    profile = {
        "experience_years": 5,
        "team_size": 10,
        "activity_score": 80
    }
    
    features = get_numeric_features(profile)
    assert all(0.0 <= v <= 1.0 for v in features.values())
    
    # Empty profile
    assert get_numeric_features({}) == {}
    
def test_feature_aggregation():
    """Test feature aggregation."""
    features = [
        {"skill": 0.8, "exp": 0.6},
        {"skill": 0.7, "culture": 0.9}
    ]
    
    weights = {"skill": 0.5, "exp": 0.3, "culture": 0.2}
    
    score = aggregate_features(features, weights)
    assert 0.0 <= score <= 1.0
    
    # Equal weights
    equal = aggregate_features(features)
    assert 0.0 <= equal <= 1.0
