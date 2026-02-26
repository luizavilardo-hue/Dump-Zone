import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { UserStats } from '../lib/supabase'

export function calcLevel(xp: number): number {
  return Math.floor(Math.sqrt(xp / 100)) + 1
}

export function xpForLevel(level: number): number {
  return (level - 1) * (level - 1) * 100
}

export function xpForNextLevel(level: number): number {
  return level * level * 100
}

export function useGameState(userId: string | undefined) {
  const queryClient = useQueryClient()

  const { data: stats } = useQuery<UserStats | null>({
    queryKey: ['user_stats', userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', userId!)
        .maybeSingle()

      if (error) throw error

      if (!data) {
        // Create initial stats row
        const { data: newStats, error: insertError } = await supabase
          .from('user_stats')
          .insert({
            user_id: userId!,
            current_xp: 0,
            current_level: 1,
            streak_count: 0,
            last_active_date: new Date().toISOString().split('T')[0],
          })
          .select()
          .single()

        if (insertError) throw insertError
        return newStats
      }

      return data
    },
  })

  const addXP = useMutation({
    mutationFn: async (baseXP: number) => {
      if (!userId || !stats) return

      const streakMultiplier = 1 + (stats.streak_count * 0.1)
      const finalXP = Math.round(baseXP * streakMultiplier)
      const newXP = stats.current_xp + finalXP
      const newLevel = calcLevel(newXP)
      const today = new Date().toISOString().split('T')[0]

      // Check streak
      let newStreak = stats.streak_count
      if (stats.last_active_date) {
        const lastDate = new Date(stats.last_active_date)
        const todayDate = new Date(today)
        const diffDays = Math.floor(
          (todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
        )
        if (diffDays === 1) {
          newStreak = stats.streak_count + 1
        } else if (diffDays > 1) {
          newStreak = 0
        }
        // diffDays === 0 means same day, keep streak
      } else {
        newStreak = 1
      }

      const { error } = await supabase
        .from('user_stats')
        .update({
          current_xp: newXP,
          current_level: newLevel,
          streak_count: newStreak,
          last_active_date: today,
        })
        .eq('user_id', userId)

      if (error) throw error

      return { xpGained: finalXP, newLevel }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user_stats', userId] })
    },
  })

  return { stats, addXP }
}
