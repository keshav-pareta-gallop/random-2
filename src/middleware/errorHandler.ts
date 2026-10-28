import type { Request, Response, NextFunction } from "express";

export interface ProblemResponse {
  error: string;
  message: string;
  statusCode: number;
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const statusCode = (err as any).statusCode ?? 500;
  const response: ProblemResponse = {
    error: err.name || "InternalServerError",
    message: err.message || "An unexpected error occurred",
    statusCode,
  };
  res.status(statusCode).json(response);
}
