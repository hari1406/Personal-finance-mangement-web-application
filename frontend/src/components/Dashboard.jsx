import { useEffect, useState } from "react";
import { getTransactions } from "../services/api";
import { Panel, fmt } from "./ui";
import Summary from "./Summary";

export default function Dashboard() {
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [filter, setFilter] = useState("month");
  const [periodOpen, setPeriodOpen] = useState(false);

  const loadData = async () => {
    const res = await getTransactions();
    const data = res.data;
    const now = new Date();
    let inc = 0;
    let exp = 0;

    data.forEach((t) => {
      const d = new Date(t.date || t.createdAt);
      let valid = false;

      if (filter === "week") valid = now.getTime() - d.getTime() <= 7 * 24 * 60 * 60 * 1000;
      if (filter === "month") valid = d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      if (filter === "year") valid = d.getFullYear() === now.getFullYear();

      if (valid) {
        if (t.type === "income") inc += t.amount;
        if (t.type === "expense") exp += t.amount;
      }
    });

    setIncome(inc);
    setExpense(exp);
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const balance = income - expense;
  const labels = { week: "Weekly", month: "Monthly", year: "Yearly" };
  const max = Math.max(income, expense, 1);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
      {/* Dashboard Overview */}
      <Panel
        title="Dashboard Overview"
        right={
          <div className="relative">
            <button
              onClick={() => setPeriodOpen((s) => !s)}
              className="flex items-center gap-1.5 bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold rounded-lg px-3 py-1.5"
            >
              {labels[filter]} <span className="text-slate-500 text-[10px]">▾</span>
            </button>
            {periodOpen && (
              <div className="absolute right-0 top-9 bg-slate-800 border border-slate-700 rounded-lg py-1 min-w-28 z-40 shadow-xl">
                {["week", "month", "year"].map((p) => (
                  <button
                    key={p}
                    onClick={() => { setFilter(p); setPeriodOpen(false); }}
                    className={`w-full text-left px-3 py-1.5 text-xs font-medium hover:bg-slate-700 ${p === filter ? "text-amber-400" : "text-slate-300"}`}
                  >
                    {labels[p]}
                  </button>
                ))}
              </div>
            )}
          </div>
        }
      >
        <div className="divide-y divide-slate-800">
          <StatRow label="Income" value={income} color="text-emerald-400" dot="bg-emerald-400" />
          <StatRow label="Expense" value={expense} color="text-rose-400" dot="bg-rose-400" />
          <StatRow label="Balance" value={balance} color="text-amber-400" dot="bg-amber-400" />
        </div>
      </Panel>

      {/* Income vs Expense */}
      <Panel title="Income vs Expense">
        <div className="space-y-4">
          <CompareBar label="Income" value={income} max={max} color="bg-emerald-400" textColor="text-emerald-400" />
          <CompareBar label="Expense" value={expense} max={max} color="bg-rose-400" textColor="text-rose-400" />
          <div className="flex items-center justify-between pt-3 border-t border-dashed border-slate-800">
            <span className="text-sm font-semibold text-slate-300">Net balance</span>
            <span className="font-mono font-bold text-amber-400">{fmt(balance)}</span>
          </div>
        </div>
      </Panel>

      {/* Category Summary */}
      <Summary />
    </div>
  );
}

function StatRow({ label, value, color, dot }) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <span className="flex items-center gap-2 text-sm text-slate-400">
        <span className={`w-2 h-2 rounded-sm ${dot}`} />
        {label}
      </span>
      <span className={`font-mono font-bold ${color}`}>{fmt(value)}</span>
    </div>
  );
}

function CompareBar({ label, value, max, color, textColor }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1.5">
        <span className="font-semibold text-slate-400">{label}</span>
        <span className={`font-mono font-bold ${textColor}`}>{fmt(value)}</span>
      </div>
      <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all duration-500`}
          style={{ width: `${Math.min((value / max) * 100, 100)}%` }}
        />
      </div>
    </div>
  );
}
