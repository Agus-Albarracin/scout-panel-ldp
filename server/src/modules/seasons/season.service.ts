import { AppError } from "../../shared/errors/AppError";
import { mapSeason } from "./season.mapper";
import { seasonRepository } from "./season.repository";

export const seasonService = {
  async list() {
    const seasons = await seasonRepository.findAll();
    return { data: seasons.map(mapSeason) };
  },

  async latest() {
    const season = await seasonRepository.findLatest();

    if (!season) {
      throw new AppError("Season not found", 404);
    }

    return mapSeason(season);
  }
};

