import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar as CalendarIcon, Plus, ChevronLeft, ChevronRight, Clock, MapPin, Building2, AlertCircle, Trash2, Edit3, X, CheckCircle, XCircle, CalendarDays } from 'lucide-react'

interface CalendarEvent {
  id: string
  title: string
  date: string
  startTime: string
  endTime: string
  type: string
  company?: string
  location?: string
  priority: 'low' | 'medium' | 'high'
  comment: string
  notes: string
  status: 'planned' | 'done' | 'cancelled' | 'postponed'
  color: string
}

const eventTypes = [
  { key: 'candidature', label: 'Candidature envoyee', color: 'bg-blue-500' },
  { key: 'relance', label: 'Relance', color: 'bg-yellow-500' },
  { key: 'entretien-rh', label: 'Entretien RH', color: 'bg-green-500' },
  { key: 'entretien-tech', label: 'Entretien technique', color: 'bg-emerald-500' },
  { key: 'entretien-final', label: 'Entretien final', color: 'bg-teal-500' },
  { key: 'salon', label: 'Salon de l emploi', color: 'bg-purple-500' },
  { key: 'forum', label: 'Forum entreprises', color: 'bg-pink-500' },
  { key: 'appel', label: 'Appel telephonique', color: 'bg-orange-500' },
  { key: 'rdv-ecole', label: 'Rendez-vous ecole', color: 'bg-cyan-500' },
  { key: 'deadline', label: 'Date limite', color: 'bg-red-500' },
  { key: 'rappel', label: 'Rappel personnel', color: 'bg-indigo-500' },
  { key: 'autre', label: 'Autre', color: 'bg-slate-500' },
]

const priorityConfig = {
  low: { label: 'Basse', color: 'bg-green-100 text-green-700' },
  medium: { label: 'Moyenne', color: 'bg-yellow-100 text-yellow-700' },
  high: { label: 'Haute', color: 'bg-red-100 text-red-700' },
}

const statusConfig = {
  planned: { label: 'Prevu', icon: Clock, color: 'text-blue-600' },
  done: { label: 'Realise', icon: CheckCircle, color: 'text-green-600' },
  cancelled: { label: 'Annule', icon: XCircle, color: 'text-red-600' },
  postponed: { label: 'Reporte', icon: AlertCircle, color: 'text-orange-600' },
}

const STORAGE_KEY = 'ficobridge_calendar_events'

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'month' | 'list'>('month')

  const [form, setForm] = useState<Partial<CalendarEvent>>({
    title: '', date: '', startTime: '09:00', endTime: '10:00', type: 'candidature', company: '', location: '', priority: 'medium', comment: '', notes: '', status: 'planned', color: 'bg-blue-500',
  })

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try { setEvents(JSON.parse(saved)); } catch {}
    }
  }, [])

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events))
  }, [events])

  // Listen for external open event
  useEffect(() => {
    const handler = () => { setShowModal(true); }
    window.addEventListener('openNewEventModal', handler)
    return () => window.removeEventListener('openNewEventModal', handler)
  }, [])

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)
  const monthNames = ['Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Decembre']
  const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1))

  const getEventsForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return events.filter(e => e.date === dateStr)
  }

  const openNewEvent = (day?: number) => {
    const dateStr = day ? `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}` : new Date().toISOString().split('T')[0]
    setForm({
      title: '', date: dateStr, startTime: '09:00', endTime: '10:00', type: 'candidature', company: '', location: '', priority: 'medium', comment: '', notes: '', status: 'planned', color: 'bg-blue-500',
    })
    setEditingEvent(null)
    setShowModal(true)
  }

  const openEditEvent = (event: CalendarEvent) => {
    setForm(event)
    setEditingEvent(event)
    setShowModal(true)
  }

  const saveEvent = () => {
    if (!form.title || !form.date) return
    const typeInfo = eventTypes.find(t => t.key === form.type)
    const eventData: CalendarEvent = {
      id: editingEvent ? editingEvent.id : Date.now().toString(),
      title: form.title || '',
      date: form.date || '',
      startTime: form.startTime || '09:00',
      endTime: form.endTime || '10:00',
      type: form.type || 'candidature',
      company: form.company,
      location: form.location,
      priority: (form.priority as any) || 'medium',
      comment: form.comment || '',
      notes: form.notes || '',
      status: (form.status as any) || 'planned',
      color: typeInfo?.color || 'bg-blue-500',
    }

    if (editingEvent) {
      setEvents(prev => prev.map(e => e.id === editingEvent.id ? eventData : e))
    } else {
      setEvents(prev => [...prev, eventData])
    }
    closeModal()
  }

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id))
  }

  const duplicateEvent = (event: CalendarEvent) => {
    const newEvent = { ...event, id: Date.now().toString(), date: new Date().toISOString().split('T')[0] }
    setEvents(prev => [...prev, newEvent])
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingEvent(null)
  }

  const calendarDays = []
  for (let i = 0; i < firstDay; i++) calendarDays.push(null)
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i)

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CalendarDays size={28} className="text-slate-700" />
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Calendrier</h1>
            <p className="text-slate-500 mt-1">{events.length} evenement{events.length > 1 ? 's' : ''} planifie{events.length > 1 ? 's' : ''}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-white/50 rounded-lg p-1 border border-slate-200/50">
            <button onClick={() => setViewMode('month')} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${viewMode === 'month' ? 'bg-steel-blue text-white' : 'text-slate-600'}`}>Mois</button>
            <button onClick={() => setViewMode('list')} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${viewMode === 'list' ? 'bg-steel-blue text-white' : 'text-slate-600'}`}>Liste</button>
          </div>
          <button onClick={() => openNewEvent()} className="btn-primary flex items-center gap-2">
            <Plus size={18} /> Ajouter une date
          </button>
        </div>
      </motion.div>

      {viewMode === 'month' ? (
        <div className="glass-card p-6">
          {/* Calendar header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <button onClick={prevMonth} className="p-2 hover:bg-slate-100 rounded-lg transition-colors"><ChevronLeft size={20} className="text-slate-600" /></button>
              <h2 className="text-xl font-bold text-slate-800">{monthNames[month]} {year}</h2>
              <button onClick={nextMonth} className="p-2 hover:bg-slate-100 rounded-lg transition-colors"><ChevronRight size={20} className="text-slate-600" /></button>
            </div>
          </div>

          {/* Days header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map(d => (
              <div key={d} className="text-center text-xs font-medium text-slate-500 py-2">{d}</div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, idx) => {
              if (day === null) return <div key={idx} className="h-24 rounded-lg" />
              const dayEvents = getEventsForDay(day)
              const isToday = new Date().toISOString().split('T')[0] === `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
              return (
                <div
                  key={idx}
                  onClick={() => openNewEvent(day)}
                  className={`h-24 rounded-lg border border-slate-100 p-1.5 cursor-pointer transition-all hover:bg-slate-50 relative ${isToday ? 'bg-steel-blue/5 border-steel-blue/20' : 'bg-white/40'}`}
                >
                  <span className={`text-xs font-medium ${isToday ? 'text-steel-blue' : 'text-slate-600'}`}>{day}</span>
                  <div className="space-y-0.5 mt-1">
                    {dayEvents.slice(0, 3).map(e => (
                      <div
                        key={e.id}
                        onClick={(ev) => { ev.stopPropagation(); openEditEvent(e); }}
                        className={`text-[10px] truncate px-1 py-0.5 rounded text-white ${e.color}`}
                        title={e.title}
                      >
                        {e.title}
                      </div>
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="text-[10px] text-slate-400 text-center">+{dayEvents.length - 3}</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="glass-card p-6">
          <h3 className="font-semibold text-slate-800 mb-4">Liste des evenements</h3>
          <div className="space-y-2">
            {events.length === 0 && (
              <div className="text-center py-12 text-slate-400">
                <CalendarIcon size={40} className="mx-auto mb-3 opacity-50" />
                <p>Aucun evenement</p>
              </div>
            )}
            {events.sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime)).map(event => {
              const typeInfo = eventTypes.find(t => t.key === event.type)
              const statusInfo = statusConfig[event.status]
              const StatusIcon = statusInfo.icon
              return (
                <motion.div
                  key={event.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/40 border border-slate-100 hover:shadow-md transition-all"
                >
                  <div className={`w-3 h-3 rounded-full ${event.color} shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-slate-800 text-sm truncate">{event.title}</h4>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${priorityConfig[event.priority].color}`}>{priorityConfig[event.priority].label}</span>
                    </div>
                    <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                      <CalendarIcon size={10} /> {event.date} · <Clock size={10} /> {event.startTime} - {event.endTime}
                      {event.company && <><Building2 size={10} /> {event.company}</>}
                      {event.location && <><MapPin size={10} /> {event.location}</>}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={`text-xs flex items-center gap-1 ${statusInfo.color}`}><StatusIcon size={12} /> {statusInfo.label}</span>
                    <button onClick={() => duplicateEvent(event)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-steel-blue"><CalendarIcon size={14} /></button>
                    <button onClick={() => openEditEvent(event)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-steel-blue"><Edit3 size={14} /></button>
                    <button onClick={() => deleteEvent(event.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500"><Trash2 size={14} /></button>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-2">
        {eventTypes.map(t => (
          <div key={t.key} className="flex items-center gap-1.5 text-xs text-slate-600">
            <div className={`w-2 h-2 rounded-full ${t.color}`} />
            {t.label}
          </div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-800">
                  {editingEvent ? "Modifier l evenement" : "Nouvel evenement"}
                </h3>
                <button onClick={closeModal} className="p-1 hover:bg-slate-100 rounded-lg"><X size={18} className="text-slate-400" /></button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Titre *</label>
                  <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 bg-white/60 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-steel-blue/50 text-sm" placeholder="Titre de l evenement" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                    <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="w-full px-3 py-2 bg-white/60 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-steel-blue/50 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                    <select value={form.type} onChange={e => { const t = eventTypes.find(x => x.key === e.target.value); setForm({ ...form, type: e.target.value, color: t?.color || 'bg-blue-500' }); }} className="w-full px-3 py-2 bg-white/60 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-steel-blue/50 text-sm">
                      {eventTypes.map(t => <option key={t.key} value={t.key}>{t.label}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Heure debut</label>
                    <input type="time" value={form.startTime} onChange={e => setForm({ ...form, startTime: e.target.value })} className="w-full px-3 py-2 bg-white/60 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-steel-blue/50 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Heure fin</label>
                    <input type="time" value={form.endTime} onChange={e => setForm({ ...form, endTime: e.target.value })} className="w-full px-3 py-2 bg-white/60 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-steel-blue/50 text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Entreprise</label>
                  <input value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} className="w-full px-3 py-2 bg-white/60 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-steel-blue/50 text-sm" placeholder="Vinci..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Lieu</label>
                  <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="w-full px-3 py-2 bg-white/60 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-steel-blue/50 text-sm" placeholder="Paris..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Priorite</label>
                    <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value as any })} className="w-full px-3 py-2 bg-white/60 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-steel-blue/50 text-sm">
                      <option value="low">Basse</option>
                      <option value="medium">Moyenne</option>
                      <option value="high">Haute</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Statut</label>
                    <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as any })} className="w-full px-3 py-2 bg-white/60 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-steel-blue/50 text-sm">
                      <option value="planned">Prevu</option>
                      <option value="done">Realise</option>
                      <option value="cancelled">Annule</option>
                      <option value="postponed">Reporte</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Commentaire</label>
                  <input value={form.comment} onChange={e => setForm({ ...form, comment: e.target.value })} className="w-full px-3 py-2 bg-white/60 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-steel-blue/50 text-sm" placeholder="Commentaire..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Notes complementaires</label>
                  <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={3} className="w-full px-3 py-2 bg-white/60 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-steel-blue/50 text-sm resize-none" placeholder="Notes..." />
                </div>
              </div>
              <div className="p-6 border-t border-slate-100 flex gap-2 justify-end">
                <button onClick={closeModal} className="btn-secondary">Annuler</button>
                <button onClick={saveEvent} className="btn-primary">{editingEvent ? 'Enregistrer' : 'Creer'}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}