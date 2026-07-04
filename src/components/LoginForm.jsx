import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const fieldClass = "ui-input w-full px-3 py-3";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login, isSupabaseConfigured } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login({ email, password });
      navigate("/account/details");
    } catch (err) {
      setError(isSupabaseConfigured ? "Login failed. Please check your credentials." : "Add Supabase env keys first.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        id="email"
        type="email"
        placeholder="E-mail"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
        className={fieldClass}
      />
      <input
        id="password"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        required
        className={fieldClass}
      />
      {error && <div className="error-text text-sm font-semibold">{error}</div>}
      <button
        type="submit"
        disabled={submitting}
        className="ui-button-primary w-full py-3 disabled:opacity-50"
      >
        {submitting ? "Logging In" : "Log In"}
      </button>
    </form>
  );
};

export default LoginForm;
