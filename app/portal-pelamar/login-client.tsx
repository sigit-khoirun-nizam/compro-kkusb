'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Mail, 
  Lock, 
  ArrowLeft, 
  ArrowRight, 
  UserX, 
  AlertTriangle, 
  X, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  Sparkles, 
  Briefcase, 
  GraduationCap, 
  ShieldCheck, 
  AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface AlertInfo {
  type: 'not_found' | 'wrong_password' | 'error' | 'validation'
  title: string
  message: string
}

export default function PortalPelamarLoginClient({ 
  callbackUrl,
  initialError 
}: { 
  callbackUrl?: string
  initialError?: string 
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  // State untuk melacak inputan yang kosong/error secara presisi
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({})

  // Alert State
  const [alertState, setAlertState] = useState<AlertInfo | null>(() => {
    if (initialError === 'CredentialsSignin') {
      return {
        type: 'error',
        title: 'Gagal Masuk',
        message: 'Email atau kata sandi tidak sesuai. Silakan periksa kembali ketikan Anda.'
      }
    }
    if (initialError) {
      return {
        type: 'error',
        title: 'Autentikasi Terkendala',
        message: 'Sesi masuk sebelumnya bermasalah atau telah kedaluwarsa. Silakan masuk ulang.'
      }
    }
    return null
  })

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setAlertState(null)

    const cleanEmail = formData.email.trim()
    const password = formData.password

    // Validasi semua inputan jika kosong
    const errors: { email?: string; password?: string } = {}
    if (!cleanEmail) {
      errors.email = 'Alamat email wajib diisi.'
    }
    if (!password) {
      errors.password = 'Kata sandi wajib diisi.'
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      const count = Object.keys(errors).length
      const alertMsg = count === 2 
        ? 'Alamat email dan kata sandi belum diisi. Harap lengkapi semua kolom untuk melanjutkan.' 
        : errors.email 
          ? 'Alamat email tidak boleh kosong. Silakan masukkan email Anda.' 
          : 'Kata sandi tidak boleh kosong. Silakan masukkan kata sandi Anda.'

      setAlertState({
        type: 'validation',
        title: count === 2 ? 'Semua Kolom Wajib Diisi!' : 'Kolom Masih Kosong!',
        message: alertMsg
      })
      toast.error('Harap lengkapi inputan!', {
        description: alertMsg
      })
      return
    }

    setFieldErrors({})
    setLoading(true)

    const normalizedEmail = cleanEmail.toLowerCase()
    
    try {
      // 1. Cek terlebih dahulu apakah email terdaftar di database
      const checkRes = await fetch(`/api/auth/check-email?email=${encodeURIComponent(normalizedEmail)}`)
      const checkData = await checkRes.json()

      if (!checkData.exists) {
        setAlertState({
          type: 'not_found',
          title: 'Akun Belum Terdaftar!',
          message: `Alamat email "${formData.email}" belum terdaftar di sistem rekrutmen KKUSB. Silakan buat akun baru terlebih dahulu.`
        })
        toast.error('Akun belum terdaftar', {
          description: 'Silakan buat akun pelamar baru terlebih dahulu.'
        })
        setLoading(false)
        return
      }

      // 2. Jika akun ada, lakukan proses login kredensial
      const result = await signIn('credentials', {
        redirect: false,
        email: normalizedEmail,
        password: formData.password
      })

      if (result?.error) {
        if (result.error.includes('Password') || result.error.includes('salah')) {
          setFieldErrors({ password: 'Kata sandi tidak sesuai.' })
          setAlertState({
            type: 'wrong_password',
            title: 'Kata Sandi Keliru!',
            message: 'Kata sandi yang Anda masukkan tidak sesuai. Pastikan huruf besar/kecil sudah benar.'
          })
          toast.error('Kata sandi salah!')
        } else {
          setAlertState({
            type: 'error',
            title: 'Gagal Masuk',
            message: 'Kombinasi email dan kata sandi tidak valid. Silakan coba kembali.'
          })
          toast.error('Gagal masuk ke akun')
        }
        setLoading(false)
      } else {
        toast.success('Berhasil masuk!', {
          description: 'Mengarahkan ke Dashboard Pelamar...'
        })
        window.location.href = callbackUrl || '/portal-pelamar/dashboard'
      }
    } catch {
      setAlertState({
        type: 'error',
        title: 'Terjadi Kesalahan Koneksi',
        message: 'Koneksi ke server terganggu. Periksa koneksi internet Anda dan coba lagi.'
      })
      toast.error('Terjadi kesalahan saat masuk')
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setGoogleLoading(true)
    await signIn('google', { callbackUrl: callbackUrl || '/portal-pelamar/dashboard' })
  }

  return (
    <div className="min-h-screen w-full flex bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors">
      
      {/* LEFT COLUMN: HERO SHOWCASE (Visible on lg and larger) */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-7/12 relative flex-col justify-between p-12 xl:p-16 overflow-hidden bg-gradient-to-br from-[#064e29] via-[#075C35] to-[#04331d] text-white">
        
        {/* Background Ambient Glows & Patterns */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-emerald-400/20 blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-emerald-300/15 blur-3xl" />
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />
        </div>

        {/* Top Header in Left Panel */}
        <div className="relative z-10 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-3.5 group focus:outline-none">
            <div className="h-12 w-12 rounded-2xl bg-white/10 backdrop-blur-md p-2 border border-white/20 shadow-lg group-hover:scale-105 transition-transform flex items-center justify-center">
              <Image 
                src="/logo.png" 
                alt="Logo KKUSB" 
                width={40} 
                height={40} 
                className="h-full w-auto object-contain"
              />
            </div>
            <div>
              <span className="font-black text-xl tracking-tight block text-white drop-shadow-sm">
                KKUSB
              </span>
              <span className="text-[11px] font-medium text-emerald-200/90 tracking-wider block">
                Koperasi Karyawan Usaha Sejahtera Bersama
              </span>
            </div>
          </Link>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/40 border border-emerald-400/30 text-xs font-semibold text-emerald-200 backdrop-blur-md shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            Portal Karir &amp; Rekrutmen
          </div>
        </div>

        {/* Center Content / Value Proposition */}
        <div className="relative z-10 my-auto py-12 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-emerald-100 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Peluang Karir Profesional &amp; Berkelanjutan</span>
          </div>

          <h1 className="text-3xl xl:text-4xl 2xl:text-5xl font-black tracking-tight leading-tight mb-5 text-white drop-shadow-sm">
            Wujudkan Potensi &amp; Bangun Karir Unggul Bersama KKUSB
          </h1>

          <p className="text-sm xl:text-base text-emerald-100/90 leading-relaxed font-normal mb-8">
            Bergabunglah dengan ekosistem koperasi modern yang menghargai integritas, inovasi, dan dedikasi. Pantau setiap tahapan seleksi secara transparan dan mudah.
          </p>

          {/* Interactive Feature Cards */}
          <div className="grid grid-cols-1 gap-3.5">
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 hover:bg-white/15 transition-all">
              <div className="h-10 w-10 rounded-xl bg-emerald-400/20 border border-emerald-300/30 flex items-center justify-center shrink-0 text-emerald-200">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white mb-0.5">Pantau Status Lamaran Realtime</h2>
                <p className="text-xs text-emerald-100/80 leading-relaxed">
                  Dapatkan transparansi penuh mulai dari seleksi berkas, jadwal tes, hingga hasil akhir secara langsung.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 hover:bg-white/15 transition-all">
              <div className="h-10 w-10 rounded-xl bg-emerald-400/20 border border-emerald-300/30 flex items-center justify-center shrink-0 text-emerald-200">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white mb-0.5">Ujian Akademik &amp; Kompetensi Terintegrasi</h2>
                <p className="text-xs text-emerald-100/80 leading-relaxed">
                  Akses modul tes online terpadu dengan sistem penilaian otomatis yang aman dan obyektif.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 hover:bg-white/15 transition-all">
              <div className="h-10 w-10 rounded-xl bg-emerald-400/20 border border-emerald-300/30 flex items-center justify-center shrink-0 text-emerald-200">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white mb-0.5">Privasi &amp; Data Pribadi Terlindungi</h2>
                <p className="text-xs text-emerald-100/80 leading-relaxed">
                  Seluruh berkas dokumen dan informasi akun Anda diamankan sesuai standar enkripsi perlindungan data.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Banner in Left Panel */}
        <div className="relative z-10 pt-6 border-t border-white/15 flex items-center justify-between text-xs text-emerald-200/90">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              <div className="h-8 w-8 rounded-full bg-emerald-700 border-2 border-emerald-900 flex items-center justify-center text-[10px] font-bold text-white shadow-xs">
                KK
              </div>
              <div className="h-8 w-8 rounded-full bg-amber-500 border-2 border-emerald-900 flex items-center justify-center text-[10px] font-bold text-white shadow-xs">
                US
              </div>
              <div className="h-8 w-8 rounded-full bg-emerald-500 border-2 border-emerald-900 flex items-center justify-center text-[10px] font-bold text-white shadow-xs">
                B
              </div>
            </div>
            <span className="font-medium text-white/90">
              500+ Talenta Berdedikasi di Berbagai Unit Usaha
            </span>
          </div>
          <span className="text-[11px] font-medium tracking-wide text-emerald-300/70">
            &copy; {new Date().getFullYear()} KKUSB Rekrutmen
          </span>
        </div>

      </div>

      {/* RIGHT COLUMN: LOGIN FORM CONTAINER */}
      <div className="w-full lg:w-1/2 xl:w-5/12 flex flex-col justify-between p-4 sm:p-8 xl:p-12 relative overflow-y-auto">
        
        {/* Top Action Bar */}
        <div className="w-full max-w-md mx-auto flex items-center justify-between pt-2 mb-6">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-[#079B49] dark:hover:text-[#10B981] transition-colors group"
          >
            <div className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-950/40 text-zinc-600 dark:text-zinc-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              <ArrowLeft className="h-3.5 w-3.5" />
            </div>
            <span>Kembali ke Website</span>
          </Link>
          
          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </div>

        {/* Main Auth Card Container */}
        <div className="w-full max-w-md mx-auto my-auto">
          
          {/* Mobile Header Branding (Shown on mobile & tablets) */}
          <div className="lg:hidden flex flex-col items-center text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-3 mb-4 group focus:outline-none">
              <div className="h-12 w-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 p-2 border border-emerald-200 dark:border-emerald-800/60 shadow-sm flex items-center justify-center">
                <Image 
                  src="/logo.png" 
                  alt="Logo KKUSB" 
                  width={42} 
                  height={42} 
                  className="h-full w-auto object-contain"
                />
              </div>
              <div className="text-left">
                <span className="font-black text-xl tracking-tight text-zinc-900 dark:text-white block">
                  KKUSB
                </span>
                <span className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 block">
                  Usaha Sejahtera Bersama
                </span>
              </div>
            </Link>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 text-[11px] font-bold text-[#079B49] dark:text-[#10B981]">
              <Sparkles className="w-3 h-3 text-amber-500" />
              Portal Rekrutmen &amp; Karir
            </span>
          </div>

          {/* Form Header */}
          <div className="mb-8 text-center sm:text-left">
            <div className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 text-[11px] font-bold text-[#079B49] dark:text-[#10B981] mb-3">
              <Sparkles className="w-3 h-3 text-amber-500" />
              Portal Pelamar
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight mb-2">
              Masuk ke Akun Pelamar
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Pantau status lamaran kerja dan ikuti tes akademik online Anda.
            </p>
          </div>

          {/* ALERT NOTIFICATION */}
          {alertState && (
            <div 
              role="alert"
              className={cn(
                "w-full mb-6 p-4 rounded-2xl border text-left flex items-start gap-3.5 transition-all animate-in fade-in slide-in-from-top-2 shadow-xs",
                alertState.type === 'not_found'
                  ? "bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900/60 text-red-900 dark:text-red-200"
                  : alertState.type === 'wrong_password'
                  ? "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-200"
                  : alertState.type === 'validation'
                  ? "bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-900/70 text-rose-900 dark:text-rose-200"
                  : "bg-zinc-100 dark:bg-zinc-800/80 border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200"
              )}
            >
              <div className={cn(
                "h-9 w-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 shadow-xs",
                alertState.type === 'not_found'
                  ? "bg-red-100 dark:bg-red-900/60 text-red-600 dark:text-red-300"
                  : alertState.type === 'wrong_password'
                  ? "bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-300"
                  : alertState.type === 'validation'
                  ? "bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-300"
                  : "bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300"
              )}>
                {alertState.type === 'not_found' ? (
                  <UserX className="h-4 w-4" />
                ) : alertState.type === 'validation' ? (
                  <AlertCircle className="h-4 w-4" />
                ) : (
                  <AlertTriangle className="h-4 w-4" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-bold text-xs sm:text-sm leading-tight">
                    {alertState.title}
                  </h4>
                  <button 
                    onClick={() => setAlertState(null)} 
                    className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-1 rounded-md transition-colors"
                    aria-label="Tutup notifikasi"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
                <p className="text-[11px] sm:text-xs leading-relaxed mt-1 opacity-90">
                  {alertState.message}
                </p>

                {alertState.type === 'not_found' && (
                  <div className="mt-3 pt-2.5 border-t border-red-200/60 dark:border-red-900/60">
                    <Link 
                      href="/portal-pelamar/register" 
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-xs"
                    >
                      <span>Daftar Akun Baru Sekarang</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleEmailLogin} noValidate className="space-y-4">
            
            {/* Email Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label 
                  htmlFor="email" 
                  className={cn(
                    "text-xs font-semibold transition-colors",
                    fieldErrors.email 
                      ? "text-red-600 dark:text-red-400" 
                      : "text-zinc-700 dark:text-zinc-300"
                  )}
                >
                  Alamat Email Pelamar <span className="text-red-500">*</span>
                </Label>
              </div>
              <div className="relative">
                <div className={cn(
                  "absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors",
                  fieldErrors.email ? "text-red-500" : "text-zinc-400"
                )}>
                  <Mail className="h-4 w-4" />
                </div>
                <Input 
                  id="email" 
                  type="email" 
                  autoComplete="email"
                  placeholder="nama@email.com"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({...formData, email: e.target.value})
                    if (fieldErrors.email) {
                      setFieldErrors(prev => ({ ...prev, email: undefined }))
                    }
                    if (alertState?.type === 'validation') setAlertState(null)
                  }}
                  className={cn(
                    "pl-10 h-12 rounded-xl bg-white dark:bg-zinc-900 text-sm transition-all shadow-xs",
                    fieldErrors.email 
                      ? "border-red-500 dark:border-red-500 focus-visible:ring-2 focus-visible:ring-red-500/30 ring-red-500/10 ring-2" 
                      : "border-zinc-200 dark:border-zinc-800 focus-visible:ring-2 focus-visible:ring-emerald-500 dark:focus-visible:ring-emerald-400"
                  )}
                />
              </div>
              {fieldErrors.email && (
                <p className="text-[11px] font-medium text-red-600 dark:text-red-400 flex items-center gap-1.5 mt-1 animate-in fade-in duration-200">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{fieldErrors.email}</span>
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label 
                  htmlFor="password" 
                  className={cn(
                    "text-xs font-semibold transition-colors",
                    fieldErrors.password 
                      ? "text-red-600 dark:text-red-400" 
                      : "text-zinc-700 dark:text-zinc-300"
                  )}
                >
                  Kata Sandi <span className="text-red-500">*</span>
                </Label>
              </div>
              <div className="relative">
                <div className={cn(
                  "absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors",
                  fieldErrors.password ? "text-red-500" : "text-zinc-400"
                )}>
                  <Lock className="h-4 w-4" />
                </div>
                <Input 
                  id="password" 
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({...formData, password: e.target.value})
                    if (fieldErrors.password) {
                      setFieldErrors(prev => ({ ...prev, password: undefined }))
                    }
                    if (alertState?.type === 'validation' || alertState?.type === 'wrong_password') setAlertState(null)
                  }}
                  className={cn(
                    "pl-10 pr-11 h-12 rounded-xl bg-white dark:bg-zinc-900 text-sm transition-all shadow-xs",
                    fieldErrors.password 
                      ? "border-red-500 dark:border-red-500 focus-visible:ring-2 focus-visible:ring-red-500/30 ring-red-500/10 ring-2" 
                      : "border-zinc-200 dark:border-zinc-800 focus-visible:ring-2 focus-visible:ring-emerald-500 dark:focus-visible:ring-emerald-400"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-1 rounded-md transition-colors focus:outline-none"
                  aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="text-[11px] font-medium text-red-600 dark:text-red-400 flex items-center gap-1.5 mt-1 animate-in fade-in duration-200">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{fieldErrors.password}</span>
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              disabled={loading || googleLoading} 
              className="w-full h-12 mt-2 rounded-xl bg-gradient-to-r from-[#079B49] to-[#05823c] hover:from-[#06843e] hover:to-[#046c32] text-white font-bold text-sm shadow-md shadow-emerald-700/20 active:scale-[0.99] transition-all cursor-pointer"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  <span>Memverifikasi Akun...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>Masuk ke Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="w-full flex items-center gap-3 my-6">
            <div className="h-px bg-zinc-200 dark:bg-zinc-800 flex-1" />
            <span className="text-[11px] text-zinc-400 dark:text-zinc-500 font-semibold tracking-wider uppercase">
              Atau masuk dengan
            </span>
            <div className="h-px bg-zinc-200 dark:bg-zinc-800 flex-1" />
          </div>

          {/* Google SSO Button */}
          <Button 
            type="button"
            onClick={handleGoogleLogin} 
            disabled={loading || googleLoading} 
            variant="outline"
            className="w-full h-12 rounded-xl bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-200 border-zinc-200 dark:border-zinc-800 shadow-xs font-semibold text-sm transition-all flex items-center justify-center gap-3 cursor-pointer"
          >
            {googleLoading ? (
              <div className="h-4 w-4 rounded-full border-2 border-zinc-300 border-t-zinc-600 dark:border-zinc-700 dark:border-t-zinc-300 animate-spin" />
            ) : (
              <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" aria-hidden="true">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
            )}
            <span>Lanjutkan dengan Google</span>
          </Button>

          {/* Register Callout Card */}
          <div className="mt-8 p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                Belum punya akun pelamar?
              </p>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Buat akun hanya butuh 1 menit untuk mulai melamar.
              </p>
            </div>
            <Link 
              href="/portal-pelamar/register" 
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#079B49] hover:bg-[#06843e] text-white text-xs font-bold transition-all shrink-0 shadow-xs active:scale-95"
            >
              <span>Daftar Sekarang</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Security notice */}
          <div className="mt-8 flex items-center justify-center gap-1.5 text-[11px] text-zinc-400 dark:text-zinc-500 text-center">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Koneksi aman dilindungi enkripsi SSL KKUSB System</span>
          </div>

        </div>

        {/* Footer info */}
        <div className="w-full max-w-md mx-auto text-center pt-8 pb-2 text-[11px] text-zinc-400 dark:text-zinc-500">
          &copy; {new Date().getFullYear()} Koperasi Jasa Karyawan Usaha Sejahtera Bersama
        </div>

      </div>

    </div>
  )
}
