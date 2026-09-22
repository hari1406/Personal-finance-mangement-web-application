import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// Attach the saved JWT (if any) to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("mm_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// If the token is invalid/expired, force the user back to the login screen
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      localStorage.removeItem("mm_token");
      localStorage.removeItem("mm_user");
      window.location.reload();
    }
    return Promise.reject(err);
  }
);

// Auth
export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);
export const getMe = () => API.get("/auth/me");

// Transactions
export const addTransaction = (data) => API.post("/transactions", data);
export const getTransactions = (params) => API.get("/transactions", { params });
export const updateTransaction = (id, data) => API.put(`/transactions/${id}`, data);
export const deleteTransaction = (id) => API.delete(`/transactions/${id}`);

// Accounts
export const getAccounts = () => API.get("/accounts");
export const createAccount = (data) => API.post("/accounts", data);
export const updateAccount = (id, data) => API.put(`/accounts/${id}`, data);
export const transferAmount = (data) => API.post("/accounts/transfer", data);

// Reports
export const getCategorySummary = () => API.get("/reports/category-summary");
export const getTimeReport = (start, end) => API.get("/reports/time-report", { params: { start, end } });

export default API;
