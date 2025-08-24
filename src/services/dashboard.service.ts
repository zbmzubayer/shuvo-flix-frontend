import { fetchApi } from "@/lib/api";

export const DASHBOARD_CACHE_KEY = "dashboard";

type DashboardData = {
  totalCustomer: number;
  newCustomer: number;
  totalOrder: number;
  activeOrder: number;
  expiredOrder: number;
  upcomingExpiredOrder: number;
};

export const getDashboardData = async () => {
  return await fetchApi<DashboardData>("/dashboard", {
    method: "GET",
    cache: "force-cache",
    next: { tags: [DASHBOARD_CACHE_KEY] },
  });
};
