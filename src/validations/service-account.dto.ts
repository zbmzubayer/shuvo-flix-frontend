import { z } from "zod";

import { SERVICE_ACCOUNT_PAYMENT } from "@/types/service-account";

export const serviceAccountSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  email: z.email(),
  password: z.string().min(1, "Password is required"),
  note: z.string().max(1000).optional(),
  payment: z.enum(SERVICE_ACCOUNT_PAYMENT, "Payment status is required"),
  personalSlots: z.int("Personal slots are required").min(0),
  sharedSlots: z.int("Shared slots are required").min(0),
  joinDate: z.date("Join date is required"),
  expiryDate: z.date("Expiry date is required"),
  dealerId: z.int("Dealer is required").positive(),
  serviceId: z.int("Service is required").positive(),
});

export type ServiceAccountDto = z.infer<typeof serviceAccountSchema>;
