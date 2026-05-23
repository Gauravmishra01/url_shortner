import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { getAllUserUrls } from "../api/user.api";
import { Badge, Button, Card } from "../components/ui-kit.jsx";
import { useAppUI } from "../context/AppUIContext.jsx";
import { usePageMeta } from "../utils/pageMeta.js";
import { Link } from "@tanstack/react-router";

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
    <div className="page-shell space-y-8 py-8 sm:space-y-10 sm:py-12">
      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 subtle-grid opacity-40" />
          <div className="relative z-10 space-y-5">
            <div className="flex flex-wrap items-center gap-3">
              <Badge tone="accent">Dashboard</Badge>
              <Badge tone="neutral">Live</Badge>
            </div>
            <div className="space-y-3">
              <p className="eyebrow">Welcome back</p>
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-[color:var(--text)] sm:text-5xl">
                {user?.name
                  ? `${user.name}, your link workspace is ready.`
                  : "Your link workspace is ready."}
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-[color:var(--muted)] sm:text-base">
                Your overview is intentionally light. Use the dedicated pages
                for links and activity.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button
                variant="primary"
                size="lg"
                onClick={markOnboardingComplete}
                className="w-full sm:w-auto"
              >
                Mark setup complete
              </Button>
              <Link
                to="/links"
                className="premium-button-secondary inline-flex min-h-12 items-center justify-center rounded-2xl px-5 py-3.5 text-base font-semibold text-[color:var(--text)] w-full sm:w-auto"
              >
                Open links
              </Link>
            </div>
          </div>
        </Card>

        <Card>
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
        </Card>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {[
          ["Links", String(urls.length), "Open the dedicated links page."],
          [
            "Activity",
            String(activity.length),
            "Check recent workspace actions.",
          ],
          [
            "Bookmarks",
            String(analytics.bookmarkedCount),
            "Saved links stay easy to revisit.",
          ],
        ].map(([title, value, description]) => (
          <Card key={title} className="space-y-3">
            <p className="eyebrow">{title}</p>
            <p className="text-3xl font-semibold tracking-tight text-[color:var(--text)]">
              {value}
            </p>
            <p className="text-sm leading-7 text-[color:var(--muted)]">
              {description}
            </p>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_auto]">
        <Card>
          <div className="space-y-4">
            <p className="eyebrow">Quick access</p>
            <h2 className="text-2xl font-semibold tracking-tight text-[color:var(--text)]">
              Keep the dashboard focused.
            </h2>
            <p className="max-w-2xl text-sm leading-7 text-[color:var(--muted)]">
              Detailed link management and recent history live on dedicated
              pages so this screen stays light and easy to scan.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                to="/links"
                className="premium-button inline-flex min-h-12 items-center justify-center rounded-2xl px-5 py-3.5 text-base font-semibold text-white w-full sm:w-auto"
              >
                Open links
              </Link>
              <Link
                to="/activity"
                className="premium-button-secondary inline-flex min-h-12 items-center justify-center rounded-2xl px-5 py-3.5 text-base font-semibold text-[color:var(--text)] w-full sm:w-auto"
              >
                Open activity
              </Link>
            </div>
          </div>
        </Card>

        <Card>
          <div className="space-y-3">
            <p className="eyebrow">Workspace</p>
            <p className="text-sm leading-7 text-[color:var(--muted)]">
              {onboardingComplete
                ? "Setup is complete. Use the Links page for creation and the Activity page for history."
                : "Finish setup when you are ready, then move into the dedicated pages."}
            </p>
          </div>
        </Card>
      </section>
    </div>
  );
};

export default DashboardPage;
