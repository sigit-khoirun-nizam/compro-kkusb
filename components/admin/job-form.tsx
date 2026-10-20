'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { JobPosting } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { Save, Loader2, ArrowLeft, Trash } from 'lucide-react'

export default function JobForm({ initialData }: { initialData?: JobPosting }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    department: initialData?.department || '',
    location: initialData?.location || '',
    type: initialData?.type || 'Full-time',
    description: initialData?.description || '',
    requirements: initialData?.requirements || '',
    status: initialData?.status || 'PUBLISHED',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = initialData ? `/api/admin/karir/${initialData.id}` : '/api/admin/karir'
      const method = initialData ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!res.ok) throw new Error('Failed to save data')
      
      toast.success(initialData ? 'Lowongan berhasil diupdate' : 'Lowongan berhasil dibuat')
      router.push('/admin/karir')
      router.refresh()
    } catch (error) {
      toast.error('Terjadi kesalahan')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!initialData || !confirm('Yakin ingin menghapus lowongan ini? Data pelamar yang melamar lowongan ini juga akan terhapus.')) return
    
    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/karir/${initialData.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      
      toast.success('Lowongan berhasil dihapus')
      router.push('/admin/karir')
      router.refresh()
    } catch (error) {
      toast.error('Gagal menghapus lowongan')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.push('/admin/karir')} className="-ml-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
        </Button>
        {initialData && (
          <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
            {deleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash className="mr-2 h-4 w-4" />}
            Hapus Lowongan
          </Button>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg border shadow-sm max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Judul Posisi</Label>
              <Input 
                value={formData.title} 
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Contoh: Senior Web Developer"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Departemen</Label>
              <Input 
                value={formData.department} 
                onChange={(e) => setFormData({...formData, department: e.target.value})}
                placeholder="Contoh: IT / Technology"
              />
            </div>
            <div className="space-y-2">
              <Label>Lokasi Penempatan</Label>
              <Input 
                value={formData.location} 
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                placeholder="Contoh: Jakarta Pusat"
              />
            </div>
            <div className="space-y-2">
              <Label>Tipe Pekerjaan</Label>
              <Select value={formData.type} onValueChange={(val) => setFormData({...formData, type: val || 'Full-time'})}>
                <SelectTrigger><SelectValue placeholder="Pilih Tipe" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Full-time">Full-time</SelectItem>
                  <SelectItem value="Part-time">Part-time</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                  <SelectItem value="Internship">Internship</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Deskripsi Pekerjaan</Label>
            <Textarea 
              value={formData.description} 
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Jelaskan peran dan tanggung jawab pekerjaan..."
              className="h-32"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Persyaratan / Kualifikasi</Label>
            <Textarea 
              value={formData.requirements} 
              onChange={(e) => setFormData({...formData, requirements: e.target.value})}
              placeholder="Masukkan syarat yang dibutuhkan..."
              className="h-32"
              required
            />
          </div>

          <div className="space-y-2 w-48">
            <Label>Status Tampil</Label>
            <Select value={formData.status} onValueChange={(val) => { if (val) setFormData({...formData, status: val as 'PUBLISHED' | 'DRAFT'}) }}>
              <SelectTrigger><SelectValue placeholder="Pilih Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="PUBLISHED">Dipublikasikan</SelectItem>
                <SelectItem value="DRAFT">Draft (Sembunyikan)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="pt-4 flex justify-end">
            <Button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700">
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              {initialData ? 'Simpan Perubahan' : 'Terbitkan Lowongan'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
