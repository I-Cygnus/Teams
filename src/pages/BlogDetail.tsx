import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Check, Copy } from 'lucide-react';
import type { BlogBlock, BlogPackage, BlogPost } from '../data';
import { blogPosts, findPost } from '../blog';
import { Avatar, authorOf, Byline, Chip, Cover, fade, formatDate, packageLabel } from '../blog/ui';

/* ── Inline: **bold** and `code` ─────────────────────────────────── */

function renderInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-bold text-[var(--ink)]">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={i}
          className="rounded-[5px] px-[6px] py-[2px] font-mono text-[0.86em] font-medium text-[var(--accent-strong)]"
          style={{ background: '#eef1fb' }}
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

/* ── Code block — dark, with language label + copy ───────────────── */

function CodeBlock({ block }: { block: BlogBlock }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(block.text ?? '').then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    });
  };
  return (
    <div className="my-8 overflow-hidden rounded-xl border border-[#1f2430] bg-[#0d1117]">
      <div className="flex items-center justify-between border-b border-[#1f2430] px-4 py-2.5">
        <span className="font-mono text-[12px] tracking-wide text-[#7d8590]">
          {block.language ?? 'code'}
        </span>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1.5 rounded-md px-1.5 py-1 text-[12px] font-medium text-[#7d8590] transition-colors hover:text-[#e6edf3]"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? '복사됨' : '복사'}
        </button>
      </div>
      <pre className="overflow-x-auto px-5 py-4 text-[13px] leading-[1.75]">
        <code className="block whitespace-pre font-mono text-[#e6edf3]">{block.text}</code>
      </pre>
    </div>
  );
}

/* ── One content block ───────────────────────────────────────────── */

function Block({ block, id, lead }: { block: BlogBlock; id?: string; lead?: boolean }) {
  switch (block.type) {
    case 'h2':
      return (
        <h2
          id={id}
          className="group display scroll-mt-28 mt-16 mb-5 text-[24px] sm:text-[28px] font-bold tracking-[-0.02em] leading-[1.35] text-[var(--ink)]"
        >
          <a href={`#${id}`} className="inline-flex items-baseline">
            <span
              aria-hidden
              className="-ml-6 hidden w-6 select-none pr-1 text-[var(--accent)] opacity-0 transition-opacity group-hover:opacity-100 sm:inline"
            >
              #
            </span>
            {block.text}
          </a>
        </h2>
      );
    case 'h3':
      return (
        <h3
          id={id}
          className="group scroll-mt-28 mt-11 mb-3.5 text-[18px] sm:text-[20px] font-bold tracking-[-0.015em] leading-[1.45] text-[var(--ink)]"
        >
          <a href={`#${id}`} className="inline-flex items-baseline">
            <span
              aria-hidden
              className="-ml-5 hidden w-5 select-none pr-1 text-[var(--accent)] opacity-0 transition-opacity group-hover:opacity-100 sm:inline"
            >
              #
            </span>
            {block.text}
          </a>
        </h3>
      );
    case 'p':
      return lead ? (
        <p className="mb-8 text-[19px] sm:text-[21px] leading-[1.65] text-[var(--ink)]">
          {renderInline(block.text ?? '')}
        </p>
      ) : (
        <p className="mb-6 text-[16px] sm:text-[17px] leading-[1.85] text-[#374151]">
          {renderInline(block.text ?? '')}
        </p>
      );
    case 'quote':
      return (
        <blockquote className="my-9 border-l-[3px] border-[var(--accent)] pl-5 sm:pl-6 text-[18px] sm:text-[20px] font-medium italic leading-[1.6] text-[var(--ink)]">
          {renderInline(block.text ?? '')}
        </blockquote>
      );
    case 'list':
      return (
        <ul className="my-6 space-y-2.5 pl-5 list-disc marker:text-[var(--accent)]">
          {block.items?.map((it, idx) => (
            <li key={idx} className="pl-1.5 text-[16px] leading-[1.75] text-[#374151]">
              {renderInline(it)}
            </li>
          ))}
        </ul>
      );
    case 'code':
      return <CodeBlock block={block} />;
    case 'table':
      return (
        <div className="my-8 overflow-x-auto rounded-2xl border border-[var(--line)]">
          <table className="w-full text-[14px]">
            <thead style={{ background: '#f6f8fa' }}>
              <tr>
                {block.headers?.map((h, i) => (
                  <th
                    key={i}
                    className="border-b border-[var(--line)] px-5 py-3 text-left text-[13px] font-semibold text-[var(--ink-soft)]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows?.map((row, ri) => (
                <tr key={ri} className="border-b border-[var(--line)] last:border-b-0">
                  {row.map((cell, ci) => (
                    <td
                      key={ci}
                      className={`px-5 py-3 leading-[1.6] ${
                        ci === 0 ? 'font-semibold text-[var(--ink)]' : 'text-[var(--ink-soft)]'
                      }`}
                    >
                      {renderInline(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case 'image':
      return (
        <figure className="my-10 lg:relative lg:left-1/2 lg:w-[min(1040px,calc(100vw-8rem))] lg:-translate-x-1/2 xl:left-[calc(50%-7rem)] xl:w-[min(940px,calc(100vw-24rem))]">
          <div className="overflow-hidden rounded-2xl border border-[var(--line)]" style={{ background: '#f6f8fa' }}>
            <img src={block.src} alt={block.alt ?? ''} className="h-auto w-full object-contain" />
          </div>
          {block.caption && (
            <figcaption className="mt-3 text-center text-[13px] leading-[1.6] text-[var(--ink-faint)]">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );
    case 'hr':
      return <div className="my-12 h-px bg-[var(--line)]" />;
    default:
      return null;
  }
}

/* ── Related posts ───────────────────────────────────────────────── */

function getRelated(current: BlogPost) {
  return blogPosts
    .filter((p) => !(p.package === current.package && p.id === current.id))
    .sort((a, b) => {
      const scoreA = (a.package === current.package ? 2 : 0) + (a.category === current.category ? 1 : 0);
      const scoreB = (b.package === current.package ? 2 : 0) + (b.category === current.category ? 1 : 0);
      return scoreB - scoreA;
    })
    .slice(0, 3);
}

interface Heading {
  id: string;
  text: string;
  level: 2 | 3;
}

export default function BlogDetail() {
  const { pkg, id } = useParams<{ pkg: string; id: string }>();
  const post = pkg && id ? findPost(pkg as BlogPackage, id) : undefined;

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  const headings: Heading[] = useMemo(
    () =>
      (post?.body ?? [])
        .map((b, i) => ({ b, i }))
        .filter(({ b }) => b.type === 'h2' || b.type === 'h3')
        .map(({ b, i }) => ({
          id: `sec-${i}`,
          text: b.text ?? '',
          level: (b.type === 'h2' ? 2 : 3) as 2 | 3,
        })),
    [post],
  );

  const [activeId, setActiveId] = useState('');
  useEffect(() => {
    if (headings.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: '-15% 0px -70% 0px', threshold: 0 },
    );
    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [headings]);

  if (!post) return <Navigate to="/blog" replace />;

  const author = authorOf(post);
  const related = getRelated(post);
  const firstParagraph = post.body.findIndex((b) => b.type === 'p');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="blog min-h-screen bg-[var(--bg)]"
    >
      {/* Reading progress */}
      <motion.div
        className="fixed top-14 left-0 right-0 z-30 h-[2px] origin-left bg-[var(--accent)]"
        style={{ scaleX: progress }}
      />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="px-4 pt-24 sm:pt-32">
        <div className="mx-auto max-w-[720px]">
          <motion.div initial="hidden" animate="visible" custom={0} variants={fade}>
            <Link
              to={`/blog/${post.package}`}
              className="group mb-9 inline-flex items-center gap-1.5 text-[13.5px] text-[var(--ink-faint)] transition-colors hover:text-[var(--ink)]"
            >
              <span aria-hidden className="transition-transform group-hover:-translate-x-0.5">←</span>
              {packageLabel(post.package)}
            </Link>
          </motion.div>

          <motion.div initial="hidden" animate="visible" custom={1} variants={fade} className="mb-5">
            <Chip category={post.category} solid />
          </motion.div>

          <motion.h1
            initial="hidden"
            animate="visible"
            custom={2}
            variants={fade}
            className="display mb-6 text-[30px] font-bold leading-[1.2] tracking-[-0.025em] text-[var(--ink)] sm:text-[40px] lg:text-[46px]"
          >
            {post.title}
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="visible"
            custom={3}
            variants={fade}
            className="mb-9 text-[17px] leading-[1.7] text-[var(--ink-soft)] sm:text-[18px]"
          >
            {post.excerpt}
          </motion.p>

          <motion.div
            initial="hidden"
            animate="visible"
            custom={4}
            variants={fade}
            className="mb-14 flex items-center gap-3 border-b border-[var(--line)] pb-9"
          >
            <Avatar name={author.name} size="lg" />
            <div className="min-w-0">
              <p className="text-[14.5px] font-semibold text-[var(--ink)]">{author.name}</p>
              <p className="text-[12.5px] text-[var(--ink-faint)]">
                {author.role && <>{author.role} · </>}
                {formatDate(post.publishedAt)} · {post.readingMinutes}분 읽기
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Body + Table of contents ─────────────────────────── */}
      <div className="relative mx-auto max-w-[720px] px-4 pb-20">
        <motion.article initial="hidden" animate="visible" custom={5} variants={fade}>
          {post.body.map((b, i) => (
            <Block key={i} block={b} id={`sec-${i}`} lead={i === firstParagraph} />
          ))}

          {/* Tags */}
          <div className="mt-16 flex flex-wrap gap-2 border-t border-[var(--line)] pt-7">
            {post.tags.map((t) => (
              <span
                key={t}
                className="rounded-full px-3 py-1.5 text-[12.5px] text-[var(--ink-soft)] transition-colors hover:text-[var(--ink)]"
                style={{ background: '#f1f3f5' }}
              >
                #{t}
              </span>
            ))}
          </div>

          {/* Author card */}
          <div
            className="mt-10 flex items-center gap-4 rounded-2xl bg-[var(--card)] p-6"
            style={{ border: '1px solid var(--line)' }}
          >
            <Avatar name={author.name} size="lg" />
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-bold text-[var(--ink)]">
                {author.name}
                {author.role && <span className="font-medium text-[var(--ink-soft)]"> · {author.role}</span>}
              </p>
              {author.brief && (
                <p className="mt-1.5 text-[13.5px] leading-[1.6] text-[var(--ink-soft)]">{author.brief}</p>
              )}
            </div>
            <Link
              to={`/blog/${post.package}`}
              className="group hidden items-center gap-1.5 whitespace-nowrap text-[13.5px] font-medium text-[var(--accent)] sm:inline-flex"
            >
              더 보기
              <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
            </Link>
          </div>
        </motion.article>

        {/* Sticky TOC — floats in the right gutter on wide screens */}
        {headings.length > 1 && (
          <aside className="pointer-events-none absolute left-full top-0 ml-32 hidden h-full w-56 xl:block">
            <nav className="pointer-events-auto sticky top-28">
              <p className="mb-3 text-[11.5px] font-semibold uppercase tracking-[0.12em] text-[var(--ink-faint)]">
                목차
              </p>
              <ul className="space-y-1.5 border-l border-[var(--line)]">
                {headings.map((h) => {
                  const on = activeId === h.id;
                  return (
                    <li key={h.id}>
                      <a
                        href={`#${h.id}`}
                        className={`-ml-px block border-l-[1.5px] py-1 text-[13px] leading-[1.5] transition-colors ${
                          h.level === 3 ? 'pl-6' : 'pl-3.5'
                        } ${
                          on
                            ? 'border-[var(--accent)] font-medium text-[var(--accent)]'
                            : 'border-transparent text-[var(--ink-faint)] hover:text-[var(--ink-soft)]'
                        }`}
                      >
                        {h.text}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </aside>
        )}
      </div>

      {/* ── Read next ────────────────────────────────────────── */}
      {related.length > 0 && (
        <section className="border-t border-[var(--line)] bg-[var(--card)] px-4 pb-28 pt-16">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8 flex items-baseline justify-between">
              <h2 className="display text-[20px] font-bold text-[var(--ink)]">이어서 읽기</h2>
              <Link
                to="/blog"
                className="text-[13.5px] font-medium text-[var(--ink-faint)] transition-colors hover:text-[var(--accent)]"
              >
                전체 글 →
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <Link key={`${r.package}/${r.id}`} to={`/blog/${r.package}/${r.id}`} className="group block">
                  <Cover post={r} />
                  <p className="mt-4 line-clamp-2 text-[14.5px] leading-[1.6] text-[var(--ink-soft)]">
                    {r.excerpt}
                  </p>
                  <div className="mt-3.5">
                    <Byline post={r} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </motion.div>
  );
}
