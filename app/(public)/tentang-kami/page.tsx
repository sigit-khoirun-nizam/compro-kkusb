import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { 
  ShieldCheck, 
  Target, 
  Award, 
  Users, 
  History, 
  CheckCircle2, 
  Building2, 
  ChevronRight, 
  Scale, 
  Briefcase,
  MapPin,
  Clock,
  Sparkles,
  BookOpen
} from 'lucide-react'
import { KKUSB_PROFILE } from '@/lib/data/kkusb-data'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Tentang Kami — Profil Koperasi, Visi Misi & Tata Kelola',
  description: 'Mengenal Koperasi Jasa Karyawan Usaha Sejahtera Bersama (KKUSB). Profil resmi, visi misi, sejarah pendirian 2010, struktur organisasi, dan pedoman tata kelola GCG.',
}

const milestones = [
  {
    year: "2010",
    title: "Pendirian Resmi Koperasi",
    desc: "KKUSB resmi didirikan berdasarkan kesepakatan karyawan dan disahkan dengan Badan Hukum No. 518/01/BH/437.58/2010 di Kabupaten Gresik dengan fokus awal layanan simpan pinjam anggota."
  },
  {
    year: "2014",
    title: "Ekspansi Unit Retail & Perdagangan",
    desc: "Mendirikan gerai minimarket USB Mart pertama di kawasan perkantoran Kartini Gresik guna menyediakan sembako dan kebutuhan harian keluarga anggota dengan sistem potong gaji."
  },
  {
    year: "2018",
    title: "Pengembangan Jaringan Tuban & Rembang",
    desc: "Memperluas layanan operasional ke wilayah Tuban dan Rembang dengan membuka cabang gerai USB Mart dan unit penyedia suku cadang USB Part untuk mendukung operasional pabrik mitra."
  },
  {
    year: "2021",
    title: "Diversifikasi Tour & Travel serta Bengkel",
    desc: "Merambah sektor mobilitas dan jasa teknik dengan meluncurkan KKUSB Tour & Travel untuk perjalanan dinas dan umroh, serta Bengkel Simetris untuk pemeliharaan armada kendaraan niaga."
  },
  {
    year: "2024",
    title: "Penguatan USPPS & Sistem Digital",
    desc: "Transformasi layanan simpan pinjam menjadi USPPS berprinsip syariah terpadu dan modernisasi sistem pelaporan keuangan digital real-time."
  },
  {
    year: "2026",
    title: "Sinergi Korporasi Menuju Koperasi Modern",
    desc: "Memantapkan langkah sebagai mitra strategis korporasi industri nasional, memperkuat tata kelola Good Corporate Governance, dan memaksimalkan nilai Sisa Hasil Usaha (SHU) anggota."
  }
]

const orgStructure = [
  {
    role: "Kekuasaan Tertinggi",
    title: "Rapat Anggota Tahunan (RAT)",
    desc: "Forum kedaulatan tertinggi seluruh anggota aktif untuk menetapkan kebijakan umum, anggaran dasar, dan pertanggungjawaban tahunan."
  },
  {
    role: "Badan Pengawas",
    title: "Dewan Pengawas Koperasi",
    desc: "Bertugas mengawasi pelaksanaan kebijakan, memeriksa pengelolaan keuangan secara berkala, dan memberikan rekomendasi independen."
  },
  {
    role: "Badan Pengurus",
    title: "Dewan Pengurus KKUSB",
    desc: "Terdiri dari Ketua, Sekretaris, dan Bendahara yang memimpin pelaksanaan program kerja dan mewakili koperasi secara hukum."
  },
  {
    role: "Manajemen Eksekutif",
    title: "Manajer Operasional & Kepala Unit",
    desc: "Para profesional yang mengelola operasional harian 6 unit usaha: Pemasaran, USPPS Syariah, Retail USB Mart, Tour & Travel, Bengkel, dan Kantin."
  }
]

export default function TentangKamiPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 selection:bg-[#079B49]/20 selection:text-[#075C35]">
      
      {/* 1. HERO HEADER (Slalom/Deloitte Corporate Standard) */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-16 lg:pb-20 border-b border-zinc-200 dark:border-zinc-800 bg-[#F6F8F6]/80 dark:bg-zinc-900/40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-zinc-500 mb-6">
            <Link href="/" className="hover:text-[#079B49] transition-colors">Beranda</Link>
            <ChevronRight className="h-3.5 w-3.5 text-zinc-400" />
            <span className="text-zinc-900 dark:text-zinc-100 font-semibold">Tentang Kami</span>
          </nav>

          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#079B49]">
              Profil Perusahaan & Koperasi
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 leading-tight">
              Mengenal KKUSB Lebih Dekat
            </h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed font-light">
              Koperasi Jasa Karyawan Usaha Sejahtera Bersama berdedikasi membangun kemandirian finansial anggota, mengelola unit bisnis terpercaya, dan menjadi mitra industri handal di Jawa Timur dan Indonesia.
            </p>
          </div>

          {/* Quick Anchor Navigation */}
          <div className="mt-10 flex flex-wrap gap-2 pt-6 border-t border-zinc-200 dark:border-zinc-800 text-xs font-semibold">
            {[
              { href: "#profil", label: "Profil Koperasi" },
              { href: "#visi-misi", label: "Visi & Misi" },
              { href: "#sejarah", label: "Sejarah KKUSB" },
              { href: "#struktur", label: "Struktur Organisasi" },
              { href: "#tata-kelola", label: "Tata Kelola & Nilai" },
            ].map((anchor) => (
              <a
                key={anchor.href}
                href={anchor.href}
                className="px-4 py-2 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-[#079B49] hover:text-[#079B49] transition-colors shadow-sm"
              >
                {anchor.label}
              </a>
            ))}
          </div>

        </div>
      </section>

      {/* 2. PROFIL KOPERASI (#profil) */}
      <section id="profil" className="py-20 lg:py-28 scroll-mt-24 border-b border-zinc-100 dark:border-zinc-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 dark:bg-green-950/50 text-xs font-bold text-[#079B49]">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Identitas & Legalitas Resmi</span>
              </div>

              <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
                Pondasi Kuat Koperasi Karyawan Terpercaya
              </h2>

              <div className="space-y-4 text-base text-zinc-600 dark:text-zinc-300 leading-relaxed font-light">
                <p>
                  <strong>Koperasi Jasa Karyawan Usaha Sejahtera Bersama (KKUSB)</strong> merupakan badan usaha berbadan hukum yang didirikan atas dasar kesepakatan gotong royong antar karyawan institusi. Sejak disahkan secara resmi pada tahun 2010, KKUSB memegang teguh jati diri perkoperasian Indonesia dengan menempatkan kesejahteraan anggota sebagai prioritas sentral.
                </p>
                <p>
                  Dalam operasionalnya, KKUSB menggabungkan nilai-nilai kekeluargaan dengan standar profesionalisme korporasi modern. Pengelolaan dana simpan pinjam anggota dijalankan dengan prinsip kehati-hatian (prudent), sementara unit usaha komersial dikelola secara produktif guna menghasilkan nilai tambah dan Sisa Hasil Usaha (SHU) yang berkesinambungan.
                </p>
              </div>

              {/* Legal Credential Box */}
              <div className="p-5 rounded-2xl bg-[#F6F8F6] dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-3">
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Keterangan Legalitas & Kantor</h4>
                <div className="grid sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-zinc-500 block">Nomor Badan Hukum:</span>
                    <strong className="text-zinc-900 dark:text-zinc-100">{KKUSB_PROFILE.legalNumber}</strong>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Domisili Hukum:</span>
                    <strong className="text-zinc-900 dark:text-zinc-100">Kabupaten Gresik, Jawa Timur</strong>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Tahun Berdiri:</span>
                    <strong className="text-zinc-900 dark:text-zinc-100">Tahun 2010 (15+ Tahun Beroperasi)</strong>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Slogan Resmi:</span>
                    <strong className="text-[#079B49]">"{KKUSB_PROFILE.slogan}"</strong>
                  </div>
                </div>
              </div>

            </div>

            <div className="lg:col-span-5 relative">
              <div className="rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-xl aspect-[4/3] bg-zinc-100 dark:bg-zinc-900">
                <img 
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1200&auto=format&fit=crop" 
                  alt="Aktivitas Koperasi KKUSB"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="mt-4 p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-between text-xs text-zinc-600 dark:text-zinc-400">
                <span className="flex items-center gap-1.5 font-medium">
                  <MapPin className="h-4 w-4 text-[#079B49]" />
                  Kantor Pusat: Ruko Kartini Megah Blok A3 Gresik
                </span>
                <Link href="/kontak" className="text-[#079B49] font-bold hover:underline">
                  Peta Lokasi &rarr;
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. VISI DAN MISI (#visi-misi) */}
      <section id="visi-misi" className="py-20 lg:py-28 scroll-mt-24 bg-[#F6F8F6]/80 dark:bg-zinc-900/30 border-b border-zinc-200/80 dark:border-zinc-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#079B49]">
              Landasan & Komitmen
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
              Visi dan Misi Organisasi
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Arah pandang jangka panjang dan rencana strategis KKUSB dalam menyejahterakan anggota dan memberikan nilai bagi mitra.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Visi (5 cols) */}
            <div className="lg:col-span-5 p-8 lg:p-10 rounded-3xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-2xl bg-green-100 dark:bg-green-950/60 text-[#079B49] flex items-center justify-center">
                  <Target className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                  Visi KKUSB
                </h3>
                <blockquote className="text-base sm:text-lg text-zinc-700 dark:text-zinc-300 leading-relaxed font-normal border-l-4 border-[#079B49] pl-4 italic">
                  "{KKUSB_PROFILE.vision}"
                </blockquote>
              </div>

              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 text-xs text-zinc-500">
                Ditetapkan secara mufakat dalam Musyawarah Rapat Anggota Tahunan.
              </div>
            </div>

            {/* Misi (7 cols) */}
            <div className="lg:col-span-7 p-8 lg:p-10 rounded-3xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-green-100 dark:bg-green-950/60 text-[#079B49] flex items-center justify-center">
                  <Award className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                    Misi Koperasi
                  </h3>
                  <p className="text-xs text-zinc-500">5 pilar aksi nyata pengurus dan manajemen</p>
                </div>
              </div>

              <div className="space-y-3.5">
                {KKUSB_PROFILE.mission.map((misi, i) => (
                  <div key={i} className="flex items-start gap-3.5 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-100 dark:border-zinc-800">
                    <span className="h-6 w-6 rounded-full bg-[#079B49] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                      {misi}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 4. SEJARAH KKUSB (#sejarah) */}
      <section id="sejarah" className="py-20 lg:py-28 scroll-mt-24 border-b border-zinc-100 dark:border-zinc-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl space-y-12">
          
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#079B49]">
              Jejak Langkah & Dedikasi
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
              Sejarah Perkembangan KKUSB
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Perjalanan pertumbuhan koperasi dari simpan pinjam sederhana hingga menjadi korporasi berbadan hukum mandiri.
            </p>
          </div>

          {/* Timeline */}
          <div className="relative pl-6 sm:pl-8 border-l-2 border-[#079B49]/30 space-y-10 ml-2 sm:ml-4">
            {milestones.map((item, idx) => (
              <div key={idx} className="relative group">
                {/* Dot */}
                <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 h-4 w-4 rounded-full border-4 border-white dark:border-zinc-950 bg-[#079B49] group-hover:scale-125 transition-transform" />
                
                <div className="space-y-1.5 bg-[#F6F8F6] dark:bg-zinc-900/40 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                  <span className="text-xs font-bold text-[#079B49] bg-green-100/70 dark:bg-green-950/70 px-2.5 py-1 rounded-full">
                    {item.year}
                  </span>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 pt-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-light">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. STRUKTUR ORGANISASI (#struktur) */}
      <section id="struktur" className="py-20 lg:py-28 scroll-mt-24 bg-[#F6F8F6]/80 dark:bg-zinc-900/30 border-b border-zinc-200/80 dark:border-zinc-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#079B49]">
              Tata Susunan Organisasi
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
              Struktur Kepengurusan & Manajemen
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Sistem berjenjang akuntabel yang memisahkan fungsi pengawasan, kepengurusan, dan pelaksanaan operasional bisnis.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {orgStructure.map((org, i) => (
              <div 
                key={i}
                className="p-6 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-[#079B49] uppercase tracking-wider block">
                    {org.role}
                  </span>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                    {org.title}
                  </h3>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-light">
                    {org.desc}
                  </p>
                </div>
                <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 text-[11px] text-zinc-400">
                  Amanat RAT & Kepatuhan GCG
                </div>
              </div>
            ))}
          </div>

          {/* Verification note */}
          <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500 text-center max-w-3xl mx-auto">
            <em>Daftar nama resmi susunan pengurus periode berjalan disahkan dalam Berita Acara Rapat Anggota Tahunan dan dapat diakses oleh anggota terdaftar melalui sekretariat KKUSB.</em>
          </div>

        </div>
      </section>

      {/* 6. TATA KELOLA & NILAI PERUSAHAAN (#tata-kelola) */}
      <section id="tata-kelola" className="py-20 lg:py-28 scroll-mt-24 border-b border-zinc-100 dark:border-zinc-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#079B49]">
              Good Corporate Governance (GCG)
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
              Tata Kelola dan Nilai Koperasi
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Menjalankan organisasi dengan standar etika tertinggi demi melindungi kepentingan anggota dan mitra institusi.
            </p>
          </div>

          {/* 5 GCG Pillars */}
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
            {KKUSB_PROFILE.governancePillars.map((pillar, i) => (
              <div 
                key={i}
                className="p-5 rounded-2xl bg-[#F6F8F6] dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-2"
              >
                <div className="h-8 w-8 rounded-lg bg-green-100 dark:bg-green-950 text-[#079B49] flex items-center justify-center font-bold text-xs">
                  0{i+1}
                </div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  {pillar.title}
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-light">
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>

          {/* 4 Cultural Values */}
          <div className="mt-8 p-8 rounded-3xl bg-[#075C35] text-white space-y-6">
            <div className="max-w-2xl space-y-2">
              <span className="text-xs font-bold text-[#F4C430] uppercase tracking-widest">Budaya Kerja Organisasi</span>
              <h3 className="text-2xl font-bold">4 Nilai Budaya KKUSB</h3>
              <p className="text-xs text-white/80">Pedoman perilaku setiap staf dan pengurus dalam melayani anggota dan menyelesaikan pekerjaan.</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {KKUSB_PROFILE.values.map((v, i) => (
                <div key={i} className="p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 space-y-1.5">
                  <span className="text-xs font-black tracking-wider text-[#F4C430]">{v.code}</span>
                  <h4 className="text-sm font-bold text-white">{v.title}</h4>
                  <p className="text-xs text-white/70 leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center pt-4">
            <Button asChild size="lg" className="bg-[#079B49] hover:bg-[#075C35] text-white rounded-full">
              <Link href="/unit-usaha">
                Jelajahi Portofolio Unit Usaha KKUSB &rarr;
              </Link>
            </Button>
          </div>

        </div>
      </section>

    </div>
  )
}
