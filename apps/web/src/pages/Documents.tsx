import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, Upload, Trash2, Download, Eye, Folder, File, Image, FileSpreadsheet, Search, X, Filter } from 'lucide-react'

interface DocumentFile {
  id: string
  name: string
  type: 'pdf' | 'doc' | 'image' | 'spreadsheet' | 'other'
  size: string
  category: string
  uploadedAt: string
  url?: string
}

const categoryLabels: Record<string, string> = {
  cv: 'CV',
  lm: 'Lettre de motivation',
  diplome: 'Diplomes',
  certificat: 'Certificats',
  identite: 'Identite',
  autre: 'Autre',
}

const typeIcons: Record<string, any> = {
  pdf: FileText,
  doc: File,
  image: Image,
  spreadsheet: FileSpreadsheet,
  other: File,
}

const typeColors: Record<string, string> = {
  pdf: 'text-red-500 bg-red-50',
  doc: 'text-blue-500 bg-blue-50',
  image: 'text-purple-500 bg-purple-50',
  spreadsheet: 'text-green-500 bg-green-50',
  other: 'text-slate-500 bg-slate-50',
}

const initialDocs: DocumentFile[] = [
  { id: '1', name: 'CV_Zossou_2026.pdf', type: 'pdf', size: '245 Ko', category: 'cv', uploadedAt: '2026-07-01' },
  { id: '2', name: 'LM_Vinci_Construction.pdf', type: 'pdf', size: '189 Ko', category: 'lm', uploadedAt: '2026-07-03' },
  { id: '3', name: 'Diplome_BTS_Genie_Civil.pdf', type: 'pdf', size: '1.2 Mo', category: 'diplome', uploadedAt: '2026-06-15' },
  { id: '4', name: 'Certification_BIM.pdf', type: 'pdf', size: '450 Ko', category: 'certificat', uploadedAt: '2026-06-20' },
  { id: '5', name: 'CNI_recto.jpg', type: 'image', size: '890 Ko', category: 'identite', uploadedAt: '2026-05-10' },
]

export default function Documents() {
  const [documents, setDocuments] = useState<DocumentFile[]>(initialDocs)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL')
  const [dragOver, setDragOver] = useState(false)
  const [previewDoc, setPreviewDoc] = useState<DocumentFile | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const files = Array.from(e.dataTransfer.files)
    files.forEach(file => addFile(file))
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    files.forEach(file => addFile(file))
    e.target.value = ''
  }

  const addFile = (file: File) => {
    const ext = file.name.split('.').pop()?.toLowerCase() || ''
    let type: DocumentFile['type'] = 'other'
    if (['pdf'].includes(ext)) type = 'pdf'
    else if (['doc', 'docx', 'odt', 'txt'].includes(ext)) type = 'doc'
    else if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext)) type = 'image'
    else if (['xls', 'xlsx', 'csv'].includes(ext)) type = 'spreadsheet'

    const sizeStr = file.size > 1024 * 1024
      ? `${(file.size / (1024 * 1024)).toFixed(1)} Mo`
      : `${Math.round(file.size / 1024)} Ko`

    const newDoc: DocumentFile = {
      id: Date.now().toString() + Math.random().toString(36).slice(2, 6),
      name: file.name,
      type,
      size: sizeStr,
      category: 'autre',
      uploadedAt: new Date().toISOString().split('T')[0],
      url: URL.createObjectURL(file),
    }
    setDocuments(prev => [newDoc, ...prev])
  }

  const deleteDoc = (id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id))
    if (previewDoc?.id === id) setPreviewDoc(null)
  }

  const changeCategory = (id: string, category: string) => {
    setDocuments(prev => prev.map(d => d.id === id ? { ...d, category } : d))
  }

  const filtered = documents.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = categoryFilter === 'ALL' || d.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const categoryCounts = Object.keys(categoryLabels).reduce((acc, cat) => {
    acc[cat] = documents.filter(d => d.category === cat).length
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText size={28} className="text-slate-700" />
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Documents</h1>
            <p className="text-caption mt-1">{documents.length} document{documents.length > 1 ? 's' : ''} · {documents.filter(d => d.type === 'pdf').length} PDFs</p>
          </div>
        </div>
        <button onClick={() => fileInputRef.current?.click()} className="btn-primary flex items-center gap-2">
          <Upload size={18} /> Importer
        </button>
      </motion.div>

      {/* Zone drag & drop */}
      <div
        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
          dragOver ? 'border-steel-blue bg-steel-blue/5' : 'border-slate-300 hover:border-steel-blue hover:bg-slate-50/50'
        }`}
      >
        <input ref={fileInputRef} type="file" multiple accept="*" className="hidden" onChange={handleFileSelect} />
        <Upload size={36} className={`mx-auto mb-3 ${dragOver ? 'text-steel-blue' : 'text-slate-400'}`} />
        <p className="font-medium text-slate-700 text-sm">Glissez vos fichiers ici ou cliquez pour parcourir</p>
        <p className="text-xs text-slate-400 mt-1">PDF, DOC, JPG, PNG — Max 10 Mo par fichier</p>
      </div>

      {/* Categories */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setCategoryFilter('ALL')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            categoryFilter === 'ALL' ? 'bg-steel-blue text-white' : 'bg-white/50 text-slate-600 hover:bg-white border border-slate-200/50'
          }`}
        >
          Tous ({documents.length})
        </button>
        {Object.entries(categoryLabels).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setCategoryFilter(key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              categoryFilter === key ? 'bg-steel-blue text-white' : 'bg-white/50 text-slate-600 hover:bg-white border border-slate-200/50'
            }`}
          >
            {label} ({categoryCounts[key] || 0})
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher un document..."
          className="w-full pl-9 pr-4 py-2.5 bg-white/60 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-steel-blue/50 text-sm"
        />
      </div>

      {/* Liste */}
      <div className="space-y-2">
        <AnimatePresence>
          {filtered.map(doc => {
            const Icon = typeIcons[doc.type]
            return (
              <motion.div
                key={doc.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-card p-4 flex items-center gap-4 group"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${typeColors[doc.type]}`}>
                  <Icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{doc.name}</p>
                  <p className="text-xs text-slate-500">{doc.size} · {doc.uploadedAt}</p>
                </div>
                <select
                  value={doc.category}
                  onChange={e => changeCategory(doc.id, e.target.value)}
                  className="text-xs bg-white/50 border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-steel-blue/50"
                >
                  {Object.entries(categoryLabels).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setPreviewDoc(doc)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-steel-blue">
                    <Eye size={14} />
                  </button>
                  <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-steel-blue">
                    <Download size={14} />
                  </button>
                  <button onClick={() => deleteDoc(doc.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500">
                    <Trash2 size={14} />
                  </button>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <Folder size={40} className="mx-auto mb-3 opacity-50" />
            <p>Aucun document</p>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {previewDoc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setPreviewDoc(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[85vh] flex flex-col"
            >
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {(() => {
                    const Icon = typeIcons[previewDoc.type]
                    return <Icon size={20} className={typeColors[previewDoc.type].split(' ')[0]} />
                  })()}
                  <h3 className="font-semibold text-slate-800">{previewDoc.name}</h3>
                </div>
                <button onClick={() => setPreviewDoc(null)} className="p-1 hover:bg-slate-100 rounded-lg">
                  <X size={18} className="text-slate-400" />
                </button>
              </div>
              <div className="flex-1 p-6 overflow-auto bg-slate-50 flex items-center justify-center min-h-[300px]">
                {previewDoc.type === 'image' ? (
                  <img src={previewDoc.url} alt={previewDoc.name} className="max-w-full max-h-[60vh] rounded-lg shadow-lg object-contain" />
                ) : (
                  <div className="text-center">
                    <FileText size={64} className="mx-auto mb-4 text-slate-300" />
                    <p className="text-sm text-slate-500">Apercu non disponible pour ce type de fichier</p>
                    <p className="text-xs text-slate-400 mt-1">Telechargez le document pour le consulter</p>
                  </div>
                )}
              </div>
              <div className="p-4 border-t border-slate-100 flex gap-2 justify-end">
                <button onClick={() => setPreviewDoc(null)} className="btn-secondary text-sm">Fermer</button>
                <button className="btn-primary text-sm flex items-center gap-2">
                  <Download size={14} /> Telecharger
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
