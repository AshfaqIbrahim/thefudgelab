import * as Yup from "yup";

export const PaymentValidation = Yup.object({
  cardNumber: Yup.string()
    .required("Card number is required")
    .matches(/^[0-9]{16}$/, "Card number must be 16 digits"),

  expiryDate: Yup.string()
    .required("Expiry date is required")
    .matches(/^(0[1-9]|1[0-2])\/\d{2}$/, "Expiry must be in MM/YY format"),

  cvv: Yup.string()
    .matches(/^[0-9]{3,4}$/, "CVV must be 3 or 4 digits")
    .required("CVV is required"),

  upiId: Yup.string()
    .matches(
      /^[\w.\-]{2,256}@[a-zA-Z]{2,64}$/,
      "Enter a valid UPI ID (ex: user@okicici)"
    )
    .required("UPI ID is required"),
});
