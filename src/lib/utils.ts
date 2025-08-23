import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Fusionne automatiquement les classes Tailwind
 * @param  {...any} inputs
 * @returns {string}
 */
export function cn(...inputs) {
  return twMerge(clsx(...inputs));
}
