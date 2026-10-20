import Link from 'next/link'
import { Plus, UserCircle2 } from 'lucide-react'
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
import DeleteTentangButton from '@/components/admin/delete-tentang-button'
import TablePagination from '@/components/admin/table-pagination'
import TableSearch from '@/components/admin/table-search'

export default async function TentangPage({
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

  let members: any[] = []
  let totalCount = 0

  try {
    const where: any = query
      ? {
          OR: [
            { name: { contains: query } },
            { position: { contains: query } },
            { description: { contains: query } },
          ],
        }
      : {}

    const [count, dbMembers] = await Promise.all([
      prisma.organizationMember.count({ where }),
      prisma.organizationMember.findMany({
        where,
        orderBy: { order: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ])

    totalCount = count
    members = dbMembers
  } catch (err) {
    let fallback = [
      { id: 'm-1', name: 'Dewan Pengawas KKUSB', position: 'Pengawas Organisasi', image: null, order: 1, status: 'PUBLISHED' },
      { id: 'm-2', name: 'Ketua Pengurus KKUSB', position: 'Ketua Koperasi', image: null, order: 2, status: 'PUBLISHED' },
      { id: 'm-3', name: 'Sekretaris & Operasional', position: 'Sekretaris', image: null, order: 3, status: 'PUBLISHED' },
      { id: 'm-4', name: 'Bendahara & Keuangan USPPS', position: 'Bendahara', image: null, order: 4, status: 'PUBLISHED' },
    ]

    if (query) {
      fallback = fallback.filter(
        (m) =>
          m.name.toLowerCase().includes(query.toLowerCase()) ||
          m.position.toLowerCase().includes(query.toLowerCase())
      )
    }

    totalCount = fallback.length
    members = fallback.slice((page - 1) * limit, page * limit)
  }

  const totalPages = Math.ceil(totalCount / limit) || 1

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Pengurus &amp; Struktur Organisasi</h1>
          <p className="text-zinc-500 text-sm mt-0.5">Kelola susunan dewan pengawas, pengurus koperasi, dan profil keanggotaan KKUSB.</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button asChild className="bg-[#079B49] hover:bg-[#075C35] text-white text-xs">
            <Link href="/admin/tentang/create">
              <Plus className="mr-1.5 h-3.5 w-3.5" /> Tambah Pengurus
            </Link>
          </Button>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <TableSearch placeholder="Cari nama pengurus atau jabatan..." initialQuery={query} />
        {query && (
          <div className="text-xs text-zinc-500 flex items-center gap-1.5">
            <span>Ditemukan: <strong className="text-zinc-900 dark:text-zinc-100">{totalCount}</strong> pengurus</span>
          </div>
        )}
      </div>

      {/* Table Container */}
      <div className="border border-[#E4E9E5] dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 overflow-hidden shadow-xs">
        <Table>
          <TableHeader className="bg-zinc-50 dark:bg-zinc-900">
            <TableRow>
              <TableHead className="w-[80px] text-center">Foto</TableHead>
              <TableHead>Nama &amp; Posisi</TableHead>
              <TableHead className="w-[100px] text-center">Urutan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right pr-6">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((item) => (
              <TableRow key={item.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50">
                <TableCell className="text-center">
                  <div className="h-10 w-10 rounded-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 mx-auto flex items-center justify-center border border-zinc-200 dark:border-zinc-700">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    ) : (
                      <UserCircle2 className="h-6 w-6 text-zinc-400" />
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">{item.name}</span>
                    <span className="text-xs text-zinc-500">{item.position}</span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    {item.order}
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
                      <Link href={`/admin/tentang/${item.id}/edit`}>Edit</Link>
                    </Button>
                    <DeleteTentangButton id={item.id} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {members.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-32 text-zinc-400">
                  {query
                    ? `Tidak ada pengurus yang cocok dengan kata kunci "${query}".`
                    : 'Belum ada data pengurus. Klik "Tambah Pengurus" untuk menambahkan susunan baru.'}
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
