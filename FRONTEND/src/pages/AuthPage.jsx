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
    <div className="page-shell grid min-h-[calc(100svh-7rem)] items-center gap-6 pb-10 lg:grid-cols-[0.95fr_1.05fr]">
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 subtle-grid opacity-40" />
        <div className="relative z-10 space-y-4 sm:space-y-5">
          <Badge tone="accent">Secure access</Badge>
          <div className="space-y-3">
            <h1 className="text-4xl font-semibold tracking-tight text-[color:var(--text)] sm:text-5xl">
              Sign in to continue.
            </h1>
            <p className="max-w-xl text-base leading-7 text-[color:var(--muted)]">
              A simple login page with just the essentials.
            </p>
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
