import { Metadata } from 'next'
import { Image as ImageIcon, Camera } from 'lucide-react'
import prisma from '@/lib/prisma'

export const metadata: Metadata = {
  title: 'Galeri Foto | KKUSB',
  description: 'Galeri dokumentasi kegiatan dan fasilitas Koperasi Jasa Karyawan Usaha Sejahtera Bersama.',
}

export default async function GaleriPage() {
  let galleries: any[] = []
  let categories: any[] = []

  try {
    const [dbGalleries, dbCategories] = await Promise.all([
      prisma.gallery.findMany({
        where: { status: 'PUBLISHED' },
        orderBy: { date: 'desc' },
        include: { category: true }
      }),
      prisma.galleryCategory.findMany({
        orderBy: { name: 'asc' }
      })
    ])
    galleries = dbGalleries
    categories = dbCategories
  } catch (e) {
    galleries = [
      {
        id: "gal-1",
        title: "Rapat Anggota Tahunan KKUSB 2026",
        description: "Suasana RAT pengesahan laporan pertanggungjawaban tahunan di hadapan anggota.",
        image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop",
        date: new Date(),
        category: { name: "Rapat Anggota" }
      },
      {
        id: "gal-2",
        title: "Operasional Gerai USB Mart Kartini",
        description: "Pelayanan belanja kebutuhan pokok sehari-hari untuk anggota dan warga sekitar.",
        image: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=1200&auto=format&fit=crop",
        date: new Date(),
        category: { name: "Fasilitas Usaha" }
      },
      {
        id: "gal-3",
        title: "Family Gathering & Character Building",
        description: "Kegiatan kebersamaan keluarga besar staf KKUSB di Yogyakarta.",
        image: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=1200&auto=format&fit=crop",
        date: new Date(),
        category: { name: "Kebersamaan" }
      },
      {
        id: "gal-4",
        title: "Pelayanan Servis Bengkel Simetris",
        description: "Perawatan berkala armada kendaraan operasional mitra dan anggota.",
        image: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?q=80&w=1200&auto=format&fit=crop",
        date: new Date(),
        category: { name: "Fasilitas Usaha" }
      }
    ]
    categories = [
      { id: "c-1", name: "Rapat Anggota" },
      { id: "c-2", name: "Fasilitas Usaha" },
      { id: "c-3", name: "Kebersamaan" }
    ]
  }

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-950 transition-colors selection:bg-green-100 selection:text-green-900">
      {/* Page Header - Premium SaaS Aesthetic */}
      <section className="relative overflow-hidden pt-32 pb-24 lg:pt-40 lg:pb-32 border-b border-zinc-100 dark:border-zinc-800/50">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-50 via-white to-white dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-950 -z-10" />
        
        <div className="absolute top-0 right-1/4 -translate-y-12">
          <div className="h-[400px] w-[400px] rounded-full bg-green-50/60 dark:bg-green-900/10 blur-3xl" />
        </div>

        <div className="container mx-auto px-4 text-center max-w-4xl relative z-10 space-y-8">
          <div className="inline-flex items-center rounded-full border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 px-4 py-1.5 text-sm font-medium text-zinc-600 dark:text-zinc-300 backdrop-blur-sm shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse" />
            Dokumentasi Visual
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 leading-[1.1] text-balance">
            Galeri <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-400">Kegiatan</span>
          </h1>
          
          <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl mx-auto text-balance font-light">
            Kumpulan momen penting, kegiatan operasional, serta acara resmi yang merepresentasikan dedikasi dan kebersamaan keluarga besar koperasi.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-24 flex-1">
        <div className="container mx-auto px-4 max-w-7xl">
          
          {/* Categories Filter */}
          {categories.length > 0 && (
            <div className="flex flex-wrap justify-center gap-3 mb-16">
              <span className="px-6 py-2.5 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-semibold cursor-pointer shadow-md transition-all hover:scale-105">
                Semua Foto
              </span>
              {categories.map(cat => (
                <span key={cat.id} className="px-6 py-2.5 rounded-full bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:border-zinc-300 dark:hover:border-zinc-700 text-sm font-medium cursor-pointer transition-all shadow-sm hover:shadow-md">
                  {cat.name}
                </span>
              ))}
            </div>
          )}

          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {galleries.length > 0 ? (
              galleries.map((item) => (
                <div 
                  key={item.id} 
                  className="break-inside-avoid rounded-3xl overflow-hidden group relative border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm hover:shadow-2xl hover:shadow-green-900/10 transition-all duration-500 bg-zinc-100 dark:bg-zinc-900"
                >
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-auto object-cover scale-100 group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  
                  <div className="absolute top-4 right-4 h-10 w-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                    <Camera className="h-4 w-4 text-white" />
                  </div>

                  {/* Elegant Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8 z-10">
                    {item.category && (
                      <span className="text-green-400 text-xs font-bold mb-3 tracking-widest uppercase bg-green-500/20 px-2 py-1 rounded inline-block w-fit backdrop-blur-sm">
                        {item.category.name}
                      </span>
                    )}
                    <h3 className="text-white font-bold text-2xl leading-tight mb-2 tracking-tight transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">{item.title}</h3>
                    {item.description && (
                      <p className="text-zinc-300 text-sm line-clamp-2 leading-relaxed font-light transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-32 text-center bg-zinc-50/50 dark:bg-zinc-900/50 rounded-[3rem] border border-dashed border-zinc-200 dark:border-zinc-800 w-full shadow-sm">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-zinc-100 dark:bg-zinc-800 mb-6">
                  <ImageIcon className="h-10 w-10 text-zinc-400 dark:text-zinc-500" />
                </div>
                <h3 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-3 tracking-tight">Belum Ada Foto</h3>
                <p className="text-zinc-500 dark:text-zinc-400 max-w-sm font-light text-balance">Dokumentasi galeri saat ini sedang kosong. Silakan periksa kembali nanti.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
