import { getNextAuthToken } from "@/actions/cookie.action";
import { ENV_CLIENT } from "@/config/env-client";

/**
 * A reusable, type-safe fetch function for making API requests in Next.js.
 *
 * It enhances the native `fetch` API by providing strong typing, automatic
 * JSON parsing, and robust error handling for non-2xx responses. This function
 * is compatible with Next.js App Router data fetching conventions, including
 * caching and revalidation.
 *
 * @template T The expected data type of the successful API response.
 * @param {string | URL} url The URL to fetch.
 * @param {RequestInit} [options] Optional `fetch` options (e.g., method, headers, body)
 * and Next.js-specific options like `next: { revalidate: 3600 }`.
 * @returns {Promise<T>} A promise that resolves to the fetched data, typed as `T`.
 * @throws {Error} Throws an error if the network request fails or the API
 * returns a non-2xx status code. The error message will include the status
 * and a message from the API response body if available.
 */
export async function fetchApi<T>(
  url: string | URL,
  options?: RequestInit
): Promise<T> {
  try {
    // Don't set Content-Type for FormData requests - let the browser handle it
    const { token } = await getNextAuthToken();
    const defaultHeaders: HeadersInit = {
      Authorization: `Bearer ${token?.value}`,
    };

    // Only set Content-Type to application/json if we're not sending FormData
    if (!(options?.body instanceof FormData)) {
      defaultHeaders["Content-Type"] = "application/json";
    }

    const response = await fetch(
      `${ENV_CLIENT.NEXT_PUBLIC_API_BASE_URL}${url}`,
      {
        // Set default headers, but allow them to be overridden
        headers: {
          ...defaultHeaders,
          ...options?.headers,
        },
        ...options,
      }
    );

    if (!response.ok) {
      // Attempt to parse the error response for a more detailed message
      let errorBody: { message?: string } | null = null;
      try {
        errorBody = await response.json();
      } catch (_parseError) {
        // The error response wasn't JSON or was empty
        errorBody = null;
      }

      const errorMessage = errorBody?.message || response.statusText;
      throw new Error(errorMessage || `HTTP error! status: ${response.status}`);
    }

    // Handle responses that don't have a body (e.g., HTTP 204)
    if (response.status === 204) {
      return null as T;
    }

    const data: T = await response.json();
    return data;
  } catch (error) {
    // Log the error for debugging purposes if needed
    // console.error("API Fetch Error:", error);

    // Re-throw the error to be handled by the calling code
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("An unknown error occurred");
  }
}
