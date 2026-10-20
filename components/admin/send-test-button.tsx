'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

export default function SendTestButton({ applicantId }: { applicantId: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSendTest = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/karir/pelamar/${applicantId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'TEST_SENT' })
      })

      if (!res.ok) throw new Error('Gagal update status')
      
      toast.success('Akses tes akademik berhasil dikirim!')
      router.refresh()
    } catch (error) {
      toast.error('Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button 
      onClick={handleSendTest}
      disabled={loading}
      variant="outline" 
      size="sm" 
      className="text-orange-600 border-orange-200 hover:bg-orange-50"
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Kirim Tes'}
    </Button>
  )
}
