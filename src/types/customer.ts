import type { Order } from "@/types/order";
import type { Service } from "@/types/service";
import type { ServiceAccount } from "@/types/service-account";

export type Customer = {
  id: number;
  name: string;
  personalEmail: string;
  phone: string;
  social?: CustomerSocial;
  socialLink?: string;
  lastPurchase: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type CustomerOrderDetails = Omit<
  Order,
  "serviceId" | "serviceAccountId" | "providerId"
> & {
  service: Service;
  serviceAccount: ServiceAccount;
};

export type CustomerDetails = Customer & {
  orders: CustomerOrderDetails[];
};

export const CUSTOMER_SOCIAL = {
  facebook: "Facebook",
  whatsapp: "WhatsApp",
  twitter: "Twitter",
  instagram: "Instagram",
} as const;

export type CustomerSocial =
  (typeof CUSTOMER_SOCIAL)[keyof typeof CUSTOMER_SOCIAL];
