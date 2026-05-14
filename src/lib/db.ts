// Backward-compatible re-export from Supabase server client.
// All API routes now use supabase-server.ts directly.
// This file is kept for any remaining imports of `db` from '@/lib/db'.
export { supabase, toCamelCase, rowsToCamelCase, toSnakeCase } from './supabase-server'
