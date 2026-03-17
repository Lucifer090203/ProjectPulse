"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import StatCard from "@/components/ui/StatCard";
import TaskCard from "@/components/ui/TaskCard";
import ProjectCard from "@/components/ui/ProjectCard";
import TaskStatusChart from "@/components/charts/TaskStatusChart";
import ProjectProgressChart from "@/components/charts/ProjectProgressChart";
import { FolderKanban, CheckSquare, TrendingUp, Clock, ListTodo, CheckCircle2 } from "lucide-react";
import api from "@/lib/api";
import { SummaryStats, Task, Project, TaskStatusStat, ProjectProgressStat } from "@/types";

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<SummaryStats | null>(null);
  const [recentTasks, setRecentTasks] = useState<Task[]>([]);
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [taskStatus, setTaskStatus] = useState<TaskStatusStat[]>([]);
  const [projectProgress, setProjectProgress] = useState<ProjectProgressStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) { router.push("/auth"); return; }
    const load = async () => {
      try {
        const [s, t, p, ts, pp] = await Promise.all([
          api.get("/analytics/summary"),
          api.get("/tasks/"),
          api.get("/projects/"),
          api.get("/analytics/task-status"),
          api.get("/analytics/project-progress"),
        ]);
        setStats(s.data);
        setRecentTasks(t.data.slice(0, 4));
        setRecentProjects(p.data.slice(0, 4));
        setTaskStatus(ts.data);
        setProjectProgress(pp.data);
      } catch {}
      finally { setLoading(false); }
    };
    load();
  }, [router]);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="flex-1 p-8 overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="max-w-6xl mx-auto space-y-8">
              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Total Projects" value={stats?.total_projects ?? 0} icon={<FolderKanban size={18} />} accent="blue"   sub={`${stats?.active_projects ?? 0} active`} />
                <StatCard label="Total Tasks"    value={stats?.total_tasks ?? 0}    icon={<ListTodo size={18} />}     accent="purple" sub={`${stats?.todo_tasks ?? 0} to do`} />
                <StatCard label="Completed"      value={stats?.completed_tasks ?? 0} icon={<CheckCircle2 size={18} />} accent="green" sub={`${stats?.completion_rate ?? 0}% rate`} />
                <StatCard label="In Progress"    value={stats?.in_progress_tasks ?? 0} icon={<Clock size={18} />}    accent="amber"  sub="tasks active" />
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card p-6">
                  <h2 className="text-white font-semibold mb-1">Task Status</h2>
                  <p className="text-slate-500 text-xs mb-4">Breakdown of all tasks</p>
                  {taskStatus.every(t => t.count === 0) ? (
                    <div className="flex flex-col items-center justify-center h-52 text-slate-600">
                      <ListTodo size={32} className="mb-2" />
                      <p className="text-sm">No tasks yet</p>
                    </div>
                  ) : (
                    <TaskStatusChart data={taskStatus} />
                  )}
                </div>
                <div className="card p-6">
                  <h2 className="text-white font-semibold mb-1">Project Progress</h2>
                  <p className="text-slate-500 text-xs mb-4">Task completion per project</p>
                  {projectProgress.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-52 text-slate-600">
                      <FolderKanban size={32} className="mb-2" />
                      <p className="text-sm">No projects yet</p>
                    </div>
                  ) : (
                    <ProjectProgressChart data={projectProgress} />
                  )}
                </div>
              </div>

              {/* Recent rows */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Tasks */}
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-bold text-white">Recent Tasks</h2>
                    <button onClick={() => router.push("/tasks")}
                      className="text-xs text-primary-400 hover:text-primary-300 font-medium transition-colors">
                      View all →
                    </button>
                  </div>
                  <div className="space-y-3">
                    {recentTasks.length === 0
                      ? <p className="text-slate-600 text-sm">No tasks yet. <button onClick={() => router.push("/tasks")} className="text-primary-400 hover:underline">Create one</button></p>
                      : recentTasks.map(t => <TaskCard key={t.id} task={t} />)}
                  </div>
                </section>

                {/* Recent Projects */}
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-bold text-white">Recent Projects</h2>
                    <button onClick={() => router.push("/projects")}
                      className="text-xs text-primary-400 hover:text-primary-300 font-medium transition-colors">
                      View all →
                    </button>
                  </div>
                  <div className="space-y-3">
                    {recentProjects.length === 0
                      ? <p className="text-slate-600 text-sm">No projects yet. <button onClick={() => router.push("/projects")} className="text-primary-400 hover:underline">Create one</button></p>
                      : recentProjects.map(p => <ProjectCard key={p.id} project={p} />)}
                  </div>
                </section>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}