import prisma from '@/lib/prisma'
import TestForm from '@/components/admin/test-form'

export default async function CreateTestPage() {
  const jobs = await prisma.jobPosting.findMany({
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Buat Paket Tes Baru</h1>
        <p className="text-muted-foreground">Tentukan pengaturan dasar tes akademik sebelum menambahkan soal-soal.</p>
      </div>
      <TestForm jobs={jobs} />
    </div>
  )
}
