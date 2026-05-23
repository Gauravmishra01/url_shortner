import React, { useState } from "react";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import { Badge, Card } from "../components/ui-kit.jsx";
import { usePageMeta } from "../utils/pageMeta.js";

const AuthPage = () => {
  const [login, setLogin] = useState(true);

  usePageMeta({
    title: login ? "Sign in | url_shortner" : "Create account | url_shortner",
    description:
      "Access your polished URL workspace, bookmarks, and analytics with a modern sign in experience.",
  });

  return (
    <div className="page-shell grid min-h-[calc(100vh-7rem)] items-center gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 subtle-grid opacity-40" />
        <div className="relative z-10 space-y-6">
          <Badge tone="accent">Secure access</Badge>
          <div className="space-y-3">
            <h1 className="text-4xl font-semibold tracking-tight text-[color:var(--text)] sm:text-5xl">
              A better sign-in experience for a better product feel.
            </h1>
            <p className="max-w-xl text-base leading-8 text-[color:var(--muted)]">
              Use a calm, premium auth surface that keeps the focus on account
              creation, validation, and a clean path into the dashboard.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ["Faster onboarding", "Clear guidance and immediate feedback."],
              ["Account confidence", "A polished flow that feels trustworthy."],
              ["Responsive layout", "Works smoothly on desktop and mobile."],
              [
                "Dark mode ready",
                "Matches the rest of the product experience.",
              ],
            ].map(([title, description]) => (
              <div
                key={title}
                className="rounded-3xl border border-white/10 bg-white/5 p-4"
              >
                <p className="text-sm font-semibold text-[color:var(--text)]">
                  {title}
                </p>
                <p className="mt-1 text-sm leading-6 text-[color:var(--muted)]">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div className="reveal-up">
        {login ? (
          <LoginForm state={setLogin} />
        ) : (
          <RegisterForm state={setLogin} />
        )}
      </div>
    </div>
  );
};

export default AuthPage;
