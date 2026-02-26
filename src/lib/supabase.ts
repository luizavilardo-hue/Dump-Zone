import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      items: {
        Row: {
          id: string
          user_id: string
          content: string
          status: 'inbox' | 'done' | 'incinerated'
          created_at: string
          xp_value: number
        }
        Insert: {
          id?: string
          user_id: string
          content: string
          status?: 'inbox' | 'done' | 'incinerated'
          created_at?: string
          xp_value?: number
        }
        Update: {
          status?: 'inbox' | 'done' | 'incinerated'
          xp_value?: number
        }
      }
      user_stats: {
        Row: {
          user_id: string
          current_xp: number
          current_level: number
          streak_count: number
          last_active_date: string | null
        }
        Insert: {
          user_id: string
          current_xp?: number
          current_level?: number
          streak_count?: number
          last_active_date?: string | null
        }
        Update: {
          current_xp?: number
          current_level?: number
          streak_count?: number
          last_active_date?: string | null
        }
      }
    }
  }
}

export type DumpItem = Database['public']['Tables']['items']['Row']
export type UserStats = Database['public']['Tables']['user_stats']['Row']
