export const INCOME_CATEGORIES = ["Salary", "Freelance", "Investment", "Gift", "Other Income"];

export const EXPENSE_CATEGORIES = [
  "Food",
  "Fuel",
  "Movie",
  "Medical",
  "Loan",
  "Shopping",
  "Bills",
  "Groceries",
  "Other Expense",
];

export const ALL_CATEGORIES = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES];

export const DIVISIONS = ["personal", "office"];

// local datetime-local input helper (defaults to "now")
export const nowForInput = () => {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};
