from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db.database import engine, Base
from app.routers import auth, projects, tasks, analytics

# Create all tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="ProjectPulse API",
    description="Full-stack Project & Task Management System — BTech Final Year Project",
    version="1.0.0",
)

# CORS — allow Next.js dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(projects.router)
app.include_router(tasks.router)
app.include_router(analytics.router)


@app.get("/", tags=["Health"])
def root():
    return {"message": "ProjectPulse API is running 🚀", "docs": "/docs"}
