import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./routeTree";
import { checkAuth } from "../utils/helper";
import ActivityPage from "../pages/ActivityPage";

export const activityRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/activity",
  component: ActivityPage,
  beforeLoad: checkAuth,
});
