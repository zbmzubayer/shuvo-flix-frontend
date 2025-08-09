"use server";

import { revalidateTag } from "next/cache";

import { fetchApi } from "@/lib/api";
import type { ServiceAccount } from "@/types/service-account";
import type { ServiceAccountDto } from "@/validations/service-account.dto";

export const createServiceAccount = async (data: ServiceAccountDto) => {
  const res = await fetchApi<ServiceAccount>("/service-account", {
    method: "POST",
    body: JSON.stringify(data),
  });

  revalidateTag("service-accounts");

  return res;
};

export const getAllServiceAccounts = async () => {
  return await fetchApi<ServiceAccount[]>("/service-account", {
    method: "GET",
    cache: "no-store",
    next: { tags: ["service-accounts"] },
  });
};

export const getServiceAccountById = async (id: string) => {
  return await fetchApi<ServiceAccount>(`/service-account/${id}`, {
    method: "GET",
    cache: "no-store",
    next: { tags: [`service-account-${id}`] },
  });
};

export const updateServiceAccount = async (
  id: number,
  data: ServiceAccountDto
) => {
  return await fetchApi<ServiceAccount>(`/service-account/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const deleteServiceAccount = async (id: number) => {
  const res = await fetchApi<void>(`/service-account/${id}`, {
    method: "DELETE",
  });

  revalidateTag("service-accounts");

  return res;
};
