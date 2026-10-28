import express from "express";
import orderRouter from "./router/orderRouter.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/orders", orderRouter);

app.use(errorHandler);

export default app;
