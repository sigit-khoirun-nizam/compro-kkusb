import Link from 'next/link'
import { Plus, Store } from 'lucide-react'
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
import DeleteUnitUsahaButton from '@/components/admin/delete-unit-usaha-button'
import TablePagination from '@/components/admin/table-pagination'
import TableSearch from '@/components/admin/table-search'
import { BUSINESS_UNITS } from '@/lib/data/kkusb-data'

export default async function UnitUsahaPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }> | { [key: string]: string | string[] | undefined }
}) {
  const resolvedSearchParams = await searchParams
  const rawPage = resolvedSearchParams?.page
  const rawLimit = resolvedSearchParams?.limit
  const rawQ = resolvedSearchParams?.q

  const page = Math.max(1, parseInt(typeof rawPage === 'string' ? rawPage : '1', 10) || 1)
  const limit = Math.max(1, parseInt(typeof rawLimit === 'string' ? rawLimit : '5', 10) || 5)
  const query = typeof rawQ === 'string' ? rawQ.trim() : ''

  let units: any[] = []
  let totalCount = 0

  try {
    const where: any = query
      ? {
          OR: [
            { name: { contains: query } },
            { slug: { contains: query } },
            { shortDescription: { contains: query } },
          ],
        }
      : {}

    const [count, dbUnits] = await Promise.all([
      prisma.unitUsaha.count({ where }),
      prisma.unitUsaha.findMany({
        where,
        orderBy: { order: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ])

    totalCount = count
    units = dbUnits
  } catch (err) {
    let fallback = BUSINESS_UNITS.map((u, idx) => ({
      id: u.id,
      name: u.name,
      slug: u.slug,
      shortDescription: u.shortDescription,
      image: u.image,
      order: idx + 1,
      status: 'PUBLISHED',
      updatedAt: new Date(),
    }))

    if (query) {
      fallback = fallback.filter(
        (u) =>
          u.name.toLowerCase().includes(query.toLowerCase()) ||
          (u.shortDescription && u.shortDescription.toLowerCase().includes(query.toLowerCase()))
      )
    }

    totalCount = fallback.length
    units = fallback.slice((page - 1) * limit, page * limit)
  }

  const totalPages = Math.ceil(totalCount / limit) || 1

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Manajemen Unit Usaha</h1>
          <p className="text-zinc-500 text-sm mt-0.5">Kelola portofolio layanan dan unit bisnis strategis yang dikelola oleh KKUSB.</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button asChild className="bg-[#079B49] hover:bg-[#075C35] text-white text-xs">
            <Link href="/admin/unit-usaha/create">
              <Plus className="mr-1.5 h-3.5 w-3.5" /> Tambah Unit Usaha
            </Link>
          </Button>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <TableSearch placeholder="Cari nama atau deskripsi unit..." initialQuery={query} />
        {query && (
          <div className="text-xs text-zinc-500 flex items-center gap-1.5">
            <span>Ditemukan: <strong className="text-zinc-900 dark:text-zinc-100">{totalCount}</strong> unit usaha</span>
          </div>
        )}
      </div>

      {/* Table Container */}
      <div className="border border-[#E4E9E5] dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 overflow-hidden shadow-xs">
        <Table>
          <TableHeader className="bg-zinc-50 dark:bg-zinc-900">
            <TableRow>
              <TableHead className="w-[80px] text-center">Urutan</TableHead>
              <TableHead className="w-[90px] text-center">Gambar</TableHead>
              <TableHead>Nama Unit Usaha</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Terakhir Diubah</TableHead>
              <TableHead className="text-right pr-6">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {units.map((unit) => (
              <TableRow key={unit.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50">
                <TableCell className="text-center">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    {unit.order}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <div className="h-10 w-16 rounded-md overflow-hidden bg-zinc-100 dark:bg-zinc-800 mx-auto flex items-center justify-center border border-zinc-200 dark:border-zinc-700">
                    {unit.image ? (
                      <img src={unit.image} alt={unit.name} className="h-full w-full object-cover" />
                    ) : (
                      <Store className="h-5 w-5 text-zinc-400" />
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">{unit.name}</span>
                    <span className="text-xs text-zinc-500 line-clamp-1">{unit.shortDescription || 'Tidak ada deskripsi singkat'}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={unit.status === 'PUBLISHED' ? 'default' : 'secondary'} className={unit.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-none' : ''}>
                    {unit.status === 'PUBLISHED' ? 'Aktif' : 'Draft'}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-zinc-500">
                  {unit.updatedAt ? new Date(unit.updatedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                </TableCell>
                <TableCell className="text-right pr-6">
                  <div className="flex items-center justify-end gap-1.5">
                    <Button asChild variant="outline" size="sm" className="h-8 text-xs">
                      <Link href={`/admin/unit-usaha/${unit.id}/edit`}>Edit</Link>
                    </Button>
                    <DeleteUnitUsahaButton id={unit.id} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {units.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-32 text-zinc-400">
                  {query 
                    ? `Tidak ada unit usaha yang sesuai dengan kata kunci "${query}".`
                    : 'Belum ada unit usaha. Klik "Tambah Unit Usaha" untuk menambahkan unit bisnis baru.'}
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



