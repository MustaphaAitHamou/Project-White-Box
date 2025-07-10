/* src/components/ui/dialog.tsx */
import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { cn } from "~/lib/utils"

/* Racine, Trigger, Portal, Close restent inchangés */
export const Dialog          = DialogPrimitive.Root
export const DialogTrigger   = DialogPrimitive.Trigger
export const DialogPortal    = DialogPrimitive.Portal
export const DialogClose     = DialogPrimitive.Close

/* --- Overlay sombre --- */
export const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn("fixed inset-0 z-40 bg-black/80", className)}
    {...props}
  />
))
DialogOverlay.displayName = "DialogOverlay"

/* --- Contenu : centré en flex, plus de translate() --- */
export const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    {/* Conteneur plein écran, flex pour centrer */}
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <DialogPrimitive.Content
        ref={ref}
        /* Boîte réelle */
        className={cn(
          "w-full max-w-lg mx-auto",
          "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700",
          "p-6 shadow-lg rounded-lg",
          "focus:outline-none",
          className
        )}
        {...props}
      >
        {children}
      </DialogPrimitive.Content>
    </div>
  </DialogPortal>
))
DialogContent.displayName = "DialogContent"

/* --- Header, Title, Description --- */
export const DialogHeader: React.FC<
  React.HTMLAttributes<HTMLDivElement>
> = ({ className, ...props }) => (
  <div className={cn("flex flex-col space-y-1.5", className)} {...props} />
)
DialogHeader.displayName = "DialogHeader"

export const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold", className)}
    {...props}
  />
))
DialogTitle.displayName = "DialogTitle"

export const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
DialogDescription.displayName = "DialogDescription"
