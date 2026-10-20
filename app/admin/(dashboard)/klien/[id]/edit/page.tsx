import KlienForm from '@/components/admin/klien-form'
import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'

export default async function EditKlienPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const resolvedParams = await params;
  const client = await prisma.client.findUnique({
    where: { id: resolvedParams.id }
  })

  if (!client) {
    notFound()
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit Mitra</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Perbarui data klien atau mitra kerjasama.
          </p>
        </div>
      </div>

      <KlienForm initialData={client} />
    </div>
  )
}
