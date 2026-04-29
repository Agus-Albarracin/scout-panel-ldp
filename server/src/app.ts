import cors from "cors";
import express from "express";
import { errorMiddleware } from "./middlewares/error.middleware";
import { notFoundMiddleware } from "./middlewares/not-found.middleware";
import { playerRoutes } from "./modules/players/player.routes";
import { seasonRoutes } from "./modules/seasons/season.routes";
import { teamRoutes } from "./modules/teams/team.routes";

export const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  return res.json({
    ok: true,
    message: "Scout Panel API is running"
  });
});

app.use("/api/players", playerRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/seasons", seasonRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

