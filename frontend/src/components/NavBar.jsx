import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function NavBar({ current, onNavigate, role, onRoleChange }) {
  const { user, logout } = useAuth();
  const [roleOpen, setRoleOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center text-slate-950 font-bold font-serif text-sm">₹</div>
          <span className="font-serif italic text-lg text-amber-400 hidden sm:inline">Money Manager</span>
        </div>

        <nav className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-full p-1">
          <button
            onClick={() => onNavigate("home")}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition ${
              current === "home" ? "bg-amber-400 text-slate-950" : "text-slate-400 hover:text-white"
            }`}
          >
            Home
          </button>
          <button
            onClick={() => onNavigate("transactions")}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition ${
              current === "transactions" ? "bg-amber-400 text-slate-950" : "text-slate-400 hover:text-white"
            }`}
          >
            Transaction
          </button>
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <div className="relative hidden sm:block">
            <button
              onClick={() => setRoleOpen((s) => !s)}
              className="flex items-center gap-2 bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold rounded-full px-3.5 py-2"
            >
              <span className={`w-1.5 h-1.5 rounded-full ${role === "admin" ? "bg-emerald-400" : "bg-sky-400"}`} />
              {role === "admin" ? "Admin" : "Viewer"}
              <span className="text-slate-600 text-[10px]">▾</span>
            </button>
            {roleOpen && (
              <div className="absolute right-0 top-10 bg-slate-900 border border-slate-800 rounded-lg py-1 min-w-32 shadow-xl z-40">
                {["admin", "viewer"].map((r) => (
                  <button
                    key={r}
                    onClick={() => { onRoleChange(r); setRoleOpen(false); }}
                    className={`w-full text-left px-3 py-2 text-xs font-medium hover:bg-slate-800 capitalize ${r === role ? "text-amber-400" : "text-slate-300"}`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setMenuOpen((s) => !s)}
              className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 text-sm font-semibold"
            >
              {user?.email?.[0]?.toUpperCase() || "U"}
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-11 bg-slate-900 border border-slate-800 rounded-lg py-1 min-w-52 shadow-xl z-40">
                <p className="px-3 py-2 text-xs text-slate-500 truncate border-b border-slate-800">{user?.email}</p>
                <div className="sm:hidden px-3 py-2 border-b border-slate-800">
                  <select
                    value={role}
                    onChange={(e) => onRoleChange(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200"
                  >
                    <option value="admin">Admin</option>
                    <option value="viewer">Viewer</option>
                  </select>
                </div>
                <button onClick={logout} className="w-full text-left px-3 py-2 text-sm text-rose-400 hover:bg-slate-800">
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
