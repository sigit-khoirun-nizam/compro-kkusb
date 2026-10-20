import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string; questionId: string }> | { id: string; questionId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const resolvedParams = await params
    const { questionId } = resolvedParams

    const body = await request.json()
    const { question, optionA, optionB, optionC, optionD, correctOption } = body

    const updatedQuestion = await prisma.testQuestion.update({
      where: { id: questionId },
      data: {
        question,
        optionA,
        optionB,
        optionC: optionC || '',
        optionD: optionD || '',
        correctOption,
      },
    })

    return NextResponse.json(updatedQuestion)
  } catch (error) {
    console.error('Error updating question:', error)
    return NextResponse.json(
      { error: 'Failed to update question' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; questionId: string }> | { id: string; questionId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const resolvedParams = await params
    const { questionId } = resolvedParams

    await prisma.testQuestion.delete({
      where: { id: questionId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting question:', error)
    return NextResponse.json(
      { error: 'Failed to delete question' },
      { status: 500 }
    )
  }
}
