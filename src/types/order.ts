import type { Customer } from "@/types/customer";
import type { Provider } from "@/types/provider";
import type { Service } from "@/types/service";
import type { ServiceAccount } from "@/types/service-account";

export type Order = {
  id: number;
  email: string;
  accountType: OrderAccountType;
  status: OrderStatus;
  startDate: Date;
  endDate: Date;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
  serviceId: number;
  serviceAccountId: number;
  providerId: number;
  customerId: number;
};

export type OrderDetails = Order & {
  service: Service;
  serviceAccount: ServiceAccount;
  provider: Provider;
  customer: Customer;
};

export const ORDER_STATUS = {
  paid: "Paid",
  due: "Due",
  unpaid: "Unpaid",
  gift: "Gift",
  combo: "Combo",
} as const;

export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

export const ORDER_ACCOUNT_TYPE = {
  personal: "Personal",
  shared: "Shared",
} as const;

export type OrderAccountType =
  (typeof ORDER_ACCOUNT_TYPE)[keyof typeof ORDER_ACCOUNT_TYPE];
