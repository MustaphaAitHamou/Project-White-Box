/* src/components/ui/button.tsx */
// Composant bouton générique.
// Je m’appuie sur class-variance-authority (cva) pour gérer les variantes (intent/size)
// et sur Radix Slot pour le rendu polymorphe via la prop `asChild`.
import React, { forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { cn } from '~/lib/utils';

// Je définis ici la base des classes + les variantes disponibles.
// - intent : style visuel (solid, outline, ghost, destructive, brand)
// - size   : tailles courantes (sm, md, lg, icon)
// Je précise aussi des valeurs par défaut pour éviter de répéter partout.
const variants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ' +
    'disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      intent: {
        solid: 'bg-primary text-primary-foreground hover:bg-primary/90',
        outline: 'border border-border hover:bg-secondary/60',
        ghost: 'hover:bg-secondary/50',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        brand:
          'bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-lg ' +
          'hover:brightness-110 hover:-translate-y-0.5 active:translate-y-0',
      },
      size: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-10 px-4',
        lg: 'h-12 px-6 text-lg',
        icon: 'h-10 w-10 p-0',
      },
    },
    defaultVariants: {
      intent: 'solid',
      size: 'md',
    },
  }
);

// Je rends un <button> par défaut, ou je délègue le rendu à un enfant via `asChild` (Radix Slot).
// J’agrège les classes calculées par cva avec d’éventuelles classes externes via `cn`.
// J’expose aussi la ref avec forwardRef pour les cas d’accès DOM (focus, mesure, etc.).
export const Button = forwardRef(function Button(
  { className, intent, size, asChild = false, ...props },
  ref
) {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp
      ref={ref}
      className={cn(variants({ intent, size, className }))}
      {...props}
    />
  );
});

export default Button;
