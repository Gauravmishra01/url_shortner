import request from "supertest";
import app from "../app.js";
import test from "node:test";
import assert from "node:assert/strict";
import { getRequestToken } from "../src/utils/requestToken.js";

test("GET /_health returns ok", async () => {
  const res = await request(app).get("/_health");
  assert.equal(res.status, 200);
  assert.deepEqual(res.body, { ok: true });
});

test("GET /_health allows private network origins", async () => {
  const res = await request(app)
    .get("/_health")
    .set("Origin", "http://192.168.1.25:5173");

  assert.equal(res.status, 200);
  assert.equal(
    res.headers["access-control-allow-origin"],
    "http://192.168.1.25:5173",
  );
});

test("getRequestToken prefers bearer auth when cookies are unavailable", () => {
  const token = getRequestToken({
    cookies: {},
    get: (headerName) =>
      headerName.toLowerCase() === "authorization"
        ? "Bearer mobile-token-123"
        : "",
  });

  assert.equal(token, "mobile-token-123");
});
