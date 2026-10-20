import DokumenForm from '@/components/admin/dokumen-form'
import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'

export default async function EditDokumenPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const resolvedParams = await params;
  const dokumen = await prisma.document.findUnique({
    where: { id: resolvedParams.id }
  })

  if (!dokumen) {
    notFound()
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Dokumen</h1>
        <p className="text-muted-foreground">Ubah informasi dokumen atau ganti file yang ada.</p>
      </div>

      <DokumenForm initialData={dokumen} />
    </div>
  )
}
