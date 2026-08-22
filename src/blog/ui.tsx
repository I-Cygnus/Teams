import { teamMembers } from '../data';
import type { BlogCategory, BlogPackage, BlogPost } from '../data';
import { PACKAGES } from './index';

/* ── Motion ──────────────────────────────────────────────────────── */

export const ease = [0.22, 1, 0.36, 1] as const;

export const fade = {
  hidden: { opacity: 0, y: 14 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.05, ease },
  }),
};

/* ── Data helpers ────────────────────────────────────────────────── */

export function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}. ${d.getMonth() + 1}. ${d.getDate()}.`;
}

export function packageLabel(pkg: BlogPackage) {
  return PACKAGES.find((p) => p.id === pkg)?.label ?? pkg;
}

export interface Author {
  name: string;
  role: string;
  brief: string;
}

export function authorOf(p: BlogPost): Author {
  if (p.authorOverride) {
    return { name: p.authorOverride.name, role: p.authorOverride.role, brief: '' };
  }
  const m = teamMembers.find((tm) => tm.id === p.authorId);
  if (m) return { name: m.name, role: m.role, brief: m.brief };
  return { name: 'Team', role: '', brief: '' };
}

/* ── Category color (soft pastel, never rainbow gradients) ───────── */

interface Tint {
  bg: string;
  fg: string;
}

const CATEGORY_TINT: Record<BlogCategory, Tint> = {
  Frontend: { bg: '#eef2ff', fg: '#4c6ef5' },
  Backend: { bg: '#e7f5ff', fg: '#1c7ed6' },
  Design: { bg: '#fff0f6', fg: '#e64980' },
  Product: { bg: '#fff4e6', fg: '#e8590c' },
  Culture: { bg: '#ebfbee', fg: '#2f9e44' },
  Infrastructure: { bg: '#e3fafc', fg: '#0b7285' },
  AI: { bg: '#f8f0fc', fg: '#9c36b5' },
};

export function categoryTint(c: BlogCategory): Tint {
  return CATEGORY_TINT[c] ?? { bg: '#f1f3f5', fg: '#495057' };
}

/* ── Category chip ───────────────────────────────────────────────── */

export function Chip({ category, solid = false }: { category: BlogCategory; solid?: boolean }) {
  const t = categoryTint(category);
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-1 text-[12px] font-semibold leading-none"
      style={solid ? { background: t.bg, color: t.fg } : { background: '#ffffff', color: t.fg }}
    >
      {category}
    </span>
  );
}

/* ── Cover — neutral editorial card with a category-tinted edge ──── */

export function Cover({
  post,
  size = 'card',
}: {
  post: BlogPost;
  size?: 'card' | 'wide';
}) {
  const t = categoryTint(post.category);
  const aspect = size === 'wide' ? 'aspect-[16/10]' : 'aspect-[16/11]';
  const titleSize =
    size === 'wide'
      ? 'text-[clamp(1.5rem,2.6vw,2.1rem)]'
      : 'text-[clamp(1.1rem,2vw,1.35rem)]';

  // Real image thumbnail — photo fills the card, title overlaid on a scrim.
  if (post.coverImage) {
    return (
      <div
        className={`relative ${aspect} overflow-hidden rounded-2xl border border-[var(--line)] bg-[#0d1117] transition-all duration-300 will-change-transform group-hover:-translate-y-1 group-hover:shadow-[0_16px_36px_-18px_rgba(16,18,29,0.28)]`}
      >
        <img
          src={post.coverImage}
          alt={post.title}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/5" aria-hidden />
        <div className={`absolute inset-0 ${size === 'wide' ? 'p-8 sm:p-10' : 'p-6'} flex flex-col justify-between`}>
          <span
            className="inline-flex w-fit items-center rounded-full bg-white/15 px-2.5 py-1 text-[11.5px] font-semibold text-white backdrop-blur-sm"
          >
            {post.category}
          </span>
          <h3 className={`display ${titleSize} font-bold leading-[1.3] text-white line-clamp-3`}>
            {post.title}
          </h3>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative ${aspect} overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--card)] transition-all duration-300 will-change-transform group-hover:-translate-y-1 group-hover:border-[var(--ink-faint)]/40 group-hover:shadow-[0_16px_36px_-18px_rgba(16,18,29,0.22)]`}
    >
      {/* slim category edge — the only color, kept restrained */}
      <span className="absolute left-0 top-0 h-full w-[3px]" style={{ background: t.fg }} aria-hidden />
      <div className={`absolute inset-0 ${size === 'wide' ? 'p-8 sm:p-10' : 'p-6'} flex flex-col justify-between`}>
        <span className="text-[11.5px] font-semibold tracking-[0.01em]" style={{ color: t.fg }}>
          {post.category}
        </span>
        <h3
          className={`display ${titleSize} font-bold leading-[1.3] text-[var(--ink)] line-clamp-3`}
        >
          {post.title}
        </h3>
      </div>
    </div>
  );
}

/* ── Author avatar (monogram) + byline ───────────────────────────── */

export function Avatar({ name, size = 'sm' }: { name: string; size?: 'sm' | 'lg' }) {
  const dim = size === 'lg' ? 'w-11 h-11 text-[16px]' : 'w-7 h-7 text-[12px]';
  return (
    <span
      className={`grid place-items-center rounded-full ${dim} font-bold flex-shrink-0`}
      style={{ background: '#eef2ff', color: 'var(--accent)' }}
    >
      {name.slice(0, 1)}
    </span>
  );
}

export function Byline({ post }: { post: BlogPost }) {
  const a = authorOf(post);
  return (
    <div className="flex items-center gap-2 text-[13px] text-[var(--ink-faint)]">
      <Avatar name={a.name} />
      <span className="font-medium text-[var(--ink-soft)]">{a.name}</span>
      <span aria-hidden>·</span>
      <span>{formatDate(post.publishedAt)}</span>
    </div>
  );
}
