import { DateTimePicker, DateTimePickerProps } from '@/shared/components/atoms/date-picker';
import {
  FieldValues,
  useController,
  UseControllerProps,
} from 'react-hook-form';

type ControlledDateTimePickerProps<T extends FieldValues> = UseControllerProps<T> & {
  disabled?: boolean;
} & Omit<DateTimePickerProps, 'value' | 'onChange' | 'name'>;

export function ControlledDateTimePicker<T extends FieldValues>({
  name,
  control,
  defaultValue,
  rules,
  shouldUnregister,
}: ControlledDateTimePickerProps<T>) {
  const { field, fieldState } = useController<T>({
    control,
    name,
    defaultValue,
    rules,
    shouldUnregister,
  });

  const handleChange = (date: Date | undefined) => {
    const stringValue = date ? date.toISOString() : '';
    field.onChange(stringValue);
  };

  return (
    <>
      <DateTimePicker 
        value={field.value ? new Date(field.value) : undefined}
        onChange={handleChange}
        placeholder={"Sélectionner une date"}
        className="w-[280px]" 
      />

      {fieldState.error && (
        <p className="mt-1 font-bold text-red text-xs">
          {fieldState.error.message || '' }
        </p>
      )}
    </>
  );
}