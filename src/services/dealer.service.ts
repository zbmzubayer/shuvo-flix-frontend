import { fetchApi } from "@/lib/api";
import type { Dealer } from "@/types/dealer";
import type { DealerDto } from "@/validations/dealer.dto";

export const DEALER_CACHE_KEY = "dealers";

export const createDealer = async (data: DealerDto & { logo: string }) => {
  return await fetchApi<Dealer>("/dealer", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const getAllDealers = async () => {
  return await fetchApi<Dealer[]>("/dealer", {
    method: "GET",
    cache: "force-cache",
    next: { tags: [DEALER_CACHE_KEY] },
  });
};

export const getDealerById = async (id: string) => {
  return await fetchApi<Dealer>(`/dealer/${id}`, {
    method: "GET",
    cache: "no-store",
    next: { tags: [`${DEALER_CACHE_KEY}-${id}`] },
  });
};

export const updateDealer = async ({
  id,
  data,
}: {
  id: number;
  data: DealerDto & { logo: string };
}) => {
  return await fetchApi<Dealer>(`/dealer/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
};

export const deleteDealer = async (id: number) => {
  return await fetchApi<boolean>(`/dealer/${id}`, {
    method: "DELETE",
  });
};
