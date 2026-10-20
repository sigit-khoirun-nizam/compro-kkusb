import prisma from '@/lib/prisma'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Plus, Briefcase, Users } from 'lucide-react'
import Link from 'next/link'
import TablePagination from '@/components/admin/table-pagination'
import TableSearch from '@/components/admin/table-search'

export default async function AdminTesPage({
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

  let tests: any[] = []
  let totalCount = 0

  try {
    const where: any = query
      ? {
          OR: [
            { title: { contains: query } },
            { description: { contains: query } },
            { job: { title: { contains: query } } },
          ],
        }
      : {}

    const [count, dbTests] = await Promise.all([
      prisma.academicTest.count({ where }),
      prisma.academicTest.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: {
          job: true,
          _count: { select: { questions: true } },
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ])

    totalCount = count
    tests = dbTests
  } catch (err) {
    totalCount = 0
    tests = []
  }

  const totalPages = Math.ceil(totalCount / limit) || 1

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Manajemen Bank Soal Tes</h1>
          <p className="text-zinc-500 text-sm mt-0.5">Kelola paket ujian kompetensi akademik online yang diujikan kepada pelamar.</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button asChild variant="outline" className="border-emerald-200 text-[#075C35] hover:bg-emerald-50 text-xs">
            <Link href="/admin/karir">
              <Briefcase className="mr-1.5 h-3.5 w-3.5" /> Kelola Lowongan
            </Link>
          </Button>
          <Button asChild variant="outline" className="border-emerald-200 text-[#075C35] hover:bg-emerald-50 text-xs">
            <Link href="/admin/karir/pelamar">
              <Users className="mr-1.5 h-3.5 w-3.5" /> Data Pelamar
            </Link>
          </Button>
          <Button asChild className="bg-[#079B49] hover:bg-[#075C35] text-white text-xs">
            <Link href="/admin/karir/tes/create">
              <Plus className="mr-1.5 h-3.5 w-3.5" /> Buat Paket Tes
            </Link>
          </Button>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <TableSearch placeholder="Cari nama paket tes atau posisi..." initialQuery={query} />
        {query && (
          <div className="text-xs text-zinc-500 flex items-center gap-1.5">
            <span>Ditemukan: <strong className="text-zinc-900 dark:text-zinc-100">{totalCount}</strong> paket tes</span>
          </div>
        )}
      </div>

      {/* Table Container */}
      <div className="border border-[#E4E9E5] dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 overflow-hidden shadow-xs">
        <Table>
          <TableHeader className="bg-zinc-50 dark:bg-zinc-900">
            <TableRow>
              <TableHead>Nama Paket Tes</TableHead>
              <TableHead>Untuk Lowongan</TableHead>
              <TableHead>Durasi Waktu</TableHead>
              <TableHead>Jumlah Soal</TableHead>
              <TableHead className="text-right pr-6">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tests.map((test) => (
              <TableRow key={test.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50">
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">{test.title}</span>
                    {test.description && (
                      <span className="text-xs text-zinc-500 line-clamp-1 mt-0.5">{test.description}</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-lg bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 text-xs font-medium text-zinc-700 dark:text-zinc-300">
                    {test.job?.title || 'Umum (Semua Posisi)'}
                  </span>
                </TableCell>
                <TableCell className="text-zinc-600 dark:text-zinc-400 font-medium text-sm">
                  {test.durationMinutes} Menit
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-semibold text-xs bg-zinc-50 dark:bg-zinc-800/60 border-zinc-200 dark:border-zinc-700">
                    {test._count.questions} Soal
                  </Badge>
                </TableCell>
                <TableCell className="text-right pr-6">
                  <div className="flex items-center justify-end gap-1.5">
                    <Button asChild variant="outline" size="sm" className="h-8 text-xs">
                      <Link href={`/admin/karir/tes/${test.id}`}>Kelola Soal</Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {tests.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-32 text-zinc-400">
                  {query
                    ? `Tidak ada paket tes yang cocok dengan kata kunci "${query}".`
                    : 'Belum ada paket tes yang dibuat. Klik "Buat Paket Tes" untuk menambahkan paket ujian baru.'}
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
