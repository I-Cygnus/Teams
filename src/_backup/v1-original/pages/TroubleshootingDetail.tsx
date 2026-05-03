import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { troubleshootings } from '../data';

const fade = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.25, 0.1, 0.25, 1] as const },
  }),
};

export default function TroubleshootingDetail() {
  const { id } = useParams();
  const item = troubleshootings.find((t) => t.id === id);

  if (!item) return <Navigate to="/troubleshooting" replace />;

  const steps = [
    { label: '문제 상황', content: item.problem },
    { label: '해결 과정', content: item.solution },
    { label: '결과', content: item.result },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="py-24 sm:py-32 px-6"
    >
      <div className="max-w-2xl mx-auto">
        {/* Back */}
        <motion.div initial="hidden" animate="visible" custom={0} variants={fade}>
          <Link
            to="/troubleshooting"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#999] hover:text-[#111] transition-colors mb-12"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Troubleshooting
          </Link>
        </motion.div>

        {/* Category */}
        <motion.p
          initial="hidden" animate="visible" custom={1} variants={fade}
          className="text-[10px] font-medium tracking-widest text-[#bbb] uppercase mb-4"
        >
          {item.category}
        </motion.p>

        {/* Title */}
        <motion.h1
          initial="hidden" animate="visible" custom={2} variants={fade}
          className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111] mb-4"
        >
          {item.title}
        </motion.h1>

        {/* Summary */}
        <motion.p
          initial="hidden" animate="visible" custom={3} variants={fade}
          className="text-base text-[#888] leading-relaxed mb-12"
        >
          {item.summary}
        </motion.p>

        {/* Divider */}
        <motion.div initial="hidden" animate="visible" custom={4} variants={fade} className="h-px bg-[#eee] mb-12" />

        {/* Steps */}
        <div className="space-y-10">
          {steps.map((step, i) => (
            <motion.div
              key={step.label}
              initial="hidden" animate="visible" custom={5 + i} variants={fade}
            >
              <div className="flex gap-5">
                {/* Step indicator */}
                <div className="flex flex-col items-center pt-1">
                  <div className="w-6 h-6 rounded-full border border-[#ddd] bg-white flex items-center justify-center">
                    <span className="text-[10px] font-bold text-[#999]">{i + 1}</span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className="w-px flex-1 bg-[#eee] mt-2" />
                  )}
                </div>

                {/* Content */}
                <div className="pb-2">
                  <p className="text-[10px] font-medium tracking-widest text-[#bbb] uppercase mb-2">{step.label}</p>
                  <p className="text-sm text-[#666] leading-[1.8]">{step.content}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
