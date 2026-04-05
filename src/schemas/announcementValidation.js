import * as Yup from "yup";

export const announcementValidationSchema = Yup.object({
  title: Yup.string()
    .trim()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title too long")
    .required("Title is required"),

  msg: Yup.string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message too long")
    .required("Message is required"),

  targetRole: Yup.string()
    .oneOf(["All", "Intern", "Developer", "HR", "Manager"], "Invalid target role")
    .required("Target role is required")
});