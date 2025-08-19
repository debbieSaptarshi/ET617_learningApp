// Configuration utility for the application
export const config = {
  // Check if Supabase is configured
  isSupabaseConfigured: () => {
    return !!(
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://your-project.supabase.co' &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== 'your_anon_key_here'
    )
  },

  // Check if we're in demo mode
  isDemoMode: () => {
    return !config.isSupabaseConfigured()
  },

  // Get Supabase URL (with fallback)
  getSupabaseUrl: () => {
    return process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co'
  },

  // Get Supabase anon key (with fallback)
  getSupabaseAnonKey: () => {
    return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your_anon_key_here'
  },

  // Get service role key (with fallback)
  getServiceRoleKey: () => {
    return process.env.SUPABASE_SERVICE_ROLE_KEY || 'your_service_role_key_here'
  }
}
