"use server";

import { revalidateTag } from "next/cache";

import { fetchApi } from "@/lib/api";
import type { Provider } from "@/types/provider";
import type { ProviderDto } from "@/validations/provider.dto";

export const createProvider = async (data: ProviderDto & { logo: string }) => {
  const res = await fetchApi<Provider>("/provider", {
    method: "POST",
    body: JSON.stringify(data),
  });

  revalidateTag("providers");

  return res;
};

export const getAllProviders = async () => {
  return await fetchApi<Provider[]>("/provider", {
    method: "GET",
    cache: "no-store",
    next: { tags: ["providers"] },
  });
};

export const getProviderById = async (id: string) => {
  return await fetchApi<Provider>(`/provider/${id}`, {
    method: "GET",
    cache: "no-store",
    next: { tags: [`provider-${id}`] },
  });
};

export const updateProvider = async ({
  id,
  data,
}: {
  id: number;
  data: ProviderDto & { logo: string };
}) => {
  const res = await fetchApi<Provider>(`/provider/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  revalidateTag("providers");

  return res;
};

export const deleteProvider = async (id: number) => {
  const res = await fetchApi<boolean>(`/provider/${id}`, {
    method: "DELETE",
  });

  revalidateTag("providers");

  return res;
};
