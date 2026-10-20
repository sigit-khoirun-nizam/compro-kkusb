import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '') + '-' + Date.now().toString().slice(-4)
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Akses khusus admin' }, { status: 401 })
    }

    const body = await req.json()
    const { title, department, location, type, description, requirements, status } = body

    if (!title || !description || !requirements) {
      return NextResponse.json({ error: 'Judul, deskripsi, dan persyaratan wajib diisi' }, { status: 400 })
    }

    const job = await prisma.jobPosting.create({
      data: {
        title,
        slug: slugify(title),
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
    console.error('Create Job Error:', error)
    return NextResponse.json({ error: 'Gagal membuat lowongan' }, { status: 500 })
  }
}
