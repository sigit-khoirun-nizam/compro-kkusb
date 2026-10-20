'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Briefcase, 
  Building2, 
  MapPin, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  FileText, 
  ExternalLink, 
  ChevronDown, 
  ChevronUp, 
  GraduationCap, 
  Sparkles, 
  Phone, 
  Mail, 
  User, 
  ArrowRight, 
  HelpCircle, 
  Search, 
  Award, 
  ShieldCheck, 
  MessageSquare,
  AlertTriangle,
  Check,
  Send,
  Info,
  ClipboardList
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export interface ApplicantApplication {
  id: string
  name: string
  email: string
  phone: string | null
  cvUrl: string | null
  status: 'PENDING' | 'REVIEWING' | 'TEST_SENT' | 'TEST_COMPLETED' | 'INTERVIEW' | 'REJECTED' | 'ACCEPTED'
  testScore: number | null
  testStartedAt: string | null
  testCompletedAt: string | null
  createdAt: string
  updatedAt: string
  job: {
    id: string
    title: string
    slug: string
    department: string | null
    location: string | null
    type: string | null
    description: string
    requirements: string
    deadline: string | null
    tests: Array<{
      id: string
      title: string
      durationMinutes: number
      _count?: {
        questions: number
      }
    }>
  }
}

interface ApplicantDashboardViewProps {
  user: {
    name?: string | null
    email: string
  }
  applications: ApplicantApplication[]
  siteSettings: {
    phoneNumber?: string | null
    email?: string | null
    whatsapp?: string | null
  }
}

type TabFilter = 'ALL' | 'ACTION_REQUIRED' | 'IN_PROGRESS' | 'COMPLETED'

export default function ApplicantDashboardView({
  user,
  applications,
  siteSettings
}: ApplicantDashboardViewProps) {
  const [activeTab, setActiveTab] = useState<TabFilter>('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedAppIds, setExpandedAppIds] = useState<Record<string, boolean>>({})

  const toggleExpand = (id: string) => {
    setExpandedAppIds(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  // Action-required applications (TEST_SENT)
  const actionRequiredApps = applications.filter(a => a.status === 'TEST_SENT')
  
  // In-progress applications
  const inProgressApps = applications.filter(a => 
    a.status === 'PENDING' || a.status === 'REVIEWING' || a.status === 'TEST_COMPLETED' || a.status === 'INTERVIEW'
  )

  // Completed/Final applications
  const completedApps = applications.filter(a => 
    a.status === 'ACCEPTED' || a.status === 'REJECTED'
  )

  // Filtered applications based on active tab and search query
  const filteredApplications = applications.filter(app => {
    // Tab filtering
    if (activeTab === 'ACTION_REQUIRED' && app.status !== 'TEST_SENT') return false
    if (activeTab === 'IN_PROGRESS' && !['PENDING', 'REVIEWING', 'TEST_COMPLETED', 'INTERVIEW'].includes(app.status)) return false
    if (activeTab === 'COMPLETED' && !['ACCEPTED', 'REJECTED'].includes(app.status)) return false

    // Search query filtering
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase()
      const matchTitle = app.job.title.toLowerCase().includes(q)
      const matchDept = (app.job.department || '').toLowerCase().includes(q)
      const matchLoc = (app.job.location || '').toLowerCase().includes(q)
      return matchTitle || matchDept || matchLoc
    }

    return true
  })

  // Format Date in Indonesian
  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    } catch {
      return dateStr
    }
  }

  // Get Stepper Stages for an application
  const getPipelineSteps = (app: ApplicantApplication) => {
    const { status, testScore } = app

    // 1. Berkas Masuk
    const step1 = {
      title: 'Lamaran Terkirim',
      state: 'DONE' as const,
      desc: 'Berkas diterima sistem',
      badge: formatDate(app.createdAt)
    }

    // 2. Screening Berkas
    let step2State: 'DONE' | 'CURRENT' | 'UPCOMING' | 'FAILED' = 'UPCOMING'
    let step2Desc = 'Screening kualifikasi & CV'
    if (status === 'PENDING' || status === 'REVIEWING') {
      step2State = 'CURRENT'
      step2Desc = status === 'REVIEWING' ? 'Sedang diverifikasi Tim HR' : 'Dalam antrean review'
    } else if (['TEST_SENT', 'TEST_COMPLETED', 'INTERVIEW', 'ACCEPTED'].includes(status)) {
      step2State = 'DONE'
      step2Desc = 'Lolos seleksi berkas'
    } else if (status === 'REJECTED' && testScore === null) {
      step2State = 'FAILED'
      step2Desc = 'Belum lolos kualifikasi'
    }
    const step2 = {
      title: 'Seleksi Dokumen',
      state: step2State,
      desc: step2Desc
    }

    // 3. Tes Akademik
    let step3State: 'DONE' | 'CURRENT' | 'UPCOMING' | 'FAILED' = 'UPCOMING'
    let step3Desc = 'Tes kemampuan dasar online'
    if (status === 'TEST_SENT') {
      step3State = 'CURRENT'
      step3Desc = 'Siap dikerjakan'
    } else if (status === 'TEST_COMPLETED' || ['INTERVIEW', 'ACCEPTED'].includes(status)) {
      step3State = 'DONE'
      step3Desc = testScore !== null ? `Selesai (Skor: ${testScore}/100)` : 'Tes selesai'
    } else if (status === 'REJECTED' && testScore !== null) {
      step3State = 'FAILED'
      step3Desc = `Skor: ${testScore}/100`
    }
    const step3 = {
      title: 'Tes Akademik',
      state: step3State,
      desc: step3Desc
    }

    // 4. Wawancara (Interview)
    let step4State: 'DONE' | 'CURRENT' | 'UPCOMING' | 'FAILED' = 'UPCOMING'
    let step4Desc = 'Sesi interview HR & User'
    if (status === 'INTERVIEW') {
      step4State = 'CURRENT'
      step4Desc = 'Tahap wawancara aktif'
    } else if (status === 'ACCEPTED') {
      step4State = 'DONE'
      step4Desc = 'Lolos sesi wawancara'
    } else if (status === 'TEST_COMPLETED') {
      step4State = 'UPCOMING'
      step4Desc = 'Menunggu jadwal wawancara'
    } else if (status === 'REJECTED' && testScore !== null) {
      step4State = 'FAILED'
      step4Desc = 'Belum memenuhi kuota'
    }
    const step4 = {
      title: 'Wawancara Kerja',
      state: step4State,
      desc: step4Desc
    }

    // 5. Keputusan Akhir
    let step5State: 'DONE' | 'CURRENT' | 'UPCOMING' | 'FAILED' = 'UPCOMING'
    let step5Desc = 'Pengumuman hasil akhir'
    if (status === 'ACCEPTED') {
      step5State = 'DONE'
      step5Desc = 'Selamat, Anda Diterima!'
    } else if (status === 'REJECTED') {
      step5State = 'FAILED'
      step5Desc = 'Kualifikasi belum sesuai'
    }
    const step5 = {
      title: 'Hasil Akhir',
      state: step5State,
      desc: step5Desc
    }

    return [step1, step2, step3, step4, step5]
  }

  // Get Primary Status Presentation
  const getStatusPresentation = (status: ApplicantApplication['status']) => {
    switch (status) {
      case 'PENDING':
        return {
          title: 'Menunggu Screening',
          badgeColor: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800',
          icon: Clock,
          summary: 'Lamaran Anda telah diterima di sistem KKUSB dan sedang berada di antrean peninjauan awal.',
          nextActionText: 'Tidak ada tindakan diperlukan saat ini. Tim Rekrutmen KKUSB akan memverifikasi kesesuaian berkas dan kualifikasi Anda.'
        }
      case 'REVIEWING':
        return {
          title: 'Sedang Diverifikasi HR',
          badgeColor: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800',
          icon: FileText,
          summary: 'Tim Rekrutmen KKUSB sedang meneliti detail CV dan dokumen lamaran kerja Anda.',
          nextActionText: 'Jika kualifikasi Anda sesuai, akses undangan Tes Akademik Online akan langsung aktif di halaman dashboard ini.'
        }
      case 'TEST_SENT':
        return {
          title: 'Tes Akademik Terbuka',
          badgeColor: 'bg-orange-500 text-white border-orange-600 animate-pulse',
          icon: AlertCircle,
          summary: 'Selamat! Berkas Anda dinyatakan lolos tahap administrasi awal dan Anda diundang mengerjakan Tes Akademik Online.',
          nextActionText: 'Silakan klik tombol "Mulai Tes Akademik Sekarang" di bawah ini. Pastikan Anda berada di tempat yang kondusif dan memiliki koneksi internet stabil.'
        }
      case 'TEST_COMPLETED':
        return {
          title: 'Tes Selesai Diselesaikan',
          badgeColor: 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800',
          icon: CheckCircle2,
          summary: 'Anda telah menyelesaikan Tes Akademik Online dan jawaban Anda sudah terekam di sistem kami.',
          nextActionText: 'Tim HR KKUSB sedang merekap nilai seluruh kandidat. Pelamar dengan perolehan nilai terbaik akan dihubungi untuk penjadwalan sesi wawancara.'
        }
      case 'INTERVIEW':
        return {
          title: 'Tahap Wawancara Kerja',
          badgeColor: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
          icon: GraduationCap,
          summary: 'Selamat! Anda berhasil lolos tahap tes akademik dan berhak melanjutkan ke sesi wawancara kerja (Interview).',
          nextActionText: 'Jadwal dan instruksi wawancara (onsite / online meeting) akan dikirimkan ke email atau nomor WhatsApp Anda. Mohon pastikan kontak Anda aktif.'
        }
      case 'ACCEPTED':
        return {
          title: 'Selamat, Anda Diterima!',
          badgeColor: 'bg-green-600 text-white border-green-700',
          icon: CheckCircle2,
          summary: 'Selamat! Anda secara resmi dinyatakan lolos seleksi penerimaan karyawan di KKUSB.',
          nextActionText: 'Tim HR KKUSB akan segera menghubungi Anda melalui email untuk pengiriman Surat Penawaran Kerja (Offering Letter) dan detail orientasi.'
        }
      case 'REJECTED':
        return {
          title: 'Belum Lolos Seleksi',
          badgeColor: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700',
          icon: XCircle,
          summary: 'Terima kasih atas partisipasi Anda dalam proses seleksi penerimaan karyawan di KKUSB.',
          nextActionText: 'Saat ini profil Anda belum sesuai dengan kebutuhan spesifik posisi ini. Namun data Anda tetap tersimpan dalam basis data talent pool kami untuk peluang karir di masa mendatang.'
        }
    }
  }

  return (
    <div className="space-y-8">

      {/* =========================================================================
          1. HEADER & WELCOME CARD
      ========================================================================= */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 text-white p-6 sm:p-8 border border-zinc-800 shadow-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-[#079B49]/20 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#079B49]/20 border border-[#079B49]/40 text-xs font-bold text-emerald-400">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Portal Rekrutmen KKUSB Resmi</span>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Halo, {user.name || user.email.split('@')[0]}!
              </h1>
              <p className="text-xs sm:text-sm text-zinc-300 mt-1 max-w-2xl leading-relaxed">
                Pantau seluruh perkembangan berkas lamaran, jadwal tes akademik, dan tahapan seleksi karir Anda di Koperasi Jasa Karyawan Usaha Sejahtera Bersama.
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-zinc-400">
              <span className="flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-zinc-400" />
                {user.email}
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                Akun Terverifikasi
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <Button asChild className="bg-[#079B49] hover:bg-[#075C35] text-white rounded-full font-bold shadow-lg shadow-green-900/40 px-5">
              <Link href="/portal-pelamar/dashboard/lowongan">
                <Briefcase className="h-4 w-4 mr-2" />
                Cari Lowongan Lain
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          2. URGENT CALLOUT: ACTION REQUIRED (TEST ACTIVE)
      ========================================================================= */}
      {actionRequiredApps.length > 0 && (
        <div className="rounded-3xl border-2 border-orange-500 bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-transparent dark:from-orange-950/40 dark:via-zinc-900 dark:to-zinc-900 p-6 sm:p-7 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-md">
                <AlertCircle className="h-6 w-6 animate-pulse" />
              </div>
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950/80 text-orange-800 dark:text-orange-300 text-xs font-black">
                  TINDAKAN DIPERLUKAN
                </div>
                <h3 className="text-lg font-black text-zinc-900 dark:text-zinc-100">
                  Undangan Tes Akademik Menunggu Anda!
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 max-w-xl leading-relaxed">
                  Lamaran Anda untuk posisi <strong>{actionRequiredApps[0].job.title}</strong> telah lolos screening. Silakan kerjakan tes akademik online sekarang untuk melanjutkan ke tahapan wawancara.
                </p>
                {actionRequiredApps[0].job.tests?.[0] && (
                  <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-medium text-zinc-600 dark:text-zinc-400">
                    <span className="flex items-center gap-1.5">
                      <GraduationCap className="h-4 w-4 text-orange-600" />
                      {actionRequiredApps[0].job.tests[0].title}
                    </span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-orange-600" />
                      Durasi: {actionRequiredApps[0].job.tests[0].durationMinutes} Menit
                    </span>
                    {actionRequiredApps[0].job.tests[0]._count?.questions !== undefined && (
                      <>
                        <span>&bull;</span>
                        <span>{actionRequiredApps[0].job.tests[0]._count.questions} Soal Pilihan Ganda</span>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            <Button asChild size="lg" className="bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-black shadow-lg shadow-orange-600/30 px-6 shrink-0 text-sm">
              <Link href={`/portal-pelamar/tes-akademik/${actionRequiredApps[0].id}`}>
                Kerjakan Tes Sekarang
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      )}

      {/* =========================================================================
          3. METRICS / STATS OVERVIEW CARDS
      ========================================================================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total Lamaran */}
        <div 
          onClick={() => setActiveTab('ALL')}
          className={cn(
            "p-5 rounded-2xl border transition-all cursor-pointer",
            activeTab === 'ALL'
              ? "bg-white dark:bg-zinc-900 border-[#079B49] shadow-md ring-2 ring-[#079B49]/20"
              : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300"
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400">Total Lamaran</span>
            <div className="h-8 w-8 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center justify-center">
              <FileText className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-100">
            {applications.length}
          </div>
          <p className="text-[11px] text-zinc-400 mt-1">Seluruh berkas terkirim</p>
        </div>

        {/* Card 2: Undangan Tes (Action Required) */}
        <div 
          onClick={() => setActiveTab('ACTION_REQUIRED')}
          className={cn(
            "p-5 rounded-2xl border transition-all cursor-pointer relative",
            activeTab === 'ACTION_REQUIRED'
              ? "bg-white dark:bg-zinc-900 border-orange-500 shadow-md ring-2 ring-orange-500/20"
              : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300"
          )}
        >
          {actionRequiredApps.length > 0 && (
            <span className="absolute -top-1.5 -right-1.5 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
            </span>
          )}
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400">Undangan Tes</span>
            <div className="h-8 w-8 rounded-xl bg-orange-50 dark:bg-orange-950/50 text-orange-600 flex items-center justify-center">
              <AlertCircle className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-orange-600 dark:text-orange-400">
            {actionRequiredApps.length}
          </div>
          <p className="text-[11px] text-zinc-400 mt-1">Perlu Anda kerjakan</p>
        </div>

        {/* Card 3: Dalam Proses */}
        <div 
          onClick={() => setActiveTab('IN_PROGRESS')}
          className={cn(
            "p-5 rounded-2xl border transition-all cursor-pointer",
            activeTab === 'IN_PROGRESS'
              ? "bg-white dark:bg-zinc-900 border-blue-500 shadow-md ring-2 ring-blue-500/20"
              : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300"
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400">Dalam Proses</span>
            <div className="h-8 w-8 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-100">
            {inProgressApps.length}
          </div>
          <p className="text-[11px] text-zinc-400 mt-1">Screening & evaluasi</p>
        </div>

        {/* Card 4: Keputusan Akhir */}
        <div 
          onClick={() => setActiveTab('COMPLETED')}
          className={cn(
            "p-5 rounded-2xl border transition-all cursor-pointer",
            activeTab === 'COMPLETED'
              ? "bg-white dark:bg-zinc-900 border-emerald-500 shadow-md ring-2 ring-emerald-500/20"
              : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300"
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400">Keputusan Akhir</span>
            <div className="h-8 w-8 rounded-xl bg-green-50 dark:bg-green-950/50 text-[#079B49] flex items-center justify-center">
              <Award className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-100">
            {completedApps.length}
          </div>
          <p className="text-[11px] text-zinc-400 mt-1">Diterima / Selesai</p>
        </div>

      </div>

      {/* =========================================================================
          4. FILTER TABS & SEARCH BAR
      ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-zinc-100 dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab('ALL')}
            className={cn(
              "px-3.5 py-2 rounded-xl transition-all whitespace-nowrap",
              activeTab === 'ALL'
                ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-xs"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
            )}
          >
            Semua ({applications.length})
          </button>
          
          <button
            onClick={() => setActiveTab('ACTION_REQUIRED')}
            className={cn(
              "px-3.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5",
              activeTab === 'ACTION_REQUIRED'
                ? "bg-white dark:bg-zinc-800 text-orange-600 dark:text-orange-400 shadow-xs"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
            )}
          >
            <span>Perlu Tes</span>
            {actionRequiredApps.length > 0 && (
              <span className="h-5 px-1.5 rounded-full bg-orange-500 text-white text-[10px] font-black flex items-center justify-center">
                {actionRequiredApps.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('IN_PROGRESS')}
            className={cn(
              "px-3.5 py-2 rounded-xl transition-all whitespace-nowrap",
              activeTab === 'IN_PROGRESS'
                ? "bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-xs"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
            )}
          >
            Dalam Proses ({inProgressApps.length})
          </button>

          <button
            onClick={() => setActiveTab('COMPLETED')}
            className={cn(
              "px-3.5 py-2 rounded-xl transition-all whitespace-nowrap",
              activeTab === 'COMPLETED'
                ? "bg-white dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400 shadow-xs"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
            )}
          >
            Selesai ({completedApps.length})
          </button>
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Cari posisi pekerjaan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-[#079B49]/30 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400"
          />
        </div>

      </div>

      {/* =========================================================================
          5. APPLICATIONS LIST WITH STEPPED RECRUITMENT PIPELINE
      ========================================================================= */}
      <div className="space-y-6">
        {filteredApplications.length > 0 ? (
          filteredApplications.map((app) => {
            const statusInfo = getStatusPresentation(app.status)
            const StatusIcon = statusInfo.icon
            const pipeline = getPipelineSteps(app)
            const isExpanded = !!expandedAppIds[app.id]

            return (
              <div 
                key={app.id} 
                className={cn(
                  "bg-white dark:bg-zinc-900 border rounded-3xl shadow-xs transition-all overflow-hidden",
                  app.status === 'TEST_SENT' 
                    ? "border-orange-300 dark:border-orange-800/80 shadow-orange-500/5 ring-1 ring-orange-400/30"
                    : app.status === 'ACCEPTED'
                    ? "border-green-300 dark:border-green-800 shadow-green-500/5"
                    : "border-zinc-200 dark:border-zinc-800"
                )}
              >
                
                {/* Application Header & Job Information */}
                <div className="p-6 sm:p-7 border-b border-zinc-100 dark:border-zinc-800/80">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge 
                          variant="outline" 
                          className={cn("px-3 py-1 font-bold rounded-full text-xs flex items-center gap-1.5 border", statusInfo.badgeColor)}
                        >
                          <StatusIcon className="h-3.5 w-3.5" />
                          <span>{statusInfo.title}</span>
                        </Badge>

                        {app.testScore !== null && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800 text-xs font-black text-purple-700 dark:text-purple-300">
                            <Award className="h-3.5 w-3.5" />
                            Skor Tes: {app.testScore}/100
                          </span>
                        )}

                        <span className="text-xs text-zinc-400 dark:text-zinc-500">
                          Diajukan: {formatDate(app.createdAt)}
                        </span>
                      </div>

                      <h2 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
                        {app.job.title}
                      </h2>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
                        {app.job.department && (
                          <span className="flex items-center gap-1">
                            <Building2 className="h-3.5 w-3.5 text-zinc-400" />
                            {app.job.department}
                          </span>
                        )}
                        {app.job.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5 text-zinc-400" />
                            {app.job.location}
                          </span>
                        )}
                        {app.job.type && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5 text-zinc-400" />
                            {app.job.type}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quick CTA on the right */}
                    <div className="flex items-center gap-3 pt-2 lg:pt-0">
                      {app.status === 'TEST_SENT' ? (
                        <Button asChild className="bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold shadow-md shadow-orange-600/30 px-5">
                          <Link href={`/portal-pelamar/tes-akademik/${app.id}`}>
                            Mulai Tes Akademik
                            <ArrowRight className="h-4 w-4 ml-1.5" />
                          </Link>
                        </Button>
                      ) : (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => toggleExpand(app.id)}
                          className="rounded-xl border-zinc-200 dark:border-zinc-800 text-xs font-semibold gap-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        >
                          <span>{isExpanded ? 'Tutup Rincian' : 'Rincian Berkas'}</span>
                          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </Button>
                      )}
                    </div>

                  </div>
                </div>

                {/* =============================================================
                    VISUAL RECRUITMENT STEPPER PIPELINE (Menghilangkan Kerancuan)
                ============================================================= */}
                <div className="p-6 sm:p-7 bg-zinc-50/50 dark:bg-zinc-950/40 border-b border-zinc-100 dark:border-zinc-800/80">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      Tahapan Seleksi Rekrutmen KKUSB
                    </span>
                    <span className="text-xs font-medium text-zinc-500">
                      Alur transparan & real-time
                    </span>
                  </div>

                  {/* Horizontal Responsive Stepper */}
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 sm:gap-2">
                    {pipeline.map((step, idx) => {
                      const isDone = step.state === 'DONE'
                      const isCurrent = step.state === 'CURRENT'
                      const isFailed = step.state === 'FAILED'

                      return (
                        <div 
                          key={idx} 
                          className={cn(
                            "relative flex sm:flex-col items-center sm:items-start gap-3 sm:gap-2 p-3 rounded-2xl border transition-all",
                            isCurrent
                              ? "bg-white dark:bg-zinc-900 border-[#079B49] shadow-sm ring-1 ring-[#079B49]/30"
                              : isDone
                              ? "bg-green-50/40 dark:bg-green-950/20 border-green-200 dark:border-green-900/60"
                              : isFailed
                              ? "bg-red-50/50 dark:bg-red-950/20 border-red-200 dark:border-red-900/60"
                              : "bg-white/60 dark:bg-zinc-900/40 border-zinc-200/80 dark:border-zinc-800 opacity-70"
                          )}
                        >
                          {/* Step Indicator Icon */}
                          <div className="flex items-center justify-center shrink-0">
                            {isDone ? (
                              <div className="h-7 w-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                                <Check className="h-4 w-4 stroke-[3]" />
                              </div>
                            ) : isCurrent ? (
                              <div className="h-7 w-7 rounded-full bg-[#079B49] text-white flex items-center justify-center ring-4 ring-green-500/20 shadow-xs">
                                <span className="text-xs font-bold">{idx + 1}</span>
                              </div>
                            ) : isFailed ? (
                              <div className="h-7 w-7 rounded-full bg-red-500 text-white flex items-center justify-center shadow-xs">
                                <XCircle className="h-4 w-4" />
                              </div>
                            ) : (
                              <div className="h-7 w-7 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-500 flex items-center justify-center text-xs font-bold">
                                {idx + 1}
                              </div>
                            )}
                          </div>

                          {/* Step Content */}
                          <div className="flex-1 min-w-0">
                            <p className={cn(
                              "text-xs font-bold truncate",
                              isCurrent ? "text-[#079B49] dark:text-emerald-400" : isDone ? "text-zinc-900 dark:text-zinc-100" : isFailed ? "text-red-600 dark:text-red-400" : "text-zinc-500 dark:text-zinc-400"
                            )}>
                              {step.title}
                            </p>
                            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                              {step.desc}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* =============================================================
                    CONTEXTUAL ACTION & EXPLANATION BOX (No More Confusion)
                ============================================================= */}
                <div className="p-6 sm:p-7 space-y-4">
                  
                  <div className="p-4 sm:p-5 rounded-2xl bg-zinc-100/70 dark:bg-zinc-800/60 border border-zinc-200/70 dark:border-zinc-700/60 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-zinc-900 dark:text-zinc-100">
                      <Info className="h-4 w-4 text-[#079B49]" />
                      <span>Penjelasan Status & Langkah Anda</span>
                    </div>
                    <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                      {statusInfo.summary}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 pt-1 border-t border-zinc-200/50 dark:border-zinc-700/50 leading-relaxed">
                      <strong>Langkah Selanjutnya:</strong> {statusInfo.nextActionText}
                    </p>
                  </div>

                  {/* If Test Sent, Big Action Panel */}
                  {app.status === 'TEST_SENT' && (
                    <div className="rounded-2xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <h4 className="text-sm font-black text-orange-900 dark:text-orange-200">
                          Tes Akademik Sudah Siap Dikerjakan
                        </h4>
                        <p className="text-xs text-orange-700 dark:text-orange-300">
                          Uji kompetensi dasar pilihan ganda. Jawaban akan langsung dikoreksi otomatis oleh sistem.
                        </p>
                      </div>
                      <Button asChild className="bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold shadow-md shadow-orange-600/30 px-6 shrink-0">
                        <Link href={`/portal-pelamar/tes-akademik/${app.id}`}>
                          Mulai Tes Sekarang
                          <ArrowRight className="h-4 w-4 ml-1.5" />
                        </Link>
                      </Button>
                    </div>
                  )}

                  {/* Toggle Button for Details */}
                  <div className="pt-2 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => toggleExpand(app.id)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:text-[#079B49] dark:hover:text-emerald-400 transition-colors"
                    >
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      <span>{isExpanded ? 'Sembunyikan Informasi Berkas & Lowongan' : 'Lihat Informasi Berkas & Lowongan yang Dilamar'}</span>
                    </button>

                    <span className="text-[11px] text-zinc-400">
                      ID Lamaran: <code className="font-mono">{app.id.slice(-8)}</code>
                    </span>
                  </div>

                  {/* Collapsible Details Panel */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800 space-y-4 text-xs">
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        
                        {/* Data Pelamar & Dokumen */}
                        <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 space-y-3">
                          <h4 className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                            <User className="h-3.5 w-3.5 text-[#079B49]" />
                            Data Pelamar yang Terdaftar
                          </h4>
                          <div className="space-y-2 text-zinc-600 dark:text-zinc-400">
                            <div>
                              <span className="text-[11px] text-zinc-400 block">Nama Lengkap:</span>
                              <strong className="text-zinc-900 dark:text-zinc-200">{app.name}</strong>
                            </div>
                            <div>
                              <span className="text-[11px] text-zinc-400 block">Email:</span>
                              <span>{app.email}</span>
                            </div>
                            <div>
                              <span className="text-[11px] text-zinc-400 block">Nomor Telepon / WhatsApp:</span>
                              <span>{app.phone || 'Tidak dicantumkan'}</span>
                            </div>
                            <div>
                              <span className="text-[11px] text-zinc-400 block">Dokumen CV / Resume:</span>
                              {app.cvUrl ? (
                                <a 
                                  href={app.cvUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 mt-1 px-3 py-1.5 rounded-lg bg-zinc-200 dark:bg-zinc-800 hover:bg-[#079B49] hover:text-white dark:hover:bg-[#079B49] text-zinc-900 dark:text-zinc-200 font-bold transition-colors"
                                >
                                  <FileText className="h-3.5 w-3.5" />
                                  <span>Unduh / Pratinjau CV (PDF)</span>
                                  <ExternalLink className="h-3 w-3 ml-0.5" />
                                </a>
                              ) : (
                                <span className="text-zinc-400 italic">Tidak ada lampiran dokumen</span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Ringkasan Posisi Kerja */}
                        <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 space-y-3">
                          <h4 className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                            <Briefcase className="h-3.5 w-3.5 text-[#079B49]" />
                            Spesifikasi Lowongan Pekerjaan
                          </h4>
                          <div className="space-y-2 text-zinc-600 dark:text-zinc-400">
                            <div>
                              <span className="text-[11px] text-zinc-400 block">Posisi & Departemen:</span>
                              <span className="font-semibold text-zinc-900 dark:text-zinc-200">{app.job.title} ({app.job.department || 'Umum'})</span>
                            </div>
                            <div>
                              <span className="text-[11px] text-zinc-400 block">Lokasi Penempatan & Tipe:</span>
                              <span>{app.job.location || 'Gresik / Jawa Timur'} &bull; {app.job.type || 'Penuh Waktu'}</span>
                            </div>
                            <div>
                              <span className="text-[11px] text-zinc-400 block">Tautan Halaman Lowongan:</span>
                              <Link 
                                href="/portal-pelamar/dashboard/lowongan"
                                className="inline-flex items-center gap-1 text-[#079B49] hover:underline font-semibold mt-0.5"
                              >
                                <span>Buka halaman lowongan karir</span>
                                <ExternalLink className="h-3 w-3" />
                              </Link>
                            </div>
                          </div>
                        </div>

                      </div>

                    </div>
                  )}

                </div>

              </div>
            )
          })
        ) : (
          /* Empty state */
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-12 sm:p-16 text-center shadow-xs">
            <div className="h-16 w-16 rounded-2xl bg-green-50 dark:bg-green-950/40 text-[#079B49] flex items-center justify-center mx-auto mb-4 border border-green-100 dark:border-green-800">
              <ClipboardList className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-black text-zinc-900 dark:text-zinc-100 mb-2">
              {searchQuery ? 'Tidak Ditemukan Lamaran yang Sesuai' : 'Belum Ada Lamaran Terkirim'}
            </h3>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mb-6 max-w-md mx-auto leading-relaxed">
              {searchQuery 
                ? `Tidak ada posisi yang cocok dengan kata kunci "${searchQuery}". Coba gunakan kata kunci lain.`
                : `Anda belum mengajukan lamaran kerja dengan email ${user.email}. Temukan peluang karir yang sesuai dengan kompetensi Anda sekarang.`}
            </p>
            {searchQuery ? (
              <Button 
                variant="outline" 
                onClick={() => setSearchQuery('')}
                className="rounded-full text-xs font-bold"
              >
                Hapus Pencarian
              </Button>
            ) : (
              <Button asChild className="bg-[#079B49] text-white hover:bg-[#075C35] rounded-full font-bold px-6 shadow-md">
                <Link href="/portal-pelamar/dashboard/lowongan">
                  Lihat Lowongan Karir Tersedia
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            )}
          </div>
        )}
      </div>

      {/* =========================================================================
          6. FAQ & RECRUITMENT SUPPORT (Pusat Bantuan Pelamar)
      ========================================================================= */}
      <div className="rounded-3xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-[#079B49]">
              <HelpCircle className="h-4 w-4" />
              <span>Panduan & Informasi Rekrutmen</span>
            </div>
            <h3 className="text-lg font-black text-zinc-900 dark:text-zinc-100">
              Pertanyaan yang Sering Diajukan (FAQ)
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Pahami alur seleksi agar proses rekrutmen Anda di KKUSB berjalan lancar dan terarah.
            </p>
          </div>

          {siteSettings.whatsapp && (
            <Button asChild variant="outline" size="sm" className="rounded-xl border-zinc-200 dark:border-zinc-700 text-xs font-semibold gap-1.5 self-start sm:self-auto">
              <a 
                href={`https://wa.me/${siteSettings.whatsapp.replace(/[^0-9]/g, '')}?text=Halo%20Tim%20HR%20KKUSB,%20saya%20ingin%20bertanya%20mengenai%20status%20lamaran%20kerja%20saya`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageSquare className="h-3.5 w-3.5 text-emerald-600" />
                <span>Hubungi HR via WhatsApp</span>
              </a>
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          
          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800 space-y-1.5">
            <h4 className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-[#079B49]" />
              Berapa lama proses seleksi berkas?
            </h4>
            <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Tim HR KKUSB memverifikasi berkas lamaran dalam waktu 3 hingga 7 hari kerja. Anda dapat memantau status secara berkala langsung di dashboard ini.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800 space-y-1.5">
            <h4 className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
              <GraduationCap className="h-3.5 w-3.5 text-[#079B49]" />
              Apakah Tes Akademik memiliki batas waktu?
            </h4>
            <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Ya, setiap tes akademik memiliki timer penghitung mundur (biasanya 30-60 menit). Timer akan otomatis dimulai saat Anda menekan tombol "Mulai Tes".
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800 space-y-1.5">
            <h4 className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5 text-orange-600" />
              Bagaimana jika koneksi terputus saat tes?
            </h4>
            <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Jawaban pilihan Anda tersimpan sementara di browser. Jika terjadi gangguan jaringan, segera muat ulang (refresh) halaman sebelum waktu pengerjaan habis.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800 space-y-1.5">
            <h4 className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 text-blue-600" />
              Bagaimana pengumuman wawancara kerja?
            </h4>
            <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Kandidat yang lolos tes akademik akan menerima jadwal wawancara melalui email resmi KKUSB atau pesan WhatsApp ke nomor yang Anda daftarkan.
            </p>
          </div>

        </div>

      </div>

    </div>
  )
}
