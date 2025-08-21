#!/usr/bin/env python3
"""
Script de test de connexion MongoDB pour BreakIn Direct
Usage: python test_mongodb.py
"""

import sys
import os
from pathlib import Path

# Ajouter le répertoire parent au PATH pour les imports
sys.path.append(str(Path(__file__).parent))

from app.config import connect_to_mongodb, get_database, close_mongodb_connection
from app.services.db import DatabaseService
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def test_basic_connection():
    """Test de connexion basique"""
    logger.info("🧪 Test de connexion basique MongoDB...")
    
    success = connect_to_mongodb()
    if success:
        logger.info("✅ Connexion basique réussie")
        return True
    else:
        logger.error("❌ Connexion basique échouée")
        return False

def test_database_operations():
    """Test des opérations de base de données"""
    logger.info("🧪 Test des opérations de base de données...")
    
    try:
        db = get_database()
        if db is None:
            logger.error("❌ Base de données non disponible")
            return False
        
        # Test de ping - CORRIGÉ
        db.command('ping')
        logger.info("✅ Ping MongoDB réussi")
        
        # Test d'écriture/lecture
        test_collection = db.test_connection
        
        # Insérer un document de test
        test_doc = {"test": "connection", "timestamp": "2024"}
        result = test_collection.insert_one(test_doc)
        logger.info(f"✅ Document de test inséré: {result.inserted_id}")
        
        # Lire le document
        found_doc = test_collection.find_one({"_id": result.inserted_id})
        if found_doc:
            logger.info("✅ Document de test lu avec succès")
        
        # Nettoyer
        test_collection.delete_one({"_id": result.inserted_id})
        logger.info("✅ Document de test supprimé")
        
        return True
        
    except Exception as e:
        logger.error(f"❌ Erreur lors des opérations de base: {e}")
        return False

def test_database_service():
    """Test du service de base de données"""
    logger.info("🧪 Test du service de base de données...")
    
    try:
        db_service = DatabaseService()
        
        # Test des collections
        collections = ['users', 'sprints', 'feedback', 'scores']
        for collection_name in collections:
            collection = getattr(db_service, collection_name)
            logger.info(f"✅ Collection '{collection_name}' accessible")
        
        logger.info("✅ Service de base de données opérationnel")
        return True
        
    except Exception as e:
        logger.error(f"❌ Erreur du service de base de données: {e}")
        return False

def test_collections_indexes():
    """Test et création des index nécessaires"""
    logger.info("🧪 Test et création des index...")
    
    try:
        db = get_database()
        
        # Index pour les utilisateurs
        db.users.create_index("pseudonym", unique=True)
        logger.info("✅ Index 'pseudonym' créé pour users")
        
        # Index pour les sprints
        db.sprints.create_index("status")
        db.sprints.create_index("created_at")
        logger.info("✅ Index créés pour sprints")
        
        # Index pour les scores
        db.scores.create_index([("user_pseudonym", 1), ("sprint_id", 1)], unique=True)
        logger.info("✅ Index composite créé pour scores")
        
        # Index pour les feedbacks
        db.feedback.create_index("sprint_id")
        db.feedback.create_index("created_at")
        logger.info("✅ Index créés pour feedback")
        
        return True
        
    except Exception as e:
        logger.error(f"❌ Erreur lors de la création des index: {e}")
        return False

def main():
    """Fonction principale de test"""
    logger.info("🚀 Démarrage des tests MongoDB pour BreakIn Direct")
    logger.info("=" * 60)
    
    tests = [
        ("Connexion basique", test_basic_connection),
        ("Opérations de base", test_database_operations),
        ("Service de base de données", test_database_service),
        ("Index des collections", test_collections_indexes),
    ]
    
    results = []
    
    for test_name, test_func in tests:
        logger.info(f"\n📋 {test_name}...")
        success = test_func()
        results.append((test_name, success))
        
        if success:
            logger.info(f"✅ {test_name} : SUCCÈS")
        else:
            logger.error(f"❌ {test_name} : ÉCHEC")
    
    # Résumé final
    logger.info("\n" + "=" * 60)
    logger.info("📊 RÉSUMÉ DES TESTS")
    logger.info("=" * 60)
    
    passed = sum(1 for _, success in results if success)
    total = len(results)
    
    for test_name, success in results:
        status = "✅ PASS" if success else "❌ FAIL"
        logger.info(f"{status} - {test_name}")
    
    logger.info(f"\n🎯 RÉSULTAT FINAL: {passed}/{total} tests réussis")
    
    if passed == total:
        logger.info("🎉 Tous les tests MongoDB sont passés ! Prêt pour le développement.")
    else:
        logger.error("⚠️ Certains tests ont échoué. Vérifiez votre configuration MongoDB.")
    
    # Fermer la connexion
    close_mongodb_connection()
    
    return passed == total

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)