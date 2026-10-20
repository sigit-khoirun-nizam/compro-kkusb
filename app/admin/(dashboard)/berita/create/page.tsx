import BeritaForm from '@/components/admin/berita-form'
import prisma from '@/lib/prisma'

export default async function CreateBeritaPage() {
  const categories = await prisma.newsCategory.findMany()

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tambah Berita</h1>
        <p className="text-muted-foreground">Tulis artikel atau berita baru.</p>
      </div>

      <BeritaForm categories={categories} />
    </div>
  )
}
