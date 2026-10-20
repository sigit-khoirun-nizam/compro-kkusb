import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const documents = await prisma.document.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(documents)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') return NextResponse.json({ error: 'Unauthorized: Akses khusus admin' }, { status: 401 })

    const body = await req.json()
    const { title, description, fileUrl, category, status } = body

    if (!title || !fileUrl) {
      return NextResponse.json({ error: 'Title and file are required' }, { status: 400 })
    }

    const document = await prisma.document.create({
      data: {
        title,
        description,
        fileUrl,
        category,
        status,
      }
    })

    return NextResponse.json(document)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create document' }, { status: 500 })
  }
}
