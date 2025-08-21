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

  revalidateTag("services");
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

export const updateServiceAccount = async ({
  id,
  data,
}: {
  id: number;
  data: ServiceAccountDto;
}) => {
  const res = await fetchApi<ServiceAccount>(`/service-account/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  revalidateTag("services");
  revalidateTag("service-accounts");

  return res;
};

export const deleteServiceAccount = async (id: number) => {
  const res = await fetchApi<void>(`/service-account/${id}`, {
    method: "DELETE",
  });

  revalidateTag("services");
  revalidateTag("service-accounts");

  return res;
};
