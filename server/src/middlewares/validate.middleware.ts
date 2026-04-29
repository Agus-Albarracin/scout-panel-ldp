import type { NextFunction, Request, Response } from "express";
import type { ZodTypeAny } from "zod";
import { AppError } from "../shared/errors/AppError";

type ValidationSchemas = {
  body?: ZodTypeAny;
  query?: ZodTypeAny;
  params?: ZodTypeAny;
};

function replaceObject(target: Record<string, unknown>, source: unknown) {
  for (const key of Object.keys(target)) {
    delete target[key];
  }

  Object.assign(target, source);
}

function replaceQuery(req: Request, source: unknown) {
  Object.defineProperty(req, "query", {
    value: source,
    writable: true,
    configurable: true,
    enumerable: true
  });
}

export function validate(schemas: ValidationSchemas) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (schemas.body) {
        req.body = schemas.body.parse(req.body);
      }

      if (schemas.query) {
        replaceQuery(req, schemas.query.parse(req.query));
      }

      if (schemas.params) {
        replaceObject(req.params as Record<string, unknown>, schemas.params.parse(req.params));
      }

      next();
    } catch (error) {
      next(new AppError(error instanceof Error ? error.message : "Validation error", 400));
    }
  };
}

