'use client'

import { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import type { Area } from 'react-easy-crop'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Check, Loader2, ZoomIn, ZoomOut } from 'lucide-react'

interface AvatarCropModalProps {
  imageSrc: string
  onCancel: () => void
  onSave: (croppedBlob: Blob) => void
  saving?: boolean
}

async function getCroppedImg(imageSrc: string, pixelCrop: Area): Promise<Blob> {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.addEventListener('load', () => resolve(img))
    img.addEventListener('error', reject)
    img.src = imageSrc
  })

  const canvas = document.createElement('canvas')
  const size = 400
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    size,
    size,
  )

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob)
      else reject(new Error('Canvas is empty'))
    }, 'image/jpeg', 0.92)
  })
}

export function AvatarCropModal({ imageSrc, onCancel, onSave, saving }: AvatarCropModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)

  const onCropComplete = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels)
  }, [])

  const handleSave = async () => {
    if (!croppedAreaPixels) return
    const blob = await getCroppedImg(imageSrc, croppedAreaPixels)
    onSave(blob)
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] flex items-center justify-center p-4"
        style={{ background: 'rgba(13,10,30,0.7)', backdropFilter: 'blur(4px)' }}
        onClick={onCancel}
      >
        <motion.div
          initial={{ scale: 0.93, opacity: 0, y: 16 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.93, opacity: 0, y: 16 }}
          transition={{ duration: 0.22 }}
          className="w-full max-w-sm rounded-3xl overflow-hidden"
          style={{ background: '#1a1830', boxShadow: '0 24px 80px rgba(0,0,0,0.5)' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
            <p className="font-semibold text-sm text-white">Ajustar foto</p>
            <button onClick={onCancel} className="p-1.5 rounded-full transition-colors cursor-pointer" style={{ color: 'rgba(255,255,255,0.5)' }} onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')} onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
              <X size={16} />
            </button>
          </div>

          {/* Crop area */}
          <div className="relative w-full" style={{ height: 320, background: '#0d0c1a' }}>
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              showGrid={false}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              style={{
                containerStyle: { background: '#0d0c1a' },
                cropAreaStyle: { borderColor: '#7B6FD0', boxShadow: '0 0 0 9999px rgba(13,12,26,0.7)' },
              }}
            />
          </div>

          {/* Zoom slider */}
          <div className="px-5 py-4 flex items-center gap-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <ZoomOut size={14} style={{ color: 'rgba(255,255,255,0.4)', flexShrink: 0 }} />
            <input
              type="range"
              min={1}
              max={3}
              step={0.05}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="flex-1 h-1 rounded-full appearance-none cursor-pointer"
              style={{ accentColor: '#7B6FD0', background: 'rgba(255,255,255,0.1)' }}
            />
            <ZoomIn size={14} style={{ color: 'rgba(255,255,255,0.4)', flexShrink: 0 }} />
          </div>

          {/* Actions */}
          <div className="flex gap-3 px-5 pb-5">
            <button
              onClick={onCancel}
              className="flex-1 py-3 rounded-2xl text-sm font-semibold cursor-pointer transition-colors"
              style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.14)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold text-white cursor-pointer transition-opacity disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #0D6EFD, #7B6FD0)' }}
            >
              {saving ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
              {saving ? 'Guardando…' : 'Guardar foto'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
