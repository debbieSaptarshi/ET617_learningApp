import { createClient } from '@supabase/supabase-js'
import { config } from './config'

const supabaseUrl = config.getSupabaseUrl()
const supabaseAnonKey = config.getSupabaseAnonKey()

// Client-side Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Service role client for admin operations
export const createServiceRoleClient = () => {
  return createClient(
    supabaseUrl,
    config.getServiceRoleKey(),
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}
