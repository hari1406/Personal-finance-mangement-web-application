import { useState } from "react";
import DashboardPage from "./DashboardPage";
import AddTransactionModal from "../components/AddTransactionModal";
import { FiPlus } from "react-icons/fi";

export default function Home({ role }) {
  const [open, setOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <>
      <DashboardPage role={role} key={refreshKey} />

      {role === "admin" && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-5 py-3.5 rounded-full shadow-2xl shadow-amber-500/20 transition-all hover:scale-105 active:scale-95 z-20"
        >
          <FiPlus size={18} strokeWidth={2.5} /> Add
        </button>
      )}

      {open && (
        <AddTransactionModal
          close={() => setOpen(false)}
          onSaved={() => setRefreshKey((k) => k + 1)}
        />
      )}
    </>
  );
}
