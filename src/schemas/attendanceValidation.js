import * as Yup from "yup";

export const attendanceValidationSchema = Yup.object({
  date: Yup.date()
    .required("Date is required")
    .max(new Date(), "Date cannot be in the future"),

  employee: Yup.string()
    .when('$isEdit', {
      is: false,
      then: (schema) => schema.required("Employee is required"),
      otherwise: (schema) => schema.notRequired()
    }),

  status: Yup.string()
    .oneOf(["Present", "Absent", "Late", "Leave", "Half Day"], "Invalid status")
    .required("Status is required"),

  checkIn: Yup.string()
    .when('status', {
      is: 'Present',
      then: (schema) => schema.required('Check In time is required for Present status'),
      otherwise: (schema) => schema.notRequired()
    }),

  checkOut: Yup.string()
    .when('status', {
      is: 'Present',
      then: (schema) => schema.required('Check Out time is required for Present status'),
      otherwise: (schema) => schema.notRequired()
    }),

  workMode: Yup.string()
    .when('status', {
      is: 'Present',
      then: (schema) => schema.oneOf(["Office", "WFH", "Remote", "Offline"], "Invalid work mode").required('Work mode is required for Present status'),
      otherwise: (schema) => schema.notRequired()
    }),

  notes: Yup.string()
    .max(500, "Notes too long")
    .nullable()
});