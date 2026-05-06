import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Clock } from 'lucide-react';
import { teamMembers } from '../data';
import type { BlogPost } from '../data';
import { PACKAGES, blogPosts, postsByPackage } from '../blog';

const ease = [0.22, 1, 0.36, 1] as const;

const fade = {
  hidden: { opacity: 0, y: 20 },
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
    return { name: p.authorOverride.name, accent: p.authorOverride.accent, role: p.authorOverride.role };
  }
  const m = teamMembers.find((tm) => tm.id === p.authorId);
  if (m) return { name: m.name, accent: m.accent, role: m.role };
  return { name: 'Team', accent: '#888', role: '' };
}

export default function Blog() {
  const sorted = useMemo(
    () =>
      [...blogPosts].sort(
        (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
      ),
    [],
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="pt-28 sm:pt-36 pb-32 px-6"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div initial="hidden" animate="visible" custom={0} variants={fade} className="max-w-3xl mb-20">
          <p className="text-[11px] font-semibold tracking-[0.28em] text-[#999] uppercase mb-6">
            Engineering Blog
          </p>
          <h1 className="text-[clamp(2.4rem,6vw,4.5rem)] font-bold tracking-[-0.035em] text-[#0b0b0d] leading-[1.05] mb-7">
            우리가 만들면서<br />
            <span className="text-[#999] font-light italic">배운 것</span>을 적습니다.
          </h1>
          <p className="text-[17px] sm:text-lg text-[#666] leading-[1.7] max-w-xl">
            제품을 만드는 과정에서 만난 문제, 시도한 방법, 거기서 얻은 인사이트.
            짧지 않아도 정직한 글을 쓰려고 합니다.
          </p>

          <div className="mt-10 flex items-center gap-5 text-[12px] text-[#aaa] tabular-nums">
            <span>총 <span className="text-[#111] font-semibold">{blogPosts.length}</span>개의 글</span>
            <span className="w-px h-3 bg-[#e5e5e5]" />
            <span>최근 업데이트 {formatDate(sorted[0].publishedAt)}</span>
          </div>
        </motion.div>

        {/* Packages */}
        <motion.div initial="hidden" animate="visible" custom={1} variants={fade} className="mb-20">
          <p className="text-[11px] font-semibold tracking-[0.28em] text-[#999] uppercase mb-6">Packages</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {PACKAGES.map((pkg) => {
              const items = postsByPackage(pkg.id);
              const latest = items[0];
              const accent = pkg.id === 'choi' ? '#0EA5E9' : '#0b0b0d';
              return (
                <Link
                  key={pkg.id}
                  to={`/blog/${pkg.id}`}
                  className="group relative block p-7 sm:p-8 rounded-3xl bg-white border border-[#ececec] hover:border-[#0b0b0d]/30 hover:-translate-y-0.5 hover:shadow-[0_24px_50px_-25px_rgba(0,0,0,0.18)] transition-all overflow-hidden"
                >
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -top-20 -right-20 w-72 h-72 rounded-full blur-3xl opacity-[0.18]"
                    style={{ background: accent }}
                  />
                  <div className="relative">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: accent }} />
                      <span className="text-[11px] font-bold tracking-[0.22em] uppercase" style={{ color: accent }}>
                        /{pkg.id}
                      </span>
                      <span className="ml-auto text-[11px] text-[#aaa] tabular-nums">
                        {items.length} posts
                      </span>
                    </div>
                    <h3 className="text-[22px] font-bold tracking-[-0.02em] text-[#0b0b0d] mb-2 leading-tight">
                      {pkg.label}
                    </h3>
                    <p className="text-[14px] text-[#666] leading-[1.7] mb-6">{pkg.description}</p>

                    {latest && (
                      <div className="pt-5 border-t border-[#eee]">
                        <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-[#aaa] mb-2">
                          Latest
                        </p>
                        <p className="text-[14px] font-semibold text-[#222] line-clamp-2 mb-1.5 tracking-tight">
                          {latest.title}
                        </p>
                        <p className="text-[11.5px] text-[#999] tabular-nums">
                          {formatDate(latest.publishedAt)}
                        </p>
                      </div>
                    )}

                    <div className="mt-6 inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#0b0b0d] opacity-60 group-hover:opacity-100 transition-opacity">
                      패키지 둘러보기 <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </motion.div>

        {/* Recent across all */}
        <div className="flex items-end justify-between mb-10 gap-6 flex-wrap">
          <h2 className="text-[15px] font-semibold tracking-tight text-[#111]">
            Recent
            <span className="ml-2 text-[#bbb] font-normal tabular-nums">{sorted.length}</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-7 gap-y-16">
          {sorted.map((p, i) => {
            const author = authorOf(p);
            return (
              <motion.div
                key={`${p.package}/${p.id}`}
                initial="hidden" animate="visible" custom={i + 2} variants={fade}
              >
                <Link to={`/blog/${p.package}/${p.id}`} className="group block">
                  <div className="relative aspect-[5/3] rounded-2xl overflow-hidden mb-6">
                    <div
                      className="absolute inset-0 transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
                      style={{ background: p.cover }}
                    />
                    <span className="absolute top-4 left-4 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase bg-white/95 text-[#111]">
                      /{p.package}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-1 h-1 rounded-full" style={{ background: author.accent }} />
                    <p className="text-[10.5px] font-semibold tracking-[0.22em] uppercase" style={{ color: author.accent }}>
                      {p.category}
                    </p>
                  </div>

                  <h3 className="text-[19px] font-bold tracking-[-0.015em] text-[#111] leading-[1.35] mb-3 group-hover:text-[#3b3b3b] transition-colors line-clamp-2">
                    {p.title}
                  </h3>
                  <p className="text-[14px] text-[#888] leading-[1.7] line-clamp-2 mb-5">{p.excerpt}</p>

                  <div className="flex items-center gap-2 text-[11.5px] text-[#aaa] tabular-nums">
                    <span className="text-[#555] font-medium tracking-tight">{author.name}</span>
                    <span className="text-[#ddd]">·</span>
                    <span>{formatDate(p.publishedAt)}</span>
                    <span className="text-[#ddd]">·</span>
                    <span className="inline-flex items-center gap-1"><Clock className="w-2.5 h-2.5" />{p.readingMinutes}분</span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-20 flex justify-center">
          <Link
            to="/blog/common"
            className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#666] hover:text-[#111] transition-colors"
          >
            모든 패키지 둘러보기 <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
