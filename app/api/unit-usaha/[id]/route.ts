import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> | { id: string } }) {
  try {
    const resolvedParams = await params;
    const unit = await prisma.unitUsaha.findUnique({
      where: { id: resolvedParams.id }
    })
    
    if (!unit) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    
    return NextResponse.json(unit)
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
    const { name, slug, shortDescription, description, image, icon, status, order } = body

    const unit = await prisma.unitUsaha.update({
      where: { id: resolvedParams.id },
      data: {
        name,
        slug,
        shortDescription,
        description,
        image: typeof image !== 'undefined' ? image : undefined,
        icon: typeof icon !== 'undefined' ? icon : undefined,
        status,
        order: typeof order !== 'undefined' ? Number(order) : undefined
      }
    })

    return NextResponse.json(unit)
  } catch (error) {
    console.error('Failed to update unit usaha:', error)
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> | { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') return NextResponse.json({ error: 'Unauthorized: Akses khusus admin' }, { status: 401 })

    const resolvedParams = await params;
    await prisma.unitUsaha.delete({
      where: { id: resolvedParams.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}
