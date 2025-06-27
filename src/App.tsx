import './index.css'
import Navbar from './pages/navbar'
import { AuthProvider } from './AuthContext';
import MainRoutes from './MainRoutes'

function App() {
  return (
     <AuthProvider>
        <MainRoutes />
    </AuthProvider>
   
  )
}

export default App
