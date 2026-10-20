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
    
    const { title, department, location, type, description, requirements, status } = body

    const job = await prisma.jobPosting.update({
      where: { id },
      data: {
        title,
        department,
        location,
        type,
        description,
        requirements,
        status,
      }
    })

    return NextResponse.json({ success: true, job })
  } catch (error) {
    console.error('Update Job Error:', error)
    return NextResponse.json({ error: 'Gagal mengupdate lowongan' }, { status: 500 })
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

    const resolvedParams = await params
    const id = resolvedParams.id
    
    // Will also delete applicants due to relation (wait, applicant doesn't have onDelete: Cascade for job, 
    // let's manually delete applicants first to avoid foreign key constraints)
    await prisma.applicant.deleteMany({
      where: { jobId: id }
    })
    
    await prisma.jobPosting.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete Job Error:', error)
    return NextResponse.json({ error: 'Gagal menghapus lowongan' }, { status: 500 })
  }
}
