# BreakIn Direct 🚀

> **Proof-of-Work Hiring System (PoWHS) - Revolutionizing Tech Recruitment**

[![Tech Stack](https://img.shields.io/badge/Stack-Next.js%20%7C%20FastAPI%20%7C%20MongoDB%20%7C%20GPT--5-blue)](https://github.com/david15tonon/BreakIn)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Status](https://img.shields.io/badge/Status-MVP%20Hackathon-orange)](https://github.com/david15tonon/BreakIn)
[![Demo](https://img.shields.io/badge/Demo-Live-green)](https://breakin-direct.vercel.app)

> 🇺🇸 **English Version** | 🇫🇷 **[Version Française](README.md)**

---

## 📋 Table of Contents

- [The Problem](#the-problem)
- [Our Solution](#our-solution)
- [How It Works](#how-it-works)
- [Hackathon Roadmap (5 Days)](#hackathon-roadmap-5-days)
- [Architecture](#architecture)
- [Installation & Setup](#installation--setup)
- [Tech Stack](#tech-stack)
- [Live Demo](#live-demo)
- [Contributing](#contributing)

---

## 💣 The Problem

### A Broken Hiring System

In today's hiring landscape, **junior developers and transitioning talent are left behind** - not for lack of skill, but because résumés fail to show what truly matters: **the ability to build, collaborate, and grow in real-world conditions**.

| Area | What's Broken |
|------|---------------|
| **Recruitment** | ATS filters out talent based on pedigree, not performance |
| **Juniors & Transitions** | Entry-level roles are shrinking; "2+ years experience" is now entry-level |
| **Bias & Inequity** | Candidates from non-traditional backgrounds are unfairly overlooked |
| **Companies** | Struggle to validate skill, team fit, and work ethic pre-hire |
| **Mentorship Access** | Junior developers lack feedback loops and role models in early stages |

> 🚨 **A junior dev today doesn't just compete with peers — they compete with noisy job markets, silent rejection emails, and invisible gatekeeping.**

---

## 💡 Our Solution

### Proof-of-Work Hiring System (PoWHS)

**A zero-resumé, no-job-posting, mentorship-first simulation platform** where skill earns opportunity.

BreakIn Direct replaces guesswork hiring with **verifiable performance**. Through simulation sprints, AI review, mentor feedback, and collaborative team builds, we generate living portfolios that hiring managers can trust more than any cover letter.

### 🔁 How It Works

1. **Developers join team-based simulation sprints**
2. **AI + mentor feedback powers reputation & growth**
3. **Hiring engine recommends talent based on work—not words**
4. **Companies hire directly—without posting a job or screening résumés**

---

## 🎯 Who BreakIn Serves

| Stakeholder | Value |
|-------------|-------|
| **Junior & Mid Developers** | Build real experience, get feedback, earn trust without prior jobs |
| **Mentors (Senior Devs)** | Guide talent, scout future hires, grow community leadership |
| **Companies** | Hire based on actual builds, teamwork behavior, and skill growth—not static credentials |
| **Schools/NGOs** | Offer real-world internships, track student impact, plug into global talent demand |

---

## 🚀 Hackathon Roadmap (5 Days)

### 🎯 Final Objective
Deliver a functional MVP of BreakIn:
- **Frontend** (SquadRoom UI + pseudonyms)
- **Backend API** (FastAPI + MongoDB + GPT-5)
- **Complete Flow**: signup → pseudonym assignment → mission → anonymous feedback → scoring
- **Live demo + GitHub repo (public) + pitch video**

### 📆 Sprint Plan (5 Days)

#### **Day 1 — Kickoff & Setup** ✅
- [x] Define MVP scope (keep it simple but impactful)
- [x] Setup GitHub repo (frontend + backend monorepo)
- [x] Configure MongoDB Atlas + connect to FastAPI
- [x] Setup GPT-5 API (hackathon key)
- [x] Quick SquadRoom UI mockups (Figma/Miro)
- **👉 Deliverable**: Repo structured + UX validated

#### **Day 2 — Backend Core** ✅
- [x] Build FastAPI with routes:
  - `/signup` → user creation + pseudonym
  - `/start-sprint` → GPT-5 mission generation
  - `/submit-task` → save deliverable (MongoDB)
  - `/feedback` → mentors/AI feedback
- [x] Design MongoDB schema (users, sprints, feedback, scores)
- **👉 Deliverable**: Postman-testable API

#### **Day 3 — Frontend Core + API Integration** ✅
- [x] Setup Next.js + Tailwind (fast dev)
- [x] Pages:
  - Login (pseudo)
  - SquadRoom dashboard (list sprints + chat pseudonyms)
  - Mission page (submit task)
  - Feedback display
- [x] Connect frontend ↔ backend (REST API)
- **👉 Deliverable**: Clickable frontend fully connected to backend

#### **Day 4 — AI + Anonymization + Scoring** 🔄
- [ ] Integrate GPT-5 for mission generation + feedback
- [ ] Implement pseudonym rotation (per sprint)
- [ ] Add scoring system (≥85% = revealable)
- [ ] End-to-end test flow: signup → mission → submission → feedback → scoring
- **👉 Deliverable**: Full functional sprint flow with anonymization

#### **Day 5 — Finalization & Pitch** 📅
- [ ] Polish UX (animations, icons)
- [ ] Add admin logs (integrity)
- [ ] Deploy: Vercel (frontend) + Render/Heroku (backend)
- [ ] Record pitch video (2–3 min: problem → solution → impact)
- [ ] Prepare slides (vision, tech stack, business angle)
- [ ] Submit repo + demo link + slides + video
- **👉 Deliverable**: Hosted MVP + final hackathon submission

---

## 🏗️ Architecture

### Frontend (Next.js 14 + Tailwind)

```bash
Frontend/
├── app/                     # App Router (Next.js 14)
│   ├── page.tsx            # Landing page
│   ├── login/              # Pseudonym authentication
│   ├── squadroom/          # Main dashboard
│   ├── sprint/[id]/        # Individual mission page
│   └── feedback/           # Feedback system
├── components/             # Reusable components
│   ├── ui/                # UI components (shadcn/ui)
│   ├── SquadRoom.tsx      # Main interface
│   └── PseudonymChat.tsx  # Anonymous chat
└── lib/                   # Utilities & API calls
```

### Backend (FastAPI + MongoDB + GPT-5)

```bash
Backend/
├── app/
│   ├── main.py            # FastAPI entry point
│   ├── config.py          # Configuration (MongoDB, GPT-5)
│   ├── models.py          # Pydantic models
│   ├── routes/
│   │   ├── auth.py        # Pseudonym management
│   │   ├── sprint.py      # Sprint logic
│   │   ├── feedback.py    # Feedback system
│   │   └── scoring.py     # Scoring algorithm
│   └── services/
│       ├── db.py          # MongoDB interface
│       ├── gpt.py         # GPT-5 integration
│       └── anonymizer.py  # Pseudonym management
└── requirements.txt       # Python dependencies
```

---

## ⚙️ Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | Next.js 14, TypeScript, Tailwind CSS, shadcn/ui |
| **Backend** | FastAPI, Python 3.12, Pydantic |
| **Database** | MongoDB Atlas |
| **AI** | GPT-5 API (OpenAI) |
| **Authentication** | Custom pseudonym system |
| **Deployment** | Vercel (frontend) + Render/Heroku (backend) |
| **Collaboration** | GitHub, Discord, Trello |

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js 18+ and npm/pnpm
- Python 3.12+
- MongoDB Atlas account
- GPT-5 API key (OpenAI)

### 1. Clone & Setup

```bash
git clone https://github.com/david15tonon/BreakIn.git
cd BreakIn
```

### 2. Backend Setup

```bash
cd Backend

# Virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac

# Dependencies
pip install -r requirements.txt

# Environment variables
cp .env.example .env
# Edit .env:
# MONGO_URI=mongodb+srv://your-cluster
# DB_NAME=breakin_hackathon
# GPT_API_KEY=your_gpt5_key

# Start server
uvicorn app.main:app --reload --port 8000
```

### 3. Frontend Setup

```bash
cd Frontend

# Dependencies
pnpm install

# Environment variables
cp .env.example .env.local
# NEXT_PUBLIC_API_URL=http://localhost:8000

# Start dev server
pnpm dev
```

### 🌐 Development URLs

- **Frontend**: <http://localhost:3000>
- **API Backend**: <http://localhost:8000>
- **API Docs**: <http://localhost:8000/docs>
- **SquadRoom**: <http://localhost:3000/squadroom>

---

## 🎮 Live Demo

### Complete User Flow

1. **Signup** → Automatic pseudonym generation
2. **SquadRoom** → Join available sprint
3. **Mission** → Receive GPT-5 generated challenge
4. **Development** → Collaborate with team (pseudonyms)
5. **Submission** → Upload solution + documentation
6. **Feedback** → AI + anonymous mentor evaluation
7. **Scoring** → Score ≥85% reveals identity to recruiters

### Example GPT-5 Mission

```markdown
🎯 Mission: "E-commerce Cart Microservice"
⏱️ Duration: 3 days
👥 Team: 4 developers (pseudonyms: Alpha, Bravo, Charlie, Delta)

📋 Objective:
Build a shopping cart microservice with:
- REST API (Node.js/Python)
- Database (your choice)
- Unit tests
- API documentation
- Docker containerization

💡 Evaluation Criteria:
- Code quality & architecture (30%)
- Collaboration & communication (25%)
- Tests & documentation (25%)
- Innovation & creativity (20%)
```

---

## 🏆 Hackathon Winning Strategy

1. **Impact** → bias-free recruitment = global meritocracy
2. **Smooth demo** → show full loop in ≤2 min
3. **Business angle** → SaaS B2B product for unbiased hiring
4. **Storytelling** → start with a discrimination anecdote

---

## 🔑 Core Differentiator: Performance > Paper

| Traditional Hiring (ATS) | Proof-of-Work Hiring (BreakIn) |
|--------------------------|--------------------------------|
| Filters by keyword/resumé | Filters by actual performance |
| Opaque ranking algorithms | Transparent sprint scoreboards |
| Ghosting and black boxes | Feedback-rich development loop |
| Slow, biased, and static | Real-time, merit-based, living ecosystem |

---

## 🌐 The New Learning-Working Loop

BreakIn Direct introduces the **Orbit Model**:

**Learn → Build → Lead → Mentor → Get Hired → Give Back**

Each developer graduates from mentee to contributor to mentor, growing the ecosystem while pulling others up—a self-sustaining talent loop that traditional HR pipelines can't replicate.

---

## 🤝 Contributing

### For the Hackathon

1. **Fork** the project
2. Pick a task from [Trello Board](https://trello.com/b/breakin-hackathon)
3. Create a branch (`feature/task-name`)
4. Develop & test
5. Pull Request with detailed description

### Guidelines

- **Code style**: Prettier (Frontend) + Black (Backend)
- **Commits**: Conventional format (`feat:`, `fix:`, `docs:`)
- **Tests**: Required for new features
- **Documentation**: Update README if API changes

---

## 💸 Revenue Strategy (Lean, Ethical, Scalable)

| Stream | Model |
|--------|-------|
| 💼 **Company subscriptions** | AI-matched talent dashboard |
| 🪙 **Sprint sponsorships** | Run branded simulation challenges |
| 🎓 **Education partnerships** | Institutions pay for guided student sprints |
| 🎖️ **Dev portfolio boosts** | Developers pay to enhance visibility post-sprint |
| 💻 **Hiring-as-a-service** | Managed hiring for startups & recruiters |

---

## 📞 Contact & Links

- **GitHub Repo**: [BreakIn Direct](https://github.com/david15tonon/BreakIn)
- **Live Demo**: [breakin-direct.vercel.app](https://breakin-direct.vercel.app)
- **Team Discord**: [Join](https://discord.gg/breakin-hackathon)
- **Pitch Video**: [YouTube](https://youtube.com/watch?v=breakin-pitch)

---

## 🎯 Vision

> **BreakIn Direct is not just a platform — it's a movement.**
> 
> A movement to restore trust in early-career hiring, to replace bias with evidence, and to prove that great talent doesn't need a perfect resumé — just a real chance to build.
> 
> **Let's stop hiring potential on paper and start hiring performance in action.**

---

<div align="center">

**BreakIn Direct** - Raising the talent floor for everyone — with proof, not promises 🚀

**#ProofOfWork #TalentRevolution #BiasFreehiring**

</div>
