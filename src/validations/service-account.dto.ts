import { z } from "zod";

import { SERVICE_ACCOUNT_PAYMENT } from "@/types/service-account";

export const serviceAccountSchema = z.object({
  name: z.string().min(1, "Required").max(255),
  email: z.email("Invalid email"),
  password: z.string().min(1, "Required"),
  note: z.string().max(1000).optional(),
  payment: z.enum(SERVICE_ACCOUNT_PAYMENT, "Required"),
  personalSlots: z.int("Required").min(0),
  sharedSlots: z.int("Required").min(0),
  joinDate: z.date("Required"),
  expiryDate: z.date("Required"),
  dealerId: z.int("Required").positive(),
  serviceId: z.int("Required").positive(),
});

export type ServiceAccountDto = z.infer<typeof serviceAccountSchema>;
