import KlienForm from '@/components/admin/klien-form'

export default function CreateKlienPage() {
  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tambah Mitra</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Tambahkan klien atau mitra kerjasama baru ke dalam portofolio.
          </p>
        </div>
      </div>

      <KlienForm />
    </div>
  )
}
