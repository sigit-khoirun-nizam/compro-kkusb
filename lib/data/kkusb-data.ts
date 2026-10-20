export interface BusinessUnitItem {
  id: string
  name: string
  slug: string
  category: string
  shortDescription: string
  description: string
  services: string[]
  features: { title: string; desc: string }[]
  image: string
  iconName: 'TrendingUp' | 'ShieldCheck' | 'ShoppingBag' | 'Compass' | 'Wrench' | 'Utensils'
  location: string
  contactPhone?: string
}

export interface NewsItem {
  id: string
  title: string
  slug: string
  category: 'Berita Terbaru' | 'Kegiatan Koperasi' | 'Pengumuman' | 'Artikel dan Edukasi'
  categorySlug: string
  date: string
  author: string
  readTime: string
  excerpt: string
  content: string[]
  featuredImage: string
  tags: string[]
}

export interface PartnerItem {
  id: string
  name: string
  role: string
  scope: string
  logoText: string
  category: 'BUMN & Holding' | 'Manufaktur & Energi' | 'Otomotif & Transportasi' | 'Layanan Strategis'
  website?: string
}

export const KKUSB_PROFILE = {
  name: "Koperasi Jasa Karyawan Usaha Sejahtera Bersama",
  shortName: "KKUSB",
  legalNumber: "Badan Hukum No. 518/01/BH/437.58/2010",
  tagline: "Sinergi Usaha, Tumbuh Bersama",
  slogan: "Sukses, Bahagia, Aamiin",
  establishedYear: "2010",
  headquarters: {
    address: "Ruko Kartini Megah Blok A3, Jl. RA. Kartini No. 150-152, Kec. Kebomas, Kab. Gresik, Jawa Timur 61122",
    city: "Gresik, Jawa Timur",
    coordinates: { lat: -7.1685475, lng: 112.6455316 },
    phone: "0821 1808 1681",
    altPhone: "(031) 3971234",
    email: "kantorpusat@kkusb.co.id",
    workingHours: "Senin – Jumat: 08:00 – 17:00 WIB (Sabtu – Minggu Tutup)",
    googleMapsUrl: "https://www.google.com/maps/place/Koperasi+Karyawan+Usaha+Sejahtera+Bersama/@-7.1685475,112.6455316,17z"
  },
  social: {
    facebook: "https://www.facebook.com/profile.php?id=100064141386478",
    instagram: "https://www.instagram.com/kkusb/",
    youtube: "https://www.youtube.com/watch?v=gXg15OGK4Lg"
  },
  metrics: [
    { value: "1.250+", label: "Anggota Aktif Terdaftar", sub: "Karyawan & Keluarga Kemitraan" },
    { value: "6", label: "Unit Bisnis Strategis", sub: "Diversifikasi Usaha Mandiri" },
    { value: "3", label: "Pusat Operasional Kota", sub: "Gresik, Tuban, Rembang" },
    { value: "15+", label: "Tahun Dedikasi & Kredibilitas", sub: "Melayani Sejak Tahun 2010" }
  ],
  vision: "Menjadi Koperasi Karyawan Terkemuka, Mandiri, dan Berkelanjutan yang Menjadi Penggerak Utama Kesejahteraan Anggota serta Mitra Industri Melalui Pengelolaan Profesional Berbasis Nilai-Nilai Kemitraan Strategis.",
  mission: [
    "Menjalankan tata kelola organisasi yang transparan, akuntabel, dan berintegritas tinggi sesuai kaidah Good Corporate Governance (GCG).",
    "Menghimpun dan mengoptimalkan potensi ekonomi anggota melalui diversifikasi unit usaha perdagangan, jasa, dan pembiayaan syariah.",
    "Memberikan layanan keuangan simpan pinjam yang adil, cepat, aman, dan berdaya saing bagi seluruh anggota.",
    "Membangun sinergi kemitraan profesional dengan institusi BUMN, korporasi swasta, dan ekosistem industri nasional.",
    "Meningkatkan distribusi Sisa Hasil Usaha (SHU) secara berkelanjutan serta memfasilitasi program jaminan sosial dan pendidikan anggota."
  ],
  values: [
    {
      code: "AMANAH",
      title: "Integritas & Kepercayaan",
      desc: "Menjaga amanah dana dan aspirasi anggota dengan kejujuran, transparansi audit berkala, dan kepatuhan regulasi perkoperasian."
    },
    {
      code: "PROFESIONAL",
      title: "Tata Kelola Unggul",
      desc: "Mengoperasikan setiap unit usaha secara disiplin, efisien, dan modern menggunakan standar korporasi dan teknologi informasi."
    },
    {
      code: "SINERGI",
      title: "Gotong Royong & Kebersamaan",
      desc: "Mengutamakan semangat kekeluargaan, saling membantu antar anggota, serta kolaborasi produktif dengan para mitra usaha."
    },
    {
      code: "INOVATIF",
      title: "Adaptif & Berkelanjutan",
      desc: "Terus berinovasi melahirkan unit usaha baru dan mendigitalisasi layanan agar relevan menghadapi dinamika industri modern."
    }
  ],
  governancePillars: [
    { title: "Transparansi", desc: "Keterbukaan informasi keuangan, pelaporan berkala melalui Rapat Anggota Tahunan (RAT), dan audit akuntan independen." },
    { title: "Akuntabilitas", desc: "Pertanggungjawaban terukur setiap pengurus dan pengawas dalam menjalankan rencana kerja dan amanat anggota." },
    { title: "Responsibilitas", desc: "Kepatuhan penuh pada anggaran dasar, peraturan perundang-undangan perkoperasian, dan etika bisnis yang sehat." },
    { title: "Kemandirian", desc: "Pengambilan keputusan yang profesional, objektif, dan bebas dari benturan kepentingan." },
    { title: "Kewajaran (Fairness)", desc: "Perlakuan adil dan setara bagi seluruh anggota dalam memperoleh layanan maupun pembagian Sisa Hasil Usaha." }
  ]
}

export const BUSINESS_UNITS: BusinessUnitItem[] = [
  {
    id: "unit-1",
    name: "Unit Pemasaran, Penjualan & Pelayanan Pelanggan",
    slug: "pemasaran-penjualan",
    category: "Perdagangan & Solusi Korporasi",
    shortDescription: "Pengadaan komoditas industri, kemitraan rantai pasok B2B, dan layanan pelanggan komersial terintegrasi.",
    description: "Unit Pemasaran, Penjualan, dan Pelayanan Pelanggan KKUSB merupakan pilar bisnis komersial yang berfokus pada penyediaan barang, suplai operasional pabrik, distribusi material industri, serta manajemen hubungan pelanggan untuk korporasi skala regional maupun nasional.",
    services: [
      "Pengadaan barang dan suplai operasional pabrik",
      "Kemitraan rantai pasok (supply chain) B2B terpercaya",
      "Manajemen logistik proyek dan distribusi tepat waktu",
      "Pusat layanan pelanggan korporat (Customer Care & Invoicing)"
    ],
    features: [
      { title: "Jaringan Distribusi Luas", desc: "Mendukung pengiriman ke wilayah Gresik, Tuban, Rembang, dan kawasan industri Jawa Timur." },
      { title: "Standar Mutu Ketat", desc: "Memastikan seluruh komoditas memenuhi spesifikasi teknis dan standar industri mitra." },
      { title: "Sistem Pemesanan Terintegrasi", desc: "Proses procurement transparan dengan dokumentasi legalitas faktur yang rapi." }
    ],
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1200&auto=format&fit=crop",
    iconName: "TrendingUp",
    location: "Gresik, Tuban & Rembang",
    contactPhone: "0821 1808 1681"
  },
  {
    id: "unit-2",
    name: "USPPS & Pengembangan Sistem",
    slug: "uspps-syariah",
    category: "Layanan Finansial & Digitalisasi",
    shortDescription: "Unit Simpan Pinjam dan Pembiayaan Syariah dengan tata kelola digital mandiri untuk anggota.",
    description: "USPPS (Unit Simpan Pinjam dan Pembiayaan Syariah) hadir untuk memenuhi kebutuhan finansial anggota berlandaskan prinsip syariah yang adil dan menenteramkan. Didukung divisi Pengembangan Sistem untuk mendigitalisasi layanan administrasi dan transaksi anggota secara aman.",
    services: [
      "Simpanan Sukarela, Wajib, dan Berjangka Syariah",
      "Pembiayaan Murabahah pengadaan barang modal",
      "Pinjaman lunak qardhul hasan untuk kebutuhan darurat",
      "Pengembangan sistem informasi transaksi & monitoring SHU"
    ],
    features: [
      { title: "Bagi Hasil Kompetitif", desc: "Perhitungan bagi hasil yang adil, transparan, dan menguntungkan kedua belah pihak." },
      { title: "Proses Cepat & Mudah", desc: "Pengajuan pinjaman yang efisien bagi anggota dengan verifikasi terstruktur." },
      { title: "Keamanan Dana Terjamin", desc: "Pengelolaan portofolio keuangan secara prudent dengan cadangan likuiditas kuat." }
    ],
    image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=1200&auto=format&fit=crop",
    iconName: "ShieldCheck",
    location: "Kantor Pusat KKUSB Gresik",
    contactPhone: "0821 1808 1681"
  },
  {
    id: "unit-3",
    name: "Retail Komersial (USB Mart & USB Part)",
    slug: "usb-mart-retail",
    category: "Jaringan Retail & Suku Cadang",
    shortDescription: "Minimarket modern dan penyedia suku cadang teknik yang melayani karyawan dan masyarakat umum.",
    description: "Jaringan retail USB Mart mengoperasikan gerai modern di beberapa titik strategis, menyediakan sembako, makanan ringan, dan kebutuhan rumah tangga dengan sistem pembayaran tunai maupun potong gaji. Divisi USB Part khusus menyediakan perlengkapan teknik dan suku cadang operasional.",
    services: [
      "Gerai USB Mart Kartini & USB Mart Veteran Gresik",
      "Gerai USB Mart Tuban & USB Mart Rembang",
      "USB Part Tuban & USB Part Rembang (Suku cadang & perkakas)",
      "Program kemudahan belanja kebutuhan pokok bagi anggota"
    ],
    features: [
      { title: "Produk Lengkap & Terjangkau", desc: "Stok bahan pokok harian berkualitas dengan harga kompetitif." },
      { title: "Fasilitas Belanja Anggota", desc: "Kemudahan skema transaksi dengan potongan gaji bulanan yang teratur." },
      { title: "Pelayanan Ramah & Nyaman", desc: "Gerai yang bersih, ber-AC, dan tertata rapi di area perkantoran serta pabrik." }
    ],
    image: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=1200&auto=format&fit=crop",
    iconName: "ShoppingBag",
    location: "Gresik, Tuban, dan Rembang",
    contactPhone: "0821 1808 1681"
  },
  {
    id: "unit-4",
    name: "KKUSB Tour & Travel",
    slug: "tour-travel",
    category: "Pariwisata & Perjalanan Dinas",
    shortDescription: "Biro perjalanan dinas korporasi, family gathering perusahaan, ticketing, dan bimbingan umroh.",
    description: "KKUSB Tour & Travel menyediakan solusi perjalanan lengkap untuk instansi perusahaan maupun perorangan. Mulai dari reservasi tiket transportasi darat dan udara, akomodasi hotel, penyelenggaraan gathering instansi, hingga paket ibadah umroh berkualitas tinggi.",
    services: [
      "Penyelenggaraan Family Gathering, Rapat Kerja & Outbound",
      "Penyediaan Tiket Pesawat, Kereta Api, dan Reservasi Hotel",
      "Paket Wisata Domestik & Internasional Korporasi",
      "Program Perjalanan Ibadah Umroh dan Wisata Religi Resmi"
    ],
    features: [
      { title: "Pengalaman Luas", desc: "Telah sukses menyelenggarakan gathering skala besar di berbagai kota di Indonesia." },
      { title: "Tarif Korporat Spesial", desc: "Bekerja sama langsung dengan maskapai penerbangan dan jaringan hotel ternama." },
      { title: "Pelayanan Terpadu End-to-End", desc: "Dari perencanaan jadwal, akomodasi, konsumsi, hingga dokumentasi kegiatan." }
    ],
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1200&auto=format&fit=crop",
    iconName: "Compass",
    location: "Ruko Kartini Megah Gresik",
    contactPhone: "0821 1808 1681"
  },
  {
    id: "unit-5",
    name: "Bengkel Simetris & Jasa Teknik",
    slug: "bengkel-simetris",
    category: "Perawatan Kendaraan & Armada",
    shortDescription: "Bengkel perbaikan mesin, spooring-balancing, dan pemeliharaan armada operasional industri.",
    description: "Bengkel Simetris merupakan fasilitas otomotif profesional yang melayani perawatan berkala, perbaikan mesin, kelistrikan, serta spooring-balancing kendaraan operasional niaga dan mobil pribadi anggota dengan teknisi bersertifikat dan suku cadang asli.",
    services: [
      "Perawatan rutin armada operasional kendaraan dinas (Fleet Maintenance)",
      "Servis mesin berkala, tune up, ganti oli, dan uji emisi",
      "Layanan spooring, balancing, dan pergantian ban berstandar pabrik",
      "Penyediaan suku cadang resmi bergaransi"
    ],
    features: [
      { title: "Teknisi Terlatih", desc: "Didukung mekanik andal berpengalaman menangani berbagai tipe armada." },
      { title: "Peralatan Modern", desc: "Dilengkapi diagnostic scanner dan perlengkapan hidrolik berstandar keselamatan." },
      { title: "Diskon Khusus Anggota", desc: "Potongan harga jasa dan suku cadang eksklusif bagi anggota koperasi." }
    ],
    image: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?q=80&w=1200&auto=format&fit=crop",
    iconName: "Wrench",
    location: "Gresik",
    contactPhone: "0821 1808 1681"
  },
  {
    id: "unit-6",
    name: "Kantin Fabrikasi & Pengelolaan Fasilitas",
    slug: "kantin-fabrikasi",
    category: "Jasa Boga & Facility Management",
    shortDescription: "Layanan konsumsi higienis kawasan industri, katering perusahaan, dan tata kelola fasilitas boga.",
    description: "Kantin Fabrikasi KKUSB menyediakan layanan konsumsi bergizi, higienis, dan tersertifikasi untuk memenuhi kebutuhan ribuan tenaga kerja pabrik fabrikasi. Mengutamakan cita rasa prima, sanitasi ketat, serta ketepatan waktu distribusi makan siang dan shift malam.",
    services: [
      "Penyediaan katering harian pekerja pabrik & karyawan shift",
      "Pengelolaan gerai food court dan kantin kawasan industri",
      "Paket konsumsi premium rapat dewan direksi dan tamu kehormatan",
      "Manajemen higienitas dan sanitasi peralatan boga"
    ],
    features: [
      { title: "Standar Higienis Teruji", desc: "Penerapan protokol kebersihan ketat dari pengolahan hingga penyajian." },
      { title: "Menu Bervariasi & Seimbang", desc: "Dikelola dengan panduan kecukupan gizi untuk menjaga stamina pekerja." },
      { title: "Kapasitas Masak Besar", desc: "Mampu melayani kebutuhan ribuan porsi per hari secara konsisten." }
    ],
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200&auto=format&fit=crop",
    iconName: "Utensils",
    location: "Kawasan Pabrik Gresik",
    contactPhone: "0821 1808 1681"
  }
]

export const MEMBER_SERVICES = [
  {
    title: "Simpanan Terencana Anggota",
    badge: "Keuangan Aman",
    desc: "Layanan simpanan pokok, simpanan wajib, dan simpanan sukarela dengan sistem pencatatan digital dan imbal hasil kompetitif bagi anggota.",
    points: ["Pilihan simpanan fleksibel", "Pencatatan transparan secara real-time", "Imbal hasil kompetitif tahunan"]
  },
  {
    title: "Pembiayaan Syariah & Dana Talangan",
    badge: "Bebas Riba",
    desc: "Fasilitas pembiayaan syariah untuk kepemilikan barang, modal usaha mikro, maupun dana darurat dengan cicilan ringan terpotong otomatis dari payroll.",
    points: ["Akad syar'i jelas (Murabahah/Qardh)", "Plafon bersahabat tanpa biaya tersembunyi", "Proses verifikasi kilat"]
  },
  {
    title: "Kredit Elektronik & Kebutuhan Rumah",
    badge: "Kemudahan Fasilitas",
    desc: "Program pengadaan barang elektronik, gawai, perlengkapan rumah tangga, hingga sepeda motor dengan cicilan bunga ringan bagi karyawan.",
    points: ["Produk bergaransi resmi", "Jangka waktu cicilan hingga 24 bulan", "Tanpa uang muka memberatkan"]
  },
  {
    title: "Sisa Hasil Usaha (SHU) Berkelanjutan",
    badge: "Kesejahteraan Nyata",
    desc: "Pembagian SHU secara adil setiap tahun sesuai dengan keaktifan simpanan dan pemanfaatan unit usaha koperasi oleh anggota.",
    points: ["Diputuskan terbuka dalam Rapat Anggota Tahunan (RAT)", "Diterima tepat waktu setiap awal tahun", "Memberikan nilai tambah finansial nyata"]
  },
  {
    title: "Santunan & Program Sosial Karyawan",
    badge: "Kepedulian Bersama",
    desc: "Pemberian dana duka, santunan rawat inap keluarga, beasiswa anak berprestasi, serta bingkisan hari raya sebagai wujud solidaritas anggota.",
    points: ["Bantuan santunan musibah", "Apresiasi putra-putri berprestasi", "Bingkisan hari raya Idul Fitri"]
  }
]

export const CORPORATE_PARTNERS: PartnerItem[] = [
  {
    id: "p-1",
    name: "PT Semen Indonesia (Persero) Tbk (SIG)",
    role: "Kemitraan Utama & Pengadaan Korporat",
    scope: "Dukungan pengadaan barang komersial, layanan retail karyawan, dan kemitraan kegiatan korporasi di lingkungan holding SIG.",
    logoText: "SIG",
    category: "BUMN & Holding",
    website: "https://www.sig.id"
  },
  {
    id: "p-2",
    name: "PT Semen Gresik",
    role: "Mitra Strategis Operasional",
    scope: "Penyelenggaraan event Tukang Hebat SIG, pemeliharaan sarana kerja, dan distribusi perlengkapan operasional pabrik Rembang & Tuban.",
    logoText: "SEMEN GRESIK",
    category: "Manufaktur & Energi",
    website: "https://semengresik.com"
  },
  {
    id: "p-3",
    name: "PT Semen Padang",
    role: "Kemitraan Jasa & Mobilitas Regional",
    scope: "Kerja sama penyediaan akomodasi perjalanan dinas, koordinasi operasional perwakilan, dan suplai kebutuhan komersial.",
    logoText: "SEMEN PADANG",
    category: "BUMN & Holding"
  },
  {
    id: "p-4",
    name: "PT Semen Tonasa",
    role: "Kemitraan Wilayah Timur",
    scope: "Dukungan program mobilitas korporat, sinergi retail, dan pertukaran pasokan kebutuhan logistik antarsubsidiari.",
    logoText: "SEMEN TONASA",
    category: "BUMN & Holding"
  },
  {
    id: "p-5",
    name: "PT Isuzu Astra Motor Indonesia",
    role: "Mitra Otomotif & Suku Cadang",
    scope: "Penyediaan suku cadang resmi Euro-4, perawatan armada niaga, dan kerja sama teknis di Bengkel Simetris KKUSB.",
    logoText: "ISUZU",
    category: "Otomotif & Transportasi"
  },
  {
    id: "p-6",
    name: "Thyssenkrupp Industrial Solutions",
    role: "Kemitraan Fabrikasi Industri",
    scope: "Dukungan layanan pengelolaan katering higienis untuk staf teknisi dan pemeliharaan fasilitas proyek fabrikasi.",
    logoText: "thyssenkrupp",
    category: "Manufaktur & Energi"
  },
  {
    id: "p-7",
    name: "PT Fath Indah Travel",
    role: "Mitra Penyelenggara Umroh & Wisata Religi",
    scope: "Kolaborasi bimbingan ibadah umroh berizin resmi Kemenag serta penerbangan jemaah karyawan dan keluarga.",
    logoText: "FATH INDAH",
    category: "Layanan Strategis"
  },
  {
    id: "p-8",
    name: "Bengkel Simetris Otomotif",
    role: "Mitra Perawatan Kendaraan & Inspeksi",
    scope: "Pengelolaan teknis bengkel perbaikan armada, spooring balancing, dan suku cadang operasional di wilayah Gresik.",
    logoText: "SIMETRIS",
    category: "Otomotif & Transportasi"
  }
]

export const CLIENT_DEMOGRAPHICS = [
  { region: "Jawa Timur", cities: ["Gresik", "Surabaya", "Tuban", "Mojokerto", "Malang", "Jember"] },
  { region: "Jawa Tengah & DIY", cities: ["Rembang", "Salatiga", "Jepara", "Yogyakarta"] },
  { region: "Jabodetabek & Banten", cities: ["Jakarta", "Bekasi", "Tangerang", "Cilegon"] },
  { region: "Jawa Barat & Luar Jawa", cities: ["Bandung", "Padang", "Makassar", "Kupang"] }
]

export const NEWS_ARTICLES: NewsItem[] = [
  {
    id: "news-1",
    title: "Pengundian Tukang Hebat SIG 2026: KKUSB dan PT Semen Gresik Bagikan Hadiah Sepeda Motor, TV, dan Handphone",
    slug: "pengundian-tukang-hebat-sig-kkusb-semen-gresik-2026",
    category: "Kegiatan Koperasi",
    categorySlug: "kegiatan",
    date: "10 Maret 2026",
    author: "Tim Media KKUSB",
    readTime: "4 menit baca",
    excerpt: "Sebagai wujud apresiasi loyalitas mitra pengguna semen, KKUSB berkolaborasi dengan PT Semen Gresik menggelar program tahunan Pengundian Tukang Hebat SIG dengan ragam hadiah bernilai ratusan juta rupiah.",
    content: [
      "Koperasi Karyawan Usaha Sejahtera Bersama (KKUSB) bersama PT Semen Gresik sukses menyelenggarakan program undian spektakuler 'Tukang Hebat SIG 2026'. Program ini ditujukan untuk memberikan penghargaan setinggi-tingginya kepada para tukang bangunan dan aplikator semen yang telah konsisten menggunakan produk Semen Gresik dalam berbagai proyek konstruksi.",
      "Acara pengundian yang berlangsung semarak dihadiri oleh jajaran direksi perwakilan Semen Gresik, pengurus KKUSB, serta perwakilan asosiasi pekerja konstruksi. Hadiah yang dibagikan meliputi unit sepeda motor terbaru, smart TV, smartphone, hingga voucher belanja USB Mart senilai jutaan rupiah.",
      "Ketua KKUSB dalam sambutannya menegaskan bahwa kolaborasi ini merupakan bagian dari komitmen koperasi untuk terus menghadirkan manfaat nyata bagi ekosistem bisnis Semen Indonesia Group dan komunitas pekerja lapangan di seluruh Indonesia."
    ],
    featuredImage: "https://images.unsplash.com/photo-1541888946425-d0fbb18615f3?q=80&w=1200&auto=format&fit=crop",
    tags: ["Tukang Hebat", "Semen Gresik", "Program SIG", "Apresiasi", "KKUSB"]
  },
  {
    id: "news-2",
    title: "KKUSB Gelar Rapat Anggota Tahunan (RAT) Tahun Buku 2025: Bukukan Pertumbuhan Positif dan Peningkatan SHU",
    slug: "kkusb-gelar-rapat-anggota",
    category: "Berita Terbaru",
    categorySlug: "berita-terbaru",
    date: "28 Januari 2026",
    author: "Sekretariat KKUSB",
    readTime: "5 menit baca",
    excerpt: "Rapat Anggota Tahunan (RAT) KKUSB menetapkan laporan pertanggungjawaban pengurus tahun buku 2025 dengan pencapaian laba usaha yang meningkat signifikan dan distribusi SHU yang memuaskan anggota.",
    content: [
      "Koperasi Karyawan Usaha Sejahtera Bersama (KKUSB) menggelar Rapat Anggota Tahunan (RAT) untuk Tahun Buku 2025 secara tertib dan transparan. RAT dihadiri oleh dewan pengawas, pengurus, serta perwakilan anggota dari unit kerja Gresik, Tuban, dan Rembang.",
      "Dalam laporan pertanggungjawaban yang dipaparkan, seluruh unit usaha KKUSB menunjukkan performa yang sangat solid. Peningkatan omzet ditopang oleh kinerja Unit Pemasaran & Penjualan, ekspansi jaringan minimarket USB Mart, serta disiplin pengelolaan pembiayaan di USPPS.",
      "RAT juga menyetujui rencana kerja strategis tahun 2026, yang berfokus pada penguatan digitalisasi sistem administrasi anggota, penambahan fasilitas bengkel armada, dan peningkatan anggaran dana sosial anggota."
    ],
    featuredImage: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop",
    tags: ["Rapat Anggota", "RAT 2026", "SHU", "Kinerja Koperasi", "Gresik"]
  },
  {
    id: "news-3",
    title: "KKUSB Gelar Rapat Kerja, Family Gathering, dan Character Building di Yogyakarta",
    slug: "kkusb-gelar-rapat-kerja-family-gathering-dan-character-building-di-yogyakarta",
    category: "Kegiatan Koperasi",
    categorySlug: "kegiatan",
    date: "15 September 2025",
    author: "Divisi SDM & Tour Travel",
    readTime: "3 menit baca",
    excerpt: "Guna mempererat tali silaturahmi dan memantapkan target semester, KKUSB menyelenggarakan rangkaian Raker, Character Building, dan Family Gathering bersama seluruh jajaran staf dan keluarga di Yogyakarta.",
    content: [
      "Mengusung tema 'Sinergi Kuat, Kinerja Hebat', Koperasi Karyawan Usaha Sejahtera Bersama (KKUSB) memberangkatkan seluruh keluarga besar karyawan dan pengurus untuk mengikuti kegiatan Rapat Kerja dan Character Building selama tiga hari di Yogyakarta.",
      "Kegiatan diisi dengan evaluasi kinerja lintas unit, sesi motivasi pengembangan kapasitas kepemimpinan, outbound kebersamaan di kawasan Kaliurang, serta malam keakraban keluarga di pusat kota Yogyakarta.",
      "Acara ini diorganisir langsung oleh unit usaha KKUSB Tour & Travel, menunjukkan kapabilitas internal koperasi dalam mengelola agenda perjalanan korporat berskala besar secara profesional dan menyenangkan."
    ],
    featuredImage: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=1200&auto=format&fit=crop",
    tags: ["Family Gathering", "Rapat Kerja", "Yogyakarta", "Character Building", "Tour Travel"]
  },
  {
    id: "news-4",
    title: "Peningkatan Kompetensi SDM, KKUSB Mengadakan Pelatihan Administrasi Perkantoran & Kesekretariatan",
    slug: "kkusb-mengadakan-pelatihan-administrasi-perkantoran-kesekretariatan",
    category: "Artikel dan Edukasi",
    categorySlug: "edukasi",
    date: "22 Juni 2025",
    author: "Divisi Pengembangan SDM",
    readTime: "4 menit baca",
    excerpt: "Pelatihan komprehensif bagi staf administrasi KKUSB guna memastikan standar dokumentasi, korespondensi, dan pelaporan keuangan koperasi sesuai kaidah modern.",
    content: [
      "Untuk menjaga standar mutu pelayanan di seluruh kantor cabang dan gerai usaha, KKUSB menyelenggarakan lokakarya 'Pelatihan Administrasi Perkantoran & Kesekretariatan Modern'.",
      "Materi pelatihan meliputi tata kelola arsip digital, korespondensi bisnis formal, etika pelayanan anggota, serta penggunaan perangkat lunak spreadsheet lanjutan untuk rekonsiliasi data inventaris harian.",
      "Melalui pelatihan berkala ini, manajemen KKUSB berharap kecepatan respons serta akurasi pelayanan terhadap kebutuhan anggota dan mitra korporat dapat terus dipertahankan pada tingkat tertinggi."
    ],
    featuredImage: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200&auto=format&fit=crop",
    tags: ["Pelatihan SDM", "Administrasi", "Kesekretariatan", "Edukasi Koperasi"]
  },
  {
    id: "news-5",
    title: "Kegiatan HR National Conference: KKUSB Menjadi Tuan Rumah Pertemuan GDM SDM",
    slug: "kegiatan-hr-national-conference-kkusb-menjadi-jadwal-tuan-rumah-pertemuan-gdm-sdm",
    category: "Pengumuman",
    categorySlug: "pengumuman",
    date: "14 Mei 2025",
    author: "Humas KKUSB",
    readTime: "3 menit baca",
    excerpt: "KKUSB dipercaya menjadi tuan rumah penyelenggaraan forum pertemuan profesional SDM industri untuk membahas kesejahteraan pekerja dan regulasi ketenagakerjaan terkini.",
    content: [
      "Sebuah kehormatan besar bagi KKUSB ditunjuk sebagai tuan rumah pertemuan forum General Discussion Meeting (GDM) Bidang Sumber Daya Manusia tingkat regional Jawa Timur.",
      "Pertemuan ini mendiskusikan implementasi perlindungan ketenagakerjaan, peran koperasi karyawan dalam menyokong daya beli pekerja di era inflasi, serta sinergi manajemen perusahaan dengan serikat pekerja.",
      "Forum mengapresiasi model bisnis KKUSB yang terbukti mandiri dan mampu memberikan nilai tambah nyata bagi ribuan tenaga kerja institusi mitra."
    ],
    featuredImage: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=1200&auto=format&fit=crop",
    tags: ["HR Conference", "GDM SDM", "Pengumuman", "Kesejahteraan Pekerja"]
  }
]

export const JOB_VACANCIES = [
  {
    id: "job-1",
    title: "Staff Operasional Retail (USB Mart)",
    slug: "staff-operasional-retail",
    department: "Divisi Retail & Komersial",
    location: "Gresik / Tuban",
    type: "Full-Time",
    postedDate: "Maret 2026",
    deadline: "30 April 2026",
    description: "Bertanggung jawab atas pengelolaan operasional gerai USB Mart, penataan pajangan barang (planogram), pelayanan kasir ramah, dan rekonsiliasi stok harian.",
    requirements: [
      "Pendidikan minimal SMA/SMK sederajat",
      "Usia maksimal 28 tahun",
      "Berpengalaman minimal 1 tahun di bidang retail/minimarket (fresh graduate dipersilakan)",
      "Mampu mengoperasikan mesin kasir POS dan komputer dasar",
      "Jujur, teliti, berpenampilan rapi, dan komunikatif",
      "Bersedia bekerja dalam sistem shift"
    ]
  },
  {
    id: "job-2",
    title: "Staff Administrasi & Keuangan Koperasi",
    slug: "staff-administrasi-keuangan",
    department: "USPPS & Keuangan",
    location: "Kantor Pusat KKUSB Gresik",
    type: "Full-Time",
    postedDate: "Maret 2026",
    deadline: "25 April 2026",
    description: "Melakukan pencatatan transaksi simpan pinjam anggota, rekonsiliasi faktur pembelian unit usaha, serta penyusunan draf laporan keuangan bulanan.",
    requirements: [
      "Pendidikan D3/S1 Akuntansi, Manajemen Keuangan, atau Perbankan Syariah",
      "Memahami dasar-dasar akuntansi dan perpajakan dasar",
      "Mahir Microsoft Excel (VLOOKUP, Pivot Table, IF functions)",
      "Teliti dalam memeriksa bukti transaksi dan dokumen legalitas",
      "Memiliki integritas tinggi dan mampu menjaga kerahasiaan data anggota"
    ]
  },
  {
    id: "job-3",
    title: "Mekanik Armada & Kendaraan (Bengkel Simetris)",
    slug: "mekanik-armada-kendaraan",
    department: "Bengkel Simetris",
    location: "Gresik",
    type: "Full-Time",
    postedDate: "Februari 2026",
    deadline: "15 Mei 2026",
    description: "Melakukan servis berkala, perbaikan sistem transmisi, kelistrikan, rem, serta pemeliharaan preventif kendaraan operasional niaga dan mobil dinas.",
    requirements: [
      "Pendidikan SMK Teknik Kendaraan Ringan (TKR) atau Otomotif",
      "Pengalaman kerja mekanik minimal 2 tahun di bengkel resmi/umum",
      "Memahami mesin bensin dan diesel (terutama armada komersial ringan)",
      "Mampu menggunakan scanner diagnosis kendaraan terkini",
      "Disiplin, mengutamakan keselamatan kerja (K3), dan berorientasi solusi"
    ]
  }
]
