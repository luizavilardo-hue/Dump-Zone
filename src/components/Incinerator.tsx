import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Droppable } from '@hello-pangea/dnd'

export default function Incinerator() {
  const [isActive, setIsActive] = useState(false)

  return (
    <Droppable droppableId="incinerator">
      {(provided, snapshot) => {
        const isDraggingOver = snapshot.isDraggingOver

        if (isDraggingOver && !isActive) setIsActive(true)
        else if (!isDraggingOver && isActive) setIsActive(false)

        return (
          <motion.div
            ref={provided.innerRef}
            {...provided.droppableProps}
            animate={
              isDraggingOver
                ? {
                    scale: 1.05,
                    rotate: [0, -3, 3, -3, 3, 0],
                    boxShadow: '6px 6px 0 var(--hot-pink)',
                    borderColor: 'var(--hot-pink)',
                  }
                : {
                    scale: 1,
                    rotate: 0,
                    boxShadow: '4px 4px 0 var(--brown-dark)',
                  }
            }
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center gap-3 rounded-2xl h-full cursor-pointer select-none"
            style={{
              border: `2px dashed ${isDraggingOver ? 'var(--hot-pink)' : 'var(--hot-pink)'}`,
              borderRadius: '16px',
              backgroundColor: isDraggingOver ? 'rgba(255, 61, 127, 0.15)' : 'var(--brown-dark)',
              boxShadow: '4px 4px 0 var(--brown-dark)',
              minHeight: '140px',
              padding: '1.5rem',
            }}
          >
            <AnimatePresence mode="wait">
              {isDraggingOver ? (
                <motion.span
                  key="active"
                  initial={{ scale: 0.5, rotate: -20 }}
                  animate={{ scale: 1.3, rotate: [0, 10, -10, 10, 0] }}
                  exit={{ scale: 0.5 }}
                  transition={{ duration: 0.3, rotate: { repeat: Infinity, duration: 0.5 } }}
                  className="text-4xl"
                >
                  🔥
                </motion.span>
              ) : (
                <motion.span
                  key="idle"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="text-3xl"
                >
                  🔥
                </motion.span>
              )}
            </AnimatePresence>

            <span
              className="text-xs font-bold uppercase tracking-widest"
              style={{
                fontFamily: 'Syne, sans-serif',
                fontWeight: 800,
                color: isDraggingOver ? 'var(--hot-pink)' : 'var(--hot-pink)',
              }}
            >
              INCINERAR
            </span>

            {isDraggingOver && (
              <motion.span
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs"
                style={{ fontFamily: 'Caveat, cursive', color: 'var(--cream)', fontSize: '1rem' }}
              >
                larga aqui!
              </motion.span>
            )}

            {/* Hidden droppable placeholder */}
            <div style={{ display: 'none' }}>{provided.placeholder}</div>
          </motion.div>
        )
      }}
    </Droppable>
  )
}
