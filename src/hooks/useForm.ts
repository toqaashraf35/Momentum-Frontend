import { useState, useCallback } from "react";

export type FormErrors<T> = Partial<Record<keyof T, string>> & {
  submit?: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useForm = <T extends Record<string, any>>(initialValues: T) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors<T>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const { name, value, type } = e.target;

      if (type === "file") {
        const files = (e.target as HTMLInputElement).files;
        setValues((prev) => ({
          ...prev,
          [name]: files?.[0] || undefined,
        }));
      } else if (type === "select-multiple") {
        const selectedOptions = Array.from(
          (e.target as HTMLSelectElement).selectedOptions
        );
        const selectedValues = selectedOptions.map((option) => option.value);
        setValues((prev) => ({
          ...prev,
          [name]: selectedValues,
        }));
      } else {
        setValues((prev) => ({
          ...prev,
          [name]: value,
        }));
      }

      // Clear error when user starts typing
      if (name in errors) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name as keyof T];
          return newErrors;
        });
      }
    },
    [errors]
  );

  const handleSelectChange = useCallback(
    (
      name: keyof T,
      value: string | string[] | React.ChangeEvent<HTMLSelectElement>
    ) => {
      let finalValue: string | string[];

      if (typeof value === "object" && "target" in value) {
        if (value.target.multiple) {
          finalValue = Array.from(value.target.selectedOptions).map(
            (option) => option.value
          );
        } else {
          finalValue = value.target.value;
        }
      } else {
        // إذا كان value مباشر
        finalValue = value;
      }

      setValues((prev) => ({
        ...prev,
        [name]: finalValue,
      }));

      // Clear error when value changes
      if (name in errors) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    },
    [errors]
  );

  const setFieldValue = useCallback(
    <K extends keyof T>(name: K, value: T[K]) => {
      setValues((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
    []
  );

  const handleSubmit = useCallback(
    (onSubmit: (values: T) => void | Promise<void>) => {
      setIsSubmitting(true);
      Promise.resolve(onSubmit(values)).finally(() => setIsSubmitting(false));
    },
    [values]
  );

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSelectChange,
    handleSubmit,
    setFieldValue,
    setErrors,
    setValues,
  };
};
