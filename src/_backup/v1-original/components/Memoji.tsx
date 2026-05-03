import { motion, AnimatePresence } from 'framer-motion';
import type { MemberId } from '../data';

interface MemojiProps {
  id: MemberId;
  hover?: boolean;
  size?: number;
}

const PALETTE: Record<MemberId, { bgFrom: string; bgTo: string; ring: string; skin: string; hair: string; accent: string }> = {
  'hyeonsu': {
    bgFrom: '#E6EFFF',
    bgTo: '#B7CDFB',
    ring: 'rgba(76, 110, 245, 0.16)',
    skin: '#F3D3B3',
    hair: '#1F1F22',
    accent: '#4C6EF5',
  },
  'member-b': {
    bgFrom: '#FFEEDB',
    bgTo: '#FCC48F',
    ring: 'rgba(245, 158, 11, 0.18)',
    skin: '#F5D2B1',
    hair: '#3A2A1F',
    accent: '#F59E0B',
  },
  'member-c': {
    bgFrom: '#F1E8FF',
    bgTo: '#CBB4F6',
    ring: 'rgba(139, 92, 246, 0.18)',
    skin: '#F4D2BA',
    hair: '#2B1F36',
    accent: '#8B5CF6',
  },
};

export default function Memoji({ id, hover = false, size = 200 }: MemojiProps) {
  const p = PALETTE[id];

  return (
    <div
      style={{ width: size, height: size }}
      className="relative select-none"
      aria-hidden
    >
      {/* Soft background orb with subtle rim */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(120% 120% at 30% 25%, ${p.bgFrom} 0%, ${p.bgTo} 100%)`,
          boxShadow: `inset 0 0 0 1px ${p.ring}, 0 20px 60px -20px ${p.ring}`,
        }}
      />

      {/* Noise / shine overlay */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(60% 50% at 30% 20%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 60%)',
          mixBlendMode: 'screen',
        }}
      />

      <svg
        viewBox="0 0 200 200"
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <clipPath id={`clip-${id}`}>
            <circle cx="100" cy="100" r="100" />
          </clipPath>
        </defs>

        <g clipPath={`url(#clip-${id})`}>
          {id === 'hyeonsu' && <FaceHyeonsu palette={p} hover={hover} />}
          {id === 'member-b' && <FaceMemberB palette={p} hover={hover} />}
          {id === 'member-c' && <FaceMemberC palette={p} hover={hover} />}
        </g>
      </svg>
    </div>
  );
}

type Palette = (typeof PALETTE)[MemberId];

function FaceHyeonsu({ palette, hover }: { palette: Palette; hover: boolean }) {
  return (
    <>
      {/* Neck / shoulders */}
      <path d="M 55 200 C 55 165, 75 150, 100 150 C 125 150, 145 165, 145 200 Z" fill={palette.skin} />
      <path d="M 30 200 C 30 180, 55 160, 100 160 C 145 160, 170 180, 170 200 Z" fill="#2A2F3A" />

      {/* Head */}
      <circle cx="100" cy="100" r="50" fill={palette.skin} />

      {/* Hair — short and neat */}
      <path
        d="M 55 95 C 55 65, 75 50, 100 50 C 128 50, 148 68, 148 96 C 148 96, 135 80, 112 80 C 90 80, 78 86, 72 96 C 66 106, 55 110, 55 95 Z"
        fill={palette.hair}
      />

      {/* Brows */}
      <motion.path
        d="M 75 88 L 89 86"
        stroke={palette.hair}
        strokeWidth="3"
        strokeLinecap="round"
        animate={{ y: hover ? -2 : 0 }}
        transition={{ duration: 0.3 }}
      />
      <motion.path
        d="M 111 86 L 125 88"
        stroke={palette.hair}
        strokeWidth="3"
        strokeLinecap="round"
        animate={{ y: hover ? -2 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Eyes */}
      <AnimatePresence mode="wait">
        {hover ? (
          <motion.g key="h-hover" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <path d="M 78 99 Q 84 94, 90 99" stroke={palette.hair} strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <path d="M 110 99 Q 116 94, 122 99" stroke={palette.hair} strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </motion.g>
        ) : (
          <motion.g key="h-default" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <circle cx="84" cy="99" r="3" fill={palette.hair} />
            <circle cx="116" cy="99" r="3" fill={palette.hair} />
          </motion.g>
        )}
      </AnimatePresence>

      {/* Mouth */}
      <motion.path
        d={hover ? 'M 88 122 Q 100 134, 112 122' : 'M 90 122 Q 100 128, 110 122'}
        stroke={palette.hair}
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        animate={{ d: hover ? 'M 88 122 Q 100 134, 112 122' : 'M 90 122 Q 100 128, 110 122' }}
        transition={{ duration: 0.3 }}
      />

      {/* Cheek blush */}
      <circle cx="78" cy="115" r="6" fill={palette.accent} opacity={hover ? 0.22 : 0.12} />
      <circle cx="122" cy="115" r="6" fill={palette.accent} opacity={hover ? 0.22 : 0.12} />
    </>
  );
}

function FaceMemberB({ palette, hover }: { palette: Palette; hover: boolean }) {
  return (
    <>
      {/* Neck / shoulders */}
      <path d="M 55 200 C 55 165, 75 150, 100 150 C 125 150, 145 165, 145 200 Z" fill={palette.skin} />
      <path d="M 30 200 C 30 180, 55 160, 100 160 C 145 160, 170 180, 170 200 Z" fill="#3B2F24" />

      {/* Head */}
      <circle cx="100" cy="100" r="50" fill={palette.skin} />

      {/* Hair — wavy side-part */}
      <path
        d="M 55 92 C 55 62, 76 48, 103 48 C 132 48, 150 70, 148 96 C 142 86, 130 80, 118 82 C 108 84, 100 92, 90 92 C 78 92, 70 86, 62 92 C 58 95, 55 98, 55 92 Z"
        fill={palette.hair}
      />
      <path
        d="M 62 94 C 66 86, 74 82, 82 86 C 76 92, 70 96, 62 94 Z"
        fill={palette.hair}
        opacity="0.85"
      />

      {/* Brows */}
      <path d="M 76 90 Q 84 86, 92 90" stroke={palette.hair} strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M 108 90 Q 116 86, 124 90" stroke={palette.hair} strokeWidth="3" strokeLinecap="round" fill="none" />

      {/* Eyes — wink on hover */}
      <AnimatePresence mode="wait">
        {hover ? (
          <motion.g key="b-hover" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <circle cx="84" cy="101" r="3" fill={palette.hair} />
            <path d="M 110 101 Q 116 96, 122 101" stroke={palette.hair} strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </motion.g>
        ) : (
          <motion.g key="b-default" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <circle cx="84" cy="101" r="3" fill={palette.hair} />
            <circle cx="116" cy="101" r="3" fill={palette.hair} />
          </motion.g>
        )}
      </AnimatePresence>

      {/* Mouth — subtle smile → open smile */}
      <motion.path
        stroke={palette.hair}
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        animate={{ d: hover ? 'M 86 122 Q 100 136, 114 122' : 'M 88 124 Q 100 130, 112 124' }}
        transition={{ duration: 0.3 }}
      />

      {/* Cheek blush */}
      <circle cx="78" cy="117" r="6" fill={palette.accent} opacity={hover ? 0.25 : 0.14} />
      <circle cx="122" cy="117" r="6" fill={palette.accent} opacity={hover ? 0.25 : 0.14} />
    </>
  );
}

function FaceMemberC({ palette, hover }: { palette: Palette; hover: boolean }) {
  return (
    <>
      {/* Long hair back */}
      <path
        d="M 38 200 C 38 150, 55 110, 70 100 L 130 100 C 145 110, 162 150, 162 200 Z"
        fill={palette.hair}
      />

      {/* Neck / shoulders */}
      <path d="M 65 200 C 65 170, 80 155, 100 155 C 120 155, 135 170, 135 200 Z" fill={palette.skin} />
      <path d="M 38 200 C 38 185, 60 170, 100 170 C 140 170, 162 185, 162 200 Z" fill="#4A3958" />

      {/* Head */}
      <circle cx="100" cy="100" r="50" fill={palette.skin} />

      {/* Hair — bangs */}
      <path
        d="M 52 95 C 52 60, 75 46, 100 46 C 125 46, 148 60, 148 95 C 140 80, 128 72, 115 78 C 112 82, 108 84, 100 84 C 92 84, 85 80, 80 76 C 68 72, 58 82, 52 95 Z"
        fill={palette.hair}
      />
      {/* Side strands */}
      <path d="M 50 100 C 50 120, 54 140, 60 160 L 52 160 C 46 140, 44 120, 48 100 Z" fill={palette.hair} />
      <path d="M 150 100 C 150 120, 146 140, 140 160 L 148 160 C 154 140, 156 120, 152 100 Z" fill={palette.hair} />

      {/* Brows */}
      <path d="M 76 90 Q 84 86, 92 90" stroke={palette.hair} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M 108 90 Q 116 86, 124 90" stroke={palette.hair} strokeWidth="2.5" strokeLinecap="round" fill="none" />

      {/* Eyes + lashes */}
      <AnimatePresence mode="wait">
        {hover ? (
          <motion.g key="c-hover" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <path d="M 78 100 Q 84 94, 90 100" stroke={palette.hair} strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <path d="M 110 100 Q 116 94, 122 100" stroke={palette.hair} strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </motion.g>
        ) : (
          <motion.g key="c-default" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ellipse cx="84" cy="101" rx="2.8" ry="3.4" fill={palette.hair} />
            <ellipse cx="116" cy="101" rx="2.8" ry="3.4" fill={palette.hair} />
            <path d="M 80 97 L 78 94" stroke={palette.hair} strokeWidth="1.6" strokeLinecap="round" />
            <path d="M 120 97 L 122 94" stroke={palette.hair} strokeWidth="1.6" strokeLinecap="round" />
          </motion.g>
        )}
      </AnimatePresence>

      {/* Lips */}
      <motion.path
        stroke={palette.accent}
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        animate={{ d: hover ? 'M 88 123 Q 100 134, 112 123' : 'M 92 125 Q 100 130, 108 125' }}
        transition={{ duration: 0.3 }}
      />

      {/* Cheek blush */}
      <circle cx="78" cy="117" r="6" fill={palette.accent} opacity={hover ? 0.3 : 0.18} />
      <circle cx="122" cy="117" r="6" fill={palette.accent} opacity={hover ? 0.3 : 0.18} />
    </>
  );
}
