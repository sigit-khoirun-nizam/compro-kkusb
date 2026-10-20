import Link from 'next/link'
import { Eye, Mail, MessageSquare, Clock } from 'lucide-react'
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
import DeletePesanButton from '@/components/admin/delete-pesan-button'
import TablePagination from '@/components/admin/table-pagination'
import TableSearch from '@/components/admin/table-search'
import { formatDistanceToNow } from 'date-fns'
import { id } from 'date-fns/locale'

export default async function PesanPage({
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

  let messages: any[] = []
  let totalCount = 0
  let unreadCount = 0

  try {
    const where: any = query
      ? {
          OR: [
            { name: { contains: query } },
            { email: { contains: query } },
            { subject: { contains: query } },
            { message: { contains: query } },
          ],
        }
      : {}

    const [count, dbMessages, unread] = await Promise.all([
      prisma.contactMessage.count({ where }),
      prisma.contactMessage.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.contactMessage.count({ where: { isRead: false } }),
    ])

    totalCount = count
    messages = dbMessages
    unreadCount = unread
  } catch (err) {
    totalCount = 0
    messages = []
    unreadCount = 0
  }

  const totalPages = Math.ceil(totalCount / limit) || 1

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Kotak Masuk Pesan</h1>
            {unreadCount > 0 && (
              <span className="bg-red-100 text-red-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                {unreadCount} Baru
              </span>
            )}
          </div>
          <p className="text-zinc-500 text-sm mt-1">
            Baca dan kelola pesan, pertanyaan, atau masukan dari pengunjung website.
          </p>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <TableSearch placeholder="Cari nama pengirim, email, atau subjek..." initialQuery={query} />
        {query && (
          <div className="text-xs text-zinc-500 flex items-center gap-1.5">
            <span>Ditemukan: <strong className="text-zinc-900 dark:text-zinc-100">{totalCount}</strong> pesan</span>
          </div>
        )}
      </div>

      {/* Table Container */}
      <div className="rounded-xl border border-[#E4E9E5] dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs overflow-hidden">
        <Table>
          <TableHeader className="bg-zinc-50 dark:bg-zinc-900">
            <TableRow>
              <TableHead className="w-[50px]"></TableHead>
              <TableHead>Pengirim &amp; Subjek</TableHead>
              <TableHead className="w-[200px]">Waktu Diterima</TableHead>
              <TableHead className="w-[120px] text-center">Status</TableHead>
              <TableHead className="text-right pr-6 w-[120px]">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {messages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-48 text-center text-zinc-400">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <Mail className="h-8 w-8 text-zinc-300 dark:text-zinc-700" />
                    <p className="text-zinc-700 dark:text-zinc-300 font-medium text-sm">
                      {query ? `Tidak ada pesan yang sesuai dengan "${query}".` : 'Kotak Masuk Kosong'}
                    </p>
                    <p className="text-xs text-zinc-400">
                      {query ? 'Coba kata kunci pencarian lainnya.' : 'Belum ada pesan yang masuk dari pengunjung.'}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              messages.map((item) => (
                <TableRow key={item.id} className={`hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50 transition-colors ${!item.isRead ? 'bg-emerald-50/40 dark:bg-emerald-950/20' : ''}`}>
                  <TableCell>
                    <div className={`h-9 w-9 rounded-full flex items-center justify-center ${!item.isRead ? 'bg-emerald-100 text-[#075C35]' : 'bg-zinc-100 text-zinc-400 dark:bg-zinc-800'}`}>
                      <MessageSquare className="h-4 w-4" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className={`font-semibold text-zinc-900 dark:text-zinc-100 ${!item.isRead ? 'text-[#075C35] dark:text-emerald-400' : ''}`}>
                          {item.name}
                        </span>
                        <span className="text-xs text-zinc-400">&lt;{item.email}&gt;</span>
                      </div>
                      <span className={`text-xs mt-0.5 line-clamp-1 ${!item.isRead ? 'font-medium text-zinc-800 dark:text-zinc-200' : 'text-zinc-500'}`}>
                        {item.subject || 'Tanpa Subjek'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col text-xs">
                      <span className="text-zinc-700 dark:text-zinc-300">
                        {new Date(item.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                      <div className="flex items-center text-[11px] text-zinc-400 mt-0.5">
                        <Clock className="mr-1 h-3 w-3" />
                        {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true, locale: id })}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={item.isRead ? 'outline' : 'default'} className={!item.isRead ? 'bg-[#079B49] text-white hover:bg-[#075C35] border-none text-[11px]' : 'text-zinc-500 text-[11px]'}>
                      {item.isRead ? 'Terbaca' : 'Baru'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button asChild variant="outline" size="sm" className="h-8 text-xs">
                        <Link href={`/admin/pesan/${item.id}`}>
                          <Eye className="mr-1.5 h-3.5 w-3.5" /> Lihat
                        </Link>
                      </Button>
                      <DeletePesanButton id={item.id} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
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
