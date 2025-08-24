"use server";

import { revalidateTag } from "next/cache";

/**
 * Invalidates the cache for a single key
 * @param key The cache key to invalidate
 */
export const invalidateCache = async (key: string) => {
  revalidateTag(key);
};

/**
 * Invalidates the cache for multiple keys
 * @param keys The cache keys to invalidate
 */
export const invalidateCaches = async (keys: string[]) => {
  keys.forEach((key) => {
    revalidateTag(key);
  });
};
