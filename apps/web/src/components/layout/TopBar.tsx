import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Bell, X, Command, User, Briefcase, FileText, Calendar, Shield } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

interface SearchResult {
  id: string
  title: string
  type: 'page' | 'application' | 'document' | 'notification'
  path?: string
  icon: any
}

const searchIndex: SearchResult[] = [
  { id: '1', title: 'Tableau de bord', type: 'page', path: '/', icon: Command },
  { id: '2', title: 'Candidatures', type: 'page', path: '/applications', icon: Briefcase },
  { id: '3', title: 'Calendrier', type: 'page', path: '/calendar', icon: Calendar },
  { id: '4', title: 'Assistant IA', type: 'page', path: '/ai', icon: Command },
  { id: '5', title: 'Documents', type: 'page', path: '/documents', icon: FileText },
  { id: '6', title: 'Notifications', type: 'page', path: '/notifications', icon: Bell },
  { id: '7', title: 'Securite', type: 'page', path: '/security', icon: Shield },
  { id: '8', title: 'Profil', type: 'page', path: '/profile', icon: User },
]

export default function TopBar() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const location = useLocation()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setSearchOpen(true)
      }
      if (e.key === 'Escape') setSearchOpen(false)
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus()
  }, [searchOpen])

  useEffect(() => {
    if (query.trim() === '') {
      setResults([])
      return
    }
    const q = query.toLowerCase()
    const filtered = searchIndex.filter(item => item.title.toLowerCase().includes(q))
    setResults(filtered)
    setSelectedIndex(0)
  }, [query])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(i => (i + 1) % results.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(i => (i - 1 + results.length) % results.length)
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      window.location.href = results[selectedIndex].path || '#'
      setSearchOpen(false)
      setQuery('')
    }
  }

  const pageTitles: Record<string, string> = {
    '/': 'Tableau de bord',
    '/applications': 'Candidatures',
    '/calendar': 'Calendrier',
    '/ai': 'Assistant IA',
    '/documents': 'Documents',
    '/notifications': 'Notifications',
    '/security': 'Securite',
    '/profile': 'Profil',
  }

  return (
    <>
      <header className="h-16 glass-card border-b border-slate-200/50 flex items-center justify-between px-6 sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-slate-800">{pageTitles[location.pathname] || 'FicoBridge'}</h2>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-white/50 border border-slate-200/50 rounded-lg text-sm text-slate-500 hover:bg-white hover:border-slate-300 transition-all"
          >
            <Search size={14} />
            <span className="hidden sm:inline">Rechercher...</span>
            <kbd className="hidden md:inline-flex items-center gap-1 px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-[10px] font-mono text-slate-500">
              Ctrl K
            </kbd>
          </button>

          <Link to="/notifications" className="relative p-2 hover:bg-white/50 rounded-lg transition-colors">
            <Bell size={20} className="text-slate-600" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </Link>

          <Link to="/profile" className="flex items-center gap-2 p-1.5 hover:bg-white/50 rounded-lg transition-colors">
            <div className="w-8 h-8 rounded-full bg-steel-blue text-white flex items-center justify-center text-sm font-bold">
              Z
            </div>
          </Link>
        </div>
      </header>

      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-start justify-center pt-[15vh]"
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
            >
              <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100">
                <Search size={18} className="text-slate-400" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Rechercher une page, une candidature..."
                  className="flex-1 bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400"
                />
                <button onClick={() => setSearchOpen(false)} className="p-1 hover:bg-slate-100 rounded">
                  <X size={16} className="text-slate-400" />
                </button>
              </div>

              <div className="max-h-80 overflow-y-auto py-2">
                {results.length === 0 && query.trim() !== '' && (
                  <div className="px-4 py-8 text-center text-sm text-slate-400">Aucun resultat pour "{query}"</div>
                )}
                {results.length === 0 && query.trim() === '' && (
                  <div className="px-4 py-8 text-center text-sm text-slate-400">Commencez a taper pour rechercher...</div>
                )}
                {results.map((res, idx) => {
                  const Icon = res.icon
                  return (
                    <Link
                      key={res.id}
                      to={res.path || '#'}
                      onClick={() => { setSearchOpen(false); setQuery('') }}
                      className={`flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg text-sm transition-colors ${
                        idx === selectedIndex ? 'bg-steel-blue/10 text-steel-blue' : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <Icon size={16} className="shrink-0" />
                      <span className="flex-1">{res.title}</span>
                      <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">{res.type}</span>
                    </Link>
                  )
                })}
              </div>

              <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center gap-4 text-[10px] text-slate-400">
                <span className="flex items-center gap-1"><kbd className="px-1 bg-white border rounded">↑↓</kbd> Naviguer</span>
                <span className="flex items-center gap-1"><kbd className="px-1 bg-white border rounded">Entree</kbd> Ouvrir</span>
                <span className="flex items-center gap-1"><kbd className="px-1 bg-white border rounded">Esc</kbd> Fermer</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
