import { z } from "zod";

import { ORDER_ACCOUNT_TYPE, ORDER_STATUS } from "@/types/order";
import { customerSchema } from "@/validations/customer.dto";

export const orderSchema = z.object({
  customer: customerSchema,
  email: z.email("Invalid email"),
  accountType: z.enum(ORDER_ACCOUNT_TYPE, "Required"),
  status: z.enum(ORDER_STATUS, "Required"),
  startDate: z.date("Required"),
  endDate: z.date("Required"),
  serviceAccountId: z.int("Required"),
  providerId: z.int("Required"),
  note: z.string().max(500).optional(),
});

export type OrderDto = z.infer<typeof orderSchema>;

export const orderFormSchema = orderSchema
  .omit({ startDate: true, endDate: true })
  .extend({
    dateRange: z.object(
      { from: z.date("Required"), to: z.date("Required") },
      "Required"
    ),
  });

export type OrderFormDto = z.infer<typeof orderFormSchema>;
