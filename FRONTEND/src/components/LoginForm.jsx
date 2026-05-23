import React, { useState } from "react";
import { loginUser } from "../api/user.api";
import { useDispatch } from "react-redux";
import { login } from "../store/slice/authSlice.js";
import { useNavigate } from "@tanstack/react-router";
import { Badge, Button, Card, Input } from "./ui-kit.jsx";
import { useAppUI } from "../context/AppUIContext.jsx";
import { setStoredAuthToken } from "../utils/authSession";

const LoginForm = ({ state }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { pushToast, recordActivity } = useAppUI();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await loginUser(password, email);
      setStoredAuthToken(data?.token, { persistent: rememberMe });
      dispatch(login(data.user));
      navigate({ to: "/dashboard" });
      setLoading(false);
      pushToast({
        title: "Welcome back",
        message: rememberMe
          ? "You will stay signed in on this device."
          : "Signed in successfully.",
        tone: "success",
      });
      recordActivity({
        title: "Logged in",
        description: data?.user?.email || email,
        tone: "success",
      });
    } catch (err) {
      setLoading(false);
      setError(err.message || "Login failed. Please check your credentials.");
    }
  };

  return (
    <Card className="mx-auto w-full max-w-xl space-y-6">
      <div className="space-y-2">
        <Badge tone="neutral">Welcome back</Badge>
        <h2 className="text-3xl font-semibold tracking-tight text-[color:var(--text)]">
          Sign in to your workspace
        </h2>
        <p className="text-sm leading-6 text-[color:var(--muted)]">
          Pick up where you left off with bookmarks, notifications, and
          analytics ready to go.
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
            htmlFor="email"
          >
            Email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
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
            placeholder="••••••••"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>

        <div className="flex items-center justify-between gap-3 text-sm text-[color:var(--muted)]">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(event) => setRememberMe(event.target.checked)}
              className="h-4 w-4 rounded border-white/20 bg-transparent text-blue-500 focus:ring-blue-500"
            />
            Keep me signed in
          </label>
          <span>Protected by cookie-based sessions</span>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign in"}
        </Button>
      </form>

      <div className="text-center text-sm text-[color:var(--muted)]">
        Don&apos;t have an account?{" "}
        <button
          type="button"
          onClick={() => state(false)}
          className="font-semibold text-[color:var(--accent-2)] transition hover:opacity-80"
        >
          Create one
        </button>
      </div>
    </Card>
  );
};

export default LoginForm;
