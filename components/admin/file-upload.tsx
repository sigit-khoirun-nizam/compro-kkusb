'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { FileUp, X, Loader2, FileIcon } from 'lucide-react'
import { toast } from 'sonner'

interface FileUploadProps {
  value: string
  onChange: (url: string) => void
  label?: string
}

export default function FileUpload({ value, onChange, label = "Upload File" }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Gagal mengupload file')
      }

      onChange(data.url)
      toast.success('File berhasil diupload')
    } catch (error: any) {
      toast.error(error.message)
      console.error(error)
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const getFileName = (path: string) => {
    if (!path) return ''
    const parts = path.split('/')
    return parts[parts.length - 1]
  }

  return (
    <div className="space-y-4">
      {value ? (
        <div className="relative rounded-lg overflow-hidden border p-4 bg-zinc-50 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="bg-blue-100 p-2 rounded text-blue-600">
              <FileIcon className="h-6 w-6" />
            </div>
            <p className="text-sm font-medium truncate max-w-[200px]">{getFileName(value)}</p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={() => onChange('')}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      ) : (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed rounded-lg p-10 flex flex-col items-center justify-center text-zinc-500 hover:bg-zinc-50 hover:text-zinc-700 hover:border-zinc-400 transition-colors cursor-pointer"
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <p className="text-sm">Mengupload...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <FileUp className="h-10 w-10 text-zinc-400" />
              <p className="text-sm font-medium">{label}</p>
              <p className="text-xs text-zinc-400">Klik untuk memilih file (PDF, DOCX, XLSX)</p>
            </div>
          )}
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
            onChange={handleUpload}
            disabled={isUploading}
          />
        </div>
      )}
    </div>
  )
}
