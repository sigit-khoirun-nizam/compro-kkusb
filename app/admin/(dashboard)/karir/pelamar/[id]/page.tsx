import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import ApplicantDetailForm from '@/components/admin/applicant-detail-form'

export default async function ApplicantDetailPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const resolvedParams = await params
  
  const applicant = await prisma.applicant.findUnique({
    where: { id: resolvedParams.id },
    include: { 
      job: true,
      testAnswers: {
        include: { question: true }
      }
    }
  })

  if (!applicant) notFound()

  return (
    <div className="space-y-6">
      <ApplicantDetailForm applicant={applicant as any} />
    </div>
  )
}
