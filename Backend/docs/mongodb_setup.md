# Guide de Configuration MongoDB pour BreakIn Direct

## 🎯 Vue d'ensemble

Ce guide vous explique comment configurer MongoDB pour le projet BreakIn Direct, que ce soit en local ou avec MongoDB Atlas.

## 🚀 Option 1: MongoDB Local (Développement)

### Installation MongoDB

#### Linux (Ubuntu/Debian)
```bash
# Importer la clé GPG
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -

# Ajouter le repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Installer
sudo apt-get update
sudo apt-get install -y mongodb-org

# Démarrer le service
sudo systemctl start mongod
sudo systemctl enable mongod
```

#### macOS
```bash
# Avec Homebrew
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

#### Windows
1. Télécharger MongoDB Community Server depuis [mongodb.com](https://www.mongodb.com/try/download/community)
2. Suivre l'assistant d'installation
3. Démarrer MongoDB comme service

### Configuration locale

```bash
# Vérifier que MongoDB fonctionne
mongosh

# Dans mongosh, créer la base de données
use breakin_hackathon

# Créer un utilisateur admin (optionnel)
db.createUser({
  user: "breakin_admin",
  pwd: "secure_password_here",
  roles: ["readWrite", "dbAdmin"]
})
```

### Variables d'environnement (.env)
```env
MONGO_URI=mongodb://localhost:27017
DB_NAME=breakin_hackathon
```

## ☁️ Option 2: MongoDB Atlas (Production/Hackathon)

### 1. Créer un compte MongoDB Atlas

1. Aller sur [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Créer un compte gratuit
3. Créer un nouveau cluster (M0 gratuit pour le hackathon)

### 2. Configuration du cluster

1. **Sécurité réseau** : Ajouter votre IP ou `0.0.0.0/0` (pour le hackathon uniquement)
2. **Utilisateur de base de données** :
   - Username: `breakin_user`
   - Password: Générer un mot de passe sécurisé
   - Rôles: `Atlas admin` ou `Read and write to any database`

### 3. Récupérer la chaîne de connexion

1. Cliquer sur "Connect" dans le dashboard
2. Choisir "Connect your application"
3. Copier la chaîne de connexion (format : `mongodb+srv://...`)

### Variables d'environnement (.env)
```env
MONGO_URI=mongodb+srv://breakin_user:PASSWORD@cluster0.xxxxx.mongodb.net/
DB_NAME=breakin_hackathon
```

## 🔧 Configuration avancée

### Structure des collections

```javascript
// Collection: users
{
  "_id": ObjectId,
  "pseudonym": String (unique),
  "email": String (optionnel),
  "real_name": String (masqué),
  "skills": [String],
  "reputation_score": Number,
  "created_at": Date,
  "updated_at": Date
}

// Collection: sprints
{
  "_id": ObjectId,
  "title": String,
  "description": String,
  "difficulty": String, // "beginner", "intermediate", "advanced"
  "technologies": [String],
  "duration_days": Number,
  "max_participants": Number,
  "participants": [String], // pseudonymes
  "status": String, // "active", "completed", "cancelled"
  "gpt_mission": String,
  "created_at": Date,
  "starts_at": Date,
  "ends_at": Date
}

// Collection: submissions
{
  "_id": ObjectId,
  "sprint_id": ObjectId,
  "user_pseudonym": String,
  "solution_url": String, // GitHub repo, etc.
  "description": String,
  "technologies_used": [String],
  "submitted_at": Date,
  "status": String // "pending", "reviewed", "scored"
}

// Collection: feedback
{
  "_id": ObjectId,
  "sprint_id": ObjectId,
  "target_pseudonym": String,
  "reviewer_pseudonym": String, // ou "AI"
  "reviewer_type": String, // "mentor", "peer", "ai"
  "scores": {
    "code_quality": Number, // 0-100
    "collaboration": Number,
    "innovation": Number,
    "documentation": Number
  },
  "comments": String,
  "created_at": Date
}

// Collection: scores
{
  "_id": ObjectId,
  "user_pseudonym": String,
  "sprint_id": ObjectId,
  "overall_score": Number, // 0-100
  "breakdown": {
    "technical": Number,
    "collaboration": Number,
    "delivery": Number,
    "growth": Number
  },
  "is_hireable": Boolean, // true si score >= 85
  "calculated_at": Date
}
```

### Index recommandés

```javascript
// Users
db.users.createIndex({ "pseudonym": 1 }, { unique: true })
db.users.createIndex({ "reputation_score": -1 })

// Sprints
db.sprints.createIndex({ "status": 1 })
db.sprints.createIndex({ "created_at": -1 })
db.sprints.createIndex({ "starts_at": 1 })

// Submissions
db.submissions.createIndex({ "sprint_id": 1 })
db.submissions.createIndex({ "user_pseudonym": 1 })
db.submissions.createIndex({ "submitted_at": -1 })

// Feedback
db.feedback.createIndex({ "sprint_id": 1 })
db.feedback.createIndex({ "target_pseudonym": 1 })
db.feedback.createIndex({ "created_at": -1 })

// Scores
db.scores.createIndex({ "user_pseudonym": 1, "sprint_id": 1 }, { unique: true })
db.scores.createIndex({ "overall_score": -1 })
db.scores.createIndex({ "is_hireable": 1 })
```

## 🧪 Test de connexion

```bash
# Tester la connexion
cd Backend
python test_mongodb.py
```

Le script de test vérifiera :
- ✅ Connexion basique
- ✅ Opérations CRUD
- ✅ Service de base de données
- ✅ Création des index

## 🚨 Troubleshooting

### Erreurs communes

#### "Connection refused"
```bash
# Vérifier que MongoDB fonctionne
sudo systemctl status mongod

# Redémarrer si nécessaire
sudo systemctl restart mongod
```

#### "Authentication failed"
- Vérifier les credentials dans `.env`
- S'assurer que l'utilisateur existe et a les bons droits

#### "Network timeout" (Atlas)
- Vérifier la whitelist IP dans Atlas
- Vérifier la connexion internet
- Vérifier que la chaîne de connexion est correcte

#### "Database not found"
- La base sera créée automatiquement lors de la première insertion
- Vérifier le nom dans `DB_NAME`

### Logs de debug

```python
# Activer les logs MongoDB détaillés
import logging
logging.getLogger('pymongo').setLevel(logging.DEBUG)
```

## 📊 Monitoring

### Commandes utiles

```javascript
// Dans mongosh

// Statistiques de la base
db.stats()

// Lister les collections
show collections

// Compter les documents
db.users.countDocuments()
db.sprints.countDocuments()

// Voir les index
db.users.getIndexes()

// Statistiques de performance
db.users.explain("executionStats").find({"pseudonym": "Alpha"})
```

### MongoDB Compass

- Interface graphique pour visualiser les données
- Télécharger : [mongodb.com/products/compass](https://www.mongodb.com/products/compass)
- Connecter avec la même URI que l'application

## 🔐 Sécurité

### Pour la production

1. **Authentification** : Toujours utiliser un utilisateur/mot de passe
2. **Réseau** : Restricter l'accès par IP
3. **Chiffrement** : Activer TLS/SSL
4. **Sauvegarde** : Configurer des backups automatiques

### Variables sensibles

```bash
# Ne jamais committer le .env !
echo ".env" >> .gitignore

# Utiliser des mots de passe forts
# Minimum 12 caractères, alphanumériques + symboles
```

## 🎯 Prêt pour le hackathon !

Une fois la configuration terminée, vous devriez pouvoir :

1. ✅ Se connecter à MongoDB
2. ✅ Exécuter les tests avec `python test_mongodb.py`
3. ✅ Démarrer l'API FastAPI
4. ✅ Créer des utilisateurs et sprints
5. ✅ Gérer l'anonymisation et le scoring

Bonne chance pour le hackathon ! 🚀
