import React from 'react'
import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/landingPage'
import AccountPage from './pages/settingsPage'
import SchedulePage from './pages/schedulePage'
import LoginPage from './pages/loginPage'
import { AuthProvider } from './AuthContext';
import { ProtectedRoute } from './ProtectedRoute';
import Navbar from './pages/navbar'
import DashboardPage from './pages/dashboardPage'
import SettingsPage from './pages/settingsPage'

const MainRoutes=()=> {
 return (
   <div>
       <Routes>
        {/* Public routes */}
          <Route path="/" element={
            <LandingPage/>
            } />
          <Route path="/login" element={<LoginPage />} />


            {/* Protected routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <div>
                    <Navbar/>
                    <DashboardPage />
                  </div>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <div>
                    <Navbar/>
                    <SettingsPage />
                  </div>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/schedule" 
              element={
                <ProtectedRoute>
                  <div>
                    <Navbar/>
                    <SchedulePage />
                  </div>
                </ProtectedRoute>
              } 
            />
      </Routes>
   </div>
 )
}


export default MainRoutes