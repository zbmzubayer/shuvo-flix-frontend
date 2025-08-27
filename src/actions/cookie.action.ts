"use server";

import { cookies } from "next/headers";

export async function getSidebarState() {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return defaultOpen;
}

export async function getNextAuthToken() {
  const cookieStore = await cookies();
  const token =
    cookieStore.get("next-auth.session-token") ||
    cookieStore.get("__Secure-next-auth.session-token");
  return { token };
}
