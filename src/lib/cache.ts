import { browser } from "$app/environment";
import { error } from "@sveltejs/kit";

export const cache = new Map();

let _client_caching;
if (
  import.meta.env.VITE_PUBLIC_CACHE_CLIENT &&
  import.meta.env.VITE_PUBLIC_CACHE_CLIENT == "0"
) {
  _client_caching = false;
} else {
  _client_caching = true;
}
/**
 * Vary simple client cache mechanism to avoid unnecessesary xhr calls
 * @param key 
 * @param fetchCallback 
 * @returns 
 */
export const cacheFetch = async <T>(
  key: string,
  fetchCallback: () => ReturnType<typeof fetch>
) => {
  if (_client_caching && browser && cache.has(key)) {
    return cache.get(key) as T;
  }
  const response = await fetchCallback();

  if (!response.ok) {
    const message = await response.json();
    throw error(response.status, message);
  }
  const result = await response.json();
  if (_client_caching ){
    cache.set(key, result);
  }
  return result as T;
};

export const hasCache = () => {
  return _client_caching;
}
export const sha256 = async (message) => {
  // encode as UTF-8
  const msgBuffer = await new TextEncoder().encode(message);
  // hash the message
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  // convert bytes to hex string
  return [...new Uint8Array(hashBuffer)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
};
