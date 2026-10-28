import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "../app";
import { clearOrders, resetOrders } from "../repository/orderRepository";

describe("GET /api/orders", () => {
  beforeEach(() => {
    resetOrders();
  });

  it("returns 200 with the three seeded orders", async () => {
    const res = await request(app).get("/api/orders");

    expect(res.status).toBe(200);
    expect(res.body.total).toBe(3);
    expect(res.body.items).toHaveLength(3);
  });

  it("each order has id, placedAt, total and status", async () => {
    const res = await request(app).get("/api/orders");

    for (const item of res.body.items) {
      expect(item).toHaveProperty("id");
      expect(item).toHaveProperty("placedAt");
      expect(item).toHaveProperty("total");
      expect(item).toHaveProperty("status");
      expect(typeof item.id).toBe("string");
      expect(typeof item.placedAt).toBe("string");
      expect(typeof item.total).toBe("number");
      expect(typeof item.status).toBe("string");
    }
  });

  it("returns the correct shape { items, total }", async () => {
    const res = await request(app).get("/api/orders");

    expect(res.body).toHaveProperty("items");
    expect(res.body).toHaveProperty("total");
    expect(Array.isArray(res.body.items)).toBe(true);
    expect(typeof res.body.total).toBe("number");
  });

  it("returns empty list after clearing orders", async () => {
    clearOrders();

    const res = await request(app).get("/api/orders");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ items: [], total: 0 });
  });
});

describe("GET /api/health", () => {
  it("returns 200 with status ok", async () => {
    const res = await request(app).get("/api/health");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });
});
