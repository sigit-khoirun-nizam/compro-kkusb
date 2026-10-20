import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Akses khusus admin' }, { status: 401 })
    }

    const resolvedParams = await params;
    const body = await req.json()
    const { name, position, image, description, order, status } = body

    if (!name || !position) {
      return new NextResponse('Missing required fields', { status: 400 })
    }

    const member = await prisma.organizationMember.update({
      where: {
        id: resolvedParams.id,
      },
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
    console.error('[TENTANG_PUT]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Akses khusus admin' }, { status: 401 })
    }

    const resolvedParams = await params;
    const member = await prisma.organizationMember.delete({
      where: {
        id: resolvedParams.id,
      }
    })

    return NextResponse.json(member)
  } catch (error) {
    console.error('[TENTANG_DELETE]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
