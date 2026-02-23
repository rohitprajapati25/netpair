import React from "react";
import Card from "../../components/Employee/Cards";
import { RiUserAddLine } from "react-icons/ri";

const Employees = () => {

  const employeeData = [
    {
      id: 1,
      name: "Rahul Patel",
      designation: "Frontend Developer",
      working_amount: 15,
      place: "Ahmedabad",
      pimg: "https://i.pravatar.cc/150?img=1"
    },
    {
      id: 2,
      name: "Priya Shah",
      designation: "UI/UX Designer",
      working_amount: 18,
      place: "Surat",
      pimg: "https://i.pravatar.cc/150?img=2"
    },
    {
      id: 3,
      name: "Amit Kumar",
      designation: "Backend Developer",
      working_amount: 20,
      place: "Vadodara",
      pimg: "https://i.pravatar.cc/150?img=3"
    }
  ];

  return (
    <div className="h-full m-1 p-6
      bg-gray-50 rounded-2xl
      flex flex-col gap-6 overflow-y-auto">

      {/* Header */}
      <div className="flex justify-between items-center w-full">
        <h2 className="text-2xl font-semibold">Employees</h2>

        <button
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700
          text-white px-4 py-2 rounded-lg shadow transition"
        >
          <RiUserAddLine size={18} />
          Add Employee
        </button>
      </div>

      {/* Employee Cards */}
      <div className="flex items-start justify-content-center gap-5 flex-wrap">
        {employeeData.map(emp => (
          <Card
            key={emp.id}
            name={emp.name}
            designation={emp.designation}
            working_amount={emp.working_amount}
            place={emp.place}
            pimg={emp.pimg}
          />
        ))}
      </div>

    </div>
  );
};

export default Employees;