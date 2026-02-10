import React, { useState } from "react";
import ProjectFilters from "../../components/Projects/ProjectFilters";
import ProjectsTable from "../../components/Projects/ProjectsTable";
import ProjectCards from "../../components/projects/ProjectCards";
import ProjectModal from "../../components/Projects/ProjectModal";

const Projects = () => {
    const [open,setopen] = useState(false);

  return (
    <div className="relative h-[100%] m-1 pb-10 pt-5 w-auto bg-white flex flex-col items-bitween pl-5 pr-5 justify-strat gap-3 min-h-full overflow-y-auto rounded-xl">

      <div className="flex justify-between items-center mb-6 ">
        <h1 className="text-2xl font-semibold mb-6">Projects</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 " onClick={()=>setopen(true)}  >
          + Add Project
        </button>
      </div>                                                                                    

      <ProjectCards />

      <ProjectFilters />

      <ProjectsTable />
      {open && <ProjectModal onClose={()=>setopen(false)} />}


    </div>
  );
};

export default Projects;
