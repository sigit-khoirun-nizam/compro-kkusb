import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import { ArrowLeft, Building2 } from 'lucide-react'
import JobApplicationForm from '@/components/public/job-application-form'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export const metadata: Metadata = {
  title: 'Formulir Lamaran Pekerjaan | KKUSB',
}

export default async function ApplyJobPage({ params }: { params: Promise<{ slug: string }> | { slug: string } }) {
  const resolvedParams = await params;
  const job = await prisma.jobPosting.findUnique({
    where: { slug: resolvedParams.slug, status: 'PUBLISHED' }
  })

  if (!job) notFound()

  const session = await getServerSession(authOptions)
  const defaultName = session?.user?.name || ''
  const defaultEmail = session?.user?.email || ''

  let hasApplied = false
  if (defaultEmail) {
    const existing = await prisma.applicant.findFirst({
      where: {
        jobId: job.id,
        email: defaultEmail
      }
    })
    hasApplied = !!existing
  }

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors">
      <section className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 pt-6 pb-8 rounded-3xl mb-6">
        <div className="container mx-auto px-4 max-w-3xl">
          <Link href="/portal-pelamar/dashboard/lowongan" className="inline-flex items-center text-xs sm:text-sm font-semibold text-zinc-500 hover:text-green-600 transition-colors mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Daftar Lowongan
          </Link>
          
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 mb-2">Formulir Lamaran Pekerjaan</h1>
          <p className="text-zinc-500 dark:text-zinc-400">Silakan lengkapi formulir di bawah ini dengan data yang sebenar-benarnya.</p>
          
          <div className="mt-8 p-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
               <Building2 className="w-6 h-6 text-green-600 dark:text-green-500" />
            </div>
            <div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">Melamar untuk posisi:</p>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{job.title}</h3>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 flex-1">
        <div className="container mx-auto px-4 max-w-3xl">
          {hasApplied ? (
            <div className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-sm p-12 text-center">
              <div className="h-20 w-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-green-600 dark:text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">Anda Sudah Melamar</h2>
              <p className="text-zinc-500 dark:text-zinc-400 mb-8 max-w-md mx-auto">
                Sistem mendeteksi bahwa Anda telah mengirimkan lamaran untuk posisi <strong>{job.title}</strong> sebelumnya.
              </p>
              <Link href="/portal-pelamar/dashboard" className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-green-600 hover:bg-green-700 text-white font-medium transition-colors">
                Kembali ke Dashboard
              </Link>
            </div>
          ) : (
            <JobApplicationForm jobId={job.id} jobTitle={job.title} jobSlug={job.slug} defaultName={defaultName} defaultEmail={defaultEmail} />
          )}
        </div>
      </section>
    </div>
  )
}
