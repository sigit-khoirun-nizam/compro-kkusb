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
import { Save, Loader2, ArrowLeft } from 'lucide-react'

export default function TestForm({ jobs }: { jobs: JobPosting[] }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    durationMinutes: 30,
    jobId: '', 
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/admin/karir/tes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!res.ok) throw new Error('Failed to create test')
      
      const { test } = await res.json()
      toast.success('Paket Tes berhasil dibuat')
      router.push(`/admin/karir/tes/${test.id}`)
      router.refresh()
    } catch (error) {
      toast.error('Terjadi kesalahan saat menyimpan')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => router.push('/admin/karir/tes')} className="-ml-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
      </Button>

      <div className="bg-white p-6 rounded-lg border shadow-sm max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="space-y-2">
            <Label>Judul Paket Tes</Label>
            <Input 
              value={formData.title} 
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="Contoh: Tes Pengetahuan Dasar Web Development"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Deskripsi / Instruksi Singkat</Label>
            <Textarea 
              value={formData.description} 
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Berikan instruksi atau penjelasan mengenai tes ini..."
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Durasi Pengerjaan (Menit)</Label>
              <Input 
                type="number"
                min={5}
                value={formData.durationMinutes} 
                onChange={(e) => setFormData({...formData, durationMinutes: parseInt(e.target.value) || 30})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Peruntukan Lowongan (Opsional)</Label>
              <Select value={formData.jobId} onValueChange={(val) => setFormData({...formData, jobId: val || ''})}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Lowongan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Umum (Tidak Spesifik)</SelectItem>
                  {jobs.map((job) => (
                    <SelectItem key={job.id} value={job.id}>{job.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <Button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700">
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Buat Paket & Lanjut Tambah Soal
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
