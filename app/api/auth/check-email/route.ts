import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json({ exists: false })
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      select: { id: true }
    })

    return NextResponse.json({ exists: !!user })
  } catch (error) {
    return NextResponse.json({ exists: false, error: 'Database check failed' }, { status: 500 })
  }
}
