import React from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";

const initialValues = {
  name: "",
  email: "",
  phone: "",
  gender: "",
  dob: "",
  department: "",
  designation: "",
  role: "Employee",
  joiningDate: "",
  employmentType: "",
  password: "",
  status: "Active",
};

const Rform = () => {

  const navigate = useNavigate();

  const {
    values,
    handleChange,
    handleSubmit,
    resetForm,
    errors,
    touched,
  } = useFormik({
    initialValues,

    validate: (values) => {
      const errors = {};

      if (!values.name) errors.name = "Required";
      if (!values.email) errors.email = "Required";
      if (!values.department) errors.department = "Required";
      if (!values.designation) errors.designation = "Required";
      if (!values.password) errors.password = "Required";

      return errors;
    },

    onSubmit: (values) => {
      const employees =
        JSON.parse(localStorage.getItem("employees")) || [];

      const newEmployee = {
        empId: "EMP-" + Date.now(),
        createdBy: "ADMIN_001",
        createdAt: new Date().toISOString(),
        attendanceCount: 0,
        leaveBalance: 12,
        ...values,
      };

      localStorage.setItem(
        "employees",
        JSON.stringify([...employees, newEmployee])
      );

      alert("Employee Created Successfully ✅");

      resetForm();
      navigate("/employees");
    },
  });

  return (
    <div className="flex justify-center items-center w-full">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-2xl space-y-4 border border-gray-200"
      >
        <h2 className="text-3xl font-bold text-gray-800">
          Add Employee
        </h2>

        <input
          name="name"
          placeholder="Full Name *"
          value={values.name}
          onChange={handleChange}
          className="w-full h-11 border rounded-lg px-3"
        />
        {touched.name && errors.name && (
          <p className="text-red-500 text-sm">{errors.name}</p>
        )}

        <input
          name="email"
          placeholder="Email *"
          value={values.email}
          onChange={handleChange}
          className="w-full h-11 border rounded-lg px-3"
        />
        {touched.email && errors.email && (
          <p className="text-red-500 text-sm">{errors.email}</p>
        )}

        <input
          name="phone"
          placeholder="Phone"
          value={values.phone}
          onChange={handleChange}
          className="w-full h-11 border rounded-lg px-3"
        />

        <div className="grid grid-cols-2 gap-4">
          <select
            name="gender"
            value={values.gender}
            onChange={handleChange}
            className="h-11 border rounded-lg px-3"
          >
            <option value="">Gender</option>
            <option>Male</option>
            <option>Female</option>
          </select>

          <input
            type="date"
            name="dob"
            value={values.dob}
            onChange={handleChange}
            className="h-11 border rounded-lg px-3"
          />
        </div>

        <select
          name="department"
          value={values.department}
          onChange={handleChange}
          className="w-full h-11 border rounded-lg px-3"
        >
          <option value="">Department *</option>
          <option>Development</option>
          <option>HR</option>
          <option>Design</option>
          <option>QA</option>
        </select>

        <input
          name="designation"
          placeholder="Designation *"
          value={values.designation}
          onChange={handleChange}
          className="w-full h-11 border rounded-lg px-3"
        />

        <div className="grid grid-cols-2 gap-4">
          <select
            name="role"
            value={values.role}
            onChange={handleChange}
            className="h-11 border rounded-lg px-3"
          >
            <option value="Employee">Employee</option>
            <option value="HR">HR</option>
          </select>

          <select
            name="employmentType"
            value={values.employmentType}
            onChange={handleChange}
            className="h-11 border rounded-lg px-3"
          >
            <option value="">Employment Type</option>
            <option>Full Time</option>
            <option>Intern</option>
            <option>Contract</option>
          </select>
        </div>

        <input
          type="date"
          name="joiningDate"
          value={values.joiningDate}
          onChange={handleChange}
          className="w-full h-11 border rounded-lg px-3"
        />

        <input
          type="password"
          name="password"
          placeholder="Temporary Password *"
          value={values.password}
          onChange={handleChange}
          className="w-full h-11 border rounded-lg px-3"
        />

        <select
          name="status"
          value={values.status}
          onChange={handleChange}
          className="w-full h-11 border rounded-lg px-3"
        >
          <option>Active</option>
          <option>Inactive</option>
        </select>

        <button
          type="submit"
          className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-lg font-semibold"
        >
          Create Employee
        </button>
      </form>
    </div>
  );
};

export default Rform;