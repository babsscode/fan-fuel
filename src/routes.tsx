import React from 'react'
import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/landingPage'
import HomePage from './pages/homePage'
import AccountPage from './pages/accountPage'
import SchedulePage from './pages/schedulePage'


const MainRoutes=()=> {
 return (
   <div>
       <Routes>
          <Route path="/" element={<LandingPage/>} />
          <Route path="/home" element={<HomePage/>} />
          <Route path="/account" element={<AccountPage/>} />
          <Route path="/schedule" element={<SchedulePage/>} />
      </Routes>
   </div>
 )
}


export default MainRoutes