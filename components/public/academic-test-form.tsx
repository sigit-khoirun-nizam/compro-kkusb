'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { toast } from 'sonner'
import { 
  Send, 
  GraduationCap, 
  Timer, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ArrowLeft,
  Sparkles,
  HelpCircle,
  FileCheck2,
  Check
} from 'lucide-react'
import { TestQuestion } from '@prisma/client'
import { cn } from '@/lib/utils'

interface AcademicTestFormProps {
  applicantId: string
  testId: string
  questions: TestQuestion[]
  durationMinutes: number
  jobTitle: string
  applicantName?: string
  initialAnswers?: Record<string, string>
}

export default function AcademicTestForm({ 
  applicantId, 
  testId, 
  questions, 
  durationMinutes, 
  jobTitle,
  applicantName,
  initialAnswers = {}
}: AcademicTestFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [answers, setAnswers] = useState<Record<string, string>>(initialAnswers)
  
  // Timer State
  const [timeLeft, setTimeLeft] = useState(durationMinutes * 60)
  const [isTimeUp, setIsTimeUp] = useState(false)

  // Track progress
  const answeredCount = useMemo(() => {
    return Object.keys(answers).filter(qId => Boolean(answers[qId])).length
  }, [answers])

  const progressPercent = useMemo(() => {
    if (questions.length === 0) return 0
    return Math.round((answeredCount / questions.length) * 100)
  }, [answeredCount, questions.length])

  const handleSelect = (questionId: string, option: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: option }))
  }

  const handleSubmit = useCallback(async (e?: React.FormEvent, forceSubmit = false) => {
    if (e) e.preventDefault()
    
    if (!forceSubmit && answeredCount < questions.length) {
      const confirmSubmit = window.confirm(
        `Anda baru menjawab ${answeredCount} dari ${questions.length} soal. Masih ada soal yang belum dijawab. Yakin ingin mengumpulkan tes sekarang?`
      )
      if (!confirmSubmit) return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/karir/tes/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicantId,
          testId,
          answers
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Gagal mengirim jawaban')
      }

      toast.success(forceSubmit ? 'Waktu habis! Jawaban tes otomatis dikumpulkan.' : 'Tes berhasil diselesaikan!', {
        description: `Skor Anda: ${data.testScore ?? 0}/100. Hasil telah tersimpan di dashboard.`
      })
      
      router.push(`/portal-pelamar/dashboard`)
      router.refresh()
    } catch (error: any) {
      toast.error('Terjadi kesalahan saat mengumpulkan tes', {
        description: error.message
      })
      setLoading(false)
    }
  }, [answers, answeredCount, applicantId, questions.length, router, testId])

  // Timer Effect
  useEffect(() => {
    if (timeLeft <= 0) {
      if (!isTimeUp) {
        setIsTimeUp(true)
        handleSubmit(undefined, true) // Force submit when time is up
      }
      return
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, isTimeUp, handleSubmit])

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  // Timer warning status
  const isUrgent = timeLeft < 120 // < 2 mins
  const isWarning = timeLeft < 300 // < 5 mins

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col">
      
      {/* 1. STICKY TOP HEADER */}
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 shadow-xs">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Logo & Test Info */}
          <div className="flex items-center gap-3.5">
            <Link 
              href="/portal-pelamar/dashboard" 
              className="flex items-center gap-2.5 focus:outline-none group"
              title="Kembali ke Dashboard"
            >
              <Image 
                src="/logo.png" 
                alt="Logo KKUSB" 
                width={40} 
                height={40} 
                className="h-10 w-10 object-contain transition-transform group-hover:scale-105"
                priority
              />
              <div className="flex flex-col leading-none">
                <span className="text-lg font-black tracking-tight text-zinc-900 dark:text-white">
                  KKUSB
                </span>
                <span className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400">
                  Tes Seleksi Online
                </span>
              </div>
            </Link>

            <span className="h-6 w-px bg-zinc-200 dark:bg-zinc-800 hidden sm:block" />

            <div className="hidden sm:flex flex-col leading-tight">
              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 line-clamp-1">
                {jobTitle}
              </span>
              {applicantName && (
                <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  Peserta: {applicantName}
                </span>
              )}
            </div>
          </div>

          {/* Right Controls: Timer Badge & ThemeToggle */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            
            {/* Countdown Badge */}
            <div className={cn(
              "flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-2xl border transition-all shadow-xs",
              isUrgent 
                ? "bg-red-50 dark:bg-red-950/60 border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 animate-pulse" 
                : isWarning
                ? "bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800 text-amber-600 dark:text-amber-400"
                : "bg-green-50 dark:bg-green-950/60 border-green-200 dark:border-green-800 text-[#079B49] dark:text-green-400"
            )}>
              <Timer className="h-4 w-4 shrink-0" />
              <div className="flex flex-col text-left leading-none">
                <span className="text-[9px] font-bold uppercase tracking-wider opacity-80">Sisa Waktu</span>
                <span className="font-mono font-black text-sm sm:text-base tabular-nums mt-0.5">
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>

            <ThemeToggle />

          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-1.5 overflow-hidden">
          <div 
            className="bg-[#079B49] h-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </header>

      {/* 2. MAIN TEST CONTENT */}
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-4xl space-y-8">
        
        {/* Top Header Card: Instructions & Progress Overview */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-6">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-100 dark:border-zinc-800">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 dark:bg-green-950/50 text-[11px] font-bold text-[#079B49] border border-green-200 dark:border-green-800 mb-2">
                <GraduationCap className="h-3.5 w-3.5" />
                Ujian Kompetensi Mandiri
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
                Tes Akademik: {jobTitle}
              </h2>
              <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                Pilihlah satu jawaban yang paling tepat untuk setiap pertanyaan di bawah ini.
              </p>
            </div>

            {/* Progress Badge */}
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/60 self-start md:self-auto">
              <FileCheck2 className="h-5 w-5 text-[#079B49]" />
              <div className="text-left leading-tight">
                <span className="text-[10px] uppercase font-bold text-zinc-400 block">Progres Pengerjaan</span>
                <span className="text-sm font-black text-zinc-900 dark:text-zinc-100">
                  {answeredCount} / {questions.length} Soal ({progressPercent}%)
                </span>
              </div>
            </div>
          </div>

          {/* Quick instructions & Quick navigation chips */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Navigasi Nomor Soal
              </span>
              <span className="text-[11px] text-zinc-500">
                Klik nomor untuk melompat ke soal
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {questions.map((q, idx) => {
                const isAnswered = Boolean(answers[q.id])
                return (
                  <a
                    key={q.id}
                    href={`#soal-${idx + 1}`}
                    className={cn(
                      "h-10 min-w-10 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 border transition-all cursor-pointer",
                      isAnswered
                        ? "bg-[#079B49] text-white border-[#079B49] shadow-xs"
                        : "bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:border-zinc-400"
                    )}
                  >
                    <span>{idx + 1}</span>
                    {isAnswered && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                  </a>
                )
              })}
            </div>
          </div>

        </div>

        {/* Form Question Cards */}
        <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
          
          {questions.map((q, index) => {
            const currentSelected = answers[q.id]
            const options = [
              { id: 'A', text: q.optionA },
              { id: 'B', text: q.optionB },
              { id: 'C', text: q.optionC },
              { id: 'D', text: q.optionD }
            ]

            return (
              <div 
                id={`soal-${index + 1}`}
                key={q.id} 
                className="scroll-mt-28 p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-6 transition-all hover:border-zinc-300 dark:hover:border-zinc-700"
              >
                
                {/* Question Header & Badge */}
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2.5">
                    <span className="h-8 w-8 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-black text-sm flex items-center justify-center border border-zinc-200 dark:border-zinc-700">
                      {index + 1}
                    </span>
                    <span className="text-xs font-semibold text-zinc-400">
                      Soal Nomor {index + 1} dari {questions.length}
                    </span>
                  </div>

                  {currentSelected ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#079B49] bg-green-50 dark:bg-green-950/60 px-2.5 py-1 rounded-full border border-green-200 dark:border-green-800">
                      <Check className="h-3 w-3" /> Terjawab (Pilihan {currentSelected})
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-full border border-amber-200 dark:border-amber-800">
                      Belum Dijawab
                    </span>
                  )}
                </div>

                {/* Question Title */}
                <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 leading-relaxed">
                  {q.question}
                </h3>

                {/* Multiple Choice Options */}
                <div className="space-y-3 pt-1">
                  {options.map((opt) => {
                    const isSelected = currentSelected === opt.id

                    return (
                      <div
                        key={opt.id}
                        onClick={() => handleSelect(q.id, opt.id)}
                        className={cn(
                          "flex items-center gap-3.5 p-4 sm:p-4.5 rounded-2xl border cursor-pointer transition-all select-none",
                          isSelected
                            ? "border-[#079B49] bg-green-50/80 dark:bg-green-950/40 text-[#079B49] shadow-xs"
                            : "border-zinc-200 dark:border-zinc-800 bg-zinc-50/40 dark:bg-zinc-800/30 hover:bg-zinc-100/80 dark:hover:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300"
                        )}
                      >
                        {/* Option Letter Pill */}
                        <div className={cn(
                          "h-8 w-8 rounded-xl font-bold text-xs flex items-center justify-center shrink-0 border transition-colors",
                          isSelected
                            ? "bg-[#079B49] text-white border-[#079B49]"
                            : "bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700"
                        )}>
                          {opt.id}
                        </div>

                        {/* Option Text */}
                        <span className={cn(
                          "text-sm font-medium leading-relaxed flex-1",
                          isSelected ? "text-zinc-900 dark:text-zinc-100 font-bold" : "text-zinc-700 dark:text-zinc-300"
                        )}>
                          {opt.text}
                        </span>

                        {/* Check Indicator */}
                        <div className={cn(
                          "h-5 w-5 rounded-full border flex items-center justify-center transition-colors shrink-0",
                          isSelected
                            ? "bg-[#079B49] border-[#079B49] text-white"
                            : "border-zinc-300 dark:border-zinc-700"
                        )}>
                          {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                        </div>
                      </div>
                    )
                  })}
                </div>

              </div>
            )
          })}

          {/* Submission Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-5">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  Siap untuk Mengumpulkan Tes?
                </h4>
                <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
                  {answeredCount === questions.length ? (
                    <span className="text-[#079B49] font-semibold flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4" /> Seluruh {questions.length} soal telah selesai dijawab.
                    </span>
                  ) : (
                    <span className="text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1.5">
                      <AlertCircle className="h-4 w-4" /> Masih ada {questions.length - answeredCount} soal yang belum dijawab.
                    </span>
                  )}
                </p>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-xs text-zinc-400 block">Total Waktu Tersedia</span>
                <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200">{durationMinutes} Menit</span>
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={loading || isTimeUp}
              className="w-full h-14 rounded-2xl bg-[#079B49] hover:bg-[#075C35] text-white font-bold text-base shadow-lg transition-all cursor-pointer"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  <span>Mengirimkan &amp; Menilai Jawaban...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  <span>Selesaikan Tes &amp; Kumpulkan Jawaban</span>
                </div>
              )}
            </Button>

          </div>

        </form>

      </main>

      {/* 3. FOOTER */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-6 text-center text-xs text-zinc-400 dark:text-zinc-500 bg-white dark:bg-zinc-900">
        &copy; {new Date().getFullYear()} KKUSB Rekrutmen Online &bull; Koperasi Jasa Karyawan Usaha Sejahtera Bersama
      </footer>

    </div>
  )
}
