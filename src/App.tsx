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
import ResumeV1 from './pages/resumes/ResumeV1';
import ResumeV2 from './pages/resumes/ResumeV2';
import ResumeV3 from './pages/resumes/ResumeV3';
import ResumeV4 from './pages/resumes/ResumeV4';
import ResumeV5 from './pages/resumes/ResumeV5';
import ResumeVersions from './pages/resumes/ResumeVersions';
import NewHub from './pages/resumes/new/Hub';
import OnePage from './pages/resumes/new/OnePage';
import CaseBook from './pages/resumes/new/CaseBook';
import Architect from './pages/resumes/new/Architect';
import Matrix from './pages/resumes/new/Matrix';
import Narrative from './pages/resumes/new/Narrative';
import RefHub from './pages/resumes/ref/RefHub';
import Ohouse from './pages/resumes/ref/Ohouse';
import KakaoVX from './pages/resumes/ref/KakaoVX';
import CJCareer from './pages/resumes/ref/CJCareer';
import Bithumb from './pages/resumes/ref/Bithumb';
import NotionR from './pages/resumes/ref/NotionR';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import ERDEditor from './pages/ERDEditor';
import ApplyHub from './pages/apply/Hub';
import ApplyDoc from './pages/apply/Doc';

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
              <Route path="/apply" element={<ApplyHub />} />
              <Route path="/apply/:id" element={<ApplyDoc />} />
              <Route path="/choi/*" element={<ChoiRedirect />} />
              <Route path="/report/*" element={<ReportRedirect />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </LayoutGroup>
    </Layout>
  );
}

function ReportRedirect() {
  useEffect(() => {
    window.location.replace('/report/index.html');
  }, []);
  return null;
}

function ChoiRedirect() {
  useEffect(() => {
    window.location.replace('/choi/index.html');
  }, []);
  return null;
}

function ShellRouter() {
  const location = useLocation();

  if (location.pathname.startsWith('/team/hyeonsu/resume')) {
    const sub = location.pathname.replace('/team/hyeonsu/resume', '').replace(/\/$/, '');
    if (sub === '/v1') return <ResumeV1 />;
    if (sub === '/v2') return <ResumeV2 />;
    if (sub === '/v3') return <ResumeV3 />;
    if (sub === '/v4') return <ResumeV4 />;
    if (sub === '/v5') return <ResumeV5 />;
    if (sub === '/versions') return <ResumeVersions />;
    if (sub === '/new') return <NewHub />;
    if (sub === '/onepage') return <OnePage />;
    if (sub === '/casebook') return <CaseBook />;
    if (sub === '/architect') return <Architect />;
    if (sub === '/matrix') return <Matrix />;
    if (sub === '/narrative') return <Narrative />;
    if (sub === '/ref') return <RefHub />;
    if (sub === '/ref/ohouse') return <Ohouse />;
    if (sub === '/ref/kakaovx') return <KakaoVX />;
    if (sub === '/ref/cj') return <CJCareer />;
    if (sub === '/ref/bithumb') return <Bithumb />;
    if (sub === '/ref/notion') return <NotionR />;
    return <Resume />;
  }

  return <AnimatedShell />;
}

export default function App() {
  const [showIntro, setShowIntro] = useState(
    () => typeof window === 'undefined' || !new URLSearchParams(window.location.search).has('nointro'),
  );
  const isResume = typeof window !== 'undefined' && window.location.pathname.startsWith('/team/hyeonsu/resume');

  return (
    <BrowserRouter>
      {showIntro && !isResume && <IntroAnimation onComplete={() => setShowIntro(false)} />}
      <ShellRouter />
    </BrowserRouter>
  );
}
