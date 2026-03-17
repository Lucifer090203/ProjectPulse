"use client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { ProjectProgressStat } from "@/types";

export default function ProjectProgressChart({ data }: { data: ProjectProgressStat[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }} barSize={20}>
        <CartesianGrid strokeDasharray="3 3" stroke="#2a3650" />
        <XAxis dataKey="project" tick={{ fill: "#64748b", fontSize: 11 }}
               tickLine={false} axisLine={false}
               tickFormatter={v => v.length > 12 ? v.slice(0, 12) + "…" : v} />
        <YAxis tick={{ fill: "#64748b", fontSize: 11 }} tickLine={false} axisLine={false} />
        <Tooltip
          contentStyle={{ background: "#0f172a", border: "1px solid #2a3650", borderRadius: 12, fontSize: 12 }}
          labelStyle={{ color: "#e2e8f0" }} itemStyle={{ color: "#94a3b8" }} />
        <Legend iconType="circle" iconSize={8}
          formatter={(value) => <span style={{ color: "#94a3b8", fontSize: 12 }}>{value}</span>} />
        <Bar dataKey="total" name="Total Tasks" fill="#2a3650" radius={[4, 4, 0, 0]} />
        <Bar dataKey="completed" name="Completed" fill="#4f6ef7" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
