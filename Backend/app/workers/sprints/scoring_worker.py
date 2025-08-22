"""Celery worker for submission scoring."""
from datetime import datetime
from typing import Dict, Optional
from celery import Celery

from app.config import Settings
from app.services.sprints.submission_service import SubmissionService
from app.services.gpt import get_ai_review

settings = Settings()
celery = Celery("scoring_worker",
                broker=settings.CELERY_BROKER_URL,
                backend=settings.CELERY_RESULT_BACKEND)

@celery.task(name="score_submission", max_retries=3)
async def score_submission(submission_id: str) -> Dict:
    """Score a submission using AI review and testing.
    
    Args:
        submission_id: The ID of the submission to score
        
    Returns:
        Dict containing the scores and aggregated score
    """
    submission_service = SubmissionService()
    submission = await submission_service.get_submission(submission_id)
    
    if not submission:
        return {
            "error": "Submission not found",
            "submission_id": submission_id
        }
    
    try:
        # Run AI code review
        ai_review = await get_ai_review(submission["repository_url"])
        
        # Run test suite
        test_results = await run_test_suite(submission)
        
        # Calculate scores
        scores = calculate_scores(ai_review, test_results)
        
        # Update submission
        result = await submission_service.update_submission_score(
            submission_id,
            {
                "scores": scores,
                "aggregated_score": calculate_aggregated_score(scores),
                "scored_at": datetime.utcnow()
            }
        )
        
        return result
        
    except Exception as e:
        celery.current_task.retry(exc=e, countdown=60)
        return {
            "error": str(e),
            "submission_id": submission_id
        }

def calculate_scores(ai_review: Dict, test_results: Dict) -> Dict:
    """Calculate submission scores."""
    return {
        "code_quality": calculate_code_quality_score(ai_review),
        "design": calculate_design_score(ai_review),
        "testing": calculate_testing_score(test_results),
        "documentation": calculate_documentation_score(ai_review),
        "innovation": calculate_innovation_score(ai_review),
        "teamwork": calculate_teamwork_score(ai_review),
        "presentation": calculate_presentation_score(ai_review)
    }

def calculate_aggregated_score(scores: Dict) -> float:
    """Calculate aggregated score with weights."""
    weights = {
        "code_quality": 0.25,
        "design": 0.20,
        "testing": 0.15,
        "documentation": 0.10,
        "innovation": 0.10,
        "teamwork": 0.10,
        "presentation": 0.10
    }
    
    return sum(
        scores[key] * weights[key]
        for key in weights
    )

async def run_test_suite(submission: Dict) -> Dict:
    """Run tests in a sandboxed environment.
    
    Args:
        submission: The submission to test
        
    Returns:
        Dict containing test results
    """
    # Placeholder implementation
    return {
        "passed": 10,
        "failed": 2,
        "skipped": 0,
        "coverage": 85.5,
        "execution_time": 12.3
    }

def calculate_code_quality_score(ai_review: Dict) -> float:
    """Calculate code quality score based on AI review metrics.
    
    Args:
        ai_review: Results from AI code review
        
    Returns:
        float: Score between 0 and 100
    """
    metrics = {
        "complexity": ai_review.get("complexity", 0),
        "maintainability": ai_review.get("maintainability", 0),
        "duplication": ai_review.get("duplication", 0),
        "style_adherence": ai_review.get("style_adherence", 0)
    }
    
    weights = {
        "complexity": 0.3,
        "maintainability": 0.3,
        "duplication": 0.2,
        "style_adherence": 0.2
    }
    
    return sum(
        metrics[key] * weights[key]
        for key in weights
    )

def calculate_design_score(ai_review: Dict) -> float:
    """Calculate design score based on architecture and patterns.
    
    Args:
        ai_review: Results from AI code review
        
    Returns:
        float: Score between 0 and 100
    """
    metrics = {
        "architecture": ai_review.get("architecture", 0),
        "patterns": ai_review.get("patterns", 0),
        "modularity": ai_review.get("modularity", 0),
        "cohesion": ai_review.get("cohesion", 0)
    }
    
    weights = {
        "architecture": 0.3,
        "patterns": 0.2,
        "modularity": 0.3,
        "cohesion": 0.2
    }
    
    return sum(
        metrics[key] * weights[key]
        for key in weights
    )

def calculate_testing_score(test_results: Dict) -> float:
    """Calculate testing score based on test coverage and results.
    
    Args:
        test_results: Results from test suite execution
        
    Returns:
        float: Score between 0 and 100
    """
    total_tests = test_results.get("passed", 0) + test_results.get("failed", 0)
    if total_tests == 0:
        return 0.0
        
    pass_rate = test_results.get("passed", 0) / total_tests
    coverage = test_results.get("coverage", 0) / 100.0
    
    return (pass_rate * 0.6 + coverage * 0.4) * 100

def calculate_documentation_score(ai_review: Dict) -> float:
    """Calculate documentation score based on completeness and quality.
    
    Args:
        ai_review: Results from AI code review
        
    Returns:
        float: Score between 0 and 100
    """
    metrics = {
        "completeness": ai_review.get("doc_completeness", 0),
        "quality": ai_review.get("doc_quality", 0),
        "api_docs": ai_review.get("api_docs", 0),
        "examples": ai_review.get("examples", 0)
    }
    
    weights = {
        "completeness": 0.3,
        "quality": 0.3,
        "api_docs": 0.2,
        "examples": 0.2
    }
    
    return sum(
        metrics[key] * weights[key]
        for key in weights
    )

def calculate_innovation_score(ai_review: Dict) -> float:
    """Calculate innovation score based on novelty and creativity.
    
    Args:
        ai_review: Results from AI code review
        
    Returns:
        float: Score between 0 and 100
    """
    metrics = {
        "novelty": ai_review.get("novelty", 0),
        "creativity": ai_review.get("creativity", 0),
        "problem_solving": ai_review.get("problem_solving", 0),
        "tech_stack": ai_review.get("tech_stack", 0)
    }
    
    weights = {
        "novelty": 0.3,
        "creativity": 0.3,
        "problem_solving": 0.2,
        "tech_stack": 0.2
    }
    
    return sum(
        metrics[key] * weights[key]
        for key in weights
    )

def calculate_teamwork_score(ai_review: Dict) -> float:
    """Calculate teamwork score based on collaboration metrics.
    
    Args:
        ai_review: Results from AI code review
        
    Returns:
        float: Score between 0 and 100
    """
    metrics = {
        "collaboration": ai_review.get("collaboration", 0),
        "communication": ai_review.get("communication", 0),
        "contribution": ai_review.get("contribution", 0),
        "code_review": ai_review.get("code_review", 0)
    }
    
    weights = {
        "collaboration": 0.3,
        "communication": 0.2,
        "contribution": 0.3,
        "code_review": 0.2
    }
    
    return sum(
        metrics[key] * weights[key]
        for key in weights
    )

def calculate_presentation_score(ai_review: Dict) -> float:
    """Calculate presentation score based on project presentation.
    
    Args:
        ai_review: Results from AI code review
        
    Returns:
        float: Score between 0 and 100
    """
    metrics = {
        "clarity": ai_review.get("clarity", 0),
        "organization": ai_review.get("organization", 0),
        "visuals": ai_review.get("visuals", 0),
        "demo": ai_review.get("demo", 0)
    }
    
    weights = {
        "clarity": 0.3,
        "organization": 0.2,
        "visuals": 0.2,
        "demo": 0.3
    }
    
    return sum(
        metrics[key] * weights[key]
        for key in weights
    )
