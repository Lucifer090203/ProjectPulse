"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { setAuth } from "@/lib/auth";

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      if (mode === "register") {
        const { data } = await api.post("/auth/register", {
          name: form.name, email: form.email, password: form.password,
        });
        setAuth(data.access_token, data.user);
      } else {
        const params = new URLSearchParams();
        params.append("username", form.email);
        params.append("password", form.password);
        const { data } = await api.post("/auth/login", params, {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });
        setAuth(data.access_token, data.user);
      }
      router.push("/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
         style={{ background: "radial-gradient(ellipse at 60% 0%, #1a2d6e22 0%, transparent 60%), #090e1a" }}>

      {/* Logo / Brand */}
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
              </svg>
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">ProjectPulse</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {mode === "login" ? "Welcome back" : "Create account"}
          </h1>
          <p className="text-slate-500 text-sm">
            {mode === "login"
              ? "Sign in to your workspace"
              : "Start managing your projects today"}
          </p>
        </div>

        {/* Card */}
        <div className="card p-8">
          <div className="flex bg-surface-800 rounded-xl p-1 mb-8">
            {(["login", "register"] as const).map((m) => (
              <button key={m} onClick={() => { setMode(m); setError(""); }}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200 capitalize
                  ${mode === m ? "bg-primary-500 text-white shadow" : "text-slate-400 hover:text-white"}`}>
                {m === "login" ? "Sign In" : "Register"}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {mode === "register" && (
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Full Name</label>
                <input className="input" placeholder="John Doe"
                  value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Email</label>
              <input className="input" type="email" placeholder="you@example.com"
                value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Password</label>
              <input className="input" type="password" placeholder="••••••••"
                value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                onKeyDown={e => e.key === "Enter" && handleSubmit()} />
            </div>
          </div>

          {error && (
            <div className="mt-4 bg-red-900/30 border border-red-700/50 text-red-400 text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <button onClick={handleSubmit} disabled={loading} className="btn-primary w-full mt-6 py-3">
            {loading
              ? <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {mode === "login" ? "Signing in..." : "Creating account..."}
                </span>
              : (mode === "login" ? "Sign In" : "Create Account")}
          </button>
        </div>

        <p className="text-center text-slate-600 text-xs mt-6">
          BTech Final Year Project · ProjectPulse v1.0
        </p>
      </div>
    </div>
  );
}
