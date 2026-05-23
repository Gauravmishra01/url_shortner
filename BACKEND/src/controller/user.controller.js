import wrapAsync from "../utils/tryCatchWrapper.js";
import { buildQrRedirectUrl, buildRedirectUrl } from "../utils/publicUrl.js";
import {
  getAllUserUrlsDao,
  getUserWorkspaceStateDao,
  updateUserWorkspaceStateDao,
} from "../dao/user.dao.js";

const defaultWorkspaceState = () => ({
  theme: "light",
  bookmarks: {},
  activity: [],
  notifications: [],
  onboardingComplete: false,
});

const normalizeWorkspaceState = (workspaceState = {}) => {
  const base = defaultWorkspaceState();
  const bookmarks =
    workspaceState.bookmarks && typeof workspaceState.bookmarks === "object"
      ? workspaceState.bookmarks
      : base.bookmarks;
  const activity = Array.isArray(workspaceState.activity)
    ? workspaceState.activity.slice(0, 12)
    : base.activity;
  const notifications = Array.isArray(workspaceState.notifications)
    ? workspaceState.notifications.slice(0, 12)
    : base.notifications;

  return {
    theme: workspaceState.theme === "dark" ? "dark" : "light",
    bookmarks,
    activity,
    notifications,
    onboardingComplete: Boolean(workspaceState.onboardingComplete),
  };
};

export const getAllUserUrls = wrapAsync(async (req, res) => {
  const { _id } = req.user;
  const urls = await getAllUserUrlsDao(_id);
  const normalizedUrls = urls.map((url) => ({
    ...url.toObject(),
    shortUrl: buildRedirectUrl(req, url.short_url),
    qrUrl: buildQrRedirectUrl(req, url.short_url),
  }));
  res.status(200).json({ message: "success", urls: normalizedUrls });
});

export const getUserWorkspaceState = wrapAsync(async (req, res) => {
  const user = await getUserWorkspaceStateDao(req.user._id);
  const workspaceState = normalizeWorkspaceState(user?.workspaceState);
  res.status(200).json({ message: "success", workspaceState });
});

export const updateUserWorkspaceState = wrapAsync(async (req, res) => {
  const incomingState = req.body?.workspaceState ?? req.body ?? {};
  const workspaceState = normalizeWorkspaceState(incomingState);
  const user = await updateUserWorkspaceStateDao(req.user._id, workspaceState);
  res.status(200).json({
    message: "success",
    workspaceState: normalizeWorkspaceState(user?.workspaceState),
  });
});
