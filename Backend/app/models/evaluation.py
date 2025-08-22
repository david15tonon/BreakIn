from pydantic import BaseModel
from typing import List, Dict, Optional
from datetime import datetime

class FeatureProgress(BaseModel):
    name: str
    progress: float
    tasks: int
    done: int
    on_time: bool

class MentorFeedback(BaseModel):
    technical_strength: float
    collaboration: float
    originality: float
    growth_suggestions: str

class AIEvaluation(BaseModel):
    maintainability_index: float
    refactor_acceptance_rate: float
    bugs_detected: int
    regressions: int

class DeveloperMetrics(BaseModel):
    name: str
    pseudonym: str
    experience_level: str
    skills: List[str]
    role: str
    commits: int
    prs_opened: int
    prs_merged: int
    bugs_fixed: int
    bugs_reported: int
    coverage: float
    lines_of_code: int
    status_log: Dict[str, int]
    reviews_given: int
    reviews_received: int
    notes_activity: int
    creativity_points: int
    mentor_feedback: MentorFeedback
    ai_evaluation: AIEvaluation

class TeamEvaluationRequest(BaseModel):
    team: str
    sprint_id: str
    features: List[FeatureProgress]
    developers: List[DeveloperMetrics]
    sprint_duration: int
    total_tasks: int
    completed_tasks: int

class IndividualScore(BaseModel):
    name: str
    pseudonym: str
    score: int
    breakdown: Dict[str, int]
    strengths: List[str]
    growth_suggestions: List[str]

class TeamEvaluationResponse(BaseModel):
    team_score: int
    team_breakdown: Dict[str, int]
    individual_scores: List[IndividualScore]
    recommendations: List[str]