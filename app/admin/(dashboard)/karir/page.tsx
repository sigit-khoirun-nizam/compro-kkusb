import prisma from '@/lib/prisma'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Plus, Users } from 'lucide-react'
import Link from 'next/link'
import DeleteJobButton from '@/components/admin/delete-job-button'
import TablePagination from '@/components/admin/table-pagination'
import TableSearch from '@/components/admin/table-search'
import { JOB_VACANCIES } from '@/lib/data/kkusb-data'

export default async function AdminKarirPage({
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

  let jobs: any[] = []
  let totalCount = 0

  try {
    const where: any = query
      ? {
          OR: [
            { title: { contains: query } },
            { department: { contains: query } },
            { description: { contains: query } },
          ],
        }
      : {}

    const [count, dbJobs] = await Promise.all([
      prisma.jobPosting.count({ where }),
      prisma.jobPosting.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: { select: { applicants: true } },
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ])

    totalCount = count
    jobs = dbJobs
  } catch (err) {
    let fallback = JOB_VACANCIES.map((j) => ({
      id: j.id,
      title: j.title,
      department: j.department,
      status: 'PUBLISHED',
      _count: { applicants: 0 },
    }))

    if (query) {
      fallback = fallback.filter(
        (j) =>
          j.title.toLowerCase().includes(query.toLowerCase()) ||
          (j.department && j.department.toLowerCase().includes(query.toLowerCase()))
      )
    }

    totalCount = fallback.length
    jobs = fallback.slice((page - 1) * limit, page * limit)
  }

  const totalPages = Math.ceil(totalCount / limit) || 1

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Manajemen Lowongan Pekerjaan</h1>
          <p className="text-zinc-500 text-sm mt-0.5">Kelola daftar posisi rekrutmen yang tampil di portal publik KKUSB.</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button asChild variant="outline" className="border-emerald-200 text-[#075C35] hover:bg-emerald-50 text-xs">
            <Link href="/admin/karir/pelamar">
              <Users className="mr-1.5 h-3.5 w-3.5" /> Data Pelamar
            </Link>
          </Button>
          <Button asChild className="bg-[#079B49] hover:bg-[#075C35] text-white text-xs">
            <Link href="/admin/karir/create">
              <Plus className="mr-1.5 h-3.5 w-3.5" /> Tambah Lowongan
            </Link>
          </Button>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <TableSearch placeholder="Cari posisi atau departemen..." initialQuery={query} />
        {query && (
          <div className="text-xs text-zinc-500 flex items-center gap-1.5">
            <span>Ditemukan: <strong className="text-zinc-900 dark:text-zinc-100">{totalCount}</strong> lowongan</span>
          </div>
        )}
      </div>

      {/* Table Container */}
      <div className="border border-[#E4E9E5] dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 overflow-hidden shadow-xs">
        <Table>
          <TableHeader className="bg-zinc-50 dark:bg-zinc-900">
            <TableRow>
              <TableHead>Posisi</TableHead>
              <TableHead>Departemen</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total Pelamar</TableHead>
              <TableHead className="text-right pr-6">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.map((job) => (
              <TableRow key={job.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50">
                <TableCell className="font-semibold text-zinc-900 dark:text-zinc-100">{job.title}</TableCell>
                <TableCell className="text-zinc-500">{job.department || '-'}</TableCell>
                <TableCell>
                  <Badge variant={job.status === 'PUBLISHED' ? 'default' : 'secondary'} className={job.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-none' : ''}>
                    {job.status === 'PUBLISHED' ? 'Aktif' : 'Draft'}
                  </Badge>
                </TableCell>
                <TableCell className="text-zinc-600 font-medium">{job._count?.applicants || 0} Pelamar</TableCell>
                <TableCell className="text-right pr-6">
                  <div className="flex items-center justify-end gap-1.5">
                    <Button asChild variant="outline" size="sm" className="h-8 text-xs">
                      <Link href={`/admin/karir/pelamar`}>Pelamar</Link>
                    </Button>
                    <Button asChild variant="outline" size="sm" className="h-8 text-xs">
                      <Link href={`/admin/karir/${job.id}/edit`}>Edit</Link>
                    </Button>
                    <DeleteJobButton id={job.id} title={job.title} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {jobs.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-32 text-zinc-400">
                  {query
                    ? `Tidak ada lowongan yang sesuai dengan kata kunci "${query}".`
                    : 'Belum ada lowongan pekerjaan. Klik "Tambah Lowongan" untuk membuka rekrutmen baru.'}
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
