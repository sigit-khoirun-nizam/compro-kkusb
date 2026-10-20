import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { applicantId, testId, answers } = body

    if (!applicantId || !testId || !answers) {
      return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 })
    }

    // Pastikan pelamar terdaftar
    const applicant = await prisma.applicant.findUnique({
      where: { id: applicantId }
    })

    if (!applicant) {
      return NextResponse.json({ error: 'Data pelamar tidak ditemukan' }, { status: 404 })
    }

    // Verifikasi kepemilikan sesi pelamar
    const session = await getServerSession(authOptions)
    if (!session || !session.user || (session.user.email !== applicant.email && session.user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized: Sesi tes tidak valid untuk akun ini' }, { status: 401 })
    }

    // Ambil soal untuk menghitung skor
    const questions = await prisma.testQuestion.findMany({
      where: { testId }
    })

    if (!questions || questions.length === 0) {
      return NextResponse.json({ error: 'Soal tes tidak ditemukan' }, { status: 404 })
    }

    let correctCount = 0
    const totalQuestions = questions.length

    // Siapkan jawaban yang akan disimpan
    const answersToCreate: Array<{
      applicantId: string
      questionId: string
      selectedOption: string
      isCorrect: boolean
    }> = []

    for (const q of questions) {
      const selectedOption = answers[q.id]
      if (selectedOption && typeof selectedOption === 'string') {
        const isCorrect = selectedOption.trim().toUpperCase() === q.correctOption.trim().toUpperCase()
        if (isCorrect) correctCount++
        answersToCreate.push({
          applicantId,
          questionId: q.id,
          selectedOption: selectedOption.trim().toUpperCase(),
          isCorrect
        })
      }
    }

    // Hitung skor akhir (0-100)
    const testScore = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0

    // Jalankan transaksi database: bersihkan jawaban lama jika ada, simpan yang baru, dan update status pelamar
    await prisma.$transaction(async (tx) => {
      // Hapus jawaban sebelumnya jika sudah pernah ada (mencegah error P2002 duplicate key)
      await tx.testAnswer.deleteMany({
        where: { applicantId }
      })

      // Simpan jawaban baru
      if (answersToCreate.length > 0) {
        await tx.testAnswer.createMany({
          data: answersToCreate
        })
      }

      // Update status dan nilai pelamar
      await tx.applicant.update({
        where: { id: applicantId },
        data: {
          status: 'TEST_COMPLETED',
          testScore,
          testCompletedAt: new Date()
        }
      })
    })

    return NextResponse.json({ 
      success: true, 
      testScore,
      correctCount,
      totalQuestions
    })
  } catch (error: any) {
    console.error('Submit test error:', error)
    return NextResponse.json({ 
      error: error?.message || 'Failed to submit test' 
    }, { status: 500 })
  }
}

