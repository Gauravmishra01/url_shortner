import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllUserUrls } from "../api/user.api";
import UrlForm from "../components/UrlForm";
import UserUrl from "../components/UserUrl";
import { Badge, Card } from "../components/ui-kit.jsx";
import { usePageMeta } from "../utils/pageMeta.js";

const LinksPage = () => {
  const { data } = useQuery({
    queryKey: ["userUrls"],
    queryFn: getAllUserUrls,
    staleTime: 0,
  });

  usePageMeta({
    title: "Links | url_shortner",
    description:
      "Create, search, and manage your short links in one dedicated workspace.",
  });

  const urls = useMemo(() => data?.urls ?? [], [data]);

  return (
    <div className="page-shell space-y-8 py-8 sm:space-y-10 sm:py-12">
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 subtle-grid opacity-25" />
        <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-3">
            <Badge tone="accent">Links</Badge>
            <h1 className="text-4xl font-semibold tracking-tight text-[color:var(--text)] sm:text-5xl">
              Manage your links.
            </h1>
            <p className="max-w-2xl text-sm leading-7 text-[color:var(--muted)] sm:text-base">
              Create, review, and filter your saved links in one dedicated view.
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-[color:var(--muted)]">
            <p className="font-semibold text-[color:var(--text)]">
              {urls.length}
            </p>
            <p>Saved links</p>
          </div>
        </div>
      </Card>

      <section className="grid gap-6">
        <Card>
          <UrlForm embedded />
        </Card>
        <UserUrl />
      </section>
    </div>
  );
};

export default LinksPage;
