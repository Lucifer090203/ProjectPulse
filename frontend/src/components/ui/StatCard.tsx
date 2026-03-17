import { ReactNode } from "react";
import clsx from "clsx";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  accent?: "blue" | "green" | "amber" | "purple";
  sub?: string;
}

const colors = {
  blue:   { bg: "bg-blue-900/20",    border: "border-blue-800/30",    iconColor: "text-blue-400"   },
  green:  { bg: "bg-emerald-900/20", border: "border-emerald-800/30", iconColor: "text-emerald-400"},
  amber:  { bg: "bg-amber-900/20",   border: "border-amber-800/30",   iconColor: "text-amber-400"  },
  purple: { bg: "bg-purple-900/20",  border: "border-purple-800/30",  iconColor: "text-purple-400" },
};

export default function StatCard({ label, value, icon, accent = "blue", sub }: StatCardProps) {
  const c = colors[accent];
  return (
    <div className="card p-6 flex items-start gap-4">
      <div className={clsx(
        "w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border",
        c.bg, c.border, c.iconColor
      )}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-slate-500 font-medium">{label}</p>
        <p className="text-2xl font-bold text-white mt-0.5">{value}</p>
        {sub && <p className="text-xs text-slate-600 mt-1">{sub}</p>}
      </div>
    </div>
  );
}
