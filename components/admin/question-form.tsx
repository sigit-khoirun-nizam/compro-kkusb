'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { Loader2, PlusCircle } from 'lucide-react'

export default function QuestionForm({ 
  testId, 
  initialData, 
  isEditing = false,
  onSuccess,
  onCancel
}: { 
  testId: string, 
  initialData?: any,
  isEditing?: boolean,
  onSuccess?: () => void,
  onCancel?: () => void
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    question: initialData?.question || '',
    optionA: initialData?.optionA || '',
    optionB: initialData?.optionB || '',
    optionC: initialData?.optionC || '',
    optionD: initialData?.optionD || '',
    correctOption: initialData?.correctOption || 'A'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = isEditing 
        ? `/api/admin/karir/tes/${testId}/questions/${initialData.id}` 
        : `/api/admin/karir/tes/${testId}/questions`
      
      const method = isEditing ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!res.ok) throw new Error(isEditing ? 'Failed to update question' : 'Failed to create question')
      
      toast.success(isEditing ? 'Soal berhasil diperbarui' : 'Soal berhasil ditambahkan')
      
      if (!isEditing) {
        // Reset form if creating new
        setFormData({
          question: '',
          optionA: '',
          optionB: '',
          optionC: '',
          optionD: '',
          correctOption: 'A'
        })
      }
      
      router.refresh()
      if (onSuccess) onSuccess()
    } catch (error) {
      toast.error(isEditing ? 'Gagal memperbarui soal' : 'Gagal menambahkan soal')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={isEditing ? "space-y-4" : "bg-zinc-50 border p-6 rounded-lg space-y-4"}>
      {!isEditing && <h3 className="font-bold border-b pb-2 mb-4">Tambahkan Soal Baru</h3>}
      
      <div className="space-y-2">
        <Label>Pertanyaan</Label>
        <Input 
          value={formData.question} 
          onChange={(e) => setFormData({...formData, question: e.target.value})}
          placeholder="Tuliskan pertanyaan di sini..."
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Opsi A</Label>
          <Input 
            value={formData.optionA} 
            onChange={(e) => setFormData({...formData, optionA: e.target.value})}
            placeholder="Pilihan A"
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Opsi B</Label>
          <Input 
            value={formData.optionB} 
            onChange={(e) => setFormData({...formData, optionB: e.target.value})}
            placeholder="Pilihan B"
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Opsi C</Label>
          <Input 
            value={formData.optionC} 
            onChange={(e) => setFormData({...formData, optionC: e.target.value})}
            placeholder="Pilihan C (Opsional)"
          />
        </div>
        <div className="space-y-2">
          <Label>Opsi D</Label>
          <Input 
            value={formData.optionD} 
            onChange={(e) => setFormData({...formData, optionD: e.target.value})}
            placeholder="Pilihan D (Opsional)"
          />
        </div>
      </div>

      <div className="space-y-2 pt-2 border-t mt-4">
        <Label className="text-green-700 font-bold">Kunci Jawaban Benar</Label>
        <Select value={formData.correctOption} onValueChange={(val) => setFormData({...formData, correctOption: val})}>
          <SelectTrigger className="w-full md:w-48 border-green-200 focus:ring-green-500">
            <SelectValue placeholder="Pilih Jawaban Benar" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="A">Opsi A</SelectItem>
            <SelectItem value="B">Opsi B</SelectItem>
            {formData.optionC && <SelectItem value="C">Opsi C</SelectItem>}
            {formData.optionD && <SelectItem value="D">Opsi D</SelectItem>}
          </SelectContent>
        </Select>
      </div>

      <div className="pt-4 flex justify-end gap-2">
        {isEditing && onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
            Batal
          </Button>
        )}
        <Button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700">
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
          {isEditing ? 'Simpan Perubahan' : 'Tambah Soal'}
        </Button>
      </div>
    </form>
  )
}
