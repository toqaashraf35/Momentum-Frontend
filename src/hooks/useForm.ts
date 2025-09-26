// hooks/useForm.ts
import { useState, useCallback } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useForm<T extends Record<string, any>>(initialValues: T) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<
    Partial<Record<keyof T, string>> & { submit?: string }
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      const { name, type, value, files } = e.target as HTMLInputElement;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let newValue: any = value;
      if (type === "file") newValue = files?.[0] ?? null;
      if (type === "number") newValue = value ? Number(value) : "";

      setValues((prev) => ({ ...prev, [name]: newValue }));

      if (errors[name as keyof T]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name as keyof T];
          return newErrors;
        });
      }
    },
    [errors]
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const setFieldValue = useCallback((name: keyof T, value: any) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(async (onSubmit: () => Promise<void>) => {
    setIsSubmitting(true);
    try {
      await onSubmit();
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
  }, [initialValues]);

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    setErrors,
    setFieldValue,
    resetForm,
  };
}
