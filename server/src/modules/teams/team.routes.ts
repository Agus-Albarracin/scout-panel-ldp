import { Router } from "express";
import { validate } from "../../middlewares/validate.middleware";
import { teamController } from "./team.controller";
import { teamParamsSchema } from "./team.schema";

export const teamRoutes = Router();

teamRoutes.get("/", teamController.list);
teamRoutes.get("/:id", validate({ params: teamParamsSchema }), teamController.getById);
