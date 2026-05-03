import { motion, useAnimation } from 'framer-motion';
import { useEffect } from 'react';

export default function IntroAnimation({ onComplete }: { onComplete: () => void }) {
  const mouseControls = useAnimation();
  const holeControls = useAnimation();
  const containerControls = useAnimation();

  useEffect(() => {
    async function sequence() {
      await mouseControls.start({
        x: 0,
        y: 0,
        opacity: 1,
        transition: { duration: 1.5, ease: "easeInOut" }
      });

      await mouseControls.start({
        scale: 0,
        opacity: 0,
        transition: { duration: 0.3, ease: "easeIn" }
      });

      await new Promise(resolve => setTimeout(resolve, 200));

      await holeControls.start({
        scale: 50,
        transition: { duration: 1.2, ease: "easeInOut" }
      });

      await containerControls.start({
        opacity: 0,
        transition: { duration: 0.5, ease: "easeOut" }
      });

      onComplete();
    }

    sequence();
  }, [mouseControls, holeControls, containerControls, onComplete]);

  return (
    <motion.div
      animate={containerControls}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#fafafa] overflow-hidden"
    >
      <motion.div
        animate={holeControls}
        initial={{ scale: 1 }}
        className="absolute w-32 h-32 bg-[#111] rounded-full"
      />

      <motion.div
        animate={mouseControls}
        initial={{ x: -300, y: 50, opacity: 0, scale: 1 }}
        className="absolute w-12 h-12 flex items-center justify-center z-10"
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full text-[#333] drop-shadow-md"
        >
          <ellipse cx="50" cy="50" rx="30" ry="20" fill="currentColor" />
          <circle cx="75" cy="50" r="12" fill="currentColor" />
          <circle cx="70" cy="38" r="8" fill="currentColor" />
          <circle cx="70" cy="62" r="8" fill="currentColor" />
          <path
            d="M 20 50 Q -10 40 -10 60"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </motion.div>
    </motion.div>
  );
}
