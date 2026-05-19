import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import {
  Plus, Download, ZoomIn, ZoomOut, Maximize2,
  RotateCcw, Undo2, Redo2, Search, LayoutGrid, FolderOpen,
  ChevronDown, Code, Share2, Grid, Focus, AlignLeft, AlignCenter,
  AlignRight, AlignStartVertical, AlignCenterVertical, AlignEndVertical,
  Keyboard, Terminal, GitBranch, Moon, Sun, Presentation, Camera, Sparkles,
  Hand, MousePointer2,
} from 'lucide-react';

import type { Entity, Field, Relationship, ERDState, EntityGroup, RelationType } from './ERDEditorTypes';
import { uid, entH, resolveRelPaths, W, HEADER_H, FIELD_H, FIELD_PAD, COLORS, DEMO, SQL_TYPES } from './ERDEditorTypes';
import {
  ToolBtn, EntityPanel, RelationshipPanel, Minimap,
  SQLModal, SearchOverlay, ProjectPicker, FKSuggestion,
  FindReplaceModal, CommandPalette, ShortcutsPanel, ContextMenu,
  StatusBar, GroupsLayer, AISchemaModal,
  autoLayout, exportSVG, exportPNG,
  encodeStateToURL, decodeStateFromURL, computeLintWarnings,
  type Command, type ContextMenuItem, type Project,
} from './ERDEditorParts';

// ─── Relationship creator panel ───────────────────────────────────────────────

function RelationshipCreator({
  connecting,
  onSelectType,
  onCancel,
}: {
  connecting: { type: RelationType; fromId?: string } | null;
  onSelectType: (type: RelationType) => void;
  onCancel: () => void;
}) {
  const types: { type: RelationType; label: string; desc: string }[] = [
    { type: '1:1', label: '1 : 1', desc: '일대일' },
    { type: '1:N', label: '1 : N', desc: '일대다' },
    { type: 'N:M', label: 'N : M', desc: '다대다' },
  ];

  return (
    <div className="flex flex-col h-full" style={{ background: '#fff' }}>
      <div className="px-4 py-3 shrink-0" style={{ borderBottom: '1px solid #f1f5f9' }}>
        <div className="flex items-center gap-2">
          <GitBranch size={13} style={{ color: '#94a3b8' }} />
          <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: '#94a3b8' }}>
            관계 추가
          </span>
        </div>
      </div>

      <div className="flex-1 p-4 flex flex-col gap-3">
        <p className="text-[11px]" style={{ color: '#64748b' }}>
          관계 유형을 선택한 후 캔버스에서 두 테이블을 순서대로 클릭하세요.
        </p>

        <div className="flex flex-col gap-2 mt-1">
          {types.map(({ type, label, desc }) => {
            const isActive = connecting?.type === type;
            return (
              <button
                key={type}
                onClick={() => isActive && connecting ? onCancel() : onSelectType(type)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '10px 14px', borderRadius: 8, border: '1.5px solid',
                  borderColor: isActive ? '#3b82f6' : '#e8ecf2',
                  background: isActive ? '#eff6ff' : '#fafbfc',
                  cursor: 'pointer', transition: 'all 0.12s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{
                    fontFamily: 'ui-monospace,monospace', fontSize: 13, fontWeight: 700,
                    color: isActive ? '#2563eb' : '#334155', letterSpacing: '0.03em',
                  }}>{label}</span>
                  <span style={{ fontSize: 11, color: isActive ? '#60a5fa' : '#94a3b8' }}>{desc}</span>
                </div>
                {isActive && (
                  <span style={{ fontSize: 10, color: '#2563eb', fontWeight: 600 }}>선택됨</span>
                )}
              </button>
            );
          })}
        </div>

        {connecting && (
          <div style={{
            marginTop: 4, padding: '10px 14px', borderRadius: 8,
            background: '#f0fdf4', border: '1px solid #bbf7d0',
          }}>
            <div style={{ fontSize: 11, color: '#16a34a', fontWeight: 600, marginBottom: 4 }}>
              연결 중 — {connecting.type}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <div style={{ fontSize: 11, color: connecting.fromId ? '#16a34a' : '#64748b', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{
                  width: 16, height: 16, borderRadius: '50%', flexShrink: 0,
                  background: connecting.fromId ? '#22c55e' : '#e2e8f0',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 9, fontWeight: 700, color: connecting.fromId ? '#fff' : '#94a3b8',
                }}>1</span>
                {connecting.fromId ? '소스 테이블 선택됨' : '소스 테이블 클릭'}
              </div>
              <div style={{ fontSize: 11, color: '#64748b', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{
                  width: 16, height: 16, borderRadius: '50%', flexShrink: 0,
                  background: '#e2e8f0',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 9, fontWeight: 700, color: '#94a3b8',
                }}>2</span>
                대상 테이블 클릭
              </div>
            </div>
            <button
              onClick={onCancel}
              style={{
                marginTop: 8, width: '100%', padding: '5px', borderRadius: 6,
                border: '1px solid #bbf7d0', background: 'transparent',
                fontSize: 11, color: '#64748b', cursor: 'pointer',
              }}
            >
              취소 (Esc)
            </button>
          </div>
        )}

        {!connecting && (
          <div style={{ marginTop: 'auto', padding: '10px 0' }}>
            <p className="text-[10px]" style={{ color: '#cbd5e1', textAlign: 'center' }}>
              유형 버튼을 눌러 연결을 시작하세요
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Project persistence ──────────────────────────────────────────────────────

const PROJ_KEY = 'erd-projects-v1';
const CUR_KEY = 'erd-current-v1';

function loadProjects(): Project[] {
  try { return JSON.parse(localStorage.getItem(PROJ_KEY) ?? '[]'); } catch { return []; }
}
function saveProjects(ps: Project[]) { localStorage.setItem(PROJ_KEY, JSON.stringify(ps)); }

function initProjects(): { projects: Project[]; currentId: string } {
  let projects = loadProjects();
  const currentId = localStorage.getItem(CUR_KEY) ?? '';
  if (projects.length === 0) {
    const first: Project = { id: uid(), name: 'My ERD', updatedAt: Date.now(), state: DEMO };
    projects = [first];
    saveProjects(projects);
    localStorage.setItem(CUR_KEY, first.id);
    return { projects, currentId: first.id };
  }
  const exists = projects.find(p => p.id === currentId);
  return { projects, currentId: exists ? currentId : projects[0].id };
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function ERDEditor() {
  // ── Projects
  const [projects, setProjects] = useState<Project[]>(() => initProjects().projects);
  const [currentId, setCurrentId] = useState<string>(() => initProjects().currentId);
  const currentProject = projects.find(p => p.id === currentId) ?? projects[0];

  // ── ERD state + undo/redo
  const urlState = decodeStateFromURL();
  const [state, _setState] = useState<ERDState>(() => urlState ?? currentProject?.state ?? DEMO);
  const undoStack = useRef<ERDState[]>([]);
  const redoStack = useRef<ERDState[]>([]);

  const setState = useCallback((updater: ERDState | ((s: ERDState) => ERDState)) => {
    _setState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      undoStack.current = [...undoStack.current.slice(-49), prev];
      redoStack.current = [];
      return next;
    });
  }, []);

  const setStateQuiet = useCallback((updater: (s: ERDState) => ERDState) => {
    _setState(updater);
  }, []);

  const undo = useCallback(() => {
    if (!undoStack.current.length) return;
    _setState(prev => {
      const past = undoStack.current[undoStack.current.length - 1];
      undoStack.current = undoStack.current.slice(0, -1);
      redoStack.current = [...redoStack.current, prev];
      return past;
    });
  }, []);

  const redo = useCallback(() => {
    if (!redoStack.current.length) return;
    _setState(prev => {
      const future = redoStack.current[redoStack.current.length - 1];
      redoStack.current = redoStack.current.slice(0, -1);
      undoStack.current = [...undoStack.current, prev];
      return future;
    });
  }, []);

  // Persist to project
  useEffect(() => {
    if (urlState) return; // don't overwrite if loaded from URL
    setProjects(ps => {
      const next = ps.map(p => p.id === currentId ? { ...p, state, updatedAt: Date.now() } : p);
      saveProjects(next);
      return next;
    });
  }, [state, currentId]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Viewport
  const [vp, setVp] = useState({ x: 40, y: 40, scale: 1 });

  // ── Selection
  const [selId, setSelId] = useState<string | null>(null);
  const [selType, setSelType] = useState<'entity' | 'relationship' | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // ── UI state
  const [connecting, setConnecting] = useState<{ type: RelationType; fromId?: string } | null>(null);
  const [hovEnt, setHovEnt] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  // ── Feature toggles
  const [focusMode, setFocusMode] = useState(false);
  const [snapGrid, setSnapGrid] = useState(false);
  const [darkMode, setDarkMode] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches);
  const [presentationMode, setPresentationMode] = useState(false);
  const [canvasMode, setCanvasMode] = useState<'pan' | 'select'>('pan');

  // ── Modals
  const [showSQL, setShowSQL] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showProjects, setShowProjects] = useState(false);
  const [showFindReplace, setShowFindReplace] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showAI, setShowAI] = useState(false);

  // ── Migration snapshot
  const [snapshot, setSnapshot] = useState<ERDState | null>(null);
  const [snapshotSaved, setSnapshotSaved] = useState(false);

  // ── Context menu
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; items: ContextMenuItem[] } | null>(null);

  // ── FK suggestion
  const [fkSug, setFkSug] = useState<{ fromFieldName: string; toEntityId: string; toEntityName: string; fromEntityId: string } | null>(null);

  // ── Share feedback
  const [shareCopied, setShareCopied] = useState(false);

  // ── Relationship hover
  const [hovRelId, setHovRelId] = useState<string | null>(null);

  // ── Marquee selection
  const [marquee, setMarquee] = useState<{ sx: number; sy: number; ex: number; ey: number } | null>(null);
  const isMarqueeRef = useRef(false);
  const marqueeStart = useRef({ x: 0, y: 0 });

  // ── Inline field editing on canvas
  const [inlineEdit, setInlineEdit] = useState<{ entityId: string; fieldId: string; field: 'name' | 'type'; value: string } | null>(null);

  // ── Clipboard (copy/paste)
  const clipboard = useRef<{ entities: Entity[]; relationships: Relationship[] } | null>(null);

  // ── Smart guides (snap lines during drag)
  const [guides, setGuides] = useState<{ x?: number; y?: number }[]>([]);

  // ── Canvas drag
  const canvasRef = useRef<HTMLDivElement>(null);
  const isPanning = useRef(false);
  const panLast = useRef({ x: 0, y: 0 });
  const dragEnt = useRef<string | null>(null);
  const dragAll = useRef(false);
  const dragLast = useRef({ x: 0, y: 0 });
  const preDragState = useRef<ERDState | null>(null);
  const didMove = useRef(false);
  // ── Relationship line drag
  const dragRel = useRef<{ id: string; startMidX: number; startClientX: number; startMidY: number; startClientY: number } | null>(null);
  const didMoveDragRel = useRef(false);
  const scaleRef = useRef(1);
  const selectedIdsRef = useRef<string[]>([]);
  const snapGridRef = useRef(false);
  const mouseCanvasPos = useRef({ x: 0, y: 0 });
  const spaceHeld = useRef(false);
  const [mousePosDisplay, setMousePosDisplay] = useState({ x: 0, y: 0 });

  scaleRef.current = vp.scale;
  selectedIdsRef.current = selectedIds;
  snapGridRef.current = snapGrid;

  const selEntity = selType === 'entity' ? state.entities.find(e => e.id === selId) ?? null : null;
  const selRel = selType === 'relationship' ? state.relationships.find(r => r.id === selId) ?? null : null;

  // ── Dark mode theme
  const T = useMemo(() => darkMode ? {
    bg: '#0f172a', surface: '#1e293b', surfaceHover: '#293548',
    border: '#2d3f55', borderLight: '#334155',
    text: '#e2e8f0', textMuted: '#94a3b8', textFaint: '#475569',
    entityBg: '#1e293b', entityBorder: '#334155', entityText: '#e2e8f0',
    fieldBg: '#253045', fieldBorder: '#334155',
    dotColor: '#2d4060', inputBg: '#253045', inputText: '#e2e8f0',
  } : {
    bg: '#f8fafc', surface: '#ffffff', surfaceHover: '#f8fafc',
    border: '#f1f5f9', borderLight: '#e8ecf2',
    text: '#1e293b', textMuted: '#64748b', textFaint: '#94a3b8',
    entityBg: '#ffffff', entityBorder: '#e8ecf2', entityText: '#1e293b',
    fieldBg: '#ffffff', fieldBorder: '#f1f5f9',
    dotColor: '#dde3ec', inputBg: '#f8fafc', inputText: '#1e293b',
  }, [darkMode]);

  // ── Lint warnings
  const lintWarnings = useMemo(() => computeLintWarnings(state), [state]);

  // ── Focus mode: compute which entities/rels to show at full opacity
  const focusedEntityIds = useMemo(() => {
    if (!focusMode || !selId || selType !== 'entity') return null;
    const connected = state.relationships
      .filter(r => r.from === selId || r.to === selId)
      .flatMap(r => [r.from, r.to]);
    return new Set([selId, ...connected]);
  }, [focusMode, selId, selType, state.relationships]);

  // ─── Fit all ────────────────────────────────────────────────────────────────

  const fitAll = useCallback(() => {
    if (!canvasRef.current || state.entities.length === 0) { setVp({ x: 40, y: 40, scale: 1 }); return; }
    const { width: cw, height: ch } = canvasRef.current.getBoundingClientRect();
    const xs = state.entities.map(e => e.x), ys = state.entities.map(e => e.y);
    const xe = state.entities.map(e => e.x + W), ye = state.entities.map(e => e.y + entH(e));
    const minX = Math.min(...xs), minY = Math.min(...ys);
    const maxX = Math.max(...xe), maxY = Math.max(...ye);
    const dw = maxX - minX, dh = maxY - minY;
    const pad = 60;
    const sc = Math.min((cw - pad * 2) / dw, (ch - pad * 2) / dh, 1.5);
    setVp({ x: -minX * sc + (cw - dw * sc) / 2, y: -minY * sc + (ch - dh * sc) / 2, scale: sc });
  }, [state.entities]);

  // ─── Entity CRUD ─────────────────────────────────────────────────────────────

  const addEntity = useCallback(() => {
    const id = uid();
    const color = COLORS[state.entities.length % COLORS.length];
    const ent: Entity = {
      id, name: 'new_table', color, collapsed: false,
      x: Math.max(20, (240 - vp.x) / scaleRef.current),
      y: Math.max(20, (200 - vp.y) / scaleRef.current),
      fields: [{ id: uid(), name: 'id', type: 'UUID', isPrimary: true, isNullable: false, isUnique: true, isForeign: false }],
    };
    setState(s => ({ ...s, entities: [...s.entities, ent] }));
    setSelId(id); setSelType('entity'); setSelectedIds([id]);
    setEditingId(id); setEditingName('new_table');
  }, [state.entities.length, vp.x, vp.y, setState]);

  const updateEntity = useCallback((id: string, u: Partial<Entity>) => {
    setState(s => ({ ...s, entities: s.entities.map(e => e.id === id ? { ...e, ...u } : e) }));
  }, [setState]);

  const deleteEntity = useCallback((id: string) => {
    setState(s => ({
      ...s,
      entities: s.entities.filter(e => e.id !== id),
      relationships: s.relationships.filter(r => r.from !== id && r.to !== id),
      groups: (s.groups ?? []).map(g => ({ ...g, entities: g.entities.filter(eid => eid !== id) })),
    }));
    setSelId(null); setSelType(null); setSelectedIds([]); setEditingId(null);
  }, [setState]);

  const duplicateEntity = useCallback((id: string) => {
    const src = state.entities.find(e => e.id === id);
    if (!src) return;
    const newEnt: Entity = { ...src, id: uid(), x: src.x + 36, y: src.y + 36, fields: src.fields.map(f => ({ ...f, id: uid() })) };
    setState(s => ({ ...s, entities: [...s.entities, newEnt] }));
    setSelId(newEnt.id); setSelType('entity'); setSelectedIds([newEnt.id]);
  }, [state.entities, setState]);

  const addField = useCallback((eid: string) => {
    const f: Field = { id: uid(), name: 'new_field', type: 'VARCHAR(255)', isPrimary: false, isNullable: true, isUnique: false, isForeign: false };
    setState(s => ({ ...s, entities: s.entities.map(e => e.id === eid ? { ...e, fields: [...e.fields, f] } : e) }));
  }, [setState]);

  const updateField = useCallback((eid: string, fid: string, u: Partial<Field>) => {
    setState(s => ({
      ...s,
      entities: s.entities.map(e =>
        e.id === eid ? { ...e, fields: e.fields.map(f => f.id === fid ? { ...f, ...u } : f) } : e
      ),
    }));
    if (u.name && u.name.endsWith('_id')) {
      const prefix = u.name.replace(/_id$/, '');
      const match = state.entities.find(e =>
        e.id !== eid && (e.name === prefix || e.name === prefix + 's' || e.name === prefix + 'es')
      );
      const entity = state.entities.find(e => e.id === eid);
      if (match && entity) {
        setFkSug({ fromFieldName: u.name, toEntityId: match.id, toEntityName: match.name, fromEntityId: eid });
      }
    }
  }, [setState, state.entities]);

  const deleteField = useCallback((eid: string, fid: string) => {
    setState(s => ({
      ...s,
      entities: s.entities.map(e =>
        e.id === eid ? { ...e, fields: e.fields.filter(f => f.id !== fid) } : e
      ),
    }));
  }, [setState]);

  const moveField = useCallback((eid: string, fid: string, dir: 'up' | 'down') => {
    setState(s => ({
      ...s,
      entities: s.entities.map(e => {
        if (e.id !== eid) return e;
        const idx = e.fields.findIndex(f => f.id === fid);
        if (idx < 0) return e;
        const next = dir === 'up' ? idx - 1 : idx + 1;
        if (next < 0 || next >= e.fields.length) return e;
        const fields = [...e.fields];
        [fields[idx], fields[next]] = [fields[next], fields[idx]];
        return { ...e, fields };
      }),
    }));
  }, [setState]);

  // ─── Relationship CRUD ────────────────────────────────────────────────────────

  const connectEnts = useCallback((fromId: string, toId: string, type: RelationType) => {
    if (fromId === toId) return;
    if (state.relationships.some(r => r.from === fromId && r.to === toId)) return;
    const rel: Relationship = { id: uid(), from: fromId, to: toId, type, label: '' };
    setState(s => ({ ...s, relationships: [...s.relationships, rel] }));
    setSelId(rel.id); setSelType('relationship'); setSelectedIds([]);
  }, [state.relationships, setState]);

  const updateRel = useCallback((id: string, u: Partial<Relationship>) => {
    setState(s => ({ ...s, relationships: s.relationships.map(r => r.id === id ? { ...r, ...u } : r) }));
  }, [setState]);

  const deleteRel = useCallback((id: string) => {
    setState(s => ({ ...s, relationships: s.relationships.filter(r => r.id !== id) }));
    setSelId(null); setSelType(null);
  }, [setState]);

  // ─── Name editing ─────────────────────────────────────────────────────────────

  const commitName = useCallback(() => {
    if (editingId) {
      updateEntity(editingId, { name: editingName.trim() || 'table' });
      setEditingId(null);
    }
  }, [editingId, editingName, updateEntity]);

  // ─── Alignment tools ─────────────────────────────────────────────────────────

  const alignSelected = useCallback((dir: 'left' | 'center-h' | 'right' | 'top' | 'middle-v' | 'bottom') => {
    if (selectedIds.length < 2) return;
    setState(s => {
      const selected = s.entities.filter(e => selectedIds.includes(e.id));
      let updated: Entity[];
      switch (dir) {
        case 'left': { const minX = Math.min(...selected.map(e => e.x)); updated = selected.map(e => ({ ...e, x: minX })); break; }
        case 'center-h': { const cx = selected.reduce((sum, e) => sum + e.x + W / 2, 0) / selected.length; updated = selected.map(e => ({ ...e, x: cx - W / 2 })); break; }
        case 'right': { const maxX = Math.max(...selected.map(e => e.x + W)); updated = selected.map(e => ({ ...e, x: maxX - W })); break; }
        case 'top': { const minY = Math.min(...selected.map(e => e.y)); updated = selected.map(e => ({ ...e, y: minY })); break; }
        case 'middle-v': { const cy = selected.reduce((sum, e) => sum + e.y + entH(e) / 2, 0) / selected.length; updated = selected.map(e => ({ ...e, y: cy - entH(e) / 2 })); break; }
        case 'bottom': { const maxY = Math.max(...selected.map(e => e.y + entH(e))); updated = selected.map(e => ({ ...e, y: maxY - entH(e) })); break; }
        default: return s;
      }
      const m = new Map(updated.map(e => [e.id, e]));
      return { ...s, entities: s.entities.map(e => m.get(e.id) ?? e) };
    });
  }, [selectedIds, setState]);

  const distributeSelected = useCallback((axis: 'h' | 'v') => {
    if (selectedIds.length < 3) return;
    setState(s => {
      const selected = [...s.entities.filter(e => selectedIds.includes(e.id))];
      if (axis === 'h') {
        selected.sort((a, b) => a.x - b.x);
        const minX = selected[0].x;
        const maxX = selected[selected.length - 1].x + W;
        const step = (maxX - minX - W * selected.length) / (selected.length - 1);
        const updated = selected.map((e, i) => ({ ...e, x: minX + i * (W + step) }));
        const m = new Map(updated.map(e => [e.id, e]));
        return { ...s, entities: s.entities.map(e => m.get(e.id) ?? e) };
      } else {
        selected.sort((a, b) => a.y - b.y);
        const minY = selected[0].y;
        const maxY = selected[selected.length - 1].y + entH(selected[selected.length - 1]);
        const totalH = selected.reduce((sum, e) => sum + entH(e), 0);
        const gap = (maxY - minY - totalH) / (selected.length - 1);
        let curY = minY;
        const updated = selected.map(e => { const ent = { ...e, y: curY }; curY += entH(e) + gap; return ent; });
        const m = new Map(updated.map(e => [e.id, e]));
        return { ...s, entities: s.entities.map(e => m.get(e.id) ?? e) };
      }
    });
  }, [selectedIds, setState]);

  // ─── Group management ─────────────────────────────────────────────────────────

  const createGroup = useCallback(() => {
    if (selectedIds.length === 0) return;
    const grp: EntityGroup = {
      id: uid(),
      name: 'Group',
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      entities: [...selectedIds],
    };
    setState(s => ({ ...s, groups: [...(s.groups ?? []), grp] }));
  }, [selectedIds, setState]);

  // ─── URL share ───────────────────────────────────────────────────────────────

  const handleShareURL = useCallback(() => {
    const url = encodeStateToURL(state);
    navigator.clipboard.writeText(url);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  }, [state]);

  // ─── Mouse events ─────────────────────────────────────────────────────────────

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const cx = Math.round((e.clientX - rect.left - vp.x) / vp.scale);
      const cy = Math.round((e.clientY - rect.top - vp.y) / vp.scale);
      mouseCanvasPos.current = { x: cx, y: cy };
    }

    if (isPanning.current) {
      const dx = e.clientX - panLast.current.x, dy = e.clientY - panLast.current.y;
      panLast.current = { x: e.clientX, y: e.clientY };
      setVp(v => ({ ...v, x: v.x + dx, y: v.y + dy }));
    }
    if (isMarqueeRef.current && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const ex = (e.clientX - rect.left - vp.x) / vp.scale;
      const ey = (e.clientY - rect.top - vp.y) / vp.scale;
      setMarquee({ sx: marqueeStart.current.x, sy: marqueeStart.current.y, ex, ey });
    }
    if (dragEnt.current) {
      const dx = (e.clientX - dragLast.current.x) / scaleRef.current;
      const dy = (e.clientY - dragLast.current.y) / scaleRef.current;
      if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) didMove.current = true;
      dragLast.current = { x: e.clientX, y: e.clientY };
      const ids = dragAll.current ? selectedIdsRef.current : [dragEnt.current];
      const snap = snapGridRef.current;
      const GRID = 24;
      const GUIDE_THRESH = 8;

      setStateQuiet(s => {
        const newEntities = s.entities.map(ent => {
          if (!ids.includes(ent.id)) return ent;
          let nx = ent.x + dx, ny = ent.y + dy;
          if (snap) { nx = Math.round(nx / GRID) * GRID; ny = Math.round(ny / GRID) * GRID; }
          return { ...ent, x: nx, y: ny };
        });

        // Compute smart guides
        if (!snap && ids.length === 1) {
          const dragged = newEntities.find(ent => ent.id === ids[0])!;
          const others = newEntities.filter(ent => !ids.includes(ent.id));
          const newGuides: { x?: number; y?: number }[] = [];
          const dragCX = dragged.x + W / 2;
          const dragCY = dragged.y + entH(dragged) / 2;
          for (const o of others) {
            const oCX = o.x + W / 2;
            if (Math.abs(dragged.x - o.x) < GUIDE_THRESH) newGuides.push({ x: o.x });
            else if (Math.abs(dragged.x + W - (o.x + W)) < GUIDE_THRESH) newGuides.push({ x: o.x + W });
            else if (Math.abs(dragCX - oCX) < GUIDE_THRESH) newGuides.push({ x: oCX });
            const oCY = o.y + entH(o) / 2;
            if (Math.abs(dragged.y - o.y) < GUIDE_THRESH) newGuides.push({ y: o.y });
            else if (Math.abs(dragCY - oCY) < GUIDE_THRESH) newGuides.push({ y: oCY });
          }
          setGuides(newGuides.slice(0, 4));
        } else {
          setGuides([]);
        }

        return { ...s, entities: newEntities };
      });
    }
    if (dragRel.current) {
      const dx = (e.clientX - dragRel.current.startClientX) / scaleRef.current;
      const dy = (e.clientY - dragRel.current.startClientY) / scaleRef.current;
      if (Math.abs(dx) > 2 || Math.abs(dy) > 2) didMoveDragRel.current = true;
      const newMidX = dragRel.current.startMidX + dx;
      const newMidY = dragRel.current.startMidY + dy;
      setStateQuiet(s => ({
        ...s,
        relationships: s.relationships.map(r =>
          r.id === dragRel.current!.id ? { ...r, midX: newMidX, midY: newMidY } : r
        ),
      }));
    }
  }, [setStateQuiet, vp.x, vp.y, vp.scale]);

  const handleMouseUp = useCallback(() => {
    if (isMarqueeRef.current) {
      isMarqueeRef.current = false;
      setMarquee(prev => {
        if (!prev) return null;
        const minX = Math.min(prev.sx, prev.ex);
        const maxX = Math.max(prev.sx, prev.ex);
        const minY = Math.min(prev.sy, prev.ey);
        const maxY = Math.max(prev.sy, prev.ey);
        if (maxX - minX > 4 && maxY - minY > 4) {
          _setState(s => {
            const ids = s.entities
              .filter(e => e.x < maxX && e.x + W > minX && e.y < maxY && e.y + entH(e) > minY)
              .map(e => e.id);
            if (ids.length > 0) {
              setSelectedIds(ids);
              setSelId(null); setSelType(null);
            }
            return s;
          });
        }
        return null;
      });
    }
    if (dragEnt.current && didMove.current && preDragState.current) {
      undoStack.current = [...undoStack.current.slice(-49), preDragState.current];
      redoStack.current = [];
    }
    if (dragRel.current && didMoveDragRel.current && preDragState.current) {
      undoStack.current = [...undoStack.current.slice(-49), preDragState.current];
      redoStack.current = [];
    }
    isPanning.current = false;
    dragEnt.current = null;
    dragRel.current = null;
    preDragState.current = null;
    setGuides([]);
    setMousePosDisplay({ ...mouseCanvasPos.current });
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      handleMouseMove(e);
      setMousePosDisplay({ x: mouseCanvasPos.current.x, y: mouseCanvasPos.current.y });
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', handleMouseUp); };
  }, [handleMouseMove, handleMouseUp]);

  // ─── Keyboard ─────────────────────────────────────────────────────────────────

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') spaceHeld.current = true;

      const isInput = e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement;

      if (editingId) {
        if (e.key === 'Enter') commitName();
        if (e.key === 'Escape') setEditingId(null);
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key === 'z') { e.preventDefault(); undo(); }
      if ((e.metaKey || e.ctrlKey) && (e.key === 'y' || (e.shiftKey && e.key === 'z'))) { e.preventDefault(); redo(); }
      if ((e.metaKey || e.ctrlKey) && e.key === 'f') { e.preventDefault(); setShowSearch(true); }
      if ((e.metaKey || e.ctrlKey) && e.key === 'h') { e.preventDefault(); setShowFindReplace(true); }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setShowCommandPalette(true); }
      if ((e.metaKey || e.ctrlKey) && e.key === 'e') { e.preventDefault(); setShowSQL(true); }
      if ((e.metaKey || e.ctrlKey) && e.key === 's') { e.preventDefault(); handleShareURL(); }
      if ((e.metaKey || e.ctrlKey) && e.key === 'a') { e.preventDefault(); setSelectedIds(state.entities.map(e => e.id)); }
      if ((e.metaKey || e.ctrlKey) && e.key === 'c') {
        if (selectedIds.length > 0) {
          const ents = state.entities.filter(e => selectedIds.includes(e.id));
          const rels = state.relationships.filter(r => selectedIds.includes(r.from) && selectedIds.includes(r.to));
          clipboard.current = { entities: ents, relationships: rels };
        } else if (selId && selType === 'entity') {
          const ent = state.entities.find(e => e.id === selId);
          if (ent) clipboard.current = { entities: [ent], relationships: [] };
        }
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'v') {
        e.preventDefault();
        if (clipboard.current && clipboard.current.entities.length > 0) {
          const idMap = new Map<string, string>();
          const newEnts = clipboard.current.entities.map(ent => {
            const newId = uid();
            idMap.set(ent.id, newId);
            return { ...ent, id: newId, x: ent.x + 40, y: ent.y + 40, fields: ent.fields.map(f => ({ ...f, id: uid() })) };
          });
          const newRels = clipboard.current.relationships.map(r => ({
            ...r, id: uid(),
            from: idMap.get(r.from) ?? r.from,
            to: idMap.get(r.to) ?? r.to,
          }));
          setState(s => ({ ...s, entities: [...s.entities, ...newEnts], relationships: [...s.relationships, ...newRels] }));
          setSelectedIds(newEnts.map(e => e.id));
          setSelId(null); setSelType(null);
        }
      }

      if (!isInput) {
        if (e.key === '?') { e.preventDefault(); setShowShortcuts(true); }
        if (e.key === 'f' || e.key === 'F') { e.preventDefault(); setFocusMode(v => !v); }
        if (e.key === 'g' || e.key === 'G') { e.preventDefault(); setSnapGrid(v => !v); }
        if (e.key === 'd' || e.key === 'D') { e.preventDefault(); setDarkMode(v => !v); }
        if (e.key === 'p' || e.key === 'P') { e.preventDefault(); setPresentationMode(v => !v); }
        if (e.key === 'F11') { e.preventDefault(); setPresentationMode(v => !v); }
        if (e.key === 'h' || e.key === 'H') { e.preventDefault(); setCanvasMode('pan'); }
        if (e.key === 'v' || e.key === 'V') { e.preventDefault(); setCanvasMode('select'); }
      }

      if (e.key === 'Escape') {
        setConnecting(null); setInlineEdit(null);
        setSelId(null); setSelType(null);
        setSelectedIds([]);
        setShowSearch(false); setShowSQL(false); setShowProjects(false);
        setShowFindReplace(false); setShowCommandPalette(false); setShowShortcuts(false);
        setShowAI(false); setContextMenu(null);
        setPresentationMode(false);
      }

      if (!isInput && (e.key === 'Delete' || e.key === 'Backspace')) {
        if (selId && selType === 'entity') deleteEntity(selId);
        if (selId && selType === 'relationship') deleteRel(selId);
        if (selectedIds.length > 1) {
          setState(s => ({
            ...s,
            entities: s.entities.filter(e => !selectedIds.includes(e.id)),
            relationships: s.relationships.filter(r => !selectedIds.includes(r.from) && !selectedIds.includes(r.to)),
          }));
          setSelectedIds([]);
        }
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') spaceHeld.current = false;
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => { window.removeEventListener('keydown', onKeyDown); window.removeEventListener('keyup', onKeyUp); };
  }, [editingId, commitName, undo, redo, selId, selType, selectedIds, state.entities, state.relationships, deleteEntity, deleteRel, setState, handleShareURL]);

  // ─── Canvas interaction ───────────────────────────────────────────────────────

  const handleCanvasDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.erd-ent')) return;
    if (inlineEdit) { setInlineEdit(null); return; }
    if (connecting) { setConnecting(prev => prev ? { type: prev.type } : null); return; }
    if (editingId) { commitName(); return; }
    if (contextMenu) { setContextMenu(null); return; }
    // Middle button always pans
    if (e.button === 1) {
      isPanning.current = true;
      panLast.current = { x: e.clientX, y: e.clientY };
      return;
    }
    // Space+drag always pans regardless of mode
    if (spaceHeld.current) {
      isPanning.current = true;
      panLast.current = { x: e.clientX, y: e.clientY };
      return;
    }
    if (canvasMode === 'pan') {
      isPanning.current = true;
      panLast.current = { x: e.clientX, y: e.clientY };
    } else {
      // select mode — marquee
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        const sx = (e.clientX - rect.left - vp.x) / vp.scale;
        const sy = (e.clientY - rect.top - vp.y) / vp.scale;
        marqueeStart.current = { x: sx, y: sy };
        isMarqueeRef.current = true;
        if (!e.shiftKey) { setSelectedIds([]); setSelId(null); setSelType(null); }
      }
    }
  }, [inlineEdit, connecting, editingId, commitName, contextMenu, canvasMode, vp]);

  const handleCanvasRightClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const entEl = (e.target as HTMLElement).closest('.erd-ent') as HTMLElement | null;
    if (entEl) {
      const entityId = entEl.dataset.entityId;
      if (!entityId) return;
      setContextMenu({
        x: e.clientX, y: e.clientY,
        items: [
          { label: 'Rename', action: () => { const ent = state.entities.find(en => en.id === entityId); if (ent) { setEditingId(entityId); setEditingName(ent.name); } } },
          { label: 'Duplicate', action: () => duplicateEntity(entityId) },
          { label: 'Fit to this table', action: () => { const ent = state.entities.find(en => en.id === entityId); if (ent && canvasRef.current) { const { width: cw, height: ch } = canvasRef.current.getBoundingClientRect(); setVp(v => ({ ...v, x: -(ent.x - cw / 2 / v.scale) * v.scale + cw / 2 - W * v.scale / 2, y: -(ent.y - ch / 2 / v.scale) * v.scale + ch / 2 - entH(ent) * v.scale / 2 })); } } },
          { label: '', action: () => {}, separator: true },
          { label: 'Delete table', action: () => deleteEntity(entityId), danger: true },
        ],
      });
    } else {
      setContextMenu({
        x: e.clientX, y: e.clientY,
        items: [
          { label: 'Add table here', action: () => { const id = uid(); const color = COLORS[state.entities.length % COLORS.length]; const canvasX = (e.clientX - (canvasRef.current?.getBoundingClientRect().left ?? 0) - vp.x) / vp.scale; const canvasY = (e.clientY - (canvasRef.current?.getBoundingClientRect().top ?? 0) - vp.y) / vp.scale; const ent: Entity = { id, name: 'new_table', color, collapsed: false, x: canvasX, y: canvasY, fields: [{ id: uid(), name: 'id', type: 'UUID', isPrimary: true, isNullable: false, isUnique: true, isForeign: false }] }; setState(s => ({ ...s, entities: [...s.entities, ent] })); setSelId(id); setSelType('entity'); setSelectedIds([id]); setEditingId(id); setEditingName('new_table'); } },
          { label: 'Auto layout', action: () => setState(s => ({ ...s, entities: autoLayout(s.entities, s.relationships) })) },
          { label: 'Fit all', action: fitAll },
          { label: '', action: () => {}, separator: true },
          { label: `Grid snap: ${snapGrid ? 'on' : 'off'}`, action: () => setSnapGrid(v => !v) },
          { label: `Focus mode: ${focusMode ? 'on' : 'off'}`, action: () => setFocusMode(v => !v) },
        ],
      });
    }
  }, [state, vp, snapGrid, focusMode, duplicateEntity, deleteEntity, setState, fitAll]);

  const handleEntDown = useCallback((e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (connecting) return; // clicks handled in handleEntClick to avoid drag interference
    dragEnt.current = id;
    dragAll.current = selectedIds.includes(id) && selectedIds.length > 1;
    didMove.current = false;
    dragLast.current = { x: e.clientX, y: e.clientY };
    preDragState.current = state;
  }, [connecting, selectedIds, state]);

  const handleEntClick = useCallback((e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (didMove.current) return;
    if (connecting) {
      if (!connecting.fromId) {
        setConnecting({ type: connecting.type, fromId: id });
      } else if (connecting.fromId !== id) {
        connectEnts(connecting.fromId, id, connecting.type);
        setConnecting(null);
      }
      return;
    }
    if (e.shiftKey) {
      setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    } else {
      setSelId(id); setSelType('entity'); setSelectedIds([id]);
    }
  }, [connecting, connectEnts]);

  const handleEntDblClick = useCallback((e: React.MouseEvent, entity: Entity) => {
    e.stopPropagation();
    if (connecting) return;
    setSelId(entity.id); setSelType('entity'); setSelectedIds([entity.id]);
    setEditingId(entity.id); setEditingName(entity.name);
  }, [connecting]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.1 : 1 / 1.1;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    setVp(v => {
      const newScale = Math.min(Math.max(v.scale * factor, 0.15), 3);
      const ratio = newScale / v.scale;
      return { scale: newScale, x: mx - (mx - v.x) * ratio, y: my - (my - v.y) * ratio };
    });
  }, []);

  // ─── Project management ───────────────────────────────────────────────────────

  const switchProject = useCallback((id: string) => {
    const proj = projects.find(p => p.id === id);
    if (!proj) return;
    undoStack.current = []; redoStack.current = [];
    _setState(proj.state);
    setCurrentId(id);
    localStorage.setItem(CUR_KEY, id);
    setSelId(null); setSelType(null); setSelectedIds([]);
    setVp({ x: 40, y: 40, scale: 1 });
  }, [projects]);

  const createProject = useCallback(() => {
    const p: Project = { id: uid(), name: 'New ERD', updatedAt: Date.now(), state: { entities: [], relationships: [] } };
    const next = [...projects, p];
    setProjects(next); saveProjects(next);
    switchProject(p.id);
  }, [projects, switchProject]);

  const renameProject = useCallback((id: string, name: string) => {
    const next = projects.map(p => p.id === id ? { ...p, name } : p);
    setProjects(next); saveProjects(next);
  }, [projects]);

  const deleteProject = useCallback((id: string) => {
    if (projects.length <= 1) return;
    const next = projects.filter(p => p.id !== id);
    setProjects(next); saveProjects(next);
    if (id === currentId) switchProject(next[0].id);
  }, [projects, currentId, switchProject]);

  // ─── Command palette commands ─────────────────────────────────────────────────

  const commands = useMemo((): Command[] => [
    { id: 'add-table', label: 'Add Table', shortcut: '⌘N', category: 'Edit', action: () => { addEntity(); } },
    { id: 'auto-layout', label: 'Auto Layout', category: 'View', action: () => setState(s => ({ ...s, entities: autoLayout(s.entities, s.relationships) })) },
    { id: 'fit-all', label: 'Fit All to Screen', shortcut: '⌘⇧H', category: 'View', action: fitAll },
    { id: 'undo', label: 'Undo', shortcut: '⌘Z', category: 'Edit', action: undo },
    { id: 'redo', label: 'Redo', shortcut: '⌘Y', category: 'Edit', action: redo },
    { id: 'select-all', label: 'Select All Tables', shortcut: '⌘A', category: 'Edit', action: () => setSelectedIds(state.entities.map(e => e.id)) },
    { id: 'find', label: 'Find Tables & Fields', shortcut: '⌘F', category: 'Tools', action: () => setShowSearch(true) },
    { id: 'find-replace', label: 'Find & Replace', shortcut: '⌘H', category: 'Tools', action: () => setShowFindReplace(true) },
    { id: 'export-panel', label: 'Open Export Panel', shortcut: '⌘E', category: 'Export', action: () => setShowSQL(true) },
    { id: 'export-svg', label: 'Export SVG', category: 'Export', action: () => exportSVG(state) },
    { id: 'export-png', label: 'Export PNG', category: 'Export', action: () => exportPNG(state) },
    { id: 'share-url', label: 'Copy Share URL', shortcut: '⌘S', category: 'Share', action: handleShareURL },
    { id: 'focus-mode', label: `Focus Mode: ${focusMode ? 'Off' : 'On'}`, shortcut: 'F', category: 'View', action: () => setFocusMode(v => !v) },
    { id: 'snap-grid', label: `Grid Snap: ${snapGrid ? 'Off' : 'On'}`, shortcut: 'G', category: 'View', action: () => setSnapGrid(v => !v) },
    { id: 'shortcuts', label: 'Keyboard Shortcuts', shortcut: '?', category: 'Help', action: () => setShowShortcuts(true) },
    ...(selectedIds.length > 1 ? [
      { id: 'align-left', label: 'Align Left', category: 'Align', action: () => alignSelected('left') },
      { id: 'align-center-h', label: 'Align Center (H)', category: 'Align', action: () => alignSelected('center-h') },
      { id: 'align-right', label: 'Align Right', category: 'Align', action: () => alignSelected('right') },
      { id: 'align-top', label: 'Align Top', category: 'Align', action: () => alignSelected('top') },
      { id: 'align-middle-v', label: 'Align Middle (V)', category: 'Align', action: () => alignSelected('middle-v') },
      { id: 'align-bottom', label: 'Align Bottom', category: 'Align', action: () => alignSelected('bottom') },
      { id: 'distribute-h', label: 'Distribute Horizontally', category: 'Align', action: () => distributeSelected('h') },
      { id: 'distribute-v', label: 'Distribute Vertically', category: 'Align', action: () => distributeSelected('v') },
      { id: 'group-create', label: 'Create Group from Selection', category: 'Align', action: createGroup },
    ] : []),
  ], [addEntity, setState, fitAll, undo, redo, state, handleShareURL, focusMode, snapGrid, selectedIds, alignSelected, distributeSelected, createGroup]);

  // ─── Render helpers ───────────────────────────────────────────────────────────

  const canvasW = canvasRef.current?.clientWidth ?? 800;
  const canvasH = canvasRef.current?.clientHeight ?? 600;

  // ─── Render ───────────────────────────────────────────────────────────────────

  // Presentation mode: render minimal
  if (presentationMode) {
    return (
      <div
        style={{ position: 'fixed', inset: 0, zIndex: 100, background: T.bg, cursor: 'default' }}
        onWheel={handleWheel}
      >
        <div
          ref={canvasRef}
          style={{ position: 'absolute', inset: 0 }}
          onMouseDown={handleCanvasDown}
        >
          <svg className="absolute inset-0 pointer-events-none" style={{ width: '100%', height: '100%' }}>
            <defs>
              <pattern id="erd-dots-p" width={24 * vp.scale} height={24 * vp.scale}
                patternUnits="userSpaceOnUse"
                x={vp.x % (24 * vp.scale)} y={vp.y % (24 * vp.scale)}>
                <circle cx={12 * vp.scale} cy={12 * vp.scale} r={1} fill={T.dotColor} />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#erd-dots-p)" />
          </svg>
          <div style={{ position: 'absolute', top: 0, left: 0, transform: `translate(${vp.x}px,${vp.y}px) scale(${vp.scale})`, transformOrigin: '0 0' }}>
            <GroupsLayer state={state} />
            {/* Relationships */}
            {(() => {
              const validRels = state.relationships.flatMap(r => {
                const fe = state.entities.find(e => e.id === r.from);
                const te = state.entities.find(e => e.id === r.to);
                if (!fe || !te) return [];
                return [{ id: r.id, from: fe, aField: r.fromField, to: te, bField: r.toField, midXOverride: r.midX, midYOverride: r.midY }];
              });
              const paths = resolveRelPaths(validRels);
              return (
                <svg style={{ position: 'absolute', top: 0, left: 0, width: 1, height: 1, overflow: 'visible', pointerEvents: 'none' }}>
                  <defs>{/* same markers */}</defs>
                  {state.relationships.map(r => {
                    const p = paths.get(r.id);
                    if (!p) return null;
                    const { d } = p;
                    return <path key={r.id} d={d} fill="none" stroke={darkMode ? '#475569' : '#c8d3e0'} strokeWidth={1.5} />;
                  })}
                </svg>
              );
            })()}
            {/* Entities */}
            {state.entities.map(entity => (
              <div key={entity.id} className="erd-ent absolute" style={{ left: entity.x, top: entity.y, width: W }}>
                <div style={{ borderRadius: 10, overflow: 'hidden', background: T.entityBg, border: `1.5px solid ${T.entityBorder}`, boxShadow: '0 1px 8px -2px rgba(0,0,0,0.06)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px', height: HEADER_H, background: entity.color + '0e', borderBottom: `1px solid ${entity.color}20` }}>
                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: entity.color }} />
                    <span style={{ flex: 1, fontSize: 12, fontWeight: 600, fontFamily: 'ui-monospace,monospace', color: T.entityText, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{entity.name}</span>
                  </div>
                  {!entity.collapsed && (
                    <div style={{ padding: `${FIELD_PAD}px 0` }}>
                      {entity.fields.map((field, i) => (
                        <div key={field.id} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0 12px', height: FIELD_H, borderTop: i > 0 ? `1px solid ${T.fieldBorder}` : undefined }}>
                          <span style={{ fontSize: 8.5, fontWeight: 700, width: 14, flexShrink: 0, color: field.isPrimary ? '#f59e0b' : field.isForeign ? '#06b6d4' : 'transparent' }}>{field.isPrimary ? 'PK' : field.isForeign ? 'FK' : 'xx'}</span>
                          <span style={{ fontSize: 11.5, fontFamily: 'ui-monospace,monospace', color: field.isPrimary ? T.text : T.textMuted, fontWeight: field.isPrimary ? 600 : 400, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{field.name}</span>
                          <span style={{ fontSize: 9.5, fontFamily: 'ui-monospace,monospace', color: T.textFaint, flexShrink: 0 }}>{field.type.replace(/\(.*\)$/, '')}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Exit button */}
        <button
          onClick={() => setPresentationMode(false)}
          style={{ position: 'absolute', top: 16, right: 16, padding: '6px 14px', borderRadius: 8, background: T.surface, border: `1px solid ${T.border}`, color: T.textMuted, fontSize: 11, cursor: 'pointer' }}>
          Esc — 나가기
        </button>
        <div style={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)', fontSize: 10, color: T.textFaint }}>
          P키 또는 Esc로 나가기 · 스크롤로 줌 · 미들버튼 드래그로 이동
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 56px)', background: T.bg }}>

      {/* ── Toolbar ── */}
      <div
        className="flex items-center gap-0.5 px-3 py-1.5 shrink-0"
        style={{ background: T.surface, borderBottom: `1px solid ${T.border}`, height: 44 }}
      >
        {/* Project picker */}
        <button
          onClick={() => setShowProjects(v => !v)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all hover:bg-gray-50"
          style={{ color: '#334155', maxWidth: 160 }}
        >
          <FolderOpen size={13} style={{ color: '#94a3b8', flexShrink: 0 }} />
          <span className="truncate">{currentProject?.name ?? 'ERD'}</span>
          <ChevronDown size={11} style={{ color: '#94a3b8', flexShrink: 0 }} />
        </button>

        <div className="w-px h-4 mx-1" style={{ background: T.border }} />

        <ToolBtn onClick={addEntity} icon={<Plus size={13} />} label="Add Table" title="Add Table" />
        <ToolBtn
          onClick={() => setState(s => ({ ...s, entities: autoLayout(s.entities, s.relationships) }))}
          icon={<LayoutGrid size={13} />}
          label="Auto Layout"
          title="Auto Layout"
        />

        <div className="w-px h-4 mx-1" style={{ background: T.border }} />

        <ToolBtn onClick={undo} icon={<Undo2 size={13} />} disabled={undoStack.current.length === 0} title="Undo (⌘Z)" />
        <ToolBtn onClick={redo} icon={<Redo2 size={13} />} disabled={redoStack.current.length === 0} title="Redo (⌘Y)" />

        {/* Alignment tools (only when multi-select) */}
        {selectedIds.length > 1 && (
          <>
            <div className="w-px h-4 mx-1" style={{ background: T.border }} />
            <ToolBtn onClick={() => alignSelected('left')} icon={<AlignLeft size={13} />} title="Align Left" />
            <ToolBtn onClick={() => alignSelected('center-h')} icon={<AlignCenter size={13} />} title="Align Center (H)" />
            <ToolBtn onClick={() => alignSelected('right')} icon={<AlignRight size={13} />} title="Align Right" />
            <div className="w-px h-4 mx-0.5" style={{ background: T.border }} />
            <ToolBtn onClick={() => alignSelected('top')} icon={<AlignStartVertical size={13} />} title="Align Top" />
            <ToolBtn onClick={() => alignSelected('middle-v')} icon={<AlignCenterVertical size={13} />} title="Align Middle (V)" />
            <ToolBtn onClick={() => alignSelected('bottom')} icon={<AlignEndVertical size={13} />} title="Align Bottom" />
            {selectedIds.length >= 3 && (
              <>
                <div className="w-px h-4 mx-0.5" style={{ background: T.border }} />
                <ToolBtn onClick={() => distributeSelected('h')} icon={<AlignCenter size={13} />} title="Distribute H" label="H" />
                <ToolBtn onClick={() => distributeSelected('v')} icon={<AlignCenterVertical size={13} />} title="Distribute V" label="V" />
              </>
            )}
          </>
        )}

        {connecting && (
          <div className="flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-medium ml-1"
            style={{ background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe' }}>
            <GitBranch size={11} />
            <span className="font-bold">{connecting.type}</span>
            {!connecting.fromId ? '— 첫 테이블 선택' : '— 두 번째 테이블 선택'}
            <button onClick={() => setConnecting(null)} className="ml-0.5 opacity-60 hover:opacity-100">✕</button>
          </div>
        )}

        {selectedIds.length > 1 && !connecting && (
          <span className="text-xs px-2.5 py-1 rounded-lg ml-1" style={{ background: '#f1f5f9', color: '#64748b' }}>
            {selectedIds.length} selected
          </span>
        )}

        <div className="flex-1" />

        {/* Canvas mode */}
        <div className="flex items-center rounded-lg overflow-hidden" style={{ border: `1px solid ${T.border}` }}>
          <button
            onClick={() => setCanvasMode('pan')}
            title="Pan mode (H) — drag to move canvas"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 28, height: 26, cursor: 'pointer', transition: 'all 0.1s',
              background: canvasMode === 'pan' ? '#3b82f6' : T.surface,
              color: canvasMode === 'pan' ? '#fff' : T.textMuted,
              border: 'none',
            }}
          >
            <Hand size={13} />
          </button>
          <button
            onClick={() => setCanvasMode('select')}
            title="Select mode (V) — drag to select"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 28, height: 26, cursor: 'pointer', transition: 'all 0.1s',
              background: canvasMode === 'select' ? '#3b82f6' : T.surface,
              color: canvasMode === 'select' ? '#fff' : T.textMuted,
              border: 'none',
            }}
          >
            <MousePointer2 size={13} />
          </button>
        </div>

        <div className="w-px h-4 mx-1" style={{ background: T.border }} />

        {/* Feature toggles */}
        <ToolBtn
          onClick={() => setFocusMode(v => !v)}
          icon={<Focus size={13} />}
          active={focusMode}
          title={`Focus Mode (F) — ${focusMode ? 'on' : 'off'}`}
        />
        <ToolBtn
          onClick={() => setSnapGrid(v => !v)}
          icon={<Grid size={13} />}
          active={snapGrid}
          title={`Grid Snap (G) — ${snapGrid ? 'on' : 'off'}`}
        />

        <div className="w-px h-4 mx-1" style={{ background: T.border }} />

        <ToolBtn onClick={() => setShowSearch(true)} icon={<Search size={13} />} title="Search (⌘F)" />
        <ToolBtn onClick={() => setShowCommandPalette(true)} icon={<Terminal size={13} />} title="Command Palette (⌘K)" />
        <ToolBtn onClick={() => setShowShortcuts(true)} icon={<Keyboard size={13} />} title="Keyboard Shortcuts (?)" />

        <div className="w-px h-4 mx-1" style={{ background: T.border }} />

        <div className="flex items-center gap-0.5">
          <ToolBtn onClick={() => setVp(v => ({ ...v, scale: Math.min(v.scale * 1.25, 3) }))} icon={<ZoomIn size={13} />} title="Zoom In" />
          <span className="text-xs font-mono tabular-nums w-10 text-center" style={{ color: '#94a3b8' }}>
            {Math.round(vp.scale * 100)}%
          </span>
          <ToolBtn onClick={() => setVp(v => ({ ...v, scale: Math.max(v.scale / 1.25, 0.15) }))} icon={<ZoomOut size={13} />} title="Zoom Out" />
          <ToolBtn onClick={fitAll} icon={<Maximize2 size={13} />} title="Fit All" />
        </div>

        <div className="w-px h-4 mx-1" style={{ background: T.border }} />

        <ToolBtn onClick={() => setShowAI(true)} icon={<Sparkles size={13} />} label="AI" title="AI 스키마 생성" />
        <ToolBtn
          onClick={() => {
            setSnapshot(state);
            setSnapshotSaved(true);
            setTimeout(() => setSnapshotSaved(false), 2000);
          }}
          icon={<Camera size={12} />}
          label={snapshotSaved ? '저장됨!' : '스냅샷'}
          active={snapshotSaved}
          title="마이그레이션 SQL용 스냅샷 저장"
        />

        <div className="w-px h-4 mx-1" style={{ background: T.border }} />

        <ToolBtn onClick={() => setShowSQL(true)} icon={<Code size={13} />} label="Export" title="Export / Import (⌘E)" />
        <ToolBtn onClick={() => exportSVG(state)} icon={<Download size={12} />} label="SVG" title="Export SVG" />
        <ToolBtn onClick={() => exportPNG(state)} icon={<Download size={12} />} label="PNG" title="Export PNG" />
        <ToolBtn
          onClick={handleShareURL}
          icon={<Share2 size={12} />}
          label={shareCopied ? 'Copied!' : 'Share'}
          active={shareCopied}
          title="Copy shareable URL (⌘S)"
        />

        <div className="w-px h-4 mx-1" style={{ background: T.border }} />

        <ToolBtn onClick={() => setPresentationMode(true)} icon={<Presentation size={12} />} title="프레젠테이션 모드 (P)" />
        <ToolBtn onClick={() => setDarkMode(v => !v)} icon={darkMode ? <Sun size={12} /> : <Moon size={12} />} active={darkMode} title="다크 모드 (D)" />
        <ToolBtn
          onClick={() => confirm('Demo 데이터로 초기화할까요?') && (() => { setState(DEMO); setVp({ x: 40, y: 40, scale: 1 }); })()}
          icon={<RotateCcw size={12} />}
          title="Reset to Demo"
        />
      </div>

      {/* ── Canvas + Panel ── */}
      <div className="flex-1 flex overflow-hidden relative">

        {/* Canvas */}
        <div
          ref={canvasRef}
          className="flex-1 relative overflow-hidden"
          style={{ cursor: connecting ? 'crosshair' : canvasMode === 'pan' ? 'grab' : 'crosshair' }}
          onMouseDown={handleCanvasDown}
          onWheel={handleWheel}
          onContextMenu={handleCanvasRightClick}
        >
          {/* Dot grid */}
          <svg className="absolute inset-0 pointer-events-none" style={{ width: '100%', height: '100%' }}>
            <defs>
              <pattern id="erd-dots" width={24 * vp.scale} height={24 * vp.scale}
                patternUnits="userSpaceOnUse"
                x={vp.x % (24 * vp.scale)} y={vp.y % (24 * vp.scale)}>
                <circle cx={12 * vp.scale} cy={12 * vp.scale} r={snapGrid ? 1.5 : 1} fill={snapGrid ? (darkMode ? '#4b6080' : '#c7d2e0') : T.dotColor} />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#erd-dots)" />
          </svg>

          {/* Transform layer */}
          <div style={{
            position: 'absolute', top: 0, left: 0,
            transform: `translate(${vp.x}px,${vp.y}px) scale(${vp.scale})`,
            transformOrigin: '0 0',
          }}>
            {/* Groups background layer */}
            <GroupsLayer state={state} onUpdate={groups => setState(s => ({ ...s, groups }))} />

            {/* Relationships — orthogonal routed, conflict-resolved with crow's foot notation */}
            {(() => {
              const validRels = state.relationships.flatMap(r => {
                const fe = state.entities.find(e => e.id === r.from);
                const te = state.entities.find(e => e.id === r.to);
                if (!fe || !te) return [];
                return [{ id: r.id, from: fe, aField: r.fromField, to: te, bField: r.toField, midXOverride: r.midX, midYOverride: r.midY }];
              });
              const paths = resolveRelPaths(validRels);

              return (
                <svg style={{ position: 'absolute', top: 0, left: 0, width: 1, height: 1, overflow: 'visible', pointerEvents: 'none' }}>

                  {state.relationships.map(r => {
                    const p = paths.get(r.id);
                    if (!p) return null;
                    const { d, x1, y1, x2, y2, midX, midY, goRight } = p;
                    const isSel = selId === r.id;
                    const focusDim = focusedEntityIds && !focusedEntityIds.has(r.from) && !focusedEntityIds.has(r.to);
                    const color = isSel ? '#3b82f6' : darkMode ? '#64748b' : '#c8d3e0';

                    // Cardinality: from-side and to-side
                    const fromMany = r.type === 'N:M';
                    const toMany = r.type !== '1:1';

                    // Text label positions (offset toward path center)
                    const fromLabelX = x1 + (goRight ? 18 : -18);
                    const toLabelX   = x2 + (goRight ? -18 : 18);
                    const labelOffsetY = -8;

                    const isHovRel = hovRelId === r.id;
                    const showHandle = isSel || isHovRel;

                    return (
                      <g key={r.id}
                        style={{ pointerEvents: 'auto', opacity: focusDim ? 0.08 : 1, transition: 'opacity 0.2s' }}
                        onMouseEnter={() => setHovRelId(r.id)}
                        onMouseLeave={() => setHovRelId(null)}
                        onMouseDown={ev => {
                          ev.stopPropagation();
                          preDragState.current = state;
                          dragRel.current = { id: r.id, startMidX: midX, startClientX: ev.clientX, startMidY: midY, startClientY: ev.clientY };
                          didMoveDragRel.current = false;
                        }}
                        onClick={ev => {
                          ev.stopPropagation();
                          if (didMoveDragRel.current) return;
                          setSelId(r.id); setSelType('relationship'); setSelectedIds([]);
                        }}
                        onContextMenu={ev => {
                          ev.preventDefault(); ev.stopPropagation();
                          setContextMenu({
                            x: ev.clientX, y: ev.clientY,
                            items: [
                              { label: 'Edit relationship', action: () => { setSelId(r.id); setSelType('relationship'); } },
                              ...(r.midX !== undefined || r.midY !== undefined ? [{ label: 'Reset line position', action: () => updateRel(r.id, { midX: undefined, midY: undefined }) }] : []),
                              { label: '', action: () => {}, separator: true },
                              { label: 'Delete relationship', action: () => deleteRel(r.id), danger: true },
                            ],
                          });
                        }}
                      >
                        {/* Fat draggable hit area */}
                        <path d={d} fill="none" stroke="transparent" strokeWidth={18}
                          style={{ cursor: showHandle ? 'move' : 'pointer' }} />
                        {/* Visible path */}
                        <path
                          d={d}
                          fill="none"
                          stroke={color}
                          strokeWidth={isSel ? 2 : 1.5}
                          strokeLinejoin="round"
                          style={{ pointerEvents: 'none' }}
                        />
                        {/* From-side notation: crow's foot (many) or bar (one) */}
                        {(() => {
                          const dir = goRight ? 1 : -1;
                          const L = 12, S = 6;
                          if (fromMany) return (
                            <>
                              <line x1={x1} y1={y1} x2={x1+dir*L} y2={y1-S} stroke={color} strokeWidth={1.5} strokeLinecap="round" style={{ pointerEvents: 'none' }} />
                              <line x1={x1} y1={y1} x2={x1+dir*L} y2={y1}   stroke={color} strokeWidth={1.5} strokeLinecap="round" style={{ pointerEvents: 'none' }} />
                              <line x1={x1} y1={y1} x2={x1+dir*L} y2={y1+S} stroke={color} strokeWidth={1.5} strokeLinecap="round" style={{ pointerEvents: 'none' }} />
                            </>
                          );
                          return <line x1={x1} y1={y1-8} x2={x1} y2={y1+8} stroke={color} strokeWidth={isSel ? 2 : 1.5} strokeLinecap="round" style={{ pointerEvents: 'none' }} />;
                        })()}
                        {/* To-side notation: crow's foot (many) or bar (one) */}
                        {(() => {
                          const dir = goRight ? -1 : 1;
                          const L = 12, S = 6;
                          if (toMany) return (
                            <>
                              <line x1={x2} y1={y2} x2={x2+dir*L} y2={y2-S} stroke={color} strokeWidth={1.5} strokeLinecap="round" style={{ pointerEvents: 'none' }} />
                              <line x1={x2} y1={y2} x2={x2+dir*L} y2={y2}   stroke={color} strokeWidth={1.5} strokeLinecap="round" style={{ pointerEvents: 'none' }} />
                              <line x1={x2} y1={y2} x2={x2+dir*L} y2={y2+S} stroke={color} strokeWidth={1.5} strokeLinecap="round" style={{ pointerEvents: 'none' }} />
                            </>
                          );
                          return <line x1={x2} y1={y2-8} x2={x2} y2={y2+8} stroke={color} strokeWidth={isSel ? 2 : 1.5} strokeLinecap="round" style={{ pointerEvents: 'none' }} />;
                        })()}
                        {/* Drag handle on vertical segment — shown on hover/select */}
                        {showHandle && Math.abs(y2 - y1) > 20 && (
                          <g style={{ pointerEvents: 'none' }}>
                            <rect
                              x={midX - 6} y={midY - 8} width={12} height={16} rx={3}
                              fill="#fff" stroke={isSel ? '#3b82f6' : '#c8d3e0'} strokeWidth={1}
                            />
                            {/* Grip lines */}
                            <line x1={midX - 2} y1={midY - 4} x2={midX - 2} y2={midY + 4}
                              stroke={isSel ? '#3b82f6' : '#c8d3e0'} strokeWidth={1.2} strokeLinecap="round" />
                            <line x1={midX + 2} y1={midY - 4} x2={midX + 2} y2={midY + 4}
                              stroke={isSel ? '#3b82f6' : '#c8d3e0'} strokeWidth={1.2} strokeLinecap="round" />
                          </g>
                        )}
                        {/* Cardinality labels at each endpoint */}
                        <text x={fromLabelX} y={y1 + labelOffsetY} textAnchor="middle"
                          fontSize={9} fontFamily="ui-monospace,monospace" fontWeight="700"
                          fill={isSel ? '#2563eb' : darkMode ? '#64748b' : '#94a3b8'} style={{ pointerEvents: 'none' }}>
                          {fromMany ? 'N' : '1'}
                        </text>
                        <text x={toLabelX} y={y2 + labelOffsetY} textAnchor="middle"
                          fontSize={9} fontFamily="ui-monospace,monospace" fontWeight="700"
                          fill={isSel ? '#2563eb' : darkMode ? '#64748b' : '#94a3b8'} style={{ pointerEvents: 'none' }}>
                          {toMany ? 'N' : '1'}
                        </text>
                        {r.label && (
                          <text x={midX} y={midY - 12} textAnchor="middle"
                            fontSize={9} fill={isSel ? '#60a5fa' : '#b0bccf'} style={{ pointerEvents: 'none' }}>
                            {r.label}
                          </text>
                        )}
                        {r.fromField && <circle cx={x1} cy={y1} r={3.5} fill={color} stroke="#fff" strokeWidth={1} style={{ pointerEvents: 'none' }} />}
                        {r.toField && <circle cx={x2} cy={y2} r={3.5} fill={color} stroke="#fff" strokeWidth={1} style={{ pointerEvents: 'none' }} />}
                      </g>
                    );
                  })}
                </svg>
              );
            })()}

            {/* Smart guides */}
            {guides.length > 0 && (
              <svg style={{ position: 'absolute', top: 0, left: 0, width: 1, height: 1, overflow: 'visible', pointerEvents: 'none' }}>
                {guides.map((g, i) => g.x !== undefined
                  ? <line key={i} x1={g.x} y1={-9999} x2={g.x} y2={9999} stroke="#f97316" strokeWidth={1} strokeDasharray="4,3" opacity={0.7} />
                  : <line key={i} x1={-9999} y1={g.y!} x2={9999} y2={g.y!} stroke="#f97316" strokeWidth={1} strokeDasharray="4,3" opacity={0.7} />
                )}
              </svg>
            )}

            {/* Entity cards */}
            {state.entities.map(entity => {
              const isSel = selId === entity.id || selectedIds.includes(entity.id);
              const isMultiSel = selectedIds.includes(entity.id) && selectedIds.length > 1;
              const isConnFrom = connecting?.fromId === entity.id;
              const isConnectable = connecting !== null && connecting.fromId !== entity.id;
              const isHov = hovEnt === entity.id;
              const isEditing = editingId === entity.id;
              const focusDim = focusedEntityIds && !focusedEntityIds.has(entity.id);

              return (
                <div
                  key={entity.id}
                  className="erd-ent absolute"
                  data-entity-id={entity.id}
                  style={{ left: entity.x, top: entity.y, width: W, userSelect: 'none', opacity: focusDim ? 0.12 : 1, transition: 'opacity 0.2s' }}
                  onMouseDown={e => handleEntDown(e, entity.id)}
                  onClick={e => handleEntClick(e, entity.id)}
                  onDoubleClick={e => handleEntDblClick(e, entity)}
                  onMouseEnter={() => setHovEnt(entity.id)}
                  onMouseLeave={() => setHovEnt(null)}
                >
                  <div style={{
                    borderRadius: 10, overflow: 'hidden', background: T.entityBg,
                    border: `1.5px solid ${isConnFrom ? '#22c55e' : isSel ? entity.color : isConnectable ? '#93c5fd' : T.entityBorder}`,
                    boxShadow: isConnFrom
                      ? '0 0 0 3px #22c55e33, 0 4px 20px -4px rgba(0,0,0,0.15)'
                      : isSel
                        ? `0 0 0 3px ${entity.color}22, 0 4px 20px -4px rgba(0,0,0,0.15)`
                        : isMultiSel ? `0 0 0 2px ${entity.color}44` : darkMode ? '0 2px 10px rgba(0,0,0,0.3)' : '0 1px 8px -2px rgba(0,0,0,0.06)',
                    cursor: connecting ? (isConnectable || isConnFrom ? 'crosshair' : 'default') : 'move',
                    transition: 'border-color 0.12s, box-shadow 0.12s',
                  }}>
                    {/* Header */}
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '0 12px', height: HEADER_H,
                      background: entity.color + '0e',
                      borderBottom: `1px solid ${entity.color}20`,
                    }}>
                      <div style={{ width: 7, height: 7, borderRadius: '50%', background: entity.color, flexShrink: 0 }} />

                      {isEditing ? (
                        <input
                          autoFocus
                          value={editingName}
                          onChange={e => setEditingName(e.target.value)}
                          onBlur={commitName}
                          onKeyDown={e => { if (e.key === 'Enter') commitName(); if (e.key === 'Escape') setEditingId(null); }}
                          onMouseDown={e => e.stopPropagation()}
                          onClick={e => e.stopPropagation()}
                          style={{
                            flex: 1, background: T.inputBg, border: `1px solid ${entity.color}`,
                            borderRadius: 4, padding: '2px 6px',
                            fontSize: 12, fontWeight: 600, fontFamily: 'ui-monospace,monospace',
                            color: T.text, outline: 'none', minWidth: 0,
                          }}
                        />
                      ) : (
                        <span style={{
                          flex: 1, fontSize: 12, fontWeight: 600,
                          fontFamily: 'ui-monospace,monospace', color: T.entityText,
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>
                          {entity.name}
                        </span>
                      )}

                      {(isSel || isHov) && !isEditing && (
                        <button
                          onMouseDown={e => e.stopPropagation()}
                          onClick={e => { e.stopPropagation(); updateEntity(entity.id, { collapsed: !entity.collapsed }); }}
                          style={{
                            width: 16, height: 16, flexShrink: 0, border: 'none', background: 'transparent',
                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: T.textFaint, fontSize: 9, fontWeight: 700,
                          }}>
                          {entity.collapsed ? '▼' : '▲'}
                        </button>
                      )}
                    </div>

                    {/* Fields */}
                    {!entity.collapsed && (
                      <div style={{ padding: `${FIELD_PAD}px 0` }}>
                        {entity.fields.length === 0 && (
                          <div style={{ padding: '6px 12px', fontSize: 11, color: T.textFaint, fontStyle: 'italic' }}>No fields</div>
                        )}
                        {entity.fields.map((field, i) => {
                          const isConnField = selRel && (
                            (selRel.from === entity.id && selRel.fromField === field.id) ||
                            (selRel.to === entity.id && selRel.toField === field.id)
                          );
                          const isInlineEditing = inlineEdit?.entityId === entity.id && inlineEdit.fieldId === field.id;

                          return (
                            <div key={field.id} style={{
                              display: 'flex', alignItems: 'center', gap: 6,
                              padding: '0 12px', height: FIELD_H,
                              borderTop: i > 0 ? `1px solid ${T.fieldBorder}` : undefined,
                              background: isConnField ? `${entity.color}0a` : isInlineEditing ? `${entity.color}08` : undefined,
                            }}
                              onDoubleClick={e => {
                                e.stopPropagation();
                                setInlineEdit({ entityId: entity.id, fieldId: field.id, field: 'name', value: field.name });
                              }}
                            >
                              <span style={{
                                fontSize: 8.5, fontWeight: 700, width: 14, flexShrink: 0,
                                color: field.isPrimary ? '#f59e0b' : field.isForeign ? '#06b6d4' : 'transparent',
                              }}>
                                {field.isPrimary ? 'PK' : field.isForeign ? 'FK' : 'xx'}
                              </span>
                              {isInlineEditing && inlineEdit?.field === 'name' ? (
                                <input
                                  autoFocus
                                  value={inlineEdit.value}
                                  onChange={e => setInlineEdit(prev => prev ? { ...prev, value: e.target.value } : null)}
                                  onBlur={() => {
                                    if (inlineEdit) updateField(entity.id, field.id, { name: inlineEdit.value.trim() || field.name });
                                    setInlineEdit(null);
                                  }}
                                  onKeyDown={e => {
                                    if (e.key === 'Enter') { e.stopPropagation(); updateField(entity.id, field.id, { name: inlineEdit.value.trim() || field.name }); setInlineEdit(null); }
                                    if (e.key === 'Tab') { e.preventDefault(); e.stopPropagation(); updateField(entity.id, field.id, { name: inlineEdit.value.trim() || field.name }); setInlineEdit({ entityId: entity.id, fieldId: field.id, field: 'type', value: field.type }); }
                                    if (e.key === 'Escape') { e.stopPropagation(); setInlineEdit(null); }
                                  }}
                                  onMouseDown={e => e.stopPropagation()}
                                  onClick={e => e.stopPropagation()}
                                  style={{ flex: 1, fontSize: 11.5, fontFamily: 'ui-monospace,monospace', fontWeight: field.isPrimary ? 600 : 400, background: 'transparent', border: 'none', outline: `1px solid ${entity.color}`, borderRadius: 3, padding: '0 3px', color: T.entityText, minWidth: 0 }}
                                />
                              ) : (
                                <span style={{
                                  fontSize: 11.5, fontFamily: 'ui-monospace,monospace',
                                  color: field.isPrimary ? T.text : T.textMuted,
                                  fontWeight: field.isPrimary ? 600 : 400,
                                  flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                }}>
                                  {field.name}
                                </span>
                              )}
                              {isInlineEditing && inlineEdit?.field === 'type' ? (
                                <select
                                  autoFocus
                                  value={inlineEdit.value}
                                  onChange={e => { updateField(entity.id, field.id, { type: e.target.value }); setInlineEdit(null); }}
                                  onBlur={() => setInlineEdit(null)}
                                  onKeyDown={e => { if (e.key === 'Escape') { e.stopPropagation(); setInlineEdit(null); } }}
                                  onMouseDown={e => e.stopPropagation()}
                                  style={{ fontSize: 9.5, fontFamily: 'ui-monospace,monospace', background: T.inputBg, border: `1px solid ${entity.color}`, borderRadius: 3, color: T.textMuted, flexShrink: 0, maxWidth: 100 }}>
                                  {SQL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                              ) : (
                                <span
                                  style={{ fontSize: 9.5, fontFamily: 'ui-monospace,monospace', color: T.textFaint, flexShrink: 0, cursor: 'pointer' }}
                                  onDoubleClick={e => { e.stopPropagation(); setInlineEdit({ entityId: entity.id, fieldId: field.id, field: 'type', value: field.type }); }}
                                >
                                  {field.type.replace(/\(.*\)$/, '')}
                                </span>
                              )}
                              {field.isNullable && <span style={{ fontSize: 9, color: T.textFaint, flexShrink: 0 }}>?</span>}
                              {field.description && !isInlineEditing && (
                                <span title={field.description} style={{ fontSize: 9, color: T.textFaint, flexShrink: 0, cursor: 'help' }}>ℹ</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                    {entity.description && entity.collapsed && (
                      <div style={{ padding: '4px 12px', fontSize: 10, color: T.textFaint, fontStyle: 'italic', borderTop: `1px solid ${T.fieldBorder}` }}>
                        {entity.description}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Marquee selection rectangle */}
          {marquee && (
            <div style={{
              position: 'absolute',
              left: Math.min(marquee.sx, marquee.ex) * vp.scale + vp.x,
              top: Math.min(marquee.sy, marquee.ey) * vp.scale + vp.y,
              width: Math.abs(marquee.ex - marquee.sx) * vp.scale,
              height: Math.abs(marquee.ey - marquee.sy) * vp.scale,
              border: '1.5px solid #3b82f6',
              background: '#3b82f610',
              pointerEvents: 'none',
              borderRadius: 4,
            }} />
          )}

          {/* Minimap */}
          <div style={{ position: 'absolute', bottom: 16, right: 304 }}>
            <Minimap
              state={state}
              vp={vp}
              canvasW={canvasW}
              canvasH={canvasH}
              onPan={(dx, dy) => setVp(v => ({ ...v, x: v.x + dx, y: v.y + dy }))}
            />
          </div>

          {/* FK suggestion */}
          {fkSug && (
            <FKSuggestion
              fromName={fkSug.fromFieldName}
              toName={fkSug.toEntityName}
              onAccept={() => { connectEnts(fkSug.fromEntityId, fkSug.toEntityId, '1:N'); setFkSug(null); }}
              onDismiss={() => setFkSug(null)}
            />
          )}

          {/* Connect hint */}
          {connecting && (
            <div style={{
              position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)',
              background: '#1e293b', color: '#f1f5f9',
              fontSize: 12, fontWeight: 500, padding: '8px 18px', borderRadius: 20,
              boxShadow: '0 4px 16px -4px rgba(0,0,0,0.2)',
              pointerEvents: 'none', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <span style={{
                background: '#3b82f6', color: '#fff',
                fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 4,
              }}>{connecting.type}</span>
              {!connecting.fromId
                ? <>첫 번째 테이블을 클릭하세요</>
                : <>두 번째 테이블을 클릭하세요 · <span style={{ color: '#94a3b8' }}>Esc로 취소</span></>
              }
            </div>
          )}

          {/* Empty state */}
          {state.entities.length === 0 && (
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: 8, pointerEvents: 'none',
            }}>
              <div style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500 }}>No tables yet</div>
              <div style={{ fontSize: 12, color: '#cbd5e1' }}>Click "Add Table" or right-click to get started</div>
            </div>
          )}
        </div>

        {/* ── Right panel (always visible) ── */}
        <div style={{
          width: 288, flexShrink: 0,
          borderLeft: `1px solid ${T.border}`,
          background: T.surface,
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}>
          {selEntity && (
            <EntityPanel
              entity={selEntity}
              onUpdate={u => updateEntity(selEntity.id, u)}
              onDelete={() => deleteEntity(selEntity.id)}
              onDuplicate={() => duplicateEntity(selEntity.id)}
              onAddField={() => addField(selEntity.id)}
              onUpdateField={(fid, u) => updateField(selEntity.id, fid, u)}
              onDeleteField={fid => deleteField(selEntity.id, fid)}
              onMoveField={(fid, dir) => moveField(selEntity.id, fid, dir)}
              onClose={() => { setSelId(null); setSelType(null); setSelectedIds([]); }}
            />
          )}
          {selRel && (
            <RelationshipPanel
              rel={selRel}
              entities={state.entities}
              onUpdate={u => updateRel(selRel.id, u)}
              onDelete={() => deleteRel(selRel.id)}
              onClose={() => { setSelId(null); setSelType(null); }}
            />
          )}
          {!selEntity && !selRel && (
            <RelationshipCreator
              connecting={connecting}
              onSelectType={type => setConnecting({ type })}
              onCancel={() => setConnecting(null)}
            />
          )}
        </div>
      </div>

      {/* ── Status bar ── */}
      <StatusBar
        state={state}
        vp={vp}
        warnings={lintWarnings}
        snapGrid={snapGrid}
        focusMode={focusMode}
        mousePos={mousePosDisplay}
        onEntitySelect={id => { setSelId(id); setSelType('entity'); setSelectedIds([id]); const ent = state.entities.find(e => e.id === id); if (ent && canvasRef.current) { const { width: cw, height: ch } = canvasRef.current.getBoundingClientRect(); setVp(v => ({ ...v, x: -(ent.x - cw / 2 / v.scale) * v.scale + cw / 2 - W * v.scale / 2, y: -(ent.y - ch / 2 / v.scale) * v.scale + ch / 2 - entH(ent) * v.scale / 2 })); } }}
      />

      {/* ── Modals ── */}
      {showSQL && <SQLModal state={state} snapshot={snapshot ?? undefined} onImport={newState => setState(newState)} onClose={() => setShowSQL(false)} />}
      {showSearch && (
        <SearchOverlay
          entities={state.entities}
          onSelect={id => {
            const ent = state.entities.find(e => e.id === id);
            if (!ent || !canvasRef.current) return;
            const { width: cw, height: ch } = canvasRef.current.getBoundingClientRect();
            setVp(v => ({
              ...v,
              x: -(ent.x - cw / 2 / v.scale) * v.scale + cw / 2 - W * v.scale / 2,
              y: -(ent.y - ch / 2 / v.scale) * v.scale + ch / 2 - entH(ent) * v.scale / 2,
            }));
            setSelId(id); setSelType('entity'); setSelectedIds([id]);
          }}
          onClose={() => setShowSearch(false)}
        />
      )}
      {showFindReplace && (
        <FindReplaceModal
          state={state}
          onApply={newState => setState(newState)}
          onClose={() => setShowFindReplace(false)}
        />
      )}
      {showCommandPalette && (
        <CommandPalette commands={commands} onClose={() => setShowCommandPalette(false)} />
      )}
      {showShortcuts && <ShortcutsPanel onClose={() => setShowShortcuts(false)} />}
      {showProjects && (
        <ProjectPicker
          projects={projects}
          currentId={currentId}
          onSwitch={switchProject}
          onCreate={createProject}
          onRename={renameProject}
          onDelete={deleteProject}
          onClose={() => setShowProjects(false)}
        />
      )}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          items={contextMenu.items}
          onClose={() => setContextMenu(null)}
        />
      )}
      {showAI && (
        <AISchemaModal
          onImport={newState => { setState(newState); setVp({ x: 40, y: 40, scale: 1 }); }}
          onClose={() => setShowAI(false)}
        />
      )}
    </div>
  );
}
