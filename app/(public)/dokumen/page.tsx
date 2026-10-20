import { Metadata } from 'next'
import { FileText, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import prisma from '@/lib/prisma'

export const metadata: Metadata = {
  title: 'Dokumen Publik | KKUSB',
  description: 'Unduh dokumen-dokumen resmi dan formulir terkait Koperasi Jasa Karyawan Usaha Sejahtera Bersama.',
}

export default async function DokumenPage() {
  let documents: any[] = []
  try {
    documents = await prisma.document.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { createdAt: 'desc' }
    })
  } catch (e) {
    documents = [
      {
        id: "doc-1",
        title: "Company Profile Resmi KKUSB 2026",
        description: "Buku profil lengkap mengenai unit usaha, sejarah, legalitas, dan struktur tata kelola KKUSB.",
        category: "Profil Koperasi",
        fileUrl: "/logo.png"
      },
      {
        id: "doc-2",
        title: "Formulir Pendaftaran & Registrasi Anggota Baru",
        description: "Formulir permohonan keanggotaan aktif Koperasi Karyawan Usaha Sejahtera Bersama.",
        category: "Keanggotaan",
        fileUrl: "/logo.png"
      }
    ]
  }

  return (
    <div className="flex flex-col min-h-screen">
      <section className="bg-zinc-50 py-16 md:py-24 border-b">
        <div className="container mx-auto px-4 text-center max-w-3xl space-y-4">
          <FileText className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900">Dokumen Publik</h1>
          <p className="text-lg text-zinc-600 leading-relaxed">
            Akses dan unduh formulir, laporan, serta dokumen resmi lainnya yang disediakan untuk anggota dan mitra.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white flex-1">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="space-y-4">
            {documents.length > 0 ? (
              documents.map((doc) => (
                <Card key={doc.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-green-50 text-green-600 rounded-lg shrink-0">
                        <FileText className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-zinc-900">{doc.title}</h3>
                        {doc.description && <p className="text-zinc-600 text-sm mt-1">{doc.description}</p>}
                        {doc.category && (
                          <span className="inline-block mt-2 text-xs font-medium bg-zinc-100 text-zinc-600 px-2 py-1 rounded-full">
                            {doc.category}
                          </span>
                        )}
                      </div>
                    </div>
                    <Button asChild variant="outline" className="shrink-0 w-full sm:w-auto border-green-600 text-green-700 hover:bg-green-50">
                      <a href={doc.fileUrl} download target="_blank" rel="noopener noreferrer">
                        <Download className="mr-2 h-4 w-4" /> Unduh File
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-20 bg-zinc-50 rounded-2xl border border-dashed">
                <p className="text-zinc-500">Belum ada dokumen yang tersedia untuk diunduh.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
