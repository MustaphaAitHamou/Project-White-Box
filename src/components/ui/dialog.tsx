/* src/components/ui/dialog.tsx */
import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { cn } from '~/lib/utils';

export const Dialog        = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogPortal  = DialogPrimitive.Portal;
export const DialogClose   = DialogPrimitive.Close;

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

export const DialogContent = React.forwardRef(
  ({ className, children, ...props }: any, ref: React.Ref<any>) => (
    <DialogPortal>
      <DialogOverlay />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <DialogPrimitive.Content
          ref={ref}
          className={cn(
            'w-full max-w-lg mx-auto',
            'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700',
            'p-6 shadow-lg rounded-lg',
            'focus:outline-none',
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

export const DialogHeader = ({ className, ...props }: any) => (
  <div className={cn('flex flex-col space-y-1.5', className)} {...props} />
);
DialogHeader.displayName = 'DialogHeader';

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
