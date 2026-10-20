import Link from 'next/link'
import { Plus, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import prisma from '@/lib/prisma'
import DeleteBeritaButton from '@/components/admin/delete-berita-button'
import TablePagination from '@/components/admin/table-pagination'
import TableSearch from '@/components/admin/table-search'
import { NEWS_ARTICLES } from '@/lib/data/kkusb-data'

export default async function BeritaPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }> | { [key: string]: string | string[] | undefined }
}) {
  const resolvedSearchParams = await searchParams
  const rawPage = resolvedSearchParams?.page
  const rawLimit = resolvedSearchParams?.limit
  const rawQ = resolvedSearchParams?.q

  const page = Math.max(1, parseInt(typeof rawPage === 'string' ? rawPage : '1', 10) || 1)
  const limit = Math.max(1, parseInt(typeof rawLimit === 'string' ? rawLimit : '10', 10) || 10)
  const query = typeof rawQ === 'string' ? rawQ.trim() : ''

  let news: any[] = []
  let totalCount = 0

  try {
    const where: any = query
      ? {
          OR: [
            { title: { contains: query } },
            { slug: { contains: query } },
            { excerpt: { contains: query } },
          ],
        }
      : {}

    const [count, dbNews] = await Promise.all([
      prisma.news.count({ where }),
      prisma.news.findMany({
        where,
        include: { category: true },
        orderBy: { publishedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ])

    totalCount = count
    news = dbNews
  } catch (err) {
    let fallback = NEWS_ARTICLES.map((n) => ({
      id: n.id,
      title: n.title,
      slug: n.slug,
      excerpt: n.excerpt,
      category: { name: n.category },
      author: n.author,
      featuredImage: n.featuredImage,
      status: 'PUBLISHED',
      publishedAt: new Date(),
    }))

    if (query) {
      fallback = fallback.filter(
        (n) =>
          n.title.toLowerCase().includes(query.toLowerCase()) ||
          (n.excerpt && n.excerpt.toLowerCase().includes(query.toLowerCase()))
      )
    }

    totalCount = fallback.length
    news = fallback.slice((page - 1) * limit, page * limit)
  }

  const totalPages = Math.ceil(totalCount / limit) || 1

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Manajemen Berita &amp; Artikel</h1>
          <p className="text-zinc-500 text-sm mt-0.5">Kelola publikasi warta terbaru, dokumentasi kegiatan, dan informasi anggota KKUSB.</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button asChild className="bg-[#079B49] hover:bg-[#075C35] text-white text-xs">
            <Link href="/admin/berita/create">
              <Plus className="mr-1.5 h-3.5 w-3.5" /> Tambah Berita
            </Link>
          </Button>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <TableSearch placeholder="Cari judul berita atau artikel..." initialQuery={query} />
        {query && (
          <div className="text-xs text-zinc-500 flex items-center gap-1.5">
            <span>Ditemukan: <strong className="text-zinc-900 dark:text-zinc-100">{totalCount}</strong> berita</span>
          </div>
        )}
      </div>

      {/* Table Container */}
      <div className="border border-[#E4E9E5] dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 overflow-hidden shadow-xs">
        <Table>
          <TableHeader className="bg-zinc-50 dark:bg-zinc-900">
            <TableRow>
              <TableHead className="w-[90px] text-center">Gambar</TableHead>
              <TableHead>Artikel</TableHead>
              <TableHead className="w-[140px]">Kategori</TableHead>
              <TableHead className="w-[110px]">Status</TableHead>
              <TableHead className="w-[140px]">Tanggal Terbit</TableHead>
              <TableHead className="text-right pr-6">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {news.map((item) => (
              <TableRow key={item.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50">
                <TableCell className="text-center">
                  <div className="h-11 w-16 rounded-md overflow-hidden bg-zinc-100 dark:bg-zinc-800 mx-auto flex items-center justify-center border border-zinc-200 dark:border-zinc-700">
                    {item.featuredImage ? (
                      <img src={item.featuredImage} alt={item.title} className="h-full w-full object-cover" />
                    ) : (
                      <ImageIcon className="h-5 w-5 text-zinc-400" />
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col max-w-[340px]">
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100 line-clamp-1">{item.title}</span>
                    <span className="text-xs text-zinc-500 line-clamp-1 mt-0.5">{item.excerpt || 'Tidak ada ringkasan'}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-lg bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 text-xs font-medium text-zinc-700 dark:text-zinc-300">
                    {item.category?.name || 'Umum'}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant={item.status === 'PUBLISHED' ? 'default' : 'secondary'} className={item.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-none' : ''}>
                    {item.status === 'PUBLISHED' ? 'Aktif' : 'Draft'}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-zinc-500">
                  {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                </TableCell>
                <TableCell className="text-right pr-6">
                  <div className="flex items-center justify-end gap-1.5">
                    <Button asChild variant="outline" size="sm" className="h-8 text-xs">
                      <Link href={`/admin/berita/${item.id}/edit`}>Edit</Link>
                    </Button>
                    <DeleteBeritaButton id={item.id} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {news.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-32 text-zinc-400">
                  {query
                    ? `Tidak ada artikel berita yang sesuai dengan kata kunci "${query}".`
                    : 'Belum ada artikel berita. Klik "Tambah Berita" untuk menerbitkan artikel baru.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination Section */}
        <TablePagination
          currentPage={page}
          totalPages={totalPages}
          totalItems={totalCount}
          pageSize={limit}
          pageSizeOptions={[5, 10, 20]}
        />
      </div>
    </div>
  )
}
