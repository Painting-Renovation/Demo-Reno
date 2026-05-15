/**
 * Prisma-compatible database wrapper using Supabase.
 *
 * Provides a familiar Prisma Client API (findMany, findUnique, create, update,
 * delete, count, groupBy, updateMany, etc.) while delegating all queries to
 * the Supabase PostgREST client.
 *
 * Supported where-clause operators:
 *   { field: value }              → eq
 *   { field: { in: [...] } }      → in
 *   { field: { gte: x } }         → gte
 *   { field: { gte: x, lt: y } }  → gte + lt (range)
 *   { field: { not: null } }      → not null
 *   { field: { contains: 'x' } }  → ilike
 *   { OR: [...], ... }            → or (AND with other top-level keys)
 *
 * Supported include patterns:
 *   { _count: { select: { rel: true } } }  → parallel count queries
 *   { relName: true }                      → fetch all columns of relation
 *   { relName: { select, orderBy } }       → fetch relation with options
 *
 * Table/column naming:
 *   Tables are PascalCase (Lead, Appointment …).
 *   Columns are camelCase (matching the Prisma schema exactly).
 */

import { supabase, toCamelCase, toCamelCaseArray } from './supabase';

// ═══════════════════════════════════════════════════════════════════════════════
// Type Definitions
// ═══════════════════════════════════════════════════════════════════════════════

type SortOrder = 'asc' | 'desc';

/** Prisma-style filter operators for a single field. */
interface FieldFilter {
  in?: unknown[];
  gte?: unknown;
  gt?: unknown;
  lte?: unknown;
  lt?: unknown;
  contains?: string;
  not?: unknown;
  equals?: unknown;
}

/** Top-level where clause accepted by every query method. */
type WhereClause = {
  [K: string]: unknown;
  OR?: WhereClause[];
  AND?: WhereClause[];
};

/** OrderBy can be a single object or an array for multi-sort. */
type OrderByInput =
  | Record<string, SortOrder>
  | Array<Record<string, SortOrder>>;

// ── Query argument types ─────────────────────────────────────────────────────

interface FindManyArgs {
  where?: WhereClause;
  orderBy?: OrderByInput;
  skip?: number;
  take?: number;
  include?: Record<string, unknown>;
  select?: Record<string, unknown>;
}

interface FindUniqueArgs {
  where: Record<string, unknown>;
  include?: Record<string, unknown>;
  select?: Record<string, unknown>;
}

interface FindFirstArgs {
  where?: WhereClause;
  orderBy?: OrderByInput;
  select?: Record<string, unknown>;
}

interface CountArgs {
  where?: WhereClause;
}

interface CreateArgs {
  data: Record<string, unknown>;
}

interface UpdateArgs {
  where: Record<string, unknown>;
  data: Record<string, unknown>;
  select?: Record<string, unknown>;
}

interface DeleteArgs {
  where: Record<string, unknown>;
}

interface UpdateManyArgs {
  where: Record<string, unknown>;
  data: Record<string, unknown>;
}

interface GroupByArgs {
  by: string | string[];
  where?: WhereClause;
  _count?: boolean | { select: Record<string, boolean | { _count?: boolean }> };
  orderBy?: Record<string, SortOrder> | { _count: Record<string, SortOrder> };
}

// ── Relation metadata ────────────────────────────────────────────────────────

type RelationType = 'oneToMany' | 'manyToOne';

interface RelationMeta {
  /** The PascalCase Supabase table that holds the related rows. */
  table: string;
  /** The camelCase foreign-key column on the *child* table. */
  foreignKey: string;
  type: RelationType;
}

// ═══════════════════════════════════════════════════════════════════════════════
// Relation Map
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * For every model that participates in a relation, stores how to reach its
 * neighbours.  Only models that have relations are listed.
 */
const RELATIONS: Record<string, Record<string, RelationMeta>> = {
  Lead: {
    appointments: { table: 'Appointment', foreignKey: 'leadId', type: 'oneToMany' },
    projects:     { table: 'Project',     foreignKey: 'leadId', type: 'oneToMany' },
    quotes:       { table: 'Quote',       foreignKey: 'leadId', type: 'oneToMany' },
    activities:   { table: 'LeadActivity', foreignKey: 'leadId', type: 'oneToMany' },
    trackings:    { table: 'VisitorTracking', foreignKey: 'leadId', type: 'oneToMany' },
  },
  Appointment: {
    lead: { table: 'Lead', foreignKey: 'leadId', type: 'manyToOne' },
  },
  Project: {
    lead:   { table: 'Lead', foreignKey: 'leadId', type: 'manyToOne' },
    quotes: { table: 'Quote', foreignKey: 'projectId', type: 'oneToMany' },
  },
  Quote: {
    lead:    { table: 'Lead',    foreignKey: 'leadId', type: 'manyToOne' },
    project: { table: 'Project', foreignKey: 'projectId', type: 'manyToOne' },
  },
  LeadActivity: {
    lead: { table: 'Lead', foreignKey: 'leadId', type: 'manyToOne' },
  },
  VisitorTracking: {
    lead: { table: 'Lead', foreignKey: 'leadId', type: 'manyToOne' },
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// Utility Helpers
// ═══════════════════════════════════════════════════════════════════════════════

/** Ensure Date objects are serialised as ISO strings for PostgREST. */
function serialiseValue(value: unknown): unknown {
  if (value instanceof Date) return value.toISOString();
  return value;
}

/** Deep-serialise every Date in a data object (for insert / update payloads). */
function serialiseData(data: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(data)) {
    if (val instanceof Date) {
      out[key] = val.toISOString();
    } else if (val !== null && typeof val === 'object' && !Array.isArray(val)) {
      // Recurse into plain objects (but not special class instances).
      out[key] = serialiseData(val as Record<string, unknown>);
    } else {
      out[key] = val;
    }
  }
  return out;
}

// ── Where-clause → Supabase filter builder ───────────────────────────────────

/**
 * Apply a Prisma-style `where` clause to a Supabase query builder.
 * Returns the (mutated) query builder for chaining.
 */
function applyWhereClause(query: any, where: WhereClause): any {
  if (!where || Object.keys(where).length === 0) return query;

  const { OR, AND, ...rest } = where;

  // 1. Apply all top-level AND conditions
  for (const [field, rawValue] of Object.entries(rest)) {
    query = applyFieldFilter(query, field, rawValue);
  }

  // 2. Apply AND (explicit group)
  if (AND && Array.isArray(AND)) {
    for (const group of AND) {
      query = applyWhereClause(query, group);
    }
  }

  // 3. Apply OR
  if (OR && Array.isArray(OR) && OR.length > 0) {
    const parts = OR.map((clause) => buildOrFilterString(clause));
    const combined = parts.join(',');
    if (combined) {
      query = query.or(combined);
    }
  }

  return query;
}

/**
 * Apply filters for a single field.
 */
function applyFieldFilter(query: any, field: string, rawValue: unknown): any {
  if (rawValue === null || rawValue === undefined) {
    return query.is(field, null);
  }

  // Primitive value → equality
  if (typeof rawValue === 'string' || typeof rawValue === 'number' || typeof rawValue === 'boolean') {
    return query.eq(field, rawValue);
  }

  // Date → equality with ISO string
  if (rawValue instanceof Date) {
    return query.eq(field, rawValue.toISOString());
  }

  // Array at top-level → treat as `in`
  if (Array.isArray(rawValue)) {
    return query.in(field, rawValue.map(serialiseValue));
  }

  // Object → operator map
  if (typeof rawValue === 'object') {
    const ops = rawValue as Record<string, unknown>;

    if (ops.in !== undefined) {
      return query.in(field, (ops.in as unknown[]).map(serialiseValue));
    }

    if (ops.contains !== undefined) {
      return query.ilike(field, `%${ops.contains}%`);
    }

    if (ops.not !== undefined) {
      if (ops.not === null) {
        return query.not(field, 'is', null);
      }
      return query.neq(field, serialiseValue(ops.not));
    }

    if (ops.equals !== undefined) {
      return query.eq(field, serialiseValue(ops.equals));
    }

    // Range operators (can be combined)
    let q = query;
    if (ops.gte !== undefined) q = q.gte(field, serialiseValue(ops.gte));
    if (ops.gt  !== undefined) q = q.gt(field, serialiseValue(ops.gt));
    if (ops.lte !== undefined) q = q.lte(field, serialiseValue(ops.lte));
    if (ops.lt  !== undefined) q = q.lt(field, serialiseValue(ops.lt));
    return q;
  }

  return query;
}

/**
 * Convert a where-clause object into a PostgREST `or()` filter string.
 * E.g. `{ firstName: { contains: 'x' } }` → `"firstName.ilike.%x%"`
 */
function buildOrFilterString(clause: Record<string, unknown>): string {
  const parts: string[] = [];

  for (const [field, rawValue] of Object.entries(clause)) {
    if (field === 'OR' || field === 'AND') continue;

    if (rawValue === null || rawValue === undefined) {
      parts.push(`${field}.is.null`);
      continue;
    }

    if (typeof rawValue === 'string' || typeof rawValue === 'number' || typeof rawValue === 'boolean') {
      parts.push(`${field}.eq.${rawValue}`);
      continue;
    }

    if (rawValue instanceof Date) {
      parts.push(`${field}.eq.${rawValue.toISOString()}`);
      continue;
    }

    if (typeof rawValue === 'object' && !Array.isArray(rawValue)) {
      const ops = rawValue as Record<string, unknown>;

      if (ops.in !== undefined) {
        const list = (ops.in as unknown[]).map(serialiseValue);
        parts.push(`${field}.in.(${list.join(',')})`);
        continue;
      }

      if (ops.contains !== undefined) {
        parts.push(`${field}.ilike.%${ops.contains}%`);
        continue;
      }

      if (ops.not !== undefined) {
        if (ops.not === null) {
          parts.push(`${field}.not.is.null`);
        } else {
          parts.push(`${field}.neq.${serialiseValue(ops.not)}`);
        }
        continue;
      }

      if (ops.gte !== undefined) parts.push(`${field}.gte.${serialiseValue(ops.gte)}`);
      if (ops.gt  !== undefined) parts.push(`${field}.gt.${serialiseValue(ops.gt)}`);
      if (ops.lte !== undefined) parts.push(`${field}.lte.${serialiseValue(ops.lte)}`);
      if (ops.lt  !== undefined) parts.push(`${field}.lt.${serialiseValue(ops.lt)}`);
      continue;
    }

    // Fallback
    parts.push(`${field}.eq.${rawValue}`);
  }

  return parts.join(',');
}

// ── OrderBy helper ───────────────────────────────────────────────────────────

function applyOrderBy(query: any, orderBy: OrderByInput): any {
  if (!orderBy) return query;
  const entries = Array.isArray(orderBy) ? orderBy : [orderBy];
  for (const entry of entries) {
    for (const [column, direction] of Object.entries(entry)) {
      query = query.order(column, {
        ascending: direction === 'asc',
        nullsFirst: false,
      });
    }
  }
  return query;
}

// ── Select / projection helper ───────────────────────────────────────────────

/**
 * Build a comma-separated column list for Supabase `.select()`.
 * Excludes `_count` and relation names (handled separately).
 */
function buildColumnList(select: Record<string, unknown>): string {
  return Object.entries(select)
    .filter(([, val]) => val === true && typeof val === 'boolean')
    .map(([col]) => col)
    .join(',');
}

/**
 * Filter a row to only the keys specified in a Prisma-style `select`.
 * Handles nested `_count` and relation objects.
 */
function pickSelectedFields(
  row: Record<string, unknown>,
  select: Record<string, unknown>,
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(select)) {
    if (val === true) {
      if (key in row) result[key] = row[key];
    } else if (key === '_count') {
      // Keep _count as-is (added by include processing)
      if ('_count' in row) result._count = row._count;
    } else if (typeof val === 'object' && val !== null && key in row) {
      // Nested relation select — keep the relation data
      result[key] = row[key];
    }
  }
  return result;
}

// ── Include / relation fetching ──────────────────────────────────────────────

/**
 * Fetch `_count` aggregates and relation rows for a set of result rows.
 *
 * @param rows        – the already-fetched main rows (will be mutated)
 * @param tableName   – PascalCase table name (e.g. "Lead")
 * @param includeOrSelect – the include/select object from the query args
 */
async function attachIncludes(
  rows: Record<string, unknown>[],
  tableName: string,
  includeOrSelect: Record<string, unknown>,
): Promise<void> {
  if (!rows.length) return;

  const relations = RELATIONS[tableName];

  // ── _count ──────────────────────────────────────────────────────────────
  const countConfig = includeOrSelect._count;
  if (countConfig && typeof countConfig === 'object') {
    const countSelect =
      (countConfig as Record<string, unknown>).select || countConfig;

    const countTargets: string[] = [];
    if (typeof countSelect === 'object' && countSelect !== null) {
      for (const [relName, enabled] of Object.entries(
        countSelect as Record<string, unknown>,
      )) {
        if (enabled === true && relations?.[relName]) {
          countTargets.push(relName);
        }
      }
    }

    if (countTargets.length > 0) {
      const parentIds = rows.map((r) => r.id).filter(Boolean) as string[];

      // For each target relation, fetch child foreign-key values and count in JS
      const countMaps: Array<Record<string, number>> = await Promise.all(
        countTargets.map(async (target) => {
          const meta = relations![target];
          const { data } = await supabase
            .from(meta.table)
            .select(meta.foreignKey)
            .in(meta.foreignKey, parentIds);

          const counts: Record<string, number> = {};
          for (const parent of parentIds) counts[parent] = 0;
          for (const row of data || []) {
            const fk = row[meta.foreignKey] as string;
            if (fk) counts[fk] = (counts[fk] || 0) + 1;
          }
          return counts;
        }),
      );

      for (const row of rows) {
        const rowId = row.id as string;
        const agg: Record<string, number> = {};
        countTargets.forEach((t, i) => {
          agg[t] = countMaps[i][rowId] || 0;
        });
        row._count = agg;
      }
    }
  }

  // ── Relation includes ───────────────────────────────────────────────────
  for (const [relName, relOpts] of Object.entries(includeOrSelect)) {
    if (relName === '_count') continue;
    if (!relations?.[relName]) continue;

    const meta = relations[relName];

    // relOpts can be `true` or `{ select, orderBy, … }`
    const opts =
      relOpts === true ? {} : (relOpts as Record<string, unknown>);

    if (meta.type === 'oneToMany') {
      await attachOneToMany(rows, meta, opts);
    } else {
      await attachManyToOne(rows, meta, opts);
    }
  }
}

/**
 * Attach one-to-many relation rows (e.g. Lead → Appointment[]).
 */
async function attachOneToMany(
  parentRows: Record<string, unknown>[],
  meta: RelationMeta,
  opts: Record<string, unknown>,
): Promise<void> {
  const parentIds = parentRows.map((r) => r.id).filter(Boolean) as string[];

  let query: any = supabase
    .from(meta.table)
    .select('*')
    .in(meta.foreignKey, parentIds);

  // Apply orderBy from include options
  if (opts.orderBy) {
    query = applyOrderBy(query, opts.orderBy as OrderByInput);
  }

  const { data, error } = await query;
  if (error) return; // silently skip on error to avoid breaking the parent result

  const children = toCamelCaseArray(data || []);

  // Group children by foreign-key value
  const grouped: Record<string, unknown[]> = {};
  for (const parent of parentIds) grouped[parent] = [];
  for (const child of children) {
    const fk = child[meta.foreignKey] as string;
    if (fk && grouped[fk]) grouped[fk].push(child);
  }

  // Apply nested select
  for (const parent of parentRows) {
    let relData = grouped[parent.id as string] || [];
    if (opts.select && typeof opts.select === 'object') {
      relData = relData.map((r) =>
        pickSelectedFields(r as Record<string, unknown>, opts.select as Record<string, unknown>),
      );
    }
    parent[camelFromPascal(meta.table)] = relData;
  }
}

/**
 * Attach many-to-one relation rows (e.g. Quote → Lead).
 */
async function attachManyToOne(
  childRows: Record<string, unknown>[],
  meta: RelationMeta,
  opts: Record<string, unknown>,
): Promise<void> {
  const fkValues = [
    ...new Set(
      childRows
        .map((r) => r[meta.foreignKey])
        .filter((v): v is string => typeof v === 'string'),
    ),
  ];

  if (fkValues.length === 0) {
    for (const row of childRows) {
      row[camelFromPascal(meta.table)] = null;
    }
    return;
  }

  let query: any = supabase
    .from(meta.table)
    .select('*')
    .in('id', fkValues);

  if (opts.orderBy) {
    query = applyOrderBy(query, opts.orderBy as OrderByInput);
  }

  const { data, error } = await query;
  if (error) return;

  const parents = toCamelCaseArray(data || []);
  const parentMap = new Map<string, unknown>();
  for (const p of parents) parentMap.set(p.id as string, p);

  const relName = camelFromPascal(meta.table);
  for (const row of childRows) {
    const fk = row[meta.foreignKey] as string | undefined;
    let relData: unknown = fk ? parentMap.get(fk) ?? null : null;

    if (relData && opts.select && typeof opts.select === 'object') {
      relData = pickSelectedFields(
        relData as Record<string, unknown>,
        opts.select as Record<string, unknown>,
      );
    }
    row[relName] = relData;
  }
}

/** Convert a PascalCase table name to its camelCase relation key. */
function camelFromPascal(pascal: string): string {
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

// ═══════════════════════════════════════════════════════════════════════════════
// Model Class
// ═══════════════════════════════════════════════════════════════════════════════

class Model {
  constructor(public readonly tableName: string) {}

  // ── findMany ──────────────────────────────────────────────────────────────

  async findMany(args: FindManyArgs = {}): Promise<unknown[]> {
    const { where, orderBy, skip, take, include, select } = args;

    // Build base select columns (or '*' for all)
    const columns =
      select && !include ? buildColumnList(select) || '*' : '*';

    let query: any = supabase.from(this.tableName).select(columns);

    // Where
    if (where) query = applyWhereClause(query, where);

    // OrderBy
    if (orderBy) query = applyOrderBy(query, orderBy);

    // Pagination
    if (take !== undefined && skip !== undefined) {
      query = query.range(skip, skip + take - 1);
    } else if (take !== undefined) {
      query = query.limit(take);
    } else if (skip !== undefined) {
      query = query.range(skip, skip + 999999);
    }

    const { data, error } = await query;
    if (error) {
      throw new Error(
        `[${this.tableName}.findMany] Query failed: ${error.message}`,
      );
    }

    let rows = toCamelCaseArray(data || []);

    // Attach includes (relations + _count)
    const includeSource = include || select;
    if (includeSource && typeof includeSource === 'object') {
      await attachIncludes(rows as Record<string, unknown>[], this.tableName, includeSource);
    }

    // Apply field-level select (pick only requested columns)
    if (select && typeof select === 'object') {
      rows = (rows as Record<string, unknown>[]).map((r) =>
        pickSelectedFields(r, select),
      );
    }

    return rows;
  }

  // ── findUnique ────────────────────────────────────────────────────────────

  async findUnique(args: FindUniqueArgs): Promise<unknown | null> {
    const { where, include, select } = args;

    let query: any = supabase.from(this.tableName).select('*');

    // Resolve the unique identifier
    for (const [key, value] of Object.entries(where)) {
      query = query.eq(key, serialiseValue(value));
    }

    query = query.limit(1);

    const { data, error } = await query;

    // PGRST116 = no rows returned
    if (error && error.code === 'PGRST116') return null;
    if (error) {
      throw new Error(
        `[${this.tableName}.findUnique] Query failed: ${error.message}`,
      );
    }
    if (!data || data.length === 0) return null;

    let row = toCamelCase(data[0]) as Record<string, unknown>;

    // Attach includes
    const includeSource = include || select;
    if (includeSource && typeof includeSource === 'object') {
      await attachIncludes([row], this.tableName, includeSource);
    }

    // Apply select projection
    if (select && typeof select === 'object') {
      row = pickSelectedFields(row, select);
    }

    return row;
  }

  // ── findFirst ─────────────────────────────────────────────────────────────

  async findFirst(args: FindFirstArgs = {}): Promise<unknown | null> {
    const { where, orderBy, select } = args;

    let query: any = supabase.from(this.tableName).select('*');

    if (where) query = applyWhereClause(query, where);
    if (orderBy) query = applyOrderBy(query, orderBy);

    query = query.limit(1);

    const { data, error } = await query;
    if (error) {
      throw new Error(
        `[${this.tableName}.findFirst] Query failed: ${error.message}`,
      );
    }
    if (!data || data.length === 0) return null;

    let row = toCamelCase(data[0]) as Record<string, unknown>;

    const includeSource = select;
    if (includeSource && typeof includeSource === 'object') {
      await attachIncludes([row], this.tableName, includeSource);
    }

    if (select && typeof select === 'object') {
      row = pickSelectedFields(row, select);
    }

    return row;
  }

  // ── count ─────────────────────────────────────────────────────────────────

  async count(args: CountArgs = {}): Promise<number> {
    let query: any = supabase
      .from(this.tableName)
      .select('*', { count: 'exact', head: true });

    if (args.where) query = applyWhereClause(query, args.where);

    const { count, error } = await query;
    if (error) {
      throw new Error(
        `[${this.tableName}.count] Query failed: ${error.message}`,
      );
    }
    return count ?? 0;
  }

  // ── create ────────────────────────────────────────────────────────────────

  async create(args: CreateArgs): Promise<unknown> {
    const payload = serialiseData(args.data);

    const { data, error } = await supabase
      .from(this.tableName)
      .insert(payload)
      .select()
      .single();

    if (error) {
      throw new Error(
        `[${this.tableName}.create] Insert failed: ${error.message}`,
      );
    }

    return toCamelCase(data);
  }

  // ── update ────────────────────────────────────────────────────────────────

  async update(args: UpdateArgs): Promise<unknown> {
    const { where, data, select } = args;
    const payload = serialiseData(data);

    let query: any = supabase
      .from(this.tableName)
      .update(payload);

    for (const [key, value] of Object.entries(where)) {
      query = query.eq(key, serialiseValue(value));
    }

    const columns = select
      ? buildColumnList(select) || '*'
      : '*';

    query = query.select(columns).single();

    const { data: updated, error } = await query;
    if (error) {
      throw new Error(
        `[${this.tableName}.update] Update failed: ${error.message}`,
      );
    }

    let row = toCamelCase(updated) as Record<string, unknown>;

    if (select && typeof select === 'object') {
      row = pickSelectedFields(row, select);
    }

    return row;
  }

  // ── delete ────────────────────────────────────────────────────────────────

  async delete(args: DeleteArgs): Promise<unknown> {
    let query: any = supabase.from(this.tableName).delete();

    for (const [key, value] of Object.entries(args.where)) {
      query = query.eq(key, serialiseValue(value));
    }

    query = query.select('*').single();

    const { data, error } = await query;
    if (error) {
      throw new Error(
        `[${this.tableName}.delete] Delete failed: ${error.message}`,
      );
    }

    return toCamelCase(data);
  }

  // ── updateMany ────────────────────────────────────────────────────────────

  async updateMany(args: UpdateManyArgs): Promise<{ count: number }> {
    const { where, data } = args;
    const payload = serialiseData(data);

    let query: any = supabase.from(this.tableName).update(payload);

    // Apply where
    if (where.id !== undefined && typeof where.id === 'object') {
      const idFilter = where.id as Record<string, unknown>;
      if (idFilter.in && Array.isArray(idFilter.in)) {
        query = query.in('id', idFilter.in as string[]);
      }
    } else {
      query = applyWhereClause(query, where as WhereClause);
    }

    const { count, error } = await query;
    if (error) {
      throw new Error(
        `[${this.tableName}.updateMany] Bulk update failed: ${error.message}`,
      );
    }

    return { count: count ?? 0 };
  }

  // ── groupBy ───────────────────────────────────────────────────────────────

  async groupBy(args: GroupByArgs): Promise<unknown[]> {
    const { by, where, _count, orderBy } = args;

    const fields = Array.isArray(by) ? by : [by];

    // Fetch all matching rows (Supabase JS client lacks native GROUP BY)
    let query: any = supabase
      .from(this.tableName)
      .select(fields.join(','));

    if (where) query = applyWhereClause(query, where);

    const { data, error } = await query;
    if (error) {
      throw new Error(
        `[${this.tableName}.groupBy] Query failed: ${error.message}`,
      );
    }

    const rows = toCamelCaseArray(data || []) as Record<string, unknown>[];

    // Group in JS
    const groups = new Map<string, Record<string, unknown>[]>();
    for (const row of rows) {
      const key = fields.map((f) => String(row[f] ?? '')).join('||');
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(row);
    }

    let result: Record<string, unknown>[] = [];

    for (const [key, groupRows] of groups) {
      const entry: Record<string, unknown> = {};
      const fieldValues = key.split('||');
      fields.forEach((f, i) => {
        entry[f] = groupRows[0][f];
      });

      if (_count) {
        if (typeof _count === 'object' && _count.select) {
          // Per-relation counts
          const countAgg: Record<string, number> = {};
          for (const [relName] of Object.entries(_count.select)) {
            countAgg[relName] = groupRows.length;
          }
          entry._count = countAgg;
        } else {
          // Simple count
          entry._count = { _all: groupRows.length };
        }
      }

      result.push(entry);
    }

    // Apply orderBy
    if (orderBy) {
      const orderByEntries = Object.entries(orderBy);
      for (const [sortKey, direction] of orderByEntries) {
        result.sort((a, b) => {
          let valA: unknown;
          let valB: unknown;

          if (sortKey === '_count') {
            // orderBy: { _count: { someField: 'desc' } }
            const countOrderBy = (orderBy as Record<string, Record<string, SortOrder>>)._count;
            if (countOrderBy) {
              const [countField, countDir] = Object.entries(countOrderBy)[0];
              valA = (a._count as Record<string, unknown>)?.[countField];
              valB = (b._count as Record<string, unknown>)?.[countField];
            } else {
              valA = (a._count as Record<string, unknown>)?._all;
              valB = (b._count as Record<string, unknown>)?._all;
            }
          } else {
            valA = a[sortKey];
            valB = b[sortKey];
          }

          if (typeof valA === 'number' && typeof valB === 'number') {
            return direction === 'asc' ? valA - valB : valB - valA;
          }
          const strA = String(valA ?? '');
          const strB = String(valB ?? '');
          return direction === 'asc'
            ? strA.localeCompare(strB)
            : strB.localeCompare(strA);
        });
      }
    }

    return result;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// Database Instance
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Main database export — drop-in replacement for Prisma Client's `db`.
 *
 * Usage:
 *   import { db } from '@/lib/db';
 *   const leads = await db.lead.findMany({ where: { status: 'new' } });
 *   const lead  = await db.lead.findUnique({ where: { id: '...' }, include: { activities: true, _count: { select: { appointments: true } } } });
 *   const count = await db.lead.count({ where: { status: { in: ['new', 'contacted'] } } });
 */
const db = {
  lead:                new Model('Lead'),
  leadActivity:        new Model('LeadActivity'),
  appointment:         new Model('Appointment'),
  project:             new Model('Project'),
  quote:               new Model('Quote'),
  visitorTracking:     new Model('VisitorTracking'),
  siteAudit:           new Model('SiteAudit'),
  testimonial:         new Model('Testimonial'),
  galleryImage:        new Model('GalleryImage'),
  emailLog:            new Model('EmailLog'),
  notificationSettings:new Model('NotificationSettings'),
  owner:               new Model('Owner'),

  /**
   * Execute a raw Supabase RPC call.
   *
   * ```ts
   * const result = await db.$queryRaw('my_function', { arg1: 'value' });
   * ```
   */
  async $queryRaw<T = unknown>(
    fn: string,
    params?: Record<string, unknown>,
  ): Promise<T[]> {
    const { data, error } = await supabase.rpc(fn, params ?? {});
    if (error) {
      throw new Error(`[db.$queryRaw] RPC "${fn}" failed: ${error.message}`);
    }
    return (data ?? []) as T[];
  },

  /**
   * Transaction-like helper: execute multiple operations sequentially.
   * Supabase does not support true client-side transactions via the JS
   * client, so this is a best-effort sequential executor.
   *
   * For atomic operations, use Supabase Edge Functions or RPC.
   */
  async $transaction<T>(
    fn: (tx: typeof db) => Promise<T>,
  ): Promise<T> {
    return fn(db);
  },

  /**
   * Disconnect — no-op for Supabase HTTP client (stateless).
   */
  async $disconnect(): Promise<void> {
    // no-op
  },

  /**
   * Connect — no-op for Supabase HTTP client (stateless).
   */
  async $connect(): Promise<void> {
    // no-op
  },
};

export { db };
export default db;
