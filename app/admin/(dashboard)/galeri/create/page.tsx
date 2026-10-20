import GaleriForm from '@/components/admin/galeri-form'
import prisma from '@/lib/prisma'

export default async function CreateGaleriPage() {
  const categories = await prisma.galleryCategory.findMany({
    orderBy: { name: 'asc' }
  })

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tambah Foto Galeri</h1>
        <p className="text-muted-foreground">Upload foto atau gambar baru ke dalam galeri publik.</p>
      </div>

      <GaleriForm categories={categories} />
    </div>
  )
}
