import TentangForm from '@/components/admin/tentang-form'

export default function CreateTentangPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tambah Pengurus</h1>
        <p className="text-muted-foreground">Tambahkan profil anggota atau pengurus baru ke dalam struktur organisasi.</p>
      </div>

      <TentangForm />
    </div>
  )
}
