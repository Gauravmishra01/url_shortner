import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllUserUrls } from "../api/user.api";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  ErrorState,
  Input,
  SectionHeading,
  SkeletonTable,
} from "./ui-kit.jsx";
import { useAppUI } from "../context/AppUIContext.jsx";

const UserUrl = () => {
  const {
    data: urls,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["userUrls"],
    queryFn: getAllUserUrls,
    refetchInterval: 30000, // Refetch every 30 seconds to update click counts
    staleTime: 0, // Consider data stale immediately so it refetches when invalidated
  });
  const [copiedId, setCopiedId] = useState(null);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const { bookmarks, toggleBookmark, recordActivity, pushToast } = useAppUI();

  const enrichedUrls = useMemo(() => {
    const list = Array.isArray(urls?.urls) ? [...urls.urls].reverse() : [];

    return list.filter((url) => {
      const fullUrl = (url.full_url || "").toLowerCase();
      const shortUrl = (url.short_url || "").toLowerCase();
      const bookmarkKey = url.short_url;
      const isBookmarked = Boolean(bookmarks[bookmarkKey]);
      const matchesSearch =
        !search ||
        fullUrl.includes(search.toLowerCase()) ||
        shortUrl.includes(search.toLowerCase());

      if (!matchesSearch) return false;
      if (activeFilter === "bookmarked") return isBookmarked;
      if (activeFilter === "popular") return (url.clicks || 0) >= 5;
      return true;
    });
  }, [activeFilter, bookmarks, search, urls]);

  const handleCopy = (url, id) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    pushToast({
      title: "Copied link",
      message: url,
      tone: "success",
    });
    recordActivity({
      title: "Copied a short link",
      description: url,
      tone: "success",
      cta: url,
    });

    // Reset the copied state after 2 seconds
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const totalClicks = useMemo(
    () => enrichedUrls.reduce((sum, url) => sum + (url.clicks || 0), 0),
    [enrichedUrls],
  );

  if (isLoading) {
    return <SkeletonTable />;
  }

  if (isError) {
    return (
      <ErrorState
        title="We could not load your URLs"
        description={error.message}
      />
    );
  }

  if (!urls?.urls || urls.urls.length === 0) {
    return (
      <EmptyState
        title="No links yet"
        description="Create your first shortened URL to unlock analytics, bookmarks, and activity history."
      />
    );
  }

  return (
    <Card className="overflow-hidden p-0">
      <div className="flex flex-col gap-4 border-b border-white/10 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <SectionHeading
            eyebrow="Your library"
            title="Search, filter, and manage links."
            description="Advanced local filtering keeps this list fast even as your library grows."
          />
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-[color:var(--muted)]">
          <p className="font-semibold text-[color:var(--text)]">
            {enrichedUrls.length} visible
          </p>
          <p>{totalClicks} total clicks in view</p>
        </div>
      </div>

      <div className="grid gap-3 border-b border-white/10 p-4 sm:p-5 lg:grid-cols-[1fr_auto] lg:items-center">
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search original or short URLs"
        />
        <div className="mobile-chip-row">
          {[
            ["all", "All"],
            ["bookmarked", "Bookmarks"],
            ["popular", "Top clicked"],
          ].map(([value, label]) => (
            <Button
              key={value}
              type="button"
              variant={activeFilter === value ? "primary" : "secondary"}
              size="sm"
              onClick={() => setActiveFilter(value)}
              className="shrink-0"
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-3 p-4 sm:p-5">
        {enrichedUrls.map((url) => {
          const shortLink = url.shortUrl || url.short_url;
          const bookmarkKey = url.short_url;
          const isBookmarked = Boolean(bookmarks[bookmarkKey]);

          return (
            <div key={url._id} className="soft-panel space-y-4 p-4 sm:p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 space-y-1">
                  <p className="truncate text-sm font-semibold text-[color:var(--text)]">
                    {url.full_url}
                  </p>
                  <a
                    href={shortLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block break-all text-sm font-medium text-[color:var(--accent-2)]"
                  >
                    {shortLink}
                  </a>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge tone={url.clicks > 5 ? "success" : "accent"}>
                    {url.clicks} {url.clicks === 1 ? "click" : "clicks"}
                  </Badge>
                  <Badge tone={isBookmarked ? "warning" : "neutral"}>
                    {isBookmarked ? "Bookmarked" : "Saved"}
                  </Badge>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => handleCopy(shortLink, url._id)}
                  className="w-full sm:w-auto"
                >
                  {copiedId === url._id ? "Copied" : "Copy"}
                </Button>
                <Button
                  type="button"
                  variant={isBookmarked ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => {
                    toggleBookmark(bookmarkKey, {
                      label: url.full_url,
                      shortUrl: shortLink,
                    });
                  }}
                  className="w-full sm:w-auto"
                >
                  {isBookmarked ? "Unbookmark" : "Save"}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {enrichedUrls.length === 0 ? (
        <div className="border-t border-white/10 p-5">
          <EmptyState
            title="No results for this filter"
            description="Try a different search term or switch back to the full library."
          />
        </div>
      ) : null}
    </Card>
  );
};

export default UserUrl;
