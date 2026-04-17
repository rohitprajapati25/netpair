import * as Yup from 'yup';

export const timesheetValidationSchema = Yup.object({
  // Date: required, cannot be in the future (compare date-only, not time)
  date: Yup.string()
    .required("Date is required")
    .test("not-future", "Cannot log future hours", (val) => {
      if (!val) return false;
      const today = new Date();
      today.setHours(23, 59, 59, 999); // allow today fully
      return new Date(val) <= today;
    }),

  project_id: Yup.string()
    .required("Project is required"),

  task_id: Yup.string().optional().nullable(),

  // Cast to number first so "7.5" (string from input) works correctly
  hours_worked: Yup.number()
    .typeError("Enter a valid number of hours")
    .min(0.5, "Minimum 0.5 hours")
    .max(24,  "Maximum 24 hours per day")
    .required("Hours worked is required"),

  work_description: Yup.string()
    .trim()
    .min(10,   "Minimum 10 characters")
    .max(2000, "Maximum 2000 characters")
    .required("Work description is required"),
});

export const timesheetApprovalSchema = Yup.object({
  status: Yup.string().oneOf(['Approved', 'Rejected']).required(),
  rejection_reason: Yup.string().when('status', {
    is: 'Rejected',
    then:      (schema) => schema.min(10, "Minimum 10 characters").required("Rejection reason is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
});
