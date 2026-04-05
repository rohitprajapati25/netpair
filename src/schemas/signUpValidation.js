import * as Yup from "yup";

export const signUpSchema = Yup.object({
  name: Yup.string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name too long")
    .required("Full name is required"),

  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),

  phone: Yup.string()
    .matches(/^[6-9]\d{9}$/, "Invalid phone number (10 digits starting with 6-9)")
    .required("Phone number is required"),

  gender: Yup.string()
    .oneOf(["Male", "Female", "Other"], "Invalid gender")
    .required("Gender is required"),

  dob: Yup.date()
    .required("Date of birth is required")
    .max(new Date(Date.now() - 18 * 365 * 24 * 60 * 60 * 1000), "Must be at least 18 years old"),

  department: Yup.string()
    .oneOf(["Development", "HR", "Design", "QA", "IT", "Sales", "Marketing", "Finance"], "Invalid department")
    .required("Department is required"),

  designation: Yup.string()
    .oneOf(["Developer", "Senior Developer", "Manager", "HR Executive", "Designer", "Tester", "Intern"], "Invalid designation")
    .required("Designation is required"),

  role: Yup.string()
    .oneOf(["employee", "hr", "admin"], "Invalid role")
    .required("Role is required"),

  joiningDate: Yup.date()
    .required("Joining date is required")
    .max(new Date(), "Joining date cannot be in future"),

  employmentType: Yup.string()
    .oneOf(["Full Time", "Part Time", "Intern", "Contract"], "Invalid employment type")
    .required("Employment type is required"),

  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    )
    .required("Password is required"),

  confirm_pass: Yup.string()
    .oneOf([Yup.ref('password')], "Passwords must match")
    .required("Please confirm your password"),

  status: Yup.string()
    .oneOf(["active", "inactive"], "Invalid status")
    .default("inactive")
});