import Link from 'next/link'
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Clock, 
  Tag, 
  Share2, 
  ChevronRight,
  ArrowRight,
  Sparkles
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { NEWS_ARTICLES, NewsItem } from '@/lib/data/kkusb-data'

async function getArticleBySlug(slug: string): Promise<NewsItem | null> {
  const fallback = NEWS_ARTICLES.find(b => b.slug === slug)

  try {
    const dbNews = await prisma.news.findUnique({
      where: { slug },
      include: { category: true }
    })

    if (dbNews) {
      return {
        id: dbNews.id,
        title: dbNews.title,
        slug: dbNews.slug,
        category: (dbNews.category?.name as any) || fallback?.category || 'Berita Terbaru',
        categorySlug: dbNews.category?.slug || fallback?.categorySlug || 'berita-terbaru',
        date: dbNews.publishedAt ? new Date(dbNews.publishedAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : (fallback?.date || ''),
        author: dbNews.author || fallback?.author || 'Sekretariat KKUSB',
        readTime: fallback?.readTime || '3 menit baca',
        excerpt: dbNews.excerpt || fallback?.excerpt || '',
        content: dbNews.content 
          ? [dbNews.content] 
          : (fallback?.content || [dbNews.excerpt || '']),
        featuredImage: dbNews.featuredImage || fallback?.featuredImage || "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?q=80&w=1200&auto=format&fit=crop",
        tags: fallback?.tags || ['KKUSB', 'Koperasi', 'Gresik']
      }
    }
  } catch (e) {
    // Graceful fallback
  }

  return fallback || null
}

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> | { slug: string } 
}): Promise<Metadata> {
  const resolvedParams = await params
  const article = await getArticleBySlug(resolvedParams.slug)
  
  if (!article) return { title: 'Berita Tidak Ditemukan | KKUSB' }
  
  return {
    title: `${article.title} — Berita KKUSB`,
    description: article.excerpt || article.title,
  }
}

export default async function BeritaDetailPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> | { slug: string } 
}) {
  const resolvedParams = await params
  const article = await getArticleBySlug(resolvedParams.slug)

  if (!article) {
    notFound()
  }

  const relatedArticles = NEWS_ARTICLES.filter(n => n.slug !== article.slug).slice(0, 3)

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 selection:bg-[#079B49]/20 selection:text-[#075C35]">
      
      {/* 1. ARTICLE HEADER */}
      <section className="relative overflow-hidden pt-12 pb-14 border-b border-zinc-200 dark:border-zinc-800 bg-[#F6F8F6]/80 dark:bg-zinc-900/40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl space-y-6">
          
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-zinc-500">
            <Link href="/" className="hover:text-[#079B49] transition-colors">Beranda</Link>
            <ChevronRight className="h-3.5 w-3.5 text-zinc-400" />
            <Link href="/berita" className="hover:text-[#079B49] transition-colors">Berita & Kegiatan</Link>
            <ChevronRight className="h-3.5 w-3.5 text-zinc-400" />
            <span className="text-zinc-900 dark:text-zinc-100 font-semibold line-clamp-1">{article.title}</span>
          </nav>

          <div className="space-y-4">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#079B49] bg-green-100/70 dark:bg-green-950/70 px-3 py-1 rounded-full">
              <Tag className="h-3 w-3" />
              <span>{article.category}</span>
            </span>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 leading-tight">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500 pt-2 border-t border-zinc-200 dark:border-zinc-800">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-[#079B49]" />
                {article.date}
              </span>
              <span>&bull;</span>
              <span className="flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-[#079B49]" />
                {article.author}
              </span>
              <span>&bull;</span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-[#079B49]" />
                {article.readTime}
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* 2. ARTICLE BODY CONTENT */}
      <article className="py-16 lg:py-20 border-b border-zinc-100 dark:border-zinc-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl space-y-10">
          
          {/* Featured Image */}
          <div className="rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-xl aspect-[16/9] bg-zinc-100 dark:bg-zinc-900">
            <img 
              src={article.featuredImage} 
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Lead Paragraph Excerpt */}
          <div className="p-6 rounded-2xl bg-[#F6F8F6] dark:bg-zinc-900/50 border-l-4 border-[#079B49] text-base sm:text-lg font-medium text-zinc-800 dark:text-zinc-200 leading-relaxed italic">
            "{article.excerpt}"
          </div>

          {/* Body Paragraphs */}
          <div className="space-y-6 text-base text-zinc-700 dark:text-zinc-300 leading-relaxed font-light">
            {article.content.map((paragraph, idx) => (
              <p key={idx} dangerouslySetInnerHTML={{ __html: paragraph }} />
            ))}
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Tagar Terkait</h4>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((t, idx) => (
                  <span 
                    key={idx}
                    className="px-3 py-1 rounded-full bg-[#F6F8F6] dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-400 font-medium"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Back Button */}
          <div className="pt-4 flex items-center justify-between">
            <Button asChild variant="outline" className="rounded-full text-xs">
              <Link href="/berita">
                <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Indeks Berita
              </Link>
            </Button>
          </div>

        </div>
      </article>

      {/* 3. RELATED ARTICLES */}
      <section className="py-16 bg-[#F6F8F6]/80 dark:bg-zinc-900/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              Artikel & Berita Terkait Lainnya
            </h3>
            <Link href="/berita" className="text-xs font-semibold text-[#079B49] hover:underline">
              Lihat Semua &rarr;
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {relatedArticles.map((rel) => (
              <Link
                key={rel.id}
                href={`/berita/${rel.slug}`}
                className="group p-5 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-3 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-[#079B49] bg-green-50 dark:bg-green-950/40 px-2 py-0.5 rounded">
                    {rel.category}
                  </span>
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-[#079B49] transition-colors leading-snug line-clamp-2">
                    {rel.title}
                  </h4>
                  <p className="text-xs text-zinc-500 line-clamp-2">
                    {rel.excerpt}
                  </p>
                </div>
                <div className="pt-2 text-[11px] text-zinc-400 border-t border-zinc-100 dark:border-zinc-800">
                  {rel.date}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
