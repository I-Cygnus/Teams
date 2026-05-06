import { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'framer-motion';
import { ArrowLeft, ArrowUpRight, Clock } from 'lucide-react';
import { teamMembers } from '../data';
import type { BlogBlock, BlogPackage, BlogPost } from '../data';
import { blogPosts, findPost } from '../blog';

const ease = [0.22, 1, 0.36, 1] as const;

const fade = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.06, ease },
  }),
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}. ${String(d.getMonth() + 1).padStart(2, '0')}. ${String(
    d.getDate(),
  ).padStart(2, '0')}`;
}

function authorOf(p: BlogPost) {
  if (p.authorOverride) {
    return { name: p.authorOverride.name, accent: p.authorOverride.accent, role: p.authorOverride.role, brief: '' };
  }
  const m = teamMembers.find((tm) => tm.id === p.authorId);
  if (m) return { name: m.name, accent: m.accent, role: m.role, brief: m.brief };
  return { name: 'Team', accent: '#888', role: '', brief: '' };
}

function renderInline(text: string) {
  // Parse **bold** markers, fall back to plain text
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-bold text-[#0b0b0d]">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

function Block({ block, isFirstParagraph, accent }: { block: BlogBlock; isFirstParagraph: boolean; accent: string }) {
  switch (block.type) {
    case 'h2':
      return (
        <h2 className="mt-20 mb-7 text-[24px] sm:text-[28px] font-bold tracking-[-0.025em] text-[#111] leading-[1.3]">
          {block.text}
        </h2>
      );
    case 'h3':
      return (
        <h3 className="mt-12 mb-5 text-[18px] sm:text-[20px] font-bold tracking-[-0.02em] text-[#111] leading-[1.4]">
          {block.text}
        </h3>
      );
    case 'p':
      return (
        <p
          className={`text-[16.5px] sm:text-[17px] text-[#2a2a2a] leading-[1.95] mb-7 ${
            isFirstParagraph ? 'first-paragraph' : ''
          }`}
        >
          {renderInline(block.text ?? '')}
        </p>
      );
    case 'quote':
      return (
        <blockquote className="my-12 relative pl-7 py-2">
          <span className="absolute left-0 top-0 bottom-0 w-[3px] rounded-full" style={{ background: accent }} />
          <p className="text-[18px] sm:text-[22px] text-[#1a1a1a] leading-[1.55] font-bold tracking-[-0.015em]">
            “{block.text}”
          </p>
        </blockquote>
      );
    case 'list':
      return (
        <ul className="my-7 space-y-3">
          {block.items?.map((it, idx) => (
            <li key={idx} className="flex gap-4 text-[16px] text-[#2a2a2a] leading-[1.75]">
              <span className="flex-shrink-0 mt-[14px] w-4 h-px bg-[#bbb]" aria-hidden />
              <span className="flex-1">{renderInline(it)}</span>
            </li>
          ))}
        </ul>
      );
    case 'code':
      return (
        <div className="my-7 rounded-2xl overflow-hidden border border-[#1f2937] bg-[#0b1020] text-[#e5e7eb]">
          {block.language && (
            <div className="px-5 py-2.5 text-[10.5px] font-bold tracking-[0.22em] uppercase text-[#94a3b8] border-b border-white/[0.06] bg-white/[0.02]">
              {block.language}
            </div>
          )}
          <pre className="px-5 py-5 overflow-x-auto text-[13px] leading-[1.7] font-mono">
            <code className="block whitespace-pre">{block.text}</code>
          </pre>
        </div>
      );
    case 'table':
      return (
        <div className="my-9 overflow-x-auto rounded-2xl border border-[#eee]">
          <table className="w-full text-[14px] tabular-nums">
            <thead className="bg-[#fafafa]">
              <tr>
                {block.headers?.map((h, i) => (
                  <th
                    key={i}
                    className="text-left px-5 py-3.5 text-[11px] font-bold tracking-[0.16em] uppercase text-[#666] border-b border-[#eee]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows?.map((row, ri) => (
                <tr key={ri} className="border-b border-[#f1f1f1] last:border-b-0">
                  {row.map((cell, ci) => (
                    <td
                      key={ci}
                      className={`px-5 py-3.5 leading-[1.6] ${
                        ci === 0 ? 'font-semibold text-[#111]' : 'text-[#444]'
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
    case 'hr':
      return (
        <div className="my-12 flex items-center justify-center">
          <span className="inline-flex gap-1.5">
            <span className="w-1 h-1 rounded-full bg-[#ccc]" />
            <span className="w-1 h-1 rounded-full bg-[#ccc]" />
            <span className="w-1 h-1 rounded-full bg-[#ccc]" />
          </span>
        </div>
      );
    default:
      return null;
  }
}

function getRelated(current: BlogPost) {
  return blogPosts
    .filter((p) => !(p.package === current.package && p.id === current.id))
    .sort((a, b) => {
      const samePkgA = a.package === current.package ? 2 : 0;
      const samePkgB = b.package === current.package ? 2 : 0;
      const sameCatA = a.category === current.category ? 1 : 0;
      const sameCatB = b.category === current.category ? 1 : 0;
      return (samePkgB + sameCatB) - (samePkgA + sameCatA);
    })
    .slice(0, 3);
}

export default function BlogDetail() {
  const { pkg, id } = useParams<{ pkg: string; id: string }>();
  const post = pkg && id ? findPost(pkg as BlogPackage, id) : undefined;

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  const [firstPIndex, setFirstPIndex] = useState<number>(-1);

  useEffect(() => {
    if (!post) return;
    const idx = post.body.findIndex((b) => b.type === 'p');
    setFirstPIndex(idx);
  }, [post]);

  if (!post) return <Navigate to="/blog" replace />;

  const author = authorOf(post);
  const related = getRelated(post);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Reading progress bar */}
      <motion.div
        className="fixed top-14 left-0 right-0 h-[2px] origin-left z-30"
        style={{
          scaleX: progress,
          background: author.accent,
        }}
      />

      {/* Drop cap */}
      <style>{`
        .first-paragraph::first-letter {
          font-size: 3.4em;
          line-height: 0.95;
          float: left;
          margin: 0.08em 0.12em 0 -0.04em;
          font-weight: 700;
          color: ${author.accent};
        }
      `}</style>

      {/* Hero */}
      <section className="pt-24 sm:pt-32 px-6">
        <div className="max-w-[760px] mx-auto">
          <motion.div initial="hidden" animate="visible" custom={0} variants={fade}>
            <Link
              to={`/blog/${post.package}`}
              className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[#999] hover:text-[#111] transition-colors mb-12"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> /{post.package} package
            </Link>
          </motion.div>

          <motion.div
            initial="hidden" animate="visible" custom={1} variants={fade}
            className="flex items-center gap-2.5 mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: author.accent }} />
            <p className="text-[11px] font-semibold tracking-[0.22em] uppercase" style={{ color: author.accent }}>
              {post.category}
            </p>
          </motion.div>

          <motion.h1
            initial="hidden" animate="visible" custom={2} variants={fade}
            className="text-[32px] sm:text-[44px] lg:text-[52px] font-bold tracking-[-0.035em] leading-[1.15] text-[#0b0b0d] mb-7"
          >
            {post.title}
          </motion.h1>

          <motion.p
            initial="hidden" animate="visible" custom={3} variants={fade}
            className="text-[17px] sm:text-[19px] text-[#666] leading-[1.7] mb-12"
          >
            {post.excerpt}
          </motion.p>

          <motion.div
            initial="hidden" animate="visible" custom={4} variants={fade}
            className="flex items-center justify-between pb-10 mb-12 border-b border-[#eee] gap-4 flex-wrap"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-11 h-11 rounded-full grid place-items-center text-[14px] font-bold text-white shadow-sm flex-shrink-0"
                style={{ background: author.accent }}
              >
                {author.name.slice(0, 1)}
              </div>
              <div className="min-w-0">
                <p className="text-[14px] font-semibold text-[#111] tracking-tight">{author.name}</p>
                <p className="text-[12px] text-[#999] tracking-tight">{author.role}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-[12px] text-[#999] tabular-nums">
              <span>{formatDate(post.publishedAt)}</span>
              <span className="w-px h-3 bg-[#e5e5e5]" />
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-3 h-3" />
                {post.readingMinutes}분 분량
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Cover */}
      <motion.div
        initial="hidden" animate="visible" custom={5} variants={fade}
        className="px-6 mb-16"
      >
        <div className="max-w-4xl mx-auto aspect-[21/9] rounded-3xl overflow-hidden">
          <div className="w-full h-full" style={{ background: post.cover }} />
        </div>
      </motion.div>

      {/* Body */}
      <article className="px-6 pb-24">
        <motion.div
          initial="hidden" animate="visible" custom={6} variants={fade}
          className="max-w-[720px] mx-auto"
        >
          {post.body.map((b, i) => (
            <Block key={i} block={b} isFirstParagraph={i === firstPIndex} accent={author.accent} />
          ))}

          {/* Tags */}
          <div className="mt-20 pt-8 border-t border-[#eee] flex flex-wrap gap-2">
            {post.tags.map((t) => (
              <span
                key={t}
                className="px-3.5 py-1.5 rounded-full bg-[#f3f3f3] text-[12px] font-medium text-[#555] tracking-tight hover:bg-[#ececec] transition-colors"
              >
                #{t}
              </span>
            ))}
          </div>

          {/* Author footer card */}
          <div className="mt-14 p-7 sm:p-8 rounded-3xl border border-[#eee] bg-white flex flex-col sm:flex-row gap-5 sm:items-center">
            <div
              className="w-14 h-14 rounded-2xl grid place-items-center text-[18px] font-bold text-white shadow-sm flex-shrink-0"
              style={{ background: author.accent }}
            >
              {author.name.slice(0, 1)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-semibold tracking-[0.24em] uppercase text-[#aaa] mb-1.5">Author</p>
              <p className="text-[16px] font-bold text-[#111] tracking-tight">
                {author.name} {author.role && <span className="font-medium text-[#888]">· {author.role}</span>}
              </p>
              {author.brief && (
                <p className="mt-2 text-[13.5px] text-[#666] leading-[1.65]">{author.brief}</p>
              )}
            </div>
            <Link
              to={`/blog/${post.package}`}
              className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#111] hover:underline"
            >
              /{post.package} 패키지 더 보기
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </motion.div>
      </article>

      {/* Related */}
      {related.length > 0 && (
        <section className="px-6 pb-32 border-t border-[#eee] pt-24 bg-[#fafafa]">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-[11px] font-semibold tracking-[0.28em] text-[#999] uppercase mb-2">Read next</p>
                <h2 className="text-[22px] sm:text-[26px] font-bold tracking-[-0.02em] text-[#111]">이어서 읽기</h2>
              </div>
              <Link to="/blog" className="text-[12px] font-medium text-[#999] hover:text-[#111] transition-colors">
                전체 보기 →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((r) => {
                const a = authorOf(r);
                return (
                  <Link
                    key={`${r.package}/${r.id}`}
                    to={`/blog/${r.package}/${r.id}`}
                    className="group block p-5 rounded-2xl bg-white border border-[#eee] hover:border-[#ccc] hover:-translate-y-0.5 hover:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.08)] transition-all"
                  >
                    <div className="aspect-[16/10] rounded-xl mb-5 overflow-hidden">
                      <div
                        className="w-full h-full transition-transform duration-700 group-hover:scale-[1.04]"
                        style={{ background: r.cover }}
                      />
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-1 h-1 rounded-full" style={{ background: a.accent }} />
                      <p className="text-[10px] font-semibold tracking-[0.22em] uppercase" style={{ color: a.accent }}>
                        {r.category}
                      </p>
                    </div>
                    <h3 className="text-[16px] font-bold text-[#111] tracking-[-0.015em] leading-snug mb-3 group-hover:text-[#444] transition-colors line-clamp-2">
                      {r.title}
                    </h3>
                    <div className="flex items-center justify-between text-[11.5px] text-[#999] tabular-nums">
                      <span>{a.name} · {formatDate(r.publishedAt)}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-[#ccc] group-hover:text-[#111] transition-colors" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </motion.div>
  );
}
