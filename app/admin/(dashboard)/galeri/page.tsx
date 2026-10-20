import Link from 'next/link'
import { Plus, Image as ImageIcon, Calendar } from 'lucide-react'
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
import DeleteGaleriButton from '@/components/admin/delete-galeri-button'
import TablePagination from '@/components/admin/table-pagination'
import TableSearch from '@/components/admin/table-search'

export default async function GaleriPage({
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

  let galleries: any[] = []
  let totalCount = 0

  try {
    const where: any = query
      ? {
          OR: [
            { title: { contains: query } },
            { description: { contains: query } },
            { category: { name: { contains: query } } },
          ],
        }
      : {}

    const [count, dbGalleries] = await Promise.all([
      prisma.gallery.count({ where }),
      prisma.gallery.findMany({
        where,
        include: { category: true },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ])

    totalCount = count
    galleries = dbGalleries
  } catch (err) {
    totalCount = 0
    galleries = []
  }

  const totalPages = Math.ceil(totalCount / limit) || 1

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Manajemen Galeri Kegiatan</h1>
          <p className="text-zinc-500 text-sm mt-0.5">Kelola dokumentasi visual, album foto, dan arsip kegiatan organisasi KKUSB.</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button asChild className="bg-[#079B49] hover:bg-[#075C35] text-white text-xs">
            <Link href="/admin/galeri/create">
              <Plus className="mr-1.5 h-3.5 w-3.5" /> Tambah Foto
            </Link>
          </Button>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <TableSearch placeholder="Cari judul kegiatan atau foto..." initialQuery={query} />
        {query && (
          <div className="text-xs text-zinc-500 flex items-center gap-1.5">
            <span>Ditemukan: <strong className="text-zinc-900 dark:text-zinc-100">{totalCount}</strong> foto</span>
          </div>
        )}
      </div>

      {/* Table Container */}
      <div className="border border-[#E4E9E5] dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 overflow-hidden shadow-xs">
        <Table>
          <TableHeader className="bg-zinc-50 dark:bg-zinc-900">
            <TableRow>
              <TableHead className="w-[120px] text-center">Foto</TableHead>
              <TableHead>Judul Kegiatan</TableHead>
              <TableHead className="w-[150px]">Kategori</TableHead>
              <TableHead className="w-[110px]">Status</TableHead>
              <TableHead className="text-right pr-6">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {galleries.map((item) => (
              <TableRow key={item.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50">
                <TableCell className="text-center">
                  <div className="h-14 w-20 rounded-md overflow-hidden bg-zinc-100 dark:bg-zinc-800 mx-auto flex items-center justify-center border border-zinc-200 dark:border-zinc-700">
                    {item.image ? (
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="h-5 w-5 text-zinc-400" />
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100 line-clamp-1">{item.title}</span>
                    <div className="flex items-center text-xs text-zinc-500 mt-1">
                      <Calendar className="mr-1 h-3 w-3" />
                      {item.date ? new Date(item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                    </div>
                    {item.description && (
                      <p className="text-xs text-zinc-500 line-clamp-1 mt-0.5">{item.description}</p>
                    )}
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
                <TableCell className="text-right pr-6">
                  <div className="flex items-center justify-end gap-1.5">
                    <Button asChild variant="outline" size="sm" className="h-8 text-xs">
                      <Link href={`/admin/galeri/${item.id}/edit`}>Edit</Link>
                    </Button>
                    <DeleteGaleriButton id={item.id} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {galleries.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-32 text-zinc-400">
                  {query
                    ? `Tidak ada dokumentasi foto yang sesuai dengan kata kunci "${query}".`
                    : 'Belum ada dokumentasi foto. Klik "Tambah Foto" untuk mengunggah dokumentasi kegiatan pertama.'}
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
