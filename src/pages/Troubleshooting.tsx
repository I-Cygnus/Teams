import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { troubleshootings } from '../data';

const fade = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: [0.25, 0.1, 0.25, 1] as const },
  }),
};

export default function TroubleshootingPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="py-24 sm:py-32 px-6"
    >
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div initial="hidden" animate="visible" custom={0} variants={fade}>
          <p className="text-xs font-medium tracking-widest text-[#999] uppercase mb-4">Troubleshooting</p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#111] mb-4">문제 해결 기록</h1>
          <p className="text-base text-[#888] leading-relaxed mb-16 max-w-lg">
            벽에 부딪혔을 때, 우리가 어떻게 돌파했는지 기록합니다.
          </p>
        </motion.div>

        {/* List */}
        <div className="space-y-4">
          {troubleshootings.map((t, i) => (
            <motion.div
              key={t.id}
              initial="hidden" animate="visible" custom={i + 1} variants={fade}
            >
              <Link
                to={`/troubleshooting/${t.id}`}
                className="block p-8 rounded-2xl border border-[#eee] hover:border-[#ccc] hover:shadow-sm transition-all group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-[10px] font-medium tracking-widest text-[#bbb] uppercase mb-3">{t.category}</p>
                    <h2 className="text-lg font-bold text-[#111] mb-2 group-hover:text-[#555] transition-colors">{t.title}</h2>
                    <p className="text-sm text-[#999] leading-relaxed">{t.summary}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#ccc] group-hover:text-[#999] transition-colors flex-shrink-0 mt-1" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
