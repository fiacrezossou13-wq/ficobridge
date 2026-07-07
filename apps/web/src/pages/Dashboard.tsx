import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Plus, Briefcase, Calendar, FileText, Brain, TrendingUp, Clock,
  Target, Zap, ArrowRight, Users, CheckCircle, XCircle, Clock3,
  Mail, Phone, MapPin, Building2, Star, Activity, BarChart3,
  PieChart as PieIcon, TrendingDown, ArrowUpRight, ArrowDownRight,
  Filter, Download, RefreshCw, ChevronRight
} from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Legend, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, Radar
} from 'recharts'

// ==================== DATA MOCK ====================

const weeklyData = [
  { day: 'Lun', candidatures: 3, entretiens: 0, relances: 1 },
  { day: 'Mar', candidatures: 5, entretiens: 1, relances: 2 },
  { day: 'Mer', candidatures: 2, entretiens: 2, relances: 0 },
  { day: 'Jeu', candidatures: 4, entretiens: 0, relances: 3 },
  { day: 'Ven', candidatures: 6, entretiens: 1, relances: 1 },
  { day: 'Sam', candidatures: 1, entretiens: 0, relances: 2 },
  { day: 'Dim', candidatures: 0, entretiens: 0, relances: 0 },
]

const statusData = [
  { name: 'Candidature envoyee', value: 12, color: '#3B82F6' },
  { name: 'En etude', value: 5, color: '#F59E0B' },
  { name: 'Entretien planifie', value: 3, color: '#8B5CF6' },
  { name: 'Offre recue', value: 1, color: '#10B981' },
  { name: 'Refuse', value: 2, color: '#EF4444' },
  { name: 'Retire', value: 1, color: '#6B7280' },
]

const monthlyTrend = [
  { month: 'Jan', candidatures: 8, reponses: 2 },
  { month: 'Fev', candidatures: 12, reponses: 3 },
  { month: 'Mar', candidatures: 15, reponses: 5 },
  { month: 'Avr', candidatures: 10, reponses: 2 },
  { month: 'Mai', candidatures: 18, reponses: 6 },
  { month: 'Juin', candidatures: 14, reponses: 4 },
  { month: 'Juil', candidatures: 12, reponses: 5 },
]

const skillsRadar = [
  { skill: 'CV', score: 72, fullMark: 100 },
  { skill: 'Lettre de motivation', score: 65, fullMark: 100 },
  { skill: 'LinkedIn', score: 80, fullMark: 100 },
  { skill: 'Entretien', score: 55, fullMark: 100 },
  { skill: 'Relance', score: 70, fullMark: 100 },
  { skill: 'Recherche', score: 85, fullMark: 100 },
]

const upcomingEvents = [
  { id: 1, title: 'Entretien technique', company: 'Bouygues Construction', date: '08 Juillet', time: '10:00', type: 'interview', location: 'Lyon, Tour Part-Dieu' },
  { id: 2, title: 'Relance candidature', company: 'Eiffage Energie', date: '10 Juillet', time: '09:00', type: 'followup' },
  { id: 3, title: 'Date limite depot', company: 'Vinci Immobilier', date: '12 Juillet', time: '23:59', type: 'deadline' },
  { id: 4, title: 'Appel RH', company: 'Spie Batignolles', date: '15 Juillet', time: '14:30', type: 'interview', location: 'Paris, La Defense' },
]

const recentActivity = [
  { text: 'Candidature envoyee chez Vinci Construction', date: 'Il y a 2 heures', type: 'success', icon: Briefcase },
  { text: 'Entretien confirme avec Bouygues', date: 'Il y a 5 heures', type: 'info', icon: Calendar },
  { text: 'Relance envoyee a Eiffage', date: 'Hier', type: 'warning', icon: Zap },
  { text: 'CV analyse par l IA - Score: 72/100', date: 'Il y a 2 jours', type: 'purple', icon: Brain },
  { text: 'Nouvelle offre similaire a Lyon', date: 'Il y a 3 jours', type: 'info', icon: Star },
]

// ==================== COMPONENTS ====================

const KPICard = ({ title, value, subtitle, icon: Icon, color, trend, trendUp }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="glass-card p-5 hover:shadow-xl transition-all duration-300 group cursor-pointer relative overflow-hidden"
  >
    <div className={`absolute top-0 right-0 w-24 h-24 opacity-5 rounded-full -translate-y-8 translate-x-8 ${color.replace('bg-', 'bg-')}`} />
    <div className="flex items-start justify-between relative z-10">
      <div className="flex-1">
        <p className="text-sm text-slate-500 font-medium">{title}</p>
        <p className="text-3xl font-bold text-slate-800 mt-1">{value}</p>
        <div className="flex items-center gap-2 mt-2">
          {trend && (
            <span className={`flex items-center gap-0.5 text-xs font-semibold ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
              {trendUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
              {trend}
            </span>
          )}
          <span className="text-xs text-slate-400">{subtitle}</span>
        </div>
      </div>
      <div className={`p-3 rounded-xl ${color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
        <Icon size={22} />
      </div>
    </div>
  </motion.div>
)

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-sm border border-slate-200 rounded-xl p-3 shadow-xl">
        <p className="text-sm font-semibold text-slate-700 mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-xs flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-slate-600">{entry.name}:</span>
            <span className="font-semibold text-slate-800">{entry.value}</span>
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [timeRange, setTimeRange] = useState('7j')

  const stats = {
    total: 24,
    pending: 8,
    interview: 4,
    accepted: 2,
    rejected: 3,
    responseRate: 42,
    weeklyGoal: 10,
    weeklyCurrent: 7,
  }

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Tableau de bord</h1>
          <p className="text-slate-500 mt-1">Vue d ensemble de votre recherche d alternance</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-white/60 rounded-xl p-1 border border-slate-200/50">
            {['7j', '30j', '3m', '1a'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  timeRange === range
                    ? 'bg-steel-blue text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {range === '7j' ? '7 jours' : range === '30j' ? '30 jours' : range === '3m' ? '3 mois' : '1 an'}
              </button>
            ))}
          </div>
          <button
            onClick={() => navigate('/applications')}
            className="btn-primary flex items-center gap-2 shadow-lg shadow-steel-blue/25"
          >
            <Plus size={18} /> Nouvelle candidature
          </button>
        </div>
      </motion.div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Candidatures"
          value={stats.total}
          subtitle="total"
          icon={Briefcase}
          color="bg-blue-500"
          trend="+12%"
          trendUp={true}
        />
        <KPICard
          title="En attente"
          value={stats.pending}
          subtitle="candidatures"
          icon={Clock3}
          color="bg-amber-500"
          trend="-5%"
          trendUp={false}
        />
        <KPICard
          title="Entretiens"
          value={stats.interview}
          subtitle="planifies"
          icon={Calendar}
          color="bg-emerald-500"
          trend="+33%"
          trendUp={true}
        />
        <KPICard
          title="Taux de reponse"
          value={`${stats.responseRate}%`}
          subtitle="moyenne secteur: 15%"
          icon={TrendingUp}
          color="bg-violet-500"
          trend="+8%"
          trendUp={true}
        />
      </div>

      {/* CHARTS ROW 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Activity Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 glass-card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-800">Activite hebdomadaire</h3>
              <p className="text-sm text-slate-500">Candidatures, entretiens et relances</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <Download size={16} className="text-slate-400" />
              </button>
              <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <RefreshCw size={16} className="text-slate-400" />
              </button>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCandidatures" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorEntretiens" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorRelances" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: '12px', paddingTop: '16px' }}
                />
                <Area type="monotone" dataKey="candidatures" stroke="#3B82F6" strokeWidth={2} fill="url(#colorCandidatures)" name="Candidatures" />
                <Area type="monotone" dataKey="entretiens" stroke="#8B5CF6" strokeWidth={2} fill="url(#colorRelances)" name="Entretiens" />
                <Area type="monotone" dataKey="relances" stroke="#F59E0B" strokeWidth={2} fill="url(#colorRelances)" name="Relances" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Status Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6"
        >
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-800">Repartition des statuts</h3>
            <p className="text-sm text-slate-500">Etat de vos candidatures</p>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-4">
            {statusData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-600">{item.name}</span>
                </div>
                <span className="font-semibold text-slate-800">{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* CHARTS ROW 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6"
        >
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-800">Tendance mensuelle</h3>
            <p className="text-sm text-slate-500">Candidatures vs Reponses</p>
          </div>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
                <Bar dataKey="candidatures" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Candidatures" />
                <Bar dataKey="reponses" fill="#10B981" radius={[4, 4, 0, 0]} name="Reponses" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Skills Radar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-6"
        >
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-800">Profil de competences</h3>
            <p className="text-sm text-slate-500">Analyse IA de votre recherche</p>
          </div>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={skillsRadar}>
                <PolarGrid stroke="#E2E8F0" />
                <PolarAngleAxis dataKey="skill" tick={{ fill: '#64748B', fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="#6366F1"
                  strokeWidth={2}
                  fill="#6366F1"
                  fillOpacity={0.2}
                />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Weekly Goal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-card p-6"
        >
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-800">Objectif hebdomadaire</h3>
            <p className="text-sm text-slate-500">{stats.weeklyCurrent} / {stats.weeklyGoal} candidatures</p>
          </div>
          <div className="flex items-center justify-center py-4">
            <div className="relative w-40 h-40">
              <svg className="w-40 h-40 -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" stroke="#E2E8F0" strokeWidth="8" fill="none" />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="#3B82F6"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${(stats.weeklyCurrent / stats.weeklyGoal) * 264} 264`}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-slate-800">{Math.round((stats.weeklyCurrent / stats.weeklyGoal) * 100)}%</span>
                <span className="text-xs text-slate-500">complete</span>
              </div>
            </div>
          </div>
          <div className="space-y-3 mt-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Candidatures envoyees</span>
              <span className="font-semibold text-slate-800">{stats.weeklyCurrent}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Restantes</span>
              <span className="font-semibold text-slate-800">{stats.weeklyGoal - stats.weeklyCurrent}</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(stats.weeklyCurrent / stats.weeklyGoal) * 100}%` }}
                transition={{ duration: 1, delay: 0.8 }}
                className="h-full bg-blue-500 rounded-full"
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* BOTTOM ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Events */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-800">Prochains evenements</h3>
              <p className="text-sm text-slate-500">Entretiens et deadlines a venir</p>
            </div>
            <button
              onClick={() => navigate('/calendar')}
              className="text-sm text-steel-blue hover:underline flex items-center gap-1"
            >
              Voir tout <ChevronRight size={14} />
            </button>
          </div>
          <div className="space-y-3">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-center gap-4 p-3 rounded-xl bg-white/40 border border-slate-100 hover:bg-white/60 hover:shadow-md transition-all cursor-pointer"
                onClick={() => navigate('/calendar')}
              >
                <div className={`p-2.5 rounded-xl ${
                  event.type === 'interview' ? 'bg-purple-50 text-purple-600' :
                  event.type === 'followup' ? 'bg-blue-50 text-blue-600' :
                  'bg-red-50 text-red-600'
                }`}>
                  {event.type === 'interview' ? <Calendar size={16} /> :
                   event.type === 'followup' ? <Zap size={16} /> :
                   <Clock size={16} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800">{event.title}</p>
                  <p className="text-xs text-slate-500">{event.company}</p>
                  {event.location && (
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin size={10} /> {event.location}
                    </p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-slate-700">{event.date}</p>
                  <p className="text-xs text-slate-400">{event.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-800">Activite recente</h3>
              <p className="text-sm text-slate-500">Dernieres actions realisees</p>
            </div>
            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <Filter size={16} className="text-slate-400" />
            </button>
          </div>
          <div className="space-y-3">
            {recentActivity.map((activity, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/40 border border-slate-100 hover:bg-white/60 transition-all">
                <div className={`p-2 rounded-lg ${
                  activity.type === 'success' ? 'bg-green-50 text-green-600' :
                  activity.type === 'info' ? 'bg-blue-50 text-blue-600' :
                  activity.type === 'warning' ? 'bg-yellow-50 text-yellow-600' :
                  'bg-purple-50 text-purple-600'
                }`}>
                  <activity.icon size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-700">{activity.text}</p>
                  <p className="text-xs text-slate-400">{activity.date}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* QUICK ACTIONS */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <h3 className="font-semibold text-slate-800 mb-4">Actions rapides</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: 'Nouvelle candidature', icon: Plus, path: '/applications', color: 'bg-steel-blue', textColor: 'text-white' },
            { label: 'Planifier entretien', icon: Calendar, path: '/calendar', color: 'bg-blue-500', textColor: 'text-white' },
            { label: 'Analyser CV', icon: Brain, path: '/ai', color: 'bg-purple-500', textColor: 'text-white' },
            { label: 'Importer doc', icon: FileText, path: '/documents', color: 'bg-emerald-500', textColor: 'text-white' },
            { label: 'Notifications', icon: Mail, path: '/notifications', color: 'bg-amber-500', textColor: 'text-white' },
            { label: 'Securite', icon: Target, path: '/security', color: 'bg-rose-500', textColor: 'text-white' },
          ].map((action) => (
            <button
              key={action.label}
              onClick={() => navigate(action.path)}
              className="glass-card p-4 text-center hover:shadow-lg transition-all group hover:scale-[1.02]"
            >
              <div className={`w-10 h-10 rounded-xl ${action.color} ${action.textColor} flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform`}>
                <action.icon size={20} />
              </div>
              <p className="text-xs font-medium text-slate-700">{action.label}</p>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
