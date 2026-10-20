import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { 
  Briefcase, 
  Image as ImageIcon, 
  Mail, 
  Newspaper, 
  Users, 
  TrendingUp, 
  CheckCircle2, 
  ArrowRight,
  Plus,
  Settings,
  GraduationCap,
  UserCheck,
  FileText,
  ExternalLink,
  Clock,
  Sparkles,
  Building2,
  Eye,
  ShieldCheck
} from 'lucide-react'
import prisma from '@/lib/prisma'
import { DashboardChart } from '@/components/admin/dashboard-chart'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { id } from 'date-fns/locale'
import { BUSINESS_UNITS, NEWS_ARTICLES, CORPORATE_PARTNERS, JOB_VACANCIES } from '@/lib/data/kkusb-data'

export default async function AdminDashboard() {
  // Graceful DB fetch with fallback
  let newsCount = NEWS_ARTICLES.length
  let unitCount = BUSINESS_UNITS.length
  let clientCount = CORPORATE_PARTNERS.length
  let galleryCount = 6
  let messageCount = 0
  let jobCount = JOB_VACANCIES.length
  let applicantCount = 0
  let recentMessages: any[] = []
  let recentNews: any[] = []

  try {
    const [
      dbNewsCount,
      dbUnitCount,
      dbClientCount,
      dbGalleryCount,
      dbMessageCount,
      dbJobCount,
      dbApplicantCount,
      dbRecentMessages,
      dbRecentNews
    ] = await Promise.all([
      prisma.news.count(),
      prisma.unitUsaha.count(),
      prisma.client.count(),
      prisma.gallery.count(),
      prisma.contactMessage.count({ where: { isRead: false } }),
      prisma.jobPosting.count({ where: { status: 'PUBLISHED' } }),
      prisma.applicant.count(),
      prisma.contactMessage.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.news.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { category: true }
      })
    ])

    newsCount = dbNewsCount || newsCount
    unitCount = dbUnitCount || unitCount
    clientCount = dbClientCount || clientCount
    galleryCount = dbGalleryCount || galleryCount
    messageCount = dbMessageCount
    jobCount = dbJobCount || jobCount
    applicantCount = dbApplicantCount
    recentMessages = dbRecentMessages
    recentNews = dbRecentNews
  } catch (err) {
    // Graceful fallback when database is starting or offline
  }

  // Fallback demo news if empty
  if (recentNews.length === 0) {
    recentNews = NEWS_ARTICLES.slice(0, 4).map(item => ({
      id: item.id,
      title: item.title,
      category: { name: item.category },
      status: 'PUBLISHED',
      publishedAt: new Date(),
      slug: item.slug
    }))
  }

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-10">
      
      {/* 1. WELCOME HEADER */}
      <div className="bg-white dark:bg-zinc-900 border border-[#E4E9E5] dark:border-zinc-800 rounded-xl p-5 md:p-6 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#075C35] dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
              <ShieldCheck className="h-3 w-3" />
              Sistem Manajemen Konten Aktif
            </span>
            <span className="text-xs text-zinc-400">• KKUSB 2026</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Selamat Datang di CMS KKUSB
          </h1>
          <p className="text-zinc-500 text-xs md:text-sm mt-1 max-w-2xl leading-relaxed">
            Pusat pengelolaan publikasi, data unit usaha koperasi, keterbukaan informasi, lowongan karir, dan aspirasi anggota terintegrasi.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <Button asChild size="sm" variant="outline" className="text-xs border-[#E4E9E5] hover:bg-zinc-50">
            <Link href="/admin/settings">
              <Settings className="mr-1.5 h-3.5 w-3.5 text-zinc-500" />
              Pengaturan Web
            </Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="text-xs border-[#E4E9E5] hover:bg-zinc-50">
            <Link href="/admin/unit-usaha/create">
              <Plus className="mr-1.5 h-3.5 w-3.5 text-zinc-500" />
              Unit Usaha
            </Link>
          </Button>
          <Button asChild size="sm" className="bg-[#079B49] hover:bg-[#075C35] text-white text-xs font-semibold shadow-xs">
            <Link href="/admin/berita/create">
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Buat Artikel Baru
            </Link>
          </Button>
        </div>
      </div>

      {/* 2. STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 md:gap-4">
        
        {/* Total Berita */}
        <Link href="/admin/berita" className="group">
          <Card className="h-full border-[#E4E9E5] dark:border-zinc-800 hover:border-[#079B49] transition-all hover:shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3.5 pb-1">
              <CardTitle className="text-xs font-medium text-zinc-500">Berita & Artikel</CardTitle>
              <Newspaper className="h-3.5 w-3.5 text-zinc-400 group-hover:text-[#079B49] transition-colors" />
            </CardHeader>
            <CardContent className="p-3.5 pt-1">
              <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{newsCount}</div>
              <p className="text-[10px] text-zinc-400 mt-0.5">Artikel aktif</p>
            </CardContent>
          </Card>
        </Link>

        {/* Unit Usaha */}
        <Link href="/admin/unit-usaha" className="group">
          <Card className="h-full border-[#E4E9E5] dark:border-zinc-800 hover:border-[#079B49] transition-all hover:shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3.5 pb-1">
              <CardTitle className="text-xs font-medium text-zinc-500">Unit Usaha</CardTitle>
              <Briefcase className="h-3.5 w-3.5 text-zinc-400 group-hover:text-[#079B49] transition-colors" />
            </CardHeader>
            <CardContent className="p-3.5 pt-1">
              <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{unitCount}</div>
              <p className="text-[10px] text-zinc-400 mt-0.5">Layanan mandiri</p>
            </CardContent>
          </Card>
        </Link>

        {/* Mitra & Klien */}
        <Link href="/admin/klien" className="group">
          <Card className="h-full border-[#E4E9E5] dark:border-zinc-800 hover:border-[#079B49] transition-all hover:shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3.5 pb-1">
              <CardTitle className="text-xs font-medium text-zinc-500">Klien & Mitra</CardTitle>
              <Building2 className="h-3.5 w-3.5 text-zinc-400 group-hover:text-[#079B49] transition-colors" />
            </CardHeader>
            <CardContent className="p-3.5 pt-1">
              <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{clientCount}</div>
              <p className="text-[10px] text-zinc-400 mt-0.5">Korporasi mitra</p>
            </CardContent>
          </Card>
        </Link>

        {/* Galeri Foto */}
        <Link href="/admin/galeri" className="group">
          <Card className="h-full border-[#E4E9E5] dark:border-zinc-800 hover:border-[#079B49] transition-all hover:shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3.5 pb-1">
              <CardTitle className="text-xs font-medium text-zinc-500">Galeri Foto</CardTitle>
              <ImageIcon className="h-3.5 w-3.5 text-zinc-400 group-hover:text-[#079B49] transition-colors" />
            </CardHeader>
            <CardContent className="p-3.5 pt-1">
              <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{galleryCount}</div>
              <p className="text-[10px] text-zinc-400 mt-0.5">Dokumentasi</p>
            </CardContent>
          </Card>
        </Link>

        {/* Pesan Masuk Belum Dibaca */}
        <Link href="/admin/pesan" className="group">
          <Card className={`h-full border-[#E4E9E5] dark:border-zinc-800 transition-all hover:shadow-xs ${messageCount > 0 ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-200' : 'hover:border-[#079B49]'}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3.5 pb-1">
              <CardTitle className="text-xs font-medium text-zinc-500">Pesan Masuk</CardTitle>
              <Mail className={`h-3.5 w-3.5 ${messageCount > 0 ? 'text-amber-600' : 'text-zinc-400'}`} />
            </CardHeader>
            <CardContent className="p-3.5 pt-1">
              <div className={`text-xl font-bold ${messageCount > 0 ? 'text-amber-700 dark:text-amber-400' : 'text-zinc-900 dark:text-zinc-100'}`}>
                {messageCount}
              </div>
              <p className="text-[10px] text-zinc-400 mt-0.5">Belum dibaca</p>
            </CardContent>
          </Card>
        </Link>

        {/* Lowongan Aktif */}
        <Link href="/admin/karir" className="group">
          <Card className="h-full border-[#E4E9E5] dark:border-zinc-800 hover:border-[#079B49] transition-all hover:shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3.5 pb-1">
              <CardTitle className="text-xs font-medium text-zinc-500">Lowongan Karir</CardTitle>
              <GraduationCap className="h-3.5 w-3.5 text-zinc-400 group-hover:text-[#079B49] transition-colors" />
            </CardHeader>
            <CardContent className="p-3.5 pt-1">
              <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{jobCount}</div>
              <p className="text-[10px] text-zinc-400 mt-0.5">Posisi terbuka</p>
            </CardContent>
          </Card>
        </Link>

        {/* Total Pelamar */}
        <Link href="/admin/karir/pelamar" className="group col-span-2 md:col-span-1">
          <Card className="h-full border-[#E4E9E5] dark:border-zinc-800 hover:border-[#079B49] transition-all hover:shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3.5 pb-1">
              <CardTitle className="text-xs font-medium text-zinc-500">Data Pelamar</CardTitle>
              <UserCheck className="h-3.5 w-3.5 text-zinc-400 group-hover:text-[#079B49] transition-colors" />
            </CardHeader>
            <CardContent className="p-3.5 pt-1">
              <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{applicantCount}</div>
              <p className="text-[10px] text-zinc-400 mt-0.5">Berkas masuk</p>
            </CardContent>
          </Card>
        </Link>

      </div>

      {/* 3. CHARTS & RECENT MESSAGES */}
      <div className="grid gap-5 lg:grid-cols-12">
        
        {/* Activity Chart (7 Cols) */}
        <Card className="lg:col-span-7 border-[#E4E9E5] dark:border-zinc-800 shadow-xs">
          <CardHeader className="p-4 md:p-5 pb-2">
            <CardTitle className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              Tren Aktivitas Publikasi & Pesan Masuk
            </CardTitle>
            <CardDescription className="text-xs">
              Pemantauan intensitas update konten website dan saluran pesan publik
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 md:p-5 pt-1">
            <DashboardChart />
          </CardContent>
        </Card>

        {/* Recent Messages (5 Cols) */}
        <Card className="lg:col-span-5 border-[#E4E9E5] dark:border-zinc-800 shadow-xs flex flex-col">
          <CardHeader className="p-4 md:p-5 pb-3 border-b border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  Pesan Terbaru Masuk
                </CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  Pertanyaan dan pesan dari form kontak publik
                </CardDescription>
              </div>
              <Button asChild variant="ghost" size="sm" className="h-7 text-xs text-[#079B49] hover:bg-emerald-50">
                <Link href="/admin/pesan">Semua</Link>
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-4 flex-1">
            <div className="space-y-3">
              {recentMessages.length === 0 ? (
                <div className="flex h-[240px] flex-col items-center justify-center text-center p-4">
                  <div className="h-10 w-10 rounded-full bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center mb-2 text-[#079B49]">
                    <Mail className="h-5 w-5" />
                  </div>
                  <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">Kotak Masuk Terkendali</p>
                  <p className="text-[11px] text-zinc-400 mt-0.5 max-w-[220px]">
                    Belum ada pesan baru yang belum diproses dari formulir kontak.
                  </p>
                </div>
              ) : (
                recentMessages.map((msg) => (
                  <Link 
                    key={msg.id} 
                    href={`/admin/pesan/${msg.id}`}
                    className="flex items-start gap-3 p-2.5 rounded-lg border border-transparent hover:border-[#E4E9E5] hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group"
                  >
                    <div className={`h-8 w-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold ${
                      msg.isRead 
                        ? 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800' 
                        : 'bg-[#079B49]/10 text-[#075C35] dark:text-emerald-400 border border-[#079B49]/30'
                    }`}>
                      {msg.name ? msg.name.substring(0, 2).toUpperCase() : 'PS'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate group-hover:text-[#079B49]">
                          {msg.name}
                        </span>
                        <span className="text-[10px] text-zinc-400 shrink-0">
                          {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true, locale: id })}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-500 truncate mt-0.5">
                        {msg.subject || msg.message || 'Pesan masuk'}
                      </p>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </CardContent>

          <div className="p-3.5 pt-0 mt-auto border-t border-zinc-100 dark:border-zinc-800">
            <Button variant="outline" className="w-full text-xs h-8" asChild>
              <Link href="/admin/pesan">
                Kelola Semua Pesan Masuk <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </Card>

      </div>

      {/* 4. RECENT CONTENT TABLE & SHORTCUTS */}
      <div className="grid gap-5 lg:grid-cols-12">
        
        {/* Recent Articles Table (8 Cols) */}
        <Card className="lg:col-span-8 border-[#E4E9E5] dark:border-zinc-800 shadow-xs">
          <CardHeader className="p-4 md:p-5 pb-3 border-b border-zinc-100 dark:border-zinc-800 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                Pembaruan Artikel & Berita Terbaru
              </CardTitle>
              <CardDescription className="text-xs mt-0.5">
                Daftar rilis liputan dan agenda kegiatan yang sedang tayang
              </CardDescription>
            </div>
            <Button asChild variant="outline" size="sm" className="h-7 text-xs">
              <Link href="/admin/berita">Lihat Semua</Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-50 dark:bg-zinc-900 text-zinc-500 border-b border-zinc-100 dark:border-zinc-800 font-semibold">
                  <tr>
                    <th className="py-2.5 px-4">Judul Artikel</th>
                    <th className="py-2.5 px-3">Kategori</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {recentNews.map((item) => (
                    <tr key={item.id} className="hover:bg-zinc-50/60 dark:hover:bg-zinc-800/40 transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-medium text-zinc-900 dark:text-zinc-100 line-clamp-1">
                          {item.title}
                        </span>
                        <span className="text-[10px] text-zinc-400">
                          {item.slug}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <Badge variant="outline" className="text-[10px] py-0">
                          {item.category?.name || 'Berita'}
                        </Badge>
                      </td>
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                          Tayang
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button asChild variant="ghost" size="icon" className="h-7 w-7 text-zinc-500 hover:text-[#079B49]">
                            <Link href={`/admin/berita/${item.id}/edit`} title="Edit Artikel">
                              <Settings className="h-3.5 w-3.5" />
                            </Link>
                          </Button>
                          <Button asChild variant="ghost" size="icon" className="h-7 w-7 text-zinc-500 hover:text-zinc-900">
                            <a href={`/berita/${item.slug}`} target="_blank" rel="noopener noreferrer" title="Lihat di Web">
                              <Eye className="h-3.5 w-3.5" />
                            </a>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Quick Operations Panel (4 Cols) */}
        <Card className="lg:col-span-4 border-[#E4E9E5] dark:border-zinc-800 shadow-xs flex flex-col">
          <CardHeader className="p-4 md:p-5 pb-3 border-b border-zinc-100 dark:border-zinc-800">
            <CardTitle className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              Pintasan Cepat Operasional
            </CardTitle>
            <CardDescription className="text-xs mt-0.5">
              Akses cepat ke alur kerja administrasi harian
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-2.5 flex-1">
            <Link 
              href="/admin/unit-usaha"
              className="flex items-center justify-between p-2.5 rounded-lg border border-zinc-100 dark:border-zinc-800 hover:border-[#079B49]/40 hover:bg-emerald-50/20 transition-all text-xs font-medium text-zinc-700 dark:text-zinc-300"
            >
              <span className="flex items-center gap-2">
                <Briefcase className="h-3.5 w-3.5 text-[#079B49]" />
                Kelola 6 Unit Usaha KKUSB
              </span>
              <ArrowRight className="h-3 w-3 text-zinc-400" />
            </Link>

            <Link 
              href="/admin/karir/pelamar"
              className="flex items-center justify-between p-2.5 rounded-lg border border-zinc-100 dark:border-zinc-800 hover:border-[#079B49]/40 hover:bg-emerald-50/20 transition-all text-xs font-medium text-zinc-700 dark:text-zinc-300"
            >
              <span className="flex items-center gap-2">
                <UserCheck className="h-3.5 w-3.5 text-[#079B49]" />
                Verifikasi Berkas Pelamar
              </span>
              <ArrowRight className="h-3 w-3 text-zinc-400" />
            </Link>

            <Link 
              href="/admin/karir/tes"
              className="flex items-center justify-between p-2.5 rounded-lg border border-zinc-100 dark:border-zinc-800 hover:border-[#079B49]/40 hover:bg-emerald-50/20 transition-all text-xs font-medium text-zinc-700 dark:text-zinc-300"
            >
              <span className="flex items-center gap-2">
                <GraduationCap className="h-3.5 w-3.5 text-[#079B49]" />
                Bank Soal Tes Akademik
              </span>
              <ArrowRight className="h-3 w-3 text-zinc-400" />
            </Link>

            <Link 
              href="/admin/dokumen/create"
              className="flex items-center justify-between p-2.5 rounded-lg border border-zinc-100 dark:border-zinc-800 hover:border-[#079B49]/40 hover:bg-emerald-50/20 transition-all text-xs font-medium text-zinc-700 dark:text-zinc-300"
            >
              <span className="flex items-center gap-2">
                <FileText className="h-3.5 w-3.5 text-[#079B49]" />
                Unggah Laporan / Dokumen
              </span>
              <ArrowRight className="h-3 w-3 text-zinc-400" />
            </Link>

            <Link 
              href="/admin/klien/create"
              className="flex items-center justify-between p-2.5 rounded-lg border border-zinc-100 dark:border-zinc-800 hover:border-[#079B49]/40 hover:bg-emerald-50/20 transition-all text-xs font-medium text-zinc-700 dark:text-zinc-300"
            >
              <span className="flex items-center gap-2">
                <Building2 className="h-3.5 w-3.5 text-[#079B49]" />
                Tambah Logo Mitra Korporasi
              </span>
              <ArrowRight className="h-3 w-3 text-zinc-400" />
            </Link>
          </CardContent>
        </Card>

      </div>

    </div>
  )
}
