import * as Yup from "yup";

export const projectSchema = Yup.object({
  name: Yup.string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name too long")
    .required("Project name is required"),

  company: Yup.string()
    .trim()
    .min(2, "Company/Department name too short")
    .required("Company/Department is required"),

  manager: Yup.string()
    .nullable()
    .test('manager-exists', 'Select valid manager', function(value) {
      // Custom test - will be validated in controller
      return true;
    }),

  startDate: Yup.date()
    .required("Start date is required")
    .max(new Date(), "Start date cannot be in future"),

  endDate: Yup.date()
    .nullable()
    .min(Yup.ref('startDate'), "End date must be after start date"),

  status: Yup.string()
    .oneOf(["Pending", "Ongoing", "Completed", "On Hold", "Cancelled"])
    .default("Ongoing")
    .required(),

  priority: Yup.string()
    .oneOf(["Low", "Medium", "High", "Critical"])
    .default("Medium")
    .required(),

  project_type: Yup.string()
    .oneOf(["Internal", "Client", "Product"])
    .default("Internal")
    .required(),

  budget: Yup.number()
    .min(0, "Budget cannot be negative")
    .nullable(),

  progress: Yup.number()
    .min(0, "Progress min 0%")
    .max(100, "Progress max 100%")
    .default(0),

  assignedEmployees: Yup.array()
    .of(Yup.string())
    .default([]),

  client: Yup.string()
    .trim()
    .max(100)
    .nullable(),

  description: Yup.string()
    .trim()
    .max(1000, "Description too long")
    .nullable()
});

