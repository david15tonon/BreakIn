#!/usr/bin/env python3
"""
Script de test pour la base de données MongoDB BreakIn Direct
Usage: python test_db.py
"""

import sys
import asyncio
import logging
from datetime import datetime
from pathlib import Path

# Ajouter le répertoire parent au PYTHONPATH
sys.path.append(str(Path(__file__).parent.parent))

from app.config import connect_to_mongodb, get_database, close_mongodb_connection
from app.services.db import DatabaseService

# Configuration du logging pour le test
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class DatabaseTester:
    """
    Classe pour tester toutes les fonctionnalités de la base de données
    """
    
    def __init__(self):
        self.db_service = DatabaseService()  # Initialiser directement
        self.test_data = {
            "user_id": None,
            "sprint_id": None,
            "feedback_id": None,
            "submission_id": None
        }
    
    async def setup(self):
        """Initialiser la connexion à la base de données"""
        try:
            logger.info("🚀 Initialisation des tests de base de données...")
            
            # Tester la connexion
            if not connect_to_mongodb():
                raise Exception("Impossible de se connecter à MongoDB")
            
            logger.info("✅ Service de base de données initialisé")
            return True
            
        except Exception as e:
            logger.error(f"❌ Erreur lors de l'initialisation: {e}")
            return False
    
    async def test_user_operations(self):
        """Tester les opérations utilisateur"""
        logger.info("\n🧪 Test des opérations utilisateur...")
        
        try:
            # Créer un utilisateur de test
            user_data = {
                "pseudonym": f"TestUser_{datetime.now().strftime('%H%M%S')}",
                "email": "test@breakin.dev",
                "skills": ["Python", "FastAPI", "MongoDB"],
                "experience_level": "intermediate",
                "profile": {
                    "bio": "Développeur test pour BreakIn Direct",
                    "github": "https://github.com/testuser"
                }
            }
            
            user_id = await self.db_service.create_user(user_data)
            if user_id:
                self.test_data["user_id"] = user_id
                logger.info(f"✅ Utilisateur créé avec l'ID: {user_id}")
                
                # Récupérer l'utilisateur par pseudonyme
                user = await self.db_service.get_user_by_pseudonym(user_data["pseudonym"])
                if user:
                    logger.info(f"✅ Utilisateur récupéré: {user['pseudonym']}")
                    
                    # Mettre à jour l'utilisateur
                    update_success = await self.db_service.update_user(
                        user_id, 
                        {"skills": ["Python", "FastAPI", "MongoDB", "React"]}
                    )
                    if update_success:
                        logger.info("✅ Utilisateur mis à jour avec succès")
                    else:
                        logger.error("❌ Échec de la mise à jour utilisateur")
                
                return True
            else:
                logger.error("❌ Échec de la création utilisateur")
                return False
                
        except Exception as e:
            logger.error(f"❌ Erreur dans les tests utilisateur: {e}")
            return False
    
    async def test_sprint_operations(self):
        """Tester les opérations de sprint"""
        logger.info("\n🧪 Test des opérations de sprint...")
        
        try:
            # Créer un sprint de test
            sprint_data = {
                "title": "Test E-commerce API",
                "description": "Construire une API REST pour un e-commerce",
                "difficulty": "intermediate",
                "duration_days": 3,
                "max_participants": 4,
                "technologies": ["Python", "FastAPI", "MongoDB"],
                "requirements": [
                    "API REST complète",
                    "Tests unitaires",
                    "Documentation Swagger"
                ],
                "mentor": "AI_Mentor_001"
            }
            
            sprint_id = await self.db_service.create_sprint(sprint_data)
            if sprint_id:
                self.test_data["sprint_id"] = sprint_id
                logger.info(f"✅ Sprint créé avec l'ID: {sprint_id}")
                
                # Récupérer le sprint
                sprint = await self.db_service.get_sprint(sprint_id)
                if sprint:
                    logger.info(f"✅ Sprint récupéré: {sprint['title']}")
                    
                    # Rejoindre le sprint avec l'utilisateur test
                    if self.test_data["user_id"]:
                        user = await self.db_service.get_user_by_pseudonym(
                            f"TestUser_{datetime.now().strftime('%H%M%S')}"
                        )
                        if user:
                            join_success = await self.db_service.join_sprint(
                                sprint_id, 
                                user["pseudonym"]
                            )
                            if join_success:
                                logger.info("✅ Utilisateur a rejoint le sprint")
                            else:
                                logger.error("❌ Échec pour rejoindre le sprint")
                
                # Tester la récupération des sprints disponibles
                available_sprints = await self.db_service.get_available_sprints()
                logger.info(f"✅ {len(available_sprints)} sprints disponibles trouvés")
                
                return True
            else:
                logger.error("❌ Échec de la création du sprint")
                return False
                
        except Exception as e:
            logger.error(f"❌ Erreur dans les tests de sprint: {e}")
            return False
    
    async def test_submission_operations(self):
        """Tester les opérations de soumission"""
        logger.info("\n🧪 Test des opérations de soumission...")
        
        try:
            if not self.test_data["sprint_id"]:
                logger.error("❌ Pas de sprint_id disponible pour le test")
                return False
            
            # Soumettre une tâche
            submission_data = {
                "sprint_id": self.test_data["sprint_id"],
                "user_pseudonym": f"TestUser_{datetime.now().strftime('%H%M%S')}",
                "task_title": "API Endpoints Implementation",
                "solution": {
                    "github_repo": "https://github.com/testuser/ecommerce-api",
                    "live_demo": "https://test-api.herokuapp.com",
                    "documentation": "README.md complet avec instructions",
                    "tests_coverage": 85
                },
                "description": "Implémentation complète de l'API avec authentification JWT",
                "files": ["main.py", "models.py", "routes.py", "tests.py"]
            }
            
            submission_id = await self.db_service.submit_task(submission_data)
            if submission_id:
                self.test_data["submission_id"] = submission_id
                logger.info(f"✅ Tâche soumise avec l'ID: {submission_id}")
                return True
            else:
                logger.error("❌ Échec de la soumission de tâche")
                return False
                
        except Exception as e:
            logger.error(f"❌ Erreur dans les tests de soumission: {e}")
            return False
    
    async def test_feedback_operations(self):
        """Tester les opérations de feedback"""
        logger.info("\n🧪 Test des opérations de feedback...")
        
        try:
            if not self.test_data["sprint_id"]:
                logger.error("❌ Pas de sprint_id disponible pour le test")
                return False
            
            # Ajouter un feedback
            feedback_data = {
                "sprint_id": self.test_data["sprint_id"],
                "user_pseudonym": f"TestUser_{datetime.now().strftime('%H%M%S')}",
                "reviewer": "AI_Mentor_001",
                "feedback_type": "code_review",
                "rating": 4.2,
                "comments": {
                    "code_quality": "Excellent structure et lisibilité",
                    "architecture": "Bonnes pratiques respectées",
                    "testing": "Couverture de tests satisfaisante",
                    "documentation": "Documentation claire et complète"
                },
                "suggestions": [
                    "Ajouter la validation d'entrée",
                    "Optimiser les requêtes de base de données",
                    "Implémenter le cache Redis"
                ],
                "overall_score": 85
            }
            
            feedback_id = await self.db_service.add_feedback(feedback_data)
            if feedback_id:
                self.test_data["feedback_id"] = feedback_id
                logger.info(f"✅ Feedback ajouté avec l'ID: {feedback_id}")
                
                # Récupérer les feedbacks du sprint
                feedbacks = await self.db_service.get_feedback_for_sprint(
                    self.test_data["sprint_id"]
                )
                logger.info(f"✅ {len(feedbacks)} feedbacks trouvés pour le sprint")
                
                return True
            else:
                logger.error("❌ Échec de l'ajout de feedback")
                return False
                
        except Exception as e:
            logger.error(f"❌ Erreur dans les tests de feedback: {e}")
            return False
    
    async def test_scoring_operations(self):
        """Tester les opérations de scoring"""
        logger.info("\n🧪 Test des opérations de scoring...")
        
        try:
            user_pseudonym = f"TestUser_{datetime.now().strftime('%H%M%S')}"
            
            # Mettre à jour le score
            score_data = {
                "sprint_id": self.test_data["sprint_id"],
                "score": 85.5,
                "breakdown": {
                    "code_quality": 90,
                    "collaboration": 80,
                    "innovation": 85,
                    "delivery": 87
                },
                "status": "completed",
                "mentor_feedback": "Excellent travail, continue comme ça !",
                "reveal_identity": True  # Score > 85%
            }
            
            score_success = await self.db_service.update_score(
                user_pseudonym,
                self.test_data["sprint_id"],
                score_data
            )
            
            if score_success:
                logger.info("✅ Score mis à jour avec succès")
                
                # Récupérer les scores de l'utilisateur
                user_scores = await self.db_service.get_user_scores(user_pseudonym)
                logger.info(f"✅ {len(user_scores)} scores trouvés pour l'utilisateur")
                
                # Récupérer les statistiques de l'utilisateur
                user_stats = await self.db_service.get_user_stats(user_pseudonym)
                logger.info(f"✅ Stats utilisateur: {user_stats}")
                
                return True
            else:
                logger.error("❌ Échec de la mise à jour du score")
                return False
                
        except Exception as e:
            logger.error(f"❌ Erreur dans les tests de scoring: {e}")
            return False
    
    async def test_database_connectivity(self):
        """Tester la connectivité de base"""
        logger.info("\n🧪 Test de connectivité de base...")
        
        try:
            db = get_database()
            
            # Test ping
            db.command("ping")
            logger.info("✅ Ping MongoDB réussi")
            
            # Lister les collections
            collections = db.list_collection_names()
            logger.info(f"✅ Collections disponibles: {collections}")
            
            # Test d'écriture/lecture simple
            test_doc = {"test": True, "timestamp": datetime.utcnow()}
            result = db.test_collection.insert_one(test_doc)
            logger.info(f"✅ Test d'écriture réussi: {result.inserted_id}")
            
            # Lire le document
            retrieved = db.test_collection.find_one({"_id": result.inserted_id})
            if retrieved:
                logger.info("✅ Test de lecture réussi")
                
                # Nettoyer
                db.test_collection.delete_one({"_id": result.inserted_id})
                logger.info("✅ Nettoyage effectué")
            
            return True
            
        except Exception as e:
            logger.error(f"❌ Erreur de connectivité: {e}")
            return False
    
    async def cleanup(self):
        """Nettoyer les données de test"""
        logger.info("\n🧹 Nettoyage des données de test...")
        
        try:
            db = get_database()
            
            # Supprimer les données de test (optionnel en développement)
            if self.test_data["user_id"]:
                db.users.delete_many({"pseudonym": {"$regex": "^TestUser_"}})
                logger.info("✅ Utilisateurs de test supprimés")
            
            if self.test_data["sprint_id"]:
                db.sprints.delete_many({"title": {"$regex": "^Test"}})
                logger.info("✅ Sprints de test supprimés")
            
            # Supprimer les autres collections de test
            db.submissions.delete_many({"user_pseudonym": {"$regex": "^TestUser_"}})
            db.feedback.delete_many({"user_pseudonym": {"$regex": "^TestUser_"}})
            db.scores.delete_many({"user_pseudonym": {"$regex": "^TestUser_"}})
            
            logger.info("✅ Nettoyage terminé")
            
        except Exception as e:
            logger.error(f"❌ Erreur lors du nettoyage: {e}")
    
    async def run_all_tests(self):
        """Exécuter tous les tests"""
        logger.info("🧪 DÉBUT DES TESTS DE BASE DE DONNÉES BREAKIN DIRECT")
        logger.info("=" * 60)
        
        test_results = []
        
        # Initialisation
        if not await self.setup():
            logger.error("❌ Échec de l'initialisation - Arrêt des tests")
            return False
        
        # Tests individuels
        tests = [
            ("Connectivité", self.test_database_connectivity),
            ("Opérations Utilisateur", self.test_user_operations),
            ("Opérations Sprint", self.test_sprint_operations),
            ("Opérations Soumission", self.test_submission_operations),
            ("Opérations Feedback", self.test_feedback_operations),
            ("Opérations Scoring", self.test_scoring_operations),
        ]
        
        for test_name, test_func in tests:
            try:
                result = await test_func()
                test_results.append((test_name, result))
                if result:
                    logger.info(f"✅ {test_name}: RÉUSSI")
                else:
                    logger.error(f"❌ {test_name}: ÉCHEC")
            except Exception as e:
                logger.error(f"❌ {test_name}: ERREUR - {e}")
                test_results.append((test_name, False))
        
        # Nettoyage
        await self.cleanup()
        
        # Résumé final
        logger.info("\n" + "=" * 60)
        logger.info("📊 RÉSUMÉ DES TESTS")
        logger.info("=" * 60)
        
        passed = sum(1 for _, result in test_results if result)
        total = len(test_results)
        
        for test_name, result in test_results:
            status = "✅ RÉUSSI" if result else "❌ ÉCHEC"
            logger.info(f"{test_name:<25} : {status}")
        
        logger.info("-" * 60)
        logger.info(f"Tests réussis: {passed}/{total}")
        logger.info(f"Taux de réussite: {(passed/total)*100:.1f}%")
        
        if passed == total:
            logger.info("🎉 TOUS LES TESTS ONT RÉUSSI ! Base de données prête pour le développement.")
        else:
            logger.warning(f"⚠️ {total-passed} test(s) ont échoué. Vérifiez la configuration.")
        
        return passed == total


async def main():
    """Fonction principale"""
    tester = DatabaseTester()
    
    try:
        success = await tester.run_all_tests()
        sys.exit(0 if success else 1)
        
    except KeyboardInterrupt:
        logger.info("\n🛑 Tests interrompus par l'utilisateur")
        sys.exit(1)
        
    except Exception as e:
        logger.error(f"❌ Erreur inattendue: {e}")
        sys.exit(1)
        
    finally:
        # Fermer la connexion
        close_mongodb_connection()
        logger.info("🔐 Connexion MongoDB fermée")


if __name__ == "__main__":
    # Exécuter les tests
    asyncio.run(main())