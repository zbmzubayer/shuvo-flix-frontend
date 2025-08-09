"use server";

import { cookies } from "next/headers";

export async function getSidebarState() {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return defaultOpen;
}
