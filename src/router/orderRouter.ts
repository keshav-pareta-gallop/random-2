import { Router } from "express";
import { listOrders } from "../service/orderService";

const orderRouter = Router();

orderRouter.get("/orders", (_req, res) => {
  const result = listOrders();
  res.json(result);
});

export default orderRouter;
