import './index.css'
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
