import { useCallback, useEffect, useMemo, useState } from "react";
import Filters from "../components/Filters";
import TransactionHistory from "../components/TransactionHistory";
import { getTransactions } from "../services/api";
import { GhostButton } from "../components/ui";
import { FiArrowLeft } from "react-icons/fi";

const toDateInputValue = (d) => {
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

export default function TransactionPage({ onBack, role }) {
  // Fetched once here and shared by both Filters (to know the earliest
  // transaction date) and TransactionHistory (to display/filter locally),
  // so there's still only one database call for the whole page.
  const [allTransactions, setAllTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ from: null, to: null, type: null, category: null, division: null });

  const loadTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getTransactions();
      setAllTransactions(res.data);
    } catch {
      console.error("Error loading transactions");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  // Earliest transaction ever recorded -> default "From" date for the filter.
  const earliestDate = useMemo(() => {
    if (allTransactions.length === 0) return null;
    const earliest = allTransactions.reduce((min, t) => {
      const d = new Date(t.date || t.createdAt);
      return d < min ? d : min;
    }, new Date(allTransactions[0].date || allTransactions[0].createdAt));
    return toDateInputValue(earliest);
  }, [allTransactions]);

  return (
    <div className="space-y-6 animate-fade">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-semibold text-slate-100">Transactions</h1>
        <GhostButton onClick={onBack}>
          <FiArrowLeft size={14} /> Back
        </GhostButton>
      </div>

      <Filters onFilterChange={setFilters} earliestDate={earliestDate} />
      <TransactionHistory
        transactions={allTransactions}
        loading={loading}
        filters={filters}
        role={role}
        onReload={loadTransactions}
      />
    </div>
  );
}
