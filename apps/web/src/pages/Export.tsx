import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, Download, FileSpreadsheet, User, GraduationCap, Calendar, TrendingUp, BarChart3, PieChart, Printer } from 'lucide-react'

interface Application {
  id: string
  company: string
  position: string
  city: string
  status: string
  date: string
  link?: string
  contactName?: string
  contactEmail?: string
  notes?: string
}

interface StudentInfo {
  firstName: string
  lastName: string
  school: string
  formation: string
  specialty: string
  period: string
}

const statusLabels: Record<string, string> = {
  pending: 'En attente',
  interview: 'Entretien',
  rejected: 'Refuse',
  accepted: 'Accepte',
  relance: 'A relancer',
}

export default function Export() {
  const [studentInfo, setStudentInfo] = useState<StudentInfo>({
    firstName: 'Jean',
    lastName: 'Dupont',
    school: 'Ecole d Ingenieurs',
    formation: 'Bachelor Genie Civil',
    specialty: 'BTP / Construction',
    period: 'Septembre 2026 - Aout 2027',
  })

  const [applications] = useState<Application[]>([
    { id: '1', company: 'Vinci Construction', position: "Apprenti Charge d Affaires", city: 'Paris', status: 'interview', date: '2026-07-08', notes: 'Entretien telephonique prevu a 10h' },
    { id: '2', company: 'Bouygues Construction', position: 'Apprenti Conducteur de Travaux', city: 'Lyon', status: 'pending', date: '2026-07-05', notes: 'Candidature envoyee via leur site' },
    { id: '3', company: 'Eiffage', position: 'Apprenti Ingenieur Projet', city: 'Marseille', status: 'relance', date: '2026-06-28', notes: 'A relancer apres 10 jours' },
    { id: '4', company: 'Colas', position: 'Apprenti Technicien Methodes', city: 'Bordeaux', status: 'rejected', date: '2026-06-20' },
    { id: '5', company: 'NGE', position: 'Apprenti Ingenieur Travaux', city: 'Toulouse', status: 'pending', date: '2026-07-01' },
  ])

  const stats = {
    total: applications.length,
    contacted: new Set(applications.map(a => a.company)).size,
    responses: applications.filter(a => a.status !== 'pending').length,
    interviews: applications.filter(a => a.status === 'interview').length,
    rejections: applications.filter(a => a.status === 'rejected').length,
    pending: applications.filter(a => a.status === 'pending').length,
    responseRate: applications.length > 0 ? Math.round((applications.filter(a => a.status !== 'pending').length / applications.length) * 100) : 0,
    successRate: applications.length > 0 ? Math.round((applications.filter(a => a.status === 'accepted').length / applications.length) * 100) : 0,
    relanceRate: applications.length > 0 ? Math.round((applications.filter(a => a.status === 'relance').length / applications.length) * 100) : 0,
  }

  const generateHTML = () => {
    const date = new Date().toLocaleDateString('fr-FR')
    const aiComment = `Durant cette periode, l etudiant a realise une recherche active d alternance avec ${stats.total} candidatures envoyees, ${stats.responses} reponses obtenues et ${stats.interviews} entretien${stats.interviews > 1 ? 's' : ''} programme${stats.interviews > 1 ? 's' : ''}. Les demarches sont regulieres et demontrent une implication constante. Les prochaines actions recommandees sont de relancer les candidatures en attente depuis plus de 10 jours et de renforcer les candidatures dans les secteurs presentant le meilleur taux de reponse.`

    return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Rapport de recherche d alternance - ${studentInfo.firstName} ${studentInfo.lastName}</title>
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 40px; color: #333; line-height: 1.6; }
    .header { text-align: center; border-bottom: 3px solid #4a6fa5; padding-bottom: 20px; margin-bottom: 30px; }
    .header h1 { color: #4a6fa5; margin: 0; font-size: 28px; }
    .header p { color: #666; margin: 5px 0; }
    .section { margin-bottom: 30px; }
    .section h2 { color: #4a6fa5; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; font-size: 20px; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
    .info-item { background: #f8fafc; padding: 12px; border-radius: 8px; }
    .info-item strong { color: #4a6fa5; display: block; margin-bottom: 4px; }
    .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin: 20px 0; }
    .stat-card { background: #f8fafc; padding: 20px; border-radius: 12px; text-align: center; border-left: 4px solid #4a6fa5; }
    .stat-value { font-size: 32px; font-weight: bold; color: #4a6fa5; }
    .stat-label { color: #666; font-size: 14px; }
    table { width: 100%; border-collapse: collapse; margin-top: 15px; }
    th { background: #4a6fa5; color: white; padding: 12px; text-align: left; }
    td { padding: 12px; border-bottom: 1px solid #e2e8f0; }
    tr:nth-child(even) { background: #f8fafc; }
    .status-badge { padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 500; }
    .status-pending { background: #fef3c7; color: #92400e; }
    .status-interview { background: #dbeafe; color: #1e40af; }
    .status-accepted { background: #d1fae5; color: #065f46; }
    .status-rejected { background: #fee2e2; color: #991b1b; }
    .status-relance { background: #ffedd5; color: #9a3412; }
    .ai-comment { background: #f0f9ff; border-left: 4px solid #4a6fa5; padding: 20px; border-radius: 8px; font-style: italic; color: #334155; }
    .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #94a3b8; font-size: 12px; }
    @media print { body { padding: 20px; } .no-print { display: none; } }
  </style>
</head>
<body>
  <div class="header">
    <h1>Rapport de recherche d alternance</h1>
    <p>Genere le ${date} via FicoBridge</p>
  </div>

  <div class="section">
    <h2>Informations de l etudiant</h2>
    <div class="info-grid">
      <div class="info-item"><strong>Nom</strong>${studentInfo.lastName}</div>
      <div class="info-item"><strong>Prenom</strong>${studentInfo.firstName}</div>
      <div class="info-item"><strong>Ecole</strong>${studentInfo.school}</div>
      <div class="info-item"><strong>Formation</strong>${studentInfo.formation}</div>
      <div class="info-item"><strong>Specialite</strong>${studentInfo.specialty}</div>
      <div class="info-item"><strong>Periode</strong>${studentInfo.period}</div>
    </div>
  </div>

  <div class="section">
    <h2>Statistiques</h2>
    <div class="stats-grid">
      <div class="stat-card"><div class="stat-value">${stats.total}</div><div class="stat-label">Candidatures</div></div>
      <div class="stat-card"><div class="stat-value">${stats.contacted}</div><div class="stat-label">Entreprises</div></div>
      <div class="stat-card"><div class="stat-value">${stats.responses}</div><div class="stat-label">Reponses</div></div>
      <div class="stat-card"><div class="stat-value">${stats.interviews}</div><div class="stat-label">Entretiens</div></div>
      <div class="stat-card"><div class="stat-value">${stats.responseRate}%</div><div class="stat-label">Taux de reponse</div></div>
      <div class="stat-card"><div class="stat-value">${stats.successRate}%</div><div class="stat-label">Taux de reussite</div></div>
    </div>
  </div>

  <div class="section">
    <h2>Historique des candidatures</h2>
    <table>
      <thead><tr><th>Entreprise</th><th>Poste</th><th>Ville</th><th>Date</th><th>Statut</th><th>Commentaires</th></tr></thead>
      <tbody>
        ${applications.map(a => `
        <tr>
          <td>${a.company}</td>
          <td>${a.position}</td>
          <td>${a.city}</td>
          <td>${a.date}</td>
          <td><span class="status-badge status-${a.status}">${statusLabels[a.status] || a.status}</span></td>
          <td>${a.notes || '-'}</td>
        </tr>`).join('')}
      </tbody>
    </table>
  </div>

  <div class="section">
    <h2>Synthese IA</h2>
    <div class="ai-comment">${aiComment}</div>
  </div>

  <div class="footer">
    <p>Rapport genere automatiquement par FicoBridge</p>
    <p>Application de suivi de recherche d alternance</p>
  </div>
</body>
</html>`
  }

  const exportPDF = () => {
    const html = generateHTML()
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(html)
      printWindow.document.close()
      setTimeout(() => { printWindow.print() }, 500)
    }
  }

  const exportWord = () => {
    const html = generateHTML()
    const blob = new Blob(['\ufeff', html], { type: 'application/msword' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `Rapport_Alternance_${studentInfo.lastName}_${studentInfo.firstName}.doc`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText size={28} className="text-slate-700" />
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Export du suivi</h1>
            <p className="text-slate-500 mt-1">Generez un rapport professionnel de votre recherche d alternance</p>
          </div>
        </div>
      </motion.div>

      {/* Informations etudiant */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
        <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2"><User size={18} /> Informations de l etudiant</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { label: 'Nom', value: studentInfo.lastName, key: 'lastName' as const },
            { label: 'Prenom', value: studentInfo.firstName, key: 'firstName' as const },
            { label: 'Ecole', value: studentInfo.school, key: 'school' as const },
            { label: 'Formation', value: studentInfo.formation, key: 'formation' as const },
            { label: 'Specialite', value: studentInfo.specialty, key: 'specialty' as const },
            { label: 'Periode', value: studentInfo.period, key: 'period' as const },
          ].map(field => (
            <div key={field.key}>
              <label className="block text-xs font-medium text-slate-500 mb-1">{field.label}</label>
              <input
                value={field.value}
                onChange={e => setStudentInfo(prev => ({ ...prev, [field.key]: e.target.value }))}
                className="w-full px-3 py-2 bg-white/60 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-steel-blue/50 text-sm"
              />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Apercu des stats */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
        <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2"><BarChart3 size={18} /> Apercu des statistiques</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Candidatures', value: stats.total, icon: FileText, color: 'bg-blue-500' },
            { label: 'Entreprises', value: stats.contacted, icon: GraduationCap, color: 'bg-purple-500' },
            { label: 'Reponses', value: stats.responses, icon: TrendingUp, color: 'bg-green-500' },
            { label: 'Entretiens', value: stats.interviews, icon: Calendar, color: 'bg-orange-500' },
          ].map(s => (
            <div key={s.label} className="bg-white/50 rounded-xl p-4 text-center border border-slate-100">
              <div className={`w-8 h-8 rounded-lg ${s.color} flex items-center justify-center text-white mx-auto mb-2`}><s.icon size={16} /></div>
              <p className="text-2xl font-bold text-slate-800">{s.value}</p>
              <p className="text-xs text-slate-500">{s.label}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="bg-white/50 rounded-xl p-3 text-center border border-slate-100">
            <p className="text-xl font-bold text-slate-800">{stats.responseRate}%</p>
            <p className="text-xs text-slate-500">Taux de reponse</p>
          </div>
          <div className="bg-white/50 rounded-xl p-3 text-center border border-slate-100">
            <p className="text-xl font-bold text-slate-800">{stats.successRate}%</p>
            <p className="text-xs text-slate-500">Taux de reussite</p>
          </div>
          <div className="bg-white/50 rounded-xl p-3 text-center border border-slate-100">
            <p className="text-xl font-bold text-slate-800">{stats.relanceRate}%</p>
            <p className="text-xs text-slate-500">Taux de relance</p>
          </div>
        </div>
      </motion.div>

      {/* Boutons export */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
        <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2"><Download size={18} /> Formats d export</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button onClick={exportPDF} className="flex items-center gap-4 p-5 bg-white/50 border border-slate-200 rounded-xl hover:shadow-lg hover:border-steel-blue/30 transition-all group text-left">
            <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-red-600 group-hover:bg-red-100 transition-colors">
              <FileText size={24} />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-slate-800">Exporter en PDF</h4>
              <p className="text-sm text-slate-500">Rapport professionnel pret a imprimer</p>
            </div>
            <Printer size={20} className="text-slate-300 group-hover:text-steel-blue transition-colors" />
          </button>
          <button onClick={exportWord} className="flex items-center gap-4 p-5 bg-white/50 border border-slate-200 rounded-xl hover:shadow-lg hover:border-steel-blue/30 transition-all group text-left">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-100 transition-colors">
              <FileSpreadsheet size={24} />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-slate-800">Exporter en Word</h4>
              <p className="text-sm text-slate-500">Document editable au format .doc</p>
            </div>
            <Download size={20} className="text-slate-300 group-hover:text-steel-blue transition-colors" />
          </button>
        </div>
      </motion.div>

      {/* Apercu du rapport */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6">
        <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2"><PieChart size={18} /> Apercu du rapport</h3>
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div className="text-center border-b border-slate-200 pb-4">
            <h2 className="text-xl font-bold text-steel-blue">Rapport de recherche d alternance</h2>
            <p className="text-sm text-slate-500">Genere le {new Date().toLocaleDateString('fr-FR')}</p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-slate-50 p-3 rounded-lg"><strong className="text-steel-blue">Nom:</strong> {studentInfo.lastName}</div>
            <div className="bg-slate-50 p-3 rounded-lg"><strong className="text-steel-blue">Prenom:</strong> {studentInfo.firstName}</div>
            <div className="bg-slate-50 p-3 rounded-lg"><strong className="text-steel-blue">Ecole:</strong> {studentInfo.school}</div>
            <div className="bg-slate-50 p-3 rounded-lg"><strong className="text-steel-blue">Formation:</strong> {studentInfo.formation}</div>
          </div>
          <div className="bg-slate-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-slate-700 mb-2">Synthese IA</p>
            <p className="text-sm text-slate-600 italic">
              "Durant cette periode, l etudiant a realise une recherche active d alternance avec {stats.total} candidatures envoyees, {stats.responses} reponses obtenues et {stats.interviews} entretien{stats.interviews > 1 ? 's' : ''} programme{stats.interviews > 1 ? 's' : ''}. Les demarches sont regulieres et demontrent une implication constante."
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
