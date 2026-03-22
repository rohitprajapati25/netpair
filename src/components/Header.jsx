// import React from 'react'
// import { Outlet } from 'react-router-dom'


// const Header = () => {
//   const date = new Date();
  
  
//   return (
//         <div className='w-full'>
//           <div className='w-full h-15 flex items-center  justify-between p-5 bg-white border-b-2 border-gray-300'>
//           <div>
//              <p className='text-2xl font-bold'>Welcome Elonmusk!</p>
//              <p className='text-xs font-semibold'>Today is {date.toDateString()}</p>
//           </div>
//          <div className='flex gap-5 justify-center align-center' >
//            <div className='border-2 border-gray-500 flex h-12 w-auto m-1  rounded-2xl justify-center items-center'>
//             <div className='flex justify-around m-2'>
//               <div className=''>
//               <img src="src\assets\imgs\profile_pic.jpg" className='h-10 w-10 rounded-4xl border' alt="" /> 
//             </div> 
//             </div>
//              <div  className='relative mr-2'>
//               <p className='font-bold text-[20px]'>Elon musk</p>
//              <p className='text-[10px]'>Admin</p>
//              </div>
            
//           </div>
//            <div className='p-3 rounded-lg hover:bg-gray-200 cursor-pointer'>
//               <i className="ri-notification-line font-bold text-2xl"></i>
//           </div>
//          </div>
         
//       </div>
//        <div className='bg-gray-100 h-[100vh]'>
         
//           <Outlet/>
       
//        </div>
     
//         </div>
     
   
//   )
// }

// export default Header




import React from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Header = () => {
  const date = new Date();
  const { user, logout } = useAuth();

  const name = user?.name || "User";
  const role = user?.role || "Employee";

  return (
    <div className='w-full'>
      <div className='w-full h-15 flex items-center justify-between p-5 bg-white border-b-2 border-gray-300'>
        
        <div>
          <p className='text-2xl font-bold'>Welcome {name}!</p>
          <p className='text-xs font-semibold'>
            Today is {date.toDateString()}
          </p>
        </div>

        <div className='flex gap-5 justify-center align-center'>
          
          <div className='border-2 border-gray-500 flex h-12 w-auto m-1 rounded-2xl justify-center items-center'>
            
            <div className='flex justify-around m-2'>
              <div>
                <img
                  src="src/assets/imgs/profile_pic.jpg"
                  className='h-10 w-10 rounded-4xl border'
                  alt="profile"
                />
              </div>
            </div>

            <div className='relative mr-2'>
              <p className='font-bold text-[20px]'>{name}</p>
              <p className='text-[10px]'>{role}</p>
            </div>

          </div>

          <div className='p-3 rounded-lg hover:bg-gray-200 cursor-pointer' onClick={logout} title="Logout">
            <i className="ri-logout-box-line text-2xl"></i>
          </div>

        </div>
      </div>

      <div className='bg-gray-100 h-[100vh]'>
        <Outlet/>
      </div>

    </div>
  )
}

export default Header