/* src/components/ui/dialog.tsx */
/**
 * Composants UI autour de @radix-ui/react-dialog.
 * Je ré-exporte les primitives utiles et j’ajoute un habillage Tailwind
 * (overlay, conteneur centré, bordures, ombres) sans toucher à l’API Radix.
 * Je garde forwardRef pour préserver le focus management et l’accessibilité.
 */
import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { cn } from '~/lib/utils';

// Je laisse l’accès direct aux primitives Radix.
export const Dialog        = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogPortal  = DialogPrimitive.Portal;
export const DialogClose   = DialogPrimitive.Close;

// Overlay plein écran, placé sous le contenu (z-40) avec un fond semi-opaque.
export const DialogOverlay = React.forwardRef(
  ({ className, ...props }: any, ref: React.Ref<any>) => (
    <DialogPrimitive.Overlay
      ref={ref}
      className={cn('fixed inset-0 z-40 bg-black/80', className)}
      {...props}
    />
  )
);
DialogOverlay.displayName = 'DialogOverlay';

// Contenu du dialog : je rends l’overlay + un wrapper centré, puis le Content Radix stylé.
export const DialogContent = React.forwardRef(
  ({ className, children, ...props }: any, ref: React.Ref<any>) => (
    <DialogPortal>
      {/* Je projette l’overlay et le contenu hors du flux via Portal. */}
      <DialogOverlay />
      {/* Wrapper pour centrer le Content et gérer le padding du viewport. */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <DialogPrimitive.Content
          ref={ref}
          className={cn(
            'w-full max-w-lg mx-auto', // dimensionnement
            'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700', // fond + bordure
            'p-6 shadow-lg rounded-lg', // padding + ombre + arrondi
            'focus:outline-none', // je laisse Radix gérer le focus sans outline parasite
            className
          )}
          {...props}
        >
          {children}
        </DialogPrimitive.Content>
      </div>
    </DialogPortal>
  )
);
DialogContent.displayName = 'DialogContent';

// En-tête simple : pile verticale avec léger espacement.
export const DialogHeader = ({ className, ...props }: any) => (
  <div className={cn('flex flex-col space-y-1.5', className)} {...props} />
);
DialogHeader.displayName = 'DialogHeader';

// Titre sémantique du dialog ; je laisse la possibilité d’ajouter des classes externes.
export const DialogTitle = React.forwardRef(
  ({ className, ...props }: any, ref: React.Ref<any>) => (
    <DialogPrimitive.Title
      ref={ref}
      className={cn('text-lg font-semibold', className)}
      {...props}
    />
  )
);
DialogTitle.displayName = 'DialogTitle';

// Description du dialog : texte secondaire, utile pour l’accessibilité (aria-describedby).
export const DialogDescription = React.forwardRef(
  ({ className, ...props }: any, ref: React.Ref<any>) => (
    <DialogPrimitive.Description
      ref={ref}
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  )
);
DialogDescription.displayName = 'DialogDescription';
