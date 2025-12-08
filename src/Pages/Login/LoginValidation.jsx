import * as Yup from 'yup'

export const LoginValidation = Yup.object({
  email: Yup.string()
    .email("Enter a valid email")
    .required("Please enter your email"),
    
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required")
});
