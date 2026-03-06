import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { config } from './config'

// Server-side Supabase client (for server components/actions)
export const createServerSupabaseClient = () => {
  return createServerComponentClient(
    { cookies },
    {
      supabaseUrl: config.getSupabaseUrl(),
      supabaseKey: config.getSupabaseAnonKey()
    }
  )
}
