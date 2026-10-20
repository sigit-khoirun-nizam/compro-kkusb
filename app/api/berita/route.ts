import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const news = await prisma.news.findMany({
      include: { category: true },
      orderBy: { publishedAt: 'desc' }
    })
    return NextResponse.json(news)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') return NextResponse.json({ error: 'Unauthorized: Akses khusus admin' }, { status: 401 })

    const body = await req.json()
    const { title, slug, excerpt, content, featuredImage, author, categoryId, status, publishedAt } = body

    const news = await prisma.news.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        featuredImage,
        author,
        categoryId,
        status,
        publishedAt: publishedAt ? new Date(publishedAt) : null,
      }
    })

    return NextResponse.json(news)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 })
  }
}
