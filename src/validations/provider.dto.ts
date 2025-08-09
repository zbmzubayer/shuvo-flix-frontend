import { z } from "zod";

export const providerSchema = z.object({
  name: z.string().min(1, "Provider name is required"),
});

export type ProviderDto = z.infer<typeof providerSchema>;
