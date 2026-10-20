'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Gallery, GalleryCategory } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import ImageUpload from '@/components/admin/image-upload'
import { toast } from 'sonner'

interface GaleriFormProps {
  initialData?: Gallery
  categories: GalleryCategory[]
}

export default function GaleriForm({ initialData, categories }: GaleriFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    image: initialData?.image || '',
    categoryId: initialData?.categoryId || '',
    status: initialData?.status || 'PUBLISHED',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = initialData ? `/api/galeri/${initialData.id}` : '/api/galeri'
      const method = initialData ? 'PUT' : 'POST'
      
      const payload = {
        ...formData,
        categoryId: formData.categoryId === 'none' ? null : formData.categoryId,
      }
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        throw new Error('Gagal menyimpan foto galeri')
      }

      toast.success('Foto galeri berhasil disimpan')
      router.push('/admin/galeri')
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
      <Card>
        <CardHeader>
          <CardTitle>{initialData ? 'Edit Foto Galeri' : 'Tambah Foto Galeri'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Judul Foto</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="categoryId">Kategori</Label>
                <Select
                  value={formData.categoryId || 'none'}
                  onValueChange={(val: any) => setFormData({ ...formData, categoryId: val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Tanpa Kategori</SelectItem>
                    {categories.map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(val: any) => setFormData({ ...formData, status: val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PUBLISHED">Published</SelectItem>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi Singkat</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Gambar <span className="text-red-500">*</span></Label>
              <ImageUpload 
                value={formData.image}
                onChange={(url) => setFormData({ ...formData, image: url })}
                label="Upload Foto"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => router.push('/admin/galeri')}>
            Batal
          </Button>
          <Button type="submit" disabled={loading || !formData.image}>
            {loading ? 'Menyimpan...' : 'Simpan Foto'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
