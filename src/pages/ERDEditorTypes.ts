export interface Field {
  id: string;
  name: string;
  type: string;
  isPrimary: boolean;
  isNullable: boolean;
  isUnique: boolean;
  isForeign: boolean;
  defaultValue?: string;
  description?: string;
}

export interface Index {
  id: string;
  name: string;
  fields: string[];
  isUnique: boolean;
}

export interface Entity {
  id: string;
  name: string;
  x: number;
  y: number;
  fields: Field[];
  color: string;
  collapsed: boolean;
  indexes?: Index[];
  description?: string;
}

export type RelationType = '1:1' | '1:N' | 'N:M';

export interface Relationship {
  id: string;
  from: string;
  fromField?: string;
  to: string;
  toField?: string;
  type: RelationType;
  label: string;
  midX?: number; // user-dragged vertical segment X
  midY?: number; // user-dragged horizontal bridge Y (activates 4-segment routing)
}

export interface EntityGroup {
  id: string;
  name: string;
  color: string;
  entities: string[];
}

export interface ERDState {
  entities: Entity[];
  relationships: Relationship[];
  groups?: EntityGroup[];
}

// ─── Layout constants ─────────────────────────────────────────────────────────

export const W = 228;
export const HEADER_H = 42;
export const FIELD_H = 30;
export const FIELD_PAD = 6;

export const SQL_TYPES = [
  'INT', 'BIGINT', 'SMALLINT', 'TINYINT',
  'VARCHAR(255)', 'VARCHAR(100)', 'CHAR(36)',
  'TEXT', 'LONGTEXT',
  'BOOLEAN',
  'FLOAT', 'DOUBLE', 'DECIMAL(10,2)',
  'DATE', 'DATETIME', 'TIMESTAMP',
  'JSON', 'UUID', 'BLOB', 'ENUM',
];

export const COLORS = [
  '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b',
  '#10b981', '#06b6d4', '#6366f1', '#f97316',
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function uid() { return Math.random().toString(36).slice(2, 9); }

export function entH(e: Entity): number {
  if (e.collapsed) return HEADER_H;
  return HEADER_H + e.fields.length * FIELD_H + FIELD_PAD * 2;
}

export function getFieldY(entity: Entity, fieldId?: string): number {
  if (!fieldId || entity.collapsed) return entity.y + entH(entity) / 2;
  const idx = entity.fields.findIndex(f => f.id === fieldId);
  if (idx < 0) return entity.y + entH(entity) / 2;
  return entity.y + HEADER_H + FIELD_PAD + idx * FIELD_H + FIELD_H / 2;
}

// ─── Orthogonal path routing ──────────────────────────────────────────────────

export interface PathResult {
  d: string;
  x1: number; y1: number;
  x2: number; y2: number;
  midX: number;
  midY: number;
  goRight: boolean;
}

// Fixed-precision helper
function fp(n: number) { return +n.toFixed(1); }

// H-V-H interior commands from current position (x1,y1) — no M prefix
function elbowInterior(x1: number, y1: number, midX: number, x2: number, y2: number): string {
  if (Math.abs(y2 - y1) < 1) return `H${x2}`;

  const r    = 7;
  const seg1 = midX - x1;
  const seg2 = x2   - midX;
  const segV = y2   - y1;

  const r1 = Math.min(r, Math.abs(seg1) / 2, Math.abs(segV) / 2);
  const r2 = Math.min(r, Math.abs(seg2) / 2, Math.abs(segV) / 2);
  const s1 = Math.sign(seg1) || 1;
  const sv = Math.sign(segV) || 1;
  const s2 = Math.sign(seg2) || 1;

  const parts: string[] = [];

  if (r1 > 0.5) {
    parts.push(`H${fp(midX - s1 * r1)}`);
    parts.push(`Q${midX},${y1} ${midX},${fp(y1 + sv * r1)}`);
  } else {
    parts.push(`H${midX}`);
  }

  if (r2 > 0.5) {
    parts.push(`V${fp(y2 - sv * r2)}`);
    parts.push(`Q${midX},${y2} ${fp(midX + s2 * r2)},${y2}`);
  } else {
    parts.push(`V${y2}`);
  }

  parts.push(`H${x2}`);
  return parts.join(' ');
}

// Build an elbow SVG path: horizontal → vertical → horizontal with rounded corners
function elbowD(x1: number, y1: number, midX: number, x2: number, y2: number): string {
  return `M${x1},${y1} ${elbowInterior(x1, y1, midX, x2, y2)}`;
}

// 4-segment H→V→H→V path with rounded corners (used when midY is user-set)
function elbow4D(x1: number, y1: number, midX: number, midY: number, x2: number, y2: number): string {
  const r = 6;
  const s1  = Math.sign(midX - x1) || 1;
  const sv1 = Math.sign(midY - y1) || 1;
  const s2  = Math.sign(x2 - midX) || 1;
  const sv2 = Math.sign(y2 - midY) || 1;

  const r1 = Math.min(r, Math.abs(midX - x1) / 2, Math.abs(midY - y1) / 2);
  const r2 = Math.min(r, Math.abs(midY - y1) / 2, Math.abs(x2 - midX) / 2);
  const r3 = Math.min(r, Math.abs(x2 - midX) / 2, Math.abs(y2 - midY) / 2);

  const parts: string[] = [`M${x1},${y1}`];

  if (r1 > 0.5) {
    parts.push(`H${fp(midX - s1 * r1)}`);
    parts.push(`Q${midX},${y1} ${midX},${fp(y1 + sv1 * r1)}`);
  } else { parts.push(`H${midX}`); }

  if (r2 > 0.5) {
    parts.push(`V${fp(midY - sv1 * r2)}`);
    parts.push(`Q${midX},${midY} ${fp(midX + s2 * r2)},${midY}`);
  } else { parts.push(`V${midY}`); }

  if (r3 > 0.5) {
    parts.push(`H${fp(x2 - s2 * r3)}`);
    parts.push(`Q${x2},${midY} ${x2},${fp(midY + sv2 * r3)}`);
  } else { parts.push(`H${x2}`); }

  parts.push(`V${y2}`);
  return parts.join(' ');
}

export function getOrthogonalPath(
  a: Entity, aField: string | undefined,
  b: Entity, bField: string | undefined,
  midXOverride?: number,
  midYOverride?: number,
): PathResult {
  const GAP = 36;
  const goRight = a.x + W / 2 < b.x + W / 2;

  const x1 = goRight ? a.x + W : a.x;
  const y1 = getFieldY(a, aField);
  const x2 = goRight ? b.x : b.x + W;
  const y2 = getFieldY(b, bField);

  let midX: number;
  if (midXOverride !== undefined) {
    midX = midXOverride;
  } else if (goRight) {
    midX = x2 > x1 + GAP * 2
      ? (x1 + x2) / 2
      : Math.max(x1 + GAP, x2 + GAP);
  } else {
    midX = x2 < x1 - GAP * 2
      ? (x1 + x2) / 2
      : Math.min(x1 - GAP, x2 - GAP);
  }

  const naturalMidY = (y1 + y2) / 2;

  // When midY is user-set, use 4-segment H→V→H→V routing
  if (midYOverride !== undefined) {
    return {
      d: elbow4D(x1, y1, midX, midYOverride, x2, y2),
      x1, y1, x2, y2,
      midX,
      midY: midYOverride,
      goRight,
    };
  }

  return {
    d: elbowD(x1, y1, midX, x2, y2),
    x1, y1, x2, y2,
    midX,
    midY: naturalMidY,
    goRight,
  };
}

// Path with optional departure/arrival Y-stubs (to separate lines sharing the same endpoint)
function buildOffsetPath(
  a: Entity, aField: string | undefined,
  b: Entity, bField: string | undefined,
  midX: number,
  fromYOffset: number,
  toYOffset: number,
): PathResult {
  const goRight = a.x + W / 2 < b.x + W / 2;
  const x1 = goRight ? a.x + W : a.x;
  const y1base = getFieldY(a, aField);
  const x2 = goRight ? b.x : b.x + W;
  const y2base = getFieldY(b, bField);

  const y1 = y1base + fromYOffset;
  const y2 = y2base + toYOffset;

  // M at entity edge → optional V departure stub → H-V-H elbow → optional V arrival stub
  let d = `M${x1},${y1base}`;
  if (Math.abs(fromYOffset) > 0.5) d += ` V${fp(y1)}`;
  d += ' ' + elbowInterior(x1, y1, midX, x2, y2);
  if (Math.abs(toYOffset) > 0.5) d += ` V${fp(y2base)}`;

  return { d, x1, y1: y1base, x2, y2: y2base, midX, midY: (y1base + y2base) / 2, goRight };
}

// ─── Conflict resolution for vertical segments ─────────────────────────────────

export interface ResolvedRel {
  id: string;
  path: PathResult;
}

export function resolveRelPaths(
  rels: Array<{ id: string; from: Entity; aField?: string; to: Entity; bField?: string; midXOverride?: number; midYOverride?: number }>,
): Map<string, PathResult> {
  if (rels.length === 0) return new Map();

  const relMap = new Map(rels.map(r => [r.id, r]));
  const paths = new Map<string, PathResult>();

  for (const r of rels) {
    paths.set(r.id, getOrthogonalPath(r.from, r.aField, r.to, r.bField, r.midXOverride, r.midYOverride));
  }

  const MIN_SEP = 22;
  const YSTEP = 8; // Y spread step for paths sharing the same connection point
  // Paths with explicit midX or midY are user-pinned — exclude from auto-routing
  const mutable = rels.filter(r => r.midXOverride === undefined && r.midYOverride === undefined).map(r => r.id);
  if (mutable.length < 2) return paths;

  // ── Step 1: spread overlapping vertical segments via union-find clustering ──

  const vertOverlap = (a: PathResult, b: PathResult): boolean => {
    if (Math.abs(a.midX - b.midX) >= MIN_SEP) return false;
    const yOv = Math.min(Math.max(a.y1, a.y2), Math.max(b.y1, b.y2))
      - Math.max(Math.min(a.y1, a.y2), Math.min(b.y1, b.y2));
    return yOv > 4;
  };

  const parent: Record<string, string> = {};
  for (const id of mutable) parent[id] = id;
  const find = (x: string): string => {
    if (parent[x] !== x) parent[x] = find(parent[x]);
    return parent[x];
  };

  for (let i = 0; i < mutable.length; i++) {
    for (let j = i + 1; j < mutable.length; j++) {
      if (vertOverlap(paths.get(mutable[i])!, paths.get(mutable[j])!)) {
        parent[find(mutable[i])] = find(mutable[j]);
      }
    }
  }

  const clusters = new Map<string, string[]>();
  for (const id of mutable) {
    const root = find(id);
    if (!clusters.has(root)) clusters.set(root, []);
    clusters.get(root)!.push(id);
  }

  for (const members of clusters.values()) {
    if (members.length < 2) continue;
    const avgMidX = members.reduce((s, id) => s + paths.get(id)!.midX, 0) / members.length;
    members.sort((a, b) => (paths.get(a)!.y1 + paths.get(a)!.y2) - (paths.get(b)!.y1 + paths.get(b)!.y2));
    const n = members.length;
    members.forEach((id, i) => {
      const newMidX = avgMidX + (i - (n - 1) / 2) * MIN_SEP;
      const r = relMap.get(id)!;
      paths.set(id, getOrthogonalPath(r.from, r.aField, r.to, r.bField, newMidX));
    });
  }

  // ── Step 2: add Y-stubs for paths sharing the same departure/arrival point ──
  // Lines leaving the same entity field share (x1,y1). Their horizontal stubs
  // overlap until they reach different midX values — the "merge then split" look.
  // Fix: each line immediately jogs a few pixels vertically at the entity edge.

  const fromGroups = new Map<string, string[]>();
  const toGroups   = new Map<string, string[]>();
  for (const id of mutable) {
    const p = paths.get(id)!;
    const fk = `${Math.round(p.x1)},${Math.round(p.y1)}`;
    const tk = `${Math.round(p.x2)},${Math.round(p.y2)}`;
    if (!fromGroups.has(fk)) fromGroups.set(fk, []);
    fromGroups.get(fk)!.push(id);
    if (!toGroups.has(tk)) toGroups.set(tk, []);
    toGroups.get(tk)!.push(id);
  }

  const fromYOff = new Map<string, number>();
  const toYOff   = new Map<string, number>();

  for (const grp of fromGroups.values()) {
    if (grp.length < 2) continue;
    grp.sort((a, b) => paths.get(a)!.midX - paths.get(b)!.midX);
    grp.forEach((id, i) => fromYOff.set(id, (i - (grp.length - 1) / 2) * YSTEP));
  }
  for (const grp of toGroups.values()) {
    if (grp.length < 2) continue;
    grp.sort((a, b) => paths.get(a)!.midX - paths.get(b)!.midX);
    grp.forEach((id, i) => toYOff.set(id, (i - (grp.length - 1) / 2) * YSTEP));
  }

  for (const id of mutable) {
    const fo = fromYOff.get(id) ?? 0;
    const to = toYOff.get(id)   ?? 0;
    if (Math.abs(fo) < 0.5 && Math.abs(to) < 0.5) continue;
    const r = relMap.get(id)!;
    paths.set(id, buildOffsetPath(r.from, r.aField, r.to, r.bField, paths.get(id)!.midX, fo, to));
  }

  return paths;
}

// Keep getLine for backward compat (minimap, SVG export)
export function getLine(
  a: Entity, aField: string | undefined,
  b: Entity, bField: string | undefined,
) {
  const goRight = a.x + W / 2 < b.x + W / 2;
  const x1 = goRight ? a.x + W : a.x;
  const y1 = getFieldY(a, aField);
  const x2 = goRight ? b.x : b.x + W;
  const y2 = getFieldY(b, bField);
  return { x1, y1, x2, y2, mid: { x: (x1 + x2) / 2, y: (y1 + y2) / 2 } };
}

// ─── Demo data ────────────────────────────────────────────────────────────────

export const DEMO: ERDState = {
  entities: [
    {
      id: 'e1', name: 'users', x: 60, y: 80, color: '#3b82f6', collapsed: false,
      fields: [
        { id: 'f1', name: 'id', type: 'UUID', isPrimary: true, isNullable: false, isUnique: true, isForeign: false },
        { id: 'f2', name: 'email', type: 'VARCHAR(255)', isPrimary: false, isNullable: false, isUnique: true, isForeign: false },
        { id: 'f3', name: 'name', type: 'VARCHAR(255)', isPrimary: false, isNullable: false, isUnique: false, isForeign: false },
        { id: 'f4', name: 'created_at', type: 'TIMESTAMP', isPrimary: false, isNullable: false, isUnique: false, isForeign: false },
      ],
    },
    {
      id: 'e2', name: 'posts', x: 380, y: 55, color: '#8b5cf6', collapsed: false,
      fields: [
        { id: 'f5', name: 'id', type: 'UUID', isPrimary: true, isNullable: false, isUnique: true, isForeign: false },
        { id: 'f6', name: 'user_id', type: 'UUID', isPrimary: false, isNullable: false, isUnique: false, isForeign: true },
        { id: 'f7', name: 'title', type: 'VARCHAR(255)', isPrimary: false, isNullable: false, isUnique: false, isForeign: false },
        { id: 'f8', name: 'body', type: 'TEXT', isPrimary: false, isNullable: true, isUnique: false, isForeign: false },
        { id: 'f9', name: 'created_at', type: 'TIMESTAMP', isPrimary: false, isNullable: false, isUnique: false, isForeign: false },
      ],
    },
    {
      id: 'e3', name: 'comments', x: 700, y: 120, color: '#10b981', collapsed: false,
      fields: [
        { id: 'f10', name: 'id', type: 'UUID', isPrimary: true, isNullable: false, isUnique: true, isForeign: false },
        { id: 'f11', name: 'post_id', type: 'UUID', isPrimary: false, isNullable: false, isUnique: false, isForeign: true },
        { id: 'f12', name: 'user_id', type: 'UUID', isPrimary: false, isNullable: false, isUnique: false, isForeign: true },
        { id: 'f13', name: 'content', type: 'TEXT', isPrimary: false, isNullable: false, isUnique: false, isForeign: false },
      ],
    },
    {
      id: 'e4', name: 'tags', x: 380, y: 330, color: '#f59e0b', collapsed: false,
      fields: [
        { id: 'f14', name: 'id', type: 'INT', isPrimary: true, isNullable: false, isUnique: true, isForeign: false },
        { id: 'f15', name: 'name', type: 'VARCHAR(100)', isPrimary: false, isNullable: false, isUnique: true, isForeign: false },
      ],
    },
    {
      id: 'e5', name: 'post_tags', x: 700, y: 360, color: '#f97316', collapsed: false,
      fields: [
        { id: 'f16', name: 'post_id', type: 'UUID', isPrimary: true, isNullable: false, isUnique: false, isForeign: true },
        { id: 'f17', name: 'tag_id', type: 'INT', isPrimary: true, isNullable: false, isUnique: false, isForeign: true },
      ],
    },
  ],
  relationships: [
    { id: 'r1', from: 'e1', to: 'e2', fromField: 'f1', toField: 'f6', type: '1:N', label: '' },
    { id: 'r2', from: 'e2', to: 'e3', fromField: 'f5', toField: 'f11', type: '1:N', label: '' },
    { id: 'r3', from: 'e1', to: 'e3', fromField: 'f1', toField: 'f12', type: '1:N', label: '' },
    { id: 'r4', from: 'e2', to: 'e5', fromField: 'f5', toField: 'f16', type: '1:N', label: '' },
    { id: 'r5', from: 'e4', to: 'e5', fromField: 'f14', toField: 'f17', type: '1:N', label: '' },
  ],
};
