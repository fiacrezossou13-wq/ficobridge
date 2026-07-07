import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Briefcase, Brain, Calendar, FileText, Bell, LogOut, Shield } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { motion } from 'framer-motion'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Tableau de bord' },
  { to: '/applications', icon: Briefcase, label: 'Candidatures' },
  { to: '/ai', icon: Brain, label: 'Assistant IA' },
  { to: '/calendar', icon: Calendar, label: 'Calendrier' },
  { to: '/documents', icon: FileText, label: 'Documents' },
  { to: '/notifications', icon: Bell, label: 'Notifications' },
  { to: '/security', icon: Shield, label: 'Sécurité' },
  { to: '/export', icon: FileText, label: 'Export' },
]

export default function Sidebar() {
  const logout = useAuthStore((s) => s.logout)
  const user = useAuthStore((s) => s.user)

  return (
    <motion.aside 
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-64 h-screen sticky top-0 glass-panel border-r border-white/30 flex flex-col"
    >
      <div className="p-6 border-b border-slate-200/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-steel-blue to-sky-blue flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">F</span>
          </div>
          <div>
            <h1 className="font-bold text-lg text-slate-800">FicoBridge</h1>
            <p className="text-xs text-slate-500">Votre pont vers l'alternance</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-steel-blue/10 text-steel-blue font-semibold shadow-sm' 
                  : 'text-slate-600 hover:bg-white/50 hover:text-slate-900'
              }`
            }
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-200/50">
        <div className="flex items-center gap-3 px-4 py-3 mb-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-construction-yellow to-safety-orange flex items-center justify-center text-white font-bold text-sm">
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-800 truncate">{user?.firstName} {user?.lastName}</p>
            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
          </div>
        </div>
        <button 
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 w-full text-red-600 hover:bg-red-50 rounded-xl transition-colors"
        >
          <LogOut size={20} />
          <span>Déconnexion</span>
        </button>
      </div>
    </motion.aside>
  )
}
