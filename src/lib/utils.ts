import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Petit utilitaire pour composer des classes CSS.
// Je combine d’abord les classes (y compris conditionnelles) avec clsx,
// puis je résous automatiquement les conflits Tailwind avec twMerge
// (ex. "p-2" vs "p-4", "text-sm" vs "text-lg", etc.).

/**
 * Fusionne automatiquement les classes Tailwind
 * @param  {...any} inputs
 * @returns {string}
 */
export function cn(...inputs) {
  // Je passe le résultat de clsx à twMerge pour obtenir une chaîne finale propre.
  return twMerge(clsx(...inputs));
}
