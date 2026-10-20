'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { UploadCloud, X, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  onRemove?: () => void
  label?: string
}

export default function ImageUpload({ value, onChange, onRemove, label = "Upload Gambar" }: ImageUploadProps) {
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
        throw new Error(data.error || 'Gagal mengupload gambar')
      }

      onChange(data.url)
      toast.success('Gambar berhasil diupload')
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

  return (
    <div className="space-y-4">
      {value ? (
        <div className="relative rounded-lg overflow-hidden border max-w-sm h-48 bg-zinc-100 flex items-center justify-center">
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 rounded-full"
            onClick={() => {
              onChange('')
              onRemove?.()
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed rounded-lg p-10 flex flex-col items-center justify-center text-zinc-500 hover:bg-zinc-50 hover:text-zinc-700 hover:border-zinc-400 transition-colors cursor-pointer max-w-sm"
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-green-600" />
              <p className="text-sm">Mengupload...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <UploadCloud className="h-10 w-10 text-zinc-400" />
              <p className="text-sm font-medium">{label}</p>
              <p className="text-xs text-zinc-400">Klik untuk memilih file (JPG, PNG)</p>
            </div>
          )}
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleUpload}
            disabled={isUploading}
          />
        </div>
      )}
    </div>
  )
}
