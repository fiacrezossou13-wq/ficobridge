import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import Background from '../3d/Background'
import { FileText } from 'lucide-react'

export default function Layout() {
  return (
    <div className="min-h-screen flex relative">
      <Background />
      <Sidebar />
      <div className="flex-1 flex flex-col relative z-10">
        <TopBar />
        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
