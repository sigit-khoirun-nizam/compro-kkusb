import { ReactNode } from 'react'
import PublicNavbar from '@/components/layout/public-navbar'
import PublicFooter from '@/components/layout/public-footer'
import prisma from '@/lib/prisma'

export default async function PublicLayout({ children }: { children: ReactNode }) {
  let units: any[] = []
  let settings: any = null
  try {
    const [dbUnits, dbSettings] = await Promise.all([
      prisma.unitUsaha.findMany({
        where: { status: 'PUBLISHED' },
        orderBy: { order: 'asc' },
      }),
      prisma.siteSetting.findFirst(),
    ])
    units = dbUnits
    settings = dbSettings
  } catch (err) {
    units = []
    settings = null
  }

  return (
    <div className="flex min-h-screen flex-col">
      <PublicNavbar units={units} settings={settings} />
      <main className="flex-1">
        {children}
      </main>
      <PublicFooter units={units} settings={settings} />
    </div>
  )
}
