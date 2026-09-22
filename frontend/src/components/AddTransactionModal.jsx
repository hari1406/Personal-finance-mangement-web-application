import { useState } from "react";
import IncomeTab from "./IncomeTab";
import ExpenseTab from "./ExpenseTab";
import { FiX } from "react-icons/fi";

export default function AddTransactionModal({ close, onSaved }) {
  const [tab, setTab] = useState("income");

  const handleSaved = () => {
    onSaved?.();
    close();
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-fade"
      onMouseDown={(e) => e.target === e.currentTarget && close()}
    >
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-rise max-h-[92vh] flex flex-col">
        <div className="flex items-center justify-between px-6 pt-5">
          <h3 className="font-serif font-semibold text-lg text-slate-100">Add transaction</h3>
          <button onClick={close} className="w-8 h-8 rounded-lg hover:bg-slate-800 text-slate-400 flex items-center justify-center">
            <FiX size={16} />
          </button>
        </div>

        <div className="flex bg-slate-800/60 rounded-xl p-1 mx-6 mt-4">
          <button
            onClick={() => setTab("income")}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              tab === "income" ? "bg-emerald-400 text-slate-950" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Income
          </button>
          <button
            onClick={() => setTab("expense")}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              tab === "expense" ? "bg-rose-400 text-slate-950" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Expense
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {tab === "income" ? <IncomeTab onSaved={handleSaved} /> : <ExpenseTab onSaved={handleSaved} />}
        </div>
      </div>
    </div>
  );
}
