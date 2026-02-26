import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://slvautuwrcyvgiwklajs.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNsdmF1dHV3cmN5dmdpd2tsYWpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxMjc5NDUsImV4cCI6MjA4NzcwMzk0NX0.prkGMwqlK9vi-3mMEAcPCZVLjKy9j7qJv7BmiSb9U4g'

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
