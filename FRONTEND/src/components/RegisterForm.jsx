import React, { useState } from "react";
import { registerUser } from "../api/user.api";
import { useDispatch } from "react-redux";
import { login } from "../store/slice/authSlice";
import { useNavigate } from "@tanstack/react-router";
import { Badge, Button, Card, Input, ProgressBar } from "./ui-kit.jsx";
import { useAppUI } from "../context/AppUIContext.jsx";
import { setStoredAuthToken } from "../utils/authSession";

const RegisterForm = ({ state }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pushToast, recordActivity } = useAppUI();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await registerUser(name, password, email);
      setLoading(false);
      setStoredAuthToken(data?.token, { persistent: true });
      dispatch(login(data.user));
      navigate({ to: "/dashboard" });
      setLoading(false);
      pushToast({
        title: "Account created",
        message: "Your workspace is ready.",
        tone: "success",
      });
      recordActivity({
        title: "Registered account",
        description: data?.user?.email || email,
        tone: "success",
      });
    } catch (err) {
      setLoading(false);
      setError(err.message || "Registration failed. Please try again.");
    }
  };

  const passwordStrength = Math.min(100, Math.max(20, password.length * 15));

  return (
    <Card className="mx-auto w-full max-w-xl space-y-6">
      <div className="space-y-2">
        <Badge tone="neutral">Create account</Badge>
        <h2 className="text-3xl font-semibold tracking-tight text-[color:var(--text)]">
          Start with a premium workspace
        </h2>
        <p className="text-sm leading-6 text-[color:var(--muted)]">
          Get bookmarks, advanced filtering, notifications, and a polished
          dashboard from day one.
        </p>
      </div>

      {error ? (
        <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </div>
      ) : null}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label
            className="text-sm font-semibold text-[color:var(--text)]"
            htmlFor="name"
          >
            Full name
          </label>
          <Input
            id="name"
            type="text"
            placeholder="Alex Morgan"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <label
            className="text-sm font-semibold text-[color:var(--text)]"
            htmlFor="email"
          >
            Email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <label
            className="text-sm font-semibold text-[color:var(--text)]"
            htmlFor="password"
          >
            Password
          </label>
          <Input
            id="password"
            type="password"
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
          <ProgressBar label="Password strength" value={passwordStrength} />
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create account"}
        </Button>
      </form>

      <div className="text-center text-sm text-[color:var(--muted)]">
        Already have an account?{" "}
        <button
          type="button"
          onClick={() => state(true)}
          className="font-semibold text-[color:var(--accent-2)] transition hover:opacity-80"
        >
          Sign in
        </button>
      </div>
    </Card>
  );
};

export default RegisterForm;
