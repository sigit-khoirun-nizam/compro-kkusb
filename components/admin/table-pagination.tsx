'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'

interface TablePaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  pageSize: number
  pageSizeOptions?: number[]
}

export default function TablePagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  pageSizeOptions = [5, 10, 20]
}: TablePaginationProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createPageUrl = (newPage: number, newLimit?: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', newPage.toString())
    if (newLimit) {
      params.set('limit', newLimit.toString())
    }
    return `${pathname}?${params.toString()}`
  }

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || newPage === currentPage) return
    router.push(createPageUrl(newPage))
  }

  const handlePageSizeChange = (val: string | null) => {
    if (!val) return
    const newLimit = parseInt(val, 10)
    if (!newLimit) return
    router.push(createPageUrl(1, newLimit))
  }

  const from = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const to = Math.min(currentPage * pageSize, totalItems)

  // Generate pagination page numbers
  const getPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    const pages: (number | string)[] = []
    pages.push(1)

    if (currentPage > 3) {
      pages.push('...')
    }

    const start = Math.max(2, currentPage - 1)
    const end = Math.min(totalPages - 1, currentPage + 1)

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    if (currentPage < totalPages - 2) {
      pages.push('...')
    }

    if (totalPages > 1) {
      pages.push(totalPages)
    }

    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 border-t border-[#E4E9E5] dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs text-zinc-600 dark:text-zinc-400">
      {/* Left: Info data count */}
      <div className="flex items-center gap-2">
        <span>
          Menampilkan <strong className="text-zinc-900 dark:text-zinc-100 font-semibold">{from}</strong> -{' '}
          <strong className="text-zinc-900 dark:text-zinc-100 font-semibold">{to}</strong> dari{' '}
          <strong className="text-zinc-900 dark:text-zinc-100 font-semibold">{totalItems}</strong> data
        </span>
      </div>

      {/* Right: Controls */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Page size selector */}
        <div className="flex items-center gap-2">
          <span className="text-zinc-500 text-[11px]">Tampilkan:</span>
          <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
            <SelectTrigger className="h-7 w-[68px] text-xs bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700">
              <SelectValue placeholder={pageSize.toString()} />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((opt) => (
                <SelectItem key={opt} value={opt.toString()} className="text-xs">
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-zinc-500 text-[11px] hidden sm:inline">per halaman</span>
        </div>

        {/* Page navigation buttons */}
        <div className="flex items-center gap-1">
          {/* First page button */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(1)}
            disabled={currentPage <= 1}
            className="h-7 w-7 border-zinc-200 dark:border-zinc-700 disabled:opacity-40"
            title="Halaman Pertama"
          >
            <ChevronsLeft className="h-3.5 w-3.5" />
          </Button>

          {/* Previous page button */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="h-7 w-7 border-zinc-200 dark:border-zinc-700 disabled:opacity-40"
            title="Halaman Sebelumnya"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </Button>

          {/* Number pills */}
          {pageNumbers.map((p, idx) => {
            if (p === '...') {
              return (
                <span key={`dots-${idx}`} className="px-1 text-zinc-400 select-none">
                  …
                </span>
              )
            }

            const pageNum = Number(p)
            const isActive = pageNum === currentPage

            return (
              <Button
                key={pageNum}
                variant={isActive ? 'default' : 'outline'}
                size="sm"
                onClick={() => handlePageChange(pageNum)}
                className={`h-7 min-w-7 px-2 text-xs font-semibold ${
                  isActive
                    ? 'bg-[#079B49] hover:bg-[#075C35] text-white border-transparent'
                    : 'border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                }`}
              >
                {pageNum}
              </Button>
            )
          })}

          {/* Next page button */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages || totalPages === 0}
            className="h-7 w-7 border-zinc-200 dark:border-zinc-700 disabled:opacity-40"
            title="Halaman Berikutnya"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>

          {/* Last page button */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage >= totalPages || totalPages === 0}
            className="h-7 w-7 border-zinc-200 dark:border-zinc-700 disabled:opacity-40"
            title="Halaman Terakhir"
          >
            <ChevronsRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
