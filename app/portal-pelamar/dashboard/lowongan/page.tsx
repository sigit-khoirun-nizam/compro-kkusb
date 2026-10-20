import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import PortalVacanciesView, { PortalJobItem } from '@/components/portal/portal-vacancies-view'

export const metadata: Metadata = {
  title: 'Lowongan Karir — Portal Rekrutmen KKUSB',
  description: 'Daftar lowongan kerja resmi dan peluang karir di Koperasi Jasa Karyawan Usaha Sejahtera Bersama.'
}

export default async function PortalLowonganPage() {
  const session = await getServerSession(authOptions)
  
  if (!session || !session.user || !session.user.email) {
    redirect('/portal-pelamar')
  }

  const email = session.user.email

  let userApplications: any[] = []
  let dbJobs: any[] = []

  try {
    // 1. Fetch user's existing applications
    userApplications = await prisma.applicant.findMany({
      where: { email },
      select: {
        id: true,
        jobId: true,
        status: true,
        testScore: true,
        createdAt: true,
        job: {
          select: {
            id: true,
            slug: true
          }
        }
      }
    })

    // 2. Fetch published jobs ONLY from database (data asli yang terdaftar di sistem)
    dbJobs = await prisma.jobPosting.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { createdAt: 'desc' },
      include: {
        tests: {
          select: {
            id: true,
            title: true
          }
        }
      }
    })
  } catch (error) {
    console.warn('[PortalLowonganPage] Gagal membaca data dari database:', error)
  }

  // Format data HANYA dari database tanpa dummy fallback
  const jobs: PortalJobItem[] = dbJobs.map((dbJ: any) => {
    const applied = userApplications.find((a: any) => a.jobId === dbJ.id || a.job?.id === dbJ.id || a.job?.slug === dbJ.slug)
    
    // Requirements split by newline
    const requirementsList: string[] = dbJ.requirements 
      ? dbJ.requirements.split('\n').map((r: string) => r.replace(/^-\s*/, '').trim()).filter(Boolean)
      : []

    return {
      id: dbJ.id,
      title: dbJ.title,
      slug: dbJ.slug,
      department: dbJ.department || 'Divisi IT & Korporasi',
      location: dbJ.location || 'Gresik / Jawa Timur',
      type: dbJ.type || 'Penuh Waktu',
      description: dbJ.description,
      requirements: requirementsList,
      deadline: dbJ.deadline ? new Date(dbJ.deadline).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : null,
      hasTest: dbJ.tests.length > 0,
      appliedStatus: applied ? {
        applicationId: applied.id,
        status: applied.status,
        testScore: applied.testScore,
        appliedAt: applied.createdAt.toISOString()
      } : null
    }
  })

  return (
    <PortalVacanciesView 
      jobs={jobs} 
      applicantEmail={email} 
    />
  )
}
