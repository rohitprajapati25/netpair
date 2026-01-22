import React from 'react'
import {Routes , Route} from "react-router-dom"
import Login from './user/AuthLayout'
import Registration from './user/Registration'
import Home from './user/Home/Home'
import Forgot from './user/Forgot'
import Dashboard from './user/Dash/Dashboard'
import Header from './components/Header'
import Lform from './components/Login/Lform'
import AuthLayout from './user/AuthLayout'
import Rform from './components/Registration/Rform'


const App = () => {
  return (


<Routes>
      <Route path='/home/*'element={<Home/>}/>
      <Route path="/" element={<AuthLayout children={<Lform />} />}/>
      <Route path="/registration" element={<AuthLayout children={<Rform />} />}/>
      
      <Route path="/forgot" element={<AuthLayout children={<Forgot/>}/>}/>

      <Route element={<Home/>}>
        <Route path='/dashboard' element={<Dashboard/>}/>
      </Route>
</Routes>

  )
}

export default App