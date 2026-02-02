import React from 'react'
import { Outlet } from 'react-router-dom'

const MainBoard = () => {
  return (
    <div className='h-screen w-full overflow-y-hidden'>
      <Outlet/>
    </div>
  )
}

export default MainBoard
 