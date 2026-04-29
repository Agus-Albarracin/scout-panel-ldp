import { AppError } from "../../shared/errors/AppError";
import { mapTeam, mapTeamDetail } from "./team.mapper";
import { teamRepository } from "./team.repository";

export const teamService = {
  async list() {
    const teams = await teamRepository.findAll();
    return { data: teams.map(mapTeam) };
  },

  async getById(id: string) {
    const team = await teamRepository.findById(id);

    if (!team) {
      throw new AppError("Team not found", 404);
    }

    return mapTeamDetail(team);
  }
};

