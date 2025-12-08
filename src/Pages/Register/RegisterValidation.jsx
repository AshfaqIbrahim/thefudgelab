import * as Yup from "yup";

export const RegisterValidation = Yup.object({
  fname: Yup.string()
  .min(3, "First name must be at least 3 characters")
  .required("Please enter your first name"), 

  lname: Yup.string(),

  email: Yup.string()
  .email("Enter a valid email")
  .required("Enter a email"),

  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),

  cpassword: Yup.string()
    .oneOf([Yup.ref("password")], "Password do not match")
    .required("Please confirm your password"),
});
