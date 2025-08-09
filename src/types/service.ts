import type { ServiceAccount } from "@/types/service-account";

export type Service = {
  id: number;
  name: string;
  logo: string;
  createdAt: string;
  updatedAt: string;
};

export type ServiceWithServiceAccount = Service & {
  serviceAccounts: ServiceAccount[];
};
