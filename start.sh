#!/bin/bash
# ProjectPulse - Quick Start Script
# Run this from the project root: bash start.sh

echo "🚀 Starting ProjectPulse..."

# ── Backend ──────────────────────────────────────────────────
echo ""
echo "▶ Setting up Python backend..."
cd backend

if [ ! -d "venv" ]; then
  python3 -m venv venv
  echo "  ✓ Virtual environment created"
fi

source venv/bin/activate 2>/dev/null || . venv/Scripts/activate 2>/dev/null
pip install -r requirements.txt -q
echo "  ✓ Dependencies installed"

if [ ! -f ".env" ]; then
  cp .env.example .env
  echo "  ✓ .env file created (edit SECRET_KEY before production)"
fi

echo "  ✓ Starting FastAPI on http://localhost:8000 ..."
uvicorn app.main:app --reload --port 8000 &
BACKEND_PID=$!
cd ..

# ── Frontend ─────────────────────────────────────────────────
echo ""
echo "▶ Setting up Next.js frontend..."
cd frontend

if [ ! -f ".env.local" ]; then
  cp .env.local.example .env.local
  echo "  ✓ .env.local created"
fi

npm install --silent
echo "  ✓ npm packages installed"
echo "  ✓ Starting Next.js on http://localhost:3000 ..."
npm run dev &
FRONTEND_PID=$!
cd ..

# ── Done ─────────────────────────────────────────────────────
echo ""
echo "✅ ProjectPulse is running!"
echo "   Frontend  →  http://localhost:3000"
echo "   Backend   →  http://localhost:8000"
echo "   API Docs  →  http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop both servers."

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT
wait
