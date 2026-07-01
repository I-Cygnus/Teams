import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { BlogPackage } from '../data';
import { blogPosts, PACKAGES, postsByPackage } from '../blog';
import { Byline, Cover, fade } from '../blog/ui';

type Tab = 'all' | BlogPackage;

const isPackage = (v: string | undefined): v is BlogPackage =>
  PACKAGES.some((p) => p.id === v);

export default function Blog() {
  // Deep links like /blog/choi open with that package pre-selected; in-page
  // tab clicks just filter locally so switching feels instant, not like a
  // full page transition.
  const { pkg } = useParams<{ pkg: string }>();
  const [tab, setTab] = useState<Tab>(() => (isPackage(pkg) ? pkg : 'all'));

  const posts = useMemo(() => {
    const base = tab === 'all' ? [...blogPosts] : postsByPackage(tab);
    return base.sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );
  }, [tab]);

  const activePkg = tab === 'all' ? null : PACKAGES.find((p) => p.id === tab) ?? null;
  const featured = posts[0];
  const rest = posts.slice(1);

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: 'all', label: '전체', count: blogPosts.length },
    ...PACKAGES.map((p) => ({
      id: p.id,
      label: p.label,
      count: postsByPackage(p.id).length,
    })),
  ];

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

        {/* ── Package tabs — selectable, low profile ───────────── */}
        <nav className="mt-8 border-b border-[var(--line)]">
          <div className="flex flex-wrap items-center gap-x-7">
            {tabs.map((t) => {
              const on = tab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  className={`group relative pb-3 pt-1 text-[14.5px] font-medium transition-colors ${
                    on
                      ? 'text-[var(--ink)]'
                      : 'text-[var(--ink-faint)] hover:text-[var(--ink-soft)]'
                  }`}
                >
                  {t.label}
                  <span className="ml-1.5 align-top text-[11px] tabular-nums text-[var(--ink-faint)]">
                    {t.count}
                  </span>
                  {on && (
                    <motion.span
                      layoutId="blog-tab-underline"
                      className="absolute inset-x-0 -bottom-px h-[2px] rounded-full bg-[var(--ink)]"
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* One-line package note — never a big landing block */}
        {activePkg && (
          <p className="mt-5 text-[13.5px] leading-[1.6] text-[var(--ink-faint)]">
            {activePkg.description}
          </p>
        )}

        {/* ── Posts ─────────────────────────────────────────────── */}
        <div key={tab}>
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
              아직 이 패키지에 글이 없습니다.
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
