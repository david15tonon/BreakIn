
FR version


# BreakIn Direct 🚀

> **Système de Recrutement par Preuve de Travail (PoWHS) - Révolutionner l'embauche tech**

[![Tech Stack](https://img.shields.io/badge/Stack-Next.js%20%7C%20FastAPI%20%7C%20MongoDB%20%7C%20GPT--5-blue)](https://github.com/david15tonon/BreakIn)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Status](https://img.shields.io/badge/Status-MVP%20Hackathon-orange)](https://github.com/david15tonon/BreakIn)
[![Demo](https://img.shields.io/badge/Demo-Live-green)](https://breakin-direct.vercel.app)

> 🇺🇸 **[English Version](README_EN.md)** | 🇫🇷 **Version Française**

---

## 📋 Table des matières

- [Le Problème](#le-problème)
- [Notre Solution](#notre-solution)
- [Comment ça marche](#comment-ça-marche)
- [Roadmap Hackathon (5 jours)](#roadmap-hackathon-5-jours)
- [Architecture](#architecture)
- [Installation & Setup](#installation--setup)
- [Tech Stack](#tech-stack)
- [Démo en direct](#démo-en-direct)
- [Contribution](#contribution)

---

## 💣 Le Problème

### Un système d'embauche cassé

Dans le paysage actuel de l'embauche, **les développeurs juniors et les talents en transition sont laissés pour compte** - non pas par manque de compétences, mais parce que les CV échouent à montrer ce qui compte vraiment : **la capacité à construire, collaborer et grandir dans des conditions réelles**.

| Domaine | Ce qui est cassé |
|---------|------------------|
| **Recrutement** | Les ATS filtrent les talents sur le pedigree, pas la performance |
| **Juniors & Transitions** | Les postes entry-level disparaissent ; "2+ ans d'expérience" devient le nouveau entry-level |
| **Biais & Inégalités** | Les candidats issus de milieux non-traditionnels sont injustement ignorés |
| **Entreprises** | Difficultés à valider les compétences, l'adéquation à l'équipe et l'éthique de travail avant l'embauche |
| **Accès au mentorat** | Les développeurs juniors manquent de boucles de feedback et de modèles dans les premières étapes |

> 🚨 **Un développeur junior aujourd'hui ne fait pas que concurrencer ses pairs — il concurrence des marchés d'emploi bruyants, des emails de refus silencieux et un gatekeeping invisible.**

---

## 💡 Notre Solution

### Système de Recrutement par Preuve de Travail (PoWHS)

**Une plateforme de simulation sans CV, sans offre d'emploi, centrée sur le mentorat**, où les compétences gagnent des opportunités.

BreakIn Direct remplace l'embauche par intuition par **des performances vérifiables**. À travers des sprints de simulation, des revues IA, des feedbacks de mentors et des constructions d'équipes collaboratives, nous générons des portfolios vivants en lesquels les responsables de recrutement peuvent avoir plus confiance qu'en n'importe quelle lettre de motivation.

### 🔁 Comment ça fonctionne

1. **Les développeurs rejoignent des sprints de simulation en équipe**
2. **IA + feedback de mentors alimentent la réputation & croissance**
3. **Le moteur d'embauche recommande les talents basé sur le travail—pas les mots**
4. **Les entreprises embauchent directement—sans poster d'annonce ou filtrer des CV**

---

## 🎯 Pour qui BreakIn existe

| Partie prenante | Valeur apportée |
|----------------|-----------------|
| **Développeurs Junior & Mid** | Construire une vraie expérience, recevoir des feedbacks, gagner la confiance sans emplois précédents |
| **Mentors (Développeurs Senior)** | Guider les talents, scout de futurs employés, développer le leadership communautaire |
| **Entreprises** | Embaucher basé sur de vraies constructions, comportement d'équipe et croissance de compétences—pas des credentials statiques |
| **Écoles/ONG** | Offrir des stages réels, tracker l'impact étudiant, se connecter à la demande globale de talents |

---

## 🚀 Roadmap Hackathon (5 jours)

### 🎯 Objectif Final
Livrer un MVP fonctionnel de BreakIn :
- **Frontend** (SquadRoom UI + pseudonymes)
- **Backend API** (FastAPI + MongoDB + GPT-5)
- **Flow complet** : inscription → assignation pseudonyme → mission → feedback anonyme → scoring
- **Démo live + repo GitHub (public) + vidéo pitch**

### 📆 Plan de Sprint (5 Jours)

#### **Jour 1 — Kickoff & Setup** ✅
- [x] Définir le scope MVP (simple mais impactant)
- [x] Setup repo GitHub (frontend + backend monorepo)
- [x] Configurer MongoDB Atlas + connexion FastAPI
- [x] Setup GPT-5 API (clé hackathon)
- [x] Maquettes SquadRoom UI rapides (Figma/Miro)
- **👉 Livrable** : Repo structuré + UX validée

#### **Jour 2 — Backend Core** ✅
- [x] Construire API FastAPI avec routes :
  - `/signup` → création utilisateur + pseudonyme
  - `/start-sprint` → génération mission GPT-5
  - `/submit-task` → sauvegarder livrable (MongoDB)
  - `/feedback` → feedback mentors/IA
- [x] Concevoir schéma MongoDB (users, sprints, feedback, scores)
- **👉 Livrable** : API testable avec Postman

#### **Jour 3 — Frontend Core + Intégration API** ✅
- [x] Setup Next.js + Tailwind (dev rapide)
- [x] Pages :
  - Login (pseudo)
  - Dashboard SquadRoom (liste sprints + chat pseudonymes)
  - Page Mission (soumettre tâche)
  - Affichage Feedback
- [x] Connecter frontend ↔ backend (REST API)
- **👉 Livrable** : Frontend cliquable entièrement connecté au backend

#### **Jour 4 — IA + Anonymisation + Scoring** 🔄
- [ ] Intégrer GPT-5 pour génération mission + feedback
- [ ] Implémenter rotation pseudonymes (par sprint)
- [ ] Ajouter système de scoring (≥85% = révélable)
- [ ] Test end-to-end : inscription → mission → soumission → feedback → scoring
- **👉 Livrable** : Flow sprint fonctionnel complet avec anonymisation

#### **Jour 5 — Finalisation & Pitch** 📅
- [ ] Polir UX (animations, icônes)
- [ ] Ajouter logs admin (intégrité)
- [ ] Déployer : Vercel (frontend) + Render/Heroku (backend)
- [ ] Enregistrer vidéo pitch (2–3 min: problème → solution → impact)
- [ ] Préparer slides (vision, tech stack, angle business)
- [ ] Soumettre repo + lien démo + slides + vidéo
- **👉 Livrable** : MVP hébergé + soumission hackathon finale

---

## 🏗️ Architecture

### Frontend (Next.js 14 + Tailwind)

```bash
Frontend/
├── app/                     # App Router (Next.js 14)
│   ├── page.tsx            # Page d'accueil
│   ├── login/              # Authentification pseudonyme
│   ├── squadroom/          # Dashboard principal
│   ├── sprint/[id]/        # Page mission individuelle
│   └── feedback/           # Système de feedback
├── components/             # Composants réutilisables
│   ├── ui/                # Composants UI (shadcn/ui)
│   ├── SquadRoom.tsx      # Interface principale
│   └── PseudonymChat.tsx  # Chat anonyme
└── lib/                   # Utilitaires & API calls
```

### Backend (FastAPI + MongoDB + GPT-5)

```bash
Backend/
├── app/
│   ├── main.py            # Point d'entrée FastAPI
│   ├── config.py          # Configuration (MongoDB, GPT-5)
│   ├── models.py          # Modèles Pydantic
│   ├── routes/
│   │   ├── auth.py        # Gestion pseudonymes
│   │   ├── sprint.py      # Logique sprints
│   │   ├── feedback.py    # Système feedback
│   │   └── scoring.py     # Algorithme scoring
│   └── services/
│       ├── db.py          # Interface MongoDB
│       ├── gpt.py         # Intégration GPT-5
│       └── anonymizer.py  # Gestion pseudonymes
└── requirements.txt       # Dépendances Python
```

---

## ⚙️ Tech Stack

| Couche | Technologies |
|--------|-------------|
| **Frontend** | Next.js 14, TypeScript, Tailwind CSS, shadcn/ui |
| **Backend** | FastAPI, Python 3.12, Pydantic |
| **Base de données** | MongoDB Atlas |
| **IA** | GPT-5 API (OpenAI) |
| **Authentification** | Système pseudonyme custom |
| **Déploiement** | Vercel (frontend) + Render/Heroku (backend) |
| **Collaboration** | GitHub, Discord, Trello |

---

## 🚀 Installation & Setup

### Prérequis
- Node.js 18+ et npm/pnpm
- Python 3.12+
- Compte MongoDB Atlas
- Clé API GPT-5 (OpenAI)

### 1. Clone & Setup

```bash
git clone https://github.com/david15tonon/BreakIn.git
cd BreakIn
```

### 2. Backend Setup

```bash
cd Backend

# Environnement virtuel
python -m venv venv
source venv/bin/activate  # Linux/Mac

# Dépendances
pip install -r requirements.txt

# Variables d'environnement
cp .env.example .env
# Éditer .env :
# MONGO_URI=mongodb+srv://your-cluster
# DB_NAME=breakin_hackathon
# GPT_API_KEY=your_gpt5_key

# Démarrer le serveur
uvicorn app.main:app --reload --port 8000
```

### 3. Frontend Setup

```bash
cd Frontend

# Dépendances
pnpm install

# Variables d'environnement
cp .env.example .env.local
# NEXT_PUBLIC_API_URL=http://localhost:8000

# Démarrer le dev server
pnpm dev
```

### 🌐 URLs de développement

- **Frontend** : <http://localhost:3000>
- **API Backend** : <http://localhost:8000>
- **Docs API** : <http://localhost:8000/docs>
- **SquadRoom** : <http://localhost:3000/squadroom>

---

## 🎮 Démo en direct

### Flow utilisateur complet

1. **Inscription** → Génération pseudonyme automatique
2. **SquadRoom** → Rejoindre sprint disponible
3. **Mission** → Recevoir défi généré par GPT-5
4. **Développement** → Collaborer avec équipe (pseudonymes)
5. **Soumission** → Upload solution + documentation
6. **Feedback** → Évaluation IA + mentors anonymes
7. **Scoring** → Score ≥85% révèle identité pour recruteurs

### Exemple de Mission GPT-5

```markdown
🎯 Mission: "E-commerce Cart Microservice"
⏱️ Durée: 3 jours
👥 Équipe: 4 développeurs (pseudonymes: Alpha, Bravo, Charlie, Delta)

📋 Objectif:
Construire un microservice de panier d'achat avec:
- API REST (Node.js/Python)
- Base de données (au choix)
- Tests unitaires
- Documentation API
- Conteneurisation Docker

💡 Critères d'évaluation:
- Code quality & architecture (30%)
- Collaboration & communication (25%)
- Tests & documentation (25%)
- Innovation & créativité (20%)
```

---

## 🏆 Stratégie de Victoire Hackathon

1. **Impact** → Recrutement sans biais = méritocratie globale
2. **Démo fluide** → Montrer la boucle complète en ≤2 min
3. **Angle business** → Produit SaaS B2B pour embauche sans biais
4. **Storytelling** → Commencer par une anecdote de discrimination

---

## 🤝 Contribution

### Pour le Hackathon

1. **Fork** le projet
2. Prendre une tâche sur [Trello Board](https://trello.com/b/breakin-hackathon)
3. Créer une branche (`feature/task-name`)
4. Développer & tester
5. Pull Request avec description détaillée

### Guidelines

- **Code style** : Prettier (Frontend) + Black (Backend)
- **Commits** : Format conventionnel (`feat:`, `fix:`, `docs:`)
- **Tests** : Obligatoires pour nouvelles features
- **Documentation** : MAJ README si changements d'API

---

## 📞 Contact & Liens

- **Repo GitHub** : [BreakIn Direct](https://github.com/david15tonon/BreakIn)
- **Démo Live** : [breakin-direct.vercel.app](https://breakin-direct.vercel.app)
- **Discord Team** : [Rejoindre](https://discord.gg/breakin-hackathon)
- **Pitch Video** : [YouTube](https://youtube.com/watch?v=breakin-pitch)

---

## 🎯 Vision

> **BreakIn Direct n'est pas juste une plateforme — c'est un mouvement.**
> 
> Un mouvement pour restaurer la confiance dans l'embauche en début de carrière, pour remplacer les biais par des preuves, et pour prouver que les grands talents n'ont pas besoin d'un CV parfait — juste d'une vraie chance de construire.
> 
> **Arrêtons d'embaucher le potentiel sur papier et commençons à embaucher la performance en action.**

---

<div align="center">

**BreakIn Direct** - Élever le niveau de talent pour tous — avec des preuves, pas des promesses 🚀

**#ProofOfWork #TalentRevolution #BiasFreHiring**

</div>
