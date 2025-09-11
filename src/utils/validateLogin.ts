export const validateLogin = (values: { email: string; password: string }) => {
  const errors: { email?: string; password?: string } = {};

  // Email required + simple format check
  if (!values.email) {
    errors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(values.email)) {
    errors.email = "Invalid email address";
  }

  // Password required + min length
  if (!values.password) {
    errors.password = "Password is required";
  } else if (values.password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  }

  return errors;
};
