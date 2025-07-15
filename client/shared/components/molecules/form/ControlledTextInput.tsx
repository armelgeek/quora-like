import React, { ComponentProps } from 'react';



import { FieldValues, useController, UseControllerProps } from 'react-hook-form';



import { FormControl, FormItem, FormLabel } from '@/shared/components/atoms/ui/form';
import { Input } from '@/shared/components/atoms/ui/input';





type ControlledTextInputProps<T extends FieldValues> = UseControllerProps<T> & {
  label?: string;
  placeholder?: string;
} & ComponentProps<typeof Input>

export function ControlledTextInput<T extends FieldValues>({  name,label, placeholder, control, defaultValue, ...props }: ControlledTextInputProps<T>) {
  const { field, fieldState } = useController<T>({
    control,
    name,
    defaultValue,
  });

  return (
      <FormItem className="flex flex-col gap-1">
        {label && <FormLabel>{label}</FormLabel>}
        <FormControl>
          <Input
            {...props}
            onChange={field.onChange}
            value={(field.value ?? '').toString()}
            className={fieldState.error?.message && 'border-destructive'}
            placeholder={placeholder ?? ''}
          />
        </FormControl>
        {fieldState.error?.message && (
          <p className="text-xs my-1 text-red-500">{fieldState.error?.message}</p>
        )}
      </FormItem>
  );
}
