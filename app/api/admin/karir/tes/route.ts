import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Akses khusus admin' }, { status: 401 })
    }

    const body = await req.json()
    const { title, description, durationMinutes, jobId } = body

    if (!title || !durationMinutes) {
      return NextResponse.json({ error: 'Judul dan Durasi wajib diisi' }, { status: 400 })
    }

    const test = await prisma.academicTest.create({
      data: {
        title,
        description,
        durationMinutes: parseInt(durationMinutes),
        jobId: jobId || null, // null means general test
      }
    })

    return NextResponse.json({ success: true, test })
  } catch (error) {
    console.error('Create Test Error:', error)
    return NextResponse.json({ error: 'Gagal membuat tes' }, { status: 500 })
  }
}
