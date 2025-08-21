"use server";

import { revalidateTag } from "next/cache";

import { fetchApi } from "@/lib/api";
import type { Service, ServiceWithServiceAccount } from "@/types/service";
import type { ServiceDto } from "@/validations/service.dto";

export const createService = async (data: ServiceDto & { logo: string }) => {
  const res = await fetchApi<Service>("/service", {
    method: "POST",
    body: JSON.stringify(data),
  });

  revalidateTag("services");

  return res;
};

export const getAllServices = async () => {
  return await fetchApi<ServiceWithServiceAccount[]>("/service", {
    method: "GET",
    cache: "no-store",
    next: { tags: ["services"] },
  });
};

export const getServiceById = async (id: string) => {
  return await fetchApi<ServiceWithServiceAccount>(`/service/${id}`, {
    method: "GET",
    cache: "no-store",
    next: { tags: [`service-${id}`] },
  });
};

export const updateService = async ({
  id,
  data,
}: {
  id: number;
  data: ServiceDto & { logo: string };
}) => {
  const res = await fetchApi<Service>(`/service/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  revalidateTag("services");

  return res;
};

export const deleteService = async (id: number) => {
  const res = await fetchApi<boolean>(`/service/${id}`, {
    method: "DELETE",
  });

  revalidateTag("services");

  return res;
};
