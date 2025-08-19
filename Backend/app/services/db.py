

import logging
from typing import Dict, List, Optional, Any
from pymongo.collection import Collection
from pymongo.errors import DuplicateKeyError, PyMongoError
from bson import ObjectId
from datetime import datetime

from app.config import get_database

logger = logging.getLogger(__name__)

class DatabaseService:
    """
    Service centralisé pour toutes les opérations MongoDB
    """
    
    def __init__(self):
        self.db = get_database()
        if self.db is None:
            raise RuntimeError("❌ Impossible de se connecter à la base de données MongoDB")
    
    @property
    def users(self) -> Collection:
        """Collection des utilisateurs"""
        return self.db.users
    
    @property
    def sprints(self) -> Collection:
        """Collection des sprints"""
        return self.db.sprints
    
    @property
    def feedback(self) -> Collection:
        """Collection des feedbacks"""
        return self.db.feedback
    
    @property
    def scores(self) -> Collection:
        """Collection des scores"""
        return self.db.scores
    
    # === UTILISATEURS ===
    
    def create_user(self, user_data: Dict) -> Optional[str]:
        """
        Créer un nouvel utilisateur avec pseudonyme
        """
        try:
            user_data["created_at"] = datetime.utcnow()
            user_data["updated_at"] = datetime.utcnow()
            
            result = self.users.insert_one(user_data)
            logger.info(f"✅ Utilisateur créé: {result.inserted_id}")
            return str(result.inserted_id)
            
        except DuplicateKeyError:
            logger.error("❌ Utilisateur déjà existant")
            return None
        except PyMongoError as e:
            logger.error(f"❌ Erreur création utilisateur: {e}")
            return None
    
    def get_user_by_pseudonym(self, pseudonym: str) -> Optional[Dict]:
        """
        Récupérer un utilisateur par son pseudonyme
        """
        try:
            user = self.users.find_one({"pseudonym": pseudonym})
            if user:
                user["_id"] = str(user["_id"])
            return user
            
        except PyMongoError as e:
            logger.error(f"❌ Erreur récupération utilisateur: {e}")
            return None
    
    def update_user(self, user_id: str, update_data: Dict) -> bool:
        """
        Mettre à jour un utilisateur
        """
        try:
            update_data["updated_at"] = datetime.utcnow()
            
            result = self.users.update_one(
                {"_id": ObjectId(user_id)},
                {"$set": update_data}
            )
            
            return result.modified_count > 0
            
        except PyMongoError as e:
            logger.error(f"❌ Erreur mise à jour utilisateur: {e}")
            return False
    
    # === SPRINTS ===
    
    async def create_sprint(self, sprint_data: Dict) -> Optional[str]:
        """
        Créer un nouveau sprint
        """
        try:
            sprint_data["created_at"] = datetime.utcnow()
            sprint_data["status"] = "active"
            sprint_data["participants"] = []
            
            result = self.sprints.insert_one(sprint_data)
            logger.info(f"✅ Sprint créé: {result.inserted_id}")
            return str(result.inserted_id)
            
        except PyMongoError as e:
            logger.error(f"❌ Erreur création sprint: {e}")
            return None
    
    async def get_sprint(self, sprint_id: str) -> Optional[Dict]:
        """
        Récupérer un sprint par ID
        """
        try:
            sprint = self.sprints.find_one({"_id": ObjectId(sprint_id)})
            if sprint:
                sprint["_id"] = str(sprint["_id"])
            return sprint
            
        except PyMongoError as e:
            logger.error(f"❌ Erreur récupération sprint: {e}")
            return None
    
    async def get_available_sprints(self) -> List[Dict]:
        """
        Récupérer tous les sprints disponibles
        """
        try:
            sprints = list(self.sprints.find({"status": "active"}))
            
            # Convertir ObjectId en string
            for sprint in sprints:
                sprint["_id"] = str(sprint["_id"])
            
            return sprints
            
        except PyMongoError as e:
            logger.error(f"❌ Erreur récupération sprints: {e}")
            return []
    
    async def join_sprint(self, sprint_id: str, user_pseudonym: str) -> bool:
        """
        Rejoindre un sprint
        """
        try:
            result = self.sprints.update_one(
                {"_id": ObjectId(sprint_id)},
                {"$addToSet": {"participants": user_pseudonym}}
            )
            
            return result.modified_count > 0
            
        except PyMongoError as e:
            logger.error(f"❌ Erreur rejoindre sprint: {e}")
            return False
    
    # === SUBMISSIONS ===
    
    async def submit_task(self, submission_data: Dict) -> Optional[str]:
        """
        Soumettre une tâche
        """
        try:
            submission_data["submitted_at"] = datetime.utcnow()
            submission_data["status"] = "pending_review"
            
            result = self.db.submissions.insert_one(submission_data)
            logger.info(f"✅ Tâche soumise: {result.inserted_id}")
            return str(result.inserted_id)
            
        except PyMongoError as e:
            logger.error(f"❌ Erreur soumission tâche: {e}")
            return None
    
    # === FEEDBACK ===
    
    async def add_feedback(self, feedback_data: Dict) -> Optional[str]:
        """
        Ajouter un feedback
        """
        try:
            feedback_data["created_at"] = datetime.utcnow()
            
            result = self.feedback.insert_one(feedback_data)
            logger.info(f"✅ Feedback ajouté: {result.inserted_id}")
            return str(result.inserted_id)
            
        except PyMongoError as e:
            logger.error(f"❌ Erreur ajout feedback: {e}")
            return None
    
    async def get_feedback_for_sprint(self, sprint_id: str) -> List[Dict]:
        """
        Récupérer tous les feedbacks d'un sprint
        """
        try:
            feedbacks = list(self.feedback.find({"sprint_id": sprint_id}))
            
            # Convertir ObjectId en string
            for feedback in feedbacks:
                feedback["_id"] = str(feedback["_id"])
            
            return feedbacks
            
        except PyMongoError as e:
            logger.error(f"❌ Erreur récupération feedbacks: {e}")
            return []
    
    # === SCORING ===
    
    async def update_score(self, user_pseudonym: str, sprint_id: str, score_data: Dict) -> bool:
        """
        Mettre à jour le score d'un utilisateur pour un sprint
        """
        try:
            score_data["updated_at"] = datetime.utcnow()
            
            result = self.scores.update_one(
                {"user_pseudonym": user_pseudonym, "sprint_id": sprint_id},
                {"$set": score_data},
                upsert=True
            )
            
            return result.acknowledged
            
        except PyMongoError as e:
            logger.error(f"❌ Erreur mise à jour score: {e}")
            return False
    
    async def get_user_scores(self, user_pseudonym: str) -> List[Dict]:
        """
        Récupérer tous les scores d'un utilisateur
        """
        try:
            scores = list(self.scores.find({"user_pseudonym": user_pseudonym}))
            
            # Convertir ObjectId en string
            for score in scores:
                score["_id"] = str(score["_id"])
            
            return scores
            
        except PyMongoError as e:
            logger.error(f"❌ Erreur récupération scores: {e}")
            return []
    
    # === STATISTIQUES ===
    
    async def get_user_stats(self, user_pseudonym: str) -> Dict:
        """
        Récupérer les statistiques d'un utilisateur
        """
        try:
            # Compter les sprints complétés
            completed_sprints = self.scores.count_documents({
                "user_pseudonym": user_pseudonym,
                "status": "completed"
            })
            
            # Calculer le score moyen
            pipeline = [
                {"$match": {"user_pseudonym": user_pseudonym}},
                {"$group": {
                    "_id": None,
                    "avg_score": {"$avg": "$score"},
                    "total_sprints": {"$sum": 1}
                }}
            ]
            
            result = list(self.scores.aggregate(pipeline))
            avg_score = result[0]["avg_score"] if result else 0
            
            return {
                "completed_sprints": completed_sprints,
                "average_score": round(avg_score, 2),
                "reputation_level": self._calculate_reputation_level(avg_score, completed_sprints)
            }
            
        except PyMongoError as e:
            logger.error(f"❌ Erreur récupération stats: {e}")
            return {}
    
    def _calculate_reputation_level(self, avg_score: float, completed_sprints: int) -> str:
        """
        Calculer le niveau de réputation basé sur les performances
        """
        if completed_sprints == 0:
            return "Newcomer"
        elif avg_score >= 90 and completed_sprints >= 5:
            return "Expert"
        elif avg_score >= 80 and completed_sprints >= 3:
            return "Advanced"
        elif avg_score >= 70:
            return "Intermediate"
        else:
            return "Beginner"

# Instance globale du service
db_service = DatabaseService()

