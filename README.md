# 🚀 ProjectPulse — BTech Final Year Project

**ProjectPulse** is a full-stack Project & Task Management Dashboard built with:
- **Backend**: Python (FastAPI) + SQLite (via SQLAlchemy) + JWT Auth
- **Frontend**: Next.js 14 (App Router) + Tailwind CSS + Recharts

---

## 📁 Project Structure

```
project-pulse/
├── backend/                  # Python FastAPI backend
│   ├── app/
│   │   ├── main.py           # FastAPI app entry point
│   │   ├── core/
│   │   │   ├── config.py     # App settings
│   │   │   └── security.py   # JWT + password hashing
│   │   ├── db/
│   │   │   └── database.py   # SQLAlchemy DB setup
│   │   ├── models/
│   │   │   └── models.py     # DB models (User, Project, Task)
│   │   ├── schemas/
│   │   │   └── schemas.py    # Pydantic schemas
│   │   └── routers/
│   │       ├── auth.py       # Login / Register
│   │       ├── projects.py   # Project CRUD
│   │       ├── tasks.py      # Task CRUD
│   │       └── analytics.py  # Dashboard stats
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/                 # Next.js 14 frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx          # Landing / redirect
│   │   │   ├── auth/
│   │   │   │   └── page.tsx      # Login + Register
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx      # Main dashboard
│   │   │   ├── projects/
│   │   │   │   └── page.tsx      # Projects list
│   │   │   └── analytics/
│   │   │       └── page.tsx      # Charts & analytics
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   └── Topbar.tsx
│   │   │   ├── charts/
│   │   │   │   ├── TaskStatusChart.tsx
│   │   │   │   └── ProjectProgressChart.tsx
│   │   │   └── ui/
│   │   │       ├── TaskCard.tsx
│   │   │       ├── ProjectCard.tsx
│   │   │       └── StatCard.tsx
│   │   ├── lib/
│   │   │   ├── api.ts            # Axios API client
│   │   │   └── auth.ts           # Auth helpers
│   │   └── types/
│   │       └── index.ts          # TypeScript types
│   ├── package.json
│   ├── tailwind.config.ts
│   └── next.config.js
│
└── README.md
```

---

## ⚙️ Prerequisites

| Tool | Version |
|------|---------|
| Python | 3.10+ |
| Node.js | 18+ |
| npm / yarn | Latest |

---

## 🐍 Backend Setup (FastAPI)

### 1. Navigate to backend
```bash
cd project-pulse/backend
```

### 2. Create and activate virtual environment
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS / Linux
python3 -m venv venv
source venv/bin/activate
```

### 3. Install dependencies
```bash
pip install -r requirements.txt
```

### 4. Create `.env` file
```bash
cp .env.example .env
```
Edit `.env`:
```
SECRET_KEY=your-super-secret-key-change-this
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
```

### 5. Run the backend
```bash
uvicorn app.main:app --reload --port 8000
```

Backend runs at: **http://localhost:8000**  
API Docs (Swagger): **http://localhost:8000/docs**

---

## ⚛️ Frontend Setup (Next.js)

### 1. Navigate to frontend
```bash
cd project-pulse/frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create `.env.local`
```bash
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
```

### 4. Run the frontend
```bash
npm run dev
```

Frontend runs at: **http://localhost:3000**

---

## 🔐 Default Test Credentials

After starting the backend, register a new user via:
- **UI**: http://localhost:3000/auth
- **API**: POST http://localhost:8000/auth/register

---

## 🌟 Features

- ✅ **JWT Authentication** — Register, Login, Protected routes
- ✅ **Project Management** — Create, update, delete projects with status tracking
- ✅ **Task Management** — Assign tasks to projects, set priority & due dates
- ✅ **Analytics Dashboard** — Pie charts, bar charts, progress tracking
- ✅ **REST API** — Full CRUD with FastAPI + auto Swagger docs
- ✅ **Responsive UI** — Works on desktop and mobile

---

## 📊 API Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login, returns JWT token |
| GET | `/projects/` | List all projects |
| POST | `/projects/` | Create project |
| PUT | `/projects/{id}` | Update project |
| DELETE | `/projects/{id}` | Delete project |
| GET | `/tasks/` | List all tasks |
| POST | `/tasks/` | Create task |
| PUT | `/tasks/{id}` | Update task |
| DELETE | `/tasks/{id}` | Delete task |
| GET | `/analytics/summary` | Dashboard stats |
| GET | `/analytics/task-status` | Task status breakdown |
| GET | `/analytics/project-progress` | Per-project progress |

---

## 🎓 Academic Information

| Field | Details |
|-------|---------|
| Project Title | ProjectPulse — Full Stack Project Management System |
| Technology Stack | Python (FastAPI), Next.js 14, SQLAlchemy, JWT, Recharts |
| Domain | Web Development / Software Engineering |
| Type | Full Stack Web Application |

---

## 📝 License

This project is built for academic purposes.
