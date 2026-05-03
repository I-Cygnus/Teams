import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { blogPosts, teamMembers, troubleshootings } from '../data';
import type { MemberId } from '../data';
import Memoji from '../components/Memoji';

const ease = [0.22, 1, 0.36, 1] as const;
const SHARED_DURATION = 0.85;

const fade = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.08, ease },
  }),
};

export default function Home() {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState<MemberId | null>(null);

  return (
    <div>
      {/* Hero — only this fades */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.25, ease } }}
        transition={{ duration: 0.5, ease }}
        className="pt-28 sm:pt-36 pb-10 px-6"
      >
        <div className="max-w-5xl mx-auto text-center">
          <motion.p
            initial="hidden" animate="visible" custom={0} variants={fade}
            className="text-[11px] font-medium tracking-[0.28em] text-[#999] uppercase mb-5"
          >
            Team Cygnus
          </motion.p>
          <motion.h1
            initial="hidden" animate="visible" custom={1} variants={fade}
            className="text-[clamp(2.25rem,5.5vw,4rem)] font-bold tracking-tight leading-[1.08] text-[#0b0b0d] mb-5"
          >
            시골쥐 <span className="text-[#999] font-light">×</span> 서울쥐
          </motion.h1>
          <motion.p
            initial="hidden" animate="visible" custom={2} variants={fade}
            className="text-sm text-[#888] leading-relaxed max-w-md mx-auto"
          >
            이상한 사람들이 만나 이상을 만들어갑니다.
          </motion.p>
        </div>
      </motion.section>

      {/* Team — circular memojis. No container fade: shared layoutIds morph in-place */}
      <section className="pt-6 pb-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div
            className="grid grid-cols-1 sm:grid-cols-3 gap-y-16 sm:gap-y-8 gap-x-6 sm:gap-x-10"
            onMouseLeave={() => setHovered(null)}
          >
            {teamMembers.map((m) => {
              const isHover = hovered === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onMouseEnter={() => setHovered(m.id)}
                  onFocus={() => setHovered(m.id)}
                  onBlur={() => setHovered(null)}
                  onClick={() => navigate(`/team/${m.id}`)}
                  className="group flex flex-col items-center text-center outline-none cursor-pointer"
                  aria-label={`${m.name} — ${m.role}`}
                >
                  {/* Avatar circle — shared */}
                  <motion.div
                    layoutId={`avatar-${m.id}`}
                    transition={{ duration: SHARED_DURATION, ease }}
                    className="relative"
                  >
                    <motion.div
                      animate={{ y: isHover ? -6 : 0, scale: isHover ? 1.035 : 1 }}
                      transition={{ duration: 0.5, ease }}
                      className="relative"
                    >
                      <motion.div
                        className="absolute -inset-4 rounded-full blur-2xl"
                        style={{ background: m.accent }}
                        animate={{ opacity: isHover ? 0.22 : 0.08 }}
                        transition={{ duration: 0.5, ease }}
                      />
                      <Memoji id={m.id} hover={isHover} size={200} />
                    </motion.div>

                    <motion.span
                      layoutId={`role-${m.id}`}
                      transition={{ duration: SHARED_DURATION, ease }}
                      className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-medium tracking-[0.2em] uppercase bg-white/90 backdrop-blur shadow-[0_4px_20px_-8px_rgba(0,0,0,0.15)] border border-black/[0.04] whitespace-nowrap"
                      style={{ color: m.accent }}
                    >
                      {m.role}
                    </motion.span>
                  </motion.div>

                  {/* Name — shared */}
                  <motion.h3
                    layoutId={`name-${m.id}`}
                    transition={{ duration: SHARED_DURATION, ease }}
                    className="mt-10 text-xl font-bold tracking-tight text-[#111]"
                  >
                    {m.name}
                  </motion.h3>

                  {/* Tagline — shared. Wrapped so the extension can flow in on detail */}
                  <motion.div
                    layoutId={`tagline-wrap-${m.id}`}
                    transition={{ duration: SHARED_DURATION, ease }}
                    className="mt-2 flex items-baseline justify-center max-w-[18rem]"
                  >
                    <motion.span
                      layoutId={`tagline-${m.id}`}
                      transition={{ duration: SHARED_DURATION, ease }}
                      className="text-sm text-[#777] leading-relaxed whitespace-nowrap"
                    >
                      {m.tagline}
                    </motion.span>
                  </motion.div>

                  <motion.span
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: isHover ? 1 : 0, y: isHover ? 0 : 4 }}
                    transition={{ duration: 0.3, ease }}
                    className="mt-3 inline-flex items-center gap-1 text-[11px] font-medium text-[#111]"
                  >
                    프로필 보기 <ArrowUpRight className="w-3 h-3" />
                  </motion.span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="h-px bg-[#eee]" />
      </div>

      {/* Blog preview — fades */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, transition: { duration: 0.25, ease } }}
        transition={{ duration: 0.6, ease, delay: 0.15 }}
        className="py-28 px-6"
      >
        <div className="max-w-5xl mx-auto">
          <div className="flex items-end justify-between mb-14 gap-6">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.28em] text-[#999] uppercase mb-3">Engineering Blog</p>
              <h2 className="text-[26px] sm:text-[30px] font-bold tracking-[-0.025em] text-[#111] leading-tight">
                우리가 만들면서 배운 것
              </h2>
            </div>
            <Link
              to="/blog"
              className="text-[12px] font-semibold text-[#666] hover:text-[#111] transition-colors flex items-center gap-1.5 flex-shrink-0"
            >
              전체 보기 <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-7 gap-y-12">
            {[...blogPosts]
              .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
              .slice(0, 3)
              .map((p, i) => {
                const author = teamMembers.find((m) => m.id === p.authorId);
                const d = new Date(p.publishedAt);
                const dateStr = `${d.getFullYear()}. ${String(d.getMonth() + 1).padStart(2, '0')}. ${String(d.getDate()).padStart(2, '0')}`;
                return (
                  <motion.div
                    key={p.id}
                    initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }}
                    custom={i} variants={fade}
                  >
                    <Link to={`/blog/${p.id}`} className="group block">
                      <div className="aspect-[5/3] rounded-2xl overflow-hidden mb-5">
                        <div
                          className="w-full h-full transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
                          style={{ background: p.cover }}
                        />
                      </div>
                      <div className="flex items-center gap-2 mb-2.5">
                        <span className="w-1 h-1 rounded-full" style={{ background: author?.accent }} />
                        <p className="text-[10.5px] font-semibold tracking-[0.22em] uppercase" style={{ color: author?.accent }}>
                          {p.category}
                        </p>
                      </div>
                      <h3 className="text-[17px] font-bold tracking-[-0.015em] text-[#111] leading-[1.4] mb-3 group-hover:text-[#3b3b3b] transition-colors line-clamp-2">
                        {p.title}
                      </h3>
                      <p className="text-[11.5px] text-[#999] tabular-nums">
                        <span className="text-[#555] font-medium">{author?.name}</span>
                        <span className="mx-1.5 text-[#ddd]">·</span>
                        {dateStr}
                      </p>
                    </Link>
                  </motion.div>
                );
              })}
          </div>
        </div>
      </motion.section>

      {/* Divider */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="h-px bg-[#eee]" />
      </div>

      {/* Troubleshooting preview — fades */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, transition: { duration: 0.25, ease } }}
        transition={{ duration: 0.6, ease, delay: 0.2 }}
        className="py-24 px-6"
      >
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <p className="text-[11px] font-medium tracking-[0.28em] text-[#999] uppercase mb-2">Troubleshooting</p>
              <h2 className="text-2xl font-bold tracking-tight text-[#111]">문제 해결 기록</h2>
            </div>
            <Link to="/troubleshooting" className="text-xs font-medium text-[#999] hover:text-[#111] transition-colors flex items-center gap-1">
              전체 보기 <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {troubleshootings.map((t, i) => (
              <motion.div
                key={t.id}
                initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }}
                custom={i} variants={fade}
              >
                <Link
                  to={`/troubleshooting/${t.id}`}
                  className="flex items-center justify-between p-5 rounded-xl border border-[#eee] hover:border-[#ccc] hover:shadow-sm transition-all group"
                >
                  <div className="min-w-0">
                    <p className="text-[10px] font-medium tracking-widest text-[#bbb] uppercase mb-1.5">{t.category}</p>
                    <h3 className="text-sm font-semibold text-[#111] group-hover:text-[#555] transition-colors truncate">{t.title}</h3>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#ccc] group-hover:text-[#999] transition-colors flex-shrink-0 ml-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  );
}
