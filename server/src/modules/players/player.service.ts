import type { Prisma } from "../../generated/prisma/client";
import { AppError } from "../../shared/errors/AppError";
import { birthDateRangeFromAge } from "../../shared/utils/calculate-age";
import { buildPagination, getPagination } from "../../shared/utils/pagination";
import { seasonRepository } from "../seasons/season.repository";
import { mapSeason } from "../seasons/season.mapper";
import { mapPlayerComparison, mapPlayerDetail, mapPlayerListItem } from "./player.mapper";
import { playerRepository } from "./player.repository";
import type { PlayerCompareQuery, PlayerListQuery } from "./player.types";

export const playerService = {
  async list(query: PlayerListQuery) {
    if (query.minAge !== undefined && query.maxAge !== undefined && query.minAge > query.maxAge) {
      throw new AppError("minAge cannot be greater than maxAge", 400);
    }

    const { page, limit, skip } = getPagination(query);
    const where: Prisma.PlayerWhereInput = {
      ...(query.search && { name: { contains: query.search, mode: "insensitive" } }),
      ...(query.position && { position: { equals: query.position, mode: "insensitive" } }),
      ...(query.nationality && { nationality: { equals: query.nationality, mode: "insensitive" } }),
      ...(query.teamCountry && { team: { country: { equals: query.teamCountry, mode: "insensitive" } } }),
      ...(birthDateRangeFromAge(query.minAge, query.maxAge) && {
        birthDate: birthDateRangeFromAge(query.minAge, query.maxAge)
      })
    };

    const [players, total] = await Promise.all([
      playerRepository.findMany(where, skip, limit),
      playerRepository.count(where)
    ]);

    return {
      data: players.map(mapPlayerListItem),
      pagination: buildPagination(page, limit, total)
    };
  },

  async getById(id: string) {
    const player = await playerRepository.findById(id);

    if (!player) {
      throw new AppError("Player not found", 404);
    }

    return mapPlayerDetail(player);
  },

  async compare(query: PlayerCompareQuery) {
    const uniqueIds = Array.from(new Set(query.ids));

    if (uniqueIds.length < 2 || uniqueIds.length > 3) {
      throw new AppError("Comparison requires between 2 and 3 players", 400);
    }

    const season = query.seasonId
      ? await seasonRepository.findById(query.seasonId)
      : await seasonRepository.findLatest();

    if (!season) {
      throw new AppError("Season not found", 404);
    }

    const players = await playerRepository.findByIds(uniqueIds, season.id);

    if (players.length !== uniqueIds.length) {
      throw new AppError("Player not found", 404);
    }

    const order = new Map(uniqueIds.map((id, index) => [id, index]));
    const sortedPlayers = players.sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0));

    return {
      season: mapSeason(season),
      players: sortedPlayers.map((player) => mapPlayerComparison(player, season.id))
    };
  }
};

