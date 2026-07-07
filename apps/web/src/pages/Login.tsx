import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Building2, Shield, Mail, Lock, KeyRound } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import api from '@/hooks/useApi'

export default function Login() {
  const [step, setStep] = useState<'credentials' | '2fa'>('credentials')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { setRequires2FA, setToken, setUser } = useAuthStore()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await api.post('/auth/login', { email, password })
      if (res.data.requires2FA) {
        setRequires2FA(email)
        setStep('2fa')
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  const handleVerify2FA = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await api.post('/auth/verify-2fa', { email, code })
      setToken(res.data.token)
      setUser(res.data.user)
      navigate('/')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Code invalide')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    try {
      await api.post('/auth/resend-2fa', { email })
      setError('Nouveau code envoyé')
    } catch (err: any) {
      setError(err.response?.data?.error)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-72 h-72 bg-steel-blue/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-sky-blue/20 rounded-full blur-3xl" />
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 glass-panel relative z-10"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-steel-blue to-sky-blue flex items-center justify-center shadow-xl mb-4">
            <Building2 size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">FicoBridge</h1>
          <p className="text-slate-400 mt-2">Sécurité bancaire · 2FA obligatoire</p>
        </div>

        {error && (
          <div className={`mb-4 p-3 rounded-lg text-sm ${error.includes('envoyé') ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
            {error}
          </div>
        )}

        {step === 'credentials' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-steel-blue/50 text-white placeholder-slate-500"
                  placeholder="fico@example.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-steel-blue/50 text-white placeholder-slate-500"
                  placeholder="••••••••"
                />
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full btn-primary py-3">
              {loading ? 'Connexion...' : 'Continuer'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify2FA} className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-steel-blue/10 rounded-lg text-sm text-steel-blue border border-steel-blue/20">
              <Shield size={16} />
              <span>Code envoyé à {email}</span>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Code à 6 chiffres</label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-steel-blue/50 text-center tracking-[0.5em] font-mono text-lg text-white"
                  placeholder="000000"
                />
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full btn-primary py-3">
              {loading ? 'Vérification...' : 'Vérifier'}
            </button>
            <button type="button" onClick={handleResend} className="w-full btn-secondary py-3 text-sm">
              Renvoyer le code
            </button>
          </form>
        )}

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
          <Shield size={14} />
          <span>Chiffrement AES-256 · Protection CSRF/XSS</span>
        </div>
      </motion.div>
    </div>
  )
}
