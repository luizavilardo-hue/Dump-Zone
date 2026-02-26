import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Draggable } from '@hello-pangea/dnd'
import useSound from 'use-sound'
import type { DumpItem as DumpItemType } from '../lib/supabase'

interface DumpItemProps {
  item: DumpItemType
  index: number
  onComplete: (id: string) => void
}

export default function DumpItem({ item, index, onComplete }: DumpItemProps) {
  const [completing, setCompleting] = useState(false)
  const [isCritical, setIsCritical] = useState(false)

  const [playReward] = useSound('/sounds/reward.wav', { volume: 0.6 })
  const [playCritical] = useSound('/sounds/critical.wav', { volume: 0.7 })

  const handleComplete = () => {
    if (completing) return
    const crit = Math.random() < 0.2
    setIsCritical(crit)
    setCompleting(true)
    if (crit) playCritical()
    else playReward()
    setTimeout(() => onComplete(item.id), 500)
  }

  return (
    <Draggable draggableId={item.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            ...provided.draggableProps.style,
            border: `2px solid ${isCritical && completing ? 'var(--mustard)' : 'var(--brown-dark)'}`,
            borderRadius: '12px',
            boxShadow: snapshot.isDragging
              ? '6px 6px 0 var(--brown-dark)'
              : isCritical && completing
              ? '0 0 20px var(--mustard)'
              : '3px 3px 0 var(--brown-dark)',
            backgroundColor:
              isCritical && completing ? 'rgba(212, 160, 23, 0.15)' : 'var(--cream)',
            transform: snapshot.isDragging
              ? `${provided.draggableProps.style?.transform ?? ''} rotate(-2deg)`
              : provided.draggableProps.style?.transform,
            cursor: snapshot.isDragging ? 'grabbing' : 'grab',
            userSelect: 'none',
          }}
        >
          <motion.div
            layout
            initial={{ opacity: 0, scale: 0.8, y: -10 }}
            animate={
              completing
                ? isCritical
                  ? {
                      opacity: 0,
                      x: 80,
                      scale: 1.1,
                      filter: 'hue-rotate(45deg) brightness(1.5)',
                    }
                  : { opacity: 0, x: 80, scale: 0.9 }
                : { opacity: 1, scale: 1, y: 0 }
            }
            exit={{ opacity: 0, x: 80, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="flex items-center gap-3 px-4 py-3 group"
          >
            {/* Drag handle dots */}
            <div className="flex flex-col gap-1 opacity-30 group-hover:opacity-60 transition-opacity shrink-0">
              <div className="flex gap-1">
                <div className="w-1 h-1 rounded-full" style={{ backgroundColor: 'var(--brown-dark)' }} />
                <div className="w-1 h-1 rounded-full" style={{ backgroundColor: 'var(--brown-dark)' }} />
              </div>
              <div className="flex gap-1">
                <div className="w-1 h-1 rounded-full" style={{ backgroundColor: 'var(--brown-dark)' }} />
                <div className="w-1 h-1 rounded-full" style={{ backgroundColor: 'var(--brown-dark)' }} />
              </div>
            </div>

            {/* Content */}
            <p
              className="flex-1 text-sm leading-snug"
              style={{
                fontFamily: 'Space Mono, monospace',
                color: 'var(--brown-dark)',
                wordBreak: 'break-word',
              }}
            >
              {item.content}
            </p>

            {/* Critical badge */}
            <AnimatePresence>
              {isCritical && completing && (
                <motion.span
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0 }}
                  className="text-xs font-bold px-2 py-1 rounded-lg shrink-0"
                  style={{
                    backgroundColor: 'var(--mustard)',
                    color: 'var(--brown-dark)',
                    fontFamily: 'Syne, sans-serif',
                    border: '2px solid var(--brown-dark)',
                  }}
                >
                  ⭐ CRÍTICO!
                </motion.span>
              )}
            </AnimatePresence>

            {/* XP badge */}
            <span
              className="text-xs shrink-0 opacity-50"
              style={{ fontFamily: 'Space Mono, monospace', color: 'var(--brown-mid)' }}
            >
              +{item.xp_value}xp
            </span>

            {/* Complete button */}
            <motion.button
              onClick={handleComplete}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 transition-all"
              style={{
                border: '2px solid var(--brown-dark)',
                backgroundColor: completing ? 'var(--lime)' : 'transparent',
                cursor: 'pointer',
              }}
              title="Marcar como feito"
            >
              {completing ? '✓' : '○'}
            </motion.button>
          </motion.div>
        </div>
      )}
    </Draggable>
  )
}
