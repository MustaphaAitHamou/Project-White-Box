import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

// Je crée un fin wrapper autour du Toaster de Sonner pour le brancher
// sur le thème courant (next-themes) et centraliser la config de styles.
type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  // Je récupère le thème actif (light/dark/system) et je passe la valeur à Sonner.
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      // Je propage le thème tel qu’attendu par le composant Sonner.
      theme={theme as ToasterProps["theme"]}
      // Je pose une classe de scope pour cibler les toasts via group selectors.
      className="toaster group"
      // Je personnalise les classes des éléments internes du toast.
      // Les tokens (bg-background, text-foreground, etc.) s’alignent sur le design system.
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      // Je laisse la possibilité d’overrider la config via les props.
      {...props}
    />
  )
}

export { Toaster }
