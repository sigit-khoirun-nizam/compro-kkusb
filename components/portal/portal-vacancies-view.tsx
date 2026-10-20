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
  ArrowRight, 
  Search, 
  Filter, 
  GraduationCap, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  FileText,
  Sparkles,
  Info
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export interface PortalJobItem {
  id: string
  title: string
  slug: string
  department: string | null
  location: string | null
  type: string | null
  description: string
  requirements: string[]
  deadline: string | null
  postedDate?: string
  hasTest?: boolean
  appliedStatus?: {
    applicationId: string
    status: string
    testScore: number | null
    appliedAt: string
  } | null
}

interface PortalVacanciesViewProps {
  jobs: PortalJobItem[]
  applicantEmail: string
}

export default function PortalVacanciesView({
  jobs,
  applicantEmail
}: PortalVacanciesViewProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('ALL')
  const [expandedJobIds, setExpandedJobIds] = useState<Record<string, boolean>>({})

  const toggleExpand = (id: string) => {
    setExpandedJobIds(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  // Get unique departments for filter
  const departments = ['ALL', ...Array.from(new Set(jobs.map(j => j.department).filter(Boolean) as string[]))]

  // Filter jobs
  const filteredJobs = jobs.filter(job => {
    if (selectedDepartment !== 'ALL' && job.department !== selectedDepartment) {
      return false
    }

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase()
      const matchTitle = job.title.toLowerCase().includes(q)
      const matchDept = (job.department || '').toLowerCase().includes(q)
      const matchLoc = (job.location || '').toLowerCase().includes(q)
      const matchReq = job.requirements.some(r => r.toLowerCase().includes(q))
      return matchTitle || matchDept || matchLoc || matchReq
    }

    return true
  })

  // Format Status label for already applied jobs
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'PENDING':
        return { label: 'Menunggu Screening', color: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800' }
      case 'REVIEWING':
        return { label: 'Sedang Diverifikasi', color: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800' }
      case 'TEST_SENT':
        return { label: 'Tes Akademik Terbuka', color: 'bg-orange-500 text-white border-orange-600 animate-pulse' }
      case 'TEST_COMPLETED':
        return { label: 'Tes Selesai', color: 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800' }
      case 'INTERVIEW':
        return { label: 'Tahap Wawancara', color: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' }
      case 'ACCEPTED':
        return { label: 'Selamat, Diterima!', color: 'bg-green-600 text-white border-green-700' }
      case 'REJECTED':
        return { label: 'Belum Lolos', color: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700' }
      default:
        return { label: status, color: 'bg-zinc-100 text-zinc-700 border-zinc-200' }
    }
  }

  return (
    <div className="space-y-8">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 text-white p-6 sm:p-8 border border-zinc-800 shadow-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-[#079B49]/20 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#079B49]/20 border border-[#079B49]/40 text-xs font-bold text-emerald-400">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Peluang Karir & Rekrutmen Resmi</span>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Lowongan Karir KKUSB
              </h1>
              <p className="text-xs sm:text-sm text-zinc-300 mt-1 max-w-2xl leading-relaxed">
                Pilih posisi pekerjaan yang sesuai dengan kualifikasi dan keahlian Anda. Ajukan lamaran langsung menggunakan akun pelamar Anda ({applicantEmail}).
              </p>
            </div>
          </div>

          <Button asChild variant="outline" className="border-zinc-700 hover:bg-zinc-800 text-white rounded-full font-bold self-start md:self-auto">
            <Link href="/portal-pelamar/dashboard">
              <FileText className="h-4 w-4 mr-2 text-[#079B49]" />
              Lihat Lamaran Saya
            </Link>
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Department Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 text-xs font-bold scrollbar-none">
          <span className="text-zinc-400 shrink-0 flex items-center gap-1 text-[11px] uppercase tracking-wider pl-1">
            <Filter className="h-3.5 w-3.5" /> Filter:
          </span>
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDepartment(dept)}
              className={cn(
                "px-3.5 py-2 rounded-xl transition-all whitespace-nowrap",
                selectedDepartment === dept
                  ? "bg-[#079B49] text-white shadow-xs font-bold"
                  : "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700"
              )}
            >
              {dept === 'ALL' ? 'Semua Departemen' : dept}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Cari lowongan, keahlian, kota..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-[#079B49]/30 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400"
          />
        </div>

      </div>

      {/* Vacancies List */}
      <div className="space-y-6">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => {
            const isExpanded = !!expandedJobIds[job.id]
            const isApplied = !!job.appliedStatus
            const statusBadge = isApplied ? getStatusBadge(job.appliedStatus!.status) : null

            return (
              <div 
                key={job.id} 
                className={cn(
                  "bg-white dark:bg-zinc-900 border rounded-3xl p-6 sm:p-8 shadow-xs transition-all",
                  isApplied
                    ? "border-emerald-300 dark:border-emerald-800/80 bg-gradient-to-br from-green-50/20 via-white to-white dark:from-green-950/10 dark:via-zinc-900 dark:to-zinc-900"
                    : "border-zinc-200 dark:border-zinc-800 hover:border-[#079B49]/40 hover:shadow-md"
                )}
              >
                
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  
                  <div className="space-y-3 flex-1">
                    
                    <div className="flex flex-wrap items-center gap-2">
                      {isApplied && statusBadge ? (
                        <Badge variant="outline" className={cn("px-3 py-1 font-bold rounded-full text-xs flex items-center gap-1.5 border", statusBadge.color)}>
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Sudah Dilamar ({statusBadge.label})</span>
                        </Badge>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 dark:bg-green-950/40 text-[#079B49] text-xs font-bold border border-green-200 dark:border-green-800">
                          <Sparkles className="h-3 w-3" />
                          Posisi Terbuka
                        </span>
                      )}

                      {job.hasTest && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400 text-xs font-medium border border-orange-200 dark:border-orange-800">
                          <GraduationCap className="h-3 w-3" />
                          Ada Tes Akademik
                        </span>
                      )}

                      {job.deadline && (
                        <span className="text-xs text-zinc-400 dark:text-zinc-500 flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          Batas: {job.deadline}
                        </span>
                      )}
                    </div>

                    <div>
                      <h2 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
                        {job.title}
                      </h2>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                        {job.department && (
                          <span className="flex items-center gap-1">
                            <Building2 className="h-3.5 w-3.5 text-zinc-400" />
                            {job.department}
                          </span>
                        )}
                        {job.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5 text-zinc-400" />
                            {job.location}
                          </span>
                        )}
                        {job.type && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5 text-zinc-400" />
                            {job.type}
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-3xl line-clamp-2">
                      {job.description}
                    </p>

                  </div>

                  {/* Actions Column */}
                  <div className="flex flex-col sm:flex-row lg:flex-col items-stretch lg:items-end gap-3 shrink-0">
                    {isApplied ? (
                      <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-sm px-6">
                        <Link href="/portal-pelamar/dashboard">
                          <Check className="h-4 w-4 mr-1.5" />
                          Pantau Status Lamaran
                        </Link>
                      </Button>
                    ) : (
                      <Button asChild className="bg-[#079B49] hover:bg-[#075C35] text-white rounded-xl font-bold shadow-md shadow-green-900/20 px-6">
                        <Link href={`/portal-pelamar/dashboard/lamar/${job.slug}`}>
                          Lamar Posisi Ini
                          <ArrowRight className="h-4 w-4 ml-1.5" />
                        </Link>
                      </Button>
                    )}

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleExpand(job.id)}
                      className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-xl"
                    >
                      <span>{isExpanded ? 'Tutup Kualifikasi' : 'Lihat Persyaratan Lengkap'}</span>
                      {isExpanded ? <ChevronUp className="h-3.5 w-3.5 ml-1" /> : <ChevronDown className="h-3.5 w-3.5 ml-1" />}
                    </Button>
                  </div>

                </div>

                {/* Collapsible Requirements and Job Description */}
                {isExpanded && (
                  <div className="mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-800 space-y-4 animate-in fade-in-50 duration-200">
                    <div>
                      <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Info className="h-4 w-4 text-[#079B49]" />
                        Deskripsi Pekerjaan
                      </h4>
                      <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 whitespace-pre-line leading-relaxed">
                        {job.description}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                        <CheckCircle2 className="h-4 w-4 text-[#079B49]" />
                        Kualifikasi & Persyaratan
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                        {job.requirements.map((req, rIdx) => (
                          <div key={rIdx} className="flex items-start gap-2 p-2 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/60 dark:border-zinc-800">
                            <Check className="h-3.5 w-3.5 text-[#079B49] shrink-0 mt-0.5" />
                            <span className="text-zinc-700 dark:text-zinc-300 leading-normal">{req}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {!isApplied && (
                      <div className="pt-2 flex justify-end">
                        <Button asChild className="bg-[#079B49] hover:bg-[#075C35] text-white rounded-xl font-bold shadow-sm px-6">
                          <Link href={`/portal-pelamar/dashboard/lamar/${job.slug}`}>
                            Ajukan Lamaran untuk Posisi Ini
                            <ArrowRight className="h-4 w-4 ml-1.5" />
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>
                )}

              </div>
            )
          })
        ) : (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-12 text-center shadow-xs">
            <div className="h-14 w-14 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-500 flex items-center justify-center mx-auto mb-3">
              <Briefcase className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-1">
              Tidak Ada Lowongan yang Cocok
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">
              Coba gunakan kata kunci pencarian lain atau pilih kategori departemen berbeda.
            </p>
            <Button 
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery('')
                setSelectedDepartment('ALL')
              }}
              className="rounded-full text-xs font-bold"
            >
              Reset Filter
            </Button>
          </div>
        )}
      </div>

    </div>
  )
}
