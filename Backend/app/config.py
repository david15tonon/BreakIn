 # config (MongoDB, GPT-5 API key, etc.)
 
import os
import logging
from dotenv import load_dotenv
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
from pymongo.database import Database
# Configuration du logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

# Configuration MongoDB
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "breakin")

# Configuration de connexion avec options de production
MONGO_CONFIG = {
    "serverSelectionTimeoutMS": 5000,  # 5 secondes timeout
    "connectTimeoutMS": 10000,         # 10 secondes pour se connecter
    "socketTimeoutMS": 20000,          # 20 secondes pour les opérations
    "maxPoolSize": 10,                 # Maximum 10 connexions simultanées
    "retryWrites": True,               # Retry automatique des écritures
    "w": "majority",                   # Write concern pour la cohérence
}

# Initialisation du client MongoDB
client = None
db = None

def connect_to_mongodb():
    """
    Initialise la connexion à MongoDB avec gestion d'erreurs
    """
    global client, db
    
    try:
        logger.info(f"Tentative de connexion à MongoDB: {MONGO_URI}")
        
        # Créer le client avec configuration
        client = MongoClient(MONGO_URI, **MONGO_CONFIG)
        
        # Test de connexion
        client.admin.command('ping')
        
        # Sélectionner la base de données
        db = client[DB_NAME]
        
        logger.info(f"✅ Connexion MongoDB réussie sur la base '{DB_NAME}'")
        return True
        
    except ServerSelectionTimeoutError as e:
        logger.error(f"❌ Timeout connexion MongoDB: {e}")
        return False
    except ConnectionFailure as e:
        logger.error(f"❌ Échec de connexion MongoDB: {e}")
        return False
    except Exception as e:
        logger.error(f"❌ Erreur inattendue MongoDB: {e}")
        return False


def get_database() -> Database:
    MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
    DB_NAME = os.getenv("DB_NAME", "breakin")
    client = MongoClient(MONGO_URI)
    return client[DB_NAME]
        

def close_mongodb_connection():
    """
    Ferme proprement la connexion MongoDB
    """
    global client
    if client:
        client.close()
        logger.info("🔐 Connexion MongoDB fermée")

# GPT-5 API key
GPT_API_KEY = os.getenv("GPT_API_KEY")

# Validation des variables d'environnement critiques
if not GPT_API_KEY:
    logger.warning("⚠️ GPT_API_KEY non définie dans les variables d'environnement")

# Initialisation automatique de la connexion
if not connect_to_mongodb():
    logger.error("🚨 Impossible de se connecter à MongoDB au démarrage")
