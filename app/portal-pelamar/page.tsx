import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import PortalPelamarLoginClient from './login-client'

export default async function PortalPelamarPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> | { [key: string]: string | string[] | undefined } }) {
  const resolvedParams = await searchParams;
  const callbackUrl = typeof resolvedParams.callbackUrl === 'string' ? resolvedParams.callbackUrl : undefined;
  const initialError = typeof resolvedParams.error === 'string' ? resolvedParams.error : undefined;

  const session = await getServerSession(authOptions)

  if (session?.user?.role === 'APPLICANT') {
    redirect(callbackUrl || '/portal-pelamar/dashboard')
  }

  if (session?.user?.role === 'ADMIN') {
    redirect('/admin')
  }

  return <PortalPelamarLoginClient callbackUrl={callbackUrl} initialError={initialError} />
}
