import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { teamMembers } from '../data';
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

export default function Team() {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState<MemberId | null>(null);

  return (
    <div className="pt-28 sm:pt-32 pb-32 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, transition: { duration: 0.25, ease } }}
          transition={{ duration: 0.5, ease }}
          className="text-center mb-20"
        >
          <p className="text-[11px] font-medium tracking-[0.28em] text-[#999] uppercase mb-4">Members</p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#111] mb-4">팀원 소개</h1>
          <p className="text-base text-[#888] leading-relaxed max-w-lg mx-auto">
            각자의 영역에서 전문성을 키우며, 하나의 팀으로 시너지를 만들어냅니다.
          </p>
        </motion.div>

        <div
          className="grid grid-cols-1 sm:grid-cols-3 gap-y-16 sm:gap-y-8 gap-x-6 sm:gap-x-10"
          onMouseLeave={() => setHovered(null)}
        >
          {teamMembers.map((m, i) => {
            const isHover = hovered === m.id;
            return (
              <motion.button
                key={m.id}
                type="button"
                initial="hidden" animate="visible" custom={i} variants={fade}
                onMouseEnter={() => setHovered(m.id)}
                onFocus={() => setHovered(m.id)}
                onBlur={() => setHovered(null)}
                onClick={() => navigate(`/team/${m.id}`)}
                className="group flex flex-col items-center text-center outline-none cursor-pointer"
              >
                <motion.div layoutId={`avatar-${m.id}`} transition={{ duration: SHARED_DURATION, ease }} className="relative">
                  <motion.div
                    animate={{ y: isHover ? -6 : 0, scale: isHover ? 1.035 : 1 }}
                    transition={{ duration: 0.5, ease }}
                  >
                    <div
                      className="absolute -inset-4 rounded-full blur-2xl"
                      style={{ background: m.accent, opacity: isHover ? 0.22 : 0.08 }}
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

                <motion.h3
                  layoutId={`name-${m.id}`}
                  transition={{ duration: SHARED_DURATION, ease }}
                  className="mt-10 text-xl font-bold tracking-tight text-[#111]"
                >
                  {m.name}
                </motion.h3>

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
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
