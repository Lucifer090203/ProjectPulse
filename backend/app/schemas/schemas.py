from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from app.models.models import TaskStatus, TaskPriority, ProjectStatus


# ─── User Schemas ────────────────────────────────────────────

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    name: str
    email: str
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserOut


# ─── Project Schemas ─────────────────────────────────────────

class ProjectCreate(BaseModel):
    title: str
    description: Optional[str] = None
    status: ProjectStatus = ProjectStatus.active
    deadline: Optional[str] = None


class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[ProjectStatus] = None
    deadline: Optional[str] = None


class ProjectOut(BaseModel):
    id: int
    title: str
    description: Optional[str]
    status: ProjectStatus
    deadline: Optional[str]
    created_at: datetime
    task_count: Optional[int] = 0
    completed_tasks: Optional[int] = 0

    class Config:
        from_attributes = True


# ─── Task Schemas ─────────────────────────────────────────────

class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    status: TaskStatus = TaskStatus.todo
    priority: TaskPriority = TaskPriority.medium
    due_date: Optional[str] = None
    project_id: Optional[int] = None


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[TaskStatus] = None
    priority: Optional[TaskPriority] = None
    due_date: Optional[str] = None
    project_id: Optional[int] = None


class TaskOut(BaseModel):
    id: int
    title: str
    description: Optional[str]
    status: TaskStatus
    priority: TaskPriority
    due_date: Optional[str]
    created_at: datetime
    project_id: Optional[int]

    class Config:
        from_attributes = True


# ─── Analytics Schemas ───────────────────────────────────────

class SummaryStats(BaseModel):
    total_projects: int
    active_projects: int
    total_tasks: int
    completed_tasks: int
    in_progress_tasks: int
    todo_tasks: int
    completion_rate: float


class TaskStatusStat(BaseModel):
    status: str
    count: int


class ProjectProgressStat(BaseModel):
    project: str
    total: int
    completed: int
    progress: float
