import { fetchApi } from "@/lib/api";
import type { Service, ServiceWithServiceAccount } from "@/types/service";
import type { ServiceDto } from "@/validations/service.dto";

export const SERVICE_CACHE_KEY = "services";

export const createService = async (data: ServiceDto & { logo: string }) => {
  return await fetchApi<Service>("/service", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const getAllServices = async () => {
  return await fetchApi<ServiceWithServiceAccount[]>("/service", {
    method: "GET",
    cache: "force-cache",
    next: { tags: [SERVICE_CACHE_KEY] },
  });
};

export const getServiceById = async (id: string) => {
  return await fetchApi<ServiceWithServiceAccount>(`/service/${id}`, {
    method: "GET",
  });
};

export const updateService = async ({
  id,
  data,
}: {
  id: number;
  data: ServiceDto & { logo: string };
}) => {
  return await fetchApi<Service>(`/service/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
};

export const deleteService = async (id: number) => {
  return await fetchApi<boolean>(`/service/${id}`, {
    method: "DELETE",
  });
};
