'use client'

interface MapClientWrapperProps {
  embedUrl?: string
  siteName?: string
}

export default function MapClientWrapper({
  embedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d349.89700267863486!2d112.6475970074275!3d-7.168399000447001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd800411c2c35c3%3A0xa878af5169cb2240!2sKoperasi%20Karyawan%20Usaha%20Sejahtera%20Bersama!5e0!3m2!1sen!2sid!4v1791940906024!5m2!1sen!2sid",
  siteName = "KKUSB"
}: MapClientWrapperProps = {}) {
  return (
    <iframe
      src={embedUrl}
      width="100%"
      height="100%"
      style={{ border: 0 }}
      allowFullScreen
      loading="lazy"
      referrerPolicy="strict-origin-when-cross-origin"
      title={`Peta Lokasi Resmi ${siteName}`}
      className="w-full h-full min-h-[420px]"
    />
  )
}
