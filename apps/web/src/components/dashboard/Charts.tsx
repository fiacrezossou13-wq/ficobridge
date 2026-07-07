import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts'
import { motion } from 'framer-motion'

const timelineData = [
  { name: 'S1', candidatures: 4, entretiens: 1 },
  { name: 'S2', candidatures: 6, entretiens: 2 },
  { name: 'S3', candidatures: 3, entretiens: 1 },
  { name: 'S4', candidatures: 8, entretiens: 3 },
  { name: 'S5', candidatures: 5, entretiens: 2 },
  { name: 'S6', candidatures: 7, entretiens: 4 },
  { name: 'S7', candidatures: 9, entretiens: 3 },
  { name: 'S8', candidatures: 6, entretiens: 5 },
]

const sectorData = [
  { name: 'Génie Civil', value: 45, color: '#4A6FA5' },
  { name: 'Construction', value: 25, color: '#27AE60' },
  { name: 'BTP', value: 20, color: '#FF6B35' },
  { name: 'Autres', value: 10, color: '#95A5A6' },
]

const cityData = [
  { name: 'Paris', count: 12 },
  { name: 'Lyon', count: 8 },
  { name: 'Marseille', count: 5 },
  { name: 'Bordeaux', count: 4 },
  { name: 'Nantes', count: 3 },
]

export function TimelineChart() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card p-6"
    >
      <h3 className="text-lg font-semibold text-white mb-4">Évolution des candidatures</h3>
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={timelineData}>
          <defs>
            <linearGradient id="colorCandidatures" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4A6FA5" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#4A6FA5" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorEntretiens" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#27AE60" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#27AE60" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="name" stroke="#64748B" fontSize={12} />
          <YAxis stroke="#64748B" fontSize={12} />
          <Tooltip 
            contentStyle={{ background: 'rgba(15,23,42,0.9)', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.3)', color: '#fff' }}
          />
          <Area type="monotone" dataKey="candidatures" stroke="#4A6FA5" strokeWidth={2} fillOpacity={1} fill="url(#colorCandidatures)" />
          <Area type="monotone" dataKey="entretiens" stroke="#27AE60" strokeWidth={2} fillOpacity={1} fill="url(#colorEntretiens)" />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  )
}

export function SectorChart() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.1 }}
      className="glass-card p-6"
    >
      <h3 className="text-lg font-semibold text-white mb-4">Répartition par secteur</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={sectorData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {sectorData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.9)', borderRadius: '12px', border: 'none', color: '#fff' }} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  )
}

export function CityChart() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 }}
      className="glass-card p-6"
    >
      <h3 className="text-lg font-semibold text-white mb-4">Candidatures par ville</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={cityData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="name" stroke="#64748B" fontSize={12} />
          <YAxis stroke="#64748B" fontSize={12} />
          <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.9)', borderRadius: '12px', border: 'none', color: '#fff' }} />
          <Bar dataKey="count" fill="#4A6FA5" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  )
}
