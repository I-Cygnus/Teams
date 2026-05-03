import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import IntroAnimation from './components/IntroAnimation';
import Layout from './components/Layout';
import Home from './pages/Home';
import Team from './pages/Team';
import MemberDetail from './pages/MemberDetail';
import TroubleshootingPage from './pages/Troubleshooting';
import TroubleshootingDetail from './pages/TroubleshootingDetail';
import Resume from './pages/Resume';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';

const ease = [0.22, 1, 0.36, 1] as const;

function AnimatedShell() {
  const location = useLocation();

  return (
    <Layout>
      <LayoutGroup>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={location.pathname}
            initial={false}
            exit={{ opacity: 0, transition: { duration: 0.45, delay: 0.35, ease } }}
          >
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/team" element={<Team />} />
              <Route path="/team/hyeonsu/resume" element={<Resume />} />
              <Route path="/team/:id" element={<MemberDetail />} />
              <Route path="/troubleshooting" element={<TroubleshootingPage />} />
              <Route path="/troubleshooting/:id" element={<TroubleshootingDetail />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogDetail />} />
              <Route path="/choi/*" element={<ChoiRedirect />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </LayoutGroup>
    </Layout>
  );
}

function ChoiRedirect() {
  useEffect(() => {
    window.location.replace('/choi/index.html');
  }, []);
  return null;
}

export default function App() {
  const [showIntro, setShowIntro] = useState(true);

  return (
    <BrowserRouter>
      {showIntro && <IntroAnimation onComplete={() => setShowIntro(false)} />}
      <AnimatedShell />
    </BrowserRouter>
  );
}
