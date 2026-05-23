import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { getAllUserUrls } from "../api/user.api";
import UrlForm from "../components/UrlForm";
import UserUrl from "../components/UserUrl";
import {
  Badge,
  Button,
  Card,
  ProgressBar,
  SectionHeading,
  StatCard,
} from "../components/ui-kit.jsx";
import { useAppUI } from "../context/AppUIContext.jsx";
import { usePageMeta } from "../utils/pageMeta.js";

const DashboardPage = () => {
  const { user } = useSelector((state) => state.auth);
  const { bookmarks, activity, onboardingComplete, markOnboardingComplete } =
    useAppUI();
  const { data } = useQuery({
    queryKey: ["userUrls"],
    queryFn: getAllUserUrls,
    staleTime: 0,
  });

  usePageMeta({
    title: "Dashboard | url_shortner",
    description:
      "Manage short URLs, bookmarks, activity, and analytics in a polished dashboard.",
  });

  const urls = useMemo(() => data?.urls ?? [], [data]);
  const analytics = useMemo(() => {
    const totalClicks = urls.reduce((sum, url) => sum + (url.clicks || 0), 0);
    const bookmarkedCount = Object.keys(bookmarks).length;
    const averageClicks = urls.length
      ? (totalClicks / urls.length).toFixed(1)
      : "0.0";

    return { totalClicks, bookmarkedCount, averageClicks };
  }, [bookmarks, urls]);

  const onboardingSteps = onboardingComplete
    ? 100
    : Math.min(100, Math.max(34, activity.length * 30));

  return (
    <div className="page-shell space-y-8 py-8 sm:py-12">
      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 subtle-grid opacity-40" />
          <div className="relative z-10 space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <Badge tone="accent">Dashboard</Badge>
              <Badge tone="neutral">Live insights</Badge>
              <Badge tone="success">Dark mode ready</Badge>
            </div>
            <div className="space-y-3">
              <p className="eyebrow">Welcome back</p>
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-[color:var(--text)] sm:text-5xl">
                {user?.name
                  ? `${user.name}, your link workspace is ready.`
                  : "Your link workspace is ready."}
              </h1>
              <p className="max-w-2xl text-base leading-8 text-[color:var(--muted)]">
                Create new links, search through your history, bookmark the ones
                that matter, and keep track of activity with a dashboard that
                feels responsive and high-end.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="primary"
                size="lg"
                onClick={markOnboardingComplete}
              >
                Mark onboarding complete
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() =>
                  window.scrollTo({
                    top: document.body.scrollHeight,
                    behavior: "smooth",
                  })
                }
              >
                Review activity
              </Button>
            </div>
          </div>
        </Card>

        <Card>
          <SectionHeading
            eyebrow="Onboarding"
            title="A guided path that removes friction."
            description="Progress-based onboarding helps new users get value quickly while still keeping the dashboard calm and professional."
          />
          <div className="space-y-5">
            <ProgressBar value={onboardingSteps} label="Workspace setup" />
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <p className="text-2xl font-semibold text-[color:var(--text)]">
                  {urls.length}
                </p>
                <p className="mt-1 text-sm text-[color:var(--muted)]">
                  Saved URLs
                </p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <p className="text-2xl font-semibold text-[color:var(--text)]">
                  {analytics.totalClicks}
                </p>
                <p className="mt-1 text-sm text-[color:var(--muted)]">
                  Total clicks
                </p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <p className="text-2xl font-semibold text-[color:var(--text)]">
                  {analytics.bookmarkedCount}
                </p>
                <p className="mt-1 text-sm text-[color:var(--muted)]">
                  Bookmarks
                </p>
              </div>
            </div>
          </div>
        </Card>
      </section>

      <section className="surface-grid lg:grid-cols-4">
        <StatCard
          label="Short links"
          value={String(urls.length)}
          detail="Your current library size"
          delta="Client-side search and filters enabled"
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
          label="Bookmarks"
          value={String(analytics.bookmarkedCount)}
          detail="Saved for quick access"
          delta="Favorites are stored locally"
          tone="emerald"
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
          label="Total clicks"
          value={String(analytics.totalClicks)}
          detail="Engagement across all links"
          delta="Updated every 30 seconds"
          tone="amber"
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
          label="Avg. clicks"
          value={analytics.averageClicks}
          detail="Average performance per link"
          delta="Smart recommendations use this data"
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

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card>
          <SectionHeading
            eyebrow="Create"
            title="Shorten a new URL in a polished flow."
            description="Improved validation, more obvious result states, and a cleaner input hierarchy make link creation feel effortless."
          />
          <UrlForm embedded />
        </Card>

        <Card>
          <SectionHeading
            eyebrow="Analytics"
            title="Simple charts and useful recommendations."
            description="The dashboard highlights performance trends without needing a heavy charting dependency."
          />
          <div className="space-y-4">
            {[
              [
                "Top performing links",
                Math.min(
                  100,
                  analytics.totalClicks
                    ? (analytics.totalClicks / Math.max(urls.length || 1, 1)) *
                        12
                    : 20,
                ),
                "Focus on links with the strongest CTR.",
              ],
              [
                "Favorites activity",
                Math.min(100, analytics.bookmarkedCount * 18),
                "Review and share the links you revisit most.",
              ],
              [
                "Recent velocity",
                Math.min(100, activity.length * 18),
                "Fresh actions show the workspace is active.",
              ],
            ].map(([label, value, description]) => (
              <div
                key={label}
                className="space-y-2 rounded-3xl border border-white/10 bg-white/5 p-4"
              >
                <div className="flex items-center justify-between text-sm text-[color:var(--muted)]">
                  <span>{label}</span>
                  <span>{Math.round(value)}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full progress-bar"
                    style={{ width: `${Math.round(value)}%` }}
                  />
                </div>
                <p className="text-sm leading-6 text-[color:var(--muted)]">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <UserUrl />
        <Card>
          <SectionHeading
            eyebrow="Recent activity"
            title="A light-weight history feed."
            description="Copy actions, bookmarks, and onboarding milestones are surfaced so the interface feels alive."
          />
          <div className="space-y-3">
            {activity.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 p-6 text-sm text-[color:var(--muted)]">
                Your activity will appear here after you shorten, copy, or
                bookmark a link.
              </div>
            ) : (
              activity.map((item) => (
                <div
                  key={item.id}
                  className="rounded-3xl border border-white/10 bg-white/5 p-4"
                >
                  <p className="text-sm font-semibold text-[color:var(--text)]">
                    {item.title}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-[color:var(--muted)]">
                    {item.description}
                  </p>
                  <p className="mt-2 text-xs text-[color:var(--muted)]">
                    {new Date(item.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </Card>
      </section>
    </div>
  );
};

export default DashboardPage;
