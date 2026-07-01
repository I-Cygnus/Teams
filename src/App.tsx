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
import ERDEditor from './pages/ERDEditor';

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
              <Route path="/team/:id" element={<MemberDetail />} />
              <Route path="/troubleshooting" element={<TroubleshootingPage />} />
              <Route path="/troubleshooting/:id" element={<TroubleshootingDetail />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:pkg" element={<Blog />} />
              <Route path="/blog/:pkg/:id" element={<BlogDetail />} />
              <Route path="/data" element={<ERDEditor />} />
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

function ShellRouter() {
  const location = useLocation();

  if (location.pathname === '/team/hyeonsu/resume') {
    return <Resume />;
  }

  return <AnimatedShell />;
}

export default function App() {
  const [showIntro, setShowIntro] = useState(
    () => typeof window === 'undefined' || !new URLSearchParams(window.location.search).has('nointro'),
  );
  const isResume = typeof window !== 'undefined' && window.location.pathname === '/team/hyeonsu/resume';

  return (
    <BrowserRouter>
      {showIntro && !isResume && <IntroAnimation onComplete={() => setShowIntro(false)} />}
      <ShellRouter />
    </BrowserRouter>
  );
}
