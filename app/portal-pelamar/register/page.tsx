import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import RegisterPelamarClient from './register-client'

export default async function RegisterPelamarPage() {
  const session = await getServerSession(authOptions)

  // Redirect if already logged in
  if (session?.user?.role === 'APPLICANT') {
    redirect('/portal-pelamar/dashboard')
  }

  if (session?.user?.role === 'ADMIN') {
    redirect('/admin')
  }

  return <RegisterPelamarClient />
}
