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
        detectSessionInUrl: true,
        storageKey: 'basketbuddy-auth'
      },
      realtime: {
        params: {
          eventsPerSecond: 10
        }
      }
    }
  )

  supabaseClient.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_OUT' && !session) {
      // Only redirect to login if we're not already there
      if (process.client && !window.location.pathname.includes('/login')) {
        // Clear any stale tokens and redirect
        supabaseClient?.auth.signOut()
        window.location.href = '/login'
      }
    }

    if (event === 'TOKEN_REFRESHED') {
      console.log('Token refreshed successfully')
    }
  })

  return supabaseClient
}