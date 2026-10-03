import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser, loginUser, getMe } from "../api/auth";
import { useAuth } from "../context/AuthContext";

function Auth() {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ email: "", username: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      if (mode === "register") {
        await registerUser(form);
      }

      const res = await loginUser({ email: form.email, password: form.password });
      localStorage.setItem("access_token", res.data.access);
      localStorage.setItem("refresh_token", res.data.refresh);
      const meRes = await getMe();
      login(res.data, meRes.data);
      navigate("/feed");
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong. Check your details.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="max-w-6xl mx-auto w-full px-6 py-6">
        <Link to="/" className="text-xl font-bold text-slate-900">Jobnest</Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 pb-16">
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-1">
              {mode === "login" ? "Welcome back" : "Create your account"}
            </h1>
            <p className="text-sm text-slate-500 mb-6">
              {mode === "login"
                ? "Log in to see your matched jobs."
                : "Start matching your skills to real jobs."}
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {mode === "register" && (
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Username
                  </label>
                  <input
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    required
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="yourname"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Password
                </label>
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium rounded-lg py-2.5 text-sm transition mt-1"
              >
                {submitting
                  ? "Please wait..."
                  : mode === "login"
                  ? "Log in"
                  : "Sign up"}
              </button>
            </form>

            <button
              onClick={() => {
                setMode(mode === "login" ? "register" : "login");
                setError("");
              }}
              className="text-sm text-indigo-600 hover:text-indigo-700 mt-5 w-full text-center"
            >
              {mode === "login"
                ? "Need an account? Sign up"
                : "Already have an account? Log in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;