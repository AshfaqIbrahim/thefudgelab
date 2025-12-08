import React from "react";
import { Formik, Form, Field } from "formik";
import { RegisterValidation } from "./RegisterValidation";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import { Home } from "lucide-react"; // Added icon for better mobile experience

const initialValue = {
  fname: "",
  lname: "",
  email: "",
  password: "",
  cpassword: "",
};

const Register = () => {
  const { registerUser } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8F4E1] flex items-center justify-center p-4 md:p-6 relative">
      {/* Home Icon - Top Right */}
      <Link
        to="/home"
        className="absolute top-4 md:top-6 right-4 md:right-6 text-[#543310] hover:text-[#74512D] transition-colors duration-200 z-10 p-2"
      >
        <Home className="w-5 h-5 md:w-6 md:h-6" />
      </Link>

      <div className="w-full max-w-4xl flex flex-col lg:flex-row items-center gap-6 md:gap-8">
        {/* Image Section - Top on mobile, Left on desktop */}
        <div className="w-full lg:flex-1 rounded-2xl lg:rounded-3xl overflow-hidden order-1 lg:order-1">
          <img
            src="images/cover.jpg"
            alt="Register"
            className="w-full h-48 md:h-64 lg:h-96 object-cover rounded-2xl lg:rounded-3xl shadow-lg lg:shadow-2xl"
          />
        </div>

        {/* Form Section - Bottom on mobile, Right on desktop */}
        <div className="w-full lg:flex-1 max-w-md lg:max-w-xs order-2 lg:order-2">
          {/* Card with login color theme */}
          <div className="bg-white rounded-2xl lg:rounded-3xl border border-[#AF8F6F]/20 shadow-lg lg:shadow-2xl overflow-hidden">
            <div className="p-5 md:p-6">
              {/* Header */}
              <div className="text-center mb-4 md:mb-6">
                <h1 className="text-xl md:text-2xl font-light text-[#543310] tracking-tight">
                  CREATE ACCOUNT
                </h1>
                <div className="w-10 md:w-12 h-0.5 bg-linear-to-r from-transparent via-[#AF8F6F] to-transparent mx-auto mt-2 md:mt-3"></div>
              </div>

              <Formik
                initialValues={initialValue}
                validationSchema={RegisterValidation}
                validateOnBlur={false}
                validateOnChange={false}
                onSubmit={async (values, { setSubmitting }) => {
                  try {
                    await registerUser(values);
                    navigate("/login");
                  } catch (error) {
                    console.error("Error Registering User:", error);
                  } finally {
                    setSubmitting(false);
                  }
                }}
              >
                {({ errors, touched, isSubmitting }) => (
                  <Form className="space-y-3 md:space-y-4">
                    {/* Name Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <Field
                          type="text"
                          name="fname"
                          placeholder="First Name"
                          className={`w-full px-3 py-2.5 md:py-2 bg-white border rounded-lg md:rounded-xl text-[#543310] placeholder-[#AF8F6F] focus:outline-none focus:ring-2 focus:ring-[#AF8F6F]/30 focus:border-[#74512D] transition-all text-sm md:text-base ${
                            errors.fname && touched.fname
                              ? "border-red-400"
                              : "border-[#AF8F6F]/50"
                          }`}
                        />
                        {errors.fname && touched.fname && (
                          <small className="text-red-500 text-xs mt-1 block">
                            {errors.fname}
                          </small>
                        )}
                      </div>
                      <div>
                        <Field
                          type="text"
                          name="lname"
                          placeholder="Last Name"
                          className={`w-full px-3 py-2.5 md:py-2 bg-white border rounded-lg md:rounded-xl text-[#543310] placeholder-[#AF8F6F] focus:outline-none focus:ring-2 focus:ring-[#AF8F6F]/30 focus:border-[#74512D] transition-all text-sm md:text-base ${
                            errors.lname && touched.lname
                              ? "border-red-400"
                              : "border-[#AF8F6F]/50"
                          }`}
                        />
                        {errors.lname && touched.lname && (
                          <small className="text-red-500 text-xs mt-1 block">
                            {errors.lname}
                          </small>
                        )}
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <Field
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        className={`w-full px-3 py-2.5 md:py-2 bg-white border rounded-lg md:rounded-xl text-[#543310] placeholder-[#AF8F6F] focus:outline-none focus:ring-2 focus:ring-[#AF8F6F]/30 focus:border-[#74512D] transition-all text-sm md:text-base ${
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
                        className={`w-full px-3 py-2.5 md:py-2 bg-white border rounded-lg md:rounded-xl text-[#543310] placeholder-[#AF8F6F] focus:outline-none focus:ring-2 focus:ring-[#AF8F6F]/30 focus:border-[#74512D] transition-all text-sm md:text-base ${
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

                    {/* Confirm Password */}
                    <div>
                      <Field
                        type="password"
                        name="cpassword"
                        placeholder="Confirm Password"
                        className={`w-full px-3 py-2.5 md:py-2 bg-white border rounded-lg md:rounded-xl text-[#543310] placeholder-[#AF8F6F] focus:outline-none focus:ring-2 focus:ring-[#AF8F6F]/30 focus:border-[#74512D] transition-all text-sm md:text-base ${
                          errors.cpassword && touched.cpassword
                            ? "border-red-400"
                            : "border-[#AF8F6F]/50"
                        }`}
                      />
                      {errors.cpassword && touched.cpassword && (
                        <small className="text-red-500 text-xs mt-1 block">
                          {errors.cpassword}
                        </small>
                      )}
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#543310] text-white py-3 px-4 rounded-lg md:rounded-xl font-medium hover:bg-[#74512D] transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#543310]/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm md:text-base"
                    >
                      {isSubmitting ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
                    </button>

                    {/* Additional Links */}
                    <div className="text-center pt-2">
                      <p className="text-[#74512D] text-xs md:text-sm">
                        Already have an account?{" "}
                        <Link
                          to="/login"
                          className="text-[#543310] font-bold hover:text-[#74512D] transition-colors"
                        >
                          Sign In
                        </Link>
                      </p>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
