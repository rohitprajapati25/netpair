import React from 'react'
import {Routes , Route} from "react-router-dom"
import Login from './user/AuthLayout'
import Registration from './user/Registration'
import Home from './user/Home/Home'
import Header from './components/Header'
import Lform from './components/Login/Lform'
import AuthLayout from './user/AuthLayout'
import Rform from './components/Registration/Rform'
import Fform from './components/Forgot/Fform'
import Dashboard from '../src/user/Dash/Dashboard'
import Employees from './user/Employess/Employees'
import Attendance from './user/Admin_Attendance/Attendance'
import Leave from './user/Admin_leave_page/Leave'
const App = () => {
  return (


<Routes>
      <Route path='/home/*'element={<Home/>}/>
      <Route path="/" element={<AuthLayout children={<Lform />} />}/>
      <Route path="/registration" element={<AuthLayout children={<Rform />} />}/>
      
      <Route path="/forgot" element={<AuthLayout children={<Fform/>}/>}/>

      <Route element={<Home/>}>
        <Route path='dashboard' element={<Dashboard/>}/>
        <Route path='employees' element={<Employees/>}/>
        <Route path='attendance' element={<Attendance/>}/>
        <Route path='leave' element={<Leave/>}/>
      </Route>
</Routes>

  )
}

export default App