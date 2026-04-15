import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Sidebar from '../../components/Sidebar/Sidebar'
// import MainBoard from '../../components/MainBoard'
// import Dashboard from '../Dash/Dashboard'

const Home = () => {
  return (
    <div className="h-screen w-screen overflow-hidden">
      <Sidebar />
    </div>
  );
};

export default Home
