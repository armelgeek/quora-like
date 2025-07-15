import React from 'react';
import { Input } from '@/shared/components/atoms/ui/input';

const DebouncedInput = React.forwardRef<
  HTMLInputElement,
  {
    value: string | number;
    onChange: (value: string | number) => void;
    debounce?: number;
  } & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>
>((props, ref) => {
  const { value: initialValue, onChange, debounce = 500, ...rest } = props;
  const [value, setValue] = React.useState(initialValue);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // Met à jour la valeur locale si la prop change (contrôle externe)
  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  // Déclenche le onChange debounced uniquement si la valeur locale change (pas lors du setValue externe)
  React.useEffect(() => {
    if (value === initialValue) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      onChange(value);
    }, debounce);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [value, debounce]);

  return (
    <Input
      ref={ref}
      {...rest}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
});
DebouncedInput.displayName = 'DebouncedInput';

export { DebouncedInput };
