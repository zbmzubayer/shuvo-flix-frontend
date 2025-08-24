import { fetchApi } from "@/lib/api";
import type { Order, OrderDetails } from "@/types/order";
import type { OrderDto } from "@/validations/order.dto";

export const ORDER_CACHE_KEY = "orders";

export const createOrder = async (data: OrderDto) => {
  return await fetchApi<Order>("/order", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const getAllOrders = async () => {
  return await fetchApi<OrderDetails[]>("/order", {
    method: "GET",
    cache: "force-cache",
    next: { tags: [ORDER_CACHE_KEY] },
  });
};

export const getOrderById = async (id: string) => {
  return await fetchApi<Order>(`/order/${id}`, {
    method: "GET",
    cache: "no-store",
    next: { tags: [`${ORDER_CACHE_KEY}-${id}`] },
  });
};

export const updateOrder = async ({
  id,
  data,
}: {
  id: number;
  data: OrderDto;
}) => {
  return await fetchApi<Order>(`/order/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
};

export const deleteOrder = async (id: number) => {
  return await fetchApi<boolean>(`/order/${id}`, {
    method: "DELETE",
  });
};
