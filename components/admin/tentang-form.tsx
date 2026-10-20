'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { OrganizationMember } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import ImageUpload from '@/components/admin/image-upload'
import { toast } from 'sonner'

interface TentangFormProps {
  initialData?: OrganizationMember
}

export default function TentangForm({ initialData }: TentangFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    position: initialData?.position || '',
    description: initialData?.description || '',
    image: initialData?.image || '',
    order: initialData?.order || 0,
    status: initialData?.status || 'PUBLISHED',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = initialData ? `/api/tentang/${initialData.id}` : '/api/tentang'
      const method = initialData ? 'PUT' : 'POST'
      
      const payload = {
        ...formData,
        order: Number(formData.order)
      }
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        throw new Error('Gagal menyimpan data pengurus')
      }

      toast.success('Data pengurus berhasil disimpan')
      router.push('/admin/tentang')
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
          <CardTitle>{initialData ? 'Edit Profil Pengurus' : 'Tambah Profil Pengurus'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Lengkap</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="Mis. H. Budi Santoso"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">Jabatan</Label>
              <Input
                id="position"
                value={formData.position}
                onChange={e => setFormData({ ...formData, position: e.target.value })}
                required
                placeholder="Mis. Ketua Koperasi"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Foto Profil</Label>
              <ImageUpload 
                value={formData.image || ''}
                onChange={(url) => setFormData({ ...formData, image: url })}
                label="Upload Foto Pengurus"
              />
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="order">Urutan (Angka)</Label>
                <Input
                  id="order"
                  type="number"
                  value={formData.order}
                  onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                />
                <p className="text-xs text-muted-foreground">Gunakan angka untuk mengatur urutan tampilan (angka kecil tampil lebih awal).</p>
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
                    <SelectItem value="PUBLISHED">Aktif (Published)</SelectItem>
                    <SelectItem value="DRAFT">Tidak Aktif (Draft)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi Singkat (Opsional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              placeholder="Ceritakan sedikit tentang latar belakang atau peran pengurus ini..."
            />
          </div>

        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => router.push('/admin/tentang')}>
            Batal
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Menyimpan...' : 'Simpan Data'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
