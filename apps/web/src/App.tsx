import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Applications from './pages/Applications'
import Calendar from './pages/Calendar'
import AI from './pages/AI'
import Documents from './pages/Documents'
import Notifications from './pages/Notifications'
import Security from './pages/Security'
import Export from './pages/Export'
import ExportPage from './pages/Export'


function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="applications" element={<Applications />} />
        <Route path="ai" element={<AI />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="documents" element={<Documents />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="security" element={<Security />} />
        <Route path="/export" element={<ExportPage />} />
      </Route>
    </Routes>
  )
}

