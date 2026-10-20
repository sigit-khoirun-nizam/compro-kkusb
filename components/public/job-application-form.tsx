'use client'

import { useState } from 'react'
import { useSession, signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Send, 
  UploadCloud, 
  FileCheck, 
  CheckCircle2, 
  AlertCircle, 
  GraduationCap, 
  ArrowRight,
  User,
  Mail,
  Phone,
  Lock,
  Sparkles
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface JobApplicationFormProps {
  jobId: string
  jobTitle?: string
  jobSlug?: string
  hasOnlineTest?: boolean
  defaultName?: string
  defaultEmail?: string
}

export default function JobApplicationForm({ 
  jobId, 
  jobTitle = 'Posisi Lowongan', 
  jobSlug,
  hasOnlineTest = true,
  defaultName = '',
  defaultEmail = ''
}: JobApplicationFormProps) {
  const router = useRouter()
  const { data: session } = useSession()

  const [loading, setLoading] = useState(false)
  const [successData, setSuccessData] = useState<{
    applicantId: string
    hasTest: boolean
    alreadyApplied?: boolean
  } | null>(null)

  const [formData, setFormData] = useState({
    name: defaultName || session?.user?.name || '',
    email: defaultEmail || session?.user?.email || '',
    phone: '',
    password: ''
  })

  const [cvFile, setCvFile] = useState<File | null>(null)
  const [cvFileName, setCvFileName] = useState<string>('')
  const [formError, setFormError] = useState<string>('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Ukuran file maksimal 5MB')
        return
      }
      setCvFile(file)
      setCvFileName(file.name)
      setFieldErrors(prev => {
        const next = { ...prev }
        delete next.cv
        return next
      })
      if (formError.includes('CV') || formError.includes('berkas')) {
        setFormError('')
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')

    const finalName = session?.user?.name || formData.name
    const finalEmail = session?.user?.email || formData.email

    const newFieldErrors: Record<string, string> = {}

    if (!finalName || !finalName.trim()) {
      newFieldErrors.name = 'Nama lengkap wajib diisi'
    }

    if (!finalEmail || !finalEmail.trim()) {
      newFieldErrors.email = 'Alamat email wajib diisi'
    }

    const phoneDigits = (formData.phone || '').replace(/\D/g, '')
    if (!formData.phone || !formData.phone.trim()) {
      newFieldErrors.phone = 'Nomor telepon / WhatsApp wajib diisi'
    } else if (phoneDigits.length < 11) {
      newFieldErrors.phone = 'Nomor telepon / WhatsApp minimal 11 digit angka (contoh: 081234567890)'
    }

    if (!session?.user && (!formData.password || formData.password.length < 6)) {
      newFieldErrors.password = 'Kata sandi minimal 6 karakter'
    }

    if (!cvFile) {
      newFieldErrors.cv = 'Berkas CV / Resume wajib diunggah (Format: PDF, DOC, DOCX, atau Gambar)'
    }

    if (Object.keys(newFieldErrors).length > 0) {
      setFieldErrors(newFieldErrors)
      const firstMsg = Object.values(newFieldErrors)[0]
      setFormError(firstMsg)
      toast.error('Formulir Belum Lengkap', {
        description: firstMsg
      })
      return
    }

    setFieldErrors({})
    setLoading(true)

    try {
      const data = new FormData()
      data.append('jobId', jobId)
      data.append('name', finalName)
      data.append('email', finalEmail)
      data.append('phone', formData.phone)
      if (formData.password) {
        data.append('password', formData.password)
      }
      if (cvFile) {
        data.append('cv', cvFile)
      }

      const res = await fetch('/api/karir/apply', {
        method: 'POST',
        body: data
      })

      const result = await res.json()

      if (!res.ok) {
        throw new Error(result.error || 'Gagal mengirimkan lamaran')
      }

      // Jika pengguna belum login dan menyertakan password, otomatis login-kan ke sesi portal
      if (!session && formData.password) {
        await signIn('credentials', {
          redirect: false,
          email: finalEmail.toLowerCase().trim(),
          password: formData.password
        })
      }

      toast.success(result.alreadyApplied ? 'Lamaran Ditemukan' : 'Lamaran Berhasil Terkirim!', {
        description: 'Berkas lamaran Anda telah kami terima.'
      })

      setSuccessData({
        applicantId: result.applicantId,
        hasTest: result.hasTest,
        alreadyApplied: result.alreadyApplied
      })

    } catch (err: any) {
      const msg = err.message || 'Terjadi kesalahan saat mengirim lamaran'
      setFormError(msg)
      toast.error('Gagal Mengirim Lamaran', {
        description: msg
      })
    } finally {
      setLoading(false)
    }
  }

  // Jika lamaran berhasil terkirim, tampilkan kartu sukses dan tombol aksi tes online
  if (successData) {
    return (
      <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-zinc-900 border border-green-200 dark:border-green-800 shadow-lg text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
        <div className="h-20 w-20 rounded-full bg-green-100 dark:bg-green-950/60 text-[#079B49] flex items-center justify-center mx-auto shadow-inner border border-green-200 dark:border-green-800">
          <CheckCircle2 className="h-10 w-10" />
        </div>

        <div className="space-y-2 max-w-lg mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 dark:bg-green-950/60 text-[11px] font-bold text-[#079B49]">
            <Sparkles className="h-3.5 w-3.5" />
            Status: {successData.alreadyApplied ? 'Berkas Telah Terdaftar' : 'Lamaran Berhasil Diterima'}
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
            Terima Kasih Telah Melamar!
          </h3>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Lamaran Anda untuk posisi <strong className="text-zinc-900 dark:text-zinc-100">{jobTitle}</strong> telah tercatat di sistem rekrutmen KKUSB.
          </p>
        </div>

        {/* Kotak Peringatan & Tombol Tes Online */}
        {successData.hasTest ? (
          <div className="p-6 rounded-2xl bg-green-50/70 dark:bg-zinc-950/80 border border-green-200 dark:border-zinc-800 text-left space-y-4 max-w-lg mx-auto">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-[#079B49]/10 text-[#079B49] flex items-center justify-center shrink-0">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  Tahapan Tes Akademik &amp; Kompetensi Online
                </h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Posisi ini memerlukan tes online untuk menguji kualifikasi dasar Anda.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button asChild className="bg-[#079B49] hover:bg-[#075C35] text-white rounded-xl font-bold flex-1 shadow-md">
                <Link href={`/portal-pelamar/tes-akademik/${successData.applicantId}`}>
                  Mulai Tes Online Sekarang
                  <ArrowRight className="h-4 w-4 ml-1.5" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="rounded-xl border-zinc-200 dark:border-zinc-800 text-xs font-semibold">
                <Link href="/portal-pelamar/dashboard">
                  Buka Dashboard Pelamar
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="pt-2">
            <Button asChild className="bg-[#079B49] hover:bg-[#075C35] text-white rounded-full font-bold px-8 shadow-md">
              <Link href="/portal-pelamar/dashboard">
                Pantau Status di Portal Pelamar &rarr;
              </Link>
            </Button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
      
      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-bold text-[#079B49] uppercase tracking-wider">Formulir Rekrutmen Online</span>
          {hasOnlineTest && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-50 dark:bg-orange-950/50 text-[11px] font-bold text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800">
              <GraduationCap className="h-3 w-3" />
              Termasuk Tes Online
            </span>
          )}
        </div>
        <h3 className="text-2xl font-black text-zinc-900 dark:text-zinc-100">
          Kirim Lamaran untuk Posisi Ini
        </h3>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
          Isi data diri Anda di bawah ini untuk melamar dan melanjutkan ke tahapan seleksi tes kompetensi.
        </p>
      </div>

      {/* Info jika pelamar sudah login */}
      {session?.user ? (
        <div className="p-3.5 rounded-2xl bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
            <User className="h-4 w-4 text-[#079B49]" />
            <span>Melamar sebagai: <strong>{session.user.name || session.user.email}</strong> ({session.user.email})</span>
          </div>
          <Link href="/portal-pelamar/dashboard" className="font-bold text-[#079B49] hover:underline">
            Buka Dashboard
          </Link>
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Banner Alert Jika Ada Kesalahan / Belum Diisi */}
        {formError && (
          <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5 text-red-600 dark:text-red-400" />
            <div className="space-y-0.5 text-xs">
              <strong className="font-bold text-sm block">Periksa Kembali Data Anda</strong>
              <p className="leading-relaxed">{formError}</p>
            </div>
          </div>
        )}
        
        {/* Nama Lengkap */}
        <div className="space-y-1.5">
          <Label htmlFor="applicant-name" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            Nama Lengkap <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input 
              id="applicant-name"
              type="text"
              placeholder="Contoh: Budi Santoso"
              value={session?.user?.name || formData.name}
              disabled={!!session?.user?.name}
              onChange={(e) => {
                setFormData({...formData, name: e.target.value})
                if (fieldErrors.name) {
                  setFieldErrors(prev => {
                    const n = { ...prev }
                    delete n.name
                    return n
                  })
                }
              }}
              className={cn(
                "pl-10 h-11 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 text-sm focus-visible:ring-[#079B49]",
                fieldErrors.name 
                  ? "border-red-500 focus-visible:ring-red-500 dark:border-red-600" 
                  : "border-zinc-200 dark:border-zinc-700"
              )}
            />
          </div>
          {fieldErrors.name && (
            <p className="text-[11px] font-semibold text-red-500 flex items-center gap-1 mt-1">
              <AlertCircle className="h-3 w-3" /> {fieldErrors.name}
            </p>
          )}
        </div>

        {/* Email & No Telepon */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="applicant-email" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Alamat Email <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <Input 
                id="applicant-email"
                type="email"
                placeholder="nama@email.com"
                value={session?.user?.email || formData.email}
                disabled={!!session?.user?.email}
                onChange={(e) => {
                  setFormData({...formData, email: e.target.value})
                  if (fieldErrors.email) {
                    setFieldErrors(prev => {
                      const n = { ...prev }
                      delete n.email
                      return n
                    })
                  }
                }}
                className={cn(
                  "pl-10 h-11 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 text-sm focus-visible:ring-[#079B49]",
                  fieldErrors.email 
                    ? "border-red-500 focus-visible:ring-red-500 dark:border-red-600" 
                    : "border-zinc-200 dark:border-zinc-700"
                )}
              />
            </div>
            {fieldErrors.email && (
              <p className="text-[11px] font-semibold text-red-500 flex items-center gap-1 mt-1">
                <AlertCircle className="h-3 w-3" /> {fieldErrors.email}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="applicant-phone" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                No. WhatsApp / HP <span className="text-red-500">*</span>
              </Label>
              <span className="text-[10px] text-zinc-400">Min. 11 digit</span>
            </div>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <Input 
                id="applicant-phone"
                type="tel"
                placeholder="081234567890"
                value={formData.phone}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9+\s-]/g, '')
                  setFormData({...formData, phone: val})
                  if (fieldErrors.phone) {
                    setFieldErrors(prev => {
                      const n = { ...prev }
                      delete n.phone
                      return n
                    })
                  }
                }}
                minLength={11}
                className={cn(
                  "pl-10 h-11 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 text-sm focus-visible:ring-[#079B49]",
                  fieldErrors.phone 
                    ? "border-red-500 focus-visible:ring-red-500 dark:border-red-600" 
                    : "border-zinc-200 dark:border-zinc-700"
                )}
              />
            </div>
            {fieldErrors.phone ? (
              <p className="text-[11px] font-semibold text-red-500 flex items-center gap-1 mt-1">
                <AlertCircle className="h-3 w-3" /> {fieldErrors.phone}
              </p>
            ) : (
              <p className="text-[11px] text-zinc-400">
                Minimal 11 digit angka (contoh: 081234567890)
              </p>
            )}
          </div>
        </div>

        {/* Password jika belum login */}
        {!session?.user && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="applicant-password" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Buat Kata Sandi Akun Portal <span className="text-red-500">*</span>
              </Label>
              <span className="text-[10px] text-zinc-400">Untuk login melihat hasil tes</span>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <Input 
                id="applicant-password"
                type="password"
                placeholder="Minimal 6 karakter"
                value={formData.password}
                onChange={(e) => {
                  setFormData({...formData, password: e.target.value})
                  if (fieldErrors.password) {
                    setFieldErrors(prev => {
                      const n = { ...prev }
                      delete n.password
                      return n
                    })
                  }
                }}
                className={cn(
                  "pl-10 h-11 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 text-sm focus-visible:ring-[#079B49]",
                  fieldErrors.password 
                    ? "border-red-500 focus-visible:ring-red-500 dark:border-red-600" 
                    : "border-zinc-200 dark:border-zinc-700"
                )}
              />
            </div>
            {fieldErrors.password && (
              <p className="text-[11px] font-semibold text-red-500 flex items-center gap-1 mt-1">
                <AlertCircle className="h-3 w-3" /> {fieldErrors.password}
              </p>
            )}
          </div>
        )}

        {/* Upload CV / Berkas */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Unggah Berkas CV / Resume <span className="text-red-500">*</span>
            </Label>
            <span className="text-[10px] text-zinc-400">PDF, DOC, DOCX, Maks. 5MB</span>
          </div>
          <div className={cn(
            "relative border-2 border-dashed rounded-2xl p-4.5 text-center cursor-pointer transition-all",
            fieldErrors.cv
              ? "border-red-500 bg-red-50/50 dark:bg-red-950/20"
              : cvFile
              ? "border-[#079B49] bg-green-50/50 dark:bg-green-950/20 shadow-xs"
              : "border-zinc-300 dark:border-zinc-700 hover:border-[#079B49] dark:hover:border-[#079B49] bg-zinc-50/50 dark:bg-zinc-800/20"
          )}>
            <input 
              type="file" 
              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            {cvFileName ? (
              <div className="flex flex-col items-center justify-center gap-1.5 text-[#079B49] py-1">
                <div className="h-9 w-9 rounded-full bg-green-100 dark:bg-green-950/60 flex items-center justify-center">
                  <FileCheck className="h-5 w-5" />
                </div>
                <span className="text-xs font-bold truncate max-w-xs">{cvFileName}</span>
                <span className="text-[10px] text-zinc-500 hover:text-zinc-700 dark:text-zinc-400">Klik untuk mengganti berkas</span>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-1.5 text-zinc-500 py-2">
                <UploadCloud className={cn("h-7 w-7", fieldErrors.cv ? "text-red-500" : "text-zinc-400")} />
                <span className={cn(
                  "text-xs font-semibold",
                  fieldErrors.cv ? "text-red-600 dark:text-red-400" : "text-zinc-700 dark:text-zinc-300"
                )}>
                  Klik untuk memilih file CV / Resume <span className="text-red-500">*</span>
                </span>
                <span className="text-[11px] text-zinc-400">Wajib diunggah (Format: PDF, DOCX, DOC, atau Gambar)</span>
              </div>
            )}
          </div>
          {fieldErrors.cv && (
            <p className="text-[11px] font-semibold text-red-500 flex items-center gap-1 mt-1">
              <AlertCircle className="h-3 w-3" /> {fieldErrors.cv}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <Button 
          type="submit" 
          disabled={loading}
          className="w-full h-12 rounded-xl bg-[#079B49] hover:bg-[#075C35] text-white font-bold text-sm shadow-md transition-all cursor-pointer mt-2"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              <span>Memproses Lamaran...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Send className="h-4 w-4" />
              <span>{hasOnlineTest ? 'Kirim Lamaran & Lanjut ke Tes Online' : 'Kirim Berkas Lamaran Sekarang'}</span>
            </div>
          )}
        </Button>

      </form>
    </div>
  )
}
