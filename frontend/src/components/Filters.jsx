import { useEffect, useRef, useState } from "react";
import { ALL_CATEGORIES } from "../utils/categories";
import { Panel, Select, Input, GhostButton } from "./ui";
import { FiFilter } from "react-icons/fi";

const pad = (n) => String(n).padStart(2, "0");
const toDateInputValue = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const today = () => toDateInputValue(new Date());

// All filtering happens client-side against the already-loaded transaction
// list (see TransactionHistory.jsx), so every change here is instant and
// never touches the database.
//
// Defaults: "From" starts at the date of the very first transaction ever
// recorded (passed in as `earliestDate` once the parent has loaded the
// data); "To" always starts at today and stays pinned to today
// automatically unless the user manually picks a different end date.
export default function Filters({ onFilterChange, earliestDate }) {
  const [fromDate, setFromDate] = useState(earliestDate || "");
  const [toDate, setToDate] = useState(today());
  const [category, setCategory] = useState("All Categories");
  const [division, setDivision] = useState("");
  const [type, setType] = useState(null);

  const fromTouched = useRef(false);
  const toTouched = useRef(false);

  const emitChange = (changes) => {
    const payload = {
      from: changes.from !== undefined ? changes.from : fromDate || null,
      to: changes.to !== undefined ? changes.to : toDate || null,
      type: changes.type !== undefined ? changes.type : type || null,
      category: changes.category !== undefined ? changes.category : (category === "All Categories" ? null : category),
      division: changes.division !== undefined ? changes.division : (division === "" ? null : division),
    };
    onFilterChange?.(payload);
  };

  // fire the initial defaults once on mount (From may still be empty here
  // if transactions haven't loaded yet — the effect below fills it in)
  useEffect(() => {
    emitChange({ from: fromDate || null, to: toDate });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Once the earliest transaction date arrives from the server, adopt it as
  // "From" — but only if the user hasn't already picked their own date.
  useEffect(() => {
    if (earliestDate && !fromTouched.current) {
      setFromDate(earliestDate);
      emitChange({ from: earliestDate });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [earliestDate]);

  // Keep "To" pinned to the current date automatically (e.g. if the tab is
  // left open past midnight), unless the user has manually chosen a
  // different "To" date.
  useEffect(() => {
    const keepCurrent = () => {
      if (toTouched.current) return;
      const t = today();
      setToDate((prev) => {
        if (prev === t) return prev;
        emitChange({ to: t });
        return t;
      });
    };
    const interval = setInterval(keepCurrent, 60 * 1000);
    document.addEventListener("visibilitychange", keepCurrent);
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", keepCurrent);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFromDateChange = (e) => {
    fromTouched.current = true;
    setFromDate(e.target.value);
    emitChange({ from: e.target.value });
  };
  const handleToDateChange = (e) => {
    toTouched.current = true;
    setToDate(e.target.value);
    emitChange({ to: e.target.value });
  };
  const handleTypeChange = (selectedType) => {
    const newType = type === selectedType ? null : selectedType;
    setType(newType);
    emitChange({ type: newType });
  };
  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    emitChange({ category: e.target.value === "All Categories" ? null : e.target.value });
  };
  const handleDivisionChange = (e) => {
    setDivision(e.target.value);
    emitChange({ division: e.target.value === "" ? null : e.target.value });
  };
  const handleReset = () => {
    fromTouched.current = false;
    toTouched.current = false;
    const t = today();
    setFromDate(earliestDate || "");
    setToDate(t);
    setCategory("All Categories");
    setDivision("");
    setType(null);
    emitChange({ from: earliestDate || null, to: t, type: null, category: null, division: null });
  };

  const hasActiveFilters =
    fromDate !== (earliestDate || "") || toDate !== today() || category !== "All Categories" || division || type;

  return (
    <Panel
      eyebrow="Refine"
      title="Filters"
      right={<FiFilter className="text-slate-600" size={16} />}
    >
      <div className="flex flex-wrap items-end gap-4">
        <div>
          <span className="block text-xs font-semibold text-slate-400 mb-1.5">Type</span>
          <div className="flex gap-2">
            <button
              onClick={() => handleTypeChange("income")}
              className={`px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                type === "income" ? "bg-emerald-400 text-slate-950" : "bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-white"
              }`}
            >
              Income
            </button>
            <button
              onClick={() => handleTypeChange("expense")}
              className={`px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                type === "expense" ? "bg-rose-400 text-slate-950" : "bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-white"
              }`}
            >
              Expense
            </button>
          </div>
        </div>

        <div className="min-w-40">
          <Select label="Category" value={category} onChange={handleCategoryChange}>
            <option>All Categories</option>
            {ALL_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </Select>
        </div>

        <div className="min-w-36">
          <Select label="Division" value={division} onChange={handleDivisionChange}>
            <option value="">All Divisions</option>
            <option value="personal">Personal</option>
            <option value="office">Office</option>
          </Select>
        </div>

        <div className="min-w-36">
          <Input type="date" label="From" value={fromDate} onChange={handleFromDateChange} max={toDate} />
        </div>
        <div className="min-w-36">
          <Input type="date" label="To" value={toDate} onChange={handleToDateChange} min={fromDate} max={today()} />
        </div>

        {hasActiveFilters && (
          <GhostButton onClick={handleReset} className="py-2.5">
            Reset
          </GhostButton>
        )}
      </div>
    </Panel>
  );
}
