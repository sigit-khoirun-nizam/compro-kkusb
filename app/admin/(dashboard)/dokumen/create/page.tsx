import DokumenForm from '@/components/admin/dokumen-form'

export default function CreateDokumenPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Upload Dokumen Baru</h1>
        <p className="text-muted-foreground">Tambahkan file dokumen untuk dibagikan secara publik atau privat.</p>
      </div>

      <DokumenForm />
    </div>
  )
}
