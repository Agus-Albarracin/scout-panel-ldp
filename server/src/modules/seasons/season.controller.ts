import type { Request, Response } from "express";
import { seasonService } from "./season.service";

export const seasonController = {
  async list(_req: Request, res: Response) {
    const result = await seasonService.list();
    return res.json(result);
  },

  async latest(_req: Request, res: Response) {
    const result = await seasonService.latest();
    return res.json(result);
  }
};
