import { z } from "zod";

export const dealerSchema = z.object({
  name: z.string().min(1, "Dealer name is required"),
});

export type DealerDto = z.infer<typeof dealerSchema>;
