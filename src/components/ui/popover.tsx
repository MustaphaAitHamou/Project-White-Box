/* src/components/ui/popover.tsx */
// Composants d’enrobage autour de @radix-ui/react-popover.
// Je ré-exporte les primitives utiles (Root, Trigger) et j’ajoute un PopoverContent
// stylé avec Tailwind, sans changer l’API Radix. J’utilise un Portal pour sortir
// le contenu du flux normal et éviter les problèmes de z-index/overflow.

import * as React from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { cn } from '~/lib/utils';

// Je laisse l’alias simple pour un import/usage clair dans l’UI.
const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;

// PopoverContent : je fournis des classes par défaut (taille, bordure, ombre)
// et quelques animations conditionnées par les data-attributes Radix.
// align et sideOffset restent configurables via props.
const PopoverContent = React.forwardRef(
  (
    { className, align = 'center', sideOffset = 4, ...props }: any,
    ref: React.Ref<any>
  ) => (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        ref={ref}
        align={align}
        sideOffset={sideOffset}
        className={cn(
          // Base visuelle du panneau
          'z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none ' +
            // Animations pilotées par l’état Radix (open/closed) et la position (side)
            'data-[state=open]:animate-in data-[state=closed]:animate-out ' +
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 ' +
            'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 ' +
            'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 ' +
            'data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ' +
            // Je garde l’origine de transformation alignée avec celle de Radix
            'origin-[--radix-popover-content-transform-origin]',
          className
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  )
);
PopoverContent.displayName = 'PopoverContent';

export { Popover, PopoverTrigger, PopoverContent };
