import { z } from "zod";

export const serviceSchema = z.object({
  name: z.string().min(1, "Service name is required"),
});

export type ServiceDto = z.infer<typeof serviceSchema>;
