import { useEffect, useState } from "react";
import { getCategorySummary } from "../services/api";
import { Panel, fmt } from "./ui";

const ICONS = {
  Food: "🍔", Fuel: "⛽", Movie: "🎬", Medical: "💊", Loan: "💳",
  Shopping: "🛍️", Bills: "🧾", Groceries: "🛒", "Other Expense": "📦",
};

export default function Summary() {
  const [summary, setSummary] = useState([]);

  const loadSummary = async () => {
    const res = await getCategorySummary();
    setSummary(res.data);
  };

  useEffect(() => {
    loadSummary();
  }, []);

  const max = summary[0]?.total || 1;

  return (
    <Panel title="Category Summary">
      {summary.length === 0 ? (
        <p className="text-xs text-slate-500 leading-relaxed">No expenses recorded yet.</p>
      ) : (
        <div className="space-y-3">
          {summary.slice(0, 6).map((s) => (
            <div key={s._id} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-sm shrink-0">
                {ICONS[s._id] || "🔹"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">{s._id}</span>
                  <span className="font-mono text-slate-200">{fmt(s.total)}</span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-amber-400 transition-all duration-500"
                    style={{ width: `${(s.total / max) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Panel>
  );
}
