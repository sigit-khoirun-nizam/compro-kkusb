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
    const { name, logo, description, website, status, order } = body

    if (!name) {
      return new NextResponse('Missing required fields', { status: 400 })
    }

    const client = await prisma.client.create({
      data: {
        name,
        logo,
        description,
        website,
        status,
        order,
      }
    })

    return NextResponse.json(client)
  } catch (error) {
    console.error('[KLIEN_POST]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const clients = await prisma.client.findMany({
      orderBy: { order: 'asc' }
    })

    return NextResponse.json(clients)
  } catch (error) {
    console.error('[KLIEN_GET]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
