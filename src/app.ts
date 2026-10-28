import express from "express";
import orderRouter from "./router/orderRouter";
import healthRouter from "./router/healthRouter";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(express.json());
app.use("/api", healthRouter);
app.use("/api", orderRouter);
app.use(errorHandler);

export default app;
