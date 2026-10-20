'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Document } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import FileUpload from '@/components/admin/file-upload'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

interface DokumenFormProps {
  initialData?: Document
}

export default function DokumenForm({ initialData }: DokumenFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    fileUrl: initialData?.fileUrl || '',
    category: initialData?.category || '',
    status: initialData?.status || 'PUBLISHED',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = initialData ? `/api/dokumen/${initialData.id}` : '/api/dokumen'
      const method = initialData ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error('Gagal menyimpan dokumen')
      }

      toast.success('Dokumen berhasil disimpan')
      router.push('/admin/dokumen')
      router.refresh()
    } catch (error) {
      toast.error('Terjadi kesalahan')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card className="border-0 shadow-sm">
        <CardHeader className="bg-slate-50/50 border-b pb-6">
          <CardTitle className="text-lg">Informasi Dokumen</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Judul Dokumen <span className="text-red-500">*</span></Label>
              <Input 
                id="title" 
                placeholder="Misal: Laporan Tahunan 2023"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Kategori</Label>
              <Input 
                id="category" 
                placeholder="Misal: Laporan, Legal, Publik"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi Singkat</Label>
            <Textarea 
              id="description" 
              placeholder="Jelaskan isi atau tujuan dokumen ini..."
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label>File Dokumen <span className="text-red-500">*</span></Label>
              <FileUpload 
                value={formData.fileUrl}
                onChange={(url) => setFormData({...formData, fileUrl: url})}
                label="Upload File"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.status}
                onValueChange={(value: any) => setFormData({...formData, status: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PUBLISHED">Aktif / Publik</SelectItem>
                  <SelectItem value="DRAFT">Draft / Privat</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

        </CardContent>
        <CardFooter className="bg-slate-50/50 border-t justify-end gap-2 pt-6">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => router.push('/admin/dokumen')}
            disabled={loading}
          >
            Batal
          </Button>
          <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 min-w-32">
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            {loading ? 'Menyimpan...' : 'Simpan Dokumen'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
