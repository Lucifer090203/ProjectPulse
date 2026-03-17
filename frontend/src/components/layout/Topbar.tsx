"use client";
import { usePathname } from "next/navigation";

const titles: Record<string, { title: string; subtitle: string }> = {
  "/dashboard": { title: "Dashboard",  subtitle: "Overview of your workspace" },
  "/projects":  { title: "Projects",   subtitle: "Manage your projects" },
  "/tasks":     { title: "Tasks",      subtitle: "Track your tasks" },
  "/analytics": { title: "Analytics",  subtitle: "Charts & insights" },
};

export default function Topbar() {
  const pathname = usePathname();
  const found = Object.entries(titles).find(([k]) => pathname.startsWith(k));
  const { title, subtitle } = found?.[1] ?? { title: "ProjectPulse", subtitle: "" };

  return (
    <header className="h-16 border-b border-[#2a3650] flex items-center px-8 bg-surface-950/80 backdrop-blur shrink-0">
      <div>
        <h1 className="text-lg font-bold text-white leading-tight">{title}</h1>
        <p className="text-xs text-slate-500">{subtitle}</p>
      </div>
    </header>
  );
}
