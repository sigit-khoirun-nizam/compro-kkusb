'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Mail, 
  Lock, 
  User, 
  ArrowLeft, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  Briefcase,
  GraduationCap,
  AlertCircle,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export default function RegisterPelamarClient() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })

  // State error input dan alert
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; email?: string; password?: string }>({})
  const [alertError, setAlertError] = useState<string | null>(null)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setAlertError(null)

    const cleanName = formData.name.trim()
    const cleanEmail = formData.email.trim()
    const password = formData.password

    // Validasi semua input jika kosong
    const errors: { name?: string; email?: string; password?: string } = {}
    if (!cleanName) {
      errors.name = 'Nama lengkap wajib diisi sesuai identitas.'
    }
    if (!cleanEmail) {
      errors.email = 'Alamat email aktif wajib diisi.'
    }
    if (!password) {
      errors.password = 'Kata sandi wajib diisi.'
    } else if (password.length < 6) {
      errors.password = 'Kata sandi minimal harus 6 karakter.'
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      const count = Object.keys(errors).length
      const message = count >= 2
        ? 'Harap isi semua kolom pendaftaran yang bertanda bintang (*).'
        : Object.values(errors)[0] || 'Terdapat kolom yang belum diisi.'

      setAlertError(message)
      toast.error('Harap lengkapi semua kolom!', {
        description: message
      })
      return
    }

    setFieldErrors({})
    setLoading(true)
    
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: cleanName,
          email: cleanEmail.toLowerCase(),
          password
        })
      })

      const data = await res.json()
      
      if (!res.ok) throw new Error(data.error || 'Gagal mendaftar')
      
      toast.success('Pendaftaran akun berhasil!', { 
        description: 'Akun Anda telah terdaftar. Silakan masuk untuk melamar pekerjaan.' 
      })
      router.push('/portal-pelamar')
    } catch (error: any) {
      setAlertError(error.message || 'Terjadi kesalahan saat pendaftaran akun')
      toast.error(error.message || 'Terjadi kesalahan saat pendaftaran')
    } finally {
      setLoading(false)
    }
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
            Registrasi Calon Karyawan
          </div>
        </div>

        {/* Center Content */}
        <div className="relative z-10 my-auto py-12 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-emerald-100 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Mulai Langkah Awal Karir Impianmu</span>
          </div>

          <h1 className="text-3xl xl:text-4xl 2xl:text-5xl font-black tracking-tight leading-tight mb-5 text-white drop-shadow-sm">
            Bergabunglah Bersama Keluarga Besar KKUSB
          </h1>

          <p className="text-sm xl:text-base text-emerald-100/90 leading-relaxed font-normal mb-8">
            Daftarkan diri Anda hanya dalam beberapa langkah mudah. Nikmati kemudahan melamar di beragam unit usaha strategis koperasi.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
              <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
              <p className="text-xs text-emerald-100/90">Satu akun untuk melamar di semua lowongan yang tersedia</p>
            </div>
            <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
              <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
              <p className="text-xs text-emerald-100/90">Notifikasi status seleksi berkas dan jadwal tes otomatis</p>
            </div>
            <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
              <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
              <p className="text-xs text-emerald-100/90">Akses ujian kompetensi online kapan pun jadwal dimulai</p>
            </div>
          </div>
        </div>

        {/* Bottom Panel */}
        <div className="relative z-10 pt-6 border-t border-white/15 flex items-center justify-between text-xs text-emerald-200/90">
          <span>&copy; {new Date().getFullYear()} KKUSB Rekrutmen &bull; Karir Profesional</span>
          <span className="text-[11px] text-emerald-300/80">Keamanan Data Terjamin</span>
        </div>

      </div>

      {/* RIGHT COLUMN: REGISTRATION FORM */}
      <div className="w-full lg:w-1/2 xl:w-5/12 flex flex-col justify-between p-4 sm:p-8 xl:p-12 relative overflow-y-auto">
        
        {/* Top Header Bar */}
        <div className="w-full max-w-md mx-auto flex items-center justify-between pt-2 mb-6">
          <Link 
            href="/portal-pelamar" 
            className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-[#079B49] dark:hover:text-[#10B981] transition-colors group"
          >
            <div className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-950/40 text-zinc-600 dark:text-zinc-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              <ArrowLeft className="h-3.5 w-3.5" />
            </div>
            <span>Kembali ke Halaman Masuk</span>
          </Link>
          
          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </div>

        {/* Main Card */}
        <div className="w-full max-w-md mx-auto my-auto">
          
          {/* Mobile Header Branding */}
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
              Pendaftaran Akun Baru
            </span>
          </div>

          <div className="mb-8 text-center sm:text-left">
            <div className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 text-[11px] font-bold text-[#079B49] dark:text-[#10B981] mb-3">
              <Sparkles className="w-3 h-3 text-amber-500" />
              Registrasi Pelamar
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight mb-2">
              Buat Akun Pelamar Baru
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Daftarkan diri Anda untuk melamar posisi karir dan mengikuti tahapan seleksi online KKUSB.
            </p>
          </div>

          {/* Alert Notification */}
          {alertError && (
            <div 
              role="alert"
              className="w-full mb-6 p-4 rounded-2xl border text-left flex items-start gap-3.5 transition-all animate-in fade-in slide-in-from-top-2 shadow-xs bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-900/70 text-rose-900 dark:text-rose-200"
            >
              <div className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 shadow-xs bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-300">
                <AlertCircle className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-bold text-xs sm:text-sm leading-tight">
                    Kolom Masih Kosong
                  </h4>
                  <button 
                    onClick={() => setAlertError(null)} 
                    className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-1 rounded-md transition-colors"
                    aria-label="Tutup notifikasi"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
                <p className="text-[11px] sm:text-xs leading-relaxed mt-1 opacity-90">
                  {alertError}
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleRegister} noValidate className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label 
                  htmlFor="name" 
                  className={cn(
                    "text-xs font-semibold transition-colors",
                    fieldErrors.name ? "text-red-600 dark:text-red-400" : "text-zinc-700 dark:text-zinc-300"
                  )}
                >
                  Nama Lengkap (Sesuai KTP) <span className="text-red-500">*</span>
                </Label>
              </div>
              <div className="relative">
                <div className={cn(
                  "absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors",
                  fieldErrors.name ? "text-red-500" : "text-zinc-400"
                )}>
                  <User className="h-4 w-4" />
                </div>
                <Input 
                  id="name" 
                  type="text" 
                  placeholder="Contoh: Ahmad Rizky"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({...formData, name: e.target.value})
                    if (fieldErrors.name) {
                      setFieldErrors(prev => ({ ...prev, name: undefined }))
                    }
                    if (alertError) setAlertError(null)
                  }}
                  className={cn(
                    "pl-10 h-12 rounded-xl bg-white dark:bg-zinc-900 text-sm transition-all shadow-xs",
                    fieldErrors.name 
                      ? "border-red-500 dark:border-red-500 focus-visible:ring-2 focus-visible:ring-red-500/30 ring-red-500/10 ring-2" 
                      : "border-zinc-200 dark:border-zinc-800 focus-visible:ring-2 focus-visible:ring-emerald-500 dark:focus-visible:ring-emerald-400"
                  )}
                />
              </div>
              {fieldErrors.name && (
                <p className="text-[11px] font-medium text-red-600 dark:text-red-400 flex items-center gap-1.5 mt-1 animate-in fade-in duration-200">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{fieldErrors.name}</span>
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label 
                  htmlFor="email" 
                  className={cn(
                    "text-xs font-semibold transition-colors",
                    fieldErrors.email ? "text-red-600 dark:text-red-400" : "text-zinc-700 dark:text-zinc-300"
                  )}
                >
                  Alamat Email Aktif <span className="text-red-500">*</span>
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
                    if (alertError) setAlertError(null)
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

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label 
                  htmlFor="password" 
                  className={cn(
                    "text-xs font-semibold transition-colors",
                    fieldErrors.password ? "text-red-600 dark:text-red-400" : "text-zinc-700 dark:text-zinc-300"
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
                  placeholder="Minimal 6 karakter"
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({...formData, password: e.target.value})
                    if (fieldErrors.password) {
                      setFieldErrors(prev => ({ ...prev, password: undefined }))
                    }
                    if (alertError) setAlertError(null)
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
              {fieldErrors.password ? (
                <p className="text-[11px] font-medium text-red-600 dark:text-red-400 flex items-center gap-1.5 mt-1 animate-in fade-in duration-200">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{fieldErrors.password}</span>
                </p>
              ) : (
                <p className="text-[11px] text-zinc-400 dark:text-zinc-500 pt-0.5">
                  Gunakan kombinasi huruf dan angka untuk keamanan optimal (minimal 6 karakter).
                </p>
              )}
            </div>

            <Button 
              type="submit" 
              disabled={loading} 
              className="w-full h-12 mt-3 rounded-xl bg-gradient-to-r from-[#079B49] to-[#05823c] hover:from-[#06843e] hover:to-[#046c32] text-white font-bold text-sm shadow-md shadow-emerald-700/20 active:scale-[0.99] transition-all cursor-pointer"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  <span>Mendaftarkan Akun...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>Daftar Akun Sekarang</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </Button>
          </form>

          {/* Already have account card */}
          <div className="mt-8 p-4 rounded-2xl bg-zinc-100/70 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                Sudah memiliki akun pelamar?
              </p>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Masuk untuk melanjutkan lamaran pekerjaan Anda.
              </p>
            </div>
            <Link 
              href="/portal-pelamar" 
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-100 text-xs font-bold transition-all shrink-0 shadow-xs active:scale-95"
            >
              <span>Masuk di Sini</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="mt-8 flex items-center justify-center gap-1.5 text-[11px] text-zinc-400 dark:text-zinc-500 text-center">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Pendaftaran resmi dan gratis tanpa dipungut biaya apapun</span>
          </div>

        </div>

        {/* Footer */}
        <div className="w-full max-w-md mx-auto text-center pt-8 pb-2 text-[11px] text-zinc-400 dark:text-zinc-500">
          &copy; {new Date().getFullYear()} Koperasi Jasa Karyawan Usaha Sejahtera Bersama
        </div>

      </div>

    </div>
  )
}
