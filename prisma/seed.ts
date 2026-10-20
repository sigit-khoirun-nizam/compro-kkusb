import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: 'admin@example.com' },
  })

  if (!existingAdmin) {
    // Hash password "Admin123!"
    // IMPORTANT: Change this password before production
    const passwordHash = await bcrypt.hash('Admin123!', 10)

    await prisma.user.create({
      data: {
        name: 'Administrator',
        email: 'admin@example.com',
        passwordHash,
        role: 'ADMIN',
      },
    })
    console.log('Admin user created: admin@example.com / Admin123!')
  }

  // Check and create Site Settings
  const existingSettings = await prisma.siteSetting.findFirst()
  if (!existingSettings) {
    await prisma.siteSetting.create({
      data: {
        siteName: 'KKUSB',
        siteDescription: 'Koperasi Jasa Karyawan Usaha Sejahtera Bersama',
        email: 'info@kkusb.co.id',
        phoneNumber: '021-12345678',
        address: 'Jl. Contoh Alamat No. 123, Jakarta',
        footerText: '© 2026 Koperasi Jasa Karyawan Usaha Sejahtera Bersama. All rights reserved.',
      },
    })
    console.log('Site settings created')
  }

  // Create Dummy Unit Usaha
  const existingUnit = await prisma.unitUsaha.findFirst()
  if (!existingUnit) {
    await prisma.unitUsaha.createMany({
      data: [
        {
          name: 'Unit Simpan Pinjam',
          slug: 'unit-simpan-pinjam',
          shortDescription: 'Layanan simpan pinjam untuk anggota.',
          description: 'Layanan simpan pinjam dengan bunga ringan untuk membantu kesejahteraan anggota koperasi.',
          status: 'PUBLISHED',
          order: 1,
        },
        {
          name: 'Unit Perdagangan',
          slug: 'unit-perdagangan',
          shortDescription: 'Penyediaan kebutuhan sehari-hari.',
          description: 'Penyediaan kebutuhan pokok dan barang konsumsi bagi anggota dan masyarakat umum.',
          status: 'PUBLISHED',
          order: 2,
        }
      ]
    })
    console.log('Dummy Unit Usaha created')
  }

  // Create Dummy News Category and News
  let newsCategory = await prisma.newsCategory.findUnique({ where: { slug: 'informasi' } })
  if (!newsCategory) {
    newsCategory = await prisma.newsCategory.create({
      data: {
        name: 'Informasi',
        slug: 'informasi',
      }
    })
  }

  const existingNews = await prisma.news.findFirst()
  if (!existingNews) {
    await prisma.news.create({
      data: {
        title: 'Rapat Anggota Tahunan 2026',
        slug: 'rapat-anggota-tahunan-2026',
        excerpt: 'Pelaksanaan RAT untuk membahas pencapaian tahun sebelumnya dan rencana kerja.',
        content: '<p>Koperasi Jasa Karyawan Usaha Sejahtera Bersama telah sukses melaksanakan Rapat Anggota Tahunan (RAT) tahun buku 2025 pada awal tahun 2026. Acara ini dihadiri oleh mayoritas anggota aktif.</p>',
        categoryId: newsCategory.id,
        author: 'Admin',
        status: 'PUBLISHED',
      }
    })
    console.log('Dummy News created')
  }

  console.log('Seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
