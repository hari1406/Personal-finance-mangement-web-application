import Dashboard from "../components/Dashboard";
import Accounts from "../components/Accounts";

export default function DashboardPage({ role }) {
  return (
    <div className="space-y-6">
      <Dashboard />
      <Accounts role={role} />
    </div>
  );
}
