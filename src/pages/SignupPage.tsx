import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "../hooks/useForm";
import Input from "../components/Input";
import Button from "../components/Button";
import Select from "../components/Select";
import authService from "../services/authService";
import { validateSignup } from "../utils/validateSignup";
import { useOptions } from "../hooks/useOptions";
import OutsideHeader from "../layouts/OutsideHeader";
import Logo from "../assets/Logo.png";
import Alert from "../components/Alert";

export default function SignupPage() {
  const navigate = useNavigate();
  const { countries, tags, jobTitles, loading } = useOptions();
  const [isMentor, setIsMentor] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  type SignupForm = {
    name: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    country: string;
    role: "LEARNER" | "MENTOR";
    tags: string[];
    jobTitle: string;
    hourRate?: number;
    cvFile?: File;
  };

  const {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    setFieldValue,
    setErrors,
  } = useForm<SignupForm>({
    name: "",
    username: "",
    email: "",
    country: "",
    password: "",
    confirmPassword: "",
    role: "LEARNER",
    tags: [],
    jobTitle: "",
    hourRate: undefined,
    cvFile: undefined,
  });

  const onSubmit = async () => {
    const validationErrors = validateSignup(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const registerData: any = {
        name: values.name,
        username: values.username,
        email: values.email,
        password: values.password,
        country: values.country,
        role: values.role,
      };

      if (values.role === "MENTOR") {
        registerData.tags = values.tags.join(",");
        registerData.jobTitle = values.jobTitle;
        registerData.hourRate = values.hourRate;
        registerData.cvFile = values.cvFile;
      }

      await authService.signup(registerData);

      setShowAlert(true);
    } catch (err: unknown) {
      if (err instanceof Error) setErrors({ submit: err.message });
      else setErrors({ submit: "Signup failed" });
    }
  };

  return (
    <>
      <OutsideHeader logo={Logo} />

      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-white rounded-2xl w-full max-w-3xl p-10">
          <div className="text-center mb-10">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Create Your Account
            </h1>
            <p className="text-gray-500 text-sm">
              Join our community to learn, connect, and grow with us.
            </p>
          </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(onSubmit);
              }}
              className="flex flex-col items-center space-y-6"
              noValidate
            >
              {" "}
              {/* Name + Username Row */}{" "}
              <div className="flex flex-col md:flex-row gap-6 justify-between w-full">
                {" "}
                <Input
                  id="name"
                  name="name"
                  label="Full Name"
                  placeholder="Enter your full name"
                  value={values.name}
                  onChange={handleChange}
                  error={errors.name}
                  disabled={isSubmitting || loading}
                  size="lg"
                />{" "}
                <Input
                  id="username"
                  name="username"
                  label="Username"
                  placeholder="Choose a username"
                  value={values.username}
                  onChange={handleChange}
                  error={errors.username}
                  disabled={isSubmitting || loading}
                  size="lg"
                />{" "}
              </div>{" "}
              {/* Email + Country Row */}{" "}
              <div className="flex flex-col md:flex-row gap-6 justify-between w-full">
                {" "}
                <Input
                  id="email"
                  name="email"
                  type="email"
                  label="Email"
                  placeholder="Enter your email"
                  value={values.email}
                  onChange={handleChange}
                  error={errors.email}
                  disabled={isSubmitting || loading}
                  size="lg"
                />{" "}
                <Select
                  id="Country"
                  label="Country"
                  name="country"
                  value={values.country}
                  onChange={(e) => setFieldValue("country", e.target.value)}
                  options={countries}
                  error={errors.country}
                  disabled={isSubmitting || loading}
                />{" "}
              </div>{" "}
              {/* Password + Confirm Password Row */}{" "}
              <div className="flex flex-col md:flex-row gap-6 justify-between w-full">
                {" "}
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
                  size="lg"
                />{" "}
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
                  size="lg"
                />{" "}
              </div>{" "}
              {/* Mentor-Specific Fields */}{" "}
              {isMentor && (
                <>
                  {" "}
                  <div className="flex flex-col md:flex-row gap-6 justify-between w-full">
                    {" "}
                    <Select
                      id="JobTitles"
                      label="Job Title"
                      name="jobTitle"
                      value={values.jobTitle}
                      onChange={(e) =>
                        setFieldValue("jobTitle", e.target.value)
                      }
                      options={jobTitles}
                      error={errors.jobTitle}
                      disabled={isSubmitting || loading}
                    />{" "}
                    <Select
                      id="Tags"
                      label="Tags"
                      name="tags"
                      value={values.tags}
                      onChange={(e) => setFieldValue("tags", e.target.value)}
                      options={tags}
                      multiple
                      error={errors.tags}
                      disabled={isSubmitting || loading}
                    />{" "}
                  </div>{" "}
                  <div className="flex flex-col md:flex-row gap-6 justify-between w-full">
                    {" "}
                    <Input
                      id="hourRate"
                      name="hourRate"
                      type="number"
                      label="Hourly Rate"
                      placeholder="Enter your hourly rate"
                      value={values.hourRate ?? ""}
                      onChange={handleChange}
                      error={errors.hourRate}
                      disabled={isSubmitting}
                      size="lg"
                    />{" "}
                    <Input
                      id="cvFile"
                      name="cvFile"
                      type="file"
                      label="Upload CV"
                      onChange={(e) =>
                        setFieldValue("cvFile", e.target.files?.[0] || null)
                      }
                      error={errors.cvFile}
                      size="lg"
                    />{" "}
                  </div>{" "}
                </>
              )}{" "}
              {/* Submit Button */}{" "}
              <Button
                type="submit"
                isLoading={isSubmitting}
                disabled={isSubmitting || loading}
                color="primary"
                size="xl"
              >
                {" "}
                Sign up{" "}
              </Button>{" "}
              {/* Role Toggle Button */}{" "}
              <Button
                type="button"
                children={isMentor ? "Sign up as Learner" : "Sign up as Mentor"}
                disabled={isSubmitting}
                onClick={() => {
                  setIsMentor((prev) => !prev);
                  setFieldValue("role", isMentor ? "LEARNER" : "MENTOR");
                }}
                color="primary"
                size="xl"
              />{" "}
              {/* Error Display */}{" "}
              {errors.submit && (
                <p className="text-red-500 text-sm text-center mt-4">
                  {" "}
                  {errors.submit}{" "}
                </p>
              )}{" "}
              <div className="text-center text-[var(--dim)] text-sm mt-6">
                {" "}
                Already have an account?{" "}
                <a
                  href="/login"
                  className="text-[var(--primary)] font-semibold hover:text-[var(--secondary)] transition-colors duration-200"
                >
                  {" "}
                  Login{" "}
                </a>{" "}
              </div>{" "}
          </form>
        </div>
      </div>

      {/* ✅ Success Alert */}
      {showAlert && (
        <Alert
          title="Signup Successful 🎉"
          description="Your account has been created successfully!"
          confirmText="Go to Login"
          cancelText="Close"
          onConfirm={() => navigate("/login")}
          onCancel={() => setShowAlert(false)}
        />
      )}
    </>
  );
}
