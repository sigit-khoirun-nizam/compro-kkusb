'use client'

import { useState } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, X } from 'lucide-react'

interface TableSearchProps {
  placeholder?: string
  initialQuery?: string
}

export default function TableSearch({
  placeholder = 'Cari data...',
  initialQuery = ''
}: TableSearchProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(initialQuery)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    if (query.trim()) {
      params.set('q', query.trim())
    } else {
      params.delete('q')
    }
    params.set('page', '1') // reset to first page on search
    router.push(`${pathname}?${params.toString()}`)
  }

  const handleClear = () => {
    setQuery('')
    const params = new URLSearchParams(searchParams.toString())
    params.delete('q')
    params.set('page', '1')
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSearch} className="relative flex items-center max-w-sm w-full">
      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="pl-8 pr-16 h-9 text-xs bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:border-[#079B49]"
      />
      {query && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-9 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-1"
          title="Hapus pencarian"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
      <Button
        type="submit"
        size="sm"
        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 px-2 text-[11px] bg-[#079B49] hover:bg-[#075C35] text-white"
      >
        Cari
      </Button>
    </form>
  )
}
