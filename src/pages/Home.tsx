import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Sparkles } from 'lucide-react';
import { blogPosts, teamMembers, troubleshootings } from '../data';
import type { MemberId } from '../data';
import Avatar from '../components/Avatar';

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

const VALUES = [
  {
    eyebrow: '01',
    title: '결정에는 이유가 남습니다.',
    body: '"왜 이렇게 만들었지?"는 6개월 뒤의 우리에게 가장 비싼 질문입니다. 우리는 결정을 내리고, 짧게라도 흔적을 남깁니다.',
  },
  {
    eyebrow: '02',
    title: '디테일이 결국 인상을 만듭니다.',
    body: '60ms의 인터랙션 지연, 1px의 어긋남, 한 글자의 어색함. 사용자는 이유를 모른 채 알아차립니다. 그래서 우리는 거기에 시간을 씁니다.',
  },
  {
    eyebrow: '03',
    title: '문제를 줄이는 것이 더 어렵습니다.',
    body: '기능을 더하는 일보다, 무엇을 하지 않을지 결정하는 데 더 오래 머무릅니다. 단순함은 가장 어려운 정직함입니다.',
  },
  {
    eyebrow: '04',
    title: '서로의 영역을 존중하지만, 침범도 합니다.',
    body: '디자이너가 코드를 보고, 개발자가 카피를 다듬고, 기획자가 픽셀을 잰다. 그 마찰이 더 좋은 결과를 만든다고 믿습니다.',
  },
];

export default function Home() {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState<MemberId | null>(null);

  return (
    <div>
      {/* ───────── HERO ───────── */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.25, ease } }}
        transition={{ duration: 0.5, ease }}
        className="relative pt-32 sm:pt-44 pb-28 px-6 overflow-hidden"
      >
        {/* Soft accent halos */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 -right-40 w-[34rem] h-[34rem] rounded-full blur-3xl opacity-[0.18]"
          style={{ background: 'radial-gradient(circle,#4C6EF5 0%, transparent 65%)' }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-40 -left-40 w-[28rem] h-[28rem] rounded-full blur-3xl opacity-[0.14]"
          style={{ background: 'radial-gradient(circle,#F59E0B 0%, transparent 65%)' }}
        />

        <div className="relative max-w-6xl mx-auto">
          <motion.h1
            initial="hidden" animate="visible" custom={1} variants={fade}
            className="text-[clamp(2.8rem,9vw,7rem)] font-bold tracking-[-0.045em] leading-[0.98] text-[#0b0b0d] mb-7"
          >
            시골쥐 <span className="text-[#bbb] font-light italic">×</span> 서울쥐
          </motion.h1>

          <motion.p
            initial="hidden" animate="visible" custom={2} variants={fade}
            className="text-[clamp(1.15rem,2.4vw,1.6rem)] text-[#444] leading-[1.55] tracking-[-0.015em] max-w-3xl mb-10 font-medium"
          >
            다른 곳에서 시작했지만, 같은 곳을 향합니다.<br className="hidden sm:block" />
            이상한 사람들이 만나 <span className="text-[#0b0b0d]">이상</span>을 만들어갑니다.
          </motion.p>

          <motion.div
            initial="hidden" animate="visible" custom={3} variants={fade}
            className="flex flex-wrap gap-3"
          >
            <Link
              to="/team"
              className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#0b0b0d] text-white text-sm font-semibold tracking-tight hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-18px_rgba(0,0,0,0.55)] transition-all"
            >
              팀 둘러보기
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/blog"
              className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-[#dcdcdc] bg-white text-[#0b0b0d] text-sm font-semibold tracking-tight hover:border-[#0b0b0d] transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              블로그 읽기
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* ───────── TEAM (compact, circular) ───────── */}
      <section className="px-6 border-y border-[#eee] bg-white py-20 sm:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-12 gap-6 flex-wrap">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.28em] text-[#999] uppercase mb-3">Members</p>
              <h2 className="text-[clamp(1.8rem,3.6vw,2.4rem)] font-bold tracking-[-0.025em] text-[#111]">
                세 사람, 세 시선.
              </h2>
            </div>
            <Link
              to="/team"
              className="text-[12px] font-semibold text-[#666] hover:text-[#111] transition-colors flex items-center gap-1.5"
            >
              팀원 전체 보기 <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6"
            onMouseLeave={() => setHovered(null)}
          >
            {teamMembers.map((m, idx) => {
              const isHover = hovered === m.id;
              return (
                <motion.button
                  key={m.id}
                  type="button"
                  onMouseEnter={() => setHovered(m.id)}
                  onFocus={() => setHovered(m.id)}
                  onBlur={() => setHovered(null)}
                  onClick={() => navigate(`/team/${m.id}`)}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.6, delay: idx * 0.08, ease }}
                  className="group relative flex flex-col items-center text-center px-6 py-9 rounded-3xl bg-white border border-[#ececec] hover:border-[#0b0b0d]/35 hover:-translate-y-1 hover:shadow-[0_24px_50px_-25px_rgba(0,0,0,0.18)] transition-all"
                  aria-label={`${m.name} — ${m.role}`}
                >
                  {/* Circular avatar with halo */}
                  <motion.div
                    layoutId={`avatar-${m.id}`}
                    transition={{ duration: SHARED_DURATION, ease }}
                    className="relative"
                  >
                    {/* Halo */}
                    <motion.div
                      aria-hidden
                      className="absolute -inset-5 rounded-full blur-2xl"
                      style={{ background: m.accent }}
                      animate={{ opacity: isHover ? 0.28 : 0.14 }}
                      transition={{ duration: 0.5, ease }}
                    />

                    {/* Circle frame with subtle gradient bg behind avatar */}
                    <motion.div
                      animate={{ y: isHover ? -4 : 0, scale: isHover ? 1.04 : 1 }}
                      transition={{ duration: 0.5, ease }}
                      className="relative w-[150px] h-[150px] rounded-full overflow-hidden flex items-center justify-center"
                      style={{
                        background: `radial-gradient(circle at 30% 25%, ${m.accent}40 0%, ${m.accent}15 45%, #fff 90%)`,
                        boxShadow: `inset 0 0 0 1px ${m.accent}25`,
                      }}
                    >
                      <Avatar
                        member={m}
                        hover={isHover}
                        size={150}
                        rounded="full"
                      />
                    </motion.div>

                    {/* Role pill */}
                    <motion.span
                      layoutId={`role-${m.id}`}
                      transition={{ duration: SHARED_DURATION, ease }}
                      className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase bg-white shadow-[0_4px_18px_-6px_rgba(0,0,0,0.18)] border border-black/[0.04] whitespace-nowrap"
                      style={{ color: m.accent }}
                    >
                      {m.role}
                    </motion.span>
                  </motion.div>

                  {/* Name */}
                  <motion.h3
                    layoutId={`name-${m.id}`}
                    transition={{ duration: SHARED_DURATION, ease }}
                    className="mt-9 text-[18px] font-bold tracking-[-0.02em] text-[#0b0b0d]"
                  >
                    {m.name}
                  </motion.h3>

                  {/* Tagline */}
                  <motion.div
                    layoutId={`tagline-wrap-${m.id}`}
                    transition={{ duration: SHARED_DURATION, ease }}
                    className="mt-1.5 flex items-baseline justify-center max-w-[18rem]"
                  >
                    <motion.span
                      layoutId={`tagline-${m.id}`}
                      transition={{ duration: SHARED_DURATION, ease }}
                      className="text-[13px] text-[#777] leading-relaxed whitespace-nowrap"
                    >
                      {m.tagline}
                    </motion.span>
                  </motion.div>

                  {/* Hover CTA */}
                  <motion.span
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: isHover ? 1 : 0, y: isHover ? 0 : 4 }}
                    transition={{ duration: 0.3, ease }}
                    className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-[#0b0b0d]"
                  >
                    프로필 보기 <ArrowUpRight className="w-3 h-3" />
                  </motion.span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ───────── MANIFESTO ───────── */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7, ease }}
        className="py-32 px-6"
      >
        <div className="max-w-5xl mx-auto">
          <p className="text-[11px] font-semibold tracking-[0.28em] text-[#999] uppercase mb-6">
            Manifesto · 우리가 일하는 방식
          </p>
          <h2 className="text-[clamp(1.8rem,4.5vw,3rem)] font-bold tracking-[-0.03em] leading-[1.2] text-[#0b0b0d] max-w-4xl">
            우리는 <span className="text-[#bbb] font-light italic">정답</span>을 갖고 시작하지 않습니다.<br />
            <span className="text-[#0b0b0d]">좋은 질문</span>에서 출발하고,<br />
            답은 <span className="text-[#0b0b0d] underline decoration-[#4C6EF5] decoration-[3px] underline-offset-[6px]">함께</span> 만들어갑니다.
          </h2>
        </div>
      </motion.section>

      {/* ───────── VALUES ───────── */}
      <section className="px-6 py-32 bg-[#0b0b0d] text-white">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <p className="text-[11px] font-semibold tracking-[0.28em] text-[#777] uppercase mb-4">Our Values</p>
            <h2 className="text-[clamp(1.8rem,4.2vw,2.8rem)] font-bold tracking-[-0.03em] leading-[1.18] max-w-3xl">
              네 개의 작은 약속들이<br />
              우리를 우리답게 만듭니다.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-14">
            {VALUES.map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.6, delay: i * 0.08, ease }}
                className="border-t border-white/15 pt-7"
              >
                <p className="text-[11px] font-semibold tracking-[0.28em] text-[#666] uppercase mb-4 tabular-nums">
                  {v.eyebrow}
                </p>
                <h3 className="text-[20px] sm:text-[22px] font-bold tracking-[-0.02em] mb-3 leading-snug">
                  {v.title}
                </h3>
                <p className="text-[14.5px] text-[#bbb] leading-[1.8]">{v.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── BLOG PREVIEW ───────── */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6, ease }}
        className="py-32 px-6"
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-14 gap-6 flex-wrap">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.28em] text-[#999] uppercase mb-3">Engineering Blog</p>
              <h2 className="text-[clamp(1.8rem,3.6vw,2.4rem)] font-bold tracking-[-0.025em] text-[#111] leading-tight">
                우리가 만들면서 배운 것
              </h2>
            </div>
            <Link
              to="/blog"
              className="text-[12px] font-semibold text-[#666] hover:text-[#111] transition-colors flex items-center gap-1.5"
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

      {/* ───────── TROUBLESHOOTING ───────── */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6, ease }}
        className="pb-32 px-6"
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-12 gap-6 flex-wrap">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.28em] text-[#999] uppercase mb-3">Troubleshooting</p>
              <h2 className="text-[clamp(1.8rem,3.6vw,2.4rem)] font-bold tracking-[-0.025em] text-[#111] leading-tight">
                벽에 부딪힌 순간을 적습니다.
              </h2>
            </div>
            <Link
              to="/troubleshooting"
              className="text-[12px] font-semibold text-[#666] hover:text-[#111] transition-colors flex items-center gap-1.5"
            >
              전체 보기 <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {troubleshootings.map((t, i) => (
              <motion.div
                key={t.id}
                initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }}
                custom={i} variants={fade}
              >
                <Link
                  to={`/troubleshooting/${t.id}`}
                  className="group block h-full p-7 rounded-2xl border border-[#eee] bg-white hover:border-[#0b0b0d]/30 hover:-translate-y-0.5 hover:shadow-[0_20px_40px_-20px_rgba(0,0,0,0.15)] transition-all"
                >
                  <p className="text-[10px] font-semibold tracking-[0.22em] text-[#bbb] uppercase mb-4">
                    {t.category}
                  </p>
                  <h3 className="text-[18px] font-bold tracking-[-0.015em] text-[#111] mb-3 leading-snug group-hover:text-[#3b3b3b] transition-colors">
                    {t.title}
                  </h3>
                  <p className="text-[13.5px] text-[#888] leading-[1.7] line-clamp-3">{t.summary}</p>
                  <div className="mt-6 inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#0b0b0d] opacity-60 group-hover:opacity-100 transition-opacity">
                    자세히 보기
                    <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ───────── CTA / OUTRO ───────── */}
      <section className="px-6 pb-32">
        <div className="max-w-6xl mx-auto rounded-[28px] bg-gradient-to-br from-[#0b0b0d] to-[#1f1f24] text-white p-10 sm:p-16 relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-32 -right-32 w-[26rem] h-[26rem] rounded-full blur-3xl opacity-30"
            style={{ background: 'radial-gradient(circle,#4C6EF5 0%, transparent 60%)' }}
          />
          <div className="relative max-w-2xl">
            <p className="text-[11px] font-semibold tracking-[0.28em] text-[#888] uppercase mb-5">Get in touch</p>
            <h2 className="text-[clamp(1.8rem,4.5vw,2.8rem)] font-bold tracking-[-0.03em] leading-[1.2] mb-5">
              우리와 함께,<br />
              이상해 보여도 좋은 것을 만들어볼래요?
            </h2>
            <p className="text-[15px] text-[#bbb] leading-[1.8] mb-8">
              새로운 프로젝트, 채용, 혹은 그저 커피 한잔.
              어떤 종류의 대화든 환영합니다.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/team"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white text-[#0b0b0d] text-sm font-semibold tracking-tight hover:-translate-y-0.5 transition-transform"
              >
                팀에 대해 더 알기 <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
              <a
                href="mailto:hello@cygnus.team"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-white/25 text-white text-sm font-semibold tracking-tight hover:bg-white/10 transition-colors"
              >
                hello@cygnus.team
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
