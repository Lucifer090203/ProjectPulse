"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import ProjectCard from "@/components/ui/ProjectCard";
import { Plus, X } from "lucide-react";
import api from "@/lib/api";
import { Project, ProjectStatus } from "@/types";

const statusOptions: { value: ProjectStatus; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "on_hold", label: "On Hold" },
  { value: "completed", label: "Completed" },
];

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", status: "active" as ProjectStatus, deadline: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) { router.push("/auth"); return; }
    fetchProjects();
  }, [router]);

  const fetchProjects = async () => {
    try { const { data } = await api.get("/projects/"); setProjects(data); }
    catch {} finally { setLoading(false); }
  };

  const createProject = async () => {
    setSaving(true);
    try {
      await api.post("/projects/", form);
      setShowModal(false);
      setForm({ title: "", description: "", status: "active", deadline: "" });
      fetchProjects();
    } catch {} finally { setSaving(false); }
  };

  const deleteProject = async (id: number) => {
    if (!confirm("Delete this project and all its tasks?")) return;
    await api.delete(`/projects/${id}`);
    setProjects(p => p.filter(x => x.id !== id));
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 pl-60">
        <Topbar />
        <main className="flex-1 p-8 overflow-auto">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <p className="text-slate-500 text-sm">{projects.length} project{projects.length !== 1 ? "s" : ""}</p>
              <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2 text-sm">
                <Plus size={16} /> New Project
              </button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-24">
                <p className="text-slate-600 text-lg font-medium mb-2">No projects yet</p>
                <p className="text-slate-700 text-sm mb-6">Create your first project to get started</p>
                <button onClick={() => setShowModal(true)} className="btn-primary">
                  Create Project
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.map(p => (
                  <ProjectCard key={p.id} project={p} onDelete={deleteProject} />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="card w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-white text-lg">New Project</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-600 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Title *</label>
                <input className="input" placeholder="Project name"
                  value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Description</label>
                <textarea className="input resize-none" rows={3} placeholder="What's this project about?"
                  value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Status</label>
                  <select className="input" value={form.status}
                    onChange={e => setForm(f => ({ ...f, status: e.target.value as ProjectStatus }))}>
                    {statusOptions.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Deadline</label>
                  <input className="input" type="date"
                    value={form.deadline} onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))} />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="btn-ghost flex-1">Cancel</button>
              <button onClick={createProject} disabled={!form.title || saving} className="btn-primary flex-1">
                {saving ? "Creating…" : "Create Project"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
