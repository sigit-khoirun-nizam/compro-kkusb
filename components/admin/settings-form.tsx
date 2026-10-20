'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { toast } from 'sonner'
import { 
  Settings, 
  Save, 
  MapPin, 
  Share2, 
  Info, 
  Search, 
  Loader2, 
  CheckCircle2, 
  Phone, 
  Mail, 
  Globe
} from 'lucide-react'

interface SettingsFormProps {
  initialData?: any
}

export default function SettingsForm({ initialData }: SettingsFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'general' | 'contact' | 'social' | 'seo'>('general')

  const [formData, setFormData] = useState({
    siteName: initialData?.siteName || 'Koperasi Karyawan Usaha Sejahtera Bersama',
    siteDescription: initialData?.siteDescription || 'Koperasi terkemuka, mandiri, dan berkelanjutan berbasis Good Corporate Governance (GCG) di Gresik, Tuban, dan Rembang.',
    footerText: initialData?.footerText || '© 2026 KKUSB — Koperasi Karyawan Usaha Sejahtera Bersama. Hak Cipta Dilindungi Undang-Undang.',
    email: initialData?.email || 'kantorpusat@kkusb.co.id',
    phoneNumber: initialData?.phoneNumber || '0821 1808 1681',
    whatsapp: initialData?.whatsapp || '6282118081681',
    address: initialData?.address || 'Ruko Kartini Megah Blok A3, Jl. RA. Kartini No. 150-152, Kec. Kebomas, Kab. Gresik, Jawa Timur 61122',
    googleMapsUrl: initialData?.googleMapsUrl || 'https://www.google.com/maps/place/Koperasi+Karyawan+Usaha+Sejahtera+Bersama/@-7.1685475,112.6455316,17z',
    facebookUrl: initialData?.facebookUrl || 'https://www.facebook.com/profile.php?id=100064141386478',
    instagramUrl: initialData?.instagramUrl || 'https://www.instagram.com/kkusb/',
    youtubeUrl: initialData?.youtubeUrl || 'https://www.youtube.com/watch?v=gXg15OGK4Lg',
    seoTitle: initialData?.seoTitle || 'KKUSB — Koperasi Karyawan Usaha Sejahtera Bersama',
    seoDescription: initialData?.seoDescription || 'Profil resmi, 6 unit usaha mandiri, layanan simpan pinjam syariah, dan berita Koperasi Karyawan Usaha Sejahtera Bersama (KKUSB).',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Gagal menyimpan pengaturan')
      }

      toast.success('Pengaturan website berhasil disimpan dan diperbarui!')
      router.refresh()
    } catch (error) {
      toast.error('Terjadi kesalahan saat menyimpan pengaturan')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* Top Header & Save Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-4 rounded-xl border border-[#E4E9E5] dark:border-zinc-800 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
            Konfigurasi Profil & Informasi Situs
          </h2>
          <p className="text-xs text-zinc-500">
            Perubahan akan langsung berpengaruh ke halaman publik website korporat KKUSB.
          </p>
        </div>
        <Button 
          type="submit" 
          disabled={loading}
          className="bg-[#079B49] hover:bg-[#075C35] text-white text-xs font-semibold px-5 h-9 shrink-0 shadow-xs"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Menyimpan...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Simpan Pengaturan
            </>
          )}
        </Button>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[#E4E9E5] dark:border-zinc-800 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('general')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${
            activeTab === 'general'
              ? 'bg-[#079B49]/10 text-[#075C35] dark:text-emerald-400 font-semibold border border-[#079B49]/30'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800'
          }`}
        >
          <Info className="h-4 w-4" />
          Informasi Umum
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('contact')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${
            activeTab === 'contact'
              ? 'bg-[#079B49]/10 text-[#075C35] dark:text-emerald-400 font-semibold border border-[#079B49]/30'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800'
          }`}
        >
          <MapPin className="h-4 w-4" />
          Kontak & Alamat Kantor
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('social')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${
            activeTab === 'social'
              ? 'bg-[#079B49]/10 text-[#075C35] dark:text-emerald-400 font-semibold border border-[#079B49]/30'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800'
          }`}
        >
          <Share2 className="h-4 w-4" />
          Jejaring Media Sosial
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('seo')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${
            activeTab === 'seo'
              ? 'bg-[#079B49]/10 text-[#075C35] dark:text-emerald-400 font-semibold border border-[#079B49]/30'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800'
          }`}
        >
          <Search className="h-4 w-4" />
          Metadata & SEO
        </button>
      </div>

      {/* Tab 1: General Info */}
      {activeTab === 'general' && (
        <Card className="border-[#E4E9E5] dark:border-zinc-800 shadow-xs">
          <CardHeader className="p-5 pb-3">
            <CardTitle className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              Identitas Profil & Informasi Umum
            </CardTitle>
            <CardDescription className="text-xs">
              Nama resmi organisasi, deskripsi profil, dan label hak cipta.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 pt-3 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="siteName" className="text-xs font-semibold">Nama Resmi Lembaga / Website</Label>
              <Input 
                id="siteName"
                value={formData.siteName}
                onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                className="text-xs h-9"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="siteDescription" className="text-xs font-semibold">Deskripsi Singkat Profil</Label>
              <Textarea 
                id="siteDescription"
                rows={3}
                value={formData.siteDescription}
                onChange={(e) => setFormData({ ...formData, siteDescription: e.target.value })}
                className="text-xs resize-none"
              />
              <p className="text-[11px] text-zinc-400">Ditampilkan pada cuplikan deskripsi footer dan halaman tentang kami.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="footerText" className="text-xs font-semibold">Teks Hak Cipta Footer</Label>
              <Input 
                id="footerText"
                value={formData.footerText}
                onChange={(e) => setFormData({ ...formData, footerText: e.target.value })}
                className="text-xs h-9"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab 2: Contact & Address */}
      {activeTab === 'contact' && (
        <Card className="border-[#E4E9E5] dark:border-zinc-800 shadow-xs">
          <CardHeader className="p-5 pb-3">
            <CardTitle className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              Detail Kontak & Alamat Kantor Pusat
            </CardTitle>
            <CardDescription className="text-xs">
              Informasi saluran komunikasi resmi KKUSB di Gresik, Tuban, dan Rembang.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 pt-3 space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-semibold">Email Kantor Pusat</Label>
                <Input 
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="text-xs h-9"
                  placeholder="kantorpusat@kkusb.co.id"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="text-xs font-semibold">Nomor Telepon Kantor</Label>
                <Input 
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  className="text-xs h-9"
                  placeholder="0821 1808 1681"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsapp" className="text-xs font-semibold">Nomor WhatsApp Pelayanan (Kode 62)</Label>
              <Input 
                id="whatsapp"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                className="text-xs h-9"
                placeholder="6282118081681"
              />
              <p className="text-[11px] text-zinc-400">Digunakan untuk tombol tautan chat langsung di website publik.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="text-xs font-semibold">Alamat Lengkap Kantor Pusat</Label>
              <Textarea 
                id="address"
                rows={3}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="text-xs resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="googleMapsUrl" className="text-xs font-semibold">Tautan Google Maps</Label>
              <Input 
                id="googleMapsUrl"
                value={formData.googleMapsUrl}
                onChange={(e) => setFormData({ ...formData, googleMapsUrl: e.target.value })}
                className="text-xs h-9"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab 3: Social Media */}
      {activeTab === 'social' && (
        <Card className="border-[#E4E9E5] dark:border-zinc-800 shadow-xs">
          <CardHeader className="p-5 pb-3">
            <CardTitle className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              Tautan Media Sosial Resmi
            </CardTitle>
            <CardDescription className="text-xs">
              Hubungkan akun resmi media sosial KKUSB ke ikon footer website.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 pt-3 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="facebookUrl" className="text-xs font-semibold">Halaman Facebook</Label>
              <Input 
                id="facebookUrl"
                value={formData.facebookUrl}
                onChange={(e) => setFormData({ ...formData, facebookUrl: e.target.value })}
                className="text-xs h-9"
                placeholder="https://facebook.com/..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="instagramUrl" className="text-xs font-semibold">Profil Instagram</Label>
              <Input 
                id="instagramUrl"
                value={formData.instagramUrl}
                onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                className="text-xs h-9"
                placeholder="https://instagram.com/..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="youtubeUrl" className="text-xs font-semibold">Kanal YouTube</Label>
              <Input 
                id="youtubeUrl"
                value={formData.youtubeUrl}
                onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                className="text-xs h-9"
                placeholder="https://youtube.com/..."
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab 4: SEO Metadata */}
      {activeTab === 'seo' && (
        <Card className="border-[#E4E9E5] dark:border-zinc-800 shadow-xs">
          <CardHeader className="p-5 pb-3">
            <CardTitle className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              Pengaturan Indeksasi Mesin Pencari & SEO
            </CardTitle>
            <CardDescription className="text-xs">
              Teks judul meta default dan deskripsi pencarian Google.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 pt-3 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="seoTitle" className="text-xs font-semibold">Judul Meta Default (SEO Title)</Label>
              <Input 
                id="seoTitle"
                value={formData.seoTitle}
                onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                className="text-xs h-9"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="seoDescription" className="text-xs font-semibold">Deskripsi Meta Default (SEO Description)</Label>
              <Textarea 
                id="seoDescription"
                rows={3}
                value={formData.seoDescription}
                onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                className="text-xs resize-none"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bottom Save Button */}
      <div className="flex justify-end pt-2">
        <Button 
          type="submit" 
          disabled={loading}
          className="bg-[#079B49] hover:bg-[#075C35] text-white text-xs font-semibold px-6 h-9 shadow-xs"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Menyimpan Perubahan...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Simpan Semua Perubahan
            </>
          )}
        </Button>
      </div>

    </form>
  )
}
