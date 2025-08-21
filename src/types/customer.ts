import type { Order } from "@/types/order";

export type Customer = {
  id: number;
  name: string;
  personalEmail: string;
  phone: string;
  social: string;
  lastPurchase: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type CustomerWithOrder = Customer & {
  orders: Order[];
};

export const CUSTOMER_SOCIAL = {
  facebook: "Facebook",
  whatsapp: "WhatsApp",
  twitter: "Twitter",
  instagram: "Instagram",
} as const;

export type CustomerSocial =
  (typeof CUSTOMER_SOCIAL)[keyof typeof CUSTOMER_SOCIAL];
