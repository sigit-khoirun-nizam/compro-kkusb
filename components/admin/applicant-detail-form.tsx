'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Applicant, JobPosting } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { 
  ArrowLeft, 
  Save, 
  Loader2, 
  ExternalLink, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Briefcase, 
  GraduationCap, 
  Award, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  FileText, 
  Send, 
  Check, 
  Copy, 
  Building,
  HelpCircle,
  AlertCircle
} from 'lucide-react'

type QuestionType = {
  id: string
  testId?: string
  question: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  correctOption: string
  order?: number
}

type AnswerType = {
  id: string
  applicantId?: string
  questionId?: string
  selectedOption: string
  isCorrect: boolean
  createdAt: Date | string
  question: QuestionType
}

type ApplicantWithJob = Applicant & { 
  job: JobPosting
  testAnswers?: AnswerType[]
}

export default function ApplicantDetailForm({ applicant }: { applicant: ApplicantWithJob }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(applicant.status)
  const [copiedEmail, setCopiedEmail] = useState(false)

  // Status configuration
  const getStatusUI = (st: string) => {
    switch (st) {
      case 'PENDING':
        return {
          label: 'Menunggu Review',
          color: 'bg-yellow-50 text-yellow-800 border-yellow-200 dark:bg-yellow-950/40 dark:text-yellow-400 dark:border-yellow-800',
          desc: 'Lamaran baru masuk dan belum ditinjau oleh tim rekruter.'
        }
      case 'REVIEWING':
        return {
          label: 'Sedang Di-Review',
          color: 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800',
          desc: 'Berkas kandidat sedang dalam proses verifikasi tim HRD.'
        }
      case 'TEST_SENT':
        return {
          label: 'Akses Tes Dikirim',
          color: 'bg-orange-50 text-orange-800 border-orange-200 dark:bg-orange-950/40 dark:text-orange-400 dark:border-orange-800',
          desc: 'Pelamar telah diberikan izin untuk mengerjakan tes akademik online.'
        }
      case 'TEST_COMPLETED':
        return {
          label: 'Tes Selesai',
          color: 'bg-purple-50 text-purple-800 border-purple-200 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-800',
          desc: 'Kandidat telah menuntaskan seluruh soal tes akademik online.'
        }
      case 'INTERVIEW':
        return {
          label: 'Tahap Wawancara',
          color: 'bg-indigo-50 text-indigo-800 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-800',
          desc: 'Kandidat dijadwalkan untuk proses interview/wawancara kerja.'
        }
      case 'ACCEPTED':
        return {
          label: 'Diterima (Lolos)',
          color: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800',
          desc: 'Kandidat resmi lolos seluruh tahapan dan diterima bekerja di KKUSB.'
        }
      case 'REJECTED':
        return {
          label: 'Tidak Lolos (Gugur)',
          color: 'bg-red-50 text-red-800 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800',
          desc: 'Kandidat belum memenuhi kualifikasi lowongan pada periode ini.'
        }
      default:
        return {
          label: st,
          color: 'bg-zinc-100 text-zinc-800 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300',
          desc: 'Status lamaran saat ini.'
        }
    }
  }

  const currentStatusUI = getStatusUI(applicant.status)
  const targetStatusUI = getStatusUI(status)

  // Save status handler
  const handleSaveStatus = async (newStatusToSave?: string) => {
    const statusVal = newStatusToSave || status
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/karir/pelamar/${applicant.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: statusVal })
      })

      if (!res.ok) throw new Error('Gagal memperbarui status')
      
      toast.success(`Status berhasil diperbarui menjadi "${getStatusUI(statusVal).label}"`)
      setStatus(statusVal as any)
      router.refresh()
    } catch (error) {
      toast.error('Terjadi kesalahan saat menyimpan status pelamar')
    } finally {
      setLoading(false)
    }
  }

  // Copy email helper
  const handleCopyEmail = () => {
    navigator.clipboard.writeText(applicant.email)
    setCopiedEmail(true)
    toast.success('Alamat email berhasil disalin!')
    setTimeout(() => setCopiedEmail(false), 2000)
  }

  // Format WhatsApp Link
  const formatWaLink = (phoneStr: string | null) => {
    if (!phoneStr) return null
    let cleaned = phoneStr.replace(/\D/g, '')
    if (cleaned.startsWith('0')) {
      cleaned = '62' + cleaned.substring(1)
    }
    return `https://wa.me/${cleaned}`
  }

  // Sort test answers
  const testAnswers = (applicant.testAnswers || []).slice().sort((a, b) => {
    return (a.question?.order ?? 0) - (b.question?.order ?? 0)
  })

  // Test statistics
  const totalQuestions = testAnswers.length
  const correctCount = testAnswers.filter(a => a.isCorrect).length
  const wrongCount = totalQuestions - correctCount
  const calculatedPercentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0

  // Calculate duration
  const getTestDuration = () => {
    if (!applicant.testStartedAt || !applicant.testCompletedAt) return null
    const start = new Date(applicant.testStartedAt).getTime()
    const end = new Date(applicant.testCompletedAt).getTime()
    const diffMs = end - start
    if (diffMs <= 0) return null
    const minutes = Math.floor(diffMs / 60000)
    const seconds = Math.floor((diffMs % 60000) / 1000)
    if (minutes > 0) {
      return `${minutes} menit ${seconds} detik`
    }
    return `${seconds} detik`
  }

  const durationStr = getTestDuration()

  return (
    <div className="space-y-6">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#E4E9E5] dark:border-zinc-800 pb-5">
        <div className="space-y-1">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => router.push('/admin/karir/pelamar')} 
            className="-ml-2 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-100 h-8 text-xs font-medium"
          >
            <ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> Kembali ke Daftar Pelamar
          </Button>
          <div className="flex items-center gap-3 pt-1">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              {applicant.name}
            </h1>
            <Badge variant="outline" className={`font-semibold text-xs border rounded-full px-2.5 py-0.5 ${currentStatusUI.color}`}>
              {currentStatusUI.label}
            </Badge>
          </div>
          <p className="text-xs text-zinc-500">
            Melamar posisi <span className="font-semibold text-zinc-800 dark:text-zinc-200">{applicant.job.title}</span> • ID: <code className="bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded text-[11px] text-zinc-600 dark:text-zinc-400">{applicant.id}</code>
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {applicant.cvUrl && (
            <Button asChild variant="outline" size="sm" className="border-emerald-200 text-[#075C35] hover:bg-emerald-50 text-xs">
              <a href={applicant.cvUrl} target="_blank" rel="noopener noreferrer">
                <FileText className="mr-1.5 h-3.5 w-3.5" /> Buka CV Kandidat <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            </Button>
          )}

          {applicant.status === 'PENDING' && (
            <Button 
              size="sm" 
              onClick={() => handleSaveStatus('TEST_SENT')} 
              disabled={loading}
              className="bg-orange-600 hover:bg-orange-700 text-white text-xs"
            >
              <Send className="mr-1.5 h-3.5 w-3.5" /> Kirim Akses Tes
            </Button>
          )}
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Status Card */}
        <div className="border border-[#E4E9E5] dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 p-4 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-zinc-400 block">Status Seleksi</span>
            <span className="text-base font-bold text-zinc-900 dark:text-zinc-100">{currentStatusUI.label}</span>
            <p className="text-[11px] text-zinc-500 leading-tight">{currentStatusUI.desc}</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-[#079B49] shrink-0 ml-3">
            <Award className="h-5 w-5" />
          </div>
        </div>

        {/* Score Card */}
        <div className="border border-[#E4E9E5] dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 p-4 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-zinc-400 block">Skor Tes Akademik</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-[#079B49]">
                {applicant.testScore !== null ? Math.round(applicant.testScore) : '-'}
              </span>
              <span className="text-xs text-zinc-400 font-medium">/ 100 Poin</span>
            </div>
            <p className="text-[11px] text-zinc-500">
              {totalQuestions > 0 ? `${correctCount} dari ${totalQuestions} soal benar (${calculatedPercentage}%)` : 'Belum mengerjakan tes'}
            </p>
          </div>
          <div className="h-10 w-10 rounded-full bg-green-50 dark:bg-green-950/40 flex items-center justify-center text-[#079B49] shrink-0 ml-3">
            <GraduationCap className="h-5 w-5" />
          </div>
        </div>

        {/* Timeline / Time Card */}
        <div className="border border-[#E4E9E5] dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 p-4 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-zinc-400 block">Durasi Pengerjaan</span>
            <div className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              {durationStr ? durationStr : (applicant.testCompletedAt ? 'Selesai' : 'Belum Ada')}
            </div>
            <p className="text-[11px] text-zinc-500">
              Melamar: {new Date(applicant.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          </div>
          <div className="h-10 w-10 rounded-full bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center text-blue-600 shrink-0 ml-3">
            <Clock className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column: Data Diri & Rincian Tes (2 Spans) */}
        <div className="lg:col-span-2 space-y-6">

          {/* Card: Informasi Kandidat */}
          <div className="border border-[#E4E9E5] dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 overflow-hidden shadow-xs">
            <div className="border-b border-[#E4E9E5] dark:border-zinc-800 px-6 py-4 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/50">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-[#079B49]" />
                <h2 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">Data Diri & Profil Pelamar</h2>
              </div>
              <Badge variant="outline" className="text-[11px] bg-white dark:bg-zinc-800 border-zinc-200">
                Terverifikasi
              </Badge>
            </div>

            <div className="p-6 space-y-6">
              {/* Header profile info */}
              <div className="flex items-start gap-4">
                <div className="h-14 w-14 rounded-full bg-linear-to-br from-[#079B49] to-[#075C35] text-white font-bold text-xl flex items-center justify-center shadow-xs shrink-0">
                  {applicant.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 leading-tight">{applicant.name}</h3>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500">
                    <span className="flex items-center gap-1 font-medium text-zinc-700 dark:text-zinc-300">
                      <Briefcase className="h-3.5 w-3.5 text-[#079B49]" /> {applicant.job.title}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-zinc-400" /> Melamar {new Date(applicant.createdAt).toLocaleDateString('id-ID', { dateStyle: 'long' })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Data Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#E4E9E5] dark:border-zinc-800 text-sm">
                <div className="p-3.5 rounded-lg bg-zinc-50/70 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800/80">
                  <span className="text-xs font-semibold text-zinc-400 block mb-1">Email Kandidat</span>
                  <div className="flex items-center justify-between gap-2">
                    <a href={`mailto:${applicant.email}`} className="text-zinc-900 dark:text-zinc-100 font-medium hover:text-[#079B49] truncate">
                      {applicant.email}
                    </a>
                    <button 
                      onClick={handleCopyEmail}
                      title="Salin Email"
                      className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 p-1"
                    >
                      {copiedEmail ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-zinc-50/70 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800/80">
                  <span className="text-xs font-semibold text-zinc-400 block mb-1">Nomor Telepon / WhatsApp</span>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-zinc-900 dark:text-zinc-100 font-medium">
                      {applicant.phone || '-'}
                    </span>
                    {applicant.phone && (
                      <a 
                        href={formatWaLink(applicant.phone) || '#'} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800 flex items-center gap-1"
                      >
                        <Phone className="h-3 w-3" /> WhatsApp
                      </a>
                    )}
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-zinc-50/70 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800/80">
                  <span className="text-xs font-semibold text-zinc-400 block mb-1">Departemen / Divisi</span>
                  <span className="text-zinc-900 dark:text-zinc-100 font-medium">
                    {applicant.job.department || 'Operasional & Teknologi'}
                  </span>
                </div>

                <div className="p-3.5 rounded-lg bg-zinc-50/70 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800/80">
                  <span className="text-xs font-semibold text-zinc-400 block mb-1">Tipe Pekerjaan</span>
                  <span className="text-zinc-900 dark:text-zinc-100 font-medium">
                    {applicant.job.type || 'Penuh Waktu (Full-time)'}
                  </span>
                </div>
              </div>

              {/* CV Section */}
              <div className="pt-2">
                <span className="text-xs font-semibold text-zinc-500 block mb-2">Dokumen Curriculum Vitae (CV)</span>
                {applicant.cvUrl ? (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/30 dark:bg-emerald-950/20">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-[#075C35] dark:text-emerald-300 flex items-center justify-center shrink-0">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Curriculum Vitae Terunggah</div>
                        <div className="text-[11px] text-zinc-500 truncate max-w-xs sm:max-w-md">{applicant.cvUrl}</div>
                      </div>
                    </div>
                    <Button asChild size="sm" className="bg-[#079B49] hover:bg-[#075C35] text-white text-xs shrink-0 w-full sm:w-auto">
                      <a href={applicant.cvUrl} target="_blank" rel="noopener noreferrer">
                        Lihat / Unduh Dokumen <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                      </a>
                    </Button>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 text-center text-xs text-zinc-400">
                    Kandidat tidak melampirkan file CV digital saat mendaftar.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Card: Hasil & Rincian Soal Tes Akademik */}
          <div className="border border-[#E4E9E5] dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 overflow-hidden shadow-xs">
            <div className="border-b border-[#E4E9E5] dark:border-zinc-800 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-zinc-50/50 dark:bg-zinc-900/50">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-[#079B49]" />
                <h2 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">Lembar Jawaban & Analisis Tes Akademik</h2>
              </div>
              {testAnswers.length > 0 && (
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[11px] font-semibold">
                    {correctCount} Benar
                  </Badge>
                  <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 text-[11px] font-semibold">
                    {wrongCount} Salah
                  </Badge>
                  <Badge variant="outline" className="bg-zinc-100 text-zinc-700 border-zinc-200 text-[11px] font-semibold">
                    Skor: {applicant.testScore !== null ? Math.round(applicant.testScore) : 0}/100
                  </Badge>
                </div>
              )}
            </div>

            <div className="p-6">
              {testAnswers.length > 0 ? (
                <div className="space-y-6">
                  <div className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="text-xs text-zinc-600 dark:text-zinc-300">
                      Rincian jawaban tes yang disubmit oleh kandidat pada{' '}
                      <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                        {applicant.testCompletedAt 
                          ? new Date(applicant.testCompletedAt).toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' })
                          : 'Waktu Selesai'}
                      </span>
                    </div>
                    {durationStr && (
                      <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-800 px-2.5 py-1 rounded border border-zinc-200 dark:border-zinc-700">
                        Durasi: {durationStr}
                      </span>
                    )}
                  </div>

                  {/* List Soal & Jawaban */}
                  <div className="space-y-6">
                    {testAnswers.map((ans, idx) => {
                      const q = ans.question
                      const options = [
                        { key: 'A', text: q.optionA },
                        { key: 'B', text: q.optionB },
                        { key: 'C', text: q.optionC },
                        { key: 'D', text: q.optionD }
                      ]

                      return (
                        <div 
                          key={ans.id} 
                          className="border border-[#E4E9E5] dark:border-zinc-800 rounded-xl p-5 bg-white dark:bg-zinc-900 space-y-4 shadow-2xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
                        >
                          {/* Header Soal */}
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-2.5">
                              <span className="h-6 w-6 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                                {idx + 1}
                              </span>
                              <div>
                                <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 leading-snug">
                                  {q.question}
                                </h4>
                              </div>
                            </div>

                            {/* Badge Hasil */}
                            {ans.isCorrect ? (
                              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800 shrink-0 font-bold text-xs gap-1">
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Benar
                              </Badge>
                            ) : (
                              <Badge className="bg-red-50 text-red-700 border-red-300 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800 shrink-0 font-bold text-xs gap-1">
                                <XCircle className="h-3.5 w-3.5 text-red-600" /> Salah
                              </Badge>
                            )}
                          </div>

                          {/* Pilihan Opsi A, B, C, D */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                            {options.map((opt) => {
                              const isSelectedByCandidate = ans.selectedOption === opt.key
                              const isCorrectAnswer = q.correctOption === opt.key

                              let cardStyle = "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300"
                              let badgeContent = null

                              if (isSelectedByCandidate && ans.isCorrect) {
                                // Pilihan kandidat DAN benar
                                cardStyle = "border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 font-medium ring-1 ring-emerald-500"
                                badgeContent = (
                                  <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-0.5 bg-emerald-100 dark:bg-emerald-900/60 px-1.5 py-0.5 rounded">
                                    <Check className="h-3 w-3" /> Pilihan Pelamar (Benar)
                                  </span>
                                )
                              } else if (isSelectedByCandidate && !ans.isCorrect) {
                                // Pilihan kandidat TETAPI salah
                                cardStyle = "border-red-500 bg-red-50/80 dark:bg-red-950/40 text-red-950 dark:text-red-200 font-medium ring-1 ring-red-500"
                                badgeContent = (
                                  <span className="text-[10px] font-bold text-red-700 dark:text-red-300 flex items-center gap-0.5 bg-red-100 dark:bg-red-900/60 px-1.5 py-0.5 rounded">
                                    <XCircle className="h-3 w-3" /> Pilihan Pelamar (Salah)
                                  </span>
                                )
                              } else if (isCorrectAnswer) {
                                // Bukan pilihan kandidat, tapi ini KUNCI JAWABAN yang benar
                                cardStyle = "border-emerald-400 border-dashed bg-emerald-50/30 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-300 font-medium"
                                badgeContent = (
                                  <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-0.5 bg-emerald-100/70 dark:bg-emerald-900/40 px-1.5 py-0.5 rounded">
                                    <Check className="h-3 w-3" /> Kunci Jawaban
                                  </span>
                                )
                              }

                              return (
                                <div 
                                  key={opt.key}
                                  className={`p-3 rounded-lg border text-xs flex flex-col justify-between gap-1.5 transition-all ${cardStyle}`}
                                >
                                  <div className="flex items-start gap-2">
                                    <span className="font-bold shrink-0 w-4">{opt.key}.</span>
                                    <span className="leading-snug">{opt.text}</span>
                                  </div>
                                  {badgeContent && (
                                    <div className="self-end mt-1">
                                      {badgeContent}
                                    </div>
                                  )}
                                </div>
                              )
                            })}
                          </div>

                          {/* Footer Detail Soal */}
                          <div className="flex flex-wrap items-center justify-between text-[11px] text-zinc-500 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                            <div>
                              Pilihan Pelamar: <strong className={ans.isCorrect ? 'text-emerald-600' : 'text-red-600'}>Opsi {ans.selectedOption}</strong>
                            </div>
                            <div>
                              Kunci Jawaban: <strong className="text-emerald-600">Opsi {q.correctOption}</strong>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ) : (
                <div className="py-12 px-6 text-center space-y-4">
                  <div className="h-12 w-12 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-400 flex items-center justify-center mx-auto">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div className="max-w-md mx-auto space-y-1">
                    <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">
                      {applicant.status === 'TEST_SENT' 
                        ? 'Menunggu Pelamar Mengerjakan Tes' 
                        : 'Pelamar Belum Mengikuti Tes Akademik'}
                    </h3>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      {applicant.status === 'TEST_SENT'
                        ? 'Akses tes akademik online telah dibuka untuk pelamar ini. Hasil dan lembar jawaban akan otomatis muncul di sini setelah pelamar menuntaskan tes.'
                        : 'Kandidat ini belum diberikan akses atau belum memulai tes akademik. Anda dapat mengirimkan akses tes melalui tombol di samping.'}
                    </p>
                  </div>
                  {applicant.status !== 'TEST_SENT' && applicant.status !== 'TEST_COMPLETED' && (
                    <Button 
                      size="sm" 
                      onClick={() => handleSaveStatus('TEST_SENT')} 
                      disabled={loading}
                      className="bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold"
                    >
                      <Send className="mr-1.5 h-3.5 w-3.5" /> Kirim Akses Tes Akademik Sekarang
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Right Column: Manajemen Status & Lowongan (1 Span) */}
        <div className="space-y-6">

          {/* Card: Kelola Status Lamaran */}
          <div className="border border-[#E4E9E5] dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 overflow-hidden shadow-xs">
            <div className="border-b border-[#E4E9E5] dark:border-zinc-800 px-5 py-4 bg-zinc-50/50 dark:bg-zinc-900/50">
              <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">Manajemen Status Seleksi</h3>
              <p className="text-[11px] text-zinc-500 mt-0.5">Ubah status tahapan rekrutmen kandidat ini.</p>
            </div>

            <div className="p-5 space-y-5">
              {/* Quick Status Pill */}
              <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700/60 space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Status Sekarang</span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={`font-semibold text-xs border rounded-full px-2.5 py-0.5 ${currentStatusUI.color}`}>
                    {currentStatusUI.label}
                  </Badge>
                </div>
                <p className="text-[11px] text-zinc-500 leading-normal pt-1">
                  {currentStatusUI.desc}
                </p>
              </div>

              {/* Status Selector */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Pilih Status Baru</Label>
                <Select value={status} onValueChange={(val: any) => setStatus(val)}>
                  <SelectTrigger className="w-full text-xs font-medium border-zinc-300 dark:border-zinc-700">
                    <SelectValue placeholder="Pilih status lamaran" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING" className="text-xs">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-yellow-500" />
                        <span>Menunggu Review (PENDING)</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="REVIEWING" className="text-xs">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-blue-500" />
                        <span>Sedang Di-Review (REVIEWING)</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="TEST_SENT" className="text-xs">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-orange-500" />
                        <span>Kirim Akses Tes (TEST_SENT)</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="TEST_COMPLETED" className="text-xs">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-purple-500" />
                        <span>Tes Selesai (TEST_COMPLETED)</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="INTERVIEW" className="text-xs">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-indigo-500" />
                        <span>Tahap Wawancara (INTERVIEW)</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="ACCEPTED" className="text-xs">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-600" />
                        <span>Diterima Bekerja (ACCEPTED)</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="REJECTED" className="text-xs">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-red-600" />
                        <span>Tidak Lolos (REJECTED)</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>

                {/* Target status note */}
                <div className="text-[11px] text-zinc-500 bg-zinc-50 dark:bg-zinc-800/40 p-2.5 rounded border border-zinc-200 dark:border-zinc-700/60 leading-normal">
                  <span className="font-semibold text-zinc-700 dark:text-zinc-300">Catatan Sistem: </span>
                  {targetStatusUI.desc}
                </div>
              </div>

              {/* Action Button */}
              <Button 
                onClick={() => handleSaveStatus()} 
                disabled={loading || status === applicant.status} 
                className="w-full bg-[#079B49] hover:bg-[#075C35] text-white text-xs font-semibold shadow-xs h-9"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menyimpan Perubahan...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" /> Simpan Perubahan Status
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Card: Info Lowongan yang Dilamar */}
          <div className="border border-[#E4E9E5] dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 overflow-hidden shadow-xs">
            <div className="border-b border-[#E4E9E5] dark:border-zinc-800 px-5 py-4 bg-zinc-50/50 dark:bg-zinc-900/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-[#079B49]" />
                <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">Posisi Lowongan</h3>
              </div>
              <Badge variant="outline" className="text-[10px] bg-white dark:bg-zinc-800">
                {applicant.job.status}
              </Badge>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div>
                <span className="text-[11px] text-zinc-400 font-medium block">Jabatan</span>
                <div className="font-bold text-sm text-zinc-900 dark:text-zinc-100">{applicant.job.title}</div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <div>
                  <span className="text-[11px] text-zinc-400 font-medium block">Departemen</span>
                  <div className="font-medium text-zinc-700 dark:text-zinc-300">{applicant.job.department || '-'}</div>
                </div>
                <div>
                  <span className="text-[11px] text-zinc-400 font-medium block">Lokasi</span>
                  <div className="font-medium text-zinc-700 dark:text-zinc-300">{applicant.job.location || 'Surabaya'}</div>
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <Button asChild variant="outline" size="sm" className="w-full text-xs border-zinc-300 dark:border-zinc-700">
                  <Link href={`/karir/${applicant.job.slug}`} target="_blank">
                    Lihat Publikasi Lowongan <ExternalLink className="ml-1.5 h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Card: Petunjuk Evaluasi HRD */}
          <div className="border border-[#E4E9E5] dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100 font-semibold text-xs">
              <HelpCircle className="h-4 w-4 text-[#079B49]" /> Panduan Rekrutmen KKUSB
            </div>
            <ul className="text-[11px] text-zinc-500 space-y-2 list-disc pl-4 leading-relaxed">
              <li>Nilai standar kelulusan tes kompetensi akademik adalah minimal <strong>70 poin</strong>.</li>
              <li>Jika skor kandidat memenuhi kualifikasi, ubah status ke <strong>"Tahap Wawancara"</strong> untuk menghubungi via WA/Email.</li>
              <li>Pastikan memeriksa keaslian berkas CV sebelum menerbitkan penawaran kerja (Offering Letter).</li>
            </ul>
          </div>

        </div>

      </div>
    </div>
  )
}

