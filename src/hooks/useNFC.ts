import { useState, useCallback, useRef } from 'react'

interface UseNFCOptions {
  onTap: () => void
}

export function useNFC({ onTap }: UseNFCOptions) {
  const [isSimulating, setIsSimulating] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const simulateTap = useCallback(() => {
    if (isSimulating) return
    setIsSimulating(true)

    onTap()

    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      setIsSimulating(false)
    }, 2000)
  }, [isSimulating, onTap])

  return { isSimulating, simulateTap }
}
