import React, { useState } from "react";

const AddAdmin = () => {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "Admin",
    department: "",
    status: "Active"
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);

    // API Call Here
    // axios.post("/api/admin/create", formData)

    alert("Admin Added Successfully");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg p-8 w-[400px]"
      >

        <h2 className="text-2xl font-bold mb-6 text-center">
          Add New Admin
        </h2>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          className="w-full border p-2 mb-4 rounded"
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full border p-2 mb-4 rounded"
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone"
          className="w-full border p-2 mb-4 rounded"
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full border p-2 mb-4 rounded"
          onChange={handleChange}
          required
        />

        <select
          name="department"
          className="w-full border p-2 mb-4 rounded"
          onChange={handleChange}
        >
          <option value="">Select Department</option>
          <option value="HR">HR</option>
          <option value="Development">Development</option>
          <option value="Management">Management</option>
        </select>

        <select
          name="status"
          className="w-full border p-2 mb-4 rounded"
          onChange={handleChange}
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        <button
          type="submit"
          className="w-full bg-orange-500 text-white p-2 rounded hover:bg-orange-600"
        >
          Add Admin
        </button>

      </form>
    </div>
  );
};

export default AddAdmin;