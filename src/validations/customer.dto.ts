import { z } from "zod";

import { CUSTOMER_SOCIAL } from "@/types/customer";

export const customerSchema = z.object({
  personalEmail: z.email("Invalid email"),
  name: z.string().min(1, "Required").max(255),
  phone: z.string().min(1, "Required").max(20),
  social: z.enum(CUSTOMER_SOCIAL, "Required").optional(),
  socialLink: z.string("Required").optional(),
});

export type CustomerDto = z.infer<typeof customerSchema>;
