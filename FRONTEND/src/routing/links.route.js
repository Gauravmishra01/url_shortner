import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./routeTree";
import { checkAuth } from "../utils/helper";
import LinksPage from "../pages/LinksPage";

export const linksRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/links",
  component: LinksPage,
  beforeLoad: checkAuth,
});
