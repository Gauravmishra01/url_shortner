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
import QRPreview from "./QRPreview";
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
      <div className="flex flex-col gap-4 border-b border-white/10 p-5 sm:flex-row sm:items-center sm:justify-between">
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

      <div className="grid gap-3 border-b border-white/10 p-5 md:grid-cols-[1fr_auto] md:items-center">
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search original or short URLs"
        />
        <div className="flex flex-wrap gap-2">
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
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/10">
          <thead className="bg-white/5 text-left text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--muted)]">
            <tr>
              <th className="px-5 py-4">Original URL</th>
              <th className="px-5 py-4">Short URL</th>
              <th className="px-5 py-4">Clicks</th>
              <th className="px-5 py-4">QR</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {enrichedUrls.map((url) => {
              const shortLink = url.shortUrl || url.short_url;
              const qrLink =
                url.qrUrl ||
                (() => {
                  try {
                    const parsed = new URL(shortLink);
                    const slug = parsed.pathname.replace(/^\//, "");
                    return `${parsed.origin}/qr/${slug}`;
                  } catch (error) {
                    return shortLink;
                  }
                })();
              const bookmarkKey = url.short_url;
              const isBookmarked = Boolean(bookmarks[bookmarkKey]);

              return (
                <tr key={url._id} className="transition hover:bg-white/5">
                  <td className="max-w-[18rem] px-5 py-4 align-top">
                    <p className="truncate text-sm font-medium text-[color:var(--text)]">
                      {url.full_url}
                    </p>
                  </td>
                  <td className="px-5 py-4 align-top">
                    <a
                      href={shortLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-[color:var(--accent-2)] hover:underline"
                    >
                      {shortLink}
                    </a>
                  </td>
                  <td className="px-5 py-4 align-top">
                    <Badge tone={url.clicks > 5 ? "success" : "accent"}>
                      {url.clicks} {url.clicks === 1 ? "click" : "clicks"}
                    </Badge>
                  </td>
                  <td className="px-5 py-4 align-top">
                    <div className="flex items-center gap-2">
                      <Badge tone={url.qrScans > 0 ? "accent" : "neutral"}>
                        {url.qrScans ?? 0}
                      </Badge>
                      <div>
                        <QRPreview value={qrLink} size={100} />
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 align-top">
                    <Badge tone={isBookmarked ? "warning" : "neutral"}>
                      {isBookmarked ? "Bookmarked" : "Saved"}
                    </Badge>
                  </td>
                  <td className="px-5 py-4 align-top">
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => handleCopy(shortLink, url._id)}
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
                      >
                        {isBookmarked ? "Unbookmark" : "Save"}
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
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
