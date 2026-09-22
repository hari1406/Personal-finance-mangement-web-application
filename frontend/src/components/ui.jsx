import React from "react";

export function Panel({ title, eyebrow, right, children, className = "" }) {
  return (
    <div className={`bg-slate-900/70 border border-slate-800 rounded-2xl p-5 md:p-6 backdrop-blur-sm animate-rise ${className}`}>
      {(title || right) && (
        <div className="flex items-center justify-between gap-3 mb-5">
          <div>
            {eyebrow && (
              <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-slate-500 font-semibold mb-1">
                {eyebrow}
              </p>
            )}
            {title && <h2 className="font-serif font-semibold text-lg text-slate-100">{title}</h2>}
          </div>
          {right}
        </div>
      )}
      {children}
    </div>
  );
}

export function PrimaryButton({ children, className = "", ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-1.5 bg-amber-400 hover:bg-amber-300 active:scale-[0.98] text-slate-950 font-semibold text-sm rounded-xl px-4 py-2.5 transition-all shadow-lg shadow-amber-500/10 disabled:opacity-50 disabled:pointer-events-none ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function GhostButton({ children, className = "", ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-1.5 bg-slate-800/70 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white font-semibold text-sm rounded-xl px-4 py-2.5 transition-all disabled:opacity-50 disabled:pointer-events-none ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function Input({ label, className = "", ...props }) {
  return (
    <label className="block">
      {label && <span className="block text-xs font-semibold text-slate-400 mb-1.5">{label}</span>}
      <input
        className={`w-full bg-slate-800/80 border border-slate-700 rounded-lg py-2.5 px-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400/60 focus:border-amber-400/60 transition ${className}`}
        {...props}
      />
    </label>
  );
}

export function Select({ label, className = "", children, ...props }) {
  return (
    <label className="block">
      {label && <span className="block text-xs font-semibold text-slate-400 mb-1.5">{label}</span>}
      <select
        className={`w-full bg-slate-800/80 border border-slate-700 rounded-lg py-2.5 px-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-400/60 focus:border-amber-400/60 transition cursor-pointer ${className}`}
        {...props}
      >
        {children}
      </select>
    </label>
  );
}

export function Badge({ children, tone = "slate" }) {
  const tones = {
    slate: "bg-slate-800 text-slate-300 border-slate-700",
    emerald: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20",
    rose: "bg-rose-400/10 text-rose-400 border-rose-400/20",
    amber: "bg-amber-400/10 text-amber-400 border-amber-400/20",
    sky: "bg-sky-400/10 text-sky-400 border-sky-400/20",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold border ${tones[tone]}`}>
      {children}
    </span>
  );
}

export function fmt(n) {
  return "₹" + Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 });
}
