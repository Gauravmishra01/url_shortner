/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useMemo,
  useState,
} from "react";
import { useSelector } from "react-redux";
import {
  getUserWorkspaceState,
  updateUserWorkspaceState,
} from "../api/user.api";

const UIContext = createContext(null);

const storageKeys = {
  theme: "urlshortner.theme",
  bookmarks: "urlshortner.bookmarks",
  activity: "urlshortner.activity",
  notifications: "urlshortner.notifications",
  onboarding: "urlshortner.onboarding",
};

const safeRead = (key, fallback) => {
  if (typeof window === "undefined") return fallback;

  try {
    const storedValue = window.localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : fallback;
  } catch {
    return fallback;
  }
};

const safeWrite = (key, value) => {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore quota and serialization errors.
  }
};

const makeId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

export const AppUIProvider = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [theme, setTheme] = useState(() => {
    const savedTheme = safeRead(storageKeys.theme, null);
    if (savedTheme === "light" || savedTheme === "dark") return savedTheme;

    if (typeof window !== "undefined" && window.matchMedia) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }

    return "light";
  });
  const [toasts, setToasts] = useState([]);
  const [bookmarks, setBookmarks] = useState(() =>
    safeRead(storageKeys.bookmarks, {}),
  );
  const [activity, setActivity] = useState(() =>
    safeRead(storageKeys.activity, []),
  );
  const [notifications, setNotifications] = useState(() =>
    safeRead(storageKeys.notifications, []),
  );
  const [onboardingComplete, setOnboardingComplete] = useState(() =>
    safeRead(storageKeys.onboarding, false),
  );
  const [hasLoadedRemoteState, setHasLoadedRemoteState] = useState(false);
  const lastSavedSnapshotRef = useRef("");

  useEffect(() => {
    if (typeof document === "undefined") return;

    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    safeWrite(storageKeys.theme, theme);
  }, [theme]);

  useEffect(() => safeWrite(storageKeys.bookmarks, bookmarks), [bookmarks]);
  useEffect(() => safeWrite(storageKeys.activity, activity), [activity]);
  useEffect(
    () => safeWrite(storageKeys.notifications, notifications),
    [notifications],
  );
  useEffect(
    () => safeWrite(storageKeys.onboarding, onboardingComplete),
    [onboardingComplete],
  );

  useEffect(() => {
    if (!isAuthenticated) {
      setHasLoadedRemoteState(false);
      lastSavedSnapshotRef.current = "";
      return;
    }

    let cancelled = false;

    const hydrateWorkspaceState = async () => {
      try {
        const response = await getUserWorkspaceState();
        if (cancelled) return;

        const remoteState = response?.workspaceState ?? {};
        const nextTheme = remoteState.theme === "dark" ? "dark" : "light";
        const nextBookmarks =
          remoteState.bookmarks && typeof remoteState.bookmarks === "object"
            ? remoteState.bookmarks
            : {};
        const nextActivity = Array.isArray(remoteState.activity)
          ? remoteState.activity
          : [];
        const nextNotifications = Array.isArray(remoteState.notifications)
          ? remoteState.notifications
          : [];
        const nextOnboardingComplete = Boolean(remoteState.onboardingComplete);

        setTheme(nextTheme);
        setBookmarks(nextBookmarks);
        setActivity(nextActivity);
        setNotifications(nextNotifications);
        setOnboardingComplete(nextOnboardingComplete);

        lastSavedSnapshotRef.current = JSON.stringify({
          theme: nextTheme,
          bookmarks: nextBookmarks,
          activity: nextActivity,
          notifications: nextNotifications,
          onboardingComplete: nextOnboardingComplete,
        });
      } catch {
        // Fall back to the cached local workspace state if the remote state is unavailable.
      } finally {
        if (!cancelled) {
          setHasLoadedRemoteState(true);
        }
      }
    };

    hydrateWorkspaceState();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  const workspaceSnapshot = useMemo(
    () =>
      JSON.stringify({
        theme,
        bookmarks,
        activity,
        notifications,
        onboardingComplete,
      }),
    [activity, bookmarks, notifications, onboardingComplete, theme],
  );

  useEffect(() => {
    if (!isAuthenticated || !hasLoadedRemoteState) return;
    if (workspaceSnapshot === lastSavedSnapshotRef.current) return;

    const saveTimer = window.setTimeout(() => {
      updateUserWorkspaceState({
        theme,
        bookmarks,
        activity,
        notifications,
        onboardingComplete,
      })
        .then((response) => {
          const savedState = response?.workspaceState;
          if (savedState) {
            lastSavedSnapshotRef.current = JSON.stringify(savedState);
          } else {
            lastSavedSnapshotRef.current = workspaceSnapshot;
          }
        })
        .catch(() => {
          // Keep the local cache available if the sync fails.
        });
    }, 350);

    return () => window.clearTimeout(saveTimer);
  }, [
    activity,
    bookmarks,
    hasLoadedRemoteState,
    isAuthenticated,
    notifications,
    onboardingComplete,
    theme,
    workspaceSnapshot,
  ]);

  const removeToast = useCallback((toastId) => {
    setToasts((currentToasts) =>
      currentToasts.filter((toast) => toast.id !== toastId),
    );
  }, []);

  const pushToast = useCallback(
    ({ title, message, tone = "default" }) => {
      const toastId = makeId();
      const toast = {
        id: toastId,
        title,
        message,
        tone,
      };

      setToasts((currentToasts) => [toast, ...currentToasts].slice(0, 4));
      window.setTimeout(() => removeToast(toastId), 3800);

      return toastId;
    },
    [removeToast],
  );

  const recordActivity = useCallback(
    ({ title, description, tone = "default", cta }) => {
      const entry = {
        id: makeId(),
        title,
        description,
        tone,
        cta,
        createdAt: new Date().toISOString(),
      };

      setActivity((current) => [entry, ...current].slice(0, 8));
      setNotifications((current) =>
        [
          {
            id: makeId(),
            title,
            description,
            tone,
            read: false,
            createdAt: entry.createdAt,
          },
          ...current,
        ].slice(0, 10),
      );

      return entry;
    },
    [],
  );

  const toggleTheme = useCallback(() => {
    setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
  }, []);

  const markNotificationRead = useCallback((notificationId) => {
    setNotifications((currentNotifications) =>
      currentNotifications.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification,
      ),
    );
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const setBookmark = useCallback((bookmarkKey, payload) => {
    setBookmarks((currentBookmarks) => {
      const nextBookmarks = {
        ...currentBookmarks,
        [bookmarkKey]: payload,
      };

      if (!payload) {
        delete nextBookmarks[bookmarkKey];
      }

      return nextBookmarks;
    });
  }, []);

  const toggleBookmark = useCallback(
    (bookmarkKey, metadata = {}) => {
      let nextState = false;

      setBookmarks((currentBookmarks) => {
        const hasBookmark = Boolean(currentBookmarks[bookmarkKey]);
        nextState = !hasBookmark;

        if (hasBookmark) {
          const nextBookmarks = { ...currentBookmarks };
          delete nextBookmarks[bookmarkKey];
          return nextBookmarks;
        }

        return {
          ...currentBookmarks,
          [bookmarkKey]: {
            id: bookmarkKey,
            ...metadata,
            bookmarkedAt: new Date().toISOString(),
          },
        };
      });

      const title = nextState ? "Saved to bookmarks" : "Removed from bookmarks";
      const description =
        metadata.label ||
        metadata.shortUrl ||
        "Your link collection was updated.";

      pushToast({
        title,
        message: description,
        tone: nextState ? "success" : "default",
      });

      recordActivity({
        title,
        description,
        tone: nextState ? "success" : "default",
        cta: metadata.shortUrl,
      });

      return nextState;
    },
    [pushToast, recordActivity],
  );

  const markOnboardingComplete = useCallback(() => {
    setOnboardingComplete(true);
    pushToast({
      title: "Onboarding complete",
      message: "Your workspace is ready to use.",
      tone: "success",
    });
  }, [pushToast]);

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.read).length,
    [notifications],
  );

  const value = useMemo(
    () => ({
      theme,
      isDarkMode: theme === "dark",
      toggleTheme,
      toasts,
      pushToast,
      removeToast,
      bookmarks,
      setBookmark,
      toggleBookmark,
      activity,
      recordActivity,
      notifications,
      unreadCount,
      markNotificationRead,
      clearNotifications,
      onboardingComplete,
      markOnboardingComplete,
    }),
    [
      activity,
      bookmarks,
      clearNotifications,
      markNotificationRead,
      markOnboardingComplete,
      onboardingComplete,
      pushToast,
      recordActivity,
      removeToast,
      setBookmark,
      theme,
      toggleBookmark,
      toggleTheme,
      toasts,
      unreadCount,
      notifications,
    ],
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};

export const useAppUI = () => {
  const context = useContext(UIContext);

  if (!context) {
    throw new Error("useAppUI must be used within an AppUIProvider");
  }

  return context;
};
