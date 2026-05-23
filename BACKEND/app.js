import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/config/monogo.config.js";
import short_url from "./src/routes/short_url.route.js";
import user_routes from "./src/routes/user.routes.js";
import auth_routes from "./src/routes/auth.routes.js";
import {
  redirectFromShortUrl,
  qrRedirect,
} from "./src/controller/short_url.controller.js";
import { errorHandler } from "./src/utils/errorHandler.js";
import { cookieOptions } from "./src/config/config.js";
import cors from "cors";
import { attachUser } from "./src/utils/attachUser.js";
import cookieParser from "cookie-parser";

dotenv.config({ path: "./.env" });

const app = express();

const isPrivateNetworkHostname = (hostname) => {
  if (!hostname) return false;

  const normalizedHostname = hostname.toLowerCase();
  if (
    normalizedHostname === "localhost" ||
    normalizedHostname === "127.0.0.1" ||
    normalizedHostname === "::1"
  ) {
    return true;
  }

  if (normalizedHostname.endsWith(".local")) {
    return true;
  }

  const ipv4Parts = normalizedHostname.split(".").map((part) => Number(part));
  if (ipv4Parts.length !== 4 || ipv4Parts.some(Number.isNaN)) {
    return false;
  }

  const [firstOctet, secondOctet] = ipv4Parts;
  if (firstOctet === 10) return true;
  if (firstOctet === 192 && secondOctet === 168) return true;
  if (firstOctet === 172 && secondOctet >= 16 && secondOctet <= 31) return true;

  return false;
};

const isAllowedOrigin = (origin) => {
  if (!origin) return true;

  if (allowedOrigins.includes(origin)) {
    return true;
  }

  try {
    const hostname = new URL(origin).hostname;
    if (isPrivateNetworkHostname(hostname)) {
      return true;
    }

    if (hostname.endsWith(".vercel.app")) {
      return true;
    }
  } catch (error) {
    return false;
  }

  return false;
};

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
        return;
      }

      console.warn(`CORS blocked for origin: ${origin}`);
      callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// lightweight healthcheck for tests and tooling
app.get("/_health", (req, res) => res.json({ ok: true }));

app.use(attachUser);

app.use("/api/user", user_routes);
app.use("/api/auth", auth_routes);
app.use("/api/create", short_url);
app.get("/qr/:id", qrRedirect);
app.get("/:id", redirectFromShortUrl);

app.use(errorHandler);

// lightweight healthcheck for tests
app.get("/_health", (req, res) => res.json({ ok: true }));

// Debug endpoint - returns CORS and cookie settings (no secrets)
app.get("/_debug/cors", (req, res) => {
  res.json({
    allowedOrigins,
    cookieOptions: {
      sameSite: cookieOptions.sameSite,
      secure: cookieOptions.secure,
      httpOnly: cookieOptions.httpOnly,
    },
    env: {
      NODE_ENV: process.env.NODE_ENV || "development",
      APP_URL: process.env.APP_URL || null,
    },
  });
});

if (process.env.NODE_ENV !== "test") {
  app.listen(3000, () => {
    connectDB();
    console.log("Server is running on http://localhost:3000");
  });
}

export default app;

// GET - Redirection
