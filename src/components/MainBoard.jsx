// import React from 'react'
// import { Outlet } from 'react-router-dom'

// const MainBoard = () => {
//   return (
//     <div className='h-screen w-full overflow-y-hidden'>
      
//       <Outlet/>
//     </div>
//   )
// }

// export default MainBoard
 

import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar/Sidebar' // Aapka Sidebar component

const MainBoard = () => {
  return (
    <div className='h-screen w-full flex overflow-hidden bg-slate-50'>
      
      {/* 1. Sidebar: Fixed height, fixed width (transitioning) */}
      <Sidebar />

      {/* 2. Content Area: Flexible width, Full height */}
      <div className='flex-1 flex flex-col h-full overflow-hidden'>
        
        {/* Yahan Header Sidebar ke andar se bhi aa sakta hai, 
            ya aap yahan direct render kar sakte hain */}
        
        <main className='flex-1 overflow-y-auto custom-scrollbar p-2'>
           {/* Outlet: Saare dynamic pages (Dashboard, Employees, etc.) yahan render honge */}
           <Outlet />
        </main>

      </div>
    </div>
  )
}

export default MainBoard