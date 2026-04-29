import type { Request, Response } from "express";
import { teamService } from "./team.service";

export const teamController = {
  async list(_req: Request, res: Response) {
    const result = await teamService.list();
    return res.json(result);
  },

  async getById(req: Request, res: Response) {
    const result = await teamService.getById(String(req.params.id));
    return res.json(result);
  }
};
