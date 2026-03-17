"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import TaskStatusChart from "@/components/charts/TaskStatusChart";
import ProjectProgressChart from "@/components/charts/ProjectProgressChart";
import api from "@/lib/api";
import { SummaryStats, TaskStatusStat, ProjectProgressStat } from "@/types";

export default function AnalyticsPage() {
  const router = useRouter();
  const [stats, setStats] = useState<SummaryStats | null>(null);
  const [taskStatus, setTaskStatus] = useState<TaskStatusStat[]>([]);
  const [projectProgress, setProjectProgress] = useState<ProjectProgressStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) { router.push("/auth"); return; }
    Promise.all([
      api.get("/analytics/summary").then(r => setStats(r.data)),
      api.get("/analytics/task-status").then(r => setTaskStatus(r.data)),
      api.get("/analytics/project-progress").then(r => setProjectProgress(r.data)),
    ]).finally(() => setLoading(false));
  }, [router]);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 pl-60">
        <Topbar />
        <main className="flex-1 p-8 overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="max-w-6xl mx-auto space-y-6">
              {/* Completion rate banner */}
              <div className="card p-6 flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p className="text-slate-500 text-sm font-medium">Overall Completion Rate</p>
                  <p className="text-4xl font-bold text-white mt-1">{stats?.completion_rate ?? 0}<span className="text-xl text-slate-500">%</span></p>
                </div>
                <div className="flex gap-6 flex-wrap">
                  {[
                    { label: "Projects", value: stats?.total_projects ?? 0, color: "text-blue-400" },
                    { label: "Tasks Done", value: stats?.completed_tasks ?? 0, color: "text-emerald-400" },
                    { label: "In Progress", value: stats?.in_progress_tasks ?? 0, color: "text-amber-400" },
                    { label: "To Do", value: stats?.todo_tasks ?? 0, color: "text-slate-400" },
                  ].map(item => (
                    <div key={item.label} className="text-center">
                      <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
                      <p className="text-xs text-slate-600 mt-0.5">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card p-6">
                  <h3 className="font-bold text-white mb-1">Task Status Breakdown</h3>
                  <p className="text-xs text-slate-600 mb-6">Distribution of tasks by current status</p>
                  <TaskStatusChart data={taskStatus} />
                </div>
                <div className="card p-6">
                  <h3 className="font-bold text-white mb-1">Project Progress</h3>
                  <p className="text-xs text-slate-600 mb-6">Tasks completed per project</p>
                  <ProjectProgressChart data={projectProgress} />
                </div>
              </div>

              {/* Project progress table */}
              {projectProgress.length > 0 && (
                <div className="card p-6">
                  <h3 className="font-bold text-white mb-4">Project Completion Details</h3>
                  <div className="space-y-4">
                    {projectProgress.map((p, i) => (
                      <div key={i}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-sm font-medium text-slate-300">{p.project}</span>
                          <span className="text-sm font-bold text-slate-400">
                            {p.completed}/{p.total} · <span className="text-primary-400">{p.progress}%</span>
                          </span>
                        </div>
                        <div className="h-2 bg-surface-800 rounded-full overflow-hidden">
                          <div className="h-full bg-primary-500 rounded-full transition-all duration-700"
                               style={{ width: `${p.progress}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
