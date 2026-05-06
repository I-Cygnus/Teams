import { useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowUpRight, Clock } from 'lucide-react';
import { teamMembers } from '../data';
import type { BlogCategory, BlogPackage, BlogPost } from '../data';
import { PACKAGES, postsByPackage } from '../blog';

const ease = [0.22, 1, 0.36, 1] as const;

const fade = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.06, ease },
  }),
};

const CATEGORIES: ('All' | BlogCategory)[] = [
  'All',
  'Frontend',
  'Backend',
  'Design',
  'Product',
  'Culture',
];

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}. ${String(d.getMonth() + 1).padStart(2, '0')}. ${String(
    d.getDate(),
  ).padStart(2, '0')}`;
}

function authorOf(p: BlogPost) {
  if (p.authorOverride) {
    return { name: p.authorOverride.name, accent: p.authorOverride.accent, role: p.authorOverride.role };
  }
  const m = teamMembers.find((tm) => tm.id === p.authorId);
  if (m) return { name: m.name, accent: m.accent, role: m.role };
  return { name: 'Team', accent: '#888', role: '' };
}

export default function BlogPackagePage() {
  const { pkg } = useParams<{ pkg: string }>();
  const meta = PACKAGES.find((p) => p.id === pkg);
  const [active, setActive] = useState<'All' | BlogCategory>('All');

  if (!meta) return <Navigate to="/blog" replace />;

  const pkgId = meta.id as BlogPackage;
  const sorted = useMemo(() => postsByPackage(pkgId), [pkgId]);
  const filtered = useMemo(
    () => (active === 'All' ? sorted : sorted.filter((p) => p.category === active)),
    [sorted, active],
  );
  const featured = filtered[0];
  const rest = filtered.slice(1);
  const accent = pkgId === 'choi' ? '#0EA5E9' : '#0b0b0d';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="pt-28 sm:pt-36 pb-32 px-6"
    >
      <div className="max-w-6xl mx-auto">
        {/* Back */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[#999] hover:text-[#111] transition-colors mb-10"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Engineering Blog
        </Link>

        {/* Header */}
        <motion.div initial="hidden" animate="visible" custom={0} variants={fade} className="max-w-3xl mb-16">
          <div className="flex items-center gap-2 mb-5">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: accent }} />
            <span className="text-[11px] font-bold tracking-[0.24em] uppercase" style={{ color: accent }}>
              /{pkgId} package
            </span>
          </div>
          <h1 className="text-[clamp(2.4rem,6vw,4.5rem)] font-bold tracking-[-0.04em] text-[#0b0b0d] leading-[1.05] mb-6">
            {meta.label}
          </h1>
          <p className="text-[17px] sm:text-lg text-[#666] leading-[1.7] max-w-2xl">{meta.description}</p>

          <div className="mt-8 flex items-center gap-5 text-[12px] text-[#aaa] tabular-nums">
            <span>총 <span className="text-[#111] font-semibold">{sorted.length}</span>개의 글</span>
            {sorted[0] && (
              <>
                <span className="w-px h-3 bg-[#e5e5e5]" />
                <span>최근 업데이트 {formatDate(sorted[0].publishedAt)}</span>
              </>
            )}
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial="hidden" animate="visible" custom={1} variants={fade}
          className="flex flex-wrap gap-2 mb-14"
        >
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setActive(c)}
              className={`relative px-4 py-2 text-[12px] font-medium tracking-wide rounded-full transition-colors border ${
                active === c
                  ? 'border-[#111] text-white'
                  : 'border-[#e5e5e5] text-[#666] hover:border-[#bbb] hover:text-[#111]'
              }`}
            >
              {active === c && (
                <motion.span
                  layoutId="pkg-tab"
                  className="absolute inset-0 bg-[#111] rounded-full"
                  transition={{ duration: 0.4, ease }}
                />
              )}
              <span className="relative">{c}</span>
            </button>
          ))}
        </motion.div>

        {filtered.length === 0 ? (
          <p className="text-sm text-[#888] py-20 text-center">아직 이 카테고리에는 글이 없습니다.</p>
        ) : (
          <>
            {featured && (
              <motion.div
                key={`featured-${featured.id}`}
                initial="hidden" animate="visible" custom={2} variants={fade}
                className="mb-24"
              >
                <FeaturedCard post={featured} />
              </motion.div>
            )}

            {rest.length > 0 && (
              <>
                <h2 className="text-[15px] font-semibold tracking-tight text-[#111] mb-10">
                  All articles
                  <span className="ml-2 text-[#bbb] font-normal tabular-nums">{rest.length}</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-7 gap-y-16">
                  {rest.map((p, i) => (
                    <motion.div
                      key={p.id}
                      initial="hidden" animate="visible" custom={i + 3} variants={fade}
                    >
                      <PostCard post={p} />
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}

function FeaturedCard({ post }: { post: BlogPost }) {
  const author = authorOf(post);
  return (
    <Link
      to={`/blog/${post.package}/${post.id}`}
      className="group grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-12 items-center"
    >
      <div className="lg:col-span-7 relative aspect-[16/10] rounded-3xl overflow-hidden">
        <div
          className="absolute inset-0 transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
          style={{ background: post.cover }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/0 via-transparent to-black/20" />
        <div className="absolute top-6 left-6 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-sm">
          <span className="w-1 h-1 rounded-full bg-black" />
          <span className="text-[10px] font-bold tracking-[0.22em] uppercase text-[#111]">Featured</span>
        </div>
      </div>

      <div className="lg:col-span-5 flex flex-col justify-between py-2">
        <div>
          <div className="flex items-center gap-2.5 mb-5">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: author.accent }} />
            <p className="text-[11px] font-semibold tracking-[0.22em] uppercase" style={{ color: author.accent }}>
              {post.category}
            </p>
          </div>

          <h2 className="text-[26px] sm:text-[32px] lg:text-[36px] font-bold tracking-[-0.025em] text-[#111] leading-[1.18] mb-5 group-hover:text-[#3b3b3b] transition-colors">
            {post.title}
          </h2>
          <p className="text-[15px] text-[#777] leading-[1.75] line-clamp-3">{post.excerpt}</p>
        </div>

        <div className="mt-8 pt-7 border-t border-[#eee] flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-full grid place-items-center text-[12px] font-bold text-white shadow-sm"
            style={{ background: author.accent }}
          >
            {author.name.slice(0, 1)}
          </div>
          <div className="text-[12px] tabular-nums text-[#999] flex items-center gap-2">
            <span className="text-[#111] font-semibold tracking-tight">{author.name}</span>
            <span className="text-[#ddd]">·</span>
            <span>{formatDate(post.publishedAt)}</span>
            <span className="text-[#ddd]">·</span>
            <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" />{post.readingMinutes}분</span>
          </div>
          <ArrowUpRight className="w-5 h-5 ml-auto text-[#ccc] group-hover:text-[#111] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
        </div>
      </div>
    </Link>
  );
}

function PostCard({ post }: { post: BlogPost }) {
  const author = authorOf(post);
  return (
    <Link to={`/blog/${post.package}/${post.id}`} className="group block">
      <div className="relative aspect-[5/3] rounded-2xl overflow-hidden mb-6">
        <div
          className="absolute inset-0 transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
          style={{ background: post.cover }}
        />
      </div>

      <div className="flex items-center gap-2 mb-3">
        <span className="w-1 h-1 rounded-full" style={{ background: author.accent }} />
        <p className="text-[10.5px] font-semibold tracking-[0.22em] uppercase" style={{ color: author.accent }}>
          {post.category}
        </p>
      </div>

      <h3 className="text-[19px] font-bold tracking-[-0.015em] text-[#111] leading-[1.35] mb-3 group-hover:text-[#3b3b3b] transition-colors line-clamp-2">
        {post.title}
      </h3>
      <p className="text-[14px] text-[#888] leading-[1.7] line-clamp-2 mb-5">{post.excerpt}</p>

      <div className="flex items-center gap-2 text-[11.5px] text-[#aaa] tabular-nums">
        <span className="text-[#555] font-medium tracking-tight">{author.name}</span>
        <span className="text-[#ddd]">·</span>
        <span>{formatDate(post.publishedAt)}</span>
        <span className="text-[#ddd]">·</span>
        <span className="inline-flex items-center gap-1"><Clock className="w-2.5 h-2.5" />{post.readingMinutes}분</span>
      </div>
    </Link>
  );
}
