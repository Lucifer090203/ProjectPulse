"use client";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TaskStatusStat } from "@/types";

const COLORS: Record<string, string> = {
  todo: "#64748b",
  in_progress: "#f59e0b",
  done: "#10b981",
};
const LABELS: Record<string, string> = {
  todo: "To Do",
  in_progress: "In Progress",
  done: "Done",
};

export default function TaskStatusChart({ data }: { data: TaskStatusStat[] }) {
  const formatted = data.map(d => ({ ...d, name: LABELS[d.status] ?? d.status, fill: COLORS[d.status] ?? "#888" }));
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie data={formatted} dataKey="count" cx="50%" cy="50%" outerRadius={90} paddingAngle={3} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          labelLine={false}>
          {formatted.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
        </Pie>
        <Tooltip
          contentStyle={{ background: "#0f172a", border: "1px solid #2a3650", borderRadius: 12, fontSize: 12 }}
          labelStyle={{ color: "#e2e8f0" }} itemStyle={{ color: "#94a3b8" }} />
        <Legend iconType="circle" iconSize={8}
          formatter={(value) => <span style={{ color: "#94a3b8", fontSize: 12 }}>{value}</span>} />
      </PieChart>
    </ResponsiveContainer>
  );
}
