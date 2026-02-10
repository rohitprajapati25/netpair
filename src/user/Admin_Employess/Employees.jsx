import React from "react";
import Card from "../../components/Employee/Cards";

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
    <div className="relative h-[100%] m-1 pb-10 pt-5 w-auto bg-white flex flex-col items-start pl-5 pr-5 justify-strat gap-3 min-h-full overflow-y-auto rounded-xl">
      <h2 className="text-2xl font-semibold mb-4">Employees</h2>

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
