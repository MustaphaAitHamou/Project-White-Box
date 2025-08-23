import * as React from "react"

import { cn } from "~/lib/utils"

/**
 * Champ de saisie générique.
 * Je garde un <input> contrôlé par l’extérieur et je passe toutes les props possibles.
 * J’utilise forwardRef pour permettre au parent de gérer le focus ou lire la valeur.
 * Je compose les classes avec `cn` pour pouvoir ajouter des styles au cas par cas.
 */
const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        // Je laisse le type configurable (text, email, password, etc.).
        type={type}
        // Je fournis une base de styles accessible + états focus/disabled propres.
        // Je fusionne avec d’éventuelles classes externes via `cn`.
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        // Je propage la ref pour gérer le focus depuis le parent.
        ref={ref}
        // Je propage toutes les autres props (aria-*, name, value, onChange, etc.).
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
