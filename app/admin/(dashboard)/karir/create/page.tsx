import JobForm from '@/components/admin/job-form'

export default function CreateJobPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tambah Lowongan Baru</h1>
        <p className="text-muted-foreground">Isi rincian pekerjaan untuk menampilkannya di halaman Karir publik.</p>
      </div>
      <JobForm />
    </div>
  )
}
