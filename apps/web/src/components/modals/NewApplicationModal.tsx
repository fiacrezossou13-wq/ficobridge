import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, Building2, MapPin, Briefcase, Calendar, Link2, FileText,
  User, Mail, Phone, Send, Sparkles, CheckCircle2
} from 'lucide-react'

interface NewApplicationModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
}

const statusOptions = [
  { value: 'SENT', label: 'Envoyee', color: 'bg-blue-100 text-blue-800 border-blue-300', ringColor: 'ring-blue-500' },
  { value: 'FOLLOWUP', label: 'Relance', color: 'bg-orange-100 text-orange-800 border-orange-300', ringColor: 'ring-orange-500' },
  { value: 'INTERVIEW', label: 'Entretien', color: 'bg-purple-100 text-purple-800 border-purple-300', ringColor: 'ring-purple-500' },
  { value: 'OFFER', label: 'Offre', color: 'bg-green-100 text-green-800 border-green-300', ringColor: 'ring-green-500' },
  { value: 'ACCEPTED', label: 'Acceptee', color: 'bg-emerald-100 text-emerald-800 border-emerald-300', ringColor: 'ring-emerald-500' },
  { value: 'REJECTED', label: 'Refusee', color: 'bg-red-100 text-red-800 border-red-300', ringColor: 'ring-red-500' },
]

export default function NewApplicationModal({ isOpen, onClose, onSubmit }: NewApplicationModalProps) {
  const [form, setForm] = useState({
    company: '',
    position: '',
    city: '',
    status: 'SENT',
    date: new Date().toISOString().split('T')[0],
    url: '',
    notes: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ ...form, id: Date.now().toString(), color: 'bg-steel-blue' })
    setForm({
      company: '', position: '', city: '', status: 'SENT',
      date: new Date().toISOString().split('T')[0],
      url: '', notes: '', contactName: '', contactEmail: '', contactPhone: '',
    })
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-card shadow-2xl rounded-2xl"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-slate-200/50 bg-white/80 backdrop-blur-xl rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gradient-to-br from-steel-blue to-purple-500 rounded-xl text-white shadow-lg">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Nouvelle candidature</h2>
                  <p className="text-sm text-slate-500">Renseignez les informations de votre candidature</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2.5 hover:bg-slate-100 rounded-xl transition-all hover:rotate-90 duration-300">
                <X size={20} className="text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Entreprise + Poste */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <Building2 size={15} className="text-steel-blue" /> Entreprise <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Building2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      required
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 bg-white/60 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-steel-blue focus:ring-2 focus:ring-steel-blue/20 transition-all text-sm"
                      placeholder="Ex: Bouygues Construction"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <Briefcase size={15} className="text-steel-blue" /> Poste <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Briefcase size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      required
                      value={form.position}
                      onChange={(e) => setForm({ ...form, position: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 bg-white/60 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-steel-blue focus:ring-2 focus:ring-steel-blue/20 transition-all text-sm"
                      placeholder="Ex: Apprenti Ingenieur"
                    />
                  </div>
                </div>
              </div>

              {/* Ville + Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <MapPin size={15} className="text-steel-blue" /> Ville
                  </label>
                  <div className="relative">
                    <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 bg-white/60 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-steel-blue focus:ring-2 focus:ring-steel-blue/20 transition-all text-sm"
                      placeholder="Ex: Paris"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <Calendar size={15} className="text-steel-blue" /> Date de candidature
                  </label>
                  <div className="relative">
                    <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="date"
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 bg-white/60 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-steel-blue focus:ring-2 focus:ring-steel-blue/20 transition-all text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Statut - Boutons segmentes */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-steel-blue" /> Statut
                </label>
                <div className="flex flex-wrap gap-2">
                  {statusOptions.map((s) => {
                    const isSelected = form.status === s.value
                    return (
                      <button
                        key={s.value}
                        type="button"
                        onClick={() => setForm({ ...form, status: s.value })}
                        className={`px-3.5 py-2 rounded-xl text-xs font-semibold border-2 transition-all duration-200 ${
                          isSelected
                            ? `${s.color} ${s.ringColor} ring-2 ring-offset-1 shadow-md`
                            : 'bg-white/50 border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-white'
                        }`}
                      >
                        {s.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Lien */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Link2 size={15} className="text-steel-blue" /> Lien de l offre
                </label>
                <div className="relative">
                  <Link2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="url"
                    value={form.url}
                    onChange={(e) => setForm({ ...form, url: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-white/60 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-steel-blue focus:ring-2 focus:ring-steel-blue/20 transition-all text-sm"
                    placeholder="https://..."
                  />
                </div>
              </div>

              {/* Contact */}
              <div className="border-t border-slate-200/50 pt-4">
                <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                  <User size={15} className="text-steel-blue" /> Contact (optionnel)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative">
                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      value={form.contactName}
                      onChange={(e) => setForm({ ...form, contactName: e.target.value })}
                      className="w-full pl-10 pr-3 py-2.5 bg-white/60 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-steel-blue focus:ring-2 focus:ring-steel-blue/20 transition-all text-sm"
                      placeholder="Nom"
                    />
                  </div>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      value={form.contactEmail}
                      onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                      className="w-full pl-10 pr-3 py-2.5 bg-white/60 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-steel-blue focus:ring-2 focus:ring-steel-blue/20 transition-all text-sm"
                      placeholder="Email"
                    />
                  </div>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      value={form.contactPhone}
                      onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
                      className="w-full pl-10 pr-3 py-2.5 bg-white/60 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-steel-blue focus:ring-2 focus:ring-steel-blue/20 transition-all text-sm"
                      placeholder="Telephone"
                    />
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <FileText size={15} className="text-steel-blue" /> Notes
                </label>
                <div className="relative">
                  <FileText size={16} className="absolute left-3.5 top-3 text-slate-400" />
                  <textarea
                    rows={3}
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-white/60 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-steel-blue focus:ring-2 focus:ring-steel-blue/20 transition-all text-sm resize-none"
                    placeholder="Details sur la candidature, mots-cles de l offre, etc."
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="flex gap-3 pt-4 border-t border-slate-200/50">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 hover:border-slate-300 transition-all"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-steel-blue to-purple-500 text-white font-semibold text-sm shadow-lg shadow-steel-blue/25 hover:shadow-xl hover:shadow-steel-blue/30 transition-all flex items-center justify-center gap-2"
                >
                  <Send size={16} />
                  Enregistrer la candidature
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

