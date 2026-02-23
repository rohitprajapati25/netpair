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
import Employees from './user/Admin_Employess/Employees'
import Attendance from './user/Admin_Attendance/Attendance'
import Leave from './user/Admin_leave_page/Leave'
import TaskTimesheet from './user/Admin_Task_Timesheet/TaskTimesheet'
import Projects from './user/Admin_Projects/Projects'
import Asset from './user/Admin_Asset_Page/Asset'
import Reports from './user/Admin_Reports/Reports'
import Announcements from './user/Admin_Announcements/Announcements'
import Settings from './user/Settings/Settings'
import NotFound from './components/NotFound'

const App = () => {
  return (


<Routes>
      <Route path='/home/*'element={<Home/>}/>
      <Route path="/" element={<AuthLayout children={<Lform />} />}/>
      <Route path="/registration" element={<AuthLayout children={<Rform />} />}/>
      
      <Route path="/forgot" element={<AuthLayout children={<Fform/>}/>}/>

      <Route path='/*' element={<NotFound/>}/>

      <Route element={<Home/>}>
        <Route path='dashboard' element={<Dashboard/>}/>
        <Route path='employees' element={<Employees/>}/>
        <Route path='attendance' element={<Attendance/>}/>
        <Route path='leave' element={<Leave/>}/>
        <Route path='projects' element={<Projects/>}/>
        <Route path='tasktimesheet' element={<TaskTimesheet/>}/>
        <Route path='assets' element={<Asset/>}/>
        <Route path='reports' element={<Reports/>}/>
        <Route path='announcements' element={<Announcements/>}/>
        <Route path='settings' element={<Settings/>}/>
      </Route>
</Routes>

  )
}

export default App