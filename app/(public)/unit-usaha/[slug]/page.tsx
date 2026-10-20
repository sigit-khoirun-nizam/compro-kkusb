import Link from 'next/link'
import { 
  ArrowLeft, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  Briefcase, 
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  ShoppingBag,
  Compass,
  Wrench,
  Utensils,
  ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { BUSINESS_UNITS, BusinessUnitItem } from '@/lib/data/kkusb-data'

const unitIcons: Record<string, any> = {
  TrendingUp,
  ShieldCheck,
  ShoppingBag,
  Compass,
  Wrench,
  Utensils
}

async function getUnitBySlug(slug: string): Promise<BusinessUnitItem | null> {
  // Try finding in verified data first
  const fallback = BUSINESS_UNITS.find(b => b.slug === slug)

  try {
    const dbUnit = await prisma.unitUsaha.findUnique({
      where: { slug }
    })

    if (dbUnit) {
      return {
        id: dbUnit.id,
        name: dbUnit.name,
        slug: dbUnit.slug,
        category: fallback?.category || "Layanan & Komersial",
        shortDescription: dbUnit.shortDescription || fallback?.shortDescription || "",
        description: dbUnit.description || fallback?.description || "",
        services: fallback?.services || [
          "Pelayanan terintegrasi berstandar mutu",
          "Dokumentasi legalitas transaksi rapi",
          "Dukungan tim profesional berpengalaman"
        ],
        features: fallback?.features || [
          { title: "Transparan & Akuntabel", desc: "Setiap proses terdokumentasi rapi." },
          { title: "Kualitas Terjamin", desc: "Mengutamakan kepuasan mitra dan anggota." }
        ],
        image: dbUnit.image || fallback?.image || "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1200&auto=format&fit=crop",
        iconName: fallback?.iconName || "TrendingUp",
        location: fallback?.location || "Gresik, Jawa Timur",
        contactPhone: fallback?.contactPhone || "0821 1808 1681"
      }
    }
  } catch (e) {
    // Gracefully use fallback
  }

  return fallback || null
}

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> | { slug: string } 
}): Promise<Metadata> {
  const resolvedParams = await params
  const unit = await getUnitBySlug(resolvedParams.slug)
  
  if (!unit) return { title: 'Unit Usaha Tidak Ditemukan | KKUSB' }
  
  return {
    title: `${unit.name} — Unit Usaha KKUSB`,
    description: unit.shortDescription || `Profil dan layanan ${unit.name} dari Koperasi Karyawan Usaha Sejahtera Bersama.`,
  }
}

export default async function UnitUsahaDetailPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> | { slug: string } 
}) {
  const resolvedParams = await params
  const unit = await getUnitBySlug(resolvedParams.slug)

  if (!unit) {
    notFound()
  }

  const IconComp = unitIcons[unit.iconName] || TrendingUp
  const otherUnits = BUSINESS_UNITS.filter(u => u.slug !== unit.slug).slice(0, 3)

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 selection:bg-[#079B49]/20 selection:text-[#075C35]">
      
      {/* 1. HERO BANNER */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-16 lg:pb-24 border-b border-zinc-200 dark:border-zinc-800 bg-[#F6F8F6]/80 dark:bg-zinc-900/40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-zinc-500 mb-6">
            <Link href="/" className="hover:text-[#079B49] transition-colors">Beranda</Link>
            <ChevronRight className="h-3.5 w-3.5 text-zinc-400" />
            <Link href="/unit-usaha" className="hover:text-[#079B49] transition-colors">Unit Usaha</Link>
            <ChevronRight className="h-3.5 w-3.5 text-zinc-400" />
            <span className="text-zinc-900 dark:text-zinc-100 font-semibold line-clamp-1">{unit.name}</span>
          </nav>

          <div className="grid lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-4">
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#079B49] bg-green-100/70 dark:bg-green-950/70 px-3 py-1 rounded-full">
                <IconComp className="h-3.5 w-3.5" />
                <span>{unit.category}</span>
              </span>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 leading-tight">
                {unit.name}
              </h1>

              <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed font-light">
                {unit.shortDescription}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-zinc-500">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-[#079B49]" />
                  Lokasi: <strong className="text-zinc-800 dark:text-zinc-200">{unit.location}</strong>
                </span>
                <span>&bull;</span>
                <span className="flex items-center gap-1.5">
                  <Phone className="h-4 w-4 text-[#079B49]" />
                  Layanan: <strong className="text-zinc-800 dark:text-zinc-200">{unit.contactPhone}</strong>
                </span>
              </div>
            </div>

            <div className="lg:col-span-4 flex lg:justify-end">
              <Button asChild size="lg" className="bg-[#079B49] hover:bg-[#075C35] text-white rounded-full h-12 px-7">
                <Link href="/kontak">
                  Konsultasi / Pengadaan Layanan &rarr;
                </Link>
              </Button>
            </div>

          </div>

        </div>
      </section>

      {/* 2. MAIN DETAIL CONTENT */}
      <section className="py-16 lg:py-24 border-b border-zinc-100 dark:border-zinc-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Content Column (8 cols) */}
            <div className="lg:col-span-8 space-y-10">
              
              {/* Featured Image */}
              <div className="rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-lg aspect-[16/9] bg-zinc-100 dark:bg-zinc-900 relative">
                <img 
                  src={unit.image} 
                  alt={unit.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Comprehensive Description */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                  Deskripsi & Ruang Lingkup Layanan
                </h2>
                <p className="text-base text-zinc-600 dark:text-zinc-300 leading-relaxed font-light">
                  {unit.description}
                </p>
              </div>

              {/* Services List */}
              <div className="space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                  Cakupan Layanan Utama
                </h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {unit.services.map((serv, idx) => (
                    <div 
                      key={idx}
                      className="p-4 rounded-xl bg-[#F6F8F6] dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 flex items-start gap-3"
                    >
                      <CheckCircle2 className="h-4 w-4 text-[#079B49] shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 font-medium">
                        {serv}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features & Advantages */}
              {unit.features && unit.features.length > 0 && (
                <div className="space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                    Keunggulan & Standar Kerja
                  </h3>
                  <div className="space-y-3">
                    {unit.features.map((feat, idx) => (
                      <div 
                        key={idx}
                        className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 space-y-1"
                      >
                        <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                          {feat.title}
                        </h4>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                          {feat.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Back button */}
              <div className="pt-6">
                <Button asChild variant="ghost" className="text-zinc-500 hover:text-[#079B49]">
                  <Link href="/unit-usaha">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Seluruh Unit Usaha
                  </Link>
                </Button>
              </div>

            </div>

            {/* Right Sidebar Column (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Quick Inquiry Card */}
              <div className="p-6 rounded-3xl bg-[#F6F8F6] dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-[#079B49] uppercase tracking-wider">Konsultasi Unit</span>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                    Bermitra dengan {unit.name}
                  </h3>
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    Ajukan penawaran kerjasama, pesanan pengadaan korporasi, atau informasi pemesanan retail.
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-zinc-200 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-400">
                  <p><strong>Hotline:</strong> {unit.contactPhone}</p>
                  <p><strong>Email:</strong> kantorpusat@kkusb.co.id</p>
                  <p><strong>Operasional:</strong> Senin – Jumat, 08:00 – 17:00</p>
                </div>

                <Button asChild className="w-full bg-[#079B49] hover:bg-[#075C35] text-white rounded-xl">
                  <Link href="/kontak">
                    Hubungi Kami via Form
                  </Link>
                </Button>
              </div>

              {/* Related Units */}
              <div className="p-6 rounded-3xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Unit Bisnis Lainnya
                </h4>
                <div className="space-y-3">
                  {otherUnits.map((other) => (
                    <Link
                      key={other.id}
                      href={`/unit-usaha/${other.slug}`}
                      className="block p-3 rounded-xl hover:bg-[#F6F8F6] dark:hover:bg-zinc-900 transition-colors group"
                    >
                      <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-[#079B49] transition-colors">
                        {other.name}
                      </p>
                      <p className="text-[11px] text-zinc-500 line-clamp-1 mt-0.5">
                        {other.category}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

    </div>
  )
}
