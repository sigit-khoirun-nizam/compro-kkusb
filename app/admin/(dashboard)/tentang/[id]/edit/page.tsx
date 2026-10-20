import TentangForm from '@/components/admin/tentang-form'
import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'

export default async function EditTentangPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const resolvedParams = await params;
  const member = await prisma.organizationMember.findUnique({
    where: { id: resolvedParams.id }
  })

  if (!member) {
    notFound()
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Pengurus</h1>
        <p className="text-muted-foreground">Perbarui data profil anggota atau pengurus organisasi.</p>
      </div>

      <TentangForm initialData={member} />
    </div>
  )
}
