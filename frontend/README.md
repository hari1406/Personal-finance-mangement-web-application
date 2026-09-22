# 💰 Finance Dashboard UI

## 📌 Overview

Finance Dashboard is a full-stack web application that helps users track their income and expenses, analyze spending patterns, and manage financial data efficiently. This repository contains the **frontend** of the application built using React and Tailwind CSS.

---

## 🚀 Features

* ➕ Add Income & Expense transactions
* 📊 Dashboard with weekly, monthly, yearly insights
* 📂 Category-wise expense tracking
* 🏢 Division filter (Personal / Office)
* 🔍 Filter by date, category, and division
* 📝 Transaction history with edit option (12-hour restriction)
* 💳 Account management and fund transfers
* 📱 Responsive UI using Tailwind CSS

---

## 🛠️ Tech Stack

* ⚛️ React.js
* 🎨 Tailwind CSS
* 🌐 Axios (API calls)
* ⚡ Vite (Build tool)

---

## 📁 Project Structure

```
src/
│── components/
│   ├── Dashboard.jsx
│   ├── AddTransactionModal.jsx
│   ├── IncomeTab.jsx
│   ├── ExpenseTab.jsx
│   ├── TransactionHistory.jsx
│   ├── Filters.jsx
│   ├── Summary.jsx
│   └── Accounts.jsx
│
│── pages/
│   ├── Home.jsx
│   └── DashboardPage.jsx
│
│── services/
│   └── api.js
│
│── utils/
│   └── dateUtils.js
│
│── App.jsx
│── main.jsx
```

---

## 🔗 API Integration

The frontend communicates with the backend using REST APIs.

Example:

```
GET /api/transactions
POST /api/transactions
PUT /api/transactions/:id
```

Base URL:

```
https://money-manager-backend-8e6u.onrender.com/api
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```
git clone https://github.com/hari1406/money-manager-frontend.git
```

### 2️⃣ Navigate to project folder

```
cd money-manager-frontend
```

### 3️⃣ Install dependencies

```
npm install
```

### 4️⃣ Run the application

```
npm run dev
```

App will run on:

```
http://localhost:5173
```

---

## 🌍 Deployment

* Frontend: Netlify
* Backend: Render
* Database: MongoDB Atlas

---

## 🧠 Key Concepts Used

* Component-based architecture
* State management using React Hooks
* API integration using Axios
* Conditional rendering
* Responsive UI design

---

## 👨‍💻 Author

**Harivarshan TN**

---

## ⭐ Conclusion

This project demonstrates full-stack development skills including frontend UI design, API integration, and real-world financial management features.

=======