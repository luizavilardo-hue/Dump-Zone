import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useSound from 'use-sound'
import { useNFC } from '../hooks/useNFC'

interface NFCSimulatorProps {
  onTap: () => void
}

export default function NFCSimulator({ onTap }: NFCSimulatorProps) {
  const [showXP, setShowXP] = useState(false)
  const [playNFC] = useSound('/sounds/nfc.wav', { volume: 0.6 })

  const handleTap = () => {
    onTap()
    setShowXP(true)
    setTimeout(() => setShowXP(false), 2000)
  }

  const { isSimulating, simulateTap } = useNFC({
    onTap: () => {
      playNFC()
      handleTap()
    },
  })

  return (
    <div
      className="dump-card flex flex-col items-center justify-center gap-4 h-full relative overflow-hidden"
      style={{ padding: '1.5rem', minHeight: '140px' }}
    >
      {/* Ring animations when simulating */}
      <AnimatePresence>
        {isSimulating && (
          <>
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                initial={{ scale: 0.3, opacity: 0.8 }}
                animate={{ scale: 2.5, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, delay: i * 0.2, ease: 'easeOut' }}
                className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{ border: '2px solid var(--electric-blue)' }}
              />
            ))}
          </>
        )}
      </AnimatePresence>

      {/* XP floating notification */}
      <AnimatePresence>
        {showXP && (
          <motion.div
            initial={{ opacity: 0, y: 0, scale: 0.8 }}
            animate={{ opacity: 1, y: -40, scale: 1 }}
            exit={{ opacity: 0, y: -70, scale: 0.8 }}
            transition={{ duration: 0.5 }}
            className="absolute top-4 right-4 font-bold px-3 py-1 rounded-lg z-10"
            style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 800,
              backgroundColor: 'var(--lime)',
              color: 'var(--brown-dark)',
              border: '2px solid var(--brown-dark)',
              boxShadow: '3px 3px 0 var(--brown-dark)',
              pointerEvents: 'none',
            }}
          >
            +10 XP ✨
          </motion.div>
        )}
      </AnimatePresence>

      <span
        className="text-xs font-bold uppercase tracking-widest text-center"
        style={{ fontFamily: 'Space Mono, monospace', color: 'var(--brown-mid)' }}
      >
        NFC DEMO
      </span>

      <motion.button
        onClick={simulateTap}
        whileHover={{ scale: 1.05, boxShadow: '6px 6px 0 var(--brown-dark)' }}
        whileTap={{ scale: 0.95 }}
        animate={isSimulating ? { rotate: [0, -5, 5, -5, 5, 0] } : { rotate: 0 }}
        transition={isSimulating ? { duration: 0.5 } : { type: 'spring' }}
        className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm uppercase tracking-wider"
        style={{
          fontFamily: 'Syne, sans-serif',
          fontWeight: 800,
          backgroundColor: 'var(--electric-blue)',
          color: 'white',
          border: '2px solid var(--brown-dark)',
          boxShadow: '4px 4px 0 var(--brown-dark)',
          cursor: isSimulating ? 'default' : 'pointer',
        }}
        disabled={isSimulating}
      >
        <span className="text-lg">📲</span>
        Simular NFC Tap
      </motion.button>

      <p
        className="text-center text-xs opacity-60"
        style={{ fontFamily: 'Caveat, cursive', color: 'var(--brown-mid)', fontSize: '0.95rem' }}
      >
        toca no telemóvel para dumpar
      </p>
    </div>
  )
}
