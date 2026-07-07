import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Lock, Smartphone, Key, History, Monitor, Eye, EyeOff, Trash2, CheckCircle, AlertTriangle } from 'lucide-react'

interface Session {
  id: string
  device: string
  location: string
  ip: string
  lastActive: string
  current: boolean
}

interface SecurityLog {
  id: string
  action: string
  date: string
  ip: string
  status: 'success' | 'warning' | 'danger'
}

const mockSessions: Session[] = [
  { id: '1', device: 'Chrome - Windows 11', location: 'Paris, France', ip: '192.168.1.45', lastActive: 'Actuellement', current: true },
  { id: '2', device: 'Safari - iPhone 15', location: 'Lyon, France', ip: '172.16.0.12', lastActive: 'Il y a 2 heures', current: false },
]

const mockLogs: SecurityLog[] = [
  { id: '1', action: 'Connexion reussie', date: '2026-07-07 01:15', ip: '192.168.1.45', status: 'success' },
  { id: '2', action: 'Mot de passe modifie', date: '2026-07-06 18:30', ip: '192.168.1.45', status: 'success' },
  { id: '3', action: 'Tentative de connexion echouee', date: '2026-07-06 14:22', ip: '10.0.0.55', status: 'danger' },
  { id: '4', action: '2FA active', date: '2026-07-05 09:00', ip: '192.168.1.45', status: 'success' },
]

export default function Security() {
  const [activeTab, setActiveTab] = useState<'password' | '2fa' | 'sessions' | 'logs'>('password')
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [sessions, setSessions] = useState<Session[]>(mockSessions)
  const [twoFAEnabled, setTwoFAEnabled] = useState(false)
  const [setupStep, setSetupStep] = useState<0 | 1 | 2>(0)
  const [code, setCode] = useState('')

  const terminateSession = (id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id))
  }

  const tabs = [
    { id: 'password' as const, label: 'Mot de passe', icon: Lock },
    { id: '2fa' as const, label: '2FA', icon: Smartphone },
    { id: 'sessions' as const, label: 'Sessions', icon: Monitor },
    { id: 'logs' as const, label: 'Journal', icon: History },
  ]

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
        <Shield size={28} className="text-slate-700" />
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Securite</h1>
          <p className="text-slate-500 mt-1">Parametres de securite et confidentialite</p>
        </div>
      </motion.div>

      <div className="flex gap-2 border-b border-slate-200/50 pb-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-white text-steel-blue border-b-2 border-steel-blue shadow-sm'
                : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'password' && (
          <motion.div
            key="password"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass-card p-6 max-w-xl"
          >
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Lock size={18} /> Modifier le mot de passe
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Mot de passe actuel</label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} className="w-full px-4 py-2.5 bg-white/60 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-steel-blue/50 text-sm pr-10" placeholder="••••••••" />
                  <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nouveau mot de passe</label>
                <div className="relative">
                  <input type={showNewPassword ? 'text' : 'password'} className="w-full px-4 py-2.5 bg-white/60 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-steel-blue/50 text-sm pr-10" placeholder="Min. 8 caracteres" />
                  <button onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Confirmer le nouveau mot de passe</label>
                <input type="password" className="w-full px-4 py-2.5 bg-white/60 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-steel-blue/50 text-sm" placeholder="••••••••" />
              </div>
              <button className="btn-primary mt-2">Mettre a jour le mot de passe</button>
            </div>
          </motion.div>
        )}

        {activeTab === '2fa' && (
          <motion.div
            key="2fa"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass-card p-6 max-w-xl"
          >
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Smartphone size={18} /> Authentification a deux facteurs
            </h3>

            {!twoFAEnabled && setupStep === 0 && (
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <p className="text-sm text-blue-800">Le 2FA ajoute une couche de securite supplementaire. Apres activation, un code sera demande a chaque connexion.</p>
                </div>
                <button onClick={() => setSetupStep(1)} className="btn-primary flex items-center gap-2">
                  <Key size={16} /> Activer le 2FA
                </button>
              </div>
            )}

            {setupStep === 1 && (
              <div className="space-y-4">
                <p className="text-sm text-slate-600">Scannez ce QR code avec votre application d'authentification (Google Authenticator, Authy...)</p>
                <div className="w-48 h-48 bg-white border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center mx-auto">
                  <div className="text-center">
                    <div className="w-32 h-32 bg-slate-800 rounded-lg mx-auto mb-2 flex items-center justify-center">
                      <div className="grid grid-cols-5 gap-1 p-2">
                        {Array.from({ length: 25 }).map((_, i) => (
                          <div key={i} className={`w-4 h-4 rounded-sm ${Math.random() > 0.5 ? 'bg-white' : 'bg-slate-800'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 font-mono">XXXX-XXXX-XXXX</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setSetupStep(0)} className="btn-secondary flex-1">Annuler</button>
                  <button onClick={() => setSetupStep(2)} className="btn-primary flex-1">Suivant</button>
                </div>
              </div>
            )}

            {setupStep === 2 && (
              <div className="space-y-4">
                <p className="text-sm text-slate-600">Entrez le code a 6 chiffres genere par votre application</p>
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full px-4 py-3 bg-white/60 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-steel-blue/50 text-center text-2xl font-mono tracking-widest"
                  placeholder="000000"
                  maxLength={6}
                />
                <div className="flex gap-2">
                  <button onClick={() => setSetupStep(1)} className="btn-secondary flex-1">Retour</button>
                  <button
                    onClick={() => { if (code.length === 6) { setTwoFAEnabled(true); setSetupStep(0); setCode('') } }}
                    className="btn-primary flex-1"
                    disabled={code.length !== 6}
                  >
                    Verifier
                  </button>
                </div>
              </div>
            )}

            {twoFAEnabled && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
                  <CheckCircle size={20} className="text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-green-800">2FA active</p>
                    <p className="text-xs text-green-600">Votre compte est protege par un code a 6 chiffres.</p>
                  </div>
                </div>
                <button onClick={() => setTwoFAEnabled(false)} className="btn-secondary text-red-600 border-red-200 hover:bg-red-50">
                  Desactiver le 2FA
                </button>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'sessions' && (
          <motion.div
            key="sessions"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass-card p-6"
          >
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Monitor size={18} /> Sessions actives
            </h3>
            <div className="space-y-3">
              {sessions.map(session => (
                <div key={session.id} className={`flex items-center justify-between p-4 rounded-xl border ${session.current ? 'bg-steel-blue/5 border-steel-blue/20' : 'bg-white/40 border-slate-200/50'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${session.current ? 'bg-green-500' : 'bg-slate-400'}`} />
                    <div>
                      <p className="text-sm font-medium text-slate-800">{session.device}</p>
                      <p className="text-xs text-slate-500">{session.location} · {session.ip} · {session.lastActive}</p>
                    </div>
                  </div>
                  {!session.current && (
                    <button onClick={() => terminateSession(session.id)} className="p-2 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  )}
                  {session.current && <span className="text-xs font-medium text-steel-blue px-2 py-1 bg-steel-blue/10 rounded-full">Actuelle</span>}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'logs' && (
          <motion.div
            key="logs"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass-card p-6"
          >
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <History size={18} /> Journal de securite
            </h3>
            <div className="space-y-2">
              {mockLogs.map(log => (
                <div key={log.id} className="flex items-center gap-3 p-3 rounded-lg bg-white/40 border border-slate-200/50">
                  {log.status === 'success' && <CheckCircle size={16} className="text-green-500 shrink-0" />}
                  {log.status === 'warning' && <AlertTriangle size={16} className="text-yellow-500 shrink-0" />}
                  {log.status === 'danger' && <AlertTriangle size={16} className="text-red-500 shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-700">{log.action}</p>
                    <p className="text-xs text-slate-400">{log.date} · IP: {log.ip}</p>
                  </div>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                    log.status === 'success' ? 'bg-green-100 text-green-700' :
                    log.status === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {log.status === 'success' ? 'Succes' : log.status === 'warning' ? 'Avertissement' : 'Danger'}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
