import { useState } from "react";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import TransactionPage from "./pages/TransactionPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { useAuth } from "./context/AuthContext";

export default function App() {
  const { token } = useAuth();
  const [authView, setAuthView] = useState("login");
  const [route, setRoute] = useState("home");
  const [role, setRole] = useState("admin"); // admin can add/edit, viewer is read-only

  if (!token) {
    return authView === "login" ? (
      <Login onSwitch={() => setAuthView("signup")} />
    ) : (
      <Signup onSwitch={() => setAuthView("login")} />
    );
  }

  return (
    <div className="min-h-screen">
      <NavBar current={route} onNavigate={setRoute} role={role} onRoleChange={setRole} />

      <main className="max-w-6xl mx-auto px-4 md:px-8 py-8">
        {route === "home" && <Home role={role} />}
        {route === "transactions" && <TransactionPage onBack={() => setRoute("home")} role={role} />}
      </main>
    </div>
  );
}
