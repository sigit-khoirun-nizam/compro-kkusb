import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import PortalPelamarNavbar from '@/components/portal/portal-pelamar-navbar'

export default async function PortalDashboardLayout({
  children
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    redirect('/portal-pelamar')
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col">
      <PortalPelamarNavbar user={session.user} />
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 max-w-6xl">
        {children}
      </main>
      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-6 text-center text-xs text-zinc-500 dark:text-zinc-400 bg-white dark:bg-zinc-900">
        <p>&copy; {new Date().getFullYear()} Koperasi Jasa Karyawan Usaha Sejahtera Bersama (KKUSB). Seluruh hak cipta dilindungi.</p>
      </footer>
    </div>
  )
}
