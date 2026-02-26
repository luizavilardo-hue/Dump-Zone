import { AnimatePresence, motion } from 'framer-motion'
import { Droppable } from '@hello-pangea/dnd'
import type { DumpItem as DumpItemType } from '../lib/supabase'
import DumpItem from './DumpItem'

interface DumpListProps {
  items: DumpItemType[]
  onComplete: (id: string) => void
  onReorder: (items: DumpItemType[]) => void
  isLoading: boolean
}

export default function DumpList({ items, onComplete, isLoading }: DumpListProps) {
  return (
    <div
      className="dump-card flex flex-col h-full"
      style={{ padding: '1.5rem' }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2
          className="text-lg font-extrabold uppercase tracking-widest"
          style={{ fontFamily: 'Syne, sans-serif', color: 'var(--brown-dark)' }}
        >
          INBOX
        </h2>
        <span
          className="text-xs px-3 py-1 rounded-full font-bold"
          style={{
            fontFamily: 'Space Mono, monospace',
            backgroundColor: items.length > 0 ? 'var(--hot-pink)' : 'var(--lime)',
            color: 'var(--brown-dark)',
            border: '2px solid var(--brown-dark)',
          }}
        >
          {items.length} items
        </span>
      </div>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <span
            className="text-sm animate-pulse"
            style={{ fontFamily: 'Caveat, cursive', color: 'var(--brown-mid)', fontSize: '1.2rem' }}
          >
            a carregar...
          </span>
        </div>
      ) : items.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 flex flex-col items-center justify-center gap-2"
        >
          <span className="text-4xl">✨</span>
          <p
            className="text-center"
            style={{ fontFamily: 'Caveat, cursive', color: 'var(--brown-mid)', fontSize: '1.4rem' }}
          >
            inbox limpa!
          </p>
          <p
            className="text-xs text-center"
            style={{ fontFamily: 'Space Mono, monospace', color: 'var(--brown-light)' }}
          >
            arrasta itens para o 🔥 incinerar
          </p>
        </motion.div>
      ) : (
        <Droppable droppableId="dump-list">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="flex-1 flex flex-col gap-2 overflow-y-auto pr-1"
              style={{ minHeight: 0 }}
            >
              <AnimatePresence mode="popLayout">
                {items.map((item, index) => (
                  <DumpItem
                    key={item.id}
                    item={item}
                    index={index}
                    onComplete={onComplete}
                  />
                ))}
              </AnimatePresence>
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      )}
    </div>
  )
}
