import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { BlogPackage, BlogProject } from '../data';
import { blogPosts, PACKAGES, PROJECTS } from '../blog';
import { Byline, Cover, fade } from '../blog/ui';

const isPackage = (v: string | undefined): v is BlogPackage =>
  PACKAGES.some((p) => p.id === v);

/** 상위 축 — 'tech'는 특정 제품에 매이지 않은 일반 기술 글. */
type Scope = 'all' | 'tech' | BlogProject;

const inScope = (p: (typeof blogPosts)[number], scope: Scope) =>
  scope === 'all' ? true : scope === 'tech' ? !p.project : p.project === scope;

export default function Blog() {
  const { pkg } = useParams<{ pkg: string }>();
  const [scope, setScope] = useState<Scope>('all');
  const [author, setAuthor] = useState<BlogPackage | null>(() =>
    isPackage(pkg) ? pkg : null,
  );

  // 상위(스코프)로 먼저 좁히고, 그 안에서 작성자로 한 번 더.
  const scoped = useMemo(() => blogPosts.filter((p) => inScope(p, scope)), [scope]);

  const posts = useMemo(
    () =>
      scoped
        .filter((p) => (author ? p.package === author : true))
        .sort(
          (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
        ),
    [scoped, author],
  );

  const activePkg = author ? PACKAGES.find((p) => p.id === author) ?? null : null;
  const activeProj =
    scope === 'all' || scope === 'tech'
      ? null
      : PROJECTS.find((p) => p.id === scope) ?? null;
  const featured = posts[0];
  const rest = posts.slice(1);

  const scopeTabs: { id: Scope; label: string; count: number }[] = [
    { id: 'all', label: '전체', count: blogPosts.length },
    { id: 'tech', label: 'Tech', count: blogPosts.filter((p) => !p.project).length },
    ...PROJECTS.map((pr) => ({
      id: pr.id as Scope,
      label: pr.label,
      count: blogPosts.filter((p) => p.project === pr.id).length,
    })),
  ];

  // 작성자 숫자는 지금 스코프 안에서 센다.
  const authorChips = PACKAGES.map((p) => ({
    id: p.id,
    label: p.label,
    count: scoped.filter((x) => x.package === p.id).length,
  }));

  // 스코프를 옮겼을 때 해당 작성자의 글이 없으면 작성자 선택을 풀어준다.
  const pickScope = (next: Scope) => {
    const target = next === scope ? 'all' : next;
    setScope(target);
    if (author && !blogPosts.some((p) => inScope(p, target) && p.package === author)) {
      setAuthor(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="blog min-h-screen bg-[var(--bg)] pt-24 sm:pt-32 pb-32 px-4"
    >
      <div className="max-w-6xl mx-auto">
        {/* ── Header ────────────────────────────────────────────── */}
        <header>
          <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
            <h1 className="display text-[clamp(2.4rem,5.6vw,3.6rem)] font-bold leading-[1.0] tracking-[-0.035em] text-[var(--ink)]">
              Blog
            </h1>
            <p className="pb-1.5 font-mono text-[12.5px] tracking-tight text-[var(--ink-faint)]">
              {String(blogPosts.length).padStart(2, '0')} Articles
              <span className="mx-1.5 text-[var(--line)]">/</span>
              Team Cygnus
            </p>
          </div>
          <p className="mt-6 max-w-[52ch] text-[16px] leading-[1.75] text-[var(--ink-soft)] sm:text-[16.5px]">
            제품을 개발하며 내린 기술적 의사결정과 구현 과정, 그리고 그 판단의 근거를 정리합니다.
          </p>
        </header>

        {/* ── 상위 — Tech · 프로젝트 ─────────────────────────── */}
        <nav className="mt-8 border-b border-[var(--line)]">
          <div className="flex flex-wrap items-center gap-x-7">
            {scopeTabs.map((t) => {
              const on = scope === t.id;
              const empty = t.count === 0 && !on;
              return (
                <button
                  key={t.id}
                  type="button"
                  disabled={empty}
                  onClick={() => pickScope(t.id)}
                  className={`relative pb-3 pt-1 text-[15px] font-semibold tracking-tight transition-colors ${
                    on
                      ? 'text-[var(--ink)]'
                      : empty
                        ? 'text-[var(--ink-faint)] opacity-40'
                        : 'text-[var(--ink-faint)] hover:text-[var(--ink-soft)]'
                  }`}
                >
                  {t.label}
                  <span className="ml-1.5 align-top text-[11px] font-medium tabular-nums text-[var(--ink-faint)]">
                    {t.count}
                  </span>
                  {on && (
                    <motion.span
                      layoutId="blog-scope-underline"
                      className="absolute inset-x-0 -bottom-px h-[2px] rounded-full bg-[var(--ink)]"
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* ── 하위 — 작성자 ──────────────────────────────────── */}
        <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-2">
          <span className="mr-1 text-[11.5px] font-medium tracking-tight text-[var(--ink-faint)]">
            작성자
          </span>
          {authorChips.map((t) => {
            const on = author === t.id;
            const empty = t.count === 0 && !on;
            return (
              <button
                key={t.id}
                type="button"
                disabled={empty}
                onClick={() => setAuthor(on ? null : t.id)}
                className={`inline-flex items-center rounded-full border px-3 py-[5px] text-[13px] font-medium transition-colors ${
                  on
                    ? 'border-[var(--ink)] bg-[var(--ink)] text-white'
                    : empty
                      ? 'border-[var(--line)] text-[var(--ink-faint)] opacity-40'
                      : 'border-[var(--line)] text-[var(--ink-soft)] hover:border-[var(--ink-faint)] hover:text-[var(--ink)]'
                }`}
              >
                {t.label}
                <span
                  className={`ml-1.5 text-[11px] tabular-nums ${
                    on ? 'text-white/70' : 'text-[var(--ink-faint)]'
                  }`}
                >
                  {t.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* One-line note — never a big landing block */}
        {(activePkg || activeProj) && (
          <p className="mt-5 text-[13.5px] leading-[1.6] text-[var(--ink-faint)]">
            {[activeProj?.description, activePkg?.description].filter(Boolean).join(' · ')}
          </p>
        )}

        {/* ── Posts ─────────────────────────────────────────────── */}
        <div key={`${scope}-${author ?? 'a'}`}>
          {featured && (
            <motion.div
              initial="hidden"
              animate="visible"
              custom={0}
              variants={fade}
              className="mt-9"
            >
              <Link
                to={`/blog/${featured.package}/${featured.id}`}
                className="group grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-6 lg:gap-10 items-center"
              >
                <Cover post={featured} size="wide" />
                <div>
                  <p className="text-[16px] leading-[1.8] text-[var(--ink-soft)] line-clamp-4">
                    {featured.excerpt}
                  </p>
                  <div className="mt-6 flex items-center justify-between">
                    <Byline post={featured} />
                    <span
                      aria-hidden
                      className="text-[var(--ink-faint)] transition-all duration-300 group-hover:text-[var(--accent)] group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          )}

          {rest.length > 0 && (
            <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
              {rest.map((p, i) => (
                <motion.article
                  key={`${p.package}/${p.id}`}
                  initial="hidden"
                  animate="visible"
                  custom={i + 1}
                  variants={fade}
                >
                  <Link to={`/blog/${p.package}/${p.id}`} className="group block">
                    <Cover post={p} />
                    <p className="mt-4 text-[14.5px] leading-[1.6] text-[var(--ink-soft)] line-clamp-2">
                      {p.excerpt}
                    </p>
                    <div className="mt-3.5">
                      <Byline post={p} />
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          )}

          {posts.length === 0 && (
            <p className="py-24 text-center text-[14.5px] text-[var(--ink-faint)]">
              아직 여기에 해당하는 글이 없습니다.
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
