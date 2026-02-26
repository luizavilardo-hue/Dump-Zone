import { useEffect, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { User } from '@supabase/supabase-js'
import { supabase } from './lib/supabase'
import Home from './pages/Home'
import Auth from './pages/Auth'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 30,
      retry: 1,
    },
  },
})

function AppInner() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: 'var(--cream)' }}
      >
        <div className="text-center">
          <div className="text-5xl mb-4 animate-bounce">💩</div>
          <p
            style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 800,
              color: 'var(--brown-dark)',
              letterSpacing: '-0.02em',
            }}
          >
            a carregar...
          </p>
        </div>
      </div>
    )
  }

  return user ? <Home user={user} /> : <Auth />
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppInner />
    </QueryClientProvider>
  )
}
