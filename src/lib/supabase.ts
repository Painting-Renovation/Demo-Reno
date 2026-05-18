import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Lazy-initialized Supabase client — only creates when actually called
let _supabase: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!_supabase) {
    if (!supabaseUrl || !supabaseServiceKey || supabaseServiceKey === 'placeholder') {
      console.warn('[supabase] Skipping client init — missing or placeholder credentials');
      return null;
    }
    _supabase = createClient(supabaseUrl, supabaseServiceKey);
  }
  return _supabase;
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
    });
    return undefined;
  },
});

// Convenience export (lazy getter with graceful fallback)
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getSupabase();
    if (!client) return Reflect.get(noopClient, prop);
    return Reflect.get(client, prop);
  },
});

// Convert snake_case from Supabase to camelCase for JS
export function toCamelCase<T = Record<string, unknown>>(obj: Record<string, unknown>): T {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    result[camelKey] = value;
  }
  return result as T;
}

// Convert camelCase from JS to snake_case for Supabase
export function toSnakeCase(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    const snakeKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
    result[snakeKey] = value;
  }
  return result;
}

// Convert array of objects
export function toCamelCaseArray<T = Record<string, unknown>>(arr: Record<string, unknown>[]): T[] {
  return arr.map(toCamelCase<T>);
}
