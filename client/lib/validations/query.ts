import { z } from "zod";

export const recommendationQuerySchema = z.object({
  query: z.string().trim().min(3, "Please share at least three characters.").max(500),
});
