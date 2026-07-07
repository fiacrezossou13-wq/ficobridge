import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Briefcase, Plus, Search, Filter, Trash2, ChevronDown, ChevronUp, ExternalLink, Mail, Phone, MapPin, Calendar, Edit3, CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react'

interface Application {
  id: string
  company: string
  position: string
  city: string
  status: 'pending' | 'interview' | 'rejected' | 'accepted' | 'relance'
  date: string
  link?: string
  contactName?: string
  contactEmail?: string
  contactPhone?: string
  notes?: string
}

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  pending: { label: 'En attente', color: 'text-yellow-700', bg: 'bg-yellow-50 border-yellow-200', icon: Clock },
  interview: { label: 'Entretien', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200', icon: Calendar },
  rejected: { label: 'Refuse', color: 'text-red-700', bg: 'bg-red-50 border-red-200', icon: XCircle },
  accepted: { label: 'Accepte', color: 'text-green-700', bg: 'bg-green-50 border-green-200', icon: CheckCircle },
  relance: { label: 'A relancer', color: 'text-orange-700', bg: 'bg-orange-50 border-orange-200', icon: AlertCircle },
}

const initialApplications: Application[] = [
  { id: '1', company: 'Vinci Construction', position: "Apprenti Charge d'Affaires", city: 'Paris', status: 'interview', date: '2026-07-08', link: 'https://vinci.com', contactName: 'Marie Dupont', contactEmail: 'marie@vinci.com', notes: 'Entretien telephonique prevu a 10h' },
  { id: '2', company: 'Bouygues Construction', position: 'Apprenti Conducteur de Travaux', city: 'Lyon', status: 'pending', date: '2026-07-05', link: 'https://bouygues.com', notes: 'Candidature envoyee via leur site' },
  { id: '3', company: 'Eiffage', position: 'Apprenti Ingenieur Projet', city: 'Marseille', status: 'relance', date: '2026-06-28', notes: 'A relancer apres 10 jours' },
  { id: '4', company: 'Colas', position: 'Apprenti Technicien Methodes', city: 'Bordeaux', status: 'rejected', date: '2026-06-20' },
]

export default function Applications() {
  const [applications, setApplications] = useState<Application[]>(initialApplications)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const [form, setForm] = useState<Partial<Application>>({
    company: '', position: '', city: '', status: 'pending', date: new Date().toISOString().split('T')[0], link: '', contactName: '', contactEmail: '', contactPhone: '', notes: ''
  })

  const createApplication = () => {
    if (!form.company || !form.position) return
    const newApp: Application = {
      id: Date.now().toString(),
      company: form.company || '',
      position: form.position || '',
      city: form.city || '',
      status: (form.status as any) || 'pending',
      date: form.date || new Date().toISOString().split('T')[0],
      link: form.link,
      contactName: form.contactName,
      contactEmail: form.contactEmail,
      contactPhone: form.contactPhone,
      notes: form.notes,
    }
    setApplications(prev => [newApp, ...prev])
    closeModal()
  }

  const updateApplication = (id: string, updates: Partial<Application>) => {
    setApplications(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a))
  }

  const deleteApplication = (id: string) => {
    setApplications(prev => prev.filter(a => a.id !== id))
    if (expandedId === id) setExpandedId(null)
  }

  const openEdit = (app: Application) => {
    setForm(app)
    setEditingId(app.id)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingId(null)
    setForm({ company: '', position: '', city: '', status: 'pending', date: new Date().toISOString().split('T')[0], link: '', contactName: '', contactEmail: '', contactPhone: '', notes: '' })
  }

  const saveEdit = () => {
    if (!editingId || !form.company || !form.position) return
    updateApplication(editingId, form)
    closeModal()
  }

  const filtered = applications.filter(a => {
    const matchesSearch = (a.company + a.position + a.city).toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'ALL' || a.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    interview: applications.filter(a => a.status === 'interview').length,
    accepted: applications.filter(a => a.status === 'accepted').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Briefcase size={28} className="text-slate-700" />
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Candidatures</h1>
            <p className="text-slate-500 mt-1">{stats.total} candidature{stats.total > 1 ? 's' : ''} · {stats.interview} entretien{stats.interview > 1 ? 's' : ''} · {stats.accepted} acceptee{stats.accepted > 1 ? 's' : ''}</p>
          </div>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Nouvelle candidature
        </button>
      </motion.div>

      {/* Stats rapides */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'Total', value: stats.total, color: 'bg-slate-100 text-slate-700' },
          { label: 'En attente', value: stats.pending, color: 'bg-yellow-50 text-yellow-700' },
          { label: 'Entretien', value: stats.interview, color: 'bg-blue-50 text-blue-700' },
          { label: 'Accepte', value: stats.accepted, color: 'bg-green-50 text-green-700' },
          { label: 'Refuse', value: stats.rejected, color: 'bg-red-50 text-red-700' },
        ].map(s => (
          <div key={s.label} className={`glass-card p-3 text-center ${s.color}`}>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-xs font-medium opacity-70">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filtres */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher une entreprise, un poste..."
            className="w-full pl-9 pr-4 py-2.5 bg-white/60 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-steel-blue/50 text-sm"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['ALL', 'pending', 'interview', 'relance', 'accepted', 'rejected'].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                statusFilter === s ? 'bg-steel-blue text-white' : 'bg-white/50 text-slate-600 hover:bg-white border border-slate-200/50'
              }`}
            >
              {s === 'ALL' ? 'Tous' : statusConfig[s]?.label || s}
            </button>
          ))}
        </div>
      </div>

      {/* Liste */}
      <div className="space-y-3">
        <AnimatePresence>
          {filtered.map(app => {
            const cfg = statusConfig[app.status]
            const Icon = cfg.icon
            const isExpanded = expandedId === app.id
            return (
              <motion.div
                key={app.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-card overflow-hidden"
              >
                <div
                  className="flex items-center gap-4 p-4 cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : app.id)}
                >
                  <div className={`w-10 h-10 rounded-xl ${cfg.bg} flex items-center justify-center shrink-0`}>
                    <Icon size={18} className={cfg.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-slate-800 text-sm truncate">{app.position}</h4>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <Briefcase size={10} /> {app.company} · <MapPin size={10} /> {app.city}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-medium px-2 py-1 rounded-full ${cfg.bg} ${cfg.color}`}>
                      {cfg.label}
                    </span>
                    <span className="text-xs text-slate-400">{app.date}</span>
                    {isExpanded ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                  </div>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 pt-0 border-t border-slate-100">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <div className="space-y-2">
                            {app.link && (
                              <a href={app.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-steel-blue hover:underline">
                                <ExternalLink size={14} /> Offre en ligne
                              </a>
                            )}
                            {app.contactName && (
                              <p className="text-sm text-slate-600 flex items-center gap-2"><UserIcon size={14} /> {app.contactName}</p>
                            )}
                            {app.contactEmail && (
                              <a href={`mailto:${app.contactEmail}`} className="text-sm text-slate-600 flex items-center gap-2 hover:text-steel-blue">
                                <Mail size={14} /> {app.contactEmail}
                              </a>
                            )}
                            {app.contactPhone && (
                              <p className="text-sm text-slate-600 flex items-center gap-2"><Phone size={14} /> {app.contactPhone}</p>
                            )}
                          </div>
                          <div>
                            {app.notes && (
                              <div className="p-3 bg-slate-50 rounded-xl text-sm text-slate-600">
                                <p className="text-xs font-medium text-slate-500 mb-1">Notes</p>
                                {app.notes}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <button onClick={() => openEdit(app)} className="btn-secondary text-xs flex items-center gap-1">
                            <Edit3 size={12} /> Modifier
                          </button>
                          <button onClick={() => deleteApplication(app.id)} className="btn-secondary text-xs text-red-600 border-red-200 hover:bg-red-50 flex items-center gap-1">
                            <Trash2 size={12} /> Supprimer
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </AnimatePresence>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <Briefcase size={40} className="mx-auto mb-3 opacity-50" />
            <p>Aucune candidature trouvee</p>
            <button onClick={() => setShowModal(true)} className="btn-primary mt-3 text-sm">Ajouter une candidature</button>
          </div>
        )}
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
                  {editingId ? 'Modifier la candidature' : 'Nouvelle candidature'}
                </h3>
                <button onClick={closeModal} className="p-1 hover:bg-slate-100 rounded-lg"><XIcon size={18} className="text-slate-400" /></button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Entreprise *</label>
                    <input value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} className="w-full px-3 py-2 bg-white/60 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-steel-blue/50 text-sm" placeholder="Vinci..." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Poste *</label>
                    <input value={form.position} onChange={e => setForm({ ...form, position: e.target.value })} className="w-full px-3 py-2 bg-white/60 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-steel-blue/50 text-sm" placeholder="Apprenti..." />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Ville</label>
                    <input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} className="w-full px-3 py-2 bg-white/60 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-steel-blue/50 text-sm" placeholder="Paris..." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Statut</label>
                    <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as any })} className="w-full px-3 py-2 bg-white/60 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-steel-blue/50 text-sm">
                      <option value="pending">En attente</option>
                      <option value="interview">Entretien</option>
                      <option value="relance">A relancer</option>
                      <option value="accepted">Accepte</option>
                      <option value="rejected">Refuse</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Date de candidature</label>
                  <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="w-full px-3 py-2 bg-white/60 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-steel-blue/50 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Lien de l'offre</label>
                  <input value={form.link} onChange={e => setForm({ ...form, link: e.target.value })} className="w-full px-3 py-2 bg-white/60 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-steel-blue/50 text-sm" placeholder="https://..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Contact</label>
                    <input value={form.contactName} onChange={e => setForm({ ...form, contactName: e.target.value })} className="w-full px-3 py-2 bg-white/60 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-steel-blue/50 text-sm" placeholder="Nom..." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                    <input type="email" value={form.contactEmail} onChange={e => setForm({ ...form, contactEmail: e.target.value })} className="w-full px-3 py-2 bg-white/60 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-steel-blue/50 text-sm" placeholder="email@..." />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Telephone</label>
                  <input value={form.contactPhone} onChange={e => setForm({ ...form, contactPhone: e.target.value })} className="w-full px-3 py-2 bg-white/60 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-steel-blue/50 text-sm" placeholder="06..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
                  <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={3} className="w-full px-3 py-2 bg-white/60 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-steel-blue/50 text-sm resize-none" placeholder="Details supplementaires..." />
                </div>
              </div>
              <div className="p-6 border-t border-slate-100 flex gap-2 justify-end">
                <button onClick={closeModal} className="btn-secondary">Annuler</button>
                <button onClick={editingId ? saveEdit : createApplication} className="btn-primary">
                  {editingId ? 'Enregistrer' : 'Creer'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function UserIcon(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
}
function XIcon(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
}
