import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> | { id: string } }) {
  try {
    const resolvedParams = await params;
    const item = await prisma.gallery.findUnique({
      where: { id: resolvedParams.id },
      include: { category: true }
    })
    
    if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    
    return NextResponse.json(item)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> | { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') return NextResponse.json({ error: 'Unauthorized: Akses khusus admin' }, { status: 401 })

    const resolvedParams = await params;
    const body = await req.json()
    const { title, description, image, categoryId, status } = body

    if (!title || !image) {
      return NextResponse.json({ error: 'Title and image are required' }, { status: 400 })
    }

    const item = await prisma.gallery.update({
      where: { id: resolvedParams.id },
      data: {
        title,
        description,
        image,
        categoryId,
        status,
      }
    })

    return NextResponse.json(item)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> | { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') return NextResponse.json({ error: 'Unauthorized: Akses khusus admin' }, { status: 401 })

    const resolvedParams = await params;
    await prisma.gallery.delete({
      where: { id: resolvedParams.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}
