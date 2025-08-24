import { fetchApi } from "@/lib/api";
import type { Provider } from "@/types/provider";
import type { ProviderDto } from "@/validations/provider.dto";

export const PROVIDER_CACHE_KEY = "providers";

export const createProvider = async (data: ProviderDto & { logo: string }) => {
  return await fetchApi<Provider>("/provider", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const getAllProviders = async () => {
  return await fetchApi<Provider[]>("/provider", {
    method: "GET",
    cache: "force-cache",
    next: { tags: [PROVIDER_CACHE_KEY] },
  });
};

export const getProviderById = async (id: string) => {
  return await fetchApi<Provider>(`/provider/${id}`, {
    method: "GET",
    cache: "no-store",
    next: { tags: [`${PROVIDER_CACHE_KEY}-${id}`] },
  });
};

export const updateProvider = async ({
  id,
  data,
}: {
  id: number;
  data: ProviderDto & { logo: string };
}) => {
  return await fetchApi<Provider>(`/provider/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
};

export const deleteProvider = async (id: number) => {
  return await fetchApi<boolean>(`/provider/${id}`, {
    method: "DELETE",
  });
};
