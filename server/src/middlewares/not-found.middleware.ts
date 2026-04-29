import type { Request, Response } from "express";

export function notFoundMiddleware(req: Request, res: Response) {
  return res.status(404).json({
    error: {
      message: `Route ${req.method} ${req.originalUrl} not found`,
      statusCode: 404
    }
  });
}

