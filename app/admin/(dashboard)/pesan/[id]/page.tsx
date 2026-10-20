import Link from 'next/link'
import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import { 
  ArrowLeft, 
  Mail, 
  User, 
  Phone, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  Reply, 
  MessageSquare,
  MessageCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import DeletePesanButton from '@/components/admin/delete-pesan-button'
import { formatDistanceToNow } from 'date-fns'
import { id } from 'date-fns/locale'

export default async function MessageDetailPage({
  params
}: {
  params: Promise<{ id: string }> | { id: string }
}) {
  const resolvedParams = await params
  let message: any = null

  try {
    message = await prisma.contactMessage.findUnique({
      where: { id: resolvedParams.id }
    })

    // Automatically mark as read if opened
    if (message && !message.isRead) {
      await prisma.contactMessage.update({
        where: { id: resolvedParams.id },
        data: { isRead: true }
      })
      message.isRead = true
    }
  } catch (err) {
    // Graceful handling
  }

  if (!message) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto py-10">
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/pesan">
            <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Kotak Masuk
          </Link>
        </Button>
        <Card>
          <CardContent className="p-12 text-center">
            <Mail className="h-12 w-12 text-zinc-300 mx-auto mb-3" />
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Pesan Tidak Ditemukan</h2>
            <p className="text-xs text-zinc-500 mt-1">Pesan mungkin telah dihapus atau ID tidak valid.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Format phone for WhatsApp
  const cleanPhone = message.phoneNumber ? message.phoneNumber.replace(/[^0-9]/g, '') : ''
  const waNumber = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Button asChild variant="outline" size="sm" className="h-8 text-xs border-[#E4E9E5]">
          <Link href="/admin/pesan">
            <ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> Kembali ke Daftar Pesan
          </Link>
        </Button>

        <div className="flex items-center gap-2">
          {message.phoneNumber && (
            <Button asChild size="sm" variant="outline" className="h-8 text-xs border-emerald-200 text-[#075C35] hover:bg-emerald-50">
              <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-1.5 h-3.5 w-3.5 text-emerald-600" /> Balas WhatsApp
              </a>
            </Button>
          )}

          <Button asChild size="sm" className="h-8 text-xs bg-[#079B49] hover:bg-[#075C35] text-white">
            <a href={`mailto:${message.email}?subject=Balasan: ${encodeURIComponent(message.subject || 'KKUSB')}`}>
              <Reply className="mr-1.5 h-3.5 w-3.5" /> Balas Email
            </a>
          </Button>

          <DeletePesanButton id={message.id} sender={message.name} />
        </div>
      </div>

      {/* Main message card */}
      <Card className="border-[#E4E9E5] dark:border-zinc-800 shadow-xs overflow-hidden">
        
        {/* Header sender info */}
        <div className="bg-zinc-50/70 dark:bg-zinc-900/60 border-b border-[#E4E9E5] dark:border-zinc-800 p-5 md:p-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-full bg-[#079B49]/10 text-[#075C35] dark:text-emerald-400 font-bold text-base flex items-center justify-center shrink-0 border border-[#079B49]/20">
                {message.name.substring(0, 2).toUpperCase()}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-base font-bold text-zinc-900 dark:text-zinc-100">{message.name}</h1>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] py-0">
                    <CheckCircle2 className="mr-1 h-3 w-3" /> Sudah Dibaca
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-500">
                  <span className="flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5 text-zinc-400" />
                    <a href={`mailto:${message.email}`} className="text-blue-600 hover:underline">{message.email}</a>
                  </span>
                  {message.phoneNumber && (
                    <span className="flex items-center gap-1">
                      <Phone className="h-3.5 w-3.5 text-zinc-400" />
                      {message.phoneNumber}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="text-left md:text-right shrink-0 text-xs text-zinc-400 space-y-0.5">
              <div className="flex items-center md:justify-end gap-1 font-medium text-zinc-600 dark:text-zinc-300">
                <Calendar className="h-3.5 w-3.5 text-zinc-400" />
                {new Date(message.createdAt).toLocaleDateString('id-ID', { 
                  weekday: 'long', 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </div>
              <div className="text-[11px] text-zinc-400">
                Pukul {new Date(message.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB ({formatDistanceToNow(new Date(message.createdAt), { addSuffix: true, locale: id })})
              </div>
            </div>
          </div>
        </div>

        {/* Message body */}
        <CardContent className="p-6 md:p-8 space-y-6">
          <div className="border-b border-zinc-100 dark:border-zinc-800 pb-4">
            <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
              Subjek Pesan
            </span>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              {message.subject || 'Tanpa Subjek Spesifik'}
            </h2>
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-2">
              Isi Pesan Lengkap
            </span>
            <div className="bg-zinc-50/50 dark:bg-zinc-950 p-6 rounded-xl border border-zinc-100 dark:border-zinc-800 text-sm leading-relaxed text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap font-sans">
              {message.message}
            </div>
          </div>
        </CardContent>

      </Card>
    </div>
  )
}
