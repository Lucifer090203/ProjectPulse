from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.db.database import get_db
from app.models.models import Project, Task, User, TaskStatus, ProjectStatus
from app.schemas.schemas import SummaryStats, TaskStatusStat, ProjectProgressStat
from app.core.security import get_current_user

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get("/summary", response_model=SummaryStats)
def get_summary(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    projects = db.query(Project).filter(Project.owner_id == current_user.id).all()
    tasks = db.query(Task).filter(Task.owner_id == current_user.id).all()

    total_tasks = len(tasks)
    completed = sum(1 for t in tasks if t.status == TaskStatus.done)
    in_progress = sum(1 for t in tasks if t.status == TaskStatus.in_progress)
    todo = sum(1 for t in tasks if t.status == TaskStatus.todo)
    active_projects = sum(1 for p in projects if p.status == ProjectStatus.active)

    return SummaryStats(
        total_projects=len(projects),
        active_projects=active_projects,
        total_tasks=total_tasks,
        completed_tasks=completed,
        in_progress_tasks=in_progress,
        todo_tasks=todo,
        completion_rate=round((completed / total_tasks * 100) if total_tasks > 0 else 0, 1),
    )


@router.get("/task-status", response_model=List[TaskStatusStat])
def get_task_status(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    tasks = db.query(Task).filter(Task.owner_id == current_user.id).all()
    counts = {s.value: 0 for s in TaskStatus}
    for t in tasks:
        counts[t.status.value] += 1
    return [TaskStatusStat(status=k, count=v) for k, v in counts.items()]


@router.get("/project-progress", response_model=List[ProjectProgressStat])
def get_project_progress(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    projects = db.query(Project).filter(Project.owner_id == current_user.id).all()
    result = []
    for p in projects:
        total = len(p.tasks)
        completed = sum(1 for t in p.tasks if t.status == TaskStatus.done)
        result.append(ProjectProgressStat(
            project=p.title,
            total=total,
            completed=completed,
            progress=round((completed / total * 100) if total > 0 else 0, 1),
        ))
    return result
