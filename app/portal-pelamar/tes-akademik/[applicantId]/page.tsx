import { redirect, notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { GraduationCap, Timer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import AcademicTestForm from '@/components/public/academic-test-form'

export default async function TesAkademikPage({ params }: { params: Promise<{ applicantId: string }> | { applicantId: string } }) {
  const resolvedParams = await params;
  const applicantId = resolvedParams.applicantId
  
  const applicant = await prisma.applicant.findUnique({
    where: { id: applicantId },
    include: { 
      testAnswers: true,
      job: { include: { tests: { include: { questions: true } } } } 
    }
  })

  if (!applicant) notFound()

  const session = await getServerSession(authOptions)
  
  if (!session || !session.user || session.user.email !== applicant.email) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-4 text-center">
        <div className="h-16 w-16 bg-amber-100 dark:bg-amber-950/60 text-amber-600 rounded-2xl flex items-center justify-center mb-6">
          <GraduationCap className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">Autentikasi Pelamar Diperlukan</h1>
        <p className="text-zinc-500 dark:text-zinc-400 max-w-md">Silakan masuk menggunakan akun email Anda (<strong>{applicant.email}</strong>) untuk dapat mengerjakan tes akademik ini.</p>
        <Button asChild className="mt-6 bg-[#079B49] hover:bg-[#075C35] text-white rounded-full font-bold">
          <Link href={`/portal-pelamar?callbackUrl=/portal-pelamar/tes-akademik/${applicant.id}`}>Masuk ke Portal Pelamar &rarr;</Link>
        </Button>
      </div>
    )
  }

  // Ensure they are eligible to take the test
  if (applicant.status !== 'TEST_SENT' && applicant.status !== 'PENDING') {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-4 text-center">
        <div className="h-16 w-16 bg-purple-100 dark:bg-purple-950/60 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
          <GraduationCap className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
          {applicant.status === 'TEST_COMPLETED' ? 'Tes Sudah Selesai' : 'Akses Tes Tidak Tersedia'}
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 max-w-md">
          {applicant.status === 'TEST_COMPLETED' 
            ? `Anda sudah menyelesaikan tes ini dengan perolehan skor ${applicant.testScore ?? 0}/100. Silakan cek perkembangan di dashboard.`
            : 'Tahapan tes online belum dibuka atau sudah melewati batas waktu pengerjaan.'}
        </p>
        <Button asChild className="mt-6 bg-[#079B49] hover:bg-[#075C35] text-white rounded-full font-bold">
          <Link href="/portal-pelamar/dashboard">Buka Dashboard Lamaran</Link>
        </Button>
      </div>
    )
  }

  const test = applicant.job.tests[0] // Assuming 1 test per job for simplicity
  if (!test || test.questions.length === 0) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">Tes Belum Tersedia</h1>
        <p className="text-zinc-500 max-w-md">Soal tes untuk posisi ini belum disiapkan oleh admin.</p>
      </div>
    )
  }

  const initialAnswers: Record<string, string> = {}
  applicant.testAnswers.forEach(ans => {
    initialAnswers[ans.questionId] = ans.selectedOption
  })

  return (
    <AcademicTestForm 
      applicantId={applicant.id} 
      testId={test.id} 
      questions={test.questions} 
      durationMinutes={test.durationMinutes} 
      jobTitle={applicant.job.title}
      applicantName={applicant.name}
      initialAnswers={initialAnswers}
    />
  )
}
