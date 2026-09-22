import { useState, useEffect } from "react";
import { addTransaction, getAccounts } from "../services/api";
import { EXPENSE_CATEGORIES, DIVISIONS, nowForInput } from "../utils/categories";
import { Input, Select, PrimaryButton } from "./ui";

export default function ExpenseTab({ onSaved }) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [division, setDivision] = useState("personal");
  const [date, setDate] = useState(nowForInput());
  const [accounts, setAccounts] = useState([]);
  const [account, setAccount] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getAccounts()
      .then((res) => {
        setAccounts(res.data);
        if (res.data[0]) setAccount(res.data[0]._id);
      })
      .catch(() => {});
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");
    if (!account) {
      setError("Add an account first (see Accounts on the Home page).");
      return;
    }
    setSaving(true);
    try {
      await addTransaction({
        type: "expense",
        amount: Number(amount),
        description,
        category,
        division,
        date: new Date(date).toISOString(),
        account,
      });
      onSaved?.();
    } catch (err) {
      setError(err?.response?.data?.message || "Could not add expense");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submitHandler} className="space-y-4">
      <Input type="number" min="1" label="Amount *" placeholder="0" required value={amount} onChange={(e) => setAmount(e.target.value)} className="font-mono" />
      <Input type="datetime-local" label="Date & time *" required value={date} onChange={(e) => setDate(e.target.value)} />
      <Input label="Description" placeholder="One line description" value={description} onChange={(e) => setDescription(e.target.value)} />

      <div className="grid grid-cols-2 gap-3">
        <Select label="Category *" required value={category} onChange={(e) => setCategory(e.target.value)}>
          {EXPENSE_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </Select>
        <Select label="Division *" required value={division} onChange={(e) => setDivision(e.target.value)}>
          {DIVISIONS.map((d) => <option key={d} value={d}>{d[0].toUpperCase() + d.slice(1)}</option>)}
        </Select>
      </div>

      <Select label="Account *" required value={account} onChange={(e) => setAccount(e.target.value)}>
        {accounts.map((a) => <option key={a._id} value={a._id}>{a.name} · ₹{a.balance}</option>)}
      </Select>

      {error && <p className="text-rose-400 text-xs bg-rose-950/40 border border-rose-900 rounded-lg px-3 py-2">{error}</p>}

      <PrimaryButton disabled={saving} className="w-full py-3 mt-2 !bg-rose-400 hover:!bg-rose-300 !shadow-rose-500/10">
        {saving ? "Saving..." : "Add Expense"}
      </PrimaryButton>
    </form>
  );
}
