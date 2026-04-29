import type { Season } from "../../generated/prisma/client";

export type SeasonDto = Pick<Season, "id" | "name" | "year">;
