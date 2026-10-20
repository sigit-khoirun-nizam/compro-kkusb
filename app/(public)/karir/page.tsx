import { Metadata } from 'next'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  ArrowRight, 
  Building2, 
  ChevronRight, 
  GraduationCap,
  HeartHandshake,
  ShieldCheck,
  CheckCircle2,
  Users
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { JOB_VACANCIES } from '@/lib/data/kkusb-data'

export const metadata: Metadata = {
  title: 'Karir & Rekrutmen — Bergabung Bersama KKUSB',
  description: 'Informasi lowongan kerja resmi, budaya kerja, dan proses rekrutmen di Koperasi Jasa Karyawan Usaha Sejahtera Bersama.',
}

export const dynamic = 'force-dynamic'

export default async function KarirPage() {
  let dbJobs: any[] = []

  try {
    dbJobs = await prisma.jobPosting.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { createdAt: 'desc' }
    })
  } catch (error) {
    console.warn('[KarirPage] Tidak dapat mengambil data JobPosting dari database, menggunakan data default:', error)
  }

  // Gunakan data dari database jika tersedia, atau fallback ke JOB_VACANCIES
  const jobs = dbJobs.length > 0 
    ? dbJobs.map(dbJ => ({
        id: dbJ.id,
        title: dbJ.title,
        slug: dbJ.slug,
        department: dbJ.department || 'Divisi IT & Korporasi',
        location: dbJ.location || 'Gresik / Jawa Timur',
        type: dbJ.type || 'Penuh Waktu',
        postedDate: new Date(dbJ.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }),
        deadline: dbJ.deadline ? new Date(dbJ.deadline).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Terbuka',
        description: dbJ.description,
        requirements: dbJ.requirements ? dbJ.requirements.split('\n').map((r: string) => r.replace(/^-\s*/, '').trim()).filter(Boolean) : []
      }))
    : JOB_VACANCIES.map(j => ({
        id: j.id,
        title: j.title,
        slug: j.slug,
        department: j.department || 'Divisi IT & Korporasi',
        location: j.location || 'Gresik / Jawa Timur',
        type: j.type || 'Penuh Waktu',
        postedDate: j.postedDate || 'Terbaru',
        deadline: j.deadline || 'Terbuka',
        description: j.description || '',
        requirements: j.requirements || []
      }))

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 selection:bg-[#079B49]/20 selection:text-[#075C35]">
      
      {/* 1. HERO HEADER */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-16 lg:pb-20 border-b border-zinc-200 dark:border-zinc-800 bg-[#F6F8F6]/80 dark:bg-zinc-900/40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          
          <nav className="flex items-center gap-2 text-xs text-zinc-500 mb-6">
            <Link href="/" className="hover:text-[#079B49] transition-colors">Beranda</Link>
            <ChevronRight className="h-3.5 w-3.5 text-zinc-400" />
            <span className="text-zinc-900 dark:text-zinc-100 font-semibold">Karir & Rekrutmen</span>
          </nav>

          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#079B49]">
              Peluang Karir & Budaya Kerja
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 leading-tight">
              Tumbuh dan Berdedikasi Bersama KKUSB
            </h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed font-light">
              Membangun masa depan profesional dalam lingkungan kerja yang menghargai dedikasi, berintegritas tinggi, dan berasaskan gotong royong kekeluargaan.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button asChild size="lg" className="bg-[#079B49] hover:bg-[#075C35] text-white rounded-full">
              <a href="#lowongan">
                Lihat Posisi Tersedia ({jobs.length}) &darr;
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full">
              <Link href="/portal-pelamar">
                <GraduationCap className="mr-2 h-4 w-4 text-[#079B49]" />
                Portal Pelamar & Tes
              </Link>
            </Button>
          </div>

        </div>
      </section>

      {/* 2. BUDAYA KERJA & MANFAAT KARYAWAN */}
      <section className="py-20 lg:py-24 border-b border-zinc-100 dark:border-zinc-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#079B49]">Nilai Unggul Tempat Kerja</span>
            <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
              Mengapa Berkarir di KKUSB?
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Kami menciptakan lingkungan kerja yang amanah, teratur, dan berorientasi pada kesejahteraan bersama seluruh staf.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: HeartHandshake,
                title: "Asas Kekeluargaan",
                desc: "Hubungan kerja harmonis yang menjunjung tinggi saling peduli, kerjasama tim, dan solidaritas antar karyawan."
              },
              {
                icon: ShieldCheck,
                title: "Perlindungan & Kesejahteraan",
                desc: "Fasilitas jaminan kesehatan, tunjangan hari raya, serta akses prioritas ke seluruh layanan simpan pinjam koperasi."
              },
              {
                icon: Briefcase,
                title: "Pengalaman Industri Nyata",
                desc: "Terlibat langsung dalam operasional ritel, rantai pasok industri semen BUMN, serta mobilitas korporat terintegrasi."
              },
              {
                icon: GraduationCap,
                title: "Pelatihan & Peningkatan Skill",
                desc: "Program pelatihan berkala untuk mengasah kemampuan teknis, kesekretariatan, etika pelayanan, dan manajemen keuangan."
              }
            ].map((b, idx) => (
              <div 
                key={idx}
                className="p-6 rounded-2xl bg-[#F6F8F6] dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-3"
              >
                <div className="h-10 w-10 rounded-xl bg-green-100 dark:bg-green-950 text-[#079B49] flex items-center justify-center">
                  <b.icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  {b.title}
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-light">
                  {b.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 3. DAFTAR LOWONGAN RESMI (#lowongan) */}
      <section id="lowongan" className="py-20 lg:py-28 scroll-mt-24 bg-[#F6F8F6]/80 dark:bg-zinc-900/30 border-b border-zinc-200/80 dark:border-zinc-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl space-y-12">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#079B49]">Posisi Terbuka</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100">
                Lowongan Kerja Aktif
              </h2>
            </div>
            <p className="text-xs text-zinc-500">Tersedia {jobs.length} posisi rekrutmen terverifikasi</p>
          </div>

          {jobs.length > 0 ? (
            <div className="space-y-6">
              {jobs.map((job) => (
                <div 
                  key={job.id}
                  className="p-8 rounded-3xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-xl transition-all space-y-6"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-[#079B49] bg-green-50 dark:bg-green-950/40 px-3 py-1 rounded-full border border-green-200 dark:border-green-900">
                          {job.department}
                        </span>
                        <span className="text-xs text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 rounded-full">
                          {job.type}
                        </span>
                      </div>

                      <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                        {job.title}
                      </h3>
                    </div>

                    <div className="text-right text-xs text-zinc-500 shrink-0">
                      <p className="flex items-center gap-1.5 md:justify-end">
                        <MapPin className="h-3.5 w-3.5 text-[#079B49]" />
                        {job.location}
                      </p>
                      <p className="mt-1 text-red-600 dark:text-red-400 font-semibold">
                        Batas Lamaran: {job.deadline}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-light">
                    {job.description}
                  </p>

                  {/* Kualifikasi preview */}
                  <div className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                    <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Kualifikasi Utama:</h4>
                    <ul className="grid sm:grid-cols-2 gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                      {job.requirements.slice(0, 4).map((req, rIdx) => (
                        <li key={rIdx} className="flex items-start gap-2">
                          <CheckCircle2 className="h-3.5 w-3.5 text-[#079B49] shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <span className="text-xs text-zinc-400">
                      Dipublikasikan: {job.postedDate}
                    </span>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <Button asChild variant="outline" className="rounded-full text-xs flex-1 sm:flex-none">
                        <Link href={`/karir/${job.slug}`}>
                          Detail Lengkap &rarr;
                        </Link>
                      </Button>
                      <Button asChild className="bg-[#079B49] hover:bg-[#075C35] text-white rounded-full text-xs font-semibold flex-1 sm:flex-none">
                        <Link href={`/karir/${job.slug}#form-lamaran`}>
                          Lamar Posisi Ini
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 sm:p-16 rounded-3xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-center space-y-4">
              <div className="h-16 w-16 bg-zinc-100 dark:bg-zinc-900 rounded-2xl flex items-center justify-center mx-auto text-zinc-400">
                <Briefcase className="h-8 w-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Belum Ada Lowongan Terbuka</h3>
                <p className="text-xs sm:text-sm text-zinc-500 max-w-md mx-auto leading-relaxed">
                  Saat ini belum ada posisi lowongan kerja baru yang dipublikasikan. Silakan daftarkan akun Anda di Portal Pelamar untuk mendapatkan pembaruan lowongan mendatang.
                </p>
              </div>
              <Button asChild className="bg-[#079B49] hover:bg-[#075C35] text-white rounded-full text-xs font-bold">
                <Link href="/portal-pelamar">
                  Buka Portal Pelamar &rarr;
                </Link>
              </Button>
            </div>
          )}

        </div>
      </section>

      {/* 4. ALUR SELEKSI & REKRUTMEN */}
      <section className="py-20 lg:py-24 border-b border-zinc-100 dark:border-zinc-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#079B49]">Panduan Pelamar</span>
            <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
              Tahapan Seleksi KKUSB
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Proses rekrutmen dilaksanakan secara objektif, bebas biaya (gratis), dan berbasis kompetensi.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: "01", title: "Pengajuan Berkas", desc: "Kirimkan CV dan kelengkapan dokumen melalui formulir resmi online atau email kantor." },
              { step: "02", title: "Seleksi Administrasi", desc: "Tim SDM melakukan verifikasi kualifikasi, pengalaman kerja, dan kelengkapan data." },
              { step: "03", title: "Tes & Wawancara", desc: "Pelamar yang lolos akan diundang tes kompetensi akademik dan wawancara bersama user." },
              { step: "04", title: "Onboarding & Orientasi", desc: "Penandatanganan kontrak kerja, pembekalan budaya kerja koperasi, dan penempatan unit." }
            ].map((st, idx) => (
              <div 
                key={idx}
                className="p-6 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-3 shadow-sm"
              >
                <span className="text-xl font-black text-[#079B49] block">
                  {st.step}
                </span>
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  {st.title}
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-light">
                  {st.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="p-5 rounded-2xl bg-[#F6F8F6] dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500 text-center">
            <strong>Peringatan Resmi:</strong> KKUSB tidak pernah memungut biaya apapun dalam proses rekrutmen karyawan. Seluruh pengumuman resmi hanya dikirim melalui email domain @kkusb.co.id atau telepon resmi kantor pusat.
          </div>

        </div>
      </section>

    </div>
  )
}
