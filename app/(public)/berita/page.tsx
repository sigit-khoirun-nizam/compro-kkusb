import Link from 'next/link'
import { 
  ArrowRight, 
  Calendar, 
  Search, 
  Newspaper, 
  ChevronRight, 
  Clock, 
  User, 
  Tag,
  Sparkles
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import prisma from '@/lib/prisma'
import { Metadata } from 'next'
import { NEWS_ARTICLES, NewsItem } from '@/lib/data/kkusb-data'

export const metadata: Metadata = {
  title: 'Berita & Kegiatan — Portal Informasi KKUSB',
  description: 'Berita terkini, agenda kegiatan anggota, pengumuman resmi, dan artikel edukasi perkoperasian KKUSB.',
}

const categoryTabs = [
  { slug: 'semua', label: 'Semua Kategori' },
  { slug: 'berita-terbaru', label: 'Berita Terbaru' },
  { slug: 'kegiatan', label: 'Kegiatan Koperasi' },
  { slug: 'pengumuman', label: 'Pengumuman' },
  { slug: 'edukasi', label: 'Artikel dan Edukasi' },
]

export default async function PublicBeritaPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const rawQ = params.q
  const query = (typeof rawQ === 'string' ? rawQ : (Array.isArray(rawQ) ? rawQ[0] : '')) || ''
  
  const rawK = params.kategori || params.c
  const activeCategory = (typeof rawK === 'string' ? rawK : (Array.isArray(rawK) ? rawK[0] : '')) || 'semua'

  let articles: NewsItem[] = NEWS_ARTICLES

  try {
    const dbNews = await prisma.news.findMany({
      where: { 
        status: 'PUBLISHED',
      },
      include: {
        category: true
      },
      orderBy: { publishedAt: 'desc' }
    })

    if (dbNews && dbNews.length > 0) {
      articles = dbNews.map(dbN => {
        const fallback = NEWS_ARTICLES.find(b => b.slug === dbN.slug) || NEWS_ARTICLES[0]
        return {
          id: dbN.id,
          title: dbN.title,
          slug: dbN.slug,
          category: (dbN.category?.name as any) || fallback.category,
          categorySlug: dbN.category?.slug || fallback.categorySlug,
          date: dbN.publishedAt ? new Date(dbN.publishedAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : fallback.date,
          author: dbN.author || fallback.author,
          readTime: fallback.readTime,
          excerpt: dbN.excerpt || fallback.excerpt,
          content: [dbN.content || fallback.content[0]],
          featuredImage: dbN.featuredImage || fallback.featuredImage,
          tags: fallback.tags
        }
      })
    }
  } catch (e) {
    // Graceful fallback to verified news
  }

  // Filter by category
  if (activeCategory && activeCategory !== 'semua') {
    articles = articles.filter(a => a.categorySlug === activeCategory)
  }

  // Filter by query
  if (query.trim() !== '') {
    articles = articles.filter(a => 
      a.title.toLowerCase().includes(query.toLowerCase()) ||
      a.excerpt.toLowerCase().includes(query.toLowerCase()) ||
      a.tags.some(t => t.toLowerCase().includes(query.toLowerCase()))
    )
  }

  const featured = activeCategory === 'semua' && query === '' ? articles[0] : null
  const regularList = featured ? articles.slice(1) : articles

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 selection:bg-[#079B49]/20 selection:text-[#075C35]">
      
      {/* 1. HERO HEADER */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-16 lg:pb-20 border-b border-zinc-200 dark:border-zinc-800 bg-[#F6F8F6]/80 dark:bg-zinc-900/40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          
          <nav className="flex items-center gap-2 text-xs text-zinc-500 mb-6">
            <Link href="/" className="hover:text-[#079B49] transition-colors">Beranda</Link>
            <ChevronRight className="h-3.5 w-3.5 text-zinc-400" />
            <span className="text-zinc-900 dark:text-zinc-100 font-semibold">Berita & Kegiatan</span>
          </nav>

          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#079B49]">
              Pusat Informasi & Publikasi
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 leading-tight">
              Warta, Kegiatan & Edukasi KKUSB
            </h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed font-light">
              Menyajikan transparansi pelaporan, agenda rapat tahunan, pengumuman bagi anggota, dan artikel literasi ekonomi koperasi modern.
            </p>
          </div>

          {/* Search Bar */}
          <div className="mt-8 max-w-xl">
            <form action="/berita" method="GET" className="relative flex items-center">
              <Search className="absolute left-4 h-4 w-4 text-zinc-400 pointer-events-none" />
              <input
                type="text"
                name="q"
                defaultValue={query}
                placeholder="Cari judul berita, RAT, Tukang Hebat, pengumuman..."
                className="w-full pl-11 pr-24 py-3 rounded-full border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#079B49] shadow-sm"
              />
              {activeCategory !== 'semua' && (
                <input type="hidden" name="kategori" value={activeCategory} />
              )}
              <Button type="submit" size="sm" className="absolute right-1.5 bg-[#079B49] hover:bg-[#075C35] text-white rounded-full text-xs font-semibold px-4">
                Cari
              </Button>
            </form>
          </div>

        </div>
      </section>

      {/* 2. CATEGORY TABS */}
      <section className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 sticky top-16 z-30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="flex items-center gap-2 overflow-x-auto py-3 no-scrollbar text-xs font-semibold">
            {categoryTabs.map((tab) => {
              const isActive = activeCategory === tab.slug || (activeCategory === '' && tab.slug === 'semua')
              const href = tab.slug === 'semua' 
                ? (query ? `/berita?q=${encodeURIComponent(query)}` : '/berita')
                : `/berita?kategori=${tab.slug}${query ? `&q=${encodeURIComponent(query)}` : ''}`

              return (
                <Link
                  key={tab.slug}
                  href={href}
                  className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                    isActive 
                      ? 'bg-[#079B49] text-white' 
                      : 'bg-[#F6F8F6] dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-[#079B49]'
                  }`}
                >
                  {tab.label}
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* 3. ARTICLES FEED */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl space-y-12">
          
          {/* Active query indicator */}
          {(query || (activeCategory && activeCategory !== 'semua')) && (
            <div className="flex items-center justify-between p-4 rounded-2xl bg-[#F6F8F6] dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs">
              <span className="text-zinc-600 dark:text-zinc-400">
                Menampilkan hasil untuk: {activeCategory !== 'semua' && <strong className="text-[#079B49]">Kategori: {categoryTabs.find(t => t.slug === activeCategory)?.label}</strong>} {query && <span>&bull; Kata Kunci: <strong>"{query}"</strong></span>} ({articles.length} artikel)
              </span>
              <Link href="/berita" className="text-[#079B49] font-bold hover:underline">
                Reset Filter &times;
              </Link>
            </div>
          )}

          {/* Featured Headline Article (if viewing all without query) */}
          {featured && (
            <div className="group bg-[#F6F8F6]/60 dark:bg-zinc-900/40 rounded-3xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm hover:shadow-2xl transition-all grid lg:grid-cols-12 gap-0">
              <div className="lg:col-span-7 relative h-72 sm:h-96 w-full overflow-hidden">
                <img 
                  src={featured.featuredImage} 
                  alt={featured.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <span className="absolute top-4 left-4 bg-[#079B49] text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                  {featured.category}
                </span>
              </div>

              <div className="lg:col-span-5 p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-xs text-zinc-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-[#079B49]" />
                      {featured.date}
                    </span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-[#079B49]" />
                      {featured.readTime}
                    </span>
                  </div>

                  <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-[#079B49] transition-colors leading-snug">
                    <Link href={`/berita/${featured.slug}`}>
                      {featured.title}
                    </Link>
                  </h2>

                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-light line-clamp-4">
                    {featured.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs font-semibold text-[#079B49]">
                  <span className="text-zinc-500 font-normal">Oleh {featured.author}</span>
                  <Link href={`/berita/${featured.slug}`} className="inline-flex items-center gap-1 hover:underline">
                    Baca Artikel Lengkap &rarr;
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Grid of Regular Articles */}
          {regularList.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularList.map((item) => (
                <div 
                  key={item.id}
                  className="group bg-white dark:bg-zinc-950 rounded-3xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-48 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                      <img 
                        src={item.featuredImage} 
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-3 left-3 bg-white/95 dark:bg-zinc-900/95 text-[11px] font-bold text-[#079B49] px-2.5 py-0.5 rounded-full shadow-sm">
                        {item.category}
                      </span>
                    </div>

                    <div className="p-6 space-y-3">
                      <div className="flex items-center gap-3 text-[11px] text-zinc-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-[#079B49]" />
                          {item.date}
                        </span>
                        <span>&bull;</span>
                        <span>{item.readTime}</span>
                      </div>

                      <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-[#079B49] transition-colors leading-snug line-clamp-2">
                        <Link href={`/berita/${item.slug}`}>
                          {item.title}
                        </Link>
                      </h3>

                      <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-3 leading-relaxed font-light">
                        {item.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 pt-0 border-t border-zinc-100 dark:border-zinc-800 mt-4 flex items-center justify-between text-xs font-semibold text-[#079B49]">
                    <span className="text-zinc-400 font-normal">{item.author}</span>
                    <Link href={`/berita/${item.slug}`} className="hover:underline flex items-center gap-1">
                      Selengkapnya &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-[#F6F8F6] dark:bg-zinc-900 rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-700 p-8 space-y-4">
              <Newspaper className="h-12 w-12 text-zinc-400 mx-auto" />
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                Tidak ada artikel yang sesuai
              </h3>
              <p className="text-xs text-zinc-500 max-w-md mx-auto">
                Silakan coba kata kunci lain atau pilih kategori Semua Kategori untuk melihat seluruh arsip berita KKUSB.
              </p>
              <Button asChild size="sm" variant="outline" className="rounded-full">
                <Link href="/berita">
                  Lihat Semua Berita
                </Link>
              </Button>
            </div>
          )}

        </div>
      </section>

    </div>
  )
}
