import Link from 'next/link'
import { Plus, Globe, Building2 } from 'lucide-react'
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
import DeleteKlienButton from '@/components/admin/delete-klien-button'
import TablePagination from '@/components/admin/table-pagination'
import TableSearch from '@/components/admin/table-search'
import { CORPORATE_PARTNERS } from '@/lib/data/kkusb-data'

export default async function KlienPage({
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

  let clients: any[] = []
  let totalCount = 0

  try {
    const where: any = query
      ? {
          OR: [
            { name: { contains: query } },
            { description: { contains: query } },
            { website: { contains: query } },
          ],
        }
      : {}

    const [count, dbClients] = await Promise.all([
      prisma.client.count({ where }),
      prisma.client.findMany({
        where,
        orderBy: { order: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ])

    totalCount = count
    clients = dbClients
  } catch (err) {
    let fallback = CORPORATE_PARTNERS.map((p, idx) => ({
      id: p.id,
      name: p.name,
      logo: null,
      description: p.scope,
      website: p.website,
      order: idx + 1,
      status: 'PUBLISHED',
    }))

    if (query) {
      fallback = fallback.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          (p.description && p.description.toLowerCase().includes(query.toLowerCase()))
      )
    }

    totalCount = fallback.length
    clients = fallback.slice((page - 1) * limit, page * limit)
  }

  const totalPages = Math.ceil(totalCount / limit) || 1

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Manajemen Klien &amp; Mitra</h1>
          <p className="text-zinc-500 text-sm mt-0.5">Kelola daftar mitra kerjasama, logo perusahaan rekanan, dan portofolio relasi KKUSB.</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button asChild className="bg-[#079B49] hover:bg-[#075C35] text-white text-xs">
            <Link href="/admin/klien/create">
              <Plus className="mr-1.5 h-3.5 w-3.5" /> Tambah Mitra
            </Link>
          </Button>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <TableSearch placeholder="Cari nama mitra atau perusahaan..." initialQuery={query} />
        {query && (
          <div className="text-xs text-zinc-500 flex items-center gap-1.5">
            <span>Ditemukan: <strong className="text-zinc-900 dark:text-zinc-100">{totalCount}</strong> mitra</span>
          </div>
        )}
      </div>

      {/* Table Container */}
      <div className="border border-[#E4E9E5] dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 overflow-hidden shadow-xs">
        <Table>
          <TableHeader className="bg-zinc-50 dark:bg-zinc-900">
            <TableRow>
              <TableHead className="w-[80px] text-center">Urutan</TableHead>
              <TableHead className="w-[100px] text-center">Logo</TableHead>
              <TableHead>Nama Klien / Mitra</TableHead>
              <TableHead className="w-[200px]">Website</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right pr-6">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((item) => (
              <TableRow key={item.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50">
                <TableCell className="text-center">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    {item.order}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <div className="h-10 w-16 rounded-md overflow-hidden bg-white dark:bg-zinc-900 mx-auto flex items-center justify-center border border-zinc-200 dark:border-zinc-700 p-1">
                    {item.logo ? (
                      <img src={item.logo} alt={item.name} className="max-h-full max-w-full object-contain" />
                    ) : (
                      <Building2 className="h-5 w-5 text-zinc-400" />
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {item.name}
                </TableCell>
                <TableCell>
                  {item.website ? (
                    <a href={item.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-xs font-medium text-emerald-600 hover:text-emerald-700 hover:underline">
                      <Globe className="mr-1 h-3.5 w-3.5" />
                      <span className="truncate max-w-[160px]">{item.website.replace(/^https?:\/\//, '')}</span>
                    </a>
                  ) : (
                    <span className="text-xs text-zinc-400">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant={item.status === 'PUBLISHED' ? 'default' : 'secondary'} className={item.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-none' : ''}>
                    {item.status === 'PUBLISHED' ? 'Aktif' : 'Draft'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right pr-6">
                  <div className="flex items-center justify-end gap-1.5">
                    <Button asChild variant="outline" size="sm" className="h-8 text-xs">
                      <Link href={`/admin/klien/${item.id}/edit`}>Edit</Link>
                    </Button>
                    <DeleteKlienButton id={item.id} name={item.name} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {clients.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-32 text-zinc-400">
                  {query
                    ? `Tidak ada mitra yang cocok dengan kata kunci "${query}".`
                    : 'Belum ada data klien atau mitra.'}
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
