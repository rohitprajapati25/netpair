import * as Yup from "yup";

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



export const signUpSchema = Yup.object({

  name: Yup.string()
    .min(3, "Full Name must be at least 3 characters")
    .required("Full Name is required"),

  email: Yup.string()
    .email("Enter valid email address")
    .required("Email is required"),

  phone: Yup.string()
    .required("Phone Number is required")
    .matches(/^[0-9]{10}$/, "Phone must be 10 digits"),

  gender: Yup.string()
    .oneOf(["Male", "Female", "Other"])
    .nullable(),

  dob: Yup.date()
    .transform((value, originalValue) =>
      originalValue === "" ? null : value
    )
    .nullable(),

  department: Yup.string()
    .required("Department is required"),

  // ✅ renamed from designation → position
  position: Yup.string()
    .min(2, "Position too short")
    .required("Position is required"),

  // ✅ lowercase to match form values
  role: Yup.string()
    .oneOf(["employee", "hr"])
    .required("Role is required"),

  employmentType: Yup.string()
    .oneOf(["Full Time", "Intern", "Contract"])
    .nullable(),

  joiningDate: Yup.date()
    .transform((value, originalValue) =>
      originalValue === "" ? null : value
    )
    .required("Joining Date is required"),

  // ✅ lowercase to match backend enum and form values
  status: Yup.string()
    .oneOf(["active", "inactive"])
    .required("Status is required"),

  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Must contain at least one uppercase letter")
    .matches(/[a-z]/, "Must contain at least one lowercase letter")
    .matches(/[0-9]/, "Must contain at least one number")
    .required("Password is required"),

  confirm_pass: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required"),

});
export const loginSchema = Yup.object({
    email:Yup.string().email().required("Enter Your Email Id"),
    password : Yup.string().min(8).required("Enter Your Password Hear"),
});

