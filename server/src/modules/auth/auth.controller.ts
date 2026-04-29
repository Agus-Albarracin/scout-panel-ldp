import type { Request, Response } from "express";
import { authService } from "./auth.service";

export const authController = {
  async register(req: Request, res: Response) {
    const result = await authService.register(req.body);
    return res.status(201).json(result);
  },

  async login(req: Request, res: Response) {
    const result = await authService.login(req.body);
    return res.json(result);
  },

  async me(req: Request, res: Response) {
    const userId = res.locals.userId as string;
    const result = await authService.me(userId);
    return res.json(result);
  }
};
