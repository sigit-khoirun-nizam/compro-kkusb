import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Home, Briefcase, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col items-center justify-center p-4 selection:bg-[#079B49]/20 selection:text-[#075C35]">
      <div className="max-w-md w-full text-center space-y-6">
        
        <Link href="/" className="inline-block">
          <Image 
            src="/logo.png" 
            alt="Logo KKUSB" 
            width={120} 
            height={42} 
            className="h-10 w-auto object-contain mx-auto"
            priority
          />
        </Link>

        <div className="space-y-2">
          <span className="text-5xl font-black text-[#079B49] tracking-tight block">
            404
          </span>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Halaman Tidak Ditemukan
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed">
            Halaman yang Anda tuju mungkin telah dipindahkan, diubah jalurnya, atau tidak tersedia sementara.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#F6F8F6] dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2 text-xs">
          <p className="font-semibold text-zinc-700 dark:text-zinc-300">Tautan Rekomendasi:</p>
          <div className="flex flex-wrap justify-center gap-2">
            <Button asChild size="sm" variant="outline" className="rounded-full text-xs">
              <Link href="/">
                <Home className="mr-1.5 h-3.5 w-3.5" /> Beranda
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline" className="rounded-full text-xs">
              <Link href="/unit-usaha">
                <Briefcase className="mr-1.5 h-3.5 w-3.5" /> Unit Usaha
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline" className="rounded-full text-xs">
              <Link href="/kontak">
                <Mail className="mr-1.5 h-3.5 w-3.5" /> Kontak
              </Link>
            </Button>
          </div>
        </div>

        <div>
          <Button asChild className="bg-[#079B49] hover:bg-[#075C35] text-white rounded-full px-6">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Halaman Utama
            </Link>
          </Button>
        </div>

      </div>
    </div>
  )
}
