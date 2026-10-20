import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcrypt'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

export async function POST(req: Request) {
  try {
    let jobId = ''
    let name = ''
    let email = ''
    let phone = ''
    let cvUrl = ''
    let password = ''

    const contentType = req.headers.get('content-type') || ''

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData()
      jobId = (formData.get('jobId') as string) || ''
      name = (formData.get('name') as string) || ''
      email = (formData.get('email') as string) || ''
      phone = (formData.get('phone') as string) || ''
      password = (formData.get('password') as string) || ''

      const file = formData.get('cv') as File | null
      if (file && file.size > 0) {
        const buffer = Buffer.from(await file.arrayBuffer())
        const uploadDir = join(process.cwd(), 'public', 'uploads')
        await mkdir(uploadDir, { recursive: true })

        const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
        const filename = `cv_${Date.now()}_${safeName}`
        const filepath = join(uploadDir, filename)
        await writeFile(filepath, buffer)
        cvUrl = `/uploads/${filename}`
      }
    } else {
      const body = await req.json()
      jobId = body.jobId || ''
      name = body.name || ''
      email = body.email || ''
      phone = body.phone || ''
      cvUrl = body.cvUrl || ''
      password = body.password || ''
    }

    if (!jobId || !name || !email) {
      return NextResponse.json({ error: 'Nama, email, dan lowongan pekerjaan wajib diisi' }, { status: 400 })
    }

    const cleanPhoneDigits = (phone || '').replace(/\D/g, '')
    if (!phone || cleanPhoneDigits.length < 11) {
      return NextResponse.json({ error: 'Nomor telepon / WhatsApp minimal 11 digit angka' }, { status: 400 })
    }

    if (!cvUrl) {
      return NextResponse.json({ error: 'Berkas CV / Resume wajib diunggah' }, { status: 400 })
    }

    const cleanEmail = email.trim().toLowerCase()

    // 1. Cek atau buat akun User agar pelamar bisa login ke Portal Pelamar
    const existingUser = await prisma.user.findUnique({
      where: { email: cleanEmail }
    })

    if (!existingUser) {
      const defaultPass = password || 'Pelamar123!'
      const passwordHash = await bcrypt.hash(defaultPass, 10)
      await prisma.user.create({
        data: {
          name,
          email: cleanEmail,
          passwordHash,
          role: 'APPLICANT' as any
        }
      })
    }

    // 2. Cek apakah posisi pekerjaan ini memiliki Tes Akademik
    const test = await prisma.academicTest.findFirst({
      where: { jobId },
      include: { questions: true }
    })

    const hasTest = !!(test && test.questions.length > 0)

    // 3. Cek apakah pelamar sudah pernah mendaftar di posisi ini
    const existingApplicant = await prisma.applicant.findFirst({
      where: {
        jobId,
        email: cleanEmail
      }
    })

    if (existingApplicant) {
      return NextResponse.json({ 
        success: true,
        alreadyApplied: true,
        message: 'Anda sudah pernah mengajukan lamaran untuk posisi ini.',
        applicantId: existingApplicant.id,
        hasTest,
        testId: test?.id
      })
    }

    // 4. Buat berkas Applicant baru (langsung beri status TEST_SENT jika ada tes online)
    const applicant = await prisma.applicant.create({
      data: {
        jobId,
        name,
        email: cleanEmail,
        phone,
        cvUrl,
        status: hasTest ? 'TEST_SENT' : 'PENDING'
      }
    })

    return NextResponse.json({ 
      success: true, 
      applicantId: applicant.id,
      hasTest,
      testId: test?.id,
      message: 'Lamaran Anda berhasil dikirim!'
    })

  } catch (error: any) {
    console.error('Apply error:', error)
    return NextResponse.json({ error: error.message || 'Gagal mengirimkan lamaran' }, { status: 500 })
  }
}
