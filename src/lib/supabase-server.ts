import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

// Lazy-initialized server-side Supabase client — only creates when actually called
let _supabase: SupabaseClient | null = null

export function getSupabase(): SupabaseClient | null {
  if (!_supabase) {
    if (!supabaseUrl || !supabaseServiceKey || supabaseServiceKey === 'placeholder') {
      console.warn('[supabase-server] Skipping client init — missing or placeholder credentials')
      return null
    }
    _supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  }
  return _supabase
}

// No-op stub for when Supabase is not configured
const noopClient = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    if (prop === 'from') return () => ({
      select: () => ({ data: null, error: { message: 'Supabase not configured' } }),
      insert: () => ({ data: null, error: { message: 'Supabase not configured' } }),
      update: () => ({ data: null, error: { message: 'Supabase not configured' } }),
      delete: () => ({ data: null, error: { message: 'Supabase not configured' } }),
      rpc: () => ({ data: null, error: { message: 'Supabase not configured' } }),
    })
    return undefined
  },
})

// Convenience export (lazy proxy) with graceful fallback
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getSupabase()
    if (!client) return Reflect.get(noopClient, prop)
    return Reflect.get(client, prop)
  },
})

// Helper to convert Prisma-style snake_case field names to camelCase for JSON responses
export function toCamelCase<T>(row: Record<string, unknown>): T {
  const result: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(row)) {
    const camelKey = key.replace(/_([a-z])/g, (_, c) => c.toUpperCase())
    result[camelKey] = value
  }
  return result as T
}

export function rowsToCamelCase<T>(rows: Record<string, unknown>[]): T[] {
  return rows.map(row => toCamelCase<T>(row))
}

// Helper to convert camelCase input to snake_case for Supabase inserts
export function toSnakeCase(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(obj)) {
    const snakeKey = key.replace(/[A-Z]/g, c => `_${c.toLowerCase()}`)
    result[snakeKey] = value
  }
  return result
}
