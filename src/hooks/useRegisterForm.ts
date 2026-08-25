import { useState } from "react";
import { useForm } from "react-hook-form";

import { ApiError, registerTrainee } from "@/api/auth";

export type RegisterFormValues = {
  name: string;
  phone: string;
  email: string;
  gender: string;
  designation: string;
  employee_id: string;
  supervisorName: string;
  state: string;
  district: string;
};

const defaultValues: RegisterFormValues = {
  name: "",
  phone: "",
  email: "",
  gender: "",
  designation: "",
  employee_id: "",
  supervisorName: "",
  state: "",
  district: "",
};

type UseRegisterFormOptions = {
  onSuccess?: () => void;
};

export function useRegisterForm({ onSuccess }: UseRegisterFormOptions = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<RegisterFormValues>({ defaultValues });

  const onSubmit = handleSubmit(async (values) => {
    setLoading(true);
    setError(null);
    try {
      await registerTrainee({
        name: values.name.trim(),
        phone: values.phone.trim(),
        email: values.email.trim(),
        gender: values.gender || undefined,
        designation: values.designation || undefined,
        employee_id: values.employee_id || undefined,
        supervisorName: values.supervisorName || undefined,
        state: values.state || undefined,
        district: values.district || undefined,
      });

      reset(defaultValues);
      onSuccess?.();
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  });

  return { control, errors, setValue, onSubmit, loading, error };
}
