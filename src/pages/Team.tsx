import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { teamMembers } from '../data';
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

export default function Team() {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState<MemberId | null>(null);

  return (
    <div className="pt-32 sm:pt-40 pb-32 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header — editorial */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, transition: { duration: 0.25, ease } }}
          transition={{ duration: 0.6, ease }}
          className="mb-20 max-w-4xl"
        >
          <p className="text-[11px] font-semibold tracking-[0.28em] text-[#999] uppercase mb-6">
            Members · 팀 소개
          </p>
          <h1 className="text-[clamp(2.5rem,6vw,4.5rem)] font-bold tracking-[-0.04em] leading-[1.05] text-[#0b0b0d] mb-7">
            세 사람,<br />
            <span className="text-[#999] font-light italic">세 시선,</span> 하나의 팀.
          </h1>
          <p className="text-[17px] sm:text-lg text-[#666] leading-[1.7] max-w-2xl">
            각자의 영역에서 전문성을 키우고, 서로의 영역을 침범하며 시너지를 만듭니다.
            아래에서 각 팀원의 이야기를 읽어보세요.
          </p>
        </motion.div>

        {/* Member rows — alternating editorial layout */}
        <div className="space-y-24 sm:space-y-32">
          {teamMembers.map((m, i) => {
            const isHover = hovered === m.id;
            const reverse = i % 2 === 1;
            return (
              <motion.button
                key={m.id}
                type="button"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-80px' }}
                custom={i}
                variants={fade}
                onMouseEnter={() => setHovered(m.id)}
                onFocus={() => setHovered(m.id)}
                onBlur={() => setHovered(null)}
                onClick={() => navigate(`/team/${m.id}`)}
                aria-label={`${m.name} — ${m.role}`}
                className={`group w-full flex flex-col ${reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-10 lg:gap-16 text-left outline-none`}
              >
                {/* Portrait card */}
                <div className="lg:w-[44%] w-full">
                  <motion.div
                    layoutId={`avatar-${m.id}`}
                    transition={{ duration: SHARED_DURATION, ease }}
                    className="relative aspect-[4/5] rounded-[32px] overflow-hidden flex items-end justify-center"
                    style={{
                      background: `linear-gradient(160deg, ${m.accent}28 0%, #fff 78%)`,
                    }}
                  >
                    <div
                      className="absolute -inset-12 rounded-full blur-3xl opacity-25 transition-opacity duration-700"
                      style={{ background: m.accent, opacity: isHover ? 0.32 : 0.18 }}
                    />
                    <Avatar
                      member={m}
                      hover={isHover}
                      size={m.image ? 360 : 280}
                      rounded={m.image ? '3xl' : 'full'}
                      className="relative"
                    />

                    {/* Role chip */}
                    <motion.span
                      layoutId={`role-${m.id}`}
                      transition={{ duration: SHARED_DURATION, ease }}
                      className="absolute top-6 left-6 px-3.5 py-1.5 rounded-full text-[10px] font-bold tracking-[0.22em] uppercase bg-white/95 backdrop-blur shadow-sm"
                      style={{ color: m.accent }}
                    >
                      {m.role}
                    </motion.span>

                    {/* Index badge */}
                    <span className="absolute top-6 right-6 px-3 py-1 rounded-full bg-[#0b0b0d]/85 text-white text-[10px] font-bold tracking-[0.18em] tabular-nums">
                      0{i + 1}
                    </span>
                  </motion.div>
                </div>

                {/* Identity */}
                <div className="lg:w-[56%] w-full lg:px-6">
                  <motion.h2
                    layoutId={`name-${m.id}`}
                    transition={{ duration: SHARED_DURATION, ease }}
                    className="text-[clamp(2.2rem,5vw,3.4rem)] font-bold tracking-[-0.035em] text-[#0b0b0d] leading-[1.05] mb-5"
                  >
                    {m.name}
                  </motion.h2>

                  <motion.div
                    layoutId={`tagline-wrap-${m.id}`}
                    transition={{ duration: SHARED_DURATION, ease }}
                    className="flex items-baseline mb-7"
                  >
                    <motion.span
                      layoutId={`tagline-${m.id}`}
                      transition={{ duration: SHARED_DURATION, ease }}
                      className="text-[18px] sm:text-[20px] text-[#444] leading-relaxed font-medium"
                    >
                      {m.tagline}
                    </motion.span>
                  </motion.div>

                  <p className="text-[15px] text-[#777] leading-[1.85] mb-7 max-w-xl">
                    {m.brief}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-8">
                    {m.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[11px] font-medium text-[#555] px-2.5 py-1 rounded-full border border-[#e7e7e7] bg-white"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#0b0b0d] group-hover:gap-2.5 transition-all">
                    프로필 자세히 보기
                    <ArrowUpRight className="w-4 h-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
