import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app.js";

describe("GET /api/orders", () => {
  it("returns all seeded orders without lines", async () => {
    const res = await request(app).get("/api/orders");
    expect(res.status).toBe(200);
    expect(res.body.items).toHaveLength(3);
    expect(res.body.total).toBe(3);

    for (const item of res.body.items) {
      expect(item).toHaveProperty("id");
      expect(item).toHaveProperty("placedAt");
      expect(item).toHaveProperty("total");
      expect(item).toHaveProperty("status");
      expect(item).not.toHaveProperty("lines");
    }
  });
});

describe("GET /api/orders/:id", () => {
  it("returns a seeded order with its lines array", async () => {
    const res = await request(app).get("/api/orders/order-001");
    expect(res.status).toBe(200);
    expect(res.body.id).toBe("order-001");
    expect(res.body.placedAt).toBe("2024-08-15T10:30:00Z");
    expect(res.body.total).toBe(59.97);
    expect(res.body.status).toBe("completed");
    expect(res.body.lines).toHaveLength(2);

    const line = res.body.lines[0];
    expect(line).toHaveProperty("sku");
    expect(line).toHaveProperty("name");
    expect(line).toHaveProperty("qty");
    expect(line).toHaveProperty("price");
  });

  it("returns 404 with error for an unknown id", async () => {
    const res = await request(app).get("/api/orders/nonexistent-id");
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "Order not found" });
  });
});

describe("GET /api/health", () => {
  it("returns 200 with status ok", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });
});
