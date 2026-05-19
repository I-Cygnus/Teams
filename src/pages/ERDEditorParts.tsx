import { useState, useRef, useMemo } from 'react';
import { X, Trash2, Plus, Check, ChevronDown, ChevronUp, Copy, ArrowUp, ArrowDown, Database } from 'lucide-react';
import type { Entity, Field, Index, Relationship, ERDState, RelationType, EntityGroup } from './ERDEditorTypes';
import { COLORS, SQL_TYPES, entH, W, HEADER_H, FIELD_H, FIELD_PAD } from './ERDEditorTypes';

// ─── ToolBtn ──────────────────────────────────────────────────────────────────

export function ToolBtn({
  onClick, icon, label, active, danger, disabled, title,
}: {
  onClick: () => void;
  icon: React.ReactNode;
  label?: string;
  active?: boolean;
  danger?: boolean;
  disabled?: boolean;
  title?: string;
}) {
  const [hov, setHov] = useState(false);
  const bg = active ? '#eff6ff' : hov && danger ? '#fff5f5' : hov ? '#f1f5f9' : 'transparent';
  const color = active ? '#2563eb' : hov && danger ? '#ef4444' : hov ? '#334155' : '#64748b';
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all"
      style={{ background: bg, color: disabled ? '#cbd5e1' : color, cursor: disabled ? 'not-allowed' : 'pointer' }}
      onMouseEnter={() => !disabled && setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {icon}
      {label && <span>{label}</span>}
    </button>
  );
}

// ─── PanelBtn ─────────────────────────────────────────────────────────────────

export function PanelBtn({
  onClick, icon, label, danger, full,
}: {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  danger?: boolean;
  full?: boolean;
}) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all"
      style={{
        flex: full ? undefined : 1,
        width: full ? '100%' : undefined,
        background: hov ? (danger ? '#fff5f5' : '#f8fafc') : 'transparent',
        border: `1px solid ${danger ? '#fecaca' : '#e2e8f0'}`,
        color: hov ? (danger ? '#ef4444' : '#334155') : (danger ? '#f87171' : '#64748b'),
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {icon}
      {label}
    </button>
  );
}

// ─── Smart type inference ─────────────────────────────────────────────────────

export function inferFieldType(name: string): string | null {
  const n = name.toLowerCase();
  if (n === 'id' || n.endsWith('_id') || n.endsWith('_uuid')) return 'UUID';
  if (n.endsWith('_at') || n.endsWith('_time') || n === 'created_at' || n === 'updated_at' || n === 'deleted_at') return 'TIMESTAMP';
  if (n.endsWith('_date') || n === 'date' || n === 'birth_date' || n === 'due_date') return 'DATE';
  if (n === 'email' || n.endsWith('_email')) return 'VARCHAR(255)';
  if (n === 'phone' || n === 'phone_number' || n === 'mobile') return 'VARCHAR(20)';
  if (n === 'url' || n.endsWith('_url') || n === 'website' || n === 'link') return 'VARCHAR(255)';
  if (n === 'password' || n === 'password_hash' || n === 'token' || n === 'secret') return 'VARCHAR(255)';
  if (n === 'slug' || n.endsWith('_slug') || n === 'code' || n.endsWith('_code')) return 'VARCHAR(100)';
  if (n === 'name' || n.endsWith('_name') || n === 'title' || n.endsWith('_title') || n === 'label' || n === 'first_name' || n === 'last_name') return 'VARCHAR(255)';
  if (n === 'description' || n === 'content' || n === 'body' || n === 'text' || n === 'message' || n === 'note' || n === 'comment') return 'TEXT';
  if (n === 'summary' || n === 'excerpt') return 'TEXT';
  if (n.startsWith('is_') || n.startsWith('has_') || n.startsWith('can_') || n.startsWith('should_') || n === 'active' || n === 'enabled' || n === 'visible' || n === 'published') return 'BOOLEAN';
  if (n === 'price' || n === 'amount' || n === 'cost' || n === 'fee' || n === 'salary' || n === 'total' || n === 'balance') return 'DECIMAL(10,2)';
  if (n === 'count' || n === 'quantity' || n === 'stock' || n === 'position' || n === 'order' || n === 'rank' || n === 'sort' || n === 'priority') return 'INT';
  if (n === 'age' || n === 'year' || n === 'month' || n === 'day') return 'SMALLINT';
  if (n === 'rating' || n === 'score' || n === 'weight' || n === 'height' || n === 'latitude' || n === 'longitude') return 'FLOAT';
  if (n === 'metadata' || n === 'settings' || n === 'config' || n === 'data' || n === 'options' || n === 'attributes' || n === 'tags') return 'JSON';
  if (n === 'avatar' || n === 'image' || n === 'photo' || n === 'thumbnail' || n === 'cover') return 'VARCHAR(255)';
  if (n === 'color' || n.endsWith('_color')) return 'CHAR(7)';
  if (n === 'ip' || n === 'ip_address') return 'VARCHAR(45)';
  if (n === 'currency' || n.endsWith('_currency')) return 'CHAR(3)';
  if (n === 'locale' || n === 'language' || n === 'timezone') return 'VARCHAR(50)';
  if (n === 'status' || n === 'type' || n === 'role' || n === 'category' || n === 'kind') return 'ENUM';
  return null;
}

// ─── ExpandedFieldEditor ──────────────────────────────────────────────────────

function ExpandedFieldEditor({ field, entityColor, onUpdate, onDelete }: {
  field: Field;
  entityColor: string;
  isLast: boolean;
  onUpdate: (u: Partial<Field>) => void;
  onDelete: () => void;
}) {
  const [suggestion, setSuggestion] = useState<string | null>(null);

  const handleNameChange = (name: string) => {
    onUpdate({ name });
    const inferred = inferFieldType(name);
    setSuggestion(inferred && inferred !== field.type ? inferred : null);
  };

  return (
    <div className="px-2.5 pb-2.5 pt-1.5 space-y-2" style={{ background: '#f8fafc', borderTop: '1px solid #f1f5f9' }}>
      {/* Name with type suggestion */}
      <div className="space-y-1">
        <input
          className="w-full rounded px-2 py-1.5 text-xs font-mono focus:outline-none"
          style={{ background: '#fff', border: '1px solid #e2e8f0', color: '#334155' }}
          value={field.name}
          onChange={e => handleNameChange(e.target.value)}
          onFocus={e => (e.currentTarget.style.borderColor = entityColor)}
          onBlur={e => (e.currentTarget.style.borderColor = '#e2e8f0')}
          placeholder="field_name"
        />
        {suggestion && (
          <div className="flex items-center gap-1.5">
            <span className="text-[9px]" style={{ color: '#94a3b8' }}>추천 타입:</span>
            <button
              onClick={() => { onUpdate({ type: suggestion }); setSuggestion(null); }}
              className="text-[9px] px-2 py-0.5 rounded-full font-mono font-semibold transition-colors"
              style={{ background: entityColor + '15', color: entityColor, border: `1px solid ${entityColor}33` }}>
              {suggestion} →
            </button>
          </div>
        )}
      </div>

      <select
        className="w-full rounded px-2 py-1.5 text-[11px] font-mono focus:outline-none"
        style={{ background: '#fff', border: '1px solid #e2e8f0', color: '#64748b' }}
        value={field.type}
        onChange={e => onUpdate({ type: e.target.value })}>
        {SQL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
      </select>

      {/* Default value */}
      <input
        className="w-full rounded px-2 py-1.5 text-xs font-mono focus:outline-none"
        style={{ background: '#fff', border: '1px solid #e2e8f0', color: '#334155' }}
        value={field.defaultValue ?? ''}
        onChange={e => onUpdate({ defaultValue: e.target.value || undefined })}
        onFocus={e => (e.currentTarget.style.borderColor = entityColor)}
        onBlur={e => (e.currentTarget.style.borderColor = '#e2e8f0')}
        placeholder="기본값 (선택사항)..."
      />

      {/* Description */}
      <textarea
        className="w-full rounded px-2 py-1.5 text-xs resize-none focus:outline-none"
        style={{ background: '#fff', border: '1px solid #e2e8f0', color: '#334155', minHeight: 44 }}
        value={field.description ?? ''}
        onChange={e => onUpdate({ description: e.target.value || undefined })}
        onFocus={e => (e.currentTarget.style.borderColor = entityColor)}
        onBlur={e => (e.currentTarget.style.borderColor = '#e2e8f0')}
        placeholder="필드 설명 (선택사항)..."
      />

      <div className="flex gap-3">
        {([
          { prop: 'isPrimary', label: 'PK' },
          { prop: 'isForeign', label: 'FK' },
          { prop: 'isUnique', label: 'UQ' },
          { prop: 'isNullable', label: 'NULL' },
        ] as { prop: keyof Field; label: string }[]).map(({ prop, label }) => (
          <label key={prop} className="flex items-center gap-1 cursor-pointer">
            <div
              className="w-3 h-3 rounded flex items-center justify-center transition-colors"
              style={{
                background: field[prop] ? entityColor : 'transparent',
                border: `1px solid ${field[prop] ? entityColor : '#d1d5db'}`,
              }}
              onClick={() => onUpdate({ [prop]: !field[prop] } as Partial<Field>)}>
              {field[prop] && <Check size={7} color="white" strokeWidth={3} />}
            </div>
            <span className="text-[9px] font-medium" style={{ color: '#94a3b8' }}>{label}</span>
          </label>
        ))}
      </div>
      <button onClick={onDelete}
        className="w-full py-1 rounded text-[10px] font-medium transition-colors"
        style={{ color: '#f87171', border: '1px solid #fecaca' }}
        onMouseEnter={e => { e.currentTarget.style.background = '#fff5f5'; e.currentTarget.style.color = '#ef4444'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#f87171'; }}>
        Delete field
      </button>
    </div>
  );
}

// ─── EntityPanel ──────────────────────────────────────────────────────────────

export function EntityPanel({
  entity, onUpdate, onDelete, onDuplicate, onAddField,
  onUpdateField, onDeleteField, onMoveField, onClose,
}: {
  entity: Entity;
  onUpdate: (u: Partial<Entity>) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onAddField: () => void;
  onUpdateField: (fid: string, u: Partial<Field>) => void;
  onDeleteField: (fid: string) => void;
  onMoveField: (fid: string, dir: 'up' | 'down') => void;
  onClose: () => void;
}) {
  const [expandedField, setExpandedField] = useState<string | null>(null);
  const [tab, setTab] = useState<'fields' | 'indexes'>('fields');

  const addIndex = () => {
    const idx: Index = { id: uid(), name: `idx_${entity.name}`, fields: [], isUnique: false };
    onUpdate({ indexes: [...(entity.indexes ?? []), idx] });
  };

  const updateIndex = (iid: string, u: Partial<Index>) => {
    onUpdate({ indexes: (entity.indexes ?? []).map(i => i.id === iid ? { ...i, ...u } : i) });
  };

  const deleteIndex = (iid: string) => {
    onUpdate({ indexes: (entity.indexes ?? []).filter(i => i.id !== iid) });
  };

  return (
    <div className="flex flex-col h-full" style={{ background: '#fff' }}>
      <div className="px-4 py-3 flex items-center justify-between shrink-0" style={{ borderBottom: '1px solid #f1f5f9' }}>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: entity.color }} />
          <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: '#94a3b8' }}>Table</span>
        </div>
        <button onClick={onClose} className="w-6 h-6 rounded flex items-center justify-center hover:bg-gray-100 transition-colors" style={{ color: '#94a3b8' }}>
          <X size={13} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Name */}
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: '#64748b' }}>Name</label>
          <input
            className="w-full rounded-lg px-3 py-2 text-sm font-mono transition-all focus:outline-none"
            style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#1e293b' }}
            value={entity.name}
            onChange={e => onUpdate({ name: e.target.value })}
            onFocus={e => (e.currentTarget.style.borderColor = entity.color)}
            onBlur={e => (e.currentTarget.style.borderColor = '#e2e8f0')}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: '#64748b' }}>Description</label>
          <textarea
            className="w-full rounded-lg px-3 py-2 text-xs resize-none focus:outline-none transition-all"
            style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#334155', minHeight: 56 }}
            value={entity.description ?? ''}
            onChange={e => onUpdate({ description: e.target.value })}
            onFocus={e => (e.currentTarget.style.borderColor = entity.color)}
            onBlur={e => (e.currentTarget.style.borderColor = '#e2e8f0')}
            placeholder="테이블 설명 (선택사항)..."
          />
        </div>

        {/* Color */}
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: '#64748b' }}>Color</label>
          <div className="flex gap-2 flex-wrap">
            {COLORS.map(c => (
              <button key={c} onClick={() => onUpdate({ color: c })}
                className="w-6 h-6 rounded-full transition-transform hover:scale-110 flex items-center justify-center"
                style={{ background: c, outline: entity.color === c ? `2px solid ${c}` : undefined, outlineOffset: 2 }}>
                {entity.color === c && <Check size={9} color="white" strokeWidth={3} />}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <PanelBtn onClick={onDuplicate} icon={<Copy size={11} />} label="Duplicate" />
        </div>
        <PanelBtn onClick={onDelete} icon={<Trash2 size={11} />} label="Delete table" danger full />

        {/* Tabs: Fields / Indexes */}
        <div className="flex gap-1 p-0.5 rounded-lg" style={{ background: '#f1f5f9' }}>
          {(['fields', 'indexes'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="flex-1 py-1 rounded-md text-[10px] font-semibold capitalize transition-all"
              style={{
                background: tab === t ? '#fff' : 'transparent',
                color: tab === t ? '#334155' : '#94a3b8',
                boxShadow: tab === t ? '0 1px 3px rgba(0,0,0,0.08)' : undefined,
              }}>
              {t === 'fields' ? `Fields (${entity.fields.length})` : `Indexes (${(entity.indexes ?? []).length})`}
            </button>
          ))}
        </div>

        {tab === 'fields' && (
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onUpdate({ collapsed: !entity.collapsed })}
                  className="text-[10px] px-2 py-0.5 rounded-full transition-colors"
                  style={{
                    background: entity.collapsed ? '#eff6ff' : '#f1f5f9',
                    color: entity.collapsed ? '#2563eb' : '#64748b',
                  }}>
                  {entity.collapsed ? 'Collapsed' : 'Expanded'}
                </button>
              </div>
              <button onClick={onAddField} className="w-5 h-5 rounded flex items-center justify-center hover:bg-gray-100 transition-colors" style={{ color: '#94a3b8' }}>
                <Plus size={12} />
              </button>
            </div>

            <div className="space-y-1.5">
              {entity.fields.map((field, i) => (
                <div key={field.id} className="rounded-lg overflow-hidden" style={{ border: '1px solid #f1f5f9' }}>
                  <div
                    className="flex items-center gap-2 px-2.5 py-2 cursor-pointer hover:bg-gray-50 transition-colors"
                    style={{ background: expandedField === field.id ? '#f8fafc' : '#fff' }}
                    onClick={() => setExpandedField(expandedField === field.id ? null : field.id)}
                  >
                    <span className="text-[8.5px] font-bold w-4 shrink-0"
                      style={{ color: field.isPrimary ? '#f59e0b' : field.isForeign ? '#06b6d4' : 'transparent' }}>
                      {field.isPrimary ? 'PK' : field.isForeign ? 'FK' : 'xx'}
                    </span>
                    <span className="flex-1 text-xs font-mono truncate" style={{ color: '#334155', fontWeight: field.isPrimary ? 600 : 400 }}>
                      {field.name}
                    </span>
                    <span className="text-[10px] font-mono shrink-0" style={{ color: '#94a3b8' }}>
                      {field.type.replace(/\(.*\)$/, '')}
                    </span>
                    <div className="flex items-center gap-0.5 ml-1">
                      <button onClick={e => { e.stopPropagation(); onMoveField(field.id, 'up'); }} disabled={i === 0}
                        className="w-4 h-4 flex items-center justify-center rounded transition-colors"
                        style={{ color: i === 0 ? '#e2e8f0' : '#94a3b8' }}
                        onMouseEnter={e => i > 0 && (e.currentTarget.style.background = '#f1f5f9')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                        <ArrowUp size={9} />
                      </button>
                      <button onClick={e => { e.stopPropagation(); onMoveField(field.id, 'down'); }} disabled={i === entity.fields.length - 1}
                        className="w-4 h-4 flex items-center justify-center rounded transition-colors"
                        style={{ color: i === entity.fields.length - 1 ? '#e2e8f0' : '#94a3b8' }}
                        onMouseEnter={e => i < entity.fields.length - 1 && (e.currentTarget.style.background = '#f1f5f9')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                        <ArrowDown size={9} />
                      </button>
                      {expandedField === field.id ? <ChevronUp size={11} color="#94a3b8" /> : <ChevronDown size={11} color="#94a3b8" />}
                    </div>
                  </div>

                  {expandedField === field.id && (
                    <ExpandedFieldEditor
                      field={field}
                      entityColor={entity.color}
                      isLast={i === entity.fields.length - 1}
                      onUpdate={u => onUpdateField(field.id, u)}
                      onDelete={() => { onDeleteField(field.id); setExpandedField(null); }}
                    />
                  )}
                </div>
              ))}

              {entity.fields.length === 0 && (
                <p className="text-xs italic text-center py-3" style={{ color: '#cbd5e1' }}>No fields. Click + to add.</p>
              )}
            </div>
          </>
        )}

        {tab === 'indexes' && (
          <div className="space-y-2">
            <button onClick={addIndex}
              className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all hover:bg-gray-50"
              style={{ border: '1px dashed #e2e8f0', color: '#94a3b8' }}>
              <Plus size={11} /> Add Index
            </button>
            {(entity.indexes ?? []).map(idx => (
              <div key={idx.id} className="rounded-lg p-2.5 space-y-2" style={{ border: '1px solid #f1f5f9', background: '#f8fafc' }}>
                <input
                  className="w-full rounded px-2 py-1.5 text-xs font-mono focus:outline-none"
                  style={{ background: '#fff', border: '1px solid #e2e8f0', color: '#334155' }}
                  value={idx.name}
                  placeholder="index_name"
                  onChange={e => updateIndex(idx.id, { name: e.target.value })}
                />
                <div className="space-y-1">
                  <label className="text-[9px] font-semibold uppercase tracking-widest" style={{ color: '#94a3b8' }}>Fields</label>
                  <div className="flex flex-wrap gap-1">
                    {entity.fields.map(f => {
                      const included = idx.fields.includes(f.id);
                      return (
                        <button key={f.id}
                          onClick={() => updateIndex(idx.id, {
                            fields: included ? idx.fields.filter(fid => fid !== f.id) : [...idx.fields, f.id]
                          })}
                          className="px-1.5 py-0.5 rounded text-[9px] font-mono transition-all"
                          style={{
                            background: included ? entity.color + '22' : '#f1f5f9',
                            color: included ? entity.color : '#94a3b8',
                            border: `1px solid ${included ? entity.color + '44' : 'transparent'}`,
                          }}>
                          {f.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <div className="w-3 h-3 rounded flex items-center justify-center"
                      style={{ background: idx.isUnique ? entity.color : 'transparent', border: `1px solid ${idx.isUnique ? entity.color : '#d1d5db'}` }}
                      onClick={() => updateIndex(idx.id, { isUnique: !idx.isUnique })}>
                      {idx.isUnique && <Check size={7} color="white" strokeWidth={3} />}
                    </div>
                    <span className="text-[9px] font-medium" style={{ color: '#94a3b8' }}>UNIQUE</span>
                  </label>
                  <button onClick={() => deleteIndex(idx.id)} className="text-[9px] transition-colors hover:text-red-500" style={{ color: '#cbd5e1' }}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
            {(entity.indexes ?? []).length === 0 && (
              <p className="text-xs italic text-center py-3" style={{ color: '#cbd5e1' }}>No indexes defined.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── RelationshipPanel ────────────────────────────────────────────────────────

export function RelationshipPanel({
  rel, entities, onUpdate, onDelete, onClose,
}: {
  rel: Relationship;
  entities: Entity[];
  onUpdate: (u: Partial<Relationship>) => void;
  onDelete: () => void;
  onClose: () => void;
}) {
  const from = entities.find(e => e.id === rel.from);
  const to = entities.find(e => e.id === rel.to);

  return (
    <div className="flex flex-col h-full" style={{ background: '#fff' }}>
      <div className="px-4 py-3 flex items-center justify-between shrink-0" style={{ borderBottom: '1px solid #f1f5f9' }}>
        <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: '#94a3b8' }}>Relation</span>
        <button onClick={onClose} className="w-6 h-6 rounded flex items-center justify-center hover:bg-gray-100 transition-colors" style={{ color: '#94a3b8' }}>
          <X size={13} />
        </button>
      </div>

      <div className="flex-1 p-4 space-y-4">
        <div className="rounded-lg px-3 py-2.5 flex items-center gap-2" style={{ background: '#f8fafc', border: '1px solid #f1f5f9' }}>
          <span className="text-xs font-mono font-semibold" style={{ color: from?.color ?? '#64748b' }}>{from?.name}</span>
          <span className="text-xs" style={{ color: '#cbd5e1' }}>──{rel.type}──→</span>
          <span className="text-xs font-mono font-semibold" style={{ color: to?.color ?? '#64748b' }}>{to?.name}</span>
        </div>

        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-widest mb-2" style={{ color: '#64748b' }}>Cardinality</label>
          <div className="flex gap-2">
            {(['1:1', '1:N', 'N:M'] as RelationType[]).map(t => (
              <button key={t} onClick={() => onUpdate({ type: t })}
                className="flex-1 py-1.5 rounded-lg text-xs font-mono font-medium transition-all"
                style={{
                  background: rel.type === t ? '#eff6ff' : '#f8fafc',
                  border: `1px solid ${rel.type === t ? '#93c5fd' : '#e2e8f0'}`,
                  color: rel.type === t ? '#2563eb' : '#64748b',
                }}>
                {t}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: '#64748b' }}>
            From field <span className="font-normal ml-1" style={{ color: '#cbd5e1' }}>({from?.name})</span>
          </label>
          <select
            className="w-full rounded-lg px-3 py-2 text-sm font-mono focus:outline-none"
            style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#334155' }}
            value={rel.fromField ?? ''}
            onChange={e => onUpdate({ fromField: e.target.value || undefined })}>
            <option value="">— entity level —</option>
            {from?.fields.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: '#64748b' }}>
            To field <span className="font-normal ml-1" style={{ color: '#cbd5e1' }}>({to?.name})</span>
          </label>
          <select
            className="w-full rounded-lg px-3 py-2 text-sm font-mono focus:outline-none"
            style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#334155' }}
            value={rel.toField ?? ''}
            onChange={e => onUpdate({ toField: e.target.value || undefined })}>
            <option value="">— entity level —</option>
            {to?.fields.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: '#64748b' }}>
            Label <span className="font-normal" style={{ color: '#cbd5e1' }}>optional</span>
          </label>
          <input
            className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none transition-all"
            style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#1e293b' }}
            value={rel.label}
            onChange={e => onUpdate({ label: e.target.value })}
            placeholder="e.g. writes, belongs to"
            onFocus={e => (e.currentTarget.style.borderColor = '#93c5fd')}
            onBlur={e => (e.currentTarget.style.borderColor = '#e2e8f0')}
          />
        </div>

        <PanelBtn onClick={onDelete} icon={<Trash2 size={11} />} label="Delete relationship" danger full />
      </div>
    </div>
  );
}

// ─── Minimap ──────────────────────────────────────────────────────────────────

export function Minimap({
  state, vp, canvasW, canvasH, onPan,
}: {
  state: ERDState;
  vp: { x: number; y: number; scale: number };
  canvasW: number;
  canvasH: number;
  onPan: (dx: number, dy: number) => void;
}) {
  const MM_W = 168, MM_H = 100;
  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  if (state.entities.length === 0) return null;

  const xs = state.entities.map(e => e.x);
  const ys = state.entities.map(e => e.y);
  const xe = state.entities.map(e => e.x + W);
  const ye = state.entities.map(e => e.y + entH(e));
  const minX = Math.min(...xs) - 40, minY = Math.min(...ys) - 40;
  const maxX = Math.max(...xe) + 40, maxY = Math.max(...ye) + 40;
  const dw = maxX - minX || 400, dh = maxY - minY || 300;

  const sx = MM_W / dw, sy = MM_H / dh;
  const s = Math.min(sx, sy);
  const offX = (MM_W - dw * s) / 2;
  const offY = (MM_H - dh * s) / 2;

  const vpX = (-vp.x / vp.scale - minX) * s + offX;
  const vpY = (-vp.y / vp.scale - minY) * s + offY;
  const vpW = (canvasW / vp.scale) * s;
  const vpH = (canvasH / vp.scale) * s;

  return (
    <div
      style={{
        width: MM_W, height: MM_H,
        background: '#fff',
        border: '1px solid #e2e8f0',
        borderRadius: 8,
        overflow: 'hidden',
        cursor: 'grab',
        boxShadow: '0 2px 8px -2px rgba(0,0,0,0.08)',
      }}
      onMouseDown={e => { isDragging.current = true; lastPos.current = { x: e.clientX, y: e.clientY }; e.preventDefault(); }}
      onMouseMove={e => {
        if (!isDragging.current) return;
        const dx = (e.clientX - lastPos.current.x) / s;
        const dy = (e.clientY - lastPos.current.y) / s;
        lastPos.current = { x: e.clientX, y: e.clientY };
        onPan(-dx * vp.scale, -dy * vp.scale);
      }}
      onMouseUp={() => { isDragging.current = false; }}
      onMouseLeave={() => { isDragging.current = false; }}
    >
      <svg width={MM_W} height={MM_H}>
        <rect width={MM_W} height={MM_H} fill="#f8fafc" />
        {state.relationships.map(r => {
          const fe = state.entities.find(e => e.id === r.from);
          const te = state.entities.find(e => e.id === r.to);
          if (!fe || !te) return null;
          const x1 = (fe.x + W / 2 - minX) * s + offX;
          const y1 = (fe.y + entH(fe) / 2 - minY) * s + offY;
          const x2 = (te.x + W / 2 - minX) * s + offX;
          const y2 = (te.y + entH(te) / 2 - minY) * s + offY;
          return <line key={r.id} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#e2e8f0" strokeWidth={1} />;
        })}
        {state.entities.map(e => (
          <rect key={e.id}
            x={(e.x - minX) * s + offX} y={(e.y - minY) * s + offY}
            width={W * s} height={entH(e) * s}
            rx={2} fill={e.color + '22'} stroke={e.color} strokeWidth={0.8}
          />
        ))}
        <rect x={vpX} y={vpY} width={vpW} height={vpH}
          fill="rgba(59,130,246,0.06)" stroke="#3b82f6" strokeWidth={1} rx={2} />
      </svg>
    </div>
  );
}

// ─── SQLModal (multi-format export + import) ──────────────────────────────────

type ExportTab = 'sql' | 'prisma' | 'dbml' | 'typescript' | 'mermaid';
type ImportTab = 'sql' | 'prisma' | 'dbml';

export function SQLModal({
  state, snapshot, onImport, onClose,
}: {
  state: ERDState;
  snapshot?: ERDState;
  onImport: (newState: ERDState) => void;
  onClose: () => void;
}) {
  const [mode, setMode] = useState<'export' | 'import' | 'migration'>('export');
  const [exportTab, setExportTab] = useState<ExportTab>('sql');
  const [importTab, setImportTab] = useState<ImportTab>('sql');
  const [importText, setImportText] = useState('');
  const [copied, setCopied] = useState(false);

  const exportContent = useMemo(() => {
    switch (exportTab) {
      case 'sql': return generateSQL(state);
      case 'prisma': return generatePrisma(state);
      case 'dbml': return generateDBML(state);
      case 'typescript': return generateTypeScript(state);
      case 'mermaid': return generateMermaid(state);
    }
  }, [state, exportTab]);

  const fileExts: Record<ExportTab, string> = {
    sql: '.sql', prisma: '.prisma', dbml: '.dbml', typescript: '.ts', mermaid: '.md',
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(exportContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleDownload = () => {
    const blob = new Blob([exportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `schema${fileExts[exportTab]}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    let parsed: ERDState;
    switch (importTab) {
      case 'sql': parsed = parseSQL(importText); break;
      case 'prisma': parsed = parsePrisma(importText); break;
      case 'dbml': parsed = parseDBML(importText); break;
    }
    if (parsed.entities.length > 0) { onImport(parsed); onClose(); }
  };

  const EXPORT_TABS: { key: ExportTab; label: string }[] = [
    { key: 'sql', label: 'SQL' },
    { key: 'prisma', label: 'Prisma' },
    { key: 'dbml', label: 'DBML' },
    { key: 'typescript', label: 'TypeScript' },
    { key: 'mermaid', label: 'Mermaid' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.3)' }} onClick={onClose}>
      <div
        className="flex flex-col rounded-2xl overflow-hidden"
        style={{ width: 680, maxHeight: '82vh', background: '#fff', boxShadow: '0 20px 60px -10px rgba(0,0,0,0.2)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5" style={{ borderBottom: '1px solid #f1f5f9' }}>
          {/* Mode toggle */}
          <div className="flex gap-0.5 p-0.5 rounded-lg" style={{ background: '#f1f5f9' }}>
            {(['export', 'import', 'migration'] as const).map(m => (
              <button key={m} onClick={() => setMode(m)}
                className="px-3 py-1 rounded-md text-xs font-semibold capitalize transition-all"
                style={{
                  background: mode === m ? '#fff' : 'transparent',
                  color: mode === m ? '#334155' : '#94a3b8',
                  boxShadow: mode === m ? '0 1px 3px rgba(0,0,0,0.08)' : undefined,
                }}>
                {m}
              </button>
            ))}
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-gray-100" style={{ color: '#94a3b8' }}>
            <X size={14} />
          </button>
        </div>

        {mode === 'export' ? (
          <>
            {/* Format tabs */}
            <div className="flex gap-1 px-5 pt-3 pb-0 shrink-0">
              {EXPORT_TABS.map(({ key, label }) => (
                <button key={key} onClick={() => setExportTab(key)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                  style={{
                    background: exportTab === key ? '#eff6ff' : 'transparent',
                    color: exportTab === key ? '#2563eb' : '#94a3b8',
                  }}>
                  {label}
                </button>
              ))}
            </div>
            <div className="flex-1 overflow-y-auto">
              <pre className="text-xs font-mono p-5 whitespace-pre-wrap leading-relaxed" style={{ color: '#334155' }}>
                {exportContent}
              </pre>
            </div>
            <div className="px-5 py-3 flex justify-end gap-2" style={{ borderTop: '1px solid #f1f5f9' }}>
              <button onClick={handleCopy}
                className="px-4 py-2 rounded-lg text-xs font-semibold transition-all"
                style={{ background: copied ? '#ecfdf5' : '#eff6ff', color: copied ? '#059669' : '#2563eb', border: `1px solid ${copied ? '#a7f3d0' : '#bfdbfe'}` }}>
                {copied ? '✓ Copied' : 'Copy'}
              </button>
              <button onClick={handleDownload}
                className="px-4 py-2 rounded-lg text-xs font-semibold transition-colors hover:bg-gray-50"
                style={{ border: '1px solid #e2e8f0', color: '#334155' }}>
                Download
              </button>
            </div>
          </>
        ) : mode === 'import' ? (
          <>
            {/* Import format tabs */}
            <div className="flex gap-1 px-5 pt-3 pb-0 shrink-0">
              {(['sql', 'prisma', 'dbml'] as ImportTab[]).map(t => (
                <button key={t} onClick={() => setImportTab(t)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all"
                  style={{
                    background: importTab === t ? '#eff6ff' : 'transparent',
                    color: importTab === t ? '#2563eb' : '#94a3b8',
                  }}>
                  {t.toUpperCase()}
                </button>
              ))}
            </div>
            <div className="flex flex-col flex-1 overflow-hidden p-5 gap-3">
              <p className="text-xs shrink-0" style={{ color: '#64748b' }}>
                {importTab === 'sql' && 'Paste CREATE TABLE SQL statements.'}
                {importTab === 'prisma' && 'Paste a Prisma schema (model blocks).'}
                {importTab === 'dbml' && 'Paste DBML Table definitions.'}
              </p>
              <textarea
                className="flex-1 rounded-lg p-3 text-xs font-mono resize-none focus:outline-none"
                style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#334155', minHeight: 220 }}
                value={importText}
                onChange={e => setImportText(e.target.value)}
                placeholder={
                  importTab === 'sql'
                    ? 'CREATE TABLE users (\n  id UUID NOT NULL,\n  email VARCHAR(255) NOT NULL,\n  PRIMARY KEY (id)\n);'
                    : importTab === 'prisma'
                    ? 'model User {\n  id    String @id\n  email String @unique\n}'
                    : 'Table users {\n  id uuid [pk]\n  email varchar [not null]\n}'
                }
                onFocus={e => (e.currentTarget.style.borderColor = '#93c5fd')}
                onBlur={e => (e.currentTarget.style.borderColor = '#e2e8f0')}
              />
              <div className="flex justify-end gap-2 shrink-0">
                <button onClick={onClose} className="px-4 py-2 rounded-lg text-xs font-medium hover:bg-gray-50 transition-colors" style={{ border: '1px solid #e2e8f0', color: '#64748b' }}>
                  Cancel
                </button>
                <button
                  onClick={handleImport}
                  className="px-4 py-2 rounded-lg text-xs font-semibold transition-colors"
                  style={{ background: importText.trim() ? '#2563eb' : '#e2e8f0', color: importText.trim() ? '#fff' : '#94a3b8' }}
                  disabled={!importText.trim()}>
                  Parse & Import
                </button>
              </div>
            </div>
          </>
        ) : (
          /* Migration tab */
          <div className="flex-1 flex flex-col overflow-hidden">
            {snapshot ? (
              <>
                <div className="px-5 pt-3 pb-2 shrink-0">
                  <p className="text-xs" style={{ color: '#64748b' }}>
                    스냅샷과 현재 스키마를 비교해 <code className="font-mono text-[10px] px-1 py-0.5 rounded" style={{ background: '#f1f5f9' }}>ALTER TABLE</code> SQL을 생성합니다.
                  </p>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <pre className="text-xs font-mono p-5 whitespace-pre-wrap leading-relaxed" style={{ color: '#334155' }}>
                    {generateMigrationSQL(snapshot, state)}
                  </pre>
                </div>
                <div className="px-5 py-3 flex justify-end gap-2 shrink-0" style={{ borderTop: '1px solid #f1f5f9' }}>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(generateMigrationSQL(snapshot, state));
                    }}
                    className="px-4 py-2 rounded-lg text-xs font-semibold"
                    style={{ background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe' }}>
                    Copy
                  </button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center gap-3 px-8 text-center">
                <div style={{ fontSize: 32 }}>📸</div>
                <div className="text-sm font-medium" style={{ color: '#334155' }}>스냅샷이 없습니다</div>
                <p className="text-xs" style={{ color: '#94a3b8' }}>
                  툴바의 "스냅샷" 버튼으로 현재 상태를 저장한 후, 스키마를 변경하면 마이그레이션 SQL이 자동 생성됩니다.
                </p>
                <button onClick={onClose}
                  className="px-4 py-2 rounded-lg text-xs font-semibold"
                  style={{ background: '#f1f5f9', color: '#64748b' }}>
                  닫기
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── SearchOverlay ────────────────────────────────────────────────────────────

export function SearchOverlay({
  entities, onSelect, onClose,
}: {
  entities: Entity[];
  onSelect: (id: string) => void;
  onClose: () => void;
}) {
  const [q, setQ] = useState('');

  const results = q.trim()
    ? entities.filter(e =>
        e.name.toLowerCase().includes(q.toLowerCase()) ||
        e.fields.some(f => f.name.toLowerCase().includes(q.toLowerCase()))
      )
    : entities.slice(0, 8);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-28" style={{ background: 'rgba(0,0,0,0.2)' }} onClick={onClose}>
      <div
        className="rounded-2xl overflow-hidden"
        style={{ width: 480, background: '#fff', boxShadow: '0 20px 60px -10px rgba(0,0,0,0.2)', border: '1px solid #e2e8f0' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: '1px solid #f1f5f9' }}>
          <span style={{ color: '#94a3b8' }}>⌕</span>
          <input
            autoFocus
            className="flex-1 text-sm focus:outline-none"
            style={{ color: '#1e293b' }}
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search tables and fields…"
            onKeyDown={e => {
              if (e.key === 'Escape') onClose();
              if (e.key === 'Enter' && results.length > 0) { onSelect(results[0].id); onClose(); }
            }}
          />
          <kbd className="text-[10px] px-1.5 py-0.5 rounded font-mono" style={{ background: '#f1f5f9', color: '#94a3b8' }}>Esc</kbd>
        </div>
        <div className="py-1.5 max-h-72 overflow-y-auto">
          {results.map(e => {
            const matchedFields = e.fields.filter(f => q && f.name.toLowerCase().includes(q.toLowerCase()));
            return (
              <button key={e.id}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-gray-50"
                onClick={() => { onSelect(e.id); onClose(); }}>
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: e.color }} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-mono font-semibold" style={{ color: '#1e293b' }}>{e.name}</div>
                  {matchedFields.length > 0 && (
                    <div className="text-[10px] font-mono mt-0.5" style={{ color: '#94a3b8' }}>
                      {matchedFields.map(f => f.name).join(', ')}
                    </div>
                  )}
                </div>
                <span className="text-[10px] shrink-0" style={{ color: '#cbd5e1' }}>{e.fields.length} fields</span>
              </button>
            );
          })}
          {q && results.length === 0 && (
            <div className="py-6 text-center text-sm" style={{ color: '#94a3b8' }}>No results for "{q}"</div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── FindReplaceModal ─────────────────────────────────────────────────────────

export function FindReplaceModal({
  state, onApply, onClose,
}: {
  state: ERDState;
  onApply: (newState: ERDState) => void;
  onClose: () => void;
}) {
  const [find, setFind] = useState('');
  const [replace, setReplace] = useState('');
  const [scope, setScope] = useState<'tables' | 'fields' | 'both'>('both');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [replaced, setReplaced] = useState<number | null>(null);

  const matches = useMemo(() => {
    if (!find.trim()) return 0;
    let count = 0;
    const test = (s: string) => caseSensitive ? s.includes(find) : s.toLowerCase().includes(find.toLowerCase());
    state.entities.forEach(e => {
      if ((scope === 'tables' || scope === 'both') && test(e.name)) count++;
      if (scope === 'fields' || scope === 'both') e.fields.forEach(f => { if (test(f.name)) count++; });
    });
    return count;
  }, [find, scope, caseSensitive, state]);

  const handleReplaceAll = () => {
    if (!find.trim()) return;
    const doReplace = (s: string) => {
      if (caseSensitive) return s.split(find).join(replace);
      return s.replace(new RegExp(find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), replace);
    };
    let count = 0;
    const newEntities = state.entities.map(e => {
      let updated = { ...e };
      if ((scope === 'tables' || scope === 'both') && (caseSensitive ? e.name.includes(find) : e.name.toLowerCase().includes(find.toLowerCase()))) {
        updated.name = doReplace(e.name);
        count++;
      }
      if (scope === 'fields' || scope === 'both') {
        updated.fields = e.fields.map(f => {
          const matches = caseSensitive ? f.name.includes(find) : f.name.toLowerCase().includes(find.toLowerCase());
          if (matches) { count++; return { ...f, name: doReplace(f.name) }; }
          return f;
        });
      }
      return updated;
    });
    onApply({ ...state, entities: newEntities });
    setReplaced(count);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-28" style={{ background: 'rgba(0,0,0,0.2)' }} onClick={onClose}>
      <div
        className="rounded-2xl overflow-hidden"
        style={{ width: 440, background: '#fff', boxShadow: '0 20px 60px -10px rgba(0,0,0,0.2)', border: '1px solid #e2e8f0' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid #f1f5f9' }}>
          <span className="text-xs font-bold tracking-widest uppercase" style={{ color: '#64748b' }}>Find & Replace</span>
          <button onClick={onClose} className="w-6 h-6 rounded flex items-center justify-center hover:bg-gray-100" style={{ color: '#94a3b8' }}><X size={13} /></button>
        </div>
        <div className="p-4 space-y-3">
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ color: '#64748b' }}>Find</label>
            <input autoFocus
              className="w-full rounded-lg px-3 py-2 text-sm font-mono focus:outline-none"
              style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#1e293b' }}
              value={find} onChange={e => { setFind(e.target.value); setReplaced(null); }}
              onKeyDown={e => e.key === 'Escape' && onClose()}
              onFocus={e => (e.currentTarget.style.borderColor = '#93c5fd')}
              onBlur={e => (e.currentTarget.style.borderColor = '#e2e8f0')}
              placeholder="Search for…"
            />
          </div>
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ color: '#64748b' }}>Replace with</label>
            <input
              className="w-full rounded-lg px-3 py-2 text-sm font-mono focus:outline-none"
              style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#1e293b' }}
              value={replace} onChange={e => { setReplace(e.target.value); setReplaced(null); }}
              onFocus={e => (e.currentTarget.style.borderColor = '#93c5fd')}
              onBlur={e => (e.currentTarget.style.borderColor = '#e2e8f0')}
              placeholder="Replace with…"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-1 p-0.5 rounded-lg" style={{ background: '#f1f5f9' }}>
              {(['both', 'tables', 'fields'] as const).map(s => (
                <button key={s} onClick={() => setScope(s)}
                  className="px-2 py-0.5 rounded-md text-[10px] font-semibold capitalize transition-all"
                  style={{ background: scope === s ? '#fff' : 'transparent', color: scope === s ? '#334155' : '#94a3b8' }}>
                  {s}
                </button>
              ))}
            </div>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <div className="w-3 h-3 rounded flex items-center justify-center"
                style={{ background: caseSensitive ? '#2563eb' : 'transparent', border: `1px solid ${caseSensitive ? '#2563eb' : '#d1d5db'}` }}
                onClick={() => setCaseSensitive(v => !v)}>
                {caseSensitive && <Check size={7} color="white" strokeWidth={3} />}
              </div>
              <span className="text-[10px]" style={{ color: '#64748b' }}>Case-sensitive</span>
            </label>
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px]" style={{ color: replaced !== null ? '#059669' : '#94a3b8' }}>
              {replaced !== null ? `✓ Replaced ${replaced} occurrence${replaced !== 1 ? 's' : ''}` : find.trim() ? `${matches} match${matches !== 1 ? 'es' : ''}` : ''}
            </span>
            <div className="flex gap-2">
              <button onClick={onClose} className="px-3 py-1.5 rounded-lg text-xs transition-colors hover:bg-gray-50" style={{ border: '1px solid #e2e8f0', color: '#64748b' }}>
                Cancel
              </button>
              <button
                onClick={handleReplaceAll}
                disabled={!find.trim() || matches === 0}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                style={{ background: find.trim() && matches > 0 ? '#2563eb' : '#e2e8f0', color: find.trim() && matches > 0 ? '#fff' : '#94a3b8' }}>
                Replace All
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── CommandPalette ───────────────────────────────────────────────────────────

export interface Command {
  id: string;
  label: string;
  shortcut?: string;
  category?: string;
  action: () => void;
}

export function CommandPalette({
  commands, onClose,
}: {
  commands: Command[];
  onClose: () => void;
}) {
  const [q, setQ] = useState('');
  const [cursor, setCursor] = useState(0);

  const filtered = useMemo(() =>
    q.trim()
      ? commands.filter(c => c.label.toLowerCase().includes(q.toLowerCase()))
      : commands,
    [commands, q]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setCursor(v => Math.min(v + 1, filtered.length - 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setCursor(v => Math.max(v - 1, 0)); }
    if (e.key === 'Enter' && filtered[cursor]) { filtered[cursor].action(); onClose(); }
    if (e.key === 'Escape') onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20" style={{ background: 'rgba(0,0,0,0.25)' }} onClick={onClose}>
      <div
        className="rounded-2xl overflow-hidden"
        style={{ width: 520, background: '#fff', boxShadow: '0 24px 64px -12px rgba(0,0,0,0.25)', border: '1px solid #e2e8f0' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3.5" style={{ borderBottom: '1px solid #f1f5f9' }}>
          <span className="text-xs font-mono" style={{ color: '#94a3b8' }}>⌘K</span>
          <input
            autoFocus
            className="flex-1 text-sm focus:outline-none"
            style={{ color: '#1e293b' }}
            value={q}
            onChange={e => { setQ(e.target.value); setCursor(0); }}
            onKeyDown={handleKeyDown}
            placeholder="Search commands…"
          />
          <kbd className="text-[10px] px-1.5 py-0.5 rounded font-mono" style={{ background: '#f1f5f9', color: '#94a3b8' }}>Esc</kbd>
        </div>
        <div className="py-1.5 max-h-80 overflow-y-auto">
          {filtered.length === 0 && (
            <div className="py-8 text-center text-sm" style={{ color: '#94a3b8' }}>No commands match "{q}"</div>
          )}
          {filtered.map((cmd, i) => (
            <button key={cmd.id}
              className="w-full flex items-center justify-between gap-3 px-4 py-2.5 text-left transition-colors"
              style={{ background: i === cursor ? '#f8fafc' : 'transparent' }}
              onMouseEnter={() => setCursor(i)}
              onClick={() => { cmd.action(); onClose(); }}>
              <span className="text-sm" style={{ color: '#1e293b' }}>{cmd.label}</span>
              {cmd.shortcut && (
                <kbd className="text-[10px] px-1.5 py-0.5 rounded font-mono shrink-0" style={{ background: '#f1f5f9', color: '#64748b' }}>
                  {cmd.shortcut}
                </kbd>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── ShortcutsPanel ───────────────────────────────────────────────────────────

export function ShortcutsPanel({ onClose }: { onClose: () => void }) {
  const shortcuts = [
    { group: 'Canvas', items: [
      { key: 'Scroll', label: 'Pan canvas' },
      { key: '⌘ Scroll', label: 'Zoom in/out' },
      { key: 'Drag', label: 'Pan canvas (empty area)' },
    ]},
    { group: 'Selection', items: [
      { key: 'Click', label: 'Select table or relationship' },
      { key: 'Shift+Click', label: 'Multi-select' },
      { key: '⌘A', label: 'Select all tables' },
      { key: 'Esc', label: 'Deselect / cancel' },
    ]},
    { group: 'Editing', items: [
      { key: 'Double-click', label: 'Rename table' },
      { key: 'Delete / ⌫', label: 'Delete selected' },
      { key: '⌘Z', label: 'Undo' },
      { key: '⌘Y / ⌘⇧Z', label: 'Redo' },
    ]},
    { group: 'Tools', items: [
      { key: '⌘F', label: 'Search tables & fields' },
      { key: '⌘H', label: 'Find & Replace' },
      { key: '⌘K', label: 'Command palette' },
      { key: '?', label: 'Show keyboard shortcuts' },
      { key: 'F', label: 'Toggle focus mode' },
      { key: 'G', label: 'Toggle grid snap' },
    ]},
    { group: 'Export', items: [
      { key: '⌘E', label: 'Open export panel' },
      { key: '⌘S', label: 'Share URL' },
    ]},
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.25)' }} onClick={onClose}>
      <div
        className="rounded-2xl overflow-hidden"
        style={{ width: 560, maxHeight: '80vh', background: '#fff', boxShadow: '0 20px 60px -10px rgba(0,0,0,0.2)' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #f1f5f9' }}>
          <span className="text-sm font-bold" style={{ color: '#1e293b' }}>Keyboard Shortcuts</span>
          <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-gray-100" style={{ color: '#94a3b8' }}><X size={14} /></button>
        </div>
        <div className="p-5 overflow-y-auto max-h-[calc(80vh-60px)]">
          <div className="grid grid-cols-2 gap-6">
            {shortcuts.map(group => (
              <div key={group.group}>
                <div className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#94a3b8' }}>{group.group}</div>
                <div className="space-y-1.5">
                  {group.items.map(item => (
                    <div key={item.key} className="flex items-center justify-between gap-3">
                      <span className="text-xs" style={{ color: '#64748b' }}>{item.label}</span>
                      <kbd className="text-[10px] px-1.5 py-0.5 rounded font-mono shrink-0 whitespace-nowrap" style={{ background: '#f1f5f9', color: '#334155' }}>
                        {item.key}
                      </kbd>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ContextMenu ──────────────────────────────────────────────────────────────

export interface ContextMenuItem {
  label: string;
  action: () => void;
  danger?: boolean;
  separator?: boolean;
}

export function ContextMenu({
  x, y, items, onClose,
}: {
  x: number;
  y: number;
  items: ContextMenuItem[];
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50" onClick={onClose} onContextMenu={e => { e.preventDefault(); onClose(); }}>
      <div
        className="absolute rounded-xl overflow-hidden py-1"
        style={{
          left: Math.min(x, window.innerWidth - 200),
          top: Math.min(y, window.innerHeight - (items.length * 36 + 16)),
          width: 200,
          background: '#fff',
          boxShadow: '0 8px 32px -4px rgba(0,0,0,0.18)',
          border: '1px solid #e2e8f0',
        }}
        onClick={e => e.stopPropagation()}
      >
        {items.map((item, i) => (
          item.separator
            ? <div key={i} className="my-1" style={{ height: 1, background: '#f1f5f9' }} />
            : (
              <button key={i}
                className="w-full px-3 py-2 text-left text-xs font-medium transition-colors"
                style={{ color: item.danger ? '#ef4444' : '#334155' }}
                onMouseEnter={e => (e.currentTarget.style.background = item.danger ? '#fff5f5' : '#f8fafc')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                onClick={() => { item.action(); onClose(); }}>
                {item.label}
              </button>
            )
        ))}
      </div>
    </div>
  );
}

// ─── StatusBar ────────────────────────────────────────────────────────────────

export interface LintWarning {
  type: string;
  message: string;
  entityId?: string;
}

export function StatusBar({
  state, vp, warnings, snapGrid, focusMode, mousePos, onEntitySelect,
}: {
  state: ERDState;
  vp: { x: number; y: number; scale: number };
  warnings: LintWarning[];
  snapGrid: boolean;
  focusMode: boolean;
  mousePos: { x: number; y: number };
  onEntitySelect: (id: string) => void;
}) {
  const [showWarnings, setShowWarnings] = useState(false);

  return (
    <div
      className="flex items-center gap-4 px-4 shrink-0 relative select-none"
      style={{ height: 28, background: '#fff', borderTop: '1px solid #f1f5f9', fontSize: 11, color: '#94a3b8' }}
    >
      <span>{state.entities.length} tables</span>
      <span style={{ color: '#e2e8f0' }}>·</span>
      <span>{state.relationships.length} relations</span>
      {snapGrid && (
        <>
          <span style={{ color: '#e2e8f0' }}>·</span>
          <span style={{ color: '#6366f1' }}>Grid snap</span>
        </>
      )}
      {focusMode && (
        <>
          <span style={{ color: '#e2e8f0' }}>·</span>
          <span style={{ color: '#8b5cf6' }}>Focus mode</span>
        </>
      )}

      {warnings.length > 0 && (
        <>
          <span style={{ color: '#e2e8f0' }}>·</span>
          <button
            onClick={() => setShowWarnings(v => !v)}
            className="flex items-center gap-1 transition-colors hover:text-amber-600"
            style={{ color: '#f59e0b' }}>
            ⚠ {warnings.length} warning{warnings.length !== 1 ? 's' : ''}
          </button>
          {showWarnings && (
            <div className="absolute bottom-8 left-48 rounded-xl overflow-hidden py-1 z-20"
              style={{ background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 8px 24px -4px rgba(0,0,0,0.12)', minWidth: 280, maxWidth: 400 }}>
              {warnings.map((w, i) => (
                <button key={i}
                  className="w-full flex items-start gap-2 px-3 py-2 text-left transition-colors hover:bg-gray-50"
                  onClick={() => { if (w.entityId) onEntitySelect(w.entityId); setShowWarnings(false); }}>
                  <span className="shrink-0 mt-px" style={{ color: '#f59e0b' }}>⚠</span>
                  <span style={{ fontSize: 11, color: '#64748b', lineHeight: 1.4 }}>{w.message}</span>
                </button>
              ))}
            </div>
          )}
        </>
      )}

      <div className="flex-1" />
      <span style={{ fontFamily: 'ui-monospace,monospace', color: '#cbd5e1' }}>
        {mousePos.x},{mousePos.y}
      </span>
      <span style={{ color: '#e2e8f0' }}>·</span>
      <span style={{ fontFamily: 'ui-monospace,monospace' }}>{Math.round(vp.scale * 100)}%</span>
    </div>
  );
}

// ─── ProjectPicker ────────────────────────────────────────────────────────────

export function ProjectPicker({
  projects, currentId, onSwitch, onCreate, onRename, onDelete, onClose,
}: {
  projects: Project[];
  currentId: string;
  onSwitch: (id: string) => void;
  onCreate: () => void;
  onRename: (id: string, name: string) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-start pt-14 pl-4" onClick={onClose}>
      <div
        className="rounded-xl overflow-hidden"
        style={{ width: 280, background: '#fff', boxShadow: '0 8px 32px -4px rgba(0,0,0,0.16)', border: '1px solid #e2e8f0' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid #f1f5f9' }}>
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#94a3b8' }}>Projects</span>
          <button onClick={onCreate} className="flex items-center gap-1 text-xs font-medium transition-colors hover:text-blue-600" style={{ color: '#64748b' }}>
            <Plus size={12} /> New
          </button>
        </div>
        <div className="py-1 max-h-72 overflow-y-auto">
          {projects.map(p => (
            <div key={p.id} className="flex items-center gap-2 px-3 py-2 transition-colors hover:bg-gray-50"
              style={{ background: p.id === currentId ? '#eff6ff' : undefined }}>
              {editingId === p.id ? (
                <input autoFocus
                  className="flex-1 text-xs font-medium focus:outline-none bg-transparent"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  onBlur={() => { onRename(p.id, editName || p.name); setEditingId(null); }}
                  onKeyDown={e => {
                    if (e.key === 'Enter') { onRename(p.id, editName || p.name); setEditingId(null); }
                    if (e.key === 'Escape') setEditingId(null);
                  }}
                />
              ) : (
                <button className="flex-1 text-left"
                  onClick={() => { onSwitch(p.id); onClose(); }}
                  onDoubleClick={() => { setEditingId(p.id); setEditName(p.name); }}>
                  <div className="text-xs font-medium" style={{ color: p.id === currentId ? '#2563eb' : '#334155' }}>{p.name}</div>
                  <div className="text-[9px] mt-0.5" style={{ color: '#94a3b8' }}>
                    {p.state.entities.length} tables · {new Date(p.updatedAt).toLocaleDateString()}
                  </div>
                </button>
              )}
              {p.id !== currentId && (
                <button onClick={() => onDelete(p.id)} className="w-5 h-5 flex items-center justify-center rounded opacity-0 hover:opacity-100 transition-all hover:bg-red-50"
                  style={{ color: '#f87171' }}>
                  <X size={10} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── FKSuggestion ─────────────────────────────────────────────────────────────

export function FKSuggestion({
  fromName, toName, onAccept, onDismiss,
}: {
  fromName: string;
  toName: string;
  onAccept: () => void;
  onDismiss: () => void;
}) {
  return (
    <div
      className="flex items-center gap-3 px-4 py-2.5 rounded-xl"
      style={{
        position: 'absolute', bottom: 48, left: '50%', transform: 'translateX(-50%)',
        background: '#fff', border: '1px solid #e2e8f0',
        boxShadow: '0 4px 16px -4px rgba(0,0,0,0.1)',
        whiteSpace: 'nowrap', zIndex: 20,
      }}
    >
      <span className="text-xs" style={{ color: '#64748b' }}>
        <span className="font-mono font-semibold" style={{ color: '#334155' }}>{fromName}</span>
        {' '}looks like a FK to{' '}
        <span className="font-mono font-semibold" style={{ color: '#334155' }}>{toName}</span>
      </span>
      <button onClick={onAccept} className="px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors hover:bg-blue-600"
        style={{ background: '#2563eb', color: '#fff' }}>
        Connect
      </button>
      <button onClick={onDismiss} className="w-5 h-5 flex items-center justify-center rounded hover:bg-gray-100" style={{ color: '#94a3b8' }}>
        <X size={10} />
      </button>
    </div>
  );
}

// ─── SQL generator ────────────────────────────────────────────────────────────

export function generateSQL(state: ERDState): string {
  const lines: string[] = [];

  state.entities.forEach(entity => {
    if (entity.description) lines.push(`-- ${entity.description}`);
    lines.push(`CREATE TABLE ${entity.name} (`);
    const fieldLines: string[] = [];
    entity.fields.forEach(f => {
      let l = `  ${f.name} ${f.type}`;
      if (!f.isNullable) l += ' NOT NULL';
      if (f.defaultValue) l += ` DEFAULT ${f.defaultValue}`;
      if (f.isUnique && !f.isPrimary) l += ' UNIQUE';
      if (f.description) l += ` -- ${f.description}`;
      fieldLines.push(l);
    });
    const pks = entity.fields.filter(f => f.isPrimary);
    if (pks.length === 1) {
      const idx = fieldLines.findIndex((_, i) => entity.fields[i].isPrimary);
      if (idx >= 0) fieldLines[idx] += ' PRIMARY KEY';
    } else if (pks.length > 1) {
      fieldLines.push(`  PRIMARY KEY (${pks.map(f => f.name).join(', ')})`);
    }
    // Indexes
    (entity.indexes ?? []).forEach(idx => {
      const fieldNames = idx.fields.map(fid => entity.fields.find(f => f.id === fid)?.name ?? fid).filter(Boolean);
      if (fieldNames.length > 0) {
        fieldLines.push(`  ${idx.isUnique ? 'UNIQUE ' : ''}INDEX ${idx.name} (${fieldNames.join(', ')})`);
      }
    });
    lines.push(fieldLines.join(',\n'));
    lines.push(');\n');
  });

  state.relationships.forEach(r => {
    const fromEnt = state.entities.find(e => e.id === r.from);
    const toEnt = state.entities.find(e => e.id === r.to);
    if (!fromEnt || !toEnt) return;

    if (r.fromField && r.toField) {
      const fromField = fromEnt.fields.find(f => f.id === r.fromField);
      const toField = toEnt.fields.find(f => f.id === r.toField);
      if (fromField && toField) {
        lines.push(
          `ALTER TABLE ${toEnt.name}\n` +
          `  ADD CONSTRAINT fk_${toEnt.name}_${toField.name}\n` +
          `  FOREIGN KEY (${toField.name}) REFERENCES ${fromEnt.name}(${fromField.name});\n`
        );
      }
    } else {
      const pk = fromEnt.fields.find(f => f.isPrimary);
      const fkField = toEnt.fields.find(f =>
        f.name === `${fromEnt.name.replace(/s$/, '')}_id` || f.name === `${fromEnt.name}_id`
      );
      if (pk && fkField) {
        lines.push(
          `ALTER TABLE ${toEnt.name}\n` +
          `  ADD CONSTRAINT fk_${toEnt.name}_${fkField.name}\n` +
          `  FOREIGN KEY (${fkField.name}) REFERENCES ${fromEnt.name}(${pk.name});\n`
        );
      }
    }
  });

  return lines.join('\n');
}

// ─── Prisma generator ─────────────────────────────────────────────────────────

function sqlTypeToPrisma(type: string): string {
  const t = type.toUpperCase();
  if (t.startsWith('VARCHAR') || t.startsWith('TEXT') || t.startsWith('CHAR') || t === 'LONGTEXT') return 'String';
  if (t === 'INT' || t === 'SMALLINT' || t === 'TINYINT') return 'Int';
  if (t === 'BIGINT') return 'BigInt';
  if (t === 'BOOLEAN') return 'Boolean';
  if (t === 'FLOAT' || t === 'DOUBLE' || t.startsWith('DECIMAL')) return 'Float';
  if (t === 'DATE' || t === 'DATETIME' || t === 'TIMESTAMP') return 'DateTime';
  if (t === 'JSON') return 'Json';
  if (t === 'UUID' || t === 'CHAR(36)') return 'String  @db.Uuid';
  return 'String';
}

export function generatePrisma(state: ERDState): string {
  const lines: string[] = [
    'generator client {',
    '  provider = "prisma-client-js"',
    '}',
    '',
    'datasource db {',
    '  provider = "postgresql"',
    '  url      = env("DATABASE_URL")',
    '}',
    '',
  ];

  state.entities.forEach(entity => {
    if (entity.description) lines.push(`/// ${entity.description}`);
    lines.push(`model ${toPascalCase(entity.name)} {`);
    entity.fields.forEach(f => {
      if (f.description) lines.push(`  /// ${f.description}`);
      const prismaType = sqlTypeToPrisma(f.type);
      let line = `  ${f.name.padEnd(20)} ${prismaType}`;
      if (f.isNullable) line += '?';
      const attrs: string[] = [];
      if (f.isPrimary) attrs.push('@id');
      if (f.isUnique) attrs.push('@unique');
      if (f.type.toUpperCase() === 'UUID') attrs.push('@default(uuid())');
      if (f.defaultValue) attrs.push(`@default(${f.defaultValue})`);
      if (f.name === 'created_at' || f.name === 'createdAt') attrs.push('@default(now())');
      if (f.name === 'updated_at' || f.name === 'updatedAt') attrs.push('@updatedAt');
      if (attrs.length) line += ' ' + attrs.join(' ');
      lines.push(line);
    });

    // Relations
    const outRels = state.relationships.filter(r => r.from === entity.id);
    const inRels = state.relationships.filter(r => r.to === entity.id);
    outRels.forEach(r => {
      const toEnt = state.entities.find(e => e.id === r.to);
      if (!toEnt) return;
      const name = toPascalCase(toEnt.name);
      const fieldName = toEnt.name.toLowerCase();
      if (r.type === '1:1') lines.push(`  ${fieldName}              ${name}?`);
      else if (r.type === '1:N') lines.push(`  ${fieldName.padEnd(20)} ${name}[]`);
      else lines.push(`  ${fieldName.padEnd(20)} ${name}[]`);
    });
    inRels.forEach(r => {
      const fromEnt = state.entities.find(e => e.id === r.from);
      if (!fromEnt) return;
      const name = toPascalCase(fromEnt.name);
      const fieldName = fromEnt.name.toLowerCase();
      const fkField = entity.fields.find(f => f.name.includes('_id'));
      lines.push(`  ${fieldName.padEnd(20)} ${name}  @relation(fields: [${fkField?.name ?? entity.name + '_id'}], references: [id])`);
    });

    (entity.indexes ?? []).forEach(idx => {
      const fieldNames = idx.fields.map(fid => entity.fields.find(f => f.id === fid)?.name ?? '').filter(Boolean);
      if (fieldNames.length > 0) {
        lines.push(`  @@${idx.isUnique ? 'unique' : 'index'}([${fieldNames.join(', ')}])`);
      }
    });

    lines.push('}', '');
  });

  return lines.join('\n');
}

function toPascalCase(s: string): string {
  return s.replace(/(^|_)([a-z])/g, (_, __, c: string) => c.toUpperCase())
    .replace(/s$/, ''); // simple singularize
}

// ─── DBML generator ───────────────────────────────────────────────────────────

export function generateDBML(state: ERDState): string {
  const lines: string[] = [];

  state.entities.forEach(entity => {
    lines.push(`Table ${entity.name} {`);
    entity.fields.forEach(f => {
      const attrs: string[] = [];
      if (f.isPrimary) attrs.push('pk');
      if (!f.isNullable) attrs.push('not null');
      if (f.isUnique && !f.isPrimary) attrs.push('unique');
      const type = f.type.toLowerCase().replace(/\(\d+,\d+\)/, '').replace(/\(\d+\)/, '');
      let line = `  ${f.name} ${type}`;
      if (attrs.length) line += ` [${attrs.join(', ')}]`;
      lines.push(line);
    });
    (entity.indexes ?? []).forEach(idx => {
      const fieldNames = idx.fields.map(fid => entity.fields.find(f => f.id === fid)?.name ?? '').filter(Boolean);
      if (fieldNames.length > 0) {
        lines.push(`\n  indexes {`);
        lines.push(`    (${fieldNames.join(', ')}) [${idx.isUnique ? 'unique, ' : ''}name: '${idx.name}']`);
        lines.push(`  }`);
      }
    });
    lines.push('}', '');
  });

  state.relationships.forEach(r => {
    const fromEnt = state.entities.find(e => e.id === r.from);
    const toEnt = state.entities.find(e => e.id === r.to);
    if (!fromEnt || !toEnt) return;

    const fromField = r.fromField ? fromEnt.fields.find(f => f.id === r.fromField)?.name : fromEnt.fields.find(f => f.isPrimary)?.name ?? 'id';
    const toField = r.toField ? toEnt.fields.find(f => f.id === r.toField)?.name : toEnt.fields.find(f => f.name.includes('_id'))?.name ?? fromEnt.name + '_id';

    const op = r.type === '1:1' ? '-' : r.type === '1:N' ? '<' : '<>';
    lines.push(`Ref: ${fromEnt.name}.${fromField} ${op} ${toEnt.name}.${toField}`);
  });

  return lines.join('\n');
}

// ─── TypeScript generator ─────────────────────────────────────────────────────

function sqlTypeToTS(type: string): string {
  const t = type.toUpperCase();
  if (t === 'BOOLEAN') return 'boolean';
  if (t === 'INT' || t === 'BIGINT' || t === 'SMALLINT' || t === 'TINYINT' || t === 'FLOAT' || t === 'DOUBLE' || t.startsWith('DECIMAL')) return 'number';
  if (t === 'DATE' || t === 'DATETIME' || t === 'TIMESTAMP') return 'Date';
  if (t === 'JSON') return 'Record<string, unknown>';
  return 'string';
}

function toCamelCase(s: string): string {
  return s.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase());
}

export function generateTypeScript(state: ERDState): string {
  const lines: string[] = ['// Generated TypeScript interfaces', ''];

  state.entities.forEach(entity => {
    lines.push(`export interface ${toPascalCase(entity.name)} {`);
    entity.fields.forEach(f => {
      const tsType = sqlTypeToTS(f.type);
      lines.push(`  ${toCamelCase(f.name)}${f.isNullable ? '?' : ''}: ${tsType};`);
    });
    lines.push('}', '');
  });

  return lines.join('\n');
}

// ─── Mermaid generator ────────────────────────────────────────────────────────

function sqlTypeToMermaid(type: string): string {
  return type.toLowerCase().replace(/\(.*\)/, '').trim();
}

export function generateMermaid(state: ERDState): string {
  const lines: string[] = ['erDiagram'];

  state.entities.forEach(entity => {
    lines.push(`  ${entity.name} {`);
    entity.fields.forEach(f => {
      const type = sqlTypeToMermaid(f.type);
      const badge = f.isPrimary ? 'PK' : f.isForeign ? 'FK' : '';
      lines.push(`    ${type} ${f.name}${badge ? ' ' + badge : ''}`);
    });
    lines.push('  }');
  });

  lines.push('');

  state.relationships.forEach(r => {
    const fromEnt = state.entities.find(e => e.id === r.from);
    const toEnt = state.entities.find(e => e.id === r.to);
    if (!fromEnt || !toEnt) return;
    const notation = r.type === '1:1' ? '||--||' : r.type === '1:N' ? '||--o{' : '}o--o{';
    const label = r.label || 'has';
    lines.push(`  ${fromEnt.name} ${notation} ${toEnt.name} : "${label}"`);
  });

  return lines.join('\n');
}

// ─── SQL parser ───────────────────────────────────────────────────────────────

function uid() { return Math.random().toString(36).slice(2, 9); }

export function parseSQL(sql: string): ERDState {
  const entities: Entity[] = [];
  const tableRe = /CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?`?(\w+)`?\s*\(([\s\S]*?)\)\s*;/gi;
  let match;
  let xPos = 60;

  while ((match = tableRe.exec(sql)) !== null) {
    const name = match[1];
    const body = match[2];
    const fields: Field[] = [];
    const pks: string[] = [];

    const pkMatch = body.match(/PRIMARY\s+KEY\s*\(([^)]+)\)/i);
    if (pkMatch) pkMatch[1].split(',').forEach(k => pks.push(k.trim().replace(/`/g, '')));

    body.split('\n').forEach(line => {
      line = line.trim().replace(/,$/, '');
      if (!line) return;
      const upper = line.toUpperCase();
      if (upper.startsWith('PRIMARY KEY') || upper.startsWith('FOREIGN KEY') ||
        upper.startsWith('KEY ') || upper.startsWith('INDEX ') ||
        upper.startsWith('UNIQUE KEY') || upper.startsWith('CONSTRAINT')) return;

      const m = line.match(/^`?(\w+)`?\s+([\w]+(?:\([^)]*\))?)(.*)/i);
      if (!m) return;
      const fieldName = m[1];
      const type = m[2].toUpperCase();
      const rest = m[3].toUpperCase();

      fields.push({
        id: uid(),
        name: fieldName,
        type,
        isPrimary: pks.includes(fieldName) || rest.includes('PRIMARY KEY'),
        isNullable: !rest.includes('NOT NULL'),
        isUnique: rest.includes('UNIQUE'),
        isForeign: false,
      });
    });

    if (fields.length === 0) continue;

    const col = entities.length % 3;
    const row = Math.floor(entities.length / 3);
    entities.push({
      id: uid(),
      name,
      x: col * 300 + 60,
      y: row * 240 + 60,
      color: COLORS[entities.length % COLORS.length],
      fields,
      collapsed: false,
    });
    xPos += 300;
  }

  return { entities, relationships: [] };
}

// ─── Prisma parser ────────────────────────────────────────────────────────────

export function parsePrisma(schema: string): ERDState {
  const entities: Entity[] = [];
  const modelRe = /model\s+(\w+)\s*\{([^}]+)\}/g;
  let match;

  while ((match = modelRe.exec(schema)) !== null) {
    const name = match[1];
    const body = match[2];
    const fields: Field[] = [];

    body.split('\n').forEach(line => {
      line = line.trim();
      if (!line || line.startsWith('//') || line.startsWith('@@') || line.startsWith('@')) return;
      const parts = line.split(/\s+/);
      if (parts.length < 2) return;
      const fieldName = parts[0];
      const prismaType = parts[1].replace('?', '');
      const isNullable = parts[1].endsWith('?');
      const rest = parts.slice(2).join(' ');

      // Skip relation fields (they reference other models)
      if (/^[A-Z]/.test(prismaType)) return;

      const sqlType = prismaTypeToSQL(prismaType);
      fields.push({
        id: uid(),
        name: fieldName,
        type: sqlType,
        isPrimary: rest.includes('@id'),
        isNullable,
        isUnique: rest.includes('@unique'),
        isForeign: false,
      });
    });

    if (fields.length === 0) continue;
    const col = entities.length % 3;
    const row = Math.floor(entities.length / 3);
    entities.push({
      id: uid(),
      name: name.toLowerCase(),
      x: col * 300 + 60,
      y: row * 240 + 60,
      color: COLORS[entities.length % COLORS.length],
      fields,
      collapsed: false,
    });
  }

  return { entities, relationships: [] };
}

function prismaTypeToSQL(type: string): string {
  switch (type) {
    case 'String': return 'VARCHAR(255)';
    case 'Int': return 'INT';
    case 'BigInt': return 'BIGINT';
    case 'Boolean': return 'BOOLEAN';
    case 'Float': return 'FLOAT';
    case 'DateTime': return 'TIMESTAMP';
    case 'Json': return 'JSON';
    default: return 'VARCHAR(255)';
  }
}

// ─── DBML parser ──────────────────────────────────────────────────────────────

export function parseDBML(dbml: string): ERDState {
  const entities: Entity[] = [];
  const tableRe = /Table\s+(\w+)\s*\{([^}]+)\}/gi;
  let match;

  while ((match = tableRe.exec(dbml)) !== null) {
    const name = match[1];
    const body = match[2];
    const fields: Field[] = [];

    body.split('\n').forEach(line => {
      line = line.trim();
      if (!line || line.startsWith('//') || line.startsWith('indexes')) return;
      const m = line.match(/^(\w+)\s+(\w+)(.*)$/);
      if (!m) return;
      const [, fieldName, type, rest] = m;
      fields.push({
        id: uid(),
        name: fieldName,
        type: type.toUpperCase(),
        isPrimary: rest.includes('pk'),
        isNullable: !rest.includes('not null'),
        isUnique: rest.includes('unique'),
        isForeign: false,
      });
    });

    if (fields.length === 0) continue;
    const col = entities.length % 3;
    const row = Math.floor(entities.length / 3);
    entities.push({
      id: uid(),
      name,
      x: col * 300 + 60,
      y: row * 240 + 60,
      color: COLORS[entities.length % COLORS.length],
      fields,
      collapsed: false,
    });
  }

  return { entities, relationships: [] };
}

// ─── Auto layout ──────────────────────────────────────────────────────────────

export function autoLayout(entities: Entity[], relationships: Relationship[]): Entity[] {
  if (entities.length === 0) return entities;

  const outEdges: Map<string, string[]> = new Map();
  const inDeg: Map<string, number> = new Map();
  entities.forEach(e => { outEdges.set(e.id, []); inDeg.set(e.id, 0); });
  relationships.forEach(r => {
    outEdges.get(r.from)?.push(r.to);
    inDeg.set(r.to, (inDeg.get(r.to) ?? 0) + 1);
  });

  const levels: Map<string, number> = new Map();
  const queue = entities.filter(e => (inDeg.get(e.id) ?? 0) === 0).map(e => e.id);
  queue.forEach(id => levels.set(id, 0));

  let qi = 0;
  while (qi < queue.length) {
    const cur = queue[qi++];
    const nextL = (levels.get(cur) ?? 0) + 1;
    (outEdges.get(cur) ?? []).forEach(next => {
      if (!levels.has(next) || levels.get(next)! < nextL) levels.set(next, nextL);
      const d = (inDeg.get(next) ?? 1) - 1;
      inDeg.set(next, d);
      if (d === 0) queue.push(next);
    });
  }
  entities.forEach(e => { if (!levels.has(e.id)) levels.set(e.id, 0); });

  const byLevel: Map<number, string[]> = new Map();
  levels.forEach((l, id) => {
    if (!byLevel.has(l)) byLevel.set(l, []);
    byLevel.get(l)!.push(id);
  });

  const H_GAP = 300, V_GAP = 220, START_X = 60;
  const posMap: Map<string, { x: number; y: number }> = new Map();
  byLevel.forEach((ids, level) => {
    const totalH = ids.length * V_GAP;
    ids.forEach((id, i) => {
      posMap.set(id, { x: level * H_GAP + START_X, y: i * V_GAP + 60 - (totalH - V_GAP) / 2 + 200 });
    });
  });

  return entities.map(e => ({ ...e, x: posMap.get(e.id)?.x ?? e.x, y: posMap.get(e.id)?.y ?? e.y }));
}

// ─── SVG export ───────────────────────────────────────────────────────────────

function buildExportSVG(state: ERDState): { svg: string; vw: number; vh: number } {
  const pad = 40;
  const xs = state.entities.map(e => e.x), ys = state.entities.map(e => e.y);
  const xe = state.entities.map(e => e.x + W), ye = state.entities.map(e => e.y + entH(e));
  const minX = Math.min(...xs) - pad, minY = Math.min(...ys) - pad;
  const maxX = Math.max(...xe) + pad, maxY = Math.max(...ye) + pad;
  const vw = maxX - minX, vh = maxY - minY;
  const ox = -minX, oy = -minY;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${vw}" height="${vh}" viewBox="0 0 ${vw} ${vh}">
<rect width="${vw}" height="${vh}" fill="#f8fafc"/>
<defs><marker id="a" markerWidth="7" markerHeight="6" refX="6" refY="3" orient="auto"><polygon points="0 0,7 3,0 6" fill="#c8d3e0"/></marker></defs>
`;

  state.relationships.forEach(r => {
    const fe = state.entities.find(e => e.id === r.from), te = state.entities.find(e => e.id === r.to);
    if (!fe || !te) return;
    const goRight = fe.x + W / 2 < te.x + W / 2;
    const x1 = (goRight ? fe.x + W : fe.x) + ox, y1 = fe.y + entH(fe) / 2 + oy;
    const x2 = (goRight ? te.x : te.x + W) + ox, y2 = te.y + entH(te) / 2 + oy;
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
    svg += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#c8d3e0" stroke-width="1.5" marker-end="url(#a)"/>`;
    svg += `<rect x="${mx - 16}" y="${my - 9}" width="32" height="16" rx="4" fill="#f1f5f9" stroke="#e2e8f0"/>`;
    svg += `<text x="${mx}" y="${my + 1}" text-anchor="middle" dominant-baseline="middle" font-size="10" font-family="monospace" fill="#94a3b8">${r.type}</text>`;
  });

  state.entities.forEach(e => {
    const h = entH(e), ex = e.x + ox, ey = e.y + oy;
    svg += `<rect x="${ex}" y="${ey}" width="${W}" height="${h}" rx="10" fill="#fff" stroke="${e.color}" stroke-width="1.5"/>`;
    svg += `<rect x="${ex}" y="${ey}" width="${W}" height="${HEADER_H}" rx="10" fill="${e.color}15"/>`;
    svg += `<rect x="${ex}" y="${ey + HEADER_H - 8}" width="${W}" height="8" fill="${e.color}15"/>`;
    svg += `<circle cx="${ex + 16}" cy="${ey + HEADER_H / 2}" r="4" fill="${e.color}"/>`;
    svg += `<text x="${ex + 28}" y="${ey + HEADER_H / 2 + 1}" dominant-baseline="middle" font-size="12" font-weight="600" font-family="monospace" fill="#1e293b">${e.name}</text>`;
    if (!e.collapsed) {
      e.fields.forEach((f, i) => {
        const fy = ey + HEADER_H + FIELD_PAD + i * FIELD_H;
        if (i > 0) svg += `<line x1="${ex}" y1="${fy}" x2="${ex + W}" y2="${fy}" stroke="#f1f5f9"/>`;
        const badge = f.isPrimary ? 'PK' : f.isForeign ? 'FK' : '';
        const bc = f.isPrimary ? '#f59e0b' : '#06b6d4';
        if (badge) svg += `<text x="${ex + 10}" y="${fy + FIELD_H / 2 + 1}" dominant-baseline="middle" font-size="8.5" font-weight="700" font-family="monospace" fill="${bc}">${badge}</text>`;
        svg += `<text x="${ex + 28}" y="${fy + FIELD_H / 2 + 1}" dominant-baseline="middle" font-size="11" font-family="monospace" fill="${f.isPrimary ? '#0f172a' : '#334155'}" font-weight="${f.isPrimary ? 600 : 400}">${f.name}</text>`;
        svg += `<text x="${ex + W - 8}" y="${fy + FIELD_H / 2 + 1}" dominant-baseline="middle" text-anchor="end" font-size="9.5" font-family="monospace" fill="#94a3b8">${f.type.replace(/\(.*\)$/, '')}</text>`;
      });
    }
  });

  svg += '</svg>';
  return { svg, vw, vh };
}

export function exportSVG(state: ERDState) {
  if (state.entities.length === 0) return;
  const { svg } = buildExportSVG(state);
  const blob = new Blob([svg], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'erd.svg'; a.click();
  URL.revokeObjectURL(url);
}

export function exportPNG(state: ERDState) {
  if (state.entities.length === 0) return;
  const { svg, vw, vh } = buildExportSVG(state);
  const scale = 2;
  const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = vw * scale;
    canvas.height = vh * scale;
    const ctx = canvas.getContext('2d')!;
    ctx.scale(scale, scale);
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, vw, vh);
    ctx.drawImage(img, 0, 0, vw, vh);
    URL.revokeObjectURL(url);
    canvas.toBlob(pngBlob => {
      if (!pngBlob) return;
      const pngUrl = URL.createObjectURL(pngBlob);
      const a = document.createElement('a');
      a.href = pngUrl;
      a.download = 'erd.png';
      a.click();
      URL.revokeObjectURL(pngUrl);
    }, 'image/png');
  };
  img.src = url;
}

// ─── URL sharing ──────────────────────────────────────────────────────────────

export function encodeStateToURL(state: ERDState): string {
  try {
    const json = JSON.stringify(state);
    const encoded = btoa(unescape(encodeURIComponent(json)));
    const url = new URL(window.location.href);
    url.hash = `erd=${encoded}`;
    return url.toString();
  } catch {
    return window.location.href;
  }
}

export function decodeStateFromURL(): ERDState | null {
  try {
    const hash = window.location.hash;
    if (!hash.startsWith('#erd=')) return null;
    const encoded = hash.slice(5);
    const json = decodeURIComponent(escape(atob(encoded)));
    return JSON.parse(json) as ERDState;
  } catch {
    return null;
  }
}

// ─── Lint warnings ────────────────────────────────────────────────────────────

export function computeLintWarnings(state: ERDState): LintWarning[] {
  const warnings: LintWarning[] = [];

  state.entities.forEach(e => {
    if (!e.fields.some(f => f.isPrimary)) {
      warnings.push({ type: 'missing-pk', message: `${e.name}: no primary key defined`, entityId: e.id });
    }
    if (!state.relationships.some(r => r.from === e.id || r.to === e.id)) {
      warnings.push({ type: 'orphan', message: `${e.name}: no relationships (orphan table)`, entityId: e.id });
    }
    const names = e.fields.map(f => f.name);
    const dupsFound = new Set<string>();
    names.forEach((n, i) => {
      if (names.indexOf(n) !== i && !dupsFound.has(n)) {
        dupsFound.add(n);
        warnings.push({ type: 'duplicate-field', message: `${e.name}.${n}: duplicate field name`, entityId: e.id });
      }
    });
    e.fields.filter(f => f.isForeign || f.name.endsWith('_id') && !f.isPrimary).forEach(f => {
      const linked = state.relationships.some(r =>
        (r.from === e.id && r.fromField === f.id) ||
        (r.to === e.id && r.toField === f.id)
      );
      if (!linked) {
        warnings.push({ type: 'unlinked-fk', message: `${e.name}.${f.name}: FK field not linked to a relationship`, entityId: e.id });
      }
    });
  });

  return warnings;
}

// ─── GroupsLayer ──────────────────────────────────────────────────────────────

export function GroupsLayer({ state }: { state: ERDState; onUpdate?: (groups: EntityGroup[]) => void }) {
  if (!state.groups || state.groups.length === 0) return null;

  return (
    <>
      {state.groups.map(group => {
        const ents = state.entities.filter(e => group.entities.includes(e.id));
        if (ents.length === 0) return null;
        const xs = ents.map(e => e.x);
        const ys = ents.map(e => e.y);
        const xe = ents.map(e => e.x + W);
        const ye = ents.map(e => e.y + entH(e));
        const pad = 20;
        const x = Math.min(...xs) - pad;
        const y = Math.min(...ys) - pad;
        const w = Math.max(...xe) - Math.min(...xs) + pad * 2;
        const h = Math.max(...ye) - Math.min(...ys) + pad * 2;
        return (
          <div key={group.id} style={{
            position: 'absolute', left: x, top: y, width: w, height: h,
            borderRadius: 14,
            border: `2px dashed ${group.color}66`,
            background: group.color + '08',
            pointerEvents: 'none',
          }}>
            <span style={{
              position: 'absolute', top: 6, left: 12,
              fontSize: 10, fontWeight: 700, fontFamily: 'ui-monospace,monospace',
              color: group.color + 'cc', letterSpacing: '0.05em',
            }}>
              {group.name}
            </span>
          </div>
        );
      })}
    </>
  );
}

// ─── Migration SQL generator ─────────────────────────────────────────────────

export function generateMigrationSQL(before: ERDState, after: ERDState): string {
  const lines: string[] = ['-- Migration SQL (auto-generated)', '-- Review carefully before running', ''];

  const beforeMap = new Map(before.entities.map(e => [e.name, e]));
  const afterMap = new Map(after.entities.map(e => [e.name, e]));

  // Dropped tables
  for (const [name] of beforeMap) {
    if (!afterMap.has(name)) {
      lines.push(`DROP TABLE IF EXISTS ${name};`, '');
    }
  }

  // New tables
  for (const [name, ent] of afterMap) {
    if (!beforeMap.has(name)) {
      if (ent.description) lines.push(`-- ${ent.description}`);
      lines.push(`CREATE TABLE ${ent.name} (`);
      const fieldLines: string[] = [];
      ent.fields.forEach(f => {
        let l = `  ${f.name} ${f.type}`;
        if (!f.isNullable) l += ' NOT NULL';
        if (f.defaultValue) l += ` DEFAULT ${f.defaultValue}`;
        if (f.isUnique && !f.isPrimary) l += ' UNIQUE';
        fieldLines.push(l);
      });
      const pks = ent.fields.filter(f => f.isPrimary);
      if (pks.length === 1) {
        const idx = fieldLines.findIndex((_, i) => ent.fields[i].isPrimary);
        if (idx >= 0) fieldLines[idx] += ' PRIMARY KEY';
      } else if (pks.length > 1) {
        fieldLines.push(`  PRIMARY KEY (${pks.map(f => f.name).join(', ')})`);
      }
      lines.push(fieldLines.join(',\n'), ');\n');
      continue;
    }

    // Modified tables — compare fields
    const beforeEnt = beforeMap.get(name)!;
    const beforeFieldMap = new Map(beforeEnt.fields.map(f => [f.name, f]));
    const afterFieldMap = new Map(ent.fields.map(f => [f.name, f]));

    const tableLines: string[] = [];

    // Dropped fields
    for (const [fname] of beforeFieldMap) {
      if (!afterFieldMap.has(fname)) {
        tableLines.push(`  DROP COLUMN ${fname}`);
      }
    }

    // New or modified fields
    for (const [fname, af] of afterFieldMap) {
      const bf = beforeFieldMap.get(fname);
      if (!bf) {
        let col = `  ADD COLUMN ${af.name} ${af.type}`;
        if (!af.isNullable) col += ' NOT NULL';
        if (af.defaultValue) col += ` DEFAULT ${af.defaultValue}`;
        if (af.description) col += ` -- ${af.description}`;
        tableLines.push(col);
      } else if (bf.type !== af.type || bf.isNullable !== af.isNullable || bf.defaultValue !== af.defaultValue) {
        let col = `  MODIFY COLUMN ${af.name} ${af.type}`;
        if (!af.isNullable) col += ' NOT NULL';
        if (af.defaultValue) col += ` DEFAULT ${af.defaultValue}`;
        tableLines.push(col);
      }
    }

    if (tableLines.length > 0) {
      lines.push(`ALTER TABLE ${name}`);
      lines.push(tableLines.join(',\n') + ';', '');
    }
  }

  if (lines.length <= 3) lines.push('-- No changes detected');
  return lines.join('\n');
}

// ─── AI Schema Modal ──────────────────────────────────────────────────────────

const AI_KEY_STORAGE = 'erd-anthropic-key';
const AI_MODEL = 'claude-opus-4-7';

const AI_SYSTEM_PROMPT = `You are a database schema expert. Given a description of an application, generate a complete ERD schema in JSON format.

Return ONLY valid JSON matching this exact structure:
{
  "entities": [
    {
      "id": "e1",
      "name": "table_name",
      "x": 60,
      "y": 80,
      "color": "#3b82f6",
      "collapsed": false,
      "description": "optional description",
      "fields": [
        {
          "id": "f1",
          "name": "id",
          "type": "UUID",
          "isPrimary": true,
          "isNullable": false,
          "isUnique": true,
          "isForeign": false,
          "description": "optional"
        }
      ]
    }
  ],
  "relationships": [
    {
      "id": "r1",
      "from": "e1",
      "to": "e2",
      "type": "1:N",
      "label": ""
    }
  ]
}

Rules:
- Every table must have a UUID or INT primary key named 'id'
- Use snake_case for all names
- Timestamps: created_at TIMESTAMP, updated_at TIMESTAMP
- Foreign keys: {table_singular}_id UUID
- Choose colors from: #3b82f6 #8b5cf6 #ec4899 #f59e0b #10b981 #06b6d4 #6366f1 #f97316
- Layout entities nicely: x from 60 to 900, y from 60 to 600, spaced 340px apart horizontally
- relationship type: "1:1", "1:N", or "N:M"
- from/to reference entity ids
- Return ONLY the JSON, no markdown, no explanation`;

export function AISchemaModal({
  onImport,
  onClose,
}: {
  onImport: (state: ERDState) => void;
  onClose: () => void;
}) {
  const [prompt, setPrompt] = useState('');
  const [apiKey, setApiKey] = useState(() => localStorage.getItem(AI_KEY_STORAGE) ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showKey, setShowKey] = useState(false);

  const handleGenerate = async () => {
    if (!apiKey.trim() || !prompt.trim()) return;
    localStorage.setItem(AI_KEY_STORAGE, apiKey.trim());
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': apiKey.trim(),
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: AI_MODEL,
          max_tokens: 4000,
          system: AI_SYSTEM_PROMPT,
          messages: [{ role: 'user', content: prompt }],
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { error?: { message?: string } }).error?.message ?? `HTTP ${res.status}`);
      }
      const data = await res.json() as { content: { type: string; text: string }[] };
      const text = data.content.find(c => c.type === 'text')?.text ?? '';
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('AI가 유효한 JSON을 반환하지 않았습니다');
      const parsed = JSON.parse(jsonMatch[0]) as ERDState;
      if (!parsed.entities || !Array.isArray(parsed.entities)) throw new Error('스키마 구조가 올바르지 않습니다');
      onImport(parsed);
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  const EXAMPLES = [
    '블로그 플랫폼: 사용자, 게시글, 댓글, 태그, 카테고리',
    '쇼핑몰: 상품, 주문, 결제, 배송, 리뷰, 재고',
    '배달 앱: 식당, 메뉴, 주문, 주문 항목, 배달원, 고객',
    '소셜 네트워크: 사용자, 팔로우, 게시글, 좋아요, DM',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.4)' }} onClick={onClose}>
      <div
        className="flex flex-col rounded-2xl overflow-hidden"
        style={{ width: 560, maxHeight: '80vh', background: '#fff', boxShadow: '0 20px 60px -10px rgba(0,0,0,0.25)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4" style={{ borderBottom: '1px solid #f1f5f9', background: 'linear-gradient(135deg,#eff6ff,#f5f3ff)' }}>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-bold" style={{ color: '#1e293b' }}>AI 스키마 생성</div>
              <div className="text-xs mt-0.5" style={{ color: '#64748b' }}>서비스를 설명하면 ERD를 자동으로 생성합니다</div>
            </div>
            <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/60" style={{ color: '#94a3b8' }}>
              <X size={14} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* API Key */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: '#64748b' }}>
              Anthropic API Key
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                className="w-full rounded-lg px-3 py-2 text-xs font-mono focus:outline-none pr-16"
                style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#334155' }}
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                placeholder="sk-ant-..."
                onFocus={e => (e.currentTarget.style.borderColor = '#a78bfa')}
                onBlur={e => (e.currentTarget.style.borderColor = '#e2e8f0')}
              />
              <button
                onClick={() => setShowKey(v => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] px-2 py-0.5 rounded"
                style={{ color: '#94a3b8', background: '#f1f5f9' }}>
                {showKey ? 'Hide' : 'Show'}
              </button>
            </div>
            <p className="text-[10px] mt-1" style={{ color: '#94a3b8' }}>키는 브라우저 localStorage에만 저장됩니다</p>
          </div>

          {/* Prompt */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: '#64748b' }}>
              서비스 설명
            </label>
            <textarea
              className="w-full rounded-lg px-3 py-2.5 text-sm resize-none focus:outline-none"
              style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#334155', minHeight: 100 }}
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="예: 음식 배달 앱 — 식당, 메뉴, 주문, 배달원, 리뷰 시스템이 필요합니다"
              onFocus={e => (e.currentTarget.style.borderColor = '#a78bfa')}
              onBlur={e => (e.currentTarget.style.borderColor = '#e2e8f0')}
            />
            {/* Examples */}
            <div className="mt-2 flex flex-col gap-1">
              {EXAMPLES.map(ex => (
                <button key={ex}
                  onClick={() => setPrompt(ex)}
                  className="text-left text-[10px] px-2 py-1 rounded transition-colors hover:bg-gray-50"
                  style={{ color: '#64748b' }}>
                  → {ex}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="rounded-lg px-3 py-2.5 text-xs" style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626' }}>
              {error}
            </div>
          )}
        </div>

        <div className="px-5 py-3 flex justify-end gap-2" style={{ borderTop: '1px solid #f1f5f9' }}>
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-xs font-medium hover:bg-gray-50 transition-colors"
            style={{ border: '1px solid #e2e8f0', color: '#64748b' }}>
            취소
          </button>
          <button
            onClick={handleGenerate}
            disabled={loading || !apiKey.trim() || !prompt.trim()}
            className="px-5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2"
            style={{
              background: loading || !apiKey.trim() || !prompt.trim() ? '#e2e8f0' : 'linear-gradient(135deg,#6366f1,#8b5cf6)',
              color: loading || !apiKey.trim() || !prompt.trim() ? '#94a3b8' : '#fff',
            }}>
            {loading ? (
              <>
                <span className="animate-spin inline-block w-3 h-3 border-2 border-white/40 border-t-white rounded-full" />
                생성 중...
              </>
            ) : '✨ 생성하기'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Project type ─────────────────────────────────────────────────────────────

export interface Project {
  id: string;
  name: string;
  updatedAt: number;
  state: ERDState;
  snapshot?: ERDState; // for migration SQL
}

// Re-export Database icon for use in parent
export { Database };
