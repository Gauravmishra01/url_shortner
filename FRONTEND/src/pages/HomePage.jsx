import React from "react";
import { Link } from "@tanstack/react-router";
import UrlForm from "../components/UrlForm";
import {
  Badge,
  Card,
  Button,
  SectionHeading,
  StatCard,
} from "../components/ui-kit.jsx";
import { usePageMeta } from "../utils/pageMeta.js";

const HomePage = () => {
  usePageMeta({
    title: "url_shortner | Premium URL workspace",
    description:
      "A modern, fast and elegant URL shortener with analytics, bookmarks, and a clean dashboard experience.",
  });

  return (
    <div className="page-shell space-y-12 pb-12">
      <section className="glass-hero overflow-hidden">
        <div className="grid gap-10 px-6 py-8 sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:px-10 lg:py-12">
          <div className="relative z-10 space-y-6">
            <Badge tone="accent">Premium link management</Badge>
            <div className="space-y-4">
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-[color:var(--text)] sm:text-5xl lg:text-7xl">
                Turn every link into a polished, trackable, and memorable
                experience.
              </h1>
              <p className="max-w-2xl text-base leading-8 text-[color:var(--muted)] sm:text-lg">
                Create beautiful short links, monitor performance, save
                favorites, and keep your workspace organized with a modern,
                responsive interface built for speed.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/dashboard"
                className="premium-button rounded-2xl px-6 py-3 text-sm font-semibold"
              >
                Open dashboard
              </Link>
              <Link
                to="/auth"
                className="premium-button-secondary rounded-2xl px-6 py-3 text-sm font-semibold"
              >
                Create account
              </Link>
            </div>
            <div className="grid gap-3 pt-2 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-semibold text-[color:var(--text)]">
                  Fast setup
                </p>
                <p className="mt-1 text-sm leading-6 text-[color:var(--muted)]">
                  Shorten in seconds with instant feedback.
                </p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-semibold text-[color:var(--text)]">
                  Smart tracking
                </p>
                <p className="mt-1 text-sm leading-6 text-[color:var(--muted)]">
                  See clicks, history, and saved links at a glance.
                </p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-semibold text-[color:var(--text)]">
                  Theme aware
                </p>
                <p className="mt-1 text-sm leading-6 text-[color:var(--muted)]">
                  A polished dark and light mode that feels deliberate.
                </p>
              </div>
            </div>
          </div>

          <Card className="relative z-10 overflow-hidden">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--muted)]">
                  Live preview
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[color:var(--text)]">
                  Shorten a link
                </h2>
              </div>
              <Badge tone="success">Realtime</Badge>
            </div>
            <UrlForm />
          </Card>
        </div>
      </section>

      <section className="surface-grid lg:grid-cols-4">
        <StatCard
          label="Links shortened"
          value="12.4K"
          detail="Built for high-volume workflows."
          delta="+18% this month"
          tone="accent"
          icon={
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path
                d="M10 13a5 5 0 0 1 0-7l1-1a5 5 0 0 1 7 7l-1 1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14 11a5 5 0 0 1 0 7l-1 1a5 5 0 0 1-7-7l1-1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          }
        />
        <StatCard
          label="Average CTR"
          value="28.9%"
          detail="Track what resonates most."
          delta="+6.4% improvement"
          tone="emerald"
          icon={
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M4 19V5m0 14h16" strokeLinecap="round" />
              <path
                d="m8 15 3-3 3 2 5-7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          }
        />
        <StatCard
          label="Bookmarks"
          value="86"
          detail="Favorites for quick access."
          delta="Auto-synced locally"
          tone="amber"
          icon={
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path
                d="M6 3h12v18l-6-4-6 4V3Z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          }
        />
        <StatCard
          label="Uptime"
          value="99.98%"
          detail="Designed to feel instant."
          delta="Perceived speed focused"
          tone="rose"
          icon={
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path
                d="M12 3v9l6 3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="12" cy="12" r="9" />
            </svg>
          }
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <Card>
          <SectionHeading
            eyebrow="Why it feels premium"
            title="Intentional UX, not just prettier screens."
            description="The interface minimizes friction with clear feedback, consistent spacing, responsive surfaces, and smooth motion cues that guide attention without noise."
          />
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              [
                "Clear navigation",
                "Sticky header, strong hierarchy, and obvious next steps.",
              ],
              [
                "Fast feedback",
                "Skeletons, toasts, and inline validation reduce uncertainty.",
              ],
              [
                "Accessible by design",
                "High contrast, keyboard-friendly states, and readable typography.",
              ],
              [
                "Built for trust",
                "Bookmarks, history, and analytics make the product feel alive.",
              ],
            ].map(([title, description]) => (
              <div
                key={title}
                className="rounded-3xl border border-white/10 bg-white/5 p-4"
              >
                <p className="text-base font-semibold text-[color:var(--text)]">
                  {title}
                </p>
                <p className="mt-1 text-sm leading-6 text-[color:var(--muted)]">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionHeading
            eyebrow="Product flow"
            title="Everything important in one glance."
            description="A polished dashboard, quick onboarding, and reusable controls keep the experience fast and memorable on every device."
          />
          <div className="space-y-4">
            {[
              [
                "01",
                "Create a link",
                "Paste a URL, add a custom slug, and shorten instantly.",
              ],
              [
                "02",
                "Track performance",
                "Review clicks, recent activity, and saved favorites.",
              ],
              [
                "03",
                "Share with confidence",
                "Copy, bookmark, and revisit the best-performing links.",
              ],
            ].map(([step, title, description]) => (
              <div
                key={step}
                className="flex gap-4 rounded-3xl border border-white/10 bg-white/5 p-4"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 text-sm font-black text-white">
                  {step}
                </div>
                <div>
                  <p className="text-base font-semibold text-[color:var(--text)]">
                    {title}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-[color:var(--muted)]">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <SectionHeading
            eyebrow="Trusted feel"
            title="Modern, calm, and responsive on every screen."
            description="This redesign uses glassy surfaces sparingly, consistent interaction patterns, and a balanced color system so the interface feels premium without becoming heavy."
          />
          <div className="space-y-4 text-sm leading-6 text-[color:var(--muted)]">
            <p>
              The UI leans on layered surfaces, subtle depth, and purposeful
              motion to create a polished experience that still loads quickly
              and stays readable.
            </p>
            <p>
              Users get immediate feedback, cleaner forms, and a dashboard that
              feels like a real product instead of a simple utility page.
            </p>
          </div>
        </Card>

        <Card>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="eyebrow">Start here</p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight text-[color:var(--text)]">
                Open the dashboard to unlock search, bookmarks, and activity.
              </h3>
            </div>
            <Button variant="primary" size="lg" className="px-6">
              <Link to="/dashboard">Go to dashboard</Link>
            </Button>
          </div>
        </Card>
      </section>
    </div>
  );
};

export default HomePage;
