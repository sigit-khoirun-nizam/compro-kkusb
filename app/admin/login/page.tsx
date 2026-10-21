'use client'

import { useState, Suspense } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { 
  AlertCircle, 
  LockKeyhole, 
  Loader2, 
  ShieldCheck, 
  ArrowLeft, 
  ArrowRight,
  Eye, 
  EyeOff, 
  Mail, 
  KeyRound, 
  Server, 
  Activity, 
  ShieldAlert,
  X
} from 'lucide-react'
import { cn } from '@/lib/utils'

function AdminLoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const accessDenied = searchParams.get('error') === 'AccessDenied'
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  
  // Alert banner state
  const [error, setError] = useState(accessDenied ? 'Akses ditolak: Akun Anda tidak memiliki hak akses administrator.' : '')
  const [alertType, setAlertType] = useState<'auth_error' | 'validation'>(accessDenied ? 'auth_error' : 'auth_error')
  
  // Field-level error state
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({})
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const cleanEmail = email.trim()
    
    // Validasi semua inputan jika kosong
    const errors: { email?: string; password?: string } = {}
    if (!cleanEmail) {
      errors.email = 'Email administrator wajib diisi.'
    }
    if (!password) {
      errors.password = 'Kata sandi wajib diisi.'
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      setAlertType('validation')
      const count = Object.keys(errors).length
      if (count === 2) {
        setError('Email administrator dan kata sandi belum diisi! Silakan lengkapi semua kolom untuk melanjutkan.')
      } else if (errors.email) {
        setError('Alamat email administrator tidak boleh kosong.')
      } else {
        setError('Kata sandi administrator tidak boleh kosong.')
      }
      return
    }

    setFieldErrors({})
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: cleanEmail.toLowerCase(),
        password,
      })

      if (!result || result.error || !result.ok) {
        setAlertType('auth_error')
        const errMessage = result?.error || ''
        if (errMessage.includes('Email') || errMessage.includes('terdaftar')) {
          setFieldErrors({ email: 'Email administrator tidak terdaftar.' })
          setError('Email administrator tidak ditemukan dalam sistem.')
        } else if (errMessage.includes('Password') || errMessage.includes('salah')) {
          setFieldErrors({ password: 'Kata sandi tidak sesuai.' })
          setError('Kata sandi administrator tidak sesuai. Harap periksa kembali.')
        } else {
          setError('Email atau kata sandi administrator tidak sesuai. Silakan periksa kembali.')
        }
        setLoading(false)
      } else {
        const dest = searchParams.get('callbackUrl') || '/admin'
        window.location.href = dest
      }
    } catch {
      setAlertType('auth_error')
      setError('Terjadi kendala pada koneksi server. Silakan periksa koneksi Anda dan coba lagi.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex bg-zinc-950 text-zinc-100 relative overflow-hidden transition-colors">
      
      {/* Background Decoratives / Ambient Glows */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute -top-[15%] -left-[10%] w-[55%] h-[55%] rounded-full bg-emerald-600/15 blur-[120px]" />
        <div className="absolute -bottom-[15%] -right-[10%] w-[50%] h-[50%] rounded-full bg-green-500/10 blur-[140px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-emerald-950/20 blur-[160px]" />
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:28px_28px]" />
      </div>

      <div className="w-full flex flex-col justify-between relative z-10 p-4 sm:p-6 lg:p-10 max-w-[1400px] mx-auto min-h-screen">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between w-full pb-4">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-emerald-400 transition-colors group"
          >
            <div className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 group-hover:border-emerald-600/50 group-hover:bg-emerald-950/30 text-zinc-400 group-hover:text-emerald-400 transition-colors">
              <ArrowLeft className="h-3.5 w-3.5" />
            </div>
            <span>Kembali ke Website Publik</span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/50 border border-emerald-500/30 text-[11px] font-semibold text-emerald-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </span>
              Security Protocol Active
            </div>
            <ThemeToggle />
          </div>
        </div>

        {/* Center Main Card Container */}
        <div className="my-auto w-full py-4">
          <div className="w-full max-w-[1100px] mx-auto bg-zinc-900/90 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-black/80 flex flex-col lg:flex-row overflow-hidden border border-zinc-800/80 transition-all">
            
            {/* Left Column - Enterprise Brand & Security Pillar */}
            <div className="hidden lg:flex flex-col justify-between lg:w-1/2 bg-gradient-to-br from-[#064e29] via-[#073c24] to-zinc-950 text-white p-12 xl:p-14 relative overflow-hidden border-r border-zinc-800/60">
              
              {/* Subtle ambient lighting inside left column */}
              <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-green-400/10 blur-3xl pointer-events-none" />
              
              <div className="relative z-10">
                {/* Brand header */}
                <div className="flex items-center gap-3.5 mb-10">
                  <div className="h-12 w-12 rounded-2xl bg-white/10 backdrop-blur-md p-2 border border-white/20 shadow-lg flex items-center justify-center">
                    <Image 
                      src="/logo.png" 
                      alt="Logo KKUSB" 
                      width={40} 
                      height={40} 
                      className="h-full w-auto object-contain"
                    />
                  </div>
                  <div>
                    <span className="font-black text-xl tracking-tight text-white block">
                      KKUSB
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-200/90 tracking-wider block">
                      Enterprise Management Suite
                    </span>
                  </div>
                </div>

                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/10 border border-emerald-400/20 text-xs font-semibold text-emerald-300 mb-4">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Portal Administrasi Terpusat</span>
                </div>

                <h1 className="text-3xl xl:text-4xl font-black mb-4 tracking-tight leading-tight text-white">
                  Sistem Informasi &amp;<br />Kendali Operasional
                </h1>

                <p className="text-emerald-100/80 font-normal leading-relaxed text-sm mb-8">
                  Pusat manajemen terintegrasi untuk pengelolaan data anggota, inventaris unit usaha, karir &amp; rekrutmen, serta laporan kinerja koperasi secara aman.
                </p>

                {/* Security Feature Highlights */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
                    <div className="h-8 w-8 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
                      <LockKeyhole className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Autentikasi Terenkripsi</p>
                      <p className="text-[11px] text-emerald-200/70">Proteksi kredensial bertingkat &amp; sesi aman berdurasi terbatas</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
                    <div className="h-8 w-8 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
                      <Activity className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Audit Log Real-time</p>
                      <p className="text-[11px] text-emerald-200/70">Pencatatan aktivitas perubahan data dan jejak transaksi</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
                    <div className="h-8 w-8 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
                      <Server className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Integritas Data Koperasi</p>
                      <p className="text-[11px] text-emerald-200/70">Sinkronisasi data unit usaha &amp; pelamar pekerjaan otomatis</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="relative z-10 pt-8 mt-6 border-t border-white/15 flex items-center justify-between text-[11px] text-emerald-200/70 font-medium">
                <span>&copy; {new Date().getFullYear()} Koperasi Jasa Karyawan USB</span>
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                  v2.4.0 Production
                </span>
              </div>
            </div>

            {/* Right Column - Login Form Console */}
            <div className="w-full lg:w-1/2 p-8 sm:p-12 xl:p-14 flex flex-col justify-between bg-zinc-900/90 dark:bg-zinc-900/90 text-zinc-100">
              
              <div>
                {/* Mobile / Tablet Header Branding */}
                <div className="lg:hidden flex flex-col items-center text-center mb-8">
                  <div className="h-14 w-14 rounded-2xl bg-emerald-950/60 p-2.5 border border-emerald-500/30 shadow-lg flex items-center justify-center mb-4">
                    <Image 
                      src="/logo.png" 
                      alt="Logo KKUSB" 
                      width={44} 
                      height={44} 
                      className="h-full w-auto object-contain"
                    />
                  </div>
                  <h2 className="text-xl font-black text-white tracking-tight">KKUSB Admin Console</h2>
                  <p className="text-xs text-zinc-400 mt-0.5">Portal Administrasi &amp; Manajemen</p>
                </div>

                {/* Form Header Info */}
                <div className="mb-8 text-center lg:text-left">
                  <div className="hidden lg:flex items-center gap-2 mb-3">
                    <div className="h-9 w-9 rounded-xl bg-emerald-950/70 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-xs">
                      <KeyRound className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                      Otentikasi Staf &amp; Pengurus
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
                    Masuk ke Sistem
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                    Masukkan akun administrator Anda untuk mengelola platform KKUSB.
                  </p>
                </div>

                {/* Error / Alert Notification */}
                {error && (
                  <div 
                    role="alert"
                    className={cn(
                      "flex items-start gap-3.5 text-xs sm:text-sm p-4 rounded-2xl border mb-6 shadow-sm animate-in fade-in slide-in-from-top-2",
                      alertType === 'validation'
                        ? "text-rose-200 bg-rose-950/50 border-rose-800/70"
                        : "text-red-300 bg-red-950/50 border-red-800/60"
                    )}
                  >
                    <div className={cn(
                      "h-8 w-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5",
                      alertType === 'validation'
                        ? "bg-rose-900/60 text-rose-300"
                        : "bg-red-900/60 text-red-400"
                    )}>
                      {alertType === 'validation' ? (
                        <AlertCircle className="h-4 w-4" />
                      ) : (
                        <ShieldAlert className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-bold text-white mb-0.5">
                          {alertType === 'validation' ? 'Input Masih Kosong' : 'Gagal Masuk'}
                        </h4>
                        <button
                          type="button"
                          onClick={() => setError('')}
                          className="text-zinc-400 hover:text-white p-0.5 rounded-md transition-colors"
                          aria-label="Tutup notifikasi"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <p className="leading-relaxed opacity-90">{error}</p>
                    </div>
                  </div>
                )}

                {/* Form Elements */}
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  
                  {/* Email Field */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label 
                        htmlFor="admin-email" 
                        className={cn(
                          "text-xs font-semibold transition-colors",
                          fieldErrors.email ? "text-red-400" : "text-zinc-300"
                        )}
                      >
                        Alamat Email Administrator <span className="text-red-500">*</span>
                      </Label>
                    </div>
                    <div className="relative">
                      <div className={cn(
                        "absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors",
                        fieldErrors.email ? "text-red-400" : "text-zinc-400"
                      )}>
                        <Mail className="h-4 w-4" />
                      </div>
                      <Input
                        id="admin-email"
                        type="email"
                        autoComplete="email"
                        placeholder="admin@kkusb.co.id"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value)
                          if (fieldErrors.email) {
                            setFieldErrors(prev => ({ ...prev, email: undefined }))
                          }
                          if (alertType === 'validation') setError('')
                        }}
                        className={cn(
                          "h-12 pl-11 bg-zinc-950/80 text-zinc-100 placeholder:text-zinc-500 rounded-xl transition-all shadow-xs",
                          fieldErrors.email
                            ? "border-red-500 focus-visible:ring-2 focus-visible:ring-red-500/30 ring-2 ring-red-500/10"
                            : "border-zinc-800 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:border-emerald-500"
                        )}
                      />
                    </div>
                    {fieldErrors.email && (
                      <p className="text-[11px] font-medium text-red-400 flex items-center gap-1.5 mt-1 animate-in fade-in duration-200">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{fieldErrors.email}</span>
                      </p>
                    )}
                  </div>
                  
                  {/* Password Field */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label 
                        htmlFor="admin-password" 
                        className={cn(
                          "text-xs font-semibold transition-colors",
                          fieldErrors.password ? "text-red-400" : "text-zinc-300"
                        )}
                      >
                        Kata Sandi <span className="text-red-500">*</span>
                      </Label>
                    </div>
                    <div className="relative">
                      <div className={cn(
                        "absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors",
                        fieldErrors.password ? "text-red-400" : "text-zinc-400"
                      )}>
                        <LockKeyhole className="h-4 w-4" />
                      </div>
                      <Input
                        id="admin-password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        placeholder="••••••••••••"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value)
                          if (fieldErrors.password) {
                            setFieldErrors(prev => ({ ...prev, password: undefined }))
                          }
                          if (alertType === 'validation') setError('')
                        }}
                        className={cn(
                          "h-12 pl-11 pr-11 bg-zinc-950/80 text-zinc-100 placeholder:text-zinc-500 rounded-xl transition-all shadow-xs",
                          fieldErrors.password
                            ? "border-red-500 focus-visible:ring-2 focus-visible:ring-red-500/30 ring-2 ring-red-500/10"
                            : "border-zinc-800 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:border-emerald-500"
                        )}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 p-1 rounded-md transition-colors focus:outline-none"
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
                      <p className="text-[11px] font-medium text-red-400 flex items-center gap-1.5 mt-1 animate-in fade-in duration-200">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{fieldErrors.password}</span>
                      </p>
                    )}
                  </div>

                  {/* Remember Me / Session duration */}
                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="h-4 w-4 rounded border-zinc-700 bg-zinc-950 text-emerald-600 focus:ring-emerald-500 focus:ring-offset-zinc-900 cursor-pointer"
                      />
                      <span className="text-xs text-zinc-400">Ingat sesi di perangkat ini</span>
                    </label>

                    <span className="text-[11px] text-zinc-500">
                      Perlindungan SSL 256-bit
                    </span>
                  </div>

                  {/* Submit Button */}
                  <Button 
                    className="w-full h-12 mt-2 bg-gradient-to-r from-emerald-600 to-[#079B49] hover:from-emerald-500 hover:to-[#08ad52] text-white rounded-xl font-bold text-sm tracking-wide transition-all shadow-lg shadow-emerald-950/50 active:scale-[0.99] cursor-pointer" 
                    type="submit" 
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin text-white" />
                        <span>Mengotentikasi Administrator...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <ShieldCheck className="h-4 w-4" />
                        <span>Masuk ke Konsol</span>
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </div>
                    )}
                  </Button>
                </form>
              </div>

              {/* Bottom Notice */}
              <div className="pt-8 mt-6 border-t border-zinc-800/80">
                <div className="flex items-start gap-2.5 text-[11px] text-zinc-500 leading-relaxed">
                  <ShieldAlert className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                  <p>
                    <span className="font-semibold text-zinc-400">Perhatian:</span> Halaman ini khusus staf &amp; pengurus terotorisasi. Segala percobaan akses tanpa izin dicatat dalam log keamanan.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="w-full text-center text-[11px] text-zinc-500 pt-4">
          &copy; {new Date().getFullYear()} Koperasi Jasa Karyawan Usaha Sejahtera Bersama. All Rights Reserved.
        </div>

      </div>
    </div>
  )
}

export default function AdminLogin() {
  return (
    <Suspense fallback={
      <div className="min-h-screen w-full flex items-center justify-center bg-zinc-950 text-white">
        <div className="flex items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-emerald-500" />
          <span className="text-sm font-medium text-zinc-300">Memuat Konsol Admin KKUSB...</span>
        </div>
      </div>
    }>
      <AdminLoginForm />
    </Suspense>
  )
}