import prisma from '@/lib/prisma'
import SettingsForm from '@/components/admin/settings-form'
import { KKUSB_PROFILE } from '@/lib/data/kkusb-data'

export default async function SettingsPage() {
  let settings: any = null

  try {
    settings = await prisma.siteSetting.findFirst()
  } catch (err) {
    // Graceful fallback when database is offline
  }

  if (!settings) {
    settings = {
      siteName: KKUSB_PROFILE.name,
      siteDescription: KKUSB_PROFILE.vision,
      footerText: `© 2026 ${KKUSB_PROFILE.shortName} — ${KKUSB_PROFILE.name}. Hak Cipta Dilindungi Undang-Undang.`,
      phoneNumber: KKUSB_PROFILE.headquarters.phone,
      email: KKUSB_PROFILE.headquarters.email,
      whatsapp: '6282118081681',
      address: KKUSB_PROFILE.headquarters.address,
      googleMapsUrl: KKUSB_PROFILE.headquarters.googleMapsUrl,
      facebookUrl: KKUSB_PROFILE.social.facebook,
      instagramUrl: KKUSB_PROFILE.social.instagram,
      youtubeUrl: KKUSB_PROFILE.social.youtube,
      seoTitle: `${KKUSB_PROFILE.shortName} — ${KKUSB_PROFILE.name}`,
      seoDescription: `Profil resmi, 6 unit usaha mandiri, simpan pinjam syariah, dan berita ${KKUSB_PROFILE.name} (${KKUSB_PROFILE.shortName}).`,
    }
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Pengaturan Website & Profil Lembaga
        </h1>
        <p className="text-zinc-500 text-xs md:text-sm mt-0.5">
          Kelola informasi umum organisasi, kanal kontak, tautan media sosial, dan meta SEO.
        </p>
      </div>

      <SettingsForm initialData={settings} />
    </div>
  )
}
