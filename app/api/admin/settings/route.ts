import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const settings = await prisma.siteSetting.findFirst()
    return NextResponse.json(settings || {})
  } catch (error) {
    console.error('[SETTINGS_GET]', error)
    return NextResponse.json({}, { status: 200 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Akses khusus admin' }, { status: 401 })
    }

    const body = await req.json()
    const {
      siteName,
      siteDescription,
      phoneNumber,
      email,
      whatsapp,
      address,
      googleMapsUrl,
      facebookUrl,
      instagramUrl,
      youtubeUrl,
      footerText,
      seoTitle,
      seoDescription,
    } = body

    // Check if siteSetting already exists
    const existing = await prisma.siteSetting.findFirst()

    let updated
    if (existing) {
      updated = await prisma.siteSetting.update({
        where: { id: existing.id },
        data: {
          siteName: siteName || "KKUSB",
          siteDescription,
          phoneNumber,
          email,
          whatsapp,
          address,
          googleMapsUrl,
          facebookUrl,
          instagramUrl,
          youtubeUrl,
          footerText,
          seoTitle,
          seoDescription,
        }
      })
    } else {
      updated = await prisma.siteSetting.create({
        data: {
          siteName: siteName || "KKUSB",
          siteDescription,
          phoneNumber,
          email,
          whatsapp,
          address,
          googleMapsUrl,
          facebookUrl,
          instagramUrl,
          youtubeUrl,
          footerText,
          seoTitle,
          seoDescription,
        }
      })
    }

    return NextResponse.json({ success: true, settings: updated })
  } catch (error) {
    console.error('[SETTINGS_POST]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
