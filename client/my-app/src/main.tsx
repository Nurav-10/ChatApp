import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from './Context/ThemeProvider.tsx'
import { AuthProvider } from './Context/AuthContext.tsx'

createRoot(document.getElementById('root')!).render(
  <ThemeProvider>
    <AuthProvider>
    <App />
    </AuthProvider>
    </ThemeProvider>
)
