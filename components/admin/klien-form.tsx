'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Client } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import ImageUpload from '@/components/admin/image-upload'
import { toast } from 'sonner'
import { Users, Save, X } from 'lucide-react'

interface KlienFormProps {
  initialData?: Client
}

export default function KlienForm({ initialData }: KlienFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    website: initialData?.website || '',
    logo: initialData?.logo || '',
    status: initialData?.status || 'PUBLISHED',
    order: initialData?.order || 0,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = initialData ? `/api/klien/${initialData.id}` : '/api/klien'
      const method = initialData ? 'PUT' : 'POST'
      
      const payload = {
        ...formData,
        order: Number(formData.order)
      }

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error('Terjadi kesalahan saat menyimpan data')

      toast.success(initialData ? 'Mitra berhasil diperbarui' : 'Mitra berhasil ditambahkan')
      router.push('/admin/klien')
      router.refresh()
    } catch (error) {
      toast.error('Gagal menyimpan data mitra')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Mitra</CardTitle>
              <CardDescription>
                Masukkan detail nama dan deskripsi klien/mitra kerjasama.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Klien / Mitra <span className="text-red-500">*</span></Label>
                <Input
                  id="name"
                  placeholder="Contoh: PT Bangun Persada"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website (Opsional)</Label>
                <Input
                  id="website"
                  placeholder="https://www.contoh.com"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi Singkat (Opsional)</Label>
                <Textarea
                  id="description"
                  placeholder="Penjelasan singkat mengenai kerjasama atau profil klien."
                  className="min-h-[100px]"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Logo Mitra</CardTitle>
              <CardDescription>Unggah logo resmi klien/mitra.</CardDescription>
            </CardHeader>
            <CardContent>
              <ImageUpload
                value={formData.logo}
                onChange={(url) => setFormData({ ...formData, logo: url })}
                onRemove={() => setFormData({ ...formData, logo: '' })}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pengaturan Publikasi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => { if (value) setFormData({ ...formData, status: value as any }) }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PUBLISHED">Aktif (Ditampilkan)</SelectItem>
                    <SelectItem value="DRAFT">Draft (Disembunyikan)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="order">Urutan Tampil</Label>
                <Input
                  id="order"
                  type="number"
                  min="0"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                />
                <p className="text-xs text-muted-foreground">Angka lebih kecil tampil lebih dulu.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex items-center justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/admin/klien')}
          disabled={loading}
        >
          <X className="mr-2 h-4 w-4" />
          Batal
        </Button>
        <Button type="submit" disabled={loading}>
          <Save className="mr-2 h-4 w-4" />
          {loading ? 'Menyimpan...' : 'Simpan Mitra'}
        </Button>
      </div>
    </form>
  )
}
