import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import QuestionForm from '@/components/admin/question-form'
import QuestionItem from '@/components/admin/question-item'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function ManageQuestionsPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const resolvedParams = await params
  
  const test = await prisma.academicTest.findUnique({
    where: { id: resolvedParams.id },
    include: {
      job: true,
      questions: {
        orderBy: { createdAt: 'asc' }
      }
    }
  })

  if (!test) notFound()

  return (
    <div className="space-y-6">
      <Button variant="ghost" asChild className="-ml-4">
        <Link href="/admin/karir/tes">
          <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Daftar Tes
        </Link>
      </Button>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Kelola Soal: {test.title}</h1>
        <p className="text-muted-foreground">Tambahkan atau tinjau soal untuk paket tes ini.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-lg border p-6">
            <h3 className="font-bold text-lg mb-4 flex items-center justify-between">
              Daftar Soal ({test.questions.length})
            </h3>
            
            {test.questions.length === 0 ? (
              <div className="text-center p-8 border-2 border-dashed rounded-lg text-muted-foreground">
                Belum ada soal. Silakan tambahkan soal pertama di panel samping.
              </div>
            ) : (
              <div className="space-y-6">
                {test.questions.map((q, index) => (
                  <QuestionItem key={q.id} question={q} testId={test.id} index={index} />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <QuestionForm testId={test.id} />
          
          <div className="bg-white p-6 border rounded-lg">
            <h4 className="font-bold border-b pb-2 mb-4">Informasi Paket</h4>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-muted-foreground block">Durasi Tes</span>
                <span className="font-medium">{test.durationMinutes} Menit</span>
              </div>
              <div>
                <span className="text-muted-foreground block">Peruntukan</span>
                <span className="font-medium">{test.job?.title || 'Umum'}</span>
              </div>
              <div>
                <span className="text-muted-foreground block">Status Publikasi</span>
                <Badge className="mt-1 bg-green-100 text-green-800 hover:bg-green-100 border-transparent">Aktif</Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
