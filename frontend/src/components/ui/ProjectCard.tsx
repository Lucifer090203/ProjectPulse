import { Project } from "@/types";
import { Calendar, Trash2, CheckCircle2 } from "lucide-react";
import clsx from "clsx";

interface ProjectCardProps {
  project: Project;
  onDelete?: (id: number) => void;
  onClick?: (id: number) => void;
}

const statusStyles: Record<Project["status"], string> = {
  active:    "bg-emerald-900/30 text-emerald-400 border border-emerald-800/30",
  completed: "bg-blue-900/30 text-blue-400 border border-blue-800/30",
  on_hold:   "bg-amber-900/30 text-amber-400 border border-amber-800/30",
};
const statusLabels: Record<Project["status"], string> = {
  active: "Active", completed: "Completed", on_hold: "On Hold",
};

export default function ProjectCard({ project, onDelete, onClick }: ProjectCardProps) {
  const progress = project.task_count > 0
    ? Math.round((project.completed_tasks / project.task_count) * 100)
    : 0;

  return (
    <div className="card p-5 flex flex-col gap-4 cursor-pointer hover:border-[#3a4660] transition-all duration-200"
         onClick={() => onClick?.(project.id)}>
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-slate-200 text-sm leading-snug">{project.title}</h3>
          {project.description && (
            <p className="text-xs text-slate-600 mt-1 line-clamp-2">{project.description}</p>
          )}
        </div>
        {onDelete && (
          <button onClick={e => { e.stopPropagation(); onDelete(project.id); }}
            className="text-slate-700 hover:text-red-400 transition-colors shrink-0">
            <Trash2 size={14} />
          </button>
        )}
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-slate-600">Progress</span>
          <span className="text-xs font-semibold text-slate-400">{progress}%</span>
        </div>
        <div className="h-1.5 bg-surface-800 rounded-full overflow-hidden">
          <div className="h-full bg-primary-500 rounded-full transition-all duration-500"
               style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span className={clsx("text-xs font-medium px-2.5 py-1 rounded-full", statusStyles[project.status])}>
          {statusLabels[project.status]}
        </span>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-xs text-slate-600">
            <CheckCircle2 size={12} />
            {project.completed_tasks}/{project.task_count} tasks
          </span>
          {project.deadline && (
            <span className="flex items-center gap-1 text-xs text-slate-600">
              <Calendar size={11} />
              {new Date(project.deadline).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
