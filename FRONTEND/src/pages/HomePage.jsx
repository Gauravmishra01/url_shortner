import React from "react";
import { Link } from "@tanstack/react-router";
import UrlForm from "../components/UrlForm";
import { Badge, Card, Button } from "../components/ui-kit.jsx";
import { usePageMeta } from "../utils/pageMeta.js";

const HomePage = () => {
  usePageMeta({
    title: "url_shortner | Premium URL workspace",
    description:
      "A modern, fast and elegant URL shortener with analytics, bookmarks, and a clean dashboard experience.",
  });

  return (
    <div className="page-shell space-y-8 pb-12 sm:space-y-10">
      <section className="glass-hero overflow-hidden">
        <div className="grid gap-6 px-4 py-6 sm:px-6 sm:py-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-10 lg:py-10">
          <div className="relative z-10 space-y-5">
            <Badge tone="accent">Premium link management</Badge>
            <div className="space-y-4">
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-[color:var(--text)] sm:text-5xl lg:text-6xl">
                Shorten links quickly.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-[color:var(--muted)] sm:text-lg">
                A minimal workspace for creating clean short links and managing
                them in one place.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                to="/dashboard"
                className="premium-button rounded-2xl px-6 py-3 text-center text-sm font-semibold sm:w-auto"
              >
                Open dashboard
              </Link>
              <Link
                to="/about"
                className="premium-button-secondary rounded-2xl px-6 py-3 text-center text-sm font-semibold sm:w-auto"
              >
                About us
              </Link>
            </div>
          </div>

          <Card className="relative z-10 overflow-hidden">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--muted)]">
                  Quick action
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[color:var(--text)]">
                  Shorten a link
                </h2>
              </div>
              <Badge tone="neutral">Fast</Badge>
            </div>
            <UrlForm />
          </Card>
        </div>
      </section>

      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <p className="eyebrow">Quick</p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-[color:var(--text)]">
            Shorten links
          </h2>
          <p className="mt-2 text-sm leading-7 text-[color:var(--muted)]">
            Paste a URL and create a clean short link in seconds.
          </p>
        </Card>
        <Card>
          <p className="eyebrow">Manage</p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-[color:var(--text)]">
            Save favorites
          </h2>
          <p className="mt-2 text-sm leading-7 text-[color:var(--muted)]">
            Keep important links close with bookmarks and recent activity.
          </p>
        </Card>
        <Card>
          <p className="eyebrow">About</p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-[color:var(--text)]">
            Learn more
          </h2>
          <p className="mt-2 text-sm leading-7 text-[color:var(--muted)]">
            Read the full story on the About Us page.
          </p>
        </Card>
      </section>
    </div>
  );
};

export default HomePage;
