import { createRootRoute } from "@tanstack/react-router";
import { homePageRoute } from "./homepage";
import { aboutRoute } from "./about.route";
import { authRoute } from "./auth.route";
import { dasboardRoute } from "./dashboard";
import { linksRoute } from "./links.route";
import { activityRoute } from "./activity.route";
import RootLayout from "../RootLayout";

export const rootRoute = createRootRoute({
  component: RootLayout,
});

export const routeTree = rootRoute.addChildren([
  homePageRoute,
  aboutRoute,
  authRoute,
  dasboardRoute,
  linksRoute,
  activityRoute,
]);
