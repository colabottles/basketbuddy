import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '~/types/database.types'

let supabaseClient: SupabaseClient<Database> | null = null

export const useSupabase = (): SupabaseClient<Database> => {
  if (supabaseClient) {
    return supabaseClient
  }

  const config = useRuntimeConfig()

  supabaseClient = createClient<Database>(
    config.public.supabaseUrl,
    config.public.supabaseAnonKey,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      },
      realtime: {
        params: {
          eventsPerSecond: 10
        }
      }
    }
  )

  return supabaseClient
}