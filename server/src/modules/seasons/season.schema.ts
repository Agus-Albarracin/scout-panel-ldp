import { z } from "zod";

export const seasonParamsSchema = z.object({
  id: z.uuid()
});
