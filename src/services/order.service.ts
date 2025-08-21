"use server";

import { revalidateTag } from "next/cache";

import { fetchApi } from "@/lib/api";
import type { Order, OrderDetails } from "@/types/order";
import type { OrderDto } from "@/validations/order.dto";

export const createOrder = async (data: OrderDto) => {
  const res = await fetchApi<Order>("/order", {
    method: "POST",
    body: JSON.stringify(data),
  });

  revalidateTag("orders");
  revalidateTag("services");

  return res;
};

// export const createOrder = async (data: OrderDto) => {
//   try {
//     const res = await axiosInstance.post<Order>("/order", data);

//     revalidateTag("orders");
//     revalidateTag("services");

//     return res;
//   } catch (error) {
//     console.log(JSON.stringify(error));
//     throw error;
//   }
// };

export const getAllOrders = async () => {
  return await fetchApi<OrderDetails[]>("/order", {
    method: "GET",
    cache: "force-cache",
    next: { tags: ["orders"] },
  });
};

export const getOrderById = async (id: string) => {
  return await fetchApi<Order>(`/order/${id}`, {
    method: "GET",
    cache: "no-store",
    next: { tags: [`order-${id}`] },
  });
};

export const updateOrder = async ({
  id,
  data,
}: {
  id: number;
  data: OrderDto;
}) => {
  const res = await fetchApi<Order>(`/order/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  revalidateTag("orders");

  return res;
};

export const deleteOrder = async (id: number) => {
  const res = await fetchApi<boolean>(`/order/${id}`, {
    method: "DELETE",
  });

  revalidateTag("orders");

  return res;
};
