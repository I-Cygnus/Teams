import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowUpRight, FileText } from 'lucide-react';
import { teamMembers } from '../data';
import Memoji from '../components/Memoji';

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
      <div className="max-w-5xl mx-auto">
        {/* Back — fades after morph */}
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, transition: { duration: 0.2, ease } }}
          transition={{ duration: 0.4, delay: POST_MORPH_DELAY, ease }}
        >
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#999] hover:text-[#111] transition-colors mb-12"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> 팀원 전체 보기
          </Link>
        </motion.div>

        {/* Hero row: avatar left, identity right */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-10 sm:gap-14">
          {/* Avatar — shared, morphs from Home position */}
          <motion.div
            layoutId={`avatar-${member.id}`}
            transition={{ duration: SHARED_DURATION, ease }}
            className="relative flex-shrink-0 mx-auto sm:mx-0"
          >
            <div
              className="absolute -inset-6 rounded-full blur-3xl opacity-30"
              style={{ background: member.accent }}
            />
            <Memoji id={member.id} size={200} />

            <motion.span
              layoutId={`role-${member.id}`}
              transition={{ duration: SHARED_DURATION, ease }}
              className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-medium tracking-[0.2em] uppercase bg-white/90 backdrop-blur shadow-[0_4px_20px_-8px_rgba(0,0,0,0.15)] border border-black/[0.04] whitespace-nowrap"
              style={{ color: member.accent }}
            >
              {member.role}
            </motion.span>
          </motion.div>

          <div className="flex-1 min-w-0 text-center sm:text-left">
            {/* Name — shared */}
            <motion.h1
              layoutId={`name-${member.id}`}
              transition={{ duration: SHARED_DURATION, ease }}
              className="text-3xl sm:text-[2.5rem] font-bold tracking-tight text-[#111] mb-4 leading-[1.1]"
            >
              {member.name}
            </motion.h1>

            {/* Tagline — shared base + slide-in extension */}
            <motion.div
              layoutId={`tagline-wrap-${member.id}`}
              transition={{ duration: SHARED_DURATION, ease }}
              className="flex flex-wrap items-baseline gap-x-1 justify-center sm:justify-start"
            >
              <motion.span
                layoutId={`tagline-${member.id}`}
                transition={{ duration: SHARED_DURATION, ease }}
                className="text-base sm:text-lg text-[#333] leading-relaxed whitespace-nowrap font-medium"
              >
                {member.tagline}
              </motion.span>

              <motion.span
                initial={{ opacity: 0, x: -14, filter: 'blur(4px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, x: -8, transition: { duration: 0.25, ease } }}
                transition={{ duration: 0.7, delay: POST_MORPH_DELAY, ease }}
                className="text-base sm:text-lg text-[#888] leading-relaxed"
              >
                {member.taglineExt}
              </motion.span>
            </motion.div>

            {/* Tag chips */}
            <motion.div
              initial="hidden" animate="visible" exit={{ opacity: 0, transition: { duration: 0.2 } }}
              custom={1} variants={delayedFade}
              className="mt-6 flex flex-wrap gap-1.5 justify-center sm:justify-start"
            >
              {member.tags.map((t) => (
                <span
                  key={t}
                  className="text-[11px] font-medium text-[#666] px-2.5 py-1 rounded-full border border-[#e7e7e7] bg-white"
                >
                  {t}
                </span>
              ))}
            </motion.div>

            {/* CTA — resume (hyeonsu only) */}
            {member.id === 'hyeonsu' && (
              <motion.div
                initial="hidden" animate="visible" exit={{ opacity: 0, transition: { duration: 0.2 } }}
                custom={2} variants={delayedFade}
                className="mt-6 flex justify-center sm:justify-start"
              >
                <Link
                  to="/team/hyeonsu/resume"
                  className="group inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium text-white transition-all hover:shadow-[0_10px_30px_-10px_rgba(76,110,245,0.7)] hover:-translate-y-0.5"
                  style={{ background: member.accent }}
                >
                  <FileText className="w-3.5 h-3.5" />
                  이력서 보기
                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              </motion.div>
            )}
          </div>
        </div>

        {/* Bio + quote + projects — delayed fade */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.2 } }}
          transition={{ duration: 0.5, delay: POST_MORPH_DELAY + 0.15, ease }}
        >
          <motion.p
            initial="hidden" animate="visible" custom={2} variants={delayedFade}
            className="mt-16 text-[15px] text-[#666] leading-[1.85] max-w-3xl"
          >
            {member.bio}
          </motion.p>

          <motion.blockquote
            initial="hidden" animate="visible" custom={3} variants={delayedFade}
            className="mt-8 border-l-2 pl-5 py-1 max-w-3xl"
            style={{ borderColor: member.accent }}
          >
            <p className="text-sm text-[#888] italic leading-relaxed">"{member.quote}"</p>
          </motion.blockquote>

          <motion.div
            initial="hidden" animate="visible" custom={4} variants={delayedFade}
            className="mt-24"
          >
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-[11px] font-medium tracking-[0.28em] text-[#999] uppercase mb-2">Selected Projects</p>
                <h2 className="text-2xl font-bold tracking-tight text-[#111]">참여한 프로젝트</h2>
              </div>
              <span className="text-xs text-[#aaa]">{member.projects.length}건</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {member.projects.map((p, i) => (
                <motion.article
                  key={p.id}
                  initial="hidden" animate="visible" custom={5 + i} variants={delayedFade}
                  className="group relative rounded-2xl border border-[#ececec] bg-white p-6 sm:p-7 hover:shadow-[0_20px_50px_-25px_rgba(0,0,0,0.15)] hover:border-[#dcdcdc] transition-all"
                >
                  <div
                    className="absolute top-0 left-6 right-6 h-px rounded-full opacity-30 group-hover:opacity-80 transition-opacity"
                    style={{ background: `linear-gradient(90deg, transparent, ${member.accent}, transparent)` }}
                  />
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <p className="text-[10px] font-medium tracking-[0.22em] text-[#bbb] uppercase mb-2">
                        {p.period} · {p.role}
                      </p>
                      <h3 className="text-base font-semibold text-[#111] group-hover:text-[#000]">{p.title}</h3>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-[#ccc] group-hover:text-[#111] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                  </div>
                  <p className="text-sm text-[#777] leading-relaxed mb-5">{p.summary}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {p.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-medium text-[#888] px-2 py-0.5 rounded-full bg-[#f6f6f6]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.article>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
