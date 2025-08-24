import { fetchApi } from "@/lib/api";
import type {
  ServiceAccount,
  ServiceAccountDetails,
} from "@/types/service-account";
import type { ServiceAccountDto } from "@/validations/service-account.dto";

export const SERVICE_ACCOUNT_CACHE_KEY = "service-accounts";

export const createServiceAccount = async (data: ServiceAccountDto) => {
  return await fetchApi<ServiceAccount>("/service-account", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const getAllServiceAccounts = async () => {
  return await fetchApi<ServiceAccount[]>("/service-account", {
    method: "GET",
    cache: "force-cache",
    next: { tags: [SERVICE_ACCOUNT_CACHE_KEY] },
  });
};

export const getServiceAccountById = async (id: number) => {
  return await fetchApi<ServiceAccountDetails>(`/service-account/${id}`, {
    method: "GET",
  });
};

export const updateServiceAccount = async ({
  id,
  data,
}: {
  id: number;
  data: ServiceAccountDto;
}) => {
  return await fetchApi<ServiceAccount>(`/service-account/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
};

export const deleteServiceAccount = async (id: number) => {
  return await fetchApi<void>(`/service-account/${id}`, {
    method: "DELETE",
  });
};

export const toggleServiceAccountStatus = async (id: number) => {
  return await fetchApi<void>(`/service-account/toggle-status/${id}`, {
    method: "PATCH",
  });
};
