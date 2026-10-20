import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import JobForm from '@/components/admin/job-form'

export default async function EditJobPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const resolvedParams = await params
  const job = await prisma.jobPosting.findUnique({
    where: { id: resolvedParams.id }
  })

  if (!job) notFound()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Lowongan Pekerjaan</h1>
        <p className="text-muted-foreground">Perbarui informasi lowongan atau ubah status tayangnya.</p>
      </div>
      <JobForm initialData={job} />
    </div>
  )
}
