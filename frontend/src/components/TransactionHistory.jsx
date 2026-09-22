import { useMemo, useState } from "react";
import { updateTransaction, deleteTransaction } from "../services/api";
import { formatDate } from "../utils/dateUtils";
import { Panel, Badge, fmt } from "./ui";
import { FiEdit2, FiTrash2, FiCheck, FiX, FiRepeat, FiArrowUpRight, FiArrowDownRight } from "react-icons/fi";

const ICONS = {
  Food: "🍔", Fuel: "⛽", Movie: "🎬", Medical: "💊", Loan: "💳",
  Shopping: "🛍️", Bills: "🧾", Groceries: "🛒", Salary: "💼",
  Freelance: "🧑‍💻", Investment: "📈", Gift: "🎁",
};

// `transactions` (the full unfiltered list) and `loading` are fetched once
// by the parent (TransactionPage) and passed down here — filtering itself
// is pure client-side math via useMemo, so it never touches the database.
export default function TransactionHistory({ transactions: allTransactions, loading, filters, role, onReload }) {
  const [editId, setEditId] = useState(null);
  const [editDraft, setEditDraft] = useState({ amount: "", description: "" });

  const transactions = useMemo(() => {
    return (allTransactions || []).filter((t) => {
      if (filters?.type && t.type !== filters.type) return false;
      if (filters?.category && t.category !== filters.category) return false;
      if (filters?.division && t.division !== filters.division) return false;

      const txnDate = new Date(t.date || t.createdAt);
      if (filters?.from && txnDate < new Date(filters.from)) return false;
      if (filters?.to && txnDate > new Date(filters.to + "T23:59:59")) return false;

      return true;
    });
  }, [allTransactions, filters]);

  const canEdit = (createdAt) => Date.now() - new Date(createdAt).getTime() <= 12 * 60 * 60 * 1000;

  const startEdit = (t) => {
    setEditId(t._id);
    setEditDraft({ amount: t.amount, description: t.description || "" });
  };

  const saveEdit = async (id) => {
    try {
      await updateTransaction(id, { amount: Number(editDraft.amount), description: editDraft.description });
      setEditId(null);
      onReload?.(); // data actually changed, so refetch from the DB
    } catch (err) {
      alert(err?.response?.data?.message || "Editing allowed only within 12 hours");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this transaction? This will also correct the account balance.")) return;
    try {
      await deleteTransaction(id);
      onReload?.(); // data actually changed, so refetch from the DB
    } catch {
      alert("Could not delete transaction");
    }
  };

  return (
    <Panel
      title="History"
      eyebrow="Ledger"
      right={<span className="text-xs text-slate-500 font-mono">{transactions.length} entries</span>}
    >
      {loading ? (
        <p className="text-slate-500 text-sm text-center py-8">Loading...</p>
      ) : transactions.length === 0 ? (
        <p className="text-slate-500 text-sm text-center py-8">No transactions found.</p>
      ) : (
        <div className="divide-y divide-slate-800/80 -mx-2">
          {transactions.map((t) => {
            const isTransfer = t.type === "transfer";
            const tone = t.type === "income" ? "emerald" : t.type === "expense" ? "rose" : "sky";
            return (
              <div key={t._id} className="flex flex-col md:flex-row md:items-center justify-between gap-3 px-2 py-3.5 hover:bg-slate-800/30 rounded-lg transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-base shrink-0 ${
                    tone === "emerald" ? "bg-emerald-400/10" : tone === "rose" ? "bg-rose-400/10" : "bg-sky-400/10"
                  }`}>
                    {isTransfer ? <FiRepeat className="text-sky-400" size={15} /> : (ICONS[t.category] || "🔹")}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-100 truncate">
                      {isTransfer ? `Transfer: ${t.fromAccount?.name || "?"} → ${t.toAccount?.name || "?"}` : t.category}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5 truncate">
                      {formatDate(t.date || t.createdAt)}
                      {!isTransfer && <> · {t.division} · {t.account?.name || "—"}</>}
                      {t.description && <> · {t.description}</>}
                    </p>
                  </div>
                </div>

                {editId === t._id ? (
                  <div className="flex flex-wrap items-center gap-2 pl-12 md:pl-0">
                    <input
                      type="number"
                      className="bg-slate-800 border border-amber-400/60 w-24 px-2 py-1.5 rounded-lg text-sm text-slate-100 focus:outline-none"
                      value={editDraft.amount}
                      onChange={(e) => setEditDraft((d) => ({ ...d, amount: e.target.value }))}
                    />
                    <input
                      type="text"
                      className="bg-slate-800 border border-amber-400/60 w-40 px-2 py-1.5 rounded-lg text-sm text-slate-100 focus:outline-none"
                      placeholder="Description"
                      value={editDraft.description}
                      onChange={(e) => setEditDraft((d) => ({ ...d, description: e.target.value }))}
                    />
                    <button onClick={() => saveEdit(t._id)} className="w-8 h-8 rounded-lg bg-emerald-400 text-slate-950 flex items-center justify-center">
                      <FiCheck size={14} />
                    </button>
                    <button onClick={() => setEditId(null)} className="w-8 h-8 rounded-lg border border-slate-700 text-slate-400 flex items-center justify-center">
                      <FiX size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 pl-12 md:pl-0 shrink-0">
                    <span className={`font-mono font-bold text-sm flex items-center gap-1 ${
                      tone === "emerald" ? "text-emerald-400" : tone === "rose" ? "text-rose-400" : "text-sky-400"
                    }`}>
                      {t.type === "income" ? <FiArrowUpRight size={13} /> : t.type === "expense" ? <FiArrowDownRight size={13} /> : <FiRepeat size={13} />}
                      {fmt(t.amount)}
                    </span>

                    {role === "admin" && !isTransfer && (
                      canEdit(t.createdAt) ? (
                        <button onClick={() => startEdit(t)} className="w-8 h-8 rounded-lg border border-slate-700 text-slate-400 hover:text-amber-400 hover:border-amber-400/60 flex items-center justify-center transition-colors">
                          <FiEdit2 size={13} />
                        </button>
                      ) : (
                        <Badge tone="slate">Locked</Badge>
                      )
                    )}
                    {role === "admin" && (
                      <button onClick={() => handleDelete(t._id)} className="w-8 h-8 rounded-lg border border-slate-700 text-slate-400 hover:text-rose-400 hover:border-rose-400/60 flex items-center justify-center transition-colors">
                        <FiTrash2 size={13} />
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Panel>
  );
}
