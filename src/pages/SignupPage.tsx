// pages/SignupPage.tsx
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "../hooks/useForm";
import Input from "../components/Input";
import Button from "../components/Button";
import authService from "../services/authService";
import { validateSignup } from "../utils/validateSignup";
import axios from "axios";
import { useFetch } from "../hooks/useFetch";

export default function SignupPage() {
  const navigate = useNavigate();

  type SignupForm = {
    name: string;
    username: string;
    email: string;
    password: string;
    country: string;
    confirmPassword: string;
  };

  const {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    setErrors,
  } = useForm<SignupForm>({
    name: "",
    username: "",
    email: "",
    country: "",
    password: "",
    confirmPassword: "",
  });

  type Country = {
    name: { common: string };
  };

  const {
    data: countries,
    isLoading: loadingCountries,
    error,
  } = useFetch<Country[]>("https://restcountries.com/v3.1/all?fields=name");
const sortedCountries = countries
  ?.slice()
  .sort((a, b) => a.name.common.localeCompare(b.name.common));

  const onSubmit = async () => {
    // Validate
    const validationErrors = validateSignup(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await authService.signup(values);
      navigate("/login");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const msg =
          typeof err.response?.data === "string"
            ? err.response.data
            : err.response?.data?.message || "Signup failed";
        setErrors({ submit: msg });
      } else {
        setErrors({ submit: "Signup failed" });
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-white rounded-2xl w-full max-w-3xl p-10">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Create Your Account
          </h1>
          <p className="text-gray-500 text-sm">
            Join our community to learn, connect, and grow with us.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(onSubmit);
          }}
          className="space-y-6"
        >
          {/* Name + Username */}
          <div className="flex flex-col md:flex-row gap-6 justify-between">
            <Input
              id="name"
              name="name"
              label="Full Name"
              placeholder="Enter your full name"
              value={values.name}
              onChange={handleChange}
              error={errors.name}
              disabled={isSubmitting}
            />
            <Input
              id="username"
              name="username"
              label="Username"
              placeholder="Choose a username"
              value={values.username}
              onChange={handleChange}
              error={errors.username}
              disabled={isSubmitting}
            />
          </div>

          {/* Email + Country */}
          <div className="flex flex-col md:flex-row gap-6 justify-between">
            <Input
              id="email"
              name="email"
              type="email"
              label="Email"
              placeholder="Enter your email"
              value={values.email}
              onChange={handleChange}
              error={errors.email}
              disabled={isSubmitting}
            />
            <div className="flex-1 flex flex-col gap-2">
              <label
                htmlFor="country"
                className="text-gray-600 font-semibold text-sm"
              >
                Country
              </label>
              <select
                id="country"
                name="country"
                value={values.country}
                onChange={handleChange}
                className={`px-4 py-3 border rounded-xl bg-gray-50 focus:outline-none ${
                  errors.country
                    ? "border-red-500 ring-2 ring-red-200"
                    : "border-gray-300"
                }`}
                disabled={isSubmitting || loadingCountries}
              >
                <option value="">Select your country</option>
                {sortedCountries?.map((c) => (
                  <option key={c.name.common} value={c.name.common}>
                    {c.name.common}
                  </option>
                ))}
              </select>
              {errors.country && (
                <span className="text-red-500 text-xs">{errors.country}</span>
              )}
              {error && <span className="text-red-500 text-xs">{error}</span>}
            </div>
          </div>

          {/* Password + Confirm */}
          <div className="flex flex-col md:flex-row gap-6 justify-between">
            <Input
              id="password"
              name="password"
              label="Password"
              type="password"
              placeholder="Create a password"
              value={values.password}
              onChange={handleChange}
              error={errors.password}
              disabled={isSubmitting}
            />
            <Input
              id="confirmPassword"
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              placeholder="Confirm your password"
              value={values.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              disabled={isSubmitting}
            />
          </div>

          {/* Submit button */}
          <Button
            type="submit"
            children="Sign up"
            isLoading={isSubmitting}
            disabled={isSubmitting}
          />

          {/* Backend error */}
          {errors.submit && (
            <p className="text-red-500 text-sm text-center">{errors.submit}</p>
          )}

          {/* Signup as mentor */}
          <Button
            type="button"
            children="Sign up as Mentor"
            disabled={isSubmitting}
            onClick={() => navigate("/signup-mentor")}
          />

          {/* Footer */}
          <div className="text-center text-gray-500 text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-500 font-semibold hover:text-blue-700"
            >
              Log in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
