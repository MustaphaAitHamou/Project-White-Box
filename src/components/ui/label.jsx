// src/components/ui/label.jsx
import { forwardRef } from 'react';

/** Petit helper pour concaténer les classes */
const cx = (...cls) => cls.filter(Boolean).join(' ');

export const Label = forwardRef(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cx(
      'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
      className
    )}
    {...props}
  />
));

Label.displayName = 'Label';

export default Label;
