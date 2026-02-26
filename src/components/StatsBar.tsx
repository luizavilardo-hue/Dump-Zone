import { motion } from 'framer-motion'
import type { UserStats } from '../lib/supabase'
import { calcLevel, xpForLevel, xpForNextLevel } from '../hooks/useGameState'
import { supabase } from '../lib/supabase'

interface StatsBarProps {
  stats: UserStats | null | undefined
}

export default function StatsBar({ stats }: StatsBarProps) {
  const currentXP = stats?.current_xp ?? 0
  const level = calcLevel(currentXP)
  const levelStartXP = xpForLevel(level)
  const nextLevelXP = xpForNextLevel(level)
  const xpInLevel = currentXP - levelStartXP
  const xpNeeded = nextLevelXP - levelStartXP
  const progress = Math.min(xpInLevel / xpNeeded, 1)
  const streak = stats?.streak_count ?? 0

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <div
      className="dump-card flex items-center gap-4 px-5 py-3"
      style={{ backgroundColor: 'var(--brown-dark)' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-2xl">💩</span>
        <span
          className="text-base font-extrabold tracking-tight hidden sm:block"
          style={{ fontFamily: 'Syne, sans-serif', color: 'var(--cream)', fontWeight: 800 }}
        >
          DUMP ZONE
        </span>
      </div>

      {/* Divider */}
      <div className="w-px h-6 shrink-0" style={{ backgroundColor: 'var(--brown-mid)' }} />

      {/* Level */}
      <div className="flex items-center gap-2 shrink-0">
        <span
          className="text-xs font-bold"
          style={{ fontFamily: 'Space Mono, monospace', color: 'var(--mustard)' }}
        >
          LVL
        </span>
        <motion.span
          key={level}
          initial={{ scale: 1.5, color: '#C8F400' }}
          animate={{ scale: 1, color: '#F5F0E8' }}
          className="text-xl font-bold"
          style={{ fontFamily: 'Syne, sans-serif', color: 'var(--cream)', fontWeight: 800 }}
        >
          {level}
        </motion.span>
      </div>

      {/* XP Bar */}
      <div className="flex-1 flex flex-col gap-1 min-w-0">
        <div className="flex justify-between items-center">
          <span
            className="text-xs"
            style={{ fontFamily: 'Space Mono, monospace', color: 'var(--cream)', opacity: 0.6 }}
          >
            {currentXP.toLocaleString()} XP
          </span>
          <span
            className="text-xs"
            style={{ fontFamily: 'Space Mono, monospace', color: 'var(--cream)', opacity: 0.4 }}
          >
            {nextLevelXP.toLocaleString()} XP
          </span>
        </div>

        <div className="xp-bar-container" style={{ height: '14px' }}>
          <motion.div
            className="xp-bar-fill"
            style={{ width: `${progress * 100}%`, height: '100%' }}
            animate={{ width: `${progress * 100}%` }}
            transition={{ type: 'spring', stiffness: 200, damping: 30 }}
          />
          <div className="xp-bar-gloss" />
        </div>
      </div>

      {/* Streak */}
      <div className="flex items-center gap-1 shrink-0">
        <span className="text-base">🔥</span>
        <span
          className="text-sm font-bold"
          style={{ fontFamily: 'Space Mono, monospace', color: 'var(--mustard)' }}
        >
          {streak}
        </span>
        <span
          className="text-xs hidden sm:block"
          style={{ fontFamily: 'Space Mono, monospace', color: 'var(--cream)', opacity: 0.5 }}
        >
          dias
        </span>
      </div>

      {/* Divider */}
      <div className="w-px h-6 shrink-0" style={{ backgroundColor: 'var(--brown-mid)' }} />

      {/* Sign out */}
      <motion.button
        onClick={handleSignOut}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="text-xs px-3 py-1 rounded-lg shrink-0"
        style={{
          fontFamily: 'Space Mono, monospace',
          color: 'var(--cream)',
          border: '1px solid var(--brown-mid)',
          backgroundColor: 'transparent',
          cursor: 'pointer',
          opacity: 0.6,
        }}
        title="Sair"
      >
        sair
      </motion.button>
    </div>
  )
}
