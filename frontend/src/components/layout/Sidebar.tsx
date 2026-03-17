"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, FolderKanban, CheckSquare, BarChart2, LogOut } from "lucide-react";
import { clearAuth, getUser } from "@/lib/auth";
import clsx from "clsx";

const nav = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Projects",  href: "/projects",  icon: FolderKanban },
  { label: "Tasks",     href: "/tasks",     icon: CheckSquare },
  { label: "Analytics", href: "/analytics", icon: BarChart2 },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const user = getUser();

  const handleLogout = () => {
    clearAuth();
    router.push("/auth");
  };

  return (
    <aside className="w-64 min-h-screen bg-surface-900 border-r border-[#2a3650] flex flex-col shrink-0">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-[#2a3650]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <path d="M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
            </svg>
          </div>
          <span className="text-lg font-bold text-white tracking-tight">ProjectPulse</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {nav.map(({ label, href, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link key={href} href={href}
              className={clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                active
                  ? "bg-primary-500/15 text-primary-400 border border-primary-500/20"
                  : "text-slate-500 hover:text-slate-200 hover:bg-surface-800"
              )}>
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="px-3 py-4 border-t border-[#2a3650]">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-primary-500/20 border border-primary-500/30 flex items-center justify-center text-primary-400 font-bold text-sm shrink-0">
            {user?.name?.charAt(0)?.toUpperCase() ?? "U"}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-200 truncate">{user?.name ?? "User"}</p>
            <p className="text-xs text-slate-600 truncate">{user?.email ?? ""}</p>
          </div>
        </div>
        <button onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium
                     text-slate-500 hover:text-red-400 hover:bg-red-900/10 transition-all duration-200">
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
