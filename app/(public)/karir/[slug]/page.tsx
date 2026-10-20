import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  Calendar, 
  ArrowLeft, 
  Send, 
  ChevronRight, 
  CheckCircle2, 
  Mail, 
  ShieldCheck 
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { JOB_VACANCIES } from '@/lib/data/kkusb-data'
import JobApplicationForm from '@/components/public/job-application-form'

async function getJobBySlug(slug: string) {
  try {
    const dbJob = await prisma.jobPosting.findUnique({
      where: { slug, status: 'PUBLISHED' },
      include: {
        tests: {
          include: { questions: true }
        }
      }
    })

    if (dbJob) {
      return {
        id: dbJob.id,
        title: dbJob.title,
        slug: dbJob.slug,
        department: dbJob.department || "Divisi IT & Korporasi",
        location: dbJob.location || "Gresik / Jawa Timur",
        type: dbJob.type || "Penuh Waktu",
        postedDate: new Date(dbJob.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }),
        deadline: dbJob.deadline ? new Date(dbJob.deadline).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : "Terbuka",
        description: dbJob.description || "",
        requirements: dbJob.requirements 
          ? dbJob.requirements.split('\n').map(r => r.replace(/^-\s*/, '').trim()).filter(Boolean) 
          : [],
        hasOnlineTest: !!(dbJob.tests && dbJob.tests.some(t => t.questions.length > 0))
      }
    }
  } catch (e) {
    // Database query error
  }

  return null
}

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> | { slug: string } 
}): Promise<Metadata> {
  const resolvedParams = await params
  const job = await getJobBySlug(resolvedParams.slug)

  if (!job) return { title: 'Lowongan Tidak Ditemukan | KKUSB' }

  return {
    title: `${job.title} — Karir KKUSB`,
    description: job.description.substring(0, 160),
  }
}

export default async function JobDetailPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> | { slug: string } 
}) {
  const resolvedParams = await params
  const job = await getJobBySlug(resolvedParams.slug)

  if (!job) notFound()

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 selection:bg-[#079B49]/20 selection:text-[#075C35]">
      
      {/* 1. HEADER */}
      <section className="relative overflow-hidden pt-12 pb-14 border-b border-zinc-200 dark:border-zinc-800 bg-[#F6F8F6]/80 dark:bg-zinc-900/40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl space-y-6">
          
          <nav className="flex items-center gap-2 text-xs text-zinc-500">
            <Link href="/" className="hover:text-[#079B49] transition-colors">Beranda</Link>
            <ChevronRight className="h-3.5 w-3.5 text-zinc-400" />
            <Link href="/karir" className="hover:text-[#079B49] transition-colors">Karir</Link>
            <ChevronRight className="h-3.5 w-3.5 text-zinc-400" />
            <span className="text-zinc-900 dark:text-zinc-100 font-semibold line-clamp-1">{job.title}</span>
          </nav>

          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-[#079B49] bg-green-100/70 dark:bg-green-950/70 px-3 py-1 rounded-full">
                {job.department}
              </span>
              <span className="text-xs text-zinc-600 dark:text-zinc-400 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-3 py-1 rounded-full">
                {job.type}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 leading-tight">
              {job.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500 pt-2 border-t border-zinc-200 dark:border-zinc-800">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-[#079B49]" />
                Penempatan: <strong className="text-zinc-800 dark:text-zinc-200">{job.location}</strong>
              </span>
              <span>&bull;</span>
              <span className="flex items-center gap-1.5 text-red-600 dark:text-red-400 font-semibold">
                <Calendar className="h-3.5 w-3.5" />
                Batas Lamaran: {job.deadline}
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* 2. JOB DETAILS & APPLICATION */}
      <section className="py-16 lg:py-20 border-b border-zinc-100 dark:border-zinc-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl space-y-10">
          
          {/* Overview */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              Deskripsi Tanggung Jawab
            </h2>
            <p className="text-base text-zinc-600 dark:text-zinc-300 leading-relaxed font-light">
              {job.description}
            </p>
          </div>

          {/* Requirements */}
          <div className="space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              Kualifikasi & Persyaratan
            </h2>
            <div className="space-y-2.5">
              {job.requirements.map((req, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="h-4 w-4 text-[#079B49] shrink-0 mt-0.5" />
                  <span className="text-sm text-zinc-700 dark:text-zinc-300 font-light">
                    {req}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Form Lamaran & Tes Online Langsung */}
          <div id="form-lamaran" className="scroll-mt-24 space-y-6">
            <JobApplicationForm 
              jobId={job.id} 
              jobTitle={job.title} 
              hasOnlineTest={job.hasOnlineTest} 
            />

            <div className="flex items-center justify-between text-xs text-zinc-500 pt-2 px-2">
              <span>Pertanyaan seputar rekrutmen? Hubungi <strong>kantorpusat@kkusb.co.id</strong></span>
              <Button asChild variant="ghost" size="sm" className="text-xs">
                <Link href="/karir">
                  &larr; Kembali ke Semua Lowongan
                </Link>
              </Button>
            </div>
          </div>

        </div>
      </section>

    </div>
  )
}
