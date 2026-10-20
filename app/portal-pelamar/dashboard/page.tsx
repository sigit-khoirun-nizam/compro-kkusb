import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import ApplicantDashboardView, { ApplicantApplication } from '@/components/portal/applicant-dashboard-view'

export const metadata = {
  title: 'Dashboard Pelamar — KKUSB',
  description: 'Pantau status lamaran kerja, tes akademik, dan tahapan seleksi rekrutmen KKUSB Anda.'
}

export default async function PortalDashboardPage() {
  const session = await getServerSession(authOptions)
  
  if (!session || !session.user || !session.user.email) {
    redirect('/portal-pelamar')
  }

  const email = session.user.email

  let rawApplications: any[] = []
  let siteSettings: any = null

  try {
    rawApplications = await prisma.applicant.findMany({
      where: { email },
      include: {
        job: {
          include: {
            tests: {
              select: {
                id: true,
                title: true,
                durationMinutes: true,
                _count: {
                  select: { questions: true }
                }
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    siteSettings = await prisma.siteSetting.findFirst({
      select: {
        phoneNumber: true,
        email: true,
        whatsapp: true
      }
    })
  } catch (error) {
    console.warn('[PortalDashboardPage] Gagal membaca data lamaran dari database:', error)
  }

  // Format applications into client-safe serializable structure
  const applications: ApplicantApplication[] = rawApplications.map((app: any) => ({
    id: app.id,
    name: app.name,
    email: app.email,
    phone: app.phone,
    cvUrl: app.cvUrl,
    status: app.status,
    testScore: app.testScore,
    testStartedAt: app.testStartedAt ? app.testStartedAt.toISOString() : null,
    testCompletedAt: app.testCompletedAt ? app.testCompletedAt.toISOString() : null,
    createdAt: app.createdAt.toISOString(),
    updatedAt: app.updatedAt.toISOString(),
    job: {
      id: app.job.id,
      title: app.job.title,
      slug: app.job.slug,
      department: app.job.department,
      location: app.job.location,
      type: app.job.type,
      description: app.job.description,
      requirements: app.job.requirements,
      deadline: app.job.deadline ? app.job.deadline.toISOString() : null,
      tests: (app.job.tests || []).map((t: any) => ({
        id: t.id,
        title: t.title,
        durationMinutes: t.durationMinutes,
        _count: t._count
      }))
    }
  }))

  return (
    <ApplicantDashboardView 
      user={{
        name: session.user.name,
        email: email
      }}
      applications={applications}
      siteSettings={{
        phoneNumber: siteSettings?.phoneNumber,
        email: siteSettings?.email,
        whatsapp: siteSettings?.whatsapp
      }}
    />
  )
}
