import cors from "cors";
import express from "express";
import { authenticate } from "./middlewares/auth.middleware";
import { errorMiddleware } from "./middlewares/error.middleware";
import { notFoundMiddleware } from "./middlewares/not-found.middleware";
import { authRoutes } from "./modules/auth/auth.routes";
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

app.use("/api/auth", authRoutes);
app.use("/api/players", authenticate, playerRoutes);
app.use("/api/teams", authenticate, teamRoutes);
app.use("/api/seasons", authenticate, seasonRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

