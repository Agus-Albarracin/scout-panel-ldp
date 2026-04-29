import type { Request, Response } from "express";
import { playerService } from "./player.service";
import type { PlayerCompareQuery, PlayerListQuery } from "./player.types";

export const playerController = {
  async list(req: Request, res: Response) {
    const result = await playerService.list(req.query as PlayerListQuery);
    return res.json(result);
  },

  async getById(req: Request, res: Response) {
    const result = await playerService.getById(String(req.params.id));
    return res.json(result);
  },

  async compare(req: Request, res: Response) {
    const result = await playerService.compare(req.query as unknown as PlayerCompareQuery);
    return res.json(result);
  }
};
