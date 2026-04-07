import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

let clientInstance: ReturnType<typeof createSupabaseClient<Database>> | null = null

export function createClient() {
  if (!clientInstance) {
    clientInstance = createSupabaseClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          storageKey: 'sb-session',
        },
      }
    )
  }
  return clientInstance
}
