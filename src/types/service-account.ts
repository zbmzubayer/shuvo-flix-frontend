export type ServiceAccount = {
  id: number;
  name: string;
  email: string;
  password: string;
  note: string | null;
  isActive: boolean;
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

export const SERVICE_ACCOUNT_PAYMENT = {
  paid: "Paid",
  due: "Due",
  unpaid: "Unpaid",
} as const;

export type ServiceAccountPayment =
  (typeof SERVICE_ACCOUNT_PAYMENT)[keyof typeof SERVICE_ACCOUNT_PAYMENT];
