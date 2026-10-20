import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const units = await prisma.unitUsaha.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { order: 'asc' }
    })
    return NextResponse.json(units)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') return NextResponse.json({ error: 'Unauthorized: Akses khusus admin' }, { status: 401 })

    const body = await req.json()
    const { name, slug, shortDescription, description, image, icon, status, order } = body

    const unit = await prisma.unitUsaha.create({
      data: {
        name,
        slug,
        shortDescription,
        description,
        image: image || null,
        icon: icon || null,
        status: status || 'PUBLISHED',
        order: Number(order) || 0
      }
    })

    return NextResponse.json(unit)
  } catch (error) {
    console.error('Failed to create unit usaha:', error)
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 })
  }
}
