import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser, loginUser, getMe } from "../api/auth";
import { useAuth } from "../context/AuthContext";

function Auth() {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [form, setForm] = useState({ email: "", username: "", password: "" });
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (mode === "register") {
        await registerUser(form);
        // auto-login right after registering
      }

      const res = await loginUser({ email: form.email, password: form.password });
      const meRes = await getMe(); // need user data, but getMe needs the token stored first
      login(res.data, meRes.data);
      navigate("/feed");
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong. Check your details.");
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-20 p-6 border rounded-lg">
      <h1 className="text-xl font-semibold mb-4">
        {mode === "login" ? "Log in" : "Create account"}
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {mode === "register" && (
          <input
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            className="border rounded px-3 py-2"
            required
          />
        )}
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="border rounded px-3 py-2"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="border rounded px-3 py-2"
          required
        />

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button type="submit" className="bg-blue-600 text-white rounded py-2">
          {mode === "login" ? "Log in" : "Sign up"}
        </button>
      </form>

      <button
        onClick={() => setMode(mode === "login" ? "register" : "login")}
        className="text-sm text-blue-600 mt-3"
      >
        {mode === "login" ? "Need an account? Sign up" : "Already have an account? Log in"}
      </button>
    </div>
  );
}

export default Auth;