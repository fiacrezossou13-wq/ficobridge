import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, CheckCircle, AlertTriangle, Clock, Mail, FileText, Trash2, CheckCheck } from 'lucide-react'

interface Notification {
  id: string
  title: string
  message: string
  type: 'success' | 'warning' | 'info' | 'reminder'
  date: string
  read: boolean
  category: string
}

const initialNotifications: Notification[] = [
  { id: '1', title: 'Entretien confirme', message: 'Bouygues Construction a confirme votre entretien du 8 juillet a 10h.', type: 'success', date: '2026-07-06 09:30', read: false, category: 'Entretien' },
  { id: '2', title: 'Relance recommandee', message: "Votre candidature chez Eiffage n'a pas recu de reponse depuis 10 jours. Il est temps de relancer.", type: 'warning', date: '2026-07-06 08:00', read: false, category: 'Relance' },
  { id: '3', title: 'Nouvelle offre similaire', message: "Une offre d'apprenti conducteur de travaux vient d'etre publiee a Lyon.", type: 'info', date: '2026-07-05 14:20', read: true, category: 'Offre' },
  { id: '4', title: 'Date limite approche', message: 'La candidature chez Vinci ferme dans 3 jours.', type: 'reminder', date: '2026-07-05 10:00', read: false, category: 'Date limite' },
  { id: '5', title: 'CV analyse', message: "L'analyse IA de votre CV est terminee. Score : 72/100.", type: 'success', date: '2026-07-04 16:45', read: true, category: 'IA' },
  { id: '6', title: 'Document ajoute', message: 'Votre lettre de motivation a ete importee avec succes.', type: 'info', date: '2026-07-04 11:30', read: true, category: 'Document' },
]

const typeConfig: Record<string, { icon: any; color: string; bg: string }> = {
  success: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50 border-green-200' },
  warning: { icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-50 border-orange-200' },
  info: { icon: Bell, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' },
  reminder: { icon: Clock, color: 'text-purple-600', bg: 'bg-purple-50 border-purple-200' },
}

const categoryIcons: Record<string, any> = {
  'Entretien': CheckCircle,
  'Relance': AlertTriangle,
  'Offre': Bell,
  'Date limite': Clock,
  'IA': FileText,
  'Document': Mail,
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)
  const [filter, setFilter] = useState<string>('ALL')
  const [showUnreadOnly, setShowUnreadOnly] = useState(false)

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const filtered = notifications.filter(n => {
    const matchesFilter = filter === 'ALL' || n.type === filter
    const matchesUnread = !showUnreadOnly || !n.read
    return matchesFilter && matchesUnread
  })

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bell size={28} className="text-slate-700" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Notifications</h1>
            <p className="text-slate-500 mt-1">{unreadCount} non lue{unreadCount > 1 ? 's' : ''}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowUnreadOnly(!showUnreadOnly)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              showUnreadOnly ? 'bg-steel-blue text-white' : 'bg-white/50 text-slate-600 hover:bg-white border border-slate-200/50'
            }`}
          >
            Non lues seulement
          </button>
          <button onClick={markAllAsRead} className="btn-secondary text-sm flex items-center gap-2">
            <CheckCheck size={16} /> Tout marquer lu
          </button>
        </div>
      </motion.div>

      <div className="flex gap-2 flex-wrap">
        {['ALL', 'success', 'warning', 'info', 'reminder'].map(t => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              filter === t ? 'bg-steel-blue text-white' : 'bg-white/50 text-slate-600 hover:bg-white border border-slate-200/50'
            }`}
          >
            {t === 'ALL' ? 'Toutes' : t === 'success' ? 'Succes' : t === 'warning' ? 'Alertes' : t === 'info' ? 'Infos' : 'Rappels'}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {filtered.map((notif) => {
            const cfg = typeConfig[notif.type]
            const Icon = cfg.icon
            const CatIcon = categoryIcons[notif.category] || Bell
            return (
              <motion.div
                key={notif.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onClick={() => markAsRead(notif.id)}
                className={`glass-card p-4 cursor-pointer transition-all hover:shadow-md ${
                  !notif.read ? 'border-l-4 border-l-steel-blue' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-2.5 rounded-xl ${cfg.bg} shrink-0`}>
                    <Icon size={20} className={cfg.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className={`font-semibold text-sm ${!notif.read ? 'text-slate-800' : 'text-slate-500'}`}>
                          {notif.title}
                        </h4>
                        <p className={`text-sm mt-1 ${!notif.read ? 'text-slate-600' : 'text-slate-400'}`}>
                          {notif.message}
                        </p>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteNotification(notif.id); }}
                        className="p-1.5 hover:bg-red-50 rounded-lg text-slate-300 hover:text-red-500 transition-colors shrink-0"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                      <span className="flex items-center gap-1"><CatIcon size={12} /> {notif.category}</span>
                      <span>{notif.date}</span>
                      {!notif.read && <span className="px-1.5 py-0.5 bg-steel-blue/10 text-steel-blue rounded-full text-[10px] font-medium">Nouveau</span>}
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <Bell size={40} className="mx-auto mb-3 opacity-50" />
            <p>Aucune notification</p>
          </div>
        )}
      </div>
    </div>
  )
}
