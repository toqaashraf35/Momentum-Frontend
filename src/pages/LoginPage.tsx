// pages/Login.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import Input from "../components/Input";
import Button from "../components/Button";
import { useForm } from "../hooks/useForm";
import authService from "../services/authService";
import { validateLogin } from "../utils/validateLogin";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  type LoginForm = {
    email: string;
    password: string;
  };

  const {
    values,
    errors,
    handleChange,
    handleSubmit,
    isSubmitting,
    setErrors,
  } = useForm<LoginForm>({ email: "", password: "" });

  const onSubmit = async () => {
    // Frontend validation
    const validationErrors = validateLogin(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await authService.login(values.email, values.password);
      navigate("/");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const msg =
          typeof err.response?.data === "string"
            ? err.response.data
            : err.response?.data?.message || "Login failed";
        setErrors({ submit: msg });
      } else {
        setErrors({ submit: "Login failed" });
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-white max-w-md p-10 w-[700px]">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-2xl font-bold text-[var(--main)] mb-2">
            Welcome Back!
          </h1>
          <p className="text-[var(--dim)] text-sm">
            Learn, Connect, and Grow with us.
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
          <Input
            id="email"
            name="email"
            type="email"
            label="Email"
            placeholder="Enter your email"
            value={values.email}
            onChange={handleChange}
            icon={<Mail className="w-5 h-5 text-gray-400" />}
            error={errors.email}
            disabled={isSubmitting}
          />

          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              label="Password"
              placeholder="Enter your password"
              value={values.password}
              onChange={handleChange}
              icon={<Lock className="w-5 h-5 text-gray-400" />}
              error={errors.password}
              disabled={isSubmitting}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 top-5 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isSubmitting}
            >
              {showPassword ? (
                <Eye className="h-5 w-5 text-gray-400" />
              ) : (
                <EyeOff className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>

          {/* Submit button */}
          <Button
            type="submit"
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            Login
          </Button>

          {/* Backend error */}
          {errors.submit && (
            <div className="text-red-500 text-sm text-center mt-2">
              {errors.submit}
            </div>
          )}

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-[var(--border)]"></div>
            <span className="flex-shrink mx-4 text-[var(--dim)] text-sm">
              Or
            </span>
            <div className="flex-grow border-t border-[var(--border)]"></div>
          </div>

          {/* Google Login */}
          <button
            type="button"
            className="w-full py-3 flex items-center justify-center gap-2 bg-white text-gray-700 rounded-xl font-semibold border border-[var(--border)] hover:bg-[var(--bg)] transform hover:-translate-y-0.5 transition-all duration-300 shadow-sm hover:shadow-md"
            disabled={isSubmitting}
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google logo"
              className="w-5 h-5"
            />
            Sign in with Google
          </button>

          {/* Footer */}
          <div className="text-center text-[var(--dim)] text-sm mt-6">
            Don't have an account?{" "}
            <a
              href="/signup"
              className="text-[var(--primary)] font-semibold hover:text-[var(--secondary)] transition-colors duration-200"
            >
              Sign up
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
