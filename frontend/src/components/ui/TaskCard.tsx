import { Task } from "@/types";
import { Calendar, Trash2 } from "lucide-react";
import clsx from "clsx";

interface TaskCardProps {
  task: Task;
  onDelete?: (id: number) => void;
  onStatusChange?: (id: number, status: Task["status"]) => void;
}

const statusOptions: Task["status"][] = ["todo", "in_progress", "done"];
const statusLabels: Record<Task["status"], string> = {
  todo: "To Do", in_progress: "In Progress", done: "Done",
};
const statusClass: Record<Task["status"], string> = {
  todo: "badge-todo", in_progress: "badge-inprog", done: "badge-done",
};
const priorityClass: Record<Task["priority"], string> = {
  low: "badge-low", medium: "badge-medium", high: "badge-high",
};

export default function TaskCard({ task, onDelete, onStatusChange }: TaskCardProps) {
  return (
    <div className="card p-4 flex flex-col gap-3 hover:border-[#3a4660] transition-all duration-200">
      <div className="flex items-start justify-between gap-2">
        <p className={clsx("text-sm font-semibold leading-snug",
          task.status === "done" ? "line-through text-slate-500" : "text-slate-200")}>
          {task.title}
        </p>
        {onDelete && (
          <button onClick={() => onDelete(task.id)}
            className="text-slate-700 hover:text-red-400 transition-colors shrink-0 mt-0.5">
            <Trash2 size={14} />
          </button>
        )}
      </div>

      {task.description && (
        <p className="text-xs text-slate-600 line-clamp-2">{task.description}</p>
      )}

      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <span className={priorityClass[task.priority]}>{task.priority}</span>
          {onStatusChange ? (
            <select
              value={task.status}
              onChange={e => onStatusChange(task.id, e.target.value as Task["status"])}
              className="text-xs bg-surface-800 border border-[#2a3650] rounded-full px-2 py-0.5
                         text-slate-400 focus:outline-none focus:border-primary-500 cursor-pointer">
              {statusOptions.map(s => <option key={s} value={s}>{statusLabels[s]}</option>)}
            </select>
          ) : (
            <span className={statusClass[task.status]}>{statusLabels[task.status]}</span>
          )}
        </div>
        {task.due_date && (
          <span className="flex items-center gap-1 text-xs text-slate-600">
            <Calendar size={11} />
            {new Date(task.due_date).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  );
}
