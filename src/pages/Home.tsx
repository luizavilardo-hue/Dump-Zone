import { useRef, useState, useEffect, useCallback } from 'react'
import { DragDropContext } from '@hello-pangea/dnd'
import type { DropResult } from '@hello-pangea/dnd'
import useSound from 'use-sound'
import type { User } from '@supabase/supabase-js'
import { useItems } from '../hooks/useItems'
import { useGameState } from '../hooks/useGameState'
import DumpInput from '../components/DumpInput'
import type { DumpInputHandle } from '../components/DumpInput'
import DumpList from '../components/DumpList'
import Incinerator from '../components/Incinerator'
import StatsBar from '../components/StatsBar'
import NFCSimulator from '../components/NFCSimulator'
import ConfettiOverlay from '../components/ConfettiOverlay'
import type { DumpItem } from '../lib/supabase'

interface HomeProps {
  user: User
}

export default function Home({ user }: HomeProps) {
  const dumpInputRef = useRef<DumpInputHandle>(null)
  const [localItems, setLocalItems] = useState<DumpItem[]>([])
  const [showConfetti, setShowConfetti] = useState(false)
  const [hadItems, setHadItems] = useState(false)

  const [playCrumple] = useSound('/sounds/crumple.wav', { volume: 0.5 })

  const { items, isLoading, addItem, completeItem, incinerateItem } = useItems(user.id)
  const { stats, addXP } = useGameState(user.id)

  // Sync local items with remote
  useEffect(() => {
    setLocalItems(items)
  }, [items])

  // Track inbox zero
  useEffect(() => {
    if (localItems.length > 0) {
      setHadItems(true)
    } else if (hadItems && localItems.length === 0 && !isLoading) {
      setShowConfetti(true)
      setHadItems(false)
    }
  }, [localItems.length, hadItems, isLoading])

  const handleAddItem = useCallback(async (content: string) => {
    await addItem.mutateAsync(content)
    addXP.mutate(10)
  }, [addItem, addXP])

  const handleComplete = useCallback(async (id: string) => {
    const isCritical = Math.random() < 0.2
    const xpGain = isCritical ? 100 : 50
    await completeItem.mutateAsync(id)
    addXP.mutate(xpGain)
  }, [completeItem, addXP])

  const handleIncinerate = useCallback(async (id: string) => {
    playCrumple()
    await incinerateItem.mutateAsync(id)
  }, [incinerateItem, playCrumple])

  const handleDragEnd = useCallback((result: DropResult) => {
    if (!result.destination) return

    if (result.destination.droppableId === 'incinerator') {
      const item = localItems.find((i) => i.id === result.draggableId)
      if (item) {
        setLocalItems((prev) => prev.filter((i) => i.id !== item.id))
        handleIncinerate(item.id)
      }
      return
    }

    if (
      result.source.droppableId === 'dump-list' &&
      result.destination.droppableId === 'dump-list'
    ) {
      const newItems = Array.from(localItems)
      const [removed] = newItems.splice(result.source.index, 1)
      newItems.splice(result.destination.index, 0, removed)
      setLocalItems(newItems)
    }
  }, [localItems, handleIncinerate])

  const handleNFCTap = useCallback(() => {
    dumpInputRef.current?.focus()
    addXP.mutate(10)
  }, [addXP])

  return (
    <div
      style={{
        backgroundColor: 'var(--cream)',
        minHeight: '100vh',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
      }}
    >
      {/* Confetti overlay */}
      <ConfettiOverlay show={showConfetti} onDone={() => setShowConfetti(false)} />

      <DragDropContext onDragEnd={handleDragEnd}>

        {/* Stats Bar — full width top */}
        <StatsBar stats={stats} />

        {/* Bento Grid — desktop */}
        <div
          className="flex-1 bento-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gridTemplateRows: '1fr auto',
            gap: '0.75rem',
            minHeight: 0,
          }}
        >
          {/* DumpInput — col 1-2, row 1-2 */}
          <div style={{ gridColumn: '1 / 3', gridRow: '1 / 3', minHeight: '420px' }}>
            <DumpInput
              ref={dumpInputRef}
              onSubmit={handleAddItem}
              disabled={addItem.isPending}
            />
          </div>

          {/* DumpList — col 3-4, row 1 */}
          <div style={{ gridColumn: '3 / 5', gridRow: '1 / 2', minHeight: '280px' }}>
            <DumpList
              items={localItems}
              onComplete={handleComplete}
              onReorder={setLocalItems}
              isLoading={isLoading}
            />
          </div>

          {/* Incinerator — col 3, row 2 */}
          <div style={{ gridColumn: '3 / 4', gridRow: '2 / 3', minHeight: '140px' }}>
            <Incinerator />
          </div>

          {/* NFC Simulator — col 4, row 2 */}
          <div style={{ gridColumn: '4 / 5', gridRow: '2 / 3', minHeight: '140px' }}>
            <NFCSimulator onTap={handleNFCTap} />
          </div>
        </div>

      </DragDropContext>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .bento-grid {
            display: flex !important;
            flex-direction: column !important;
          }
          .bento-grid > div {
            min-height: auto !important;
          }
        }
      `}</style>
    </div>
  )
}
