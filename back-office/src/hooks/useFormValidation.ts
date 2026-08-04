import { useState, useCallback } from 'react';

export interface ValidationRule<T> {
  validate: (value: T, formData: Record<string, any>) => string | undefined;
}

export interface FieldConfig<T> {
  rules?: ValidationRule<T>[];
  required?: boolean;
  minLength?: { value: number; message: string };
  maxLength?: { value: number; message: string };
  pattern?: { regex: RegExp; message: string };
  custom?: (value: T, formData: Record<string, any>) => string | undefined;
}

export type FieldValidators<T> = {
  [K in keyof T]?: FieldConfig<T[K]>;
};

export interface UseFormValidationOptions<T> {
  defaultValues: T;
  validators: FieldValidators<T>;
  stepFields?: Record<number, (keyof T)[]>;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}

export interface UseFormValidationReturn<T> {
  formData: T;
  errors: Record<string, string | undefined>;
  touched: Record<string, boolean>;
  activeStep: number;
  setActiveStep: (step: number | ((prev: number) => number)) => void;
  handleChange: (field: keyof T, value: any) => void;
  handleBlur: (field: keyof T) => void;
  validateField: (field: keyof T) => string | undefined;
  validateStep: (step: number) => boolean;
  validateAllSteps: () => boolean;
  setFormData: (data: T | ((prev: T) => T)) => void;
  resetForm: () => void;
}

export function useFormValidation<T extends Record<string, any>>(
  options: UseFormValidationOptions<T>
): UseFormValidationReturn<T> {
  const {
    defaultValues,
    validators,
    stepFields = {},
    validateOnChange = true,
    validateOnBlur = true,
  } = options;

  const [formData, setFormDataState] = useState<T>(defaultValues);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [activeStep, setActiveStep] = useState(0);

  const validateField = useCallback(
    (field: keyof T): string | undefined => {
      const config = validators[field];
      if (!config) return undefined;

      const value = formData[field];
      const fieldName = String(field);

      // Required check
      if (config.required) {
        if (value === undefined || value === null || value === '') {
          return `Le champ ${fieldName} est requis`;
        }
        if (typeof value === 'string' && !value.trim()) {
          return `Le champ ${fieldName} est requis`;
        }
      }

      // Skip other validations if empty and not required
      if (!config.required && (value === undefined || value === null || value === '')) {
        return undefined;
      }

      // Min length check
      if (config.minLength && typeof value === 'string') {
        if (value.length < config.minLength.value) {
          return config.minLength.message;
        }
      }

      // Max length check
      if (config.maxLength && typeof value === 'string') {
        if (value.length > config.maxLength.value) {
          return config.maxLength.message;
        }
      }

      // Pattern check
      if (config.pattern && typeof value === 'string') {
        if (!config.pattern.regex.test(value)) {
          return config.pattern.message;
        }
      }

      // Custom validation
      if (config.custom) {
        return config.custom(value, formData);
      }

      // Rules validation
      if (config.rules) {
        for (const rule of config.rules) {
          const error = rule.validate(value, formData);
          if (error) return error;
        }
      }

      return undefined;
    },
    [formData, validators]
  );

  const validateStep = useCallback(
    (step: number): boolean => {
      const fields = stepFields[step] || [];
      const stepErrors: Record<string, string | undefined> = {};
      const touchedFields: Record<string, boolean> = {};
      let hasError = false;

      fields.forEach((field) => {
        const error = validateField(field);
        if (error) {
          stepErrors[String(field)] = error;
          hasError = true;
        }
        touchedFields[String(field)] = true;
      });

      setTouched((prev) => ({ ...prev, ...touchedFields }));
      setErrors((prev: Record<string, string | undefined>) => {
        const updated = { ...prev };
        fields.forEach((f) => {
          const fieldStr = String(f);
          if (stepErrors[fieldStr]) {
            updated[fieldStr] = stepErrors[fieldStr];
          } else {
            delete updated[fieldStr];
          }
        });
        return updated;
      });

      return !hasError;
    },
    [validateField, stepFields]
  );

  const validateAllSteps = useCallback((): boolean => {
    const allErrors: Record<string, string | undefined> = {};
    const allTouched: Record<string, boolean> = {};

    // Validate all fields
    Object.keys(validators).forEach((field) => {
      const key = field as keyof T;
      const error = validateField(key);
      if (error) {
        allErrors[field] = error;
      }
      allTouched[field] = true;
    });

    setTouched(allTouched);
    setErrors(allErrors);

    if (Object.keys(allErrors).length > 0) {
      // Find first step with errors
      const steps = Object.keys(stepFields)
        .map(Number)
        .sort((a, b) => a - b);
      for (const step of steps) {
        const fields = stepFields[step] || [];
        if (fields.some((f) => allErrors[String(f)])) {
          setActiveStep(step);
          return false;
        }
      }
      return false;
    }

    return true;
  }, [validateField, validators, stepFields]);

  const handleChange = useCallback(
    (field: keyof T, value: any) => {
      const newData = { ...formData, [field]: value };
      setFormDataState(newData);

      if (validateOnChange && touched[String(field)]) {
        const error = validateField(field);
        setErrors((prev: Record<string, string | undefined>) => ({
          ...prev,
          [field]: error,
        }));
      }
    },
    [formData, touched, validateField, validateOnChange]
  );

  const handleBlur = useCallback(
    (field: keyof T) => {
      const fieldName = String(field);
      setTouched((prev) => ({ ...prev, [fieldName]: true }));

      if (validateOnBlur) {
        const error = validateField(field);
        setErrors((prev: Record<string, string | undefined>) => ({
          ...prev,
          [field]: error,
        }));
      }
    },
    [validateField, validateOnBlur]
  );

  const setFormData = useCallback((data: T | ((prev: T) => T)) => {
    if (typeof data === 'function') {
      setFormDataState(data);
    } else {
      setFormDataState(data);
    }
  }, []);

  const resetForm = useCallback(() => {
    setFormDataState(defaultValues);
    setErrors({});
    setTouched({});
    setActiveStep(0);
  }, [defaultValues]);

  return {
    formData,
    errors,
    touched,
    activeStep,
    setActiveStep,
    handleChange,
    handleBlur,
    validateField,
    validateStep,
    validateAllSteps,
    setFormData,
    resetForm,
  };
}

export default useFormValidation;
