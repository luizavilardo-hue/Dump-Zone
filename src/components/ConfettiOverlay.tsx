import { useEffect, useState } from 'react'
import ReactConfetti from 'react-confetti'
import { motion, AnimatePresence } from 'framer-motion'
import useSound from 'use-sound'

interface ConfettiOverlayProps {
  show: boolean
  onDone: () => void
}

const PALETTE_COLORS = [
  '#D4A017', // mustard
  '#C8F400', // lime
  '#FF3D7F', // hot-pink
  '#0066FF', // electric-blue
  '#F5F0E8', // cream
  '#4A5E3A', // green-moss
]

export default function ConfettiOverlay({ show, onDone }: ConfettiOverlayProps) {
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight })
  const [playFanfare] = useSound('/sounds/fanfare.wav', { volume: 0.6 })

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (show) {
      playFanfare()
      const timer = setTimeout(onDone, 4000)
      return () => clearTimeout(timer)
    }
  }, [show, onDone, playFanfare])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 flex items-center justify-center pointer-events-none"
          style={{ zIndex: 10000 }}
        >
          <ReactConfetti
            width={windowSize.width}
            height={windowSize.height}
            colors={PALETTE_COLORS}
            numberOfPieces={300}
            gravity={0.3}
            recycle={false}
            tweenDuration={4000}
          />

          <motion.div
            initial={{ scale: 0.3, rotate: -10 }}
            animate={{ scale: 1, rotate: [0, -3, 3, -2, 2, 0] }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{
              scale: { type: 'spring', stiffness: 400, damping: 20 },
              rotate: { duration: 0.5, delay: 0.3 },
            }}
            className="text-center px-10 py-8 rounded-2xl"
            style={{
              background: 'var(--brown-dark)',
              border: '3px solid var(--mustard)',
              boxShadow: '8px 8px 0 var(--mustard)',
              pointerEvents: 'none',
            }}
          >
            <div className="text-6xl mb-3">🚽</div>
            <h1
              className="text-5xl font-extrabold"
              style={{
                fontFamily: 'Syne, sans-serif',
                fontWeight: 800,
                color: 'var(--lime)',
                textShadow: '3px 3px 0 var(--brown-mid)',
                letterSpacing: '-0.02em',
              }}
            >
              FLUSHED!
            </h1>
            <p
              className="mt-2 text-lg"
              style={{
                fontFamily: 'Caveat, cursive',
                color: 'var(--cream)',
                opacity: 0.8,
              }}
            >
              inbox zero alcançado 🎉
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
