// import * as Yup from "yup";

// export const signUpSchema = Yup.object({

//   name: Yup.string()
//     .min(3, "Full Name must be at least 3 characters")
//     .required("Full Name is required"),

//   email: Yup.string()
//     .email("Enter valid email address")
//     .required("Email is required"),

//   phone: Yup.string()
//     .required("Phone Number is required")
//     .matches(/^[0-9]{10}$/, "Phone must be 10 digits"),

//   gender: Yup.string()
//     .oneOf(["Male", "Female"])
//     .nullable(),

//   dob: Yup.date()
//     .transform((value, originalValue) =>
//       originalValue === "" ? null : value
//     )
//     .nullable(),

//   department: Yup.string()
//     .required("Department is required"),

//   designation: Yup.string()
//     .min(2, "Designation too short")
//     .required("Designation is required"),

//   role: Yup.string()
//     .oneOf(["Employee", "HR"])
//     .required(),

//   employmentType: Yup.string()
//     .oneOf(["Full Time", "Intern", "Contract"])
//     .nullable(),

//   joiningDate: Yup.date()
//     .transform((value, originalValue) =>
//       originalValue === "" ? null : value
//     )
//     .required("Joining Date is required"),

//   status: Yup.string()
//     .oneOf(["Active", "Inactive"])
//     .required(),

//   password: Yup.string()
//     .min(8, "Password must be at least 8 characters")
//     .matches(/[A-Z]/, "Must contain at least one uppercase letter")
//     .matches(/[a-z]/, "Must contain at least one lowercase letter")
//     .matches(/[0-9]/, "Must contain at least one number")
//     .required("Password is required"),

//   confirm_pass: Yup.string()
//     .oneOf([Yup.ref("password")], "Passwords must match")
//     .required("Confirm Password is required"),

// });


import * as Yup from "yup";

import { genderRole } from "../components/Registration/genderRole";
import { ROLES } from "../../../backend/constants/roles";

// --- Sign Up / Add Employee Schema ---
export const signUpSchema = Yup.object({
  name: Yup.string()
    .trim()
    .min(3, "Full Name must be at least 3 characters")
    .required("Full Name is required"),

  email: Yup.string()
    .trim()
    .email("Please enter a valid email address")
    .required("Email is required"),

  phone: Yup.string()
    .required("Phone Number is required")
    .matches(/^[6-9]\d{9}$/, "Must be a valid 10-digit Indian number"), // Starts with 6-9

  gender: Yup.string()
    .oneOf([genderRole.Male, genderRole.Female, genderRole.Other], "Select a valid gender")
    .required("Gender is required"),

  dob: Yup.date()
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .max(new Date(), "Date of Birth cannot be in the future")
    .required("Date of Birth is required"),

  department: Yup.string()
    .required("Department is required"),

  position: Yup.string()
    .trim()
    .min(2, "Position title is too short")
    .required("Position is required"),

  role: Yup.string()
    .oneOf([ROLES.EMPLOYEE, ROLES.HR, ROLES.ADMIN], "Invalid role selected")
    .required("Role is required"),

  employmentType: Yup.string()
    .oneOf(["Full Time", "Intern", "Contract"], "Select employment type")
    .required("Employment Type is required"),

  joiningDate: Yup.date()
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .required("Joining Date is required"),

  status: Yup.string()
    .oneOf(["active", "inactive"])
    .default("inactive"),

  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Include at least one uppercase letter")
    .matches(/[a-z]/, "Include at least one lowercase letter")
    .matches(/[0-9]/, "Include at least one number")
    .matches(/[@$!%*?&]/, "Include at least one special character") // Extra security layer
    .required("Password is required"),

  confirm_pass: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords do not match")
    .required("Please confirm your password"),
});

// --- Login Schema ---
export const loginSchema = Yup.object({
  email: Yup.string()
    .trim()
    .email("Invalid email format")
    .required("Email address is required to login"),
    
  password: Yup.string()
    .min(8, "Password should be at least 8 characters")
    .required("Password is required for authentication"),
});