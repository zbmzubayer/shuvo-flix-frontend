import type { Customer } from "@/types/customer";
import type { Order } from "@/types/order";

export type ServiceAccount = {
  id: number;
  name: string;
  email: string;
  password: string;
  note: string | null;
  status: ServiceAccountStatus;
  payment: ServiceAccountPayment;
  personalSlots: number;
  sharedSlots: number;
  soldPersonalSlots: number;
  soldSharedSlots: number;
  joinDate: Date;
  expiryDate: Date;
  createdAt: Date;
  updatedAt: Date;
  dealerId: number;
  serviceId: number;
};

export type OrderWithCustomer = Omit<Order, "customerId"> & {
  customer: Customer;
};

export type ServiceAccountDetails = ServiceAccount & {
  orders: OrderWithCustomer[];
};

export const SERVICE_ACCOUNT_PAYMENT = {
  paid: "Paid",
  due: "Due",
  unpaid: "Unpaid",
} as const;

export type ServiceAccountPayment =
  (typeof SERVICE_ACCOUNT_PAYMENT)[keyof typeof SERVICE_ACCOUNT_PAYMENT];

export const SERVICE_ACCOUNT_STATUS = {
  new: "New",
  partial: "Partial",
  full: "Full",
  disabled: "Disabled",
} as const;

export type ServiceAccountStatus =
  (typeof SERVICE_ACCOUNT_STATUS)[keyof typeof SERVICE_ACCOUNT_STATUS];
