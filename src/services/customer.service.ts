import { fetchApi } from "@/lib/api";
import type { Customer, CustomerDetails } from "@/types/customer";
import type { CustomerDto } from "@/validations/customer.dto";

export const CUSTOMER_CACHE_KEY = "customers";

export const createCustomer = async (data: CustomerDto) => {
  return await fetchApi<Customer>("/customer", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const getAllCustomers = async () => {
  return await fetchApi<CustomerDetails[]>("/customer", {
    method: "GET",
    cache: "force-cache",
    next: { tags: [CUSTOMER_CACHE_KEY] },
  });
};

export const getCustomerById = async (id: string) => {
  return await fetchApi<Customer>(`/customer/${id}`, {
    method: "GET",
    cache: "no-store",
    next: { tags: [`${CUSTOMER_CACHE_KEY}-${id}`] },
  });
};

export const updateCustomer = async ({
  id,
  data,
}: {
  id: number;
  data: CustomerDto;
}) => {
  return await fetchApi<Customer>(`/customer/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
};

export const deleteCustomer = async (id: number) => {
  return await fetchApi<boolean>(`/customer/${id}`, {
    method: "DELETE",
  });
};
