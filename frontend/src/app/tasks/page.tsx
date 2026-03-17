"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import TaskCard from "@/components/ui/TaskCard";
import { Plus, X } from "lucide-react";
import api from "@/lib/api";
import { Task, TaskStatus, TaskPriority, Project } from "@/types";

export default function TasksPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<TaskStatus | "all">("all");
  const [form, setForm] = useState({
    title: "", description: "", status: "todo" as TaskStatus,
    priority: "medium" as TaskPriority, due_date: "", project_id: "" as string,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) { router.push("/auth"); return; }
    Promise.all([
      api.get("/tasks/").then(r => setTasks(r.data)),
      api.get("/projects/").then(r => setProjects(r.data)),
    ]).finally(() => setLoading(false));
  }, [router]);

  const createTask = async () => {
    setSaving(true);
    try {
      const payload = { ...form, project_id: form.project_id ? Number(form.project_id) : null };
      const { data } = await api.post("/tasks/", payload);
      setTasks(t => [data, ...t]);
      setShowModal(false);
      setForm({ title: "", description: "", status: "todo", priority: "medium", due_date: "", project_id: "" });
    } catch {} finally { setSaving(false); }
  };

  const deleteTask = async (id: number) => {
    await api.delete(`/tasks/${id}`);
    setTasks(t => t.filter(x => x.id !== id));
  };

  const updateStatus = async (id: number, status: TaskStatus) => {
    await api.put(`/tasks/${id}`, { status });
    setTasks(ts => ts.map(t => t.id === id ? { ...t, status } : t));
  };

  const filtered = filterStatus === "all" ? tasks : tasks.filter(t => t.status === filterStatus);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 pl-60">
        <Topbar />
        <main className="flex-1 p-8 overflow-auto">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              {/* Filters */}
              <div className="flex items-center gap-2">
                {(["all", "todo", "in_progress", "done"] as const).map(s => (
                  <button key={s} onClick={() => setFilterStatus(s)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all duration-200 capitalize
                      ${filterStatus === s
                        ? "bg-primary-500 text-white"
                        : "bg-surface-800 text-slate-500 hover:text-slate-200"}`}>
                    {s === "all" ? "All" : s === "in_progress" ? "In Progress" : s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
              <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2 text-sm">
                <Plus size={16} /> New Task
              </button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-24">
                <p className="text-slate-600 text-lg font-medium mb-2">No tasks found</p>
                <button onClick={() => setShowModal(true)} className="btn-primary mt-2">Add Task</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map(t => (
                  <TaskCard key={t.id} task={t} onDelete={deleteTask} onStatusChange={updateStatus} />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Create Task Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="card w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-white text-lg">New Task</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-600 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Title *</label>
                <input className="input" placeholder="Task name"
                  value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Description</label>
                <textarea className="input resize-none" rows={2} placeholder="Optional details"
                  value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Priority</label>
                  <select className="input" value={form.priority}
                    onChange={e => setForm(f => ({ ...f, priority: e.target.value as TaskPriority }))}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Due Date</label>
                  <input className="input" type="date"
                    value={form.due_date} onChange={e => setForm(f => ({ ...f, due_date: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Project</label>
                <select className="input" value={form.project_id}
                  onChange={e => setForm(f => ({ ...f, project_id: e.target.value }))}>
                  <option value="">— No project —</option>
                  {projects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="btn-ghost flex-1">Cancel</button>
              <button onClick={createTask} disabled={!form.title || saving} className="btn-primary flex-1">
                {saving ? "Adding…" : "Add Task"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
