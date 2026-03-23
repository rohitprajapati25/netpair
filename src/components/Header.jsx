// // import React from 'react'
// // import { Outlet } from 'react-router-dom'


// // const Header = () => {
// //   const date = new Date();
  
  
// //   return (
// //         <div className='w-full'>
// //           <div className='w-full h-15 flex items-center  justify-between p-5 bg-white border-b-2 border-gray-300'>
// //           <div>
// //              <p className='text-2xl font-bold'>Welcome Elonmusk!</p>
// //              <p className='text-xs font-semibold'>Today is {date.toDateString()}</p>
// //           </div>
// //          <div className='flex gap-5 justify-center align-center' >
// //            <div className='border-2 border-gray-500 flex h-12 w-auto m-1  rounded-2xl justify-center items-center'>
// //             <div className='flex justify-around m-2'>
// //               <div className=''>
// //               <img src="src\assets\imgs\profile_pic.jpg" className='h-10 w-10 rounded-4xl border' alt="" /> 
// //             </div> 
// //             </div>
// //              <div  className='relative mr-2'>
// //               <p className='font-bold text-[20px]'>Elon musk</p>
// //              <p className='text-[10px]'>Admin</p>
// //              </div>
            
// //           </div>
// //            <div className='p-3 rounded-lg hover:bg-gray-200 cursor-pointer'>
// //               <i className="ri-notification-line font-bold text-2xl"></i>
// //           </div>
// //          </div>
         
// //       </div>
// //        <div className='bg-gray-100 h-[100vh]'>
         
// //           <Outlet/>
       
// //        </div>
     
// //         </div>
     
   
// //   )
// // }

// // export default Header




// import React from 'react'
// import { Outlet, useNavigate } from 'react-router-dom'
// import { useAuth } from '../contexts/AuthContext'

// const Header = () => {
//   const date = new Date();
//   const { user, logout } = useAuth();

//   const name = user?.name || "User";
//   const role = user?.role || "Employee";

//   return (
//     <div className='w-full'>
//       <div className='w-full h-15 flex items-center justify-between p-5 bg-white border-b-2 border-gray-300'>
        
//         <div>
//           <p className='text-2xl font-bold'>Welcome {name}!</p>
//           <p className='text-xs font-semibold'>
//             Today is {date.toDateString()}
//           </p>
//         </div>

//         <div className='flex gap-5 justify-center align-center'>
          
//           <div className='border-2 border-gray-500 flex h-12 w-auto m-1 rounded-2xl justify-center items-center'>
            
//             <div className='flex justify-around m-2'>
//               <div>
//                 <img
//                   src="src/assets/imgs/profile_pic.jpg"
//                   className='h-10 w-10 rounded-4xl border'
//                   alt="profile"
//                 />
//               </div>
//             </div>

//             <div className='relative mr-2'>
//               <p className='font-bold text-[20px]'>{name}</p>
//               <p className='text-[10px]'>{role}</p>
//             </div>

//           </div>

//           <div className='p-3 rounded-lg hover:bg-gray-200 cursor-pointer' onClick={logout} title="Logout">
//             <i className="ri-logout-box-line text-2xl"></i>
//           </div>

//         </div>
//       </div>

//       <div className='bg-gray-100 h-[100vh]'>
//         <Outlet/>
//       </div>

//     </div>
//   )
// }

// export default Header


import React from 'react'
import { Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Header = () => {
  const date = new Date();
  const { user, logout } = useAuth();

  const name = user?.name || "Admin";
  const role = user?.role || "SuperAdmin";

  return (
    <div className='flex-1 flex flex-col h-full bg-slate-50 overflow-hidden'>
      {/* Top Navbar */}
      <header className='h-20 w-full flex items-center justify-between px-8 bg-white border-b border-slate-200 shrink-0'>
        
        <div className="flex flex-col">
          <h2 className='text-xl font-black text-slate-800 leading-tight'>Hello, {name.split(' ')[0]} 👋</h2>
          <p className='text-[10px] font-bold text-slate-400 uppercase tracking-widest'>
            {date.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>

        <div className='flex items-center gap-6'>
          {/* Profile Card */}
          <div className='flex items-center bg-slate-50 p-1.5 pr-5 rounded-2xl border border-slate-100 gap-3'>
            <div className='h-10 w-10 rounded-xl overflow-hidden border-2 border-white shadow-sm'>
              <img
                src="https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff"
                className='h-full w-full object-cover'
                alt="profile"
              />
            </div>
            <div className='flex flex-col'>
              <p className='font-black text-slate-700 text-xs leading-none'>{name}</p>
              <p className='text-[9px] font-black text-blue-600 uppercase mt-1 tracking-tighter'>{role}</p>
            </div>
          </div>

          {/* Logout Button */}
          <button 
            className='h-11 w-11 flex items-center justify-center rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all duration-300 shadow-sm'
            onClick={logout} 
            title="Secure Logout"
          >
            <i className="ri-logout-circle-r-line text-xl"></i>
          </button>
        </div>
      </header>

      {/* Page Content Container */}
      <div className='flex-1 overflow-y-auto p-6 lg:p-10 scroll-smooth'>
        <div className="max-w-[1600px] mx-auto">
          <Outlet/>
        </div>
      </div>
    </div>
  )
}

export default Header