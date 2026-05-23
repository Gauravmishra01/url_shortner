import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useDispatch, useSelector } from "react-redux";
import { logout as logoutAction } from "../store/slice/authSlice";
import { logoutUser } from "../api/user.api";
import { Badge, Button, ThemeToggle } from "./ui-kit.jsx";
import { useAppUI } from "../context/AppUIContext.jsx";
import { clearStoredAuthToken } from "../utils/authSession";

const Navbar = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    unreadCount,
    notifications,
    markNotificationRead,
    clearNotifications,
  } = useAppUI();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } finally {
      clearStoredAuthToken();
      dispatch(logoutAction());
      navigate({ to: "/" });
      setMenuOpen(false);
    }
  };

  const visibleNotifications = useMemo(
    () => notifications.slice(0, 4),
    [notifications],
  );

  return (
    <nav className="sticky top-0 z-30 border-b border-white/10 bg-[color:var(--bg-elevated)] backdrop-blur-2xl">
      <div className="page-shell flex items-center justify-between gap-3 py-3 sm:py-4">
        <Link to="/" className="group flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-violet-500 text-sm font-black text-white shadow-lg shadow-blue-500/20 transition duration-200 group-hover:scale-105">
            U
          </span>
          <div className="leading-tight">
            <p className="text-base font-semibold tracking-tight text-[color:var(--text)]">
              url_shortner
            </p>
            <p className="text-xs text-[color:var(--muted)]">
              Premium link management
            </p>
          </div>
        </Link>

        <div className="hidden items-center gap-2 md:flex">
          <Link
            to="/"
            className="premium-button-subtle rounded-2xl px-4 py-2 text-sm font-semibold text-[color:var(--muted)] hover:text-[color:var(--text)]"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="premium-button-subtle rounded-2xl px-4 py-2 text-sm font-semibold text-[color:var(--muted)] hover:text-[color:var(--text)]"
          >
            About us
          </Link>
          <Link
            to="/dashboard"
            className="premium-button-subtle rounded-2xl px-4 py-2 text-sm font-semibold text-[color:var(--muted)] hover:text-[color:var(--text)]"
          >
            Dashboard
          </Link>
          <Link
            to="/links"
            className="premium-button-subtle rounded-2xl px-4 py-2 text-sm font-semibold text-[color:var(--muted)] hover:text-[color:var(--text)]"
          >
            Links
          </Link>
          <Link
            to="/activity"
            className="premium-button-subtle rounded-2xl px-4 py-2 text-sm font-semibold text-[color:var(--muted)] hover:text-[color:var(--text)]"
          >
            Activity
          </Link>
          {!isAuthenticated ? (
            <Link
              to="/auth"
              className="premium-button rounded-2xl px-4 py-2 text-sm font-semibold text-white"
            >
              Get started
            </Link>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setNotificationsOpen((open) => !open)}
              aria-label="Open notifications"
            >
              <span className="relative inline-flex h-5 w-5 items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path
                    d="M15 17h5l-1.4-1.4a2 2 0 0 1-.6-1.4V11a6 6 0 1 0-12 0v3.2c0 .53-.21 1.04-.59 1.42L4 17h5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path d="M10 17a2 2 0 0 0 4 0" strokeLinecap="round" />
                </svg>
                {unreadCount > 0 ? (
                  <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-violet-500 px-1 text-[10px] font-bold text-white">
                    {unreadCount}
                  </span>
                ) : null}
              </span>
            </Button>
            {notificationsOpen ? (
              <div className="absolute right-0 top-14 z-50 w-80 rounded-[24px] border border-white/10 bg-[color:var(--surface-strong)] p-3 shadow-2xl shadow-black/20 backdrop-blur-xl">
                <div className="flex items-center justify-between px-1 pb-2">
                  <p className="text-sm font-semibold text-[color:var(--text)]">
                    Notifications
                  </p>
                  <button
                    className="text-xs font-semibold text-[color:var(--accent-2)]"
                    onClick={clearNotifications}
                  >
                    Clear all
                  </button>
                </div>
                <div className="space-y-2">
                  {visibleNotifications.length === 0 ? (
                    <p className="rounded-2xl border border-dashed border-white/10 px-4 py-6 text-sm text-[color:var(--muted)]">
                      You’re all caught up.
                    </p>
                  ) : (
                    visibleNotifications.map((notification) => (
                      <button
                        key={notification.id}
                        onClick={() => markNotificationRead(notification.id)}
                        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left transition hover:bg-white/10"
                      >
                        <div className="flex items-start gap-3">
                          <span
                            className={`mt-1 h-2.5 w-2.5 rounded-full ${notification.read ? "bg-white/20" : "bg-sky-400"}`}
                          />
                          <div>
                            <p className="text-sm font-semibold text-[color:var(--text)]">
                              {notification.title}
                            </p>
                            <p className="mt-1 text-xs leading-5 text-[color:var(--muted)]">
                              {notification.description}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            ) : null}
          </div>

          {isAuthenticated ? (
            <>
              <div className="hidden rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-right md:block">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[color:var(--muted)]">
                  Signed in
                </p>
                <p className="text-sm font-semibold text-[color:var(--text)]">
                  {user?.name}
                </p>
              </div>
              <Button variant="primary" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : null}

          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Open menu"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            </svg>
          </Button>
        </div>
      </div>

      <div className="page-shell pb-3 md:hidden">
        <div className="mobile-chip-row soft-panel px-2 py-2">
          <Link
            to="/"
            className="rounded-full px-4 py-2 text-sm font-semibold text-[color:var(--text)]"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="rounded-full px-4 py-2 text-sm font-semibold text-[color:var(--text)]"
          >
            About us
          </Link>
          <Link
            to="/dashboard"
            className="rounded-full px-4 py-2 text-sm font-semibold text-[color:var(--text)]"
          >
            Dashboard
          </Link>
          <Link
            to="/links"
            className="rounded-full px-4 py-2 text-sm font-semibold text-[color:var(--text)]"
          >
            Links
          </Link>
          <Link
            to="/activity"
            className="rounded-full px-4 py-2 text-sm font-semibold text-[color:var(--text)]"
          >
            Activity
          </Link>
          {!isAuthenticated ? (
            <Link
              to="/auth"
              className="rounded-full bg-[color:var(--accent-2)] px-4 py-2 text-sm font-semibold text-white"
            >
              Sign in
            </Link>
          ) : null}
          {isAuthenticated ? (
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full px-4 py-2 text-sm font-semibold text-[color:var(--muted)]"
            >
              Logout
            </button>
          ) : null}
        </div>
      </div>

      {menuOpen ? (
        <div className="page-shell pb-4 md:hidden">
          <div className="premium-card space-y-2 p-3">
            <Link
              to="/"
              className="block rounded-2xl px-4 py-3 text-sm font-semibold text-[color:var(--text)] hover:bg-white/5"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="block rounded-2xl px-4 py-3 text-sm font-semibold text-[color:var(--text)] hover:bg-white/5"
            >
              About us
            </Link>
            <Link
              to="/dashboard"
              className="block rounded-2xl px-4 py-3 text-sm font-semibold text-[color:var(--text)] hover:bg-white/5"
            >
              Dashboard
            </Link>
            <Link
              to="/links"
              className="block rounded-2xl px-4 py-3 text-sm font-semibold text-[color:var(--text)] hover:bg-white/5"
            >
              Links
            </Link>
            <Link
              to="/activity"
              className="block rounded-2xl px-4 py-3 text-sm font-semibold text-[color:var(--text)] hover:bg-white/5"
            >
              Activity
            </Link>
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="w-full rounded-2xl px-4 py-3 text-left text-sm font-semibold text-[color:var(--text)] hover:bg-white/5"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/auth"
                className="block rounded-2xl px-4 py-3 text-sm font-semibold text-[color:var(--text)] hover:bg-white/5"
              >
                Get started
              </Link>
            )}
            {isAuthenticated ? (
              <p className="rounded-2xl bg-white/5 px-4 py-3 text-sm text-[color:var(--muted)]">
                Welcome back, {user?.name}.
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
    </nav>
  );
};

export default Navbar;
