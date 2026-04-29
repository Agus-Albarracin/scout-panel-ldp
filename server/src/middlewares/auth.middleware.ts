import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { AppError } from "../shared/errors/AppError";

type JwtPayload = {
  sub?: string;
};

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const [scheme, token] = header?.split(" ") ?? [];

  if (scheme !== "Bearer" || !token) {
    return next(new AppError("Authentication token is required", 401));
  }

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

    if (!payload.sub) {
      return next(new AppError("Invalid authentication token", 401));
    }

    res.locals.userId = payload.sub;
    return next();
  } catch {
    return next(new AppError("Invalid authentication token", 401));
  }
}
