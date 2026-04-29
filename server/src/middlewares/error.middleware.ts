import type { NextFunction, Request, Response } from "express";
import { AppError } from "../shared/errors/AppError";

export function errorMiddleware(
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      error: {
        message: error.message,
        statusCode: error.statusCode
      }
    });
  }

  return res.status(500).json({
    error: {
      message: "Internal server error",
      statusCode: 500
    }
  });
}

