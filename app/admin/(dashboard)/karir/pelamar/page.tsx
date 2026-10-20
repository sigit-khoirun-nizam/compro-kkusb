import prisma from '@/lib/prisma'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Briefcase, GraduationCap } from 'lucide-react'
import Link from 'next/link'
import SendTestButton from '@/components/admin/send-test-button'
import TablePagination from '@/components/admin/table-pagination'
import TableSearch from '@/components/admin/table-search'

export default async function AdminPelamarPage({
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

  let applicants: any[] = []
  let totalCount = 0

  try {
    const where: any = query
      ? {
          OR: [
            { name: { contains: query } },
            { email: { contains: query } },
            { phone: { contains: query } },
            { job: { title: { contains: query } } },
          ],
        }
      : {}

    const [count, dbApplicants] = await Promise.all([
      prisma.applicant.count({ where }),
      prisma.applicant.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: { job: true },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ])

    totalCount = count
    applicants = dbApplicants
  } catch (err) {
    totalCount = 0
    applicants = []
  }

  const totalPages = Math.ceil(totalCount / limit) || 1

  const getStatusUI = (status: string) => {
    switch (status) {
      case 'PENDING':
        return { label: 'Menunggu Review', color: 'bg-yellow-50 text-yellow-800 border-yellow-200 dark:bg-yellow-950/40 dark:text-yellow-400 dark:border-yellow-800' }
      case 'REVIEWING':
        return { label: 'Sedang Review', color: 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800' }
      case 'TEST_SENT':
        return { label: 'Akses Tes Dikirim', color: 'bg-orange-50 text-orange-800 border-orange-200 dark:bg-orange-950/40 dark:text-orange-400 dark:border-orange-800' }
      case 'TEST_COMPLETED':
        return { label: 'Tes Selesai', color: 'bg-purple-50 text-purple-800 border-purple-200 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-800' }
      case 'INTERVIEW':
        return { label: 'Wawancara', color: 'bg-indigo-50 text-indigo-800 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-800' }
      case 'ACCEPTED':
        return { label: 'Diterima', color: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-none' }
      case 'REJECTED':
        return { label: 'Tidak Lolos', color: 'bg-red-50 text-red-800 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800' }
      default:
        return { label: status, color: 'bg-zinc-100 text-zinc-800 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300' }
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Data Pelamar (Kandidat)</h1>
          <p className="text-zinc-500 text-sm mt-0.5">Tinjau berkas lamaran, nilai tes kompetensi, dan kelola status seleksi pelamar.</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button asChild variant="outline" className="border-emerald-200 text-[#075C35] hover:bg-emerald-50 text-xs">
            <Link href="/admin/karir">
              <Briefcase className="mr-1.5 h-3.5 w-3.5" /> Kelola Lowongan
            </Link>
          </Button>
          <Button asChild variant="outline" className="border-emerald-200 text-[#075C35] hover:bg-emerald-50 text-xs">
            <Link href="/admin/karir/tes">
              <GraduationCap className="mr-1.5 h-3.5 w-3.5" /> Bank Soal Tes
            </Link>
          </Button>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <TableSearch placeholder="Cari nama pelamar, email, atau posisi..." initialQuery={query} />
        {query && (
          <div className="text-xs text-zinc-500 flex items-center gap-1.5">
            <span>Ditemukan: <strong className="text-zinc-900 dark:text-zinc-100">{totalCount}</strong> pelamar</span>
          </div>
        )}
      </div>

      {/* Table Container */}
      <div className="border border-[#E4E9E5] dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 overflow-hidden shadow-xs">
        <Table>
          <TableHeader className="bg-zinc-50 dark:bg-zinc-900">
            <TableRow>
              <TableHead>Nama Kandidat</TableHead>
              <TableHead>Posisi Lowongan</TableHead>
              <TableHead>Kontak Pelamar</TableHead>
              <TableHead>Skor Tes</TableHead>
              <TableHead>Status Lamaran</TableHead>
              <TableHead className="text-right pr-6">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applicants.map((app) => {
              const status = getStatusUI(app.status)
              return (
                <TableRow key={app.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50">
                  <TableCell className="font-semibold text-zinc-900 dark:text-zinc-100">{app.name}</TableCell>
                  <TableCell className="text-zinc-600 dark:text-zinc-300 font-medium">{app.job?.title || '-'}</TableCell>
                  <TableCell>
                    <div className="flex flex-col text-xs leading-tight">
                      <span className="font-medium text-zinc-900 dark:text-zinc-100">{app.email}</span>
                      <span className="text-zinc-500 mt-0.5">{app.phone || '-'}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {app.testScore !== null ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-bold bg-green-50 text-[#079B49] border border-green-200 dark:bg-green-950/40 dark:text-green-400 dark:border-green-800">
                        {app.testScore}/100
                      </span>
                    ) : (
                      <span className="text-xs text-zinc-400">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`font-semibold text-xs border rounded-full px-2.5 py-0.5 ${status.color}`}>
                      {status.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="flex items-center justify-end gap-1.5">
                      {app.status === 'PENDING' && (
                        <SendTestButton applicantId={app.id} />
                      )}
                      <Button asChild variant="outline" size="sm" className="h-8 text-xs">
                        <Link href={`/admin/karir/pelamar/${app.id}`}>Detail</Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
            {applicants.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-32 text-zinc-400">
                  {query
                    ? `Tidak ada pelamar yang cocok dengan kata kunci "${query}".`
                    : 'Belum ada berkas pelamar yang masuk.'}
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
