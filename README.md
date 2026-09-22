# Money Manager — Full Stack (React + Node/Express + MongoDB Atlas)

This is your `money-manager-backend` and `money-manager-frontend` repos, extended to cover
the full spec: login/signup, month/week/year dashboard, income & expense entry with
categories + Office/Personal divisions, filters, date-range history, a 12-hour edit lock,
category summary, and account transfers.

```
money-manager-fullstack/
├── backend/     Express + Mongoose API (MongoDB Atlas)
└── frontend/    React + Vite + Tailwind CSS
```

## 1. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:

```
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/moneymanager?retryWrites=true&w=majority
JWT_SECRET=some_long_random_string
PORT=5000
```

Get `MONGO_URI` from MongoDB Atlas: Database → Connect → Drivers → Node.js, then
swap in your database user's username/password and make sure your IP (or `0.0.0.0/0`
for testing) is allow-listed under Network Access.

Run it:

```bash
npm run dev      # nodemon, auto-restarts on changes
# or
npm start
```

The API listens on `http://localhost:5000`. Quick health check: `GET /api/health`.

### API summary

| Method | Route | Auth | Notes |
|---|---|---|---|
| POST | `/api/auth/register` | – | `{ email, password, confirmPassword }` |
| POST | `/api/auth/login` | – | `{ email, password }` → `{ token, user }` |
| GET  | `/api/auth/me` | ✓ | current user |
| POST | `/api/accounts` | ✓ | `{ name, balance }` |
| GET  | `/api/accounts` | ✓ | list your accounts |
| PUT  | `/api/accounts/:id` | ✓ | rename / correct balance |
| POST | `/api/accounts/transfer` | ✓ | `{ fromAccount, toAccount, amount, description }` |
| POST | `/api/transactions` | ✓ | `{ type, amount, date, description, category, division, account }` |
| GET  | `/api/transactions` | ✓ | query: `from, to, category, division, type, account` |
| PUT  | `/api/transactions/:id` | ✓ | **blocked after 12 hours** from creation |
| DELETE | `/api/transactions/:id` | ✓ | reverses the account balance effect |
| GET  | `/api/reports/category-summary` | ✓ | expense totals grouped by category |
| GET  | `/api/reports/time-report` | ✓ | query: `start, end` |

All authenticated routes expect `Authorization: Bearer <token>`. Data is scoped per
logged-in user (each user only sees their own accounts/transactions).

`division` is stored lowercase: `"personal"` or `"office"`.

## 2. Frontend setup

```bash
cd frontend
npm install
cp .env.example .env
```

Edit `.env` to point at your backend:

```
VITE_API_URL=http://localhost:5000/api
```

Run it:

```bash
npm run dev
```

Open the printed local URL. Sign up with any email/password (6+ chars) — there's no
seed user since everything is now backed by real MongoDB. Once logged in:

1. **Home** — Dashboard Overview (Weekly/Monthly/Yearly), Income vs Expense chart,
   Category Summary, and the Accounts panel (add/edit Cash, Bank, etc., plus Transfer).
2. **+ Add** (bottom-right, admin role only) — opens the Income/Expense tabbed modal:
   amount, date & time, description, category, division, account.
3. **Transaction** tab — filter by type/category/division/date range, edit (within
   12 hours of creation) or delete any entry.
4. The **Admin/Viewer** dropdown in the nav bar toggles whether the add/edit/delete
   controls are shown — Viewer is read-only.

## 3. Deploying

- **Backend**: any Node host (Render, Railway, Fly.io, etc.). Set `MONGO_URI`,
  `JWT_SECRET`, and `PORT` as environment variables there.
- **Frontend**: any static host (Vercel, Netlify). Set `VITE_API_URL` to your deployed
  backend's `/api` URL at build time.
- **Database**: MongoDB Atlas free tier (M0) is enough to start.

## What changed vs. the original repos

- Added JWT auth (`User` model, `/api/auth/*`, `protect` middleware) — every account
  and transaction is now tied to the logged-in user.
- Added `updateAccount` (the Edit buttons on Cash/Bank had no backend route before).
- Added `deleteTransaction` and richer query filters on `getTransactions`.
- Transactions now store a `date` field (the date/time the user picked) separately
  from `createdAt` (used purely for the 12-hour edit-lock timer).
- Frontend: Login/Signup pages + `AuthContext`, full category list (Food, Fuel, Movie,
  Medical, Loan, Shopping, Bills, Groceries, + income categories), date & time picker,
  a working Transfer modal, and a Delete button in transaction history.
