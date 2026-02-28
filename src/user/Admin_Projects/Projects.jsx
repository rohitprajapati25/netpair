import React, { useState } from "react";
import ProjectFilters from "../../components/Projects/ProjectFilters";
import ProjectsTable from "../../components/Projects/ProjectsTable";
import ProjectCards from "../../components/projects/ProjectCards";

const Projects = () => {

  const [projects,setProject] = useState([
    {id:1,name:"Rohit",start:"2026-02-03",end:"2026-02-10",status:"Ongoing"},
    {id:2,name:"Ram",start:"2026-02-03",end:"2026-02-10",status:"Completed"},
    {id:3,name:"Dev",start:"2026-02-03",end:"2026-02-10",status:"Ongoing"},
    {id:4,name:"Prabhat",start:"2026-02-03",end:"2026-02-10",status:"On Hold"},
    {id:5,name:"Demo",start:"2026-02-03",end:"2026-02-10",status:"Ongoing"}
  ]);

  const [data,setData] = useState(projects);

  const [c,setC] = useState(data);


  return (
    <div className="relative h-full m-1 p-6
      bg-gradient-to-br from-slate-50 to-gray-100
      flex flex-col gap-6 overflow-y-auto rounded-2xl">

      <h1 className="text-2xl font-semibold">
        Project Management
      </h1>

      <ProjectCards data={c}/>

      <ProjectFilters projects={projects} setData={setData}/>

      <ProjectsTable data={data}/>
    </div>
  );
};

export default Projects;