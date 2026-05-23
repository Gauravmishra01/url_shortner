import React from "react";
import { useSelector } from "react-redux";
import { Badge, Card, EmptyState } from "../components/ui-kit.jsx";
import { useAppUI } from "../context/AppUIContext.jsx";
import { usePageMeta } from "../utils/pageMeta.js";

const ActivityPage = () => {
  const { user } = useSelector((state) => state.auth);
  const { activity } = useAppUI();

  usePageMeta({
    title: "Activity | url_shortner",
    description: "View recent workspace activity in a simple, focused feed.",
  });

  return (
    <div className="page-shell space-y-8 py-8 sm:space-y-10 sm:py-12">
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 subtle-grid opacity-25" />
        <div className="relative z-10 space-y-3">
          <Badge tone="accent">Activity</Badge>
          <h1 className="text-4xl font-semibold tracking-tight text-[color:var(--text)] sm:text-5xl">
            Recent actions.
          </h1>
          <p className="max-w-2xl text-sm leading-7 text-[color:var(--muted)] sm:text-base">
            A simple feed of the actions that matter most.
          </p>
        </div>
      </Card>

      <Card>
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Workspace history</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[color:var(--text)]">
              {user?.name
                ? `${user.name}'s recent activity`
                : "Recent activity"}
            </h2>
          </div>
          <Badge tone="neutral">{activity.length} items</Badge>
        </div>

        <div className="space-y-3">
          {activity.length === 0 ? (
            <EmptyState
              title="No activity yet"
              description="Once you shorten, copy, or bookmark a link, it will appear here."
            />
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
    </div>
  );
};

export default ActivityPage;
