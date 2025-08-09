"use server";

import { revalidateTag } from "next/cache";

import { fetchApi } from "@/lib/api";
import type { Dealer } from "@/types/dealer";
import type { DealerDto } from "@/validations/dealer.dto";

export const createDealer = async (data: DealerDto & { logo: string }) => {
  const res = await fetchApi<Dealer>("/dealer", {
    method: "POST",
    body: JSON.stringify(data),
  });

  revalidateTag("dealers");

  return res;
};

export const getAllDealers = async () => {
  return await fetchApi<Dealer[]>("/dealer", {
    method: "GET",
    cache: "no-store",
    next: { tags: ["dealers"] },
  });
};

export const getDealerById = async (id: string) => {
  return await fetchApi<Dealer>(`/dealer/${id}`, {
    method: "GET",
    cache: "no-store",
    next: { tags: [`dealer-${id}`] },
  });
};

export const updateDealer = async (
  id: number,
  data: DealerDto & { logo: string }
) => {
  return await fetchApi<Dealer>(`/dealer/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const deleteDealer = async (id: number) => {
  const res = await fetchApi<boolean>(`/dealer/${id}`, {
    method: "DELETE",
  });

  revalidateTag("dealers");

  return res;
};
