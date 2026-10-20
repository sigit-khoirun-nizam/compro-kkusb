import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, phoneNumber, subject, message } = body

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email and message are required' }, { status: 400 })
    }

    const contactMessage = await prisma.contactMessage.create({
      data: {
        name,
        email,
        phoneNumber,
        subject,
        message,
        isRead: false
      }
    })

    return NextResponse.json({ success: true, id: contactMessage.id })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to submit contact form' }, { status: 500 })
  }
}
