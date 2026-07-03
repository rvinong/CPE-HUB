import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const fieldClass = "w-full border border-neutral-950/20 bg-[#f7f4ef] px-3 py-3 outline-none focus:border-neutral-950";

const SignupForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [birthday, setBirthday] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { signup, isSupabaseConfigured } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const data = await signup({ name, email, password, mobile, birthday });
      if (data.session) {
        navigate("/account/details");
      } else {
        setError("Check your email to confirm your account, then log in.");
      }
    } catch (err) {
      setError(isSupabaseConfigured ? "Signup failed. Please try again." : "Add Supabase env keys first.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        id="name"
        type="text"
        placeholder="Name"
        value={name}
        onChange={(event) => setName(event.target.value)}
        required
        className={fieldClass}
      />
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
      <input
        id="mobile"
        type="tel"
        placeholder="Mobile number"
        value={mobile}
        onChange={(event) => setMobile(event.target.value)}
        className={fieldClass}
      />
      <input
        id="birthday"
        type="date"
        value={birthday}
        onChange={(event) => setBirthday(event.target.value)}
        className={fieldClass}
      />
      {error && <div className="text-sm font-semibold text-red-600">{error}</div>}
      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-neutral-950 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white transition hover:bg-neutral-700 disabled:opacity-50"
      >
        {submitting ? "Creating Account" : "Sign Up"}
      </button>
    </form>
  );
};

export default SignupForm;
