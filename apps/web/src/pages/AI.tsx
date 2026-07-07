import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Upload, FileText, Sparkles, TrendingUp, Target, Zap, MessageSquare, Send, Loader2, CheckCircle, AlertTriangle, Lightbulb, RotateCcw, Copy } from 'lucide-react'

interface AnalysisResult {
  score: number
  atsScore: number
  keywords: string[]
  missingKeywords: string[]
  suggestions: string[]
  strengths: string[]
  weaknesses: string[]
  sections: { name: string; score: number; feedback: string }[]
}

interface ChatMessage {
  role: 'user' | 'ai'
  text: string
  id: string
  liked?: boolean
}

const mockAnalysis: AnalysisResult = {
  score: 72,
  atsScore: 65,
  keywords: ['Genie Civil', 'BIM', 'AutoCAD', 'Revit', 'Gestion de projet', 'Eurocodes', 'BTP', 'Construction'],
  missingKeywords: ['Python', 'SQL', 'Lean Management', 'Agile', 'Certification ISO 9001', 'SketchUp', 'MS Project'],
  suggestions: [
    "Ajoutez une section Competences techniques avec les outils BIM (Revit, AutoCAD, Navisworks)",
    "Quantifiez vos realisations (ex: Gestion de 3 chantiers simultanes pour 2.5M EUR)",
    "Mentionnez les normes Eurocodes et DTU dans votre experience",
    "Ajoutez des certifications pertinentes (BIM, securite, CACES)",
    "Incluez des mots-cles ATS : maitrise d\'oeuvre, planning, budget, coordination",
  ],
  strengths: [
    "Structure claire et lisible avec des titres bien definis",
    "Formation solide en genie civil (BTS / Licence / Master)",
    "Mentions de logiciels pertinents pour le BTP",
    "Experience en alternance ou stage bien detaillee",
  ],
  weaknesses: [
    "Manque de chiffres et resultats quantifies (KPI, budgets, delais)",
    "Pas de section projets personnels ou realisations concretes",
    "Competences transversales sous-representees (communication, leadership)",
    "Pas de lien LinkedIn ou portfolio",
  ],
  sections: [
    { name: 'Mise en page', score: 85, feedback: "Clair et aere, mais police trop petite dans certaines sections" },
    { name: 'Contenu', score: 70, feedback: "Bonne experience, mais manque de quantification" },
    { name: 'Mots-cles', score: 60, feedback: "Keywords BTP presents, mais manque de mots ATS" },
    { name: 'Sections', score: 75, feedback: "Toutes les sections essentielles sont la" },
  ],
}

const quickQuestions = [
  "Comment optimiser mon CV pour le BTP ?",
  "Quelles questions en entretien d'alternance ?",
  "Comment relancer une candidature ?",
  "Quels salaires pour un apprenti genie civil ?",
]

export default function AI() {
  const [file, setFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: '0', role: 'ai', text: "Bonjour ! Je suis votre assistant IA FicoBridge. Je peux analyser votre CV, optimiser vos candidatures, ou repondre a vos questions sur la recherche d'alternance. Posez-moi une question ou importez votre CV !" }
  ])
  const [chatInput, setChatInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages, isTyping])

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const dropped = e.dataTransfer.files[0]
    if (dropped && (dropped.type === 'application/pdf' || dropped.name.endsWith('.pdf') || dropped.name.endsWith('.docx'))) {
      setFile(dropped)
      setResult(null)
    }
  }

  const handleAnalyze = () => {
    if (!file) return
    setIsAnalyzing(true)
    setResult(null)
    setTimeout(() => {
      setResult(mockAnalysis)
      setIsAnalyzing(false)
    }, 2500)
  }

  const generateResponse = (userText: string): string => {
    const lower = userText.toLowerCase()
    if (lower.includes('cv') || lower.includes('curriculum') || lower.includes('resume')) {
      return "Pour un CV BTP efficace : 1) Quantifiez tout (budgets, surfaces, equipes) 2) Mettez les logiciels en avant (AutoCAD, Revit, MS Project) 3) Mentionnez les normes (Eurocodes, DTU) 4) Gardez une page si possible, max 2 pages. Voulez-vous que je relise un passage specifique ?"
    }
    if (lower.includes('entretien') || lower.includes('interview')) {
      return "En entretien d'alternance BTP, preparez-vous avec la methode STAR. Questions classiques : 'Pourquoi cette entreprise ?', 'Decrivez un projet difficile', 'Comment gerez-vous la securite sur chantier ?'. Recherchez les projets recents de l'entreprise et posez des questions sur le tuteur et le planning de l'alternance."
    }
    if (lower.includes('relance') || lower.includes('suivi')) {
      return "Relance ideale : J+7 apres la candidature par email court et poli. J+14 par telephone si pas de reponse. Modele : 'Bonjour, je me permets de relancer ma candidature pour le poste d'apprenti X. Je reste tres motive et disponible pour un entretien.' Evitez les relances le lundi matin et le vendredi apres-midi."
    }
    if (lower.includes('salaire') || lower.includes('remuneration') || lower.includes('paye')) {
      return "Salaire apprenti genie civil 2026 : entre 800 et 1200 EUR net/mois selon l'annee d'alternance (1ere annee ~800-900, 3eme ~1100-1300). Les grands groupes (Vinci, Bouygues, Eiffage) sont souvent au-dessus du SMIC alternance. N'hesitez pas a negocier si vous avez de l'experience."
    }
    if (lower.includes('lettre') || lower.includes('motivation')) {
      return "Lettre de motivation efficace : 1) Accroche personnalisee avec un projet de l'entreprise 2) Paragraphe 'Pourquoi moi' avec 2 competences cles 3) Paragraphe 'Pourquoi vous' montrant que vous connaissez l'entreprise 4) Appel a l'action. Max 250 mots. Evitez les modeles generiques !"
    }
    if (lower.includes('bonjour') || lower.includes('salut') || lower.includes('hey')) {
      return "Bonjour ! Je suis la pour vous aider. Voici ce que je peux faire : analyser votre CV, optimiser vos candidatures, preparer vos entretiens, ou repondre a vos questions sur le BTP et l'alternance. Qu'est-ce qui vous interesse ?"
    }
    return "Je comprends. Pour vous aider au mieux, pourriez-vous preciser si vous parlez de votre CV, d'un entretien, d'une candidature specifique, ou d'un sujet sur l'alternance en genie civil ? Je peux aussi analyser votre CV si vous l'importez dans l'onglet de gauche."
  }

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatInput.trim()) return
    const userMsg = chatInput.trim()
    const userId = Date.now().toString()
    setChatMessages(prev => [...prev, { id: userId, role: 'user', text: userMsg }])
    setChatInput('')
    setIsTyping(true)

    setTimeout(() => {
      const response = generateResponse(userMsg)
      setChatMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'ai', text: response }])
      setIsTyping(false)
    }, 800 + Math.random() * 600)
  }

  const handleQuickQuestion = (q: string) => {
    setChatInput(q)
    setTimeout(() => {
      const fakeEvent = { preventDefault: () => {} } as React.FormEvent
      handleChatSubmit(fakeEvent)
    }, 10)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-500'
    if (score >= 60) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <Brain size={32} className="text-purple-500" />
            Assistant IA
          </h1>
          <p className="text-caption mt-1">Analysez votre CV, optimisez vos candidatures, obtenez des conseils personnalises</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Analyse CV */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <FileText size={20} className="text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800">Analyse de CV</h3>
          </div>

          {!result ? (
            <div
              onDragOver={e => e.preventDefault()}
              onDrop={handleFileDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                file ? 'border-purple-400 bg-purple-50/50' : 'border-slate-300 hover:border-purple-400 hover:bg-purple-50/30'
              }`}
            >
              <input ref={fileInputRef} type="file" accept=".pdf,.docx" className="hidden" onChange={e => { e.target.files?.[0] && setFile(e.target.files[0]); setResult(null) }} />
              <Upload size={40} className={`mx-auto mb-3 ${file ? 'text-purple-500' : 'text-slate-400'}`} />
              <p className="font-medium text-slate-700 text-sm">
                {file ? file.name : "Glissez votre CV ou cliquez pour parcourir"}
              </p>
              <p className="text-xs text-slate-400 mt-1">PDF ou DOCX, max 5 Mo</p>
              {file && (
                <button
                  onClick={e => { e.stopPropagation(); handleAnalyze(); }}
                  disabled={isAnalyzing}
                  className="mt-4 btn-primary flex items-center gap-2 mx-auto"
                >
                  {isAnalyzing ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                  {isAnalyzing ? 'Analyse en cours...' : 'Analyser mon CV'}
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-5">
              <div className="flex items-center justify-center gap-8">
                <div className="text-center">
                  <div className="relative w-24 h-24 mx-auto">
                    <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="42" stroke="#E2E8F0" strokeWidth="8" fill="none" />
                      <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="8" fill="none"
                        strokeDasharray={`${result.score * 2.64} 264`}
                        className={`${getScoreColor(result.score)} transition-all duration-1000`} />
                    </svg>
                    <span className={`absolute inset-0 flex items-center justify-center text-2xl font-bold ${getScoreColor(result.score)}`}>
                      {result.score}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-slate-600 mt-2">Score global</p>
                </div>
                <div className="text-center">
                  <div className="relative w-24 h-24 mx-auto">
                    <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="42" stroke="#E2E8F0" strokeWidth="8" fill="none" />
                      <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="8" fill="none"
                        strokeDasharray={`${result.atsScore * 2.64} 264`}
                        className={`${getScoreColor(result.atsScore)} transition-all duration-1000`} />
                    </svg>
                    <span className={`absolute inset-0 flex items-center justify-center text-2xl font-bold ${getScoreColor(result.atsScore)}`}>
                      {result.atsScore}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-slate-600 mt-2">Score ATS</p>
                </div>
              </div>

              {/* Sections detaillees */}
              <div className="space-y-2">
                {result.sections.map(sec => (
                  <div key={sec.name} className="flex items-center gap-3">
                    <span className="text-xs font-medium text-slate-600 w-24 shrink-0">{sec.name}</span>
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${sec.score}%` }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className={`h-full rounded-full ${getScoreBg(sec.score)}`}
                      />
                    </div>
                    <span className="text-xs font-bold text-slate-700 w-8 text-right">{sec.score}</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-green-50 border border-green-200">
                  <h4 className="text-sm font-semibold text-green-800 flex items-center gap-2 mb-2">
                    <CheckCircle size={14} /> Forces
                  </h4>
                  <ul className="space-y-1">
                    {result.strengths.map((s, i) => (
                      <li key={i} className="text-xs text-green-700 flex items-start gap-1.5">
                        <span className="mt-1 w-1 h-1 rounded-full bg-green-500 shrink-0" />{s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-3 rounded-xl bg-red-50 border border-red-200">
                  <h4 className="text-sm font-semibold text-red-800 flex items-center gap-2 mb-2">
                    <AlertTriangle size={14} /> Points a ameliorer
                  </h4>
                  <ul className="space-y-1">
                    {result.weaknesses.map((w, i) => (
                      <li key={i} className="text-xs text-red-700 flex items-start gap-1.5">
                        <span className="mt-1 w-1 h-1 rounded-full bg-red-500 shrink-0" />{w}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200">
                <h4 className="text-sm font-semibold text-blue-800 flex items-center gap-2 mb-2">
                  <Lightbulb size={14} /> Suggestions d'optimisation
                </h4>
                <ul className="space-y-1.5">
                  {result.suggestions.map((s, i) => (
                    <li key={i} className="text-xs text-blue-700 flex items-start gap-1.5">
                      <span className="mt-0.5 w-4 h-4 rounded-full bg-blue-500 text-white text-[10px] flex items-center justify-center shrink-0">{i + 1}</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-2 flex-wrap">
                <div className="text-xs flex-1">
                  <span className="font-medium text-slate-600">Mots-cles trouves :</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {result.keywords.map((k, i) => (
                      <span key={i} className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-[10px] font-medium">{k}</span>
                    ))}
                  </div>
                </div>
                <div className="text-xs flex-1">
                  <span className="font-medium text-slate-600">Mots-cles manquants :</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {result.missingKeywords.map((k, i) => (
                      <span key={i} className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-[10px] font-medium">{k}</span>
                    ))}
                  </div>
                </div>
              </div>

              <button onClick={() => { setResult(null); setFile(null); }} className="w-full btn-secondary text-sm flex items-center justify-center gap-2">
                <RotateCcw size={14} /> Analyser un autre CV
              </button>
            </div>
          )}
        </motion.div>

        {/* Chat IA */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="glass-card p-6 flex flex-col h-[650px]">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
              <MessageSquare size={20} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-800">Chat IA</h3>
              <p className="text-xs text-slate-500">Conseils personnalises 24/7</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2 custom-scrollbar">
            {chatMessages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm relative group ${
                  msg.role === 'user'
                    ? 'bg-steel-blue text-white rounded-br-md'
                    : 'bg-white/80 text-slate-700 rounded-bl-md border border-slate-200/50'
                }`}>
                  {msg.text}
                  {msg.role === 'ai' && (
                    <button
                      onClick={() => copyToClipboard(msg.text)}
                      className="absolute -right-8 top-1 p-1 opacity-0 group-hover:opacity-100 hover:bg-slate-100 rounded transition-all"
                      title="Copier"
                    >
                      <Copy size={12} className="text-slate-400" />
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white/80 border border-slate-200/50 rounded-2xl rounded-bl-md p-3 flex items-center gap-1">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick questions */}
          <div className="flex gap-2 flex-wrap mb-3">
            {quickQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => handleQuickQuestion(q)}
                className="px-2.5 py-1 bg-purple-50 text-purple-700 rounded-lg text-[11px] font-medium hover:bg-purple-100 transition-colors border border-purple-100"
              >
                {q}
              </button>
            ))}
          </div>

          <form onSubmit={handleChatSubmit} className="flex gap-2">
            <input
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              placeholder="Posez votre question sur le recrutement..."
              className="flex-1 px-4 py-2.5 bg-white/80 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm"
            />
            <button type="submit" disabled={!chatInput.trim() || isTyping} className="p-2.5 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors disabled:opacity-50">
              <Send size={18} />
            </button>
          </form>
        </motion.div>
      </div>

      {/* Quick Tips */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: Target, title: 'Ciblage', desc: 'Concentrez-vous sur 10 entreprises max par semaine avec des candidatures personnalisees.', color: 'bg-blue-500' },
          { icon: Zap, title: 'Timing', desc: 'Envoyez vos candidatures le mardi ou mercredi matin pour un meilleur taux de reponse.', color: 'bg-yellow-500' },
          { icon: TrendingUp, title: 'Suivi', desc: 'Relancez systematiquement J+7 et J+14. 40% des recruteurs repondent a la relance.', color: 'bg-green-500' },
        ].map((tip, i) => (
          <div key={i} className="glass-card p-5 hover:shadow-lg transition-all card-hover">
            <div className={`w-10 h-10 rounded-xl ${tip.color} flex items-center justify-center text-white mb-3`}>
              <tip.icon size={20} />
            </div>
            <h4 className="font-semibold text-slate-800 mb-1">{tip.title}</h4>
            <p className="text-sm text-slate-500">{tip.desc}</p>
          </div>
        ))}
      </motion.div>
    </div>
  )
}
