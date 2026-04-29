import { Router } from "express";
import { seasonController } from "./season.controller";

export const seasonRoutes = Router();

seasonRoutes.get("/", seasonController.list);
seasonRoutes.get("/latest", seasonController.latest);
