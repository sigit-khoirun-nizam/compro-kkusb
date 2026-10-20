import UnitUsahaForm from '@/components/admin/unit-usaha-form'
import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'

export default async function EditUnitUsahaPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const resolvedParams = await params;
  const unit = await prisma.unitUsaha.findUnique({
    where: { id: resolvedParams.id }
  })

  if (!unit) {
    notFound()
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <UnitUsahaForm initialData={unit} />
    </div>
  )
}
