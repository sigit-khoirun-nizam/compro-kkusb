'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { UnitUsaha } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import ImageUpload from '@/components/admin/image-upload'
import { toast } from 'sonner'
import { Briefcase, Save, X } from 'lucide-react'

interface UnitUsahaFormProps {
  initialData?: UnitUsaha
}

export default function UnitUsahaForm({ initialData }: UnitUsahaFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    slug: initialData?.slug || '',
    shortDescription: initialData?.shortDescription || '',
    description: initialData?.description || '',
    image: initialData?.image || '',
    status: initialData?.status || 'PUBLISHED',
    order: initialData?.order || 0,
  })

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    setFormData({
      ...formData,
      name,
      slug: !initialData ? generateSlug(name) : formData.slug
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = initialData ? `/api/unit-usaha/${initialData.id}` : '/api/unit-usaha'
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
        throw new Error('Gagal menyimpan data')
      }

      toast.success('Unit Usaha berhasil disimpan')
      router.push('/admin/unit-usaha')
      router.refresh()
    } catch (error) {
      toast.error('Terjadi kesalahan')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto pb-10">
      <Card className="border-emerald-100 dark:border-emerald-900/50 shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 px-6 py-4 border-b border-emerald-100 dark:border-emerald-900/50 flex items-center gap-3">
          <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg text-emerald-600 dark:text-emerald-400">
            <Briefcase className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-xl text-emerald-900 dark:text-emerald-100">
              {initialData ? 'Edit Unit Usaha' : 'Tambah Unit Usaha'}
            </CardTitle>
            <CardDescription className="text-emerald-700/70 dark:text-emerald-400/70">
              {initialData ? 'Perbarui informasi detail unit usaha yang sudah ada.' : 'Masukkan detail informasi untuk unit usaha baru.'}
            </CardDescription>
          </div>
        </div>
        
        <CardContent className="space-y-8 p-6 sm:p-8">
          <div className="space-y-6">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider border-b pb-2">Informasi Utama</h3>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-700 dark:text-slate-300">Nama Unit Usaha <span className="text-red-500">*</span></Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={handleNameChange}
                  placeholder="Mis. Unit Simpan Pinjam"
                  required
                  className="bg-slate-50 dark:bg-slate-900"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug" className="text-slate-700 dark:text-slate-300">Slug (URL) <span className="text-red-500">*</span></Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={e => setFormData({ ...formData, slug: e.target.value })}
                  required
                  className="bg-slate-50 dark:bg-slate-900 font-mono text-sm"
                />
                <p className="text-xs text-slate-500">Tautan otomatis (cth: unit-simpan-pinjam)</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="shortDescription" className="text-slate-700 dark:text-slate-300">Deskripsi Singkat</Label>
              <Textarea
                id="shortDescription"
                value={formData.shortDescription}
                onChange={e => setFormData({ ...formData, shortDescription: e.target.value })}
                rows={2}
                placeholder="Ringkasan singkat layanan (maks. 2-3 kalimat)"
                className="bg-slate-50 dark:bg-slate-900 resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-slate-700 dark:text-slate-300">Deskripsi Lengkap</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                rows={6}
                placeholder="Penjelasan mendetail mengenai unit usaha, layanan, dan keunggulannya..."
                className="bg-slate-50 dark:bg-slate-900"
              />
            </div>
          </div>

          <div className="space-y-6 pt-4">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider border-b pb-2">Media & Pengaturan</h3>
            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-slate-700 dark:text-slate-300">Gambar Cover (Thumbnail)</Label>
                <div className="p-1 border rounded-lg bg-slate-50 dark:bg-slate-900/50">
                  <ImageUpload 
                    value={formData.image || ''}
                    onChange={(url) => setFormData({ ...formData, image: url })}
                    onRemove={() => setFormData({ ...formData, image: '' })}
                    label="Upload Gambar Unit"
                  />
                </div>
                <p className="text-xs text-zinc-500">Rasio yang disarankan: 16:9 atau lanskap.</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-zinc-700 dark:text-zinc-300">Status Publikasi</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(val: any) => setFormData({ ...formData, status: val })}
                  >
                    <SelectTrigger className="bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                      <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PUBLISHED">Aktif (Published)</SelectItem>
                      <SelectItem value="DRAFT">Tidak Aktif (Draft)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="order" className="text-zinc-700 dark:text-zinc-300">Urutan Tampilan</Label>
                  <Input
                    id="order"
                    type="number"
                    value={formData.order}
                    onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                    className="bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
                  />
                  <p className="text-xs text-zinc-500">Angka terkecil akan tampil lebih dulu (mis. 1, 2, 3).</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between bg-zinc-50 dark:bg-zinc-900/50 border-t border-[#E4E9E5] dark:border-zinc-800 p-6">
          <Button type="button" variant="outline" onClick={() => router.push('/admin/unit-usaha')} className="hover:bg-zinc-100 dark:hover:bg-zinc-800">
            <X className="mr-2 h-4 w-4" />
            Batal
          </Button>
          <Button type="submit" disabled={loading} className="bg-[#079B49] hover:bg-[#075C35] text-white">
            {loading ? 'Menyimpan...' : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Simpan Unit Usaha
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}

