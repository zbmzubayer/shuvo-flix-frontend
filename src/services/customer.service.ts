"use server";

import { revalidateTag } from "next/cache";

import { fetchApi } from "@/lib/api";
import type { Customer, CustomerDetails } from "@/types/customer";
import type { CustomerDto } from "@/validations/customer.dto";

export const createCustomer = async (data: CustomerDto) => {
  const res = await fetchApi<Customer>("/customer", {
    method: "POST",
    body: JSON.stringify(data),
  });

  revalidateTag("customers");

  return res;
};

export const getAllCustomers = async () => {
  return await fetchApi<CustomerDetails[]>("/customer", {
    method: "GET",
    cache: "force-cache",
    next: { tags: ["customers"] },
  });
};

export const getCustomerById = async (id: string) => {
  return await fetchApi<Customer>(`/customer/${id}`, {
    method: "GET",
    cache: "no-store",
    next: { tags: [`customer-${id}`] },
  });
};

export const updateCustomer = async ({
  id,
  data,
}: {
  id: number;
  data: CustomerDto;
}) => {
  const res = await fetchApi<Customer>(`/customer/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  revalidateTag("customers");

  return res;
};

export const deleteCustomer = async (id: number) => {
  const res = await fetchApi<boolean>(`/customer/${id}`, {
    method: "DELETE",
  });

  revalidateTag("customers");

  return res;
};
