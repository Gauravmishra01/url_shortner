import React, { useMemo, useState } from "react";
import { createShortUrl } from "../api/shortUrl.api";
import { useSelector } from "react-redux";
import { queryClient } from "../main";
import { Badge, Button, Input } from "./ui-kit.jsx";
import QRPreview from "./QRPreview";
import { useAppUI } from "../context/AppUIContext.jsx";

const UrlForm = ({ embedded = false }) => {
  const [url, setUrl] = useState("https://www.google.com");
  const [shortUrl, setShortUrl] = useState();
  const [qrUrl, setQrUrl] = useState();
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);
  const [customSlug, setCustomSlug] = useState("");
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { pushToast, recordActivity } = useAppUI();

  const helperText = useMemo(() => {
    if (!url) return "Paste a long URL to turn it into a clean shareable link.";
    if (!/^https?:\/\//i.test(url))
      return "Use a full URL that begins with http:// or https://.";
    return "Optional custom slugs are available for signed-in users.";
  }, [url]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!/^https?:\/\//i.test(url)) {
      setError(
        "Please enter a valid URL that starts with http:// or https://.",
      );
      return;
    }

    setLoading(true);
    try {
      const response = await createShortUrl(
        url,
        customSlug.trim() || undefined,
      );
      setShortUrl(response.shortUrl);
      setQrUrl(response.qrUrl);
      queryClient.invalidateQueries({ queryKey: ["userUrls"] });
      setError(null);
      pushToast({
        title: "Link created",
        message: "Your shortened URL is ready to copy and share.",
        tone: "success",
      });
      recordActivity({
        title: "Shortened a URL",
        description: response.shortUrl,
        tone: "success",
        cta: response.shortUrl,
      });
    } catch (err) {
      setError(err.message);
      pushToast({
        title: "Could not shorten link",
        message: err.message,
        tone: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    pushToast({
      title: "Copied to clipboard",
      message: shortUrl,
      tone: "success",
    });

    // Reset the copied state after 2 seconds
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <form
      className={`space-y-5 ${embedded ? "" : "reveal-up"}`}
      onSubmit={handleSubmit}
    >
      <div className="space-y-2">
        <label
          htmlFor="url"
          className="text-sm font-semibold text-[color:var(--text)]"
        >
          Enter your URL
        </label>
        <Input
          type="url"
          id="url"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          placeholder="https://example.com"
          required
          autoComplete="url"
          inputMode="url"
          enterKeyHint="go"
        />
        <p className="text-sm text-[color:var(--muted)]">{helperText}</p>
      </div>

      {isAuthenticated ? (
        <div className="space-y-2">
          <label
            htmlFor="customSlug"
            className="text-sm font-semibold text-[color:var(--text)]"
          >
            Custom slug (optional)
          </label>
          <Input
            type="text"
            id="customSlug"
            value={customSlug}
            onChange={(event) => setCustomSlug(event.target.value)}
            placeholder="launch-campaign"
            autoComplete="off"
            enterKeyHint="go"
          />
        </div>
      ) : (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
          <Badge tone="neutral">Guest mode</Badge>
          <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">
            Sign in to unlock custom slugs, bookmarks, and a persistent
            dashboard.
          </p>
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full"
        disabled={loading}
      >
        {loading ? "Creating link..." : "Shorten URL"}
      </Button>

      {error ? (
        <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </div>
      ) : null}

      {shortUrl ? (
        <div className="space-y-3 rounded-3xl border border-emerald-400/20 bg-emerald-500/10 p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-emerald-100">
                Your shortened URL
              </p>
              <p className="text-sm text-emerald-50/80">
                Ready to copy and share.
              </p>
            </div>
            <Badge tone="success">Ready</Badge>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              type="text"
              readOnly
              value={shortUrl}
              className="sm:flex-1"
            />
            <Button
              type="button"
              variant={copied ? "secondary" : "primary"}
              size="md"
              onClick={handleCopy}
              className="w-full sm:w-28"
            >
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
          <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto]">
            <QRPreview
              value={(() => {
                try {
                  if (qrUrl) return qrUrl;
                  const u = new URL(shortUrl);
                  const slug = u.pathname.replace(/^\//, "");
                  return `${u.origin}/qr/${slug}`;
                } catch (e) {
                  return shortUrl;
                }
              })()}
              label="QR code"
            />
          </div>
        </div>
      ) : null}
    </form>
  );
};

export default UrlForm;
