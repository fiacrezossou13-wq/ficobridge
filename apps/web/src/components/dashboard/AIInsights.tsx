import { motion } from 'framer-motion'
import { Lightbulb, TrendingUp, Clock, AlertCircle } from 'lucide-react'

const insights = [
  {
    icon: TrendingUp,
    color: 'bg-tech-green/10 text-tech-green',
    title: 'Performance sectorielle',
    message: 'Vos candidatures dans le génie civil obtiennent un taux de réponse de 35%, supérieur à la moyenne de 22%.',
    priority: 'high',
  },
  {
    icon: Clock,
    color: 'bg-steel-blue/10 text-steel-blue',
    title: 'Timing optimal',
    message: "Les candidatures envoyées le mardi matin génèrent 2.3x plus d'entretiens. Privilégiez ce créneau.",
    priority: 'medium',
  },
  {
    icon: AlertCircle,
    color: 'bg-safety-orange/10 text-safety-orange',
    title: 'Relance recommandée',
    message: "3 candidatures sans réponse depuis +10 jours. Une relance J7-J10 augmente vos chances de 40%.",
    priority: 'high',
  },
  {
    icon: Lightbulb,
    color: 'bg-construction-yellow/10 text-yellow-400',
    title: 'Optimisation CV',
    message: "L'ajout de mots-clés BIM et Eurocodes augmenterait votre compatibilité ATS de 15%.",
    priority: 'medium',
  },
]

export default function AIInsights() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass-card p-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
          <Lightbulb size={20} className="text-white" />
        </div>
        <h3 className="text-lg font-semibold text-white">Insights IA</h3>
      </div>
      <div className="space-y-4">
        {insights.map((insight, i) => (
          <div key={i} className="flex gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10">
            <div className={`p-2 rounded-lg h-fit ${insight.color}`}>
              <insight.icon size={18} />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">{insight.title}</h4>
              <p className="text-sm text-slate-400 mt-1 leading-relaxed">{insight.message}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}