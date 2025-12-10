import React from "react";
import { Formik, Form, Field } from "formik";
import { LoginValidation } from "./LoginValidation";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import { toast } from "react-toastify";

const initialValue = {
  email: "",
  password: "",
  remember: false,
};

const Login = () => {
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8F4E1] flex items-center justify-center p-4 relative">
      {/* Home Icon - Top Right */}
      <Link
        to="/home"
        className="absolute top-6 right-6 text-[#543310] hover:text-[#74512D] transition-colors duration-200 z-10"
      >
        <i className="fa-solid fa-house text-2xl"></i>
      </Link>

      {/* Background Image with Low Opacity */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{
          backgroundImage: "url('/src/assets/cover2.jpg')",
        }}
      ></div>

      {/* Form Container */}
      <div className="w-full max-w-sm relative z-10">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-[#AF8F6F]/20 p-8 backdrop-blur-sm">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-[#543310] mb-2">
              Welcome Back
            </h1>
            <p className="text-[#74512D] text-sm">Sign in to your account</p>
          </div>

          <Formik
            initialValues={initialValue}
            validationSchema={LoginValidation}
            validateOnBlur={false}
            validateOnChange={false}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                const success = await loginUser(values.email, values.password);
                if (success) {
                  // Get the latest user data from localStorage
                  const currentUser = JSON.parse(localStorage.getItem("user"));
                  console.log("🔐 Login successful - User:", currentUser);
                  console.log("🔐 User role:", currentUser?.role);

                  // Redirect based on role
                  if (currentUser && currentUser.role === "admin") {
                    console.log("🔐 Redirecting to admin dashboard");
                    navigate("/admin");
                  } else {
                    console.log("🔐 Redirecting to home");
                    navigate("/home");
                  }
                }
              } catch (error) {
                console.error("Login error:", error);
                toast.error("Login failed. Please try again.");
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form className="space-y-5">
                {/* Email */}
                <div>
                  <Field
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    className={`w-full px-4 py-3 bg-white border rounded-lg text-[#543310] placeholder-[#AF8F6F] focus:outline-none focus:ring-2 focus:ring-[#AF8F6F]/30 focus:border-[#74512D] transition-all ${
                      errors.email && touched.email
                        ? "border-red-400"
                        : "border-[#AF8F6F]/50"
                    }`}
                  />
                  {errors.email && touched.email && (
                    <small className="text-red-500 text-xs mt-1 block">
                      {errors.email}
                    </small>
                  )}
                </div>

                {/* Password */}
                <div>
                  <Field
                    type="password"
                    name="password"
                    placeholder="Password"
                    className={`w-full px-4 py-3 bg-white border rounded-lg text-[#543310] placeholder-[#AF8F6F] focus:outline-none focus:ring-2 focus:ring-[#AF8F6F]/30 focus:border-[#74512D] transition-all ${
                      errors.password && touched.password
                        ? "border-red-400"
                        : "border-[#AF8F6F]/50"
                    }`}
                  />
                  {errors.password && touched.password && (
                    <small className="text-red-500 text-xs mt-1 block">
                      {errors.password}
                    </small>
                  )}
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Field
                      type="checkbox"
                      id="remember"
                      name="remember"
                      className="h-4 w-4 text-[#74512D] border-[#AF8F6F] rounded focus:ring-[#AF8F6F]/30"
                    />
                    <label
                      htmlFor="remember"
                      className="ml-2 block text-sm text-[#74512D]"
                    >
                      Remember me
                    </label>
                  </div>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-[#543310] hover:text-[#74512D] transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#543310] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#74512D] transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#543310]/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                      Signing in...
                    </span>
                  ) : (
                    "Sign In"
                  )}
                </button>

                {/* Sign Up Link */}
                <div className="text-center pt-4">
                  <p className="text-[#74512D] text-sm">
                    Don't have an account?{" "}
                    <Link
                      to="/register"
                      className="text-[#543310] font-bold hover:text-[#74512D] transition-colors"
                    >
                      Sign Up
                    </Link>
                  </p>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default Login;
