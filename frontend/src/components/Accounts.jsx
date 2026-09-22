import { useEffect, useState } from "react";
import { getAccounts, createAccount, updateAccount, transferAmount } from "../services/api";
import { Panel, PrimaryButton, GhostButton, fmt } from "./ui";
import { FiEdit2, FiCheck, FiX, FiPlus, FiRepeat, FiDollarSign } from "react-icons/fi";
import { PiBank } from "react-icons/pi";

export default function Accounts({ role }) {
  const [accounts, setAccounts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState({ name: "", balance: "" });

  const [adding, setAdding] = useState(false);
  const [newAcc, setNewAcc] = useState({ name: "", balance: "" });

  const [transferOpen, setTransferOpen] = useState(false);
  const [transfer, setTransfer] = useState({ fromAccount: "", toAccount: "", amount: "", description: "" });
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const res = await getAccounts();
      setAccounts(res.data);
    } catch {
      // no accounts yet
    }
  };

  useEffect(() => { load(); }, []);

  const startEdit = (a) => { setEditingId(a._id); setDraft({ name: a.name, balance: a.balance }); };
  const saveEdit = async () => {
    await updateAccount(editingId, { name: draft.name, balance: Number(draft.balance) });
    setEditingId(null);
    load();
  };

  const submitNewAccount = async (e) => {
    e.preventDefault();
    if (!newAcc.name.trim()) return;
    await createAccount({ name: newAcc.name.trim(), balance: Number(newAcc.balance) || 0 });
    setNewAcc({ name: "", balance: "" });
    setAdding(false);
    load();
  };

  const submitTransfer = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await transferAmount({
        fromAccount: transfer.fromAccount,
        toAccount: transfer.toAccount,
        amount: Number(transfer.amount),
        description: transfer.description,
      });
      setTransfer({ fromAccount: "", toAccount: "", amount: "", description: "" });
      setTransferOpen(false);
      load();
    } catch (err) {
      setError(err?.response?.data?.message || "Transfer failed");
    }
  };

  const iconFor = (name) => (name.toLowerCase().includes("bank") ? PiBank : FiDollarSign);

  return (
    <Panel title="Accounts" eyebrow="Balances">
      {accounts.length === 0 && (
        <p className="text-sm text-slate-500 mb-4">No accounts yet — add Cash or Bank below to get started.</p>
      )}

      <div className="flex flex-wrap justify-center gap-3">
        {accounts.map((a) => {
          const Icon = iconFor(a.name);
          return (
            <div key={a._id} className="flex items-center gap-3 bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 min-w-[190px]">
              <div className="w-10 h-10 rounded-lg bg-slate-700/70 flex items-center justify-center text-amber-400 shrink-0">
                <Icon size={17} />
              </div>

              {editingId === a._id ? (
                <div className="flex-1 space-y-1">
                  <input
                    value={draft.name}
                    onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-100"
                  />
                  <input
                    type="number"
                    value={draft.balance}
                    onChange={(e) => setDraft((d) => ({ ...d, balance: e.target.value }))}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs font-mono text-slate-100"
                  />
                </div>
              ) : (
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">{a.name}</p>
                  <p className="font-mono font-bold text-slate-100 text-sm mt-0.5">{fmt(a.balance)}</p>
                </div>
              )}

              {role === "admin" && (
                editingId === a._id ? (
                  <button onClick={saveEdit} className="w-8 h-8 rounded-lg bg-emerald-400 text-slate-950 flex items-center justify-center shrink-0">
                    <FiCheck size={14} />
                  </button>
                ) : (
                  <button onClick={() => startEdit(a)} className="w-8 h-8 rounded-lg border border-slate-700 text-slate-400 hover:text-amber-400 hover:border-amber-400/60 flex items-center justify-center shrink-0 transition-colors">
                    <FiEdit2 size={14} />
                  </button>
                )
              )}
            </div>
          );
        })}

        {role === "admin" && (
          adding ? (
            <form onSubmit={submitNewAccount} className="flex items-center gap-2 bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3">
              <input
                placeholder="Name"
                value={newAcc.name}
                onChange={(e) => setNewAcc((s) => ({ ...s, name: e.target.value }))}
                className="w-24 bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-xs text-slate-100"
              />
              <input
                placeholder="Balance"
                type="number"
                value={newAcc.balance}
                onChange={(e) => setNewAcc((s) => ({ ...s, balance: e.target.value }))}
                className="w-20 bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-xs font-mono text-slate-100"
              />
              <button className="w-8 h-8 rounded-lg bg-emerald-400 text-slate-950 flex items-center justify-center"><FiCheck size={14} /></button>
              <button type="button" onClick={() => setAdding(false)} className="w-8 h-8 rounded-lg border border-slate-700 text-slate-400 flex items-center justify-center"><FiX size={14} /></button>
            </form>
          ) : (
            <PrimaryButton onClick={() => setAdding(true)}>
              <FiPlus size={15} /> Add account
            </PrimaryButton>
          )
        )}

        {role === "admin" && accounts.length >= 2 && (
          <GhostButton onClick={() => setTransferOpen(true)} className="!bg-sky-400/10 !border-sky-400/20 !text-sky-400 hover:!bg-sky-400/20">
            <FiRepeat size={14} /> Transfer
          </GhostButton>
        )}
      </div>

      {transferOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-sm rounded-2xl shadow-2xl p-6 animate-rise">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-serif font-semibold text-lg text-slate-100">Transfer between accounts</h3>
              <button onClick={() => setTransferOpen(false)} className="w-8 h-8 rounded-lg hover:bg-slate-800 text-slate-400 flex items-center justify-center">
                <FiX size={16} />
              </button>
            </div>
            <form onSubmit={submitTransfer} className="space-y-3.5">
              <select
                required
                value={transfer.fromAccount}
                onChange={(e) => setTransfer((t) => ({ ...t, fromAccount: e.target.value }))}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-lg py-2.5 px-3 text-sm text-slate-100"
              >
                <option value="">From account</option>
                {accounts.map((a) => <option key={a._id} value={a._id}>{a.name} · {fmt(a.balance)}</option>)}
              </select>
              <select
                required
                value={transfer.toAccount}
                onChange={(e) => setTransfer((t) => ({ ...t, toAccount: e.target.value }))}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-lg py-2.5 px-3 text-sm text-slate-100"
              >
                <option value="">To account</option>
                {accounts.map((a) => <option key={a._id} value={a._id}>{a.name} · {fmt(a.balance)}</option>)}
              </select>
              <input
                type="number" required min="1" placeholder="Amount"
                value={transfer.amount}
                onChange={(e) => setTransfer((t) => ({ ...t, amount: e.target.value }))}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-lg py-2.5 px-3 text-sm text-slate-100 font-mono"
              />
              <input
                placeholder="Note (optional)"
                value={transfer.description}
                onChange={(e) => setTransfer((t) => ({ ...t, description: e.target.value }))}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-lg py-2.5 px-3 text-sm text-slate-100"
              />
              {error && <p className="text-rose-400 text-xs bg-rose-950/40 border border-rose-900 rounded-lg px-3 py-2">{error}</p>}
              <div className="flex gap-3 pt-1">
                <GhostButton type="button" onClick={() => setTransferOpen(false)} className="flex-1 justify-center">Cancel</GhostButton>
                <button className="flex-1 bg-sky-400 hover:bg-sky-300 text-slate-950 font-semibold text-sm rounded-xl transition-all">Transfer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Panel>
  );
}
