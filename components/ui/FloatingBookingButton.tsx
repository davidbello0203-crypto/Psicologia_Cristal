'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { CalendarPlus } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { BookingModal } from '@/components/dashboard/BookingModal'

export function FloatingBookingButton() {
  const { user } = useAuth()
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)

  const handleClick = () => {
    if (!user) {
      router.push('/registro')
      return
    }
    setShowModal(true)
  }

  return (
    <>
      <motion.button
        onClick={handleClick}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.4, type: 'spring', stiffness: 200 }}
        whileHover={{ scale: 1.08, y: -2 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-5 py-3.5 rounded-full shadow-lg cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
        style={{
          background: 'linear-gradient(135deg, #0D6EFD 0%, #9E94DF 100%)',
          boxShadow: '0 8px 30px rgba(13,110,253,0.4)',
        }}
        aria-label="Agendar cita"
      >
        <span
          className="absolute inset-0 rounded-full animate-ping opacity-20"
          style={{ background: '#0D6EFD' }}
          aria-hidden="true"
        />
        <CalendarPlus size={20} className="text-white relative z-10 flex-shrink-0" aria-hidden="true" />
        <span className="text-white text-sm font-semibold relative z-10 hidden sm:block">
          Agendar cita
        </span>
      </motion.button>

      <AnimatePresence>
        {showModal && (
          <BookingModal
            onClose={() => setShowModal(false)}
            onSuccess={() => setShowModal(false)}
            isFirstSession={false}
          />
        )}
      </AnimatePresence>
    </>
  )
}
