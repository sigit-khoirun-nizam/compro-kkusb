'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Send } from 'lucide-react'

export default function ContactForm() {
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    subject: '',
    message: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error('Gagal mengirim pesan')
      }

      toast.success('Pesan Anda berhasil dikirim! Kami akan segera menghubungi Anda.')
      setFormData({ name: '', email: '', phoneNumber: '', subject: '', message: '' })
    } catch (error) {
      toast.error('Gagal mengirim pesan. Silakan coba lagi.')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Nama Lengkap <span className="text-red-500">*</span></Label>
          <Input 
            id="name" 
            placeholder="Masukkan nama Anda" 
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required 
            aria-required="true"
            className="bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-800"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="nama@email.com" 
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required 
            aria-required="true"
            className="bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-800"
          />
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Nomor Telepon/WA</Label>
          <Input 
            id="phoneNumber" 
            placeholder="0812xxxxxx" 
            value={formData.phoneNumber}
            onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
            className="bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-800"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="subject">Subjek Pesan</Label>
          <Input 
            id="subject" 
            placeholder="Tanya tentang..." 
            value={formData.subject}
            onChange={(e) => setFormData({...formData, subject: e.target.value})}
            className="bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-800"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Pesan <span className="text-red-500">*</span></Label>
        <Textarea 
          id="message" 
          placeholder="Tulis pesan Anda di sini..." 
          value={formData.message}
          onChange={(e) => setFormData({...formData, message: e.target.value})}
          rows={5} 
          required 
          aria-required="true"
          className="bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-800 resize-none"
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full sm:w-auto bg-[#079B49] hover:bg-[#075C35] text-white px-8 font-semibold shadow-sm transition-colors">
        {loading ? 'Mengirim...' : (
          <>Kirim Pesan <Send className="ml-2 h-4 w-4" /></>
        )}
      </Button>
    </form>
  )
}
