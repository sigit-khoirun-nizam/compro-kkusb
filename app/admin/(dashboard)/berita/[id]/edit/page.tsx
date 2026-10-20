import BeritaForm from '@/components/admin/berita-form'
import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'

export default async function EditBeritaPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const resolvedParams = await params;
  const [news, categories] = await Promise.all([
    prisma.news.findUnique({
      where: { id: resolvedParams.id }
    }),
    prisma.newsCategory.findMany()
  ])

  if (!news) {
    notFound()
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Berita</h1>
        <p className="text-muted-foreground">Ubah artikel atau berita yang sudah ada.</p>
      </div>

      <BeritaForm initialData={news} categories={categories} />
    </div>
  )
}
