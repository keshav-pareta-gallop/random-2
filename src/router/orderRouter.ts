import { Router } from "express";
import { z } from "zod";
import { listOrders, getOrder } from "../service/orderService.js";

const orderRouter = Router();

const idParamSchema = z.object({
  id: z.string().min(1),
});

orderRouter.get("/", (_req, res) => {
  const result = listOrders();
  res.json(result);
});

orderRouter.get("/:id", (req, res) => {
  const parsed = idParamSchema.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid order id" });
    return;
  }

  const order = getOrder(parsed.data.id);
  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }

  res.json(order);
});

export default orderRouter;
