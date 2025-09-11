import { useState } from "react";

export function useForm<T extends Record<string, string>>(initialValues: T) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<
    Partial<Record<keyof T, string>> & { submit?: string }
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name as keyof T]: "" }));
  };

  const handleSubmit = async (onSubmit: () => Promise<void> | void) => {
    setIsSubmitting(true);
    setErrors({});
    try {
      await onSubmit();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    values,
    errors,
    setValues,
    setErrors,
    isSubmitting,
    handleChange,
    handleSubmit,
  };
}
