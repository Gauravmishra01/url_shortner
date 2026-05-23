import request from "supertest";
import app from "../app.js";
import test from "node:test";
import assert from "node:assert/strict";

test("GET /_health returns ok", async () => {
  const res = await request(app).get("/_health");
  assert.equal(res.status, 200);
  assert.deepEqual(res.body, { ok: true });
});
