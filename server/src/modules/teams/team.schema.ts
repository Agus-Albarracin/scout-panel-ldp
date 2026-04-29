import { z } from "zod";

export const teamParamsSchema = z.object({
  id: z.uuid()
});
