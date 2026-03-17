export type TaskStatus = "todo" | "in_progress" | "done";
export type TaskPriority = "low" | "medium" | "high";
export type ProjectStatus = "active" | "completed" | "on_hold";

export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

export interface Project {
  id: number;
  title: string;
  description?: string;
  status: ProjectStatus;
  deadline?: string;
  created_at: string;
  task_count: number;
  completed_tasks: number;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  due_date?: string;
  created_at: string;
  project_id?: number;
}

export interface SummaryStats {
  total_projects: number;
  active_projects: number;
  total_tasks: number;
  completed_tasks: number;
  in_progress_tasks: number;
  todo_tasks: number;
  completion_rate: number;
}

export interface TaskStatusStat {
  status: string;
  count: number;
}

export interface ProjectProgressStat {
  project: string;
  total: number;
  completed: number;
  progress: number;
}
