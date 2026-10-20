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

    const resolvedParams = await params
    const id = resolvedParams.id
    const body = await req.json()
    
    const { status } = body

    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 })
    }

    const applicant = await prisma.applicant.update({
      where: { id },
      data: { status }
    })

    return NextResponse.json({ success: true, applicant })
  } catch (error) {
    console.error('Update Applicant Status Error:', error)
    return NextResponse.json({ error: 'Gagal mengupdate status' }, { status: 500 })
  }
}
