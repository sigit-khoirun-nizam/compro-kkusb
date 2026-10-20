import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const members = await prisma.organizationMember.findMany({
      orderBy: { order: 'asc' }
    })
    return NextResponse.json(members)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') return NextResponse.json({ error: 'Unauthorized: Akses khusus admin' }, { status: 401 })

    const body = await req.json()
    const { name, position, image, description, order, status } = body

    const member = await prisma.organizationMember.create({
      data: {
        name,
        position,
        image,
        description,
        order,
        status,
      }
    })

    return NextResponse.json(member)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 })
  }
}
