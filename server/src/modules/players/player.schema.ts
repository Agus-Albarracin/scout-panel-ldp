import { z } from "zod";

const optionalNumber = z
  .string()
  .optional()
  .transform((value) => (value === undefined ? undefined : Number(value)))
  .pipe(z.number().int().nonnegative().optional());

export const playerListQuerySchema = z.object({
  search: z.string().trim().min(1).optional(),
  position: z.string().trim().min(1).optional(),
  nationality: z.string().trim().min(1).optional(),
  teamCountry: z.string().trim().min(1).optional(),
  minAge: optionalNumber,
  maxAge: optionalNumber,
  page: z
    .string()
    .optional()
    .transform((value) => (value === undefined ? 1 : Number(value)))
    .pipe(z.number().int().positive()),
  limit: z
    .string()
    .optional()
    .transform((value) => (value === undefined ? 10 : Number(value)))
    .pipe(z.number().int().positive().max(100))
});

export const uuidParamsSchema = z.object({
  id: z.uuid()
});

export const comparePlayersQuerySchema = z.object({
  ids: z
    .string()
    .transform((value) => value.split(",").map((id) => id.trim()).filter(Boolean))
    .pipe(z.array(z.uuid()).min(1, "Selecciona al menos 1 jugador").max(3, "Puedes seleccionar hasta 3 jugadores")),
  seasonId: z.uuid().optional()
});
