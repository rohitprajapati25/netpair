import React from "react";
import Card from "../../components/Employee/Cards";
import { RiUserAddLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";


const Employees = () => {
  const navigate = useNavigate();
  
    

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
    <div className="relative h-full m-1 p-6
      bg-gradient-to-br from-slate-50 to-gray-100
      flex flex-col gap-6 overflow-y-auto rounded-2xl grid-cols-1">

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-2xl font-semibold ">Employees</h2>

        <button
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700
          text-white px-4 py-2 rounded-lg shadow transition justify-center" onClick={()=>{navigate('/registration')}}>
          <RiUserAddLine size={18} />
          Add Employee
        </button>
      </div>

      <div className="flex items-start justify-content-center gap-5 flex-wrap grid
  grid-cols-1
  sm:grid-cols-2
  lg:grid-cols-4">
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