import { Router } from "express";
import { validate } from "../../middlewares/validate.middleware";
import { playerController } from "./player.controller";
import { comparePlayersQuerySchema, playerListQuerySchema, uuidParamsSchema } from "./player.schema";

export const playerRoutes = Router();

playerRoutes.get(
  "/compare",
  validate({ query: comparePlayersQuerySchema }),
  playerController.compare
);

playerRoutes.get("/", validate({ query: playerListQuerySchema }), playerController.list);
playerRoutes.get("/:id", validate({ params: uuidParamsSchema }), playerController.getById);
