import { Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/landingPage'
import SchedulePage from './pages/schedulePage'
import LoginPage from './pages/loginPage'
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

            <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
   </div>
 )
}


export default MainRoutes