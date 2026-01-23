import React from 'react'
// import MainBoard from './MainBoard'
import { Outlet } from 'react-router-dom'
import Dashboard from '../user/Dash/Dashboard'

const Header = () => {
  const date = new Date();
  
  return (
   
     
        <div className='w-full'>
          <div className='w-full h-15 flex items-center  justify-between p-5 bg-white border-b-2 border-gray-300'>
          <div>
             <p className='text-2xl font-bold'>Welcome Elonmusk!</p>
             <p className='text-xs font-semibold'>Today is {date.toDateString()}</p>

          </div>
          <div className='border-2 border-gray-500 flex h-12 w-40 m-1  rounded-2xl justify-center items-center'>
            <div className='flex justify-around m-2'>
              <div className=''>
              <img src="src\assets\imgs\profile_pic.jpg" className='h-10 w-10 rounded-4xl border' alt="" /> 
            </div> 
            </div>
             <div  className=''>
              <p className='font-bold text-[20px]'>Elonmusk</p>
             <p className='text-[10px]'>Admin</p>
             </div>
            
          </div>
      </div>
       <div className='bg-gray-200 h-[100vh]'>
         
          <Outlet/>
       
       </div>
     
        </div>
     
   
  )
}

export default Header
