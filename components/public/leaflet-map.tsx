'use client'

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix missing marker icons in Leaflet for webpack/nextjs
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

interface LeafletMapProps {
  address?: string
  siteName?: string
  coordinates?: [number, number]
  googleMapsUrl?: string
}

export default function LeafletMap({
  address,
  siteName,
  coordinates,
  googleMapsUrl
}: LeafletMapProps = {}) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <div className="h-full w-full bg-zinc-100 dark:bg-zinc-800 animate-pulse" />

  // Accurate KKUSB Gresik coordinates: -7.1685528, 112.6477203
  const position: [number, number] = coordinates || [-7.1685528, 112.6477203]

  return (
    <MapContainer 
      center={position} 
      zoom={17} 
      scrollWheelZoom={false}
      style={{ height: '100%', width: '100%', zIndex: 0 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position}>
        <Popup>
          <div className="p-1.5 text-xs max-w-xs">
            <strong className="text-[#079B49] font-bold block text-sm">
              {siteName || 'Kantor Pusat KKUSB'}
            </strong>
            <span className="text-zinc-600 dark:text-zinc-400 leading-snug block mt-1">
              {address || 'Ruko Kartini Megah Blok A3, Jl. RA. Kartini No. 150-152, Kebomas, Gresik'}
            </span>
            {googleMapsUrl && (
              <a 
                href={googleMapsUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block mt-2 font-semibold text-[#079B49] hover:underline"
              >
                Buka di Google Maps &rarr;
              </a>
            )}
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  )
}
