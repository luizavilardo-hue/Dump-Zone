import { useState, useRef, forwardRef, useImperativeHandle } from 'react'
import { motion } from 'framer-motion'
import useSound from 'use-sound'

interface DumpInputProps {
  onSubmit: (content: string) => void
  disabled?: boolean
}

export interface DumpInputHandle {
  focus: () => void
}

const DumpInput = forwardRef<DumpInputHandle, DumpInputProps>(
  ({ onSubmit, disabled }, ref) => {
    const [value, setValue] = useState('')
    const [isFocused, setIsFocused] = useState(false)
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    const [playPop] = useSound('/sounds/pop.wav', { volume: 0.5 })

    useImperativeHandle(ref, () => ({
      focus: () => {
        textareaRef.current?.focus()
      },
    }))

    const handleSubmit = () => {
      const trimmed = value.trim()
      if (!trimmed || disabled) return
      playPop()
      onSubmit(trimmed)
      setValue('')
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSubmit()
      }
    }

    return (
      <motion.div
        className="dump-card flex flex-col h-full"
        style={{ backgroundColor: 'var(--cream)', padding: '1.5rem' }}
        animate={isFocused ? { boxShadow: '6px 6px 0 var(--brown-dark)' } : { boxShadow: '4px 4px 0 var(--brown-dark)' }}
        transition={{ duration: 0.15 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">💩</span>
          <h2
            className="text-lg font-extrabold uppercase tracking-widest"
            style={{ fontFamily: 'Syne, sans-serif', color: 'var(--brown-dark)' }}
          >
            DUMP IT
          </h2>
          <span
            className="ml-auto text-xs"
            style={{ fontFamily: 'Caveat, cursive', color: 'var(--brown-mid)', fontSize: '1rem' }}
          >
            shift+enter = nova linha
          </span>
        </div>

        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="despeja aqui... só prime Enter"
          disabled={disabled}
          className="flex-1 w-full resize-none outline-none bg-transparent text-lg leading-relaxed"
          style={{
            fontFamily: 'Space Mono, monospace',
            color: 'var(--brown-dark)',
            minHeight: '160px',
          }}
        />

        <div className="flex items-center justify-between mt-4 pt-4" style={{ borderTop: '1px dashed var(--brown-light)' }}>
          <span
            className="text-xs"
            style={{ fontFamily: 'Space Mono, monospace', color: 'var(--brown-light)' }}
          >
            {value.length} chars
          </span>

          <motion.button
            onClick={handleSubmit}
            disabled={!value.trim() || disabled}
            whileHover={value.trim() ? { scale: 1.05, boxShadow: '6px 6px 0 var(--brown-dark)' } : {}}
            whileTap={value.trim() ? { scale: 0.95 } : {}}
            className="px-6 py-2 rounded-xl text-sm font-bold uppercase tracking-widest transition-all"
            style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 800,
              backgroundColor: value.trim() ? 'var(--lime)' : 'var(--brown-light)',
              color: 'var(--brown-dark)',
              border: '2px solid var(--brown-dark)',
              boxShadow: '4px 4px 0 var(--brown-dark)',
              cursor: value.trim() ? 'pointer' : 'not-allowed',
              opacity: !value.trim() ? 0.5 : 1,
            }}
          >
            DUMP →
          </motion.button>
        </div>
      </motion.div>
    )
  }
)

DumpInput.displayName = 'DumpInput'

export default DumpInput
