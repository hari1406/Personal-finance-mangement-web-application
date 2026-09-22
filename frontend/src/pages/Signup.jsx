import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Input, PrimaryButton } from "../components/ui";

export default function Signup({ onSwitch }) {
  const { signup } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await signup(email, password, confirmPassword);
    } catch (err) {
      setError(err?.response?.data?.message || "Sign up failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm animate-rise">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-full bg-emerald-400 flex items-center justify-center text-slate-950 font-bold font-serif">₹</div>
          <span className="font-serif italic text-2xl text-emerald-400">Money Manager</span>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-7 shadow-2xl backdrop-blur-sm">
          <h1 className="font-serif text-xl font-semibold text-slate-100 mb-1">Create your account</h1>
          <p className="text-slate-500 text-sm mb-6">Start tracking income and expenses.</p>

          <form onSubmit={submit} className="space-y-4">
            <Input type="email" label="Email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            <Input type="password" label="Password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" />
            <Input type="password" label="Confirm password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" />

            {error && <p className="text-rose-400 text-xs bg-rose-950/40 border border-rose-900 rounded-lg px-3 py-2">{error}</p>}

            <PrimaryButton className="w-full py-3 !bg-emerald-400 hover:!bg-emerald-300 !shadow-emerald-500/10" disabled={loading}>
              {loading ? "Creating account..." : "Create account"}
            </PrimaryButton>
          </form>

          <p className="text-center text-xs text-slate-500 mt-5">
            Already have an account?{" "}
            <button onClick={onSwitch} className="text-emerald-400 font-semibold hover:underline">Sign in</button>
          </p>
        </div>
      </div>
    </div>
  );
}
