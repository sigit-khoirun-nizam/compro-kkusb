'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Pencil, Trash2, Loader2 } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import QuestionForm from './question-form'
import { toast } from 'sonner'

export default function QuestionItem({ 
  question, 
  testId, 
  index 
}: { 
  question: any, 
  testId: string,
  index: number
}) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Yakin ingin menghapus soal ini?')) return

    setIsDeleting(true)
    try {
      const res = await fetch(`/api/admin/karir/tes/${testId}/questions/${question.id}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Failed to delete')
      
      toast.success('Soal berhasil dihapus')
      router.refresh()
    } catch (error) {
      toast.error('Gagal menghapus soal')
      console.error(error)
      setIsDeleting(false)
    }
  }

  return (
    <div className="p-4 border rounded-md relative bg-zinc-50/50 group">
      <div className="absolute top-4 left-4 h-6 w-6 rounded-full bg-zinc-200 text-xs font-bold flex items-center justify-center">
        {index + 1}
      </div>
      
      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon" className="h-8 w-8 text-blue-600 border-blue-200 hover:bg-blue-50">
              <Pencil className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Soal</DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              <QuestionForm 
                testId={testId} 
                initialData={question} 
                isEditing={true}
                onSuccess={() => {
                  setIsEditOpen(false)
                }}
                onCancel={() => setIsEditOpen(false)}
              />
            </div>
          </DialogContent>
        </Dialog>

        <Button 
          variant="outline" 
          size="icon" 
          className="h-8 w-8 text-red-600 border-red-200 hover:bg-red-50"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
        </Button>
      </div>

      <div className="pl-10">
        <p className="font-medium mb-4 pr-16">{question.question}</p>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className={`p-2 rounded border ${question.correctOption === 'A' ? 'bg-green-100 border-green-300 font-medium' : 'bg-white'}`}>A. {question.optionA}</div>
          <div className={`p-2 rounded border ${question.correctOption === 'B' ? 'bg-green-100 border-green-300 font-medium' : 'bg-white'}`}>B. {question.optionB}</div>
          {question.optionC && (
            <div className={`p-2 rounded border ${question.correctOption === 'C' ? 'bg-green-100 border-green-300 font-medium' : 'bg-white'}`}>C. {question.optionC}</div>
          )}
          {question.optionD && (
            <div className={`p-2 rounded border ${question.correctOption === 'D' ? 'bg-green-100 border-green-300 font-medium' : 'bg-white'}`}>D. {question.optionD}</div>
          )}
        </div>
      </div>
    </div>
  )
}
