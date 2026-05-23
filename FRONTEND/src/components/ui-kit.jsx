import React from "react";
import { useAppUI } from "../context/AppUIContext";

export const Button = React.forwardRef(
  ({ className = "", variant = "primary", size = "md", ...props }, ref) => {
    const variants = {
      primary: "premium-button",
      secondary: "premium-button-secondary",
      ghost: "premium-button-ghost",
      subtle: "premium-button-subtle",
    };

    const sizes = {
      sm: "min-h-11 px-3.5 py-2.5 text-sm",
      md: "min-h-11 px-4 py-3 text-sm",
      lg: "min-h-12 px-5 py-3.5 text-base",
    };

    return (
      <button
        ref={ref}
        className={`inline-flex select-none items-center justify-center gap-2 rounded-2xl font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-2)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent disabled:pointer-events-none disabled:opacity-60 active:scale-[0.99] ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";

export const Card = ({ className = "", padded = true, ...props }) => (
  <div
    className={`premium-card ${padded ? "p-4 sm:p-6" : ""} ${className}`}
    {...props}
  />
);

export const Input = React.forwardRef(({ className = "", ...props }, ref) => (
  <input ref={ref} className={`premium-input ${className}`} {...props} />
));

Input.displayName = "Input";

export const TextArea = React.forwardRef(
  ({ className = "", ...props }, ref) => (
    <textarea
      ref={ref}
      className={`premium-input min-h-28 resize-y ${className}`}
      {...props}
    />
  ),
);

TextArea.displayName = "TextArea";

export const Badge = ({ className = "", tone = "neutral", children }) => {
  const tones = {
    neutral: "badge-neutral",
    accent: "badge-accent",
    success: "badge-success",
    warning: "badge-warning",
    danger: "badge-danger",
  };

  return (
    <span className={`badge ${tones[tone]} ${className}`}>{children}</span>
  );
};

export const SectionHeading = ({ eyebrow, title, description, action }) => (
  <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
    <div className="max-w-2xl space-y-2">
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h2 className="section-title">{title}</h2>
      {description ? <p className="section-copy">{description}</p> : null}
    </div>
    {action ? <div className="shrink-0">{action}</div> : null}
  </div>
);

export const StatCard = ({
  label,
  value,
  detail,
  delta,
  icon,
  tone = "accent",
}) => (
  <Card className="stat-card">
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--muted)]">
          {label}
        </p>
        <p className="mt-2 text-3xl font-semibold tracking-tight text-[color:var(--text)]">
          {value}
        </p>
        <p className="mt-2 text-sm text-[color:var(--muted)]">{detail}</p>
      </div>
      <div className={`stat-icon stat-icon-${tone}`}>{icon}</div>
    </div>
    {delta ? (
      <p className="mt-5 text-sm font-medium text-[color:var(--accent-2)]">
        {delta}
      </p>
    ) : null}
  </Card>
);

export const SkeletonCard = () => (
  <Card className="animate-pulse space-y-4">
    <div className="h-4 w-1/3 rounded-full skeleton-block" />
    <div className="h-10 rounded-2xl skeleton-block" />
    <div className="grid gap-3 sm:grid-cols-3">
      <div className="h-20 rounded-2xl skeleton-block" />
      <div className="h-20 rounded-2xl skeleton-block" />
      <div className="h-20 rounded-2xl skeleton-block" />
    </div>
  </Card>
);

export const SkeletonTable = () => (
  <Card className="overflow-hidden p-0">
    <div className="border-b border-white/10 px-4 py-4 sm:px-5">
      <div className="h-4 w-40 rounded-full skeleton-block" />
    </div>
    <div className="space-y-3 p-4 sm:p-5">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="space-y-3 rounded-3xl border border-white/5 p-4"
        >
          <div className="h-4 w-3/4 rounded-full skeleton-block" />
          <div className="h-3 w-1/2 rounded-full skeleton-block" />
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="h-9 rounded-full skeleton-block" />
            <div className="h-9 rounded-full skeleton-block" />
            <div className="h-9 rounded-full skeleton-block" />
          </div>
        </div>
      ))}
    </div>
  </Card>
);

export const EmptyState = ({ title, description, action, illustration }) => (
  <Card className="text-center">
    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-[color:var(--accent-2)]">
      {illustration || (
        <svg
          viewBox="0 0 24 24"
          className="h-7 w-7"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path
            d="M13 10V3L4 14h7v7l9-11h-7z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </div>
    <h3 className="text-xl font-semibold tracking-tight text-[color:var(--text)]">
      {title}
    </h3>
    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[color:var(--muted)]">
      {description}
    </p>
    {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
  </Card>
);

export const ErrorState = ({
  title = "Something went wrong",
  description,
  action,
}) => (
  <Card className="border border-rose-400/20 bg-rose-500/10">
    <div className="flex items-start gap-4">
      <div className="mt-1 rounded-2xl bg-rose-500/15 p-3 text-rose-200">
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path
            d="M12 8v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.72 3h16.92a2 2 0 0 0 1.72-3L13.71 3.86a2 2 0 0 0-3.42 0Z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-[color:var(--text)]">
          {title}
        </h3>
        <p className="mt-1 text-sm leading-6 text-[color:var(--muted)]">
          {description}
        </p>
        {action ? <div className="mt-4">{action}</div> : null}
      </div>
    </div>
  </Card>
);

export const ProgressBar = ({ value = 0, label }) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between text-sm text-[color:var(--muted)]">
      <span>{label}</span>
      <span>{Math.round(value)}%</span>
    </div>
    <div className="h-2 overflow-hidden rounded-full bg-white/10">
      <div
        className="h-full rounded-full progress-bar"
        style={{ width: `${value}%` }}
      />
    </div>
  </div>
);

export const ThemeToggle = ({ className = "" }) => {
  const { theme, toggleTheme } = useAppUI();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className={`theme-toggle ${className}`}
    >
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--text)]">
        {theme === "dark" ? "D" : "L"}
      </span>
      <span className="hidden sm:inline">
        {theme === "dark" ? "Dark" : "Light"}
      </span>
    </Button>
  );
};

export const ToastViewport = () => {
  const { toasts, removeToast } = useAppUI();

  return (
    <div className="pointer-events-none fixed bottom-4 left-4 right-4 z-[60] flex max-h-[calc(100vh-6rem)] flex-col gap-3 sm:bottom-auto sm:left-auto sm:right-6 sm:top-6 sm:w-[calc(100vw-2rem)] sm:max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto toast-panel"
          role="status"
          aria-live="polite"
        >
          <div className="flex items-start gap-3">
            <div
              className={`mt-0.5 h-2.5 w-2.5 rounded-full ${toast.tone === "success" ? "bg-emerald-400" : toast.tone === "danger" ? "bg-rose-400" : "bg-sky-400"}`}
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-[color:var(--text)]">
                {toast.title}
              </p>
              <p className="mt-1 text-sm leading-6 text-[color:var(--muted)]">
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="rounded-full p-1 text-[color:var(--muted)] transition hover:bg-white/10 hover:text-[color:var(--text)]"
              aria-label="Dismiss notification"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="m6 6 12 12M18 6 6 18" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
