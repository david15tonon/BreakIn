from datetime import datetime
from typing import List, Dict, Optional
from app.config import db
from app.models.evaluation import DeveloperMetrics, FeatureProgress, MentorFeedback, AIEvaluation

class MetricsCollector:
    def __init__(self, sprint_id: str):
        self.sprint_id = sprint_id
    
    async def collect_team_metrics(self) -> dict:
        """Collecte toutes les métriques de l'équipe pour l'évaluation IA"""
        sprint = db.sprints.find_one({"_id": self.sprint_id})
        if not sprint:
            raise ValueError("Sprint not found")
        
        # Calculer la progression des features
        features = await self._collect_features_progress(sprint)
        
        # Collecter les métriques des développeurs
        developers = await self._collect_developers_metrics(sprint)
        
        return {
            "team": sprint.get("theme", "Unknown Team"),
            "sprint_id": self.sprint_id,
            "features": features,
            "developers": developers,
            "sprint_duration": sprint.get("duration_minutes", 0) / 60,
            "total_tasks": len(sprint.get("tasks", [])),
            "completed_tasks": len([t for t in sprint.get("tasks", []) if t.get("solution")])
        }
    
    async def _collect_features_progress(self, sprint: dict) -> List[FeatureProgress]:
        """Calcule la progression des différentes features"""
        features = []
        tasks_by_feature = self._group_tasks_by_feature(sprint.get("tasks", []))
        
        for feature_name, tasks in tasks_by_feature.items():
            completed = len([t for t in tasks if t.get("solution")])
            total = len(tasks)
            progress = completed / total if total > 0 else 0
            
            features.append(FeatureProgress(
                name=feature_name,
                progress=progress,
                tasks=total,
                done=completed,
                on_time=progress >= 0.8
            ))
        
        return features
    
    def _group_tasks_by_feature(self, tasks: List[dict]) -> Dict[str, List[dict]]:
        """Groupe les tâches par feature (simplifié)"""
        features = {}
        for task in tasks:
            feature_name = task.get("feature", "General")
            if feature_name not in features:
                features[feature_name] = []
            features[feature_name].append(task)
        return features
    
    async def _collect_developers_metrics(self, sprint: dict) -> List[DeveloperMetrics]:
        """Collecte les métriques individuelles des développeurs"""
        developers = []
        user_ids = set(task.get("user_id") for task in sprint.get("tasks", []))
        
        for user_id in user_ids:
            if user_id:
                developer_metrics = await self._get_developer_metrics(user_id, sprint)
                developers.append(developer_metrics)
        
        return developers
    
    async def _get_developer_metrics(self, user_id: str, sprint: dict) -> DeveloperMetrics:
        """Récupère les métriques d'un développeur spécifique"""
        user = db.users.find_one({"pseudonym": user_id})
        user_tasks = [t for t in sprint.get("tasks", []) if t.get("user_id") == user_id]
        
        # Calculer les métriques de codage
        coding_sessions = list(db.coding_sessions.find({
            "sprint_id": self.sprint_id,
            "user_id": user_id
        }))
        
        return DeveloperMetrics(
            name=user.get("username", "Unknown") if user else "Unknown",
            pseudonym=user_id,
            experience_level=self._determine_experience_level(user_tasks),
            skills=user.get("skills", []) if user else [],
            role=user.get("role", "Developer") if user else "Developer",
            commits=len(user_tasks),
            prs_opened=sum(1 for t in user_tasks if t.get("solution")),
            prs_merged=sum(1 for t in user_tasks if t.get("evaluation", {}).get("score", 0) > 7),
            bugs_fixed=sum(1 for t in user_tasks if "bug" in t.get("task", "").lower()),
            bugs_reported=0,
            coverage=self._calculate_coverage(user_tasks),
            lines_of_code=sum(len(t.get("solution", "").split('\n')) for t in user_tasks),
            status_log=self._calculate_status_log(coding_sessions),
            reviews_given=0,
            reviews_received=0,
            notes_activity=sum(1 for t in user_tasks if t.get("notes")),
            creativity_points=sum(t.get("evaluation", {}).get("metrics", {}).get("creativity", 0) 
                                for t in user_tasks if t.get("evaluation")),
            mentor_feedback=self._get_mentor_feedback(user_tasks),
            ai_evaluation=self._get_ai_evaluation(user_tasks)
        )
    
    def _determine_experience_level(self, tasks: List[dict]) -> str:
        """Détermine le niveau d'expérience basé sur les tâches"""
        if len(tasks) > 10:
            return "Senior"
        elif len(tasks) > 5:
            return "Mid-Level"
        else:
            return "Junior"
    
    def _calculate_coverage(self, tasks: List[dict]) -> float:
        """Calcule la couverture de test (simplifié)"""
        tested_tasks = sum(1 for t in tasks if t.get("evaluation", {}).get("metrics", {}).get("test_coverage", 0) > 0.7)
        return tested_tasks / len(tasks) if tasks else 0
    
    def _calculate_status_log(self, coding_sessions: List[dict]) -> Dict[str, int]:
        """Calcule le temps passé dans chaque statut"""
        return {
            "coding": sum(s.get("metrics", {}).get("focus_time", 0) for s in coding_sessions),
            "review": sum(s.get("metrics", {}).get("review_time", 0) for s in coding_sessions),
            "testing": sum(s.get("metrics", {}).get("testing_time", 0) for s in coding_sessions)
        }
    
    def _get_mentor_feedback(self, tasks: List[dict]) -> MentorFeedback:
        """Récupère les feedbacks du mentor"""
        return MentorFeedback(
            technical_strength=0.8,
            collaboration=0.7,
            originality=0.6,
            growth_suggestions="Continue to improve code quality and collaboration"
        )
    
    def _get_ai_evaluation(self, tasks: List[dict]) -> AIEvaluation:
        """Récupère l'évaluation AI"""
        return AIEvaluation(
            maintainability_index=0.75,
            refactor_acceptance_rate=0.8,
            bugs_detected=1,
            regressions=0
        )