// utils/validateSignup.ts
type SignupValues = {
  name: string;
  username: string;
  email: string;
  country: string;
  password: string;
  confirmPassword: string;
};

type SignupErrors = Partial<Record<keyof SignupValues, string>> & {
  submit?: string;
};

export const validateSignup = (values: SignupValues): SignupErrors => {
  const errors: SignupErrors = {};

  if (!values.name.trim()) errors.name = "Full name is required";
  if (!values.username.trim()) errors.username = "Username is required";

  if (!values.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(values.email)) {
    errors.email = "Email is invalid";
  }

  if (!values.country.trim()) errors.country = "Country is required";

  if (!values.password) {
    errors.password = "Password is required";
  } else if (values.password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = "Confirm your password";
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  return errors;
};
