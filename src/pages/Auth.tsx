import { useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
    } else {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setError(error.message)
      else setMessage('Conta criada! Verifica o teu email.')
    }

    setLoading(false)
  }

  return (
    <div
      style={{ backgroundColor: 'var(--cream)', minHeight: '100vh' }}
      className="flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        className="dump-card w-full max-w-md p-8"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-3">💩</div>
          <h1
            className="font-syne text-4xl font-extrabold tracking-tight"
            style={{ color: 'var(--brown-dark)', fontFamily: 'Syne, sans-serif', fontWeight: 800 }}
          >
            DUMP ZONE
          </h1>
          <p
            className="font-caveat text-xl mt-1"
            style={{ color: 'var(--brown-mid)', fontFamily: 'Caveat, cursive' }}
          >
            despeja aqui a tua vida
          </p>
        </div>

        {/* Toggle */}
        <div
          className="flex rounded-xl overflow-hidden mb-6"
          style={{ border: '2px solid var(--brown-dark)' }}
        >
          <button
            onClick={() => setIsLogin(true)}
            className="flex-1 py-2 text-sm font-bold transition-colors"
            style={{
              fontFamily: 'Space Mono, monospace',
              backgroundColor: isLogin ? 'var(--brown-dark)' : 'transparent',
              color: isLogin ? 'var(--cream)' : 'var(--brown-dark)',
            }}
          >
            LOGIN
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className="flex-1 py-2 text-sm font-bold transition-colors"
            style={{
              fontFamily: 'Space Mono, monospace',
              backgroundColor: !isLogin ? 'var(--brown-dark)' : 'transparent',
              color: !isLogin ? 'var(--cream)' : 'var(--brown-dark)',
            }}
          >
            CRIAR CONTA
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label
              className="block text-xs font-bold mb-1 uppercase tracking-widest"
              style={{ fontFamily: 'Space Mono, monospace', color: 'var(--brown-mid)' }}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="tu@example.com"
              className="w-full px-4 py-3 rounded-xl outline-none text-sm transition-all"
              style={{
                border: '2px solid var(--brown-dark)',
                backgroundColor: 'var(--cream)',
                color: 'var(--brown-dark)',
                fontFamily: 'Space Mono, monospace',
              }}
              onFocus={(e) => (e.target.style.boxShadow = '3px 3px 0 var(--brown-dark)')}
              onBlur={(e) => (e.target.style.boxShadow = 'none')}
            />
          </div>

          <div>
            <label
              className="block text-xs font-bold mb-1 uppercase tracking-widest"
              style={{ fontFamily: 'Space Mono, monospace', color: 'var(--brown-mid)' }}
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl outline-none text-sm transition-all"
              style={{
                border: '2px solid var(--brown-dark)',
                backgroundColor: 'var(--cream)',
                color: 'var(--brown-dark)',
                fontFamily: 'Space Mono, monospace',
              }}
              onFocus={(e) => (e.target.style.boxShadow = '3px 3px 0 var(--brown-dark)')}
              onBlur={(e) => (e.target.style.boxShadow = 'none')}
            />
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="px-4 py-3 rounded-xl text-sm font-bold"
              style={{
                backgroundColor: 'var(--hot-pink)',
                color: 'white',
                border: '2px solid var(--brown-dark)',
                fontFamily: 'Space Mono, monospace',
              }}
            >
              ⚠️ {error}
            </motion.div>
          )}

          {message && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="px-4 py-3 rounded-xl text-sm font-bold"
              style={{
                backgroundColor: 'var(--lime)',
                color: 'var(--brown-dark)',
                border: '2px solid var(--brown-dark)',
                fontFamily: 'Space Mono, monospace',
              }}
            >
              ✅ {message}
            </motion.div>
          )}

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02, boxShadow: '6px 6px 0 var(--brown-dark)' }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 rounded-xl text-sm font-bold uppercase tracking-widest mt-2 transition-all"
            style={{
              backgroundColor: 'var(--mustard)',
              color: 'var(--brown-dark)',
              border: '2px solid var(--brown-dark)',
              boxShadow: '4px 4px 0 var(--brown-dark)',
              fontFamily: 'Syne, sans-serif',
              fontWeight: 800,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? '...' : isLogin ? '→ ENTRAR' : '→ CRIAR CONTA'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  )
}
