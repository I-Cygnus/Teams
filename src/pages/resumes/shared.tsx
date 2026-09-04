// 이력서 5종 공용 프레임 — 버전 탭, 연락처, 학력, 인쇄 버튼
// 각 버전은 iluck 아카이브 151건 분석(guides/00·05·06)에서 도출한 전략을 하나씩 채택한다.
import { useEffect, type ReactNode } from 'react';
import { Phone, Mail, Calendar, Printer, BookOpen, Briefcase } from 'lucide-react';

function GhIcon({ size = 15 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55 0-.27-.01-1.16-.02-2.11-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.27-1.69-1.27-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.25 3.33.96.1-.74.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.18.91-.25 1.89-.38 2.86-.38.97 0 1.95.13 2.86.38 2.18-1.49 3.14-1.18 3.14-1.18.62 1.58.23 2.75.11 3.04.74.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.39-5.26 5.68.41.36.78 1.06.78 2.14 0 1.55-.01 2.79-.01 3.17 0 .31.21.67.8.55C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z" />
    </svg>
  );
}
import '../Resume.css';
import './versions.css';
import { PROFILE, EDUCATION, TRAINING } from './data';

export const VERSIONS = [
  { path: '/team/hyeonsu/resume/v1', key: 'v1', name: 'V1 임팩트', desc: '첫 5줄 전부 숫자 — 스타트업·유니콘' },
  { path: '/team/hyeonsu/resume/v2', key: 'v2', name: 'V2 스페셜리스트', desc: '근본원인분석 하나로 관통 — 플랫폼 기업' },
  { path: '/team/hyeonsu/resume/v3', key: 'v3', name: 'V3 클래식', desc: '표 양식 제출용 — 대기업·SI·금융' },
  { path: '/team/hyeonsu/resume/v4', key: 'v4', name: 'V4 스토리', desc: '문제정의→역할→성과 — 경력기술서' },
  { path: '/team/hyeonsu/resume/v5', key: 'v5', name: 'V5 에비던스', desc: '주장마다 증거 링크 — 검증 중시' },
];

export function VersionNav({ current }: { current: string }) {
  return (
    <nav className="rv-nav no-print">
      <a href="/team/hyeonsu/resume" className="rv-tab">원본</a>
      {VERSIONS.map((v) => (
        <a key={v.key} href={v.path} className={`rv-tab ${current === v.key ? 'on' : ''}`} title={v.desc}>
          {v.name}
        </a>
      ))}
      <button type="button" className="rv-tab rv-print" onClick={() => window.print()}>
        <Printer size={13} /> 인쇄·PDF
      </button>
    </nav>
  );
}

export function ResumeShell({ current, children }: { current: string; children: ReactNode }) {
  useEffect(() => {
    const prev = document.body.style.background;
    document.body.style.background = '#F0F2F5';
    return () => { document.body.style.background = prev; };
  }, []);
  return (
    <div className="resume-page rv-page">
      <VersionNav current={current} />
      <div className="resume-container rv-container">
        <div className="resume-content rv-content">{children}</div>
      </div>
    </div>
  );
}

export function Contacts({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`profile-contact rv-contacts ${compact ? 'rv-compact' : ''}`}>
      <span className="contact-item"><Phone size={15} /><span>{PROFILE.phone}</span></span>
      <span className="contact-item"><Mail size={15} /><span>{PROFILE.email}</span></span>
      <span className="contact-item"><Calendar size={15} /><span>{PROFILE.birth}</span></span>
      <a href={PROFILE.github} target="_blank" rel="noopener noreferrer" className="contact-item"><GhIcon size={15} /><span>GitHub</span></a>
      <a href={PROFILE.notion} target="_blank" rel="noopener noreferrer" className="contact-item"><BookOpen size={15} /><span>Notion</span></a>
      <a href={PROFILE.portfolio} target="_blank" rel="noopener noreferrer" className="contact-item"><Briefcase size={15} /><span>포트폴리오</span></a>
    </div>
  );
}

export function EducationBlock() {
  return (
    <section className="rv-edu">
      <h2 className="rv-h2">학력 · 교육</h2>
      <div className="rv-edu-rows">
        {EDUCATION.map((e) => (
          <div key={e.school}><b>{e.school}</b> · {e.score} <span className="rv-dim">{e.date}</span></div>
        ))}
        <div>{TRAINING}</div>
      </div>
    </section>
  );
}
