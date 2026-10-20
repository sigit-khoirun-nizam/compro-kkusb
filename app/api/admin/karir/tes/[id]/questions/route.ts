import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Akses khusus admin' }, { status: 401 })
    }

    const resolvedParams = await params
    const testId = resolvedParams.id
    const body = await req.json()
    const { question, optionA, optionB, optionC, optionD, correctOption } = body

    if (!question || !optionA || !optionB || !correctOption) {
      return NextResponse.json({ error: 'Data soal tidak lengkap' }, { status: 400 })
    }

    const testQuestion = await prisma.testQuestion.create({
      data: {
        testId,
        question,
        optionA,
        optionB,
        optionC,
        optionD,
        correctOption,
      }
    })

    return NextResponse.json({ success: true, question: testQuestion })
  } catch (error) {
    console.error('Create Question Error:', error)
    return NextResponse.json({ error: 'Gagal membuat soal' }, { status: 500 })
  }
}
