import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowUpRight, FileText } from 'lucide-react';
import { teamMembers } from '../data';
import Avatar from '../components/Avatar';

const ease = [0.22, 1, 0.36, 1] as const;
const SHARED_DURATION = 0.85;
const POST_MORPH_DELAY = SHARED_DURATION * 0.55;

const delayedFade = {
  hidden: { opacity: 0, y: 14 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: POST_MORPH_DELAY + i * 0.07, ease },
  }),
};

export default function MemberDetail() {
  const { id } = useParams();
  const member = teamMembers.find((m) => m.id === id);

  if (!member) return <Navigate to="/team" replace />;

  return (
    <div className="pt-28 sm:pt-32 pb-32 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Back */}
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, transition: { duration: 0.2, ease } }}
          transition={{ duration: 0.4, delay: POST_MORPH_DELAY, ease }}
        >
          <Link
            to="/team"
            className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[#999] hover:text-[#111] transition-colors mb-12"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> 팀원 전체 보기
          </Link>
        </motion.div>

        {/* Hero — editorial: portrait left, identity right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Portrait — freestanding circular avatar */}
          <div className="lg:col-span-5 flex justify-center lg:justify-start">
            <motion.div
              layoutId={`avatar-${member.id}`}
              transition={{ duration: SHARED_DURATION, ease }}
              className="relative"
            >
              <Avatar
                member={member}
                size={360}
                rounded="full"
                className="relative"
              />
            </motion.div>
          </div>

          {/* Identity */}
          <div className="lg:col-span-7 lg:pt-10">
            <motion.h1
              layoutId={`name-${member.id}`}
              transition={{ duration: SHARED_DURATION, ease }}
              className="text-[clamp(2.4rem,6vw,4rem)] font-bold tracking-[-0.04em] text-[#0b0b0d] leading-[1.05] mb-6"
            >
              {member.name}
            </motion.h1>

            <motion.div
              layoutId={`tagline-wrap-${member.id}`}
              transition={{ duration: SHARED_DURATION, ease }}
              className="flex flex-wrap items-baseline gap-x-1 mb-8"
            >
              <motion.span
                layoutId={`tagline-${member.id}`}
                transition={{ duration: SHARED_DURATION, ease }}
                className="text-[18px] sm:text-[22px] text-[#222] leading-relaxed font-semibold tracking-[-0.015em]"
              >
                {member.tagline}
              </motion.span>

              <motion.span
                initial={{ opacity: 0, x: -14, filter: 'blur(4px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, x: -8, transition: { duration: 0.25, ease } }}
                transition={{ duration: 0.7, delay: POST_MORPH_DELAY, ease }}
                className="text-[18px] sm:text-[22px] text-[#888] leading-relaxed font-light"
              >
                {member.taglineExt}
              </motion.span>
            </motion.div>

            <motion.div
              initial="hidden" animate="visible" exit={{ opacity: 0, transition: { duration: 0.2 } }}
              custom={1} variants={delayedFade}
              className="flex flex-wrap gap-1.5 mb-8"
            >
              {member.tags.map((t) => (
                <span
                  key={t}
                  className="text-[11.5px] font-medium text-[#555] px-3 py-1.5 rounded-full border border-[#e7e7e7] bg-white"
                >
                  {t}
                </span>
              ))}
            </motion.div>

            {member.id === 'hyeonsu' && (
              <motion.div
                initial="hidden" animate="visible" exit={{ opacity: 0, transition: { duration: 0.2 } }}
                custom={2} variants={delayedFade}
                className="flex flex-wrap gap-2.5"
              >
                <Link
                  to="/team/hyeonsu/resume"
                  className="group inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold text-white tracking-tight transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-18px_rgba(76,110,245,0.7)]"
                  style={{ background: member.accent }}
                >
                  <FileText className="w-3.5 h-3.5" />
                  이력서 보기
                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
                <Link
                  to="/choi"
                  className="group inline-flex items-center gap-2 px-5 py-3 rounded-full border border-[#0b0b0d] bg-white text-[#0b0b0d] text-sm font-semibold tracking-tight hover:bg-[#0b0b0d] hover:text-white transition-colors"
                >
                  포트폴리오 사이트
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </motion.div>
            )}
          </div>
        </div>

        {/* Bio + Quote */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.2 } }}
          transition={{ duration: 0.5, delay: POST_MORPH_DELAY + 0.15, ease }}
          className="mt-24 grid grid-cols-1 lg:grid-cols-12 gap-10"
        >
          <motion.div
            initial="hidden" animate="visible" custom={2} variants={delayedFade}
            className="lg:col-span-7"
          >
            <p className="text-[11px] font-semibold tracking-[0.28em] text-[#999] uppercase mb-4">
              About
            </p>
            <p className="text-[16.5px] text-[#333] leading-[1.95]">{member.bio}</p>
          </motion.div>

          <motion.div
            initial="hidden" animate="visible" custom={3} variants={delayedFade}
            className="lg:col-span-5"
          >
            <div
              className="relative p-7 sm:p-8 rounded-3xl border border-[#eee] bg-white"
            >
              <span
                className="absolute -top-3 left-7 text-5xl font-serif leading-none"
                style={{ color: member.accent }}
                aria-hidden
              >
                &ldquo;
              </span>
              <p className="text-[16px] text-[#333] leading-[1.8] font-medium tracking-[-0.01em]">
                {member.quote}
              </p>
              <p className="mt-4 text-[11.5px] tracking-wider text-[#aaa]">— {member.name}</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Projects */}
        <motion.div
          initial="hidden"
          animate="visible"
          exit={{ opacity: 0, transition: { duration: 0.2 } }}
          custom={4}
          variants={delayedFade}
          className="mt-28"
        >
          <div className="flex items-end justify-between mb-10 gap-6 flex-wrap">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.28em] text-[#999] uppercase mb-3">
                Selected Projects
              </p>
              <h2 className="text-[clamp(1.6rem,3.2vw,2.2rem)] font-bold tracking-[-0.025em] text-[#111]">
                참여한 프로젝트
              </h2>
            </div>
            <span className="text-[12px] font-medium text-[#999] tabular-nums">
              {member.projects.length}건
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {member.projects.map((p, i) => (
              <motion.article
                key={p.id}
                initial="hidden"
                animate="visible"
                custom={5 + i}
                variants={delayedFade}
                className="group relative rounded-3xl border border-[#ececec] bg-white p-7 sm:p-8 hover:border-[#0b0b0d]/30 hover:shadow-[0_24px_50px_-25px_rgba(0,0,0,0.18)] hover:-translate-y-0.5 transition-all"
              >
                <div
                  className="absolute top-0 left-7 right-7 h-px rounded-full opacity-30 group-hover:opacity-90 transition-opacity"
                  style={{ background: `linear-gradient(90deg, transparent, ${member.accent}, transparent)` }}
                />
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="min-w-0">
                    <p className="text-[10.5px] font-semibold tracking-[0.22em] text-[#bbb] uppercase mb-2.5">
                      {p.period} · {p.role}
                    </p>
                    <h3 className="text-[18px] font-bold tracking-[-0.015em] text-[#0b0b0d] leading-snug">
                      {p.title}
                    </h3>
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-[#ccc] group-hover:text-[#111] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                </div>
                <p className="text-[14.5px] text-[#666] leading-[1.8] mb-5">{p.summary}</p>
                <div className="flex flex-wrap gap-1.5">
                  {p.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] font-medium text-[#666] px-2.5 py-1 rounded-full bg-[#f5f5f5]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.article>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
