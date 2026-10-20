import GaleriForm from '@/components/admin/galeri-form'
import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'

export default async function EditGaleriPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const resolvedParams = await params;
  
  const [gallery, categories] = await Promise.all([
    prisma.gallery.findUnique({
      where: { id: resolvedParams.id }
    }),
    prisma.galleryCategory.findMany({
      orderBy: { name: 'asc' }
    })
  ])

  if (!gallery) {
    notFound()
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Foto Galeri</h1>
        <p className="text-muted-foreground">Ubah deskripsi atau kategori foto yang sudah ada.</p>
      </div>

      <GaleriForm initialData={gallery} categories={categories} />
    </div>
  )
}
