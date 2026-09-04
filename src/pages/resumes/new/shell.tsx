// 신규 이력서 5종 공용 셸 — 각 버전이 서로 다른 테마를 가진다.
import { useEffect, type ReactNode } from 'react';
import { Printer } from 'lucide-react';
import './new.css';

export const NEW_SET = [
  { path: '/team/hyeonsu/resume/onepage', key: 'onepage', name: '원페이지', tag: 'A4 1장', desc: 'A4 한 장으로 끝내는 실전 제출용 — 밀도 최대' },
  { path: '/team/hyeonsu/resume/casebook', key: 'casebook', name: '케이스북', tag: '심층', desc: '문제해결 3건을 상황–복잡성–질문–해결로 해부' },
  { path: '/team/hyeonsu/resume/architect', key: 'architect', name: '아키텍트', tag: '구조도', desc: '만든 시스템을 구조와 설계 결정으로 제시' },
  { path: '/team/hyeonsu/resume/matrix', key: 'matrix', name: '역량 매트릭스', tag: '대조표', desc: '역량 × 증거 격자 — 공고와 1:1 대조' },
  { path: '/team/hyeonsu/resume/narrative', key: 'narrative', name: '내러티브', tag: '에세이', desc: '1인칭 서사 — 어떤 사람인지 보여준다' },
];

const THEME_BG: Record<string, string> = {
  onepage: '#e8eaed',
  casebook: '#f4f2ee',
  architect: '#0d1117',
  matrix: '#eef0f4',
  narrative: '#faf8f5',
  hub: '#eef0f4',
};

export function NewShell({ current, theme, children }: { current: string; theme: string; children: ReactNode }) {
  useEffect(() => {
    const prev = document.body.style.background;
    document.body.style.background = THEME_BG[theme] || '#eef0f4';
    return () => { document.body.style.background = prev; };
  }, [theme]);

  return (
    <div className={`n-root n-theme-${theme}`}>
      <nav className="n-nav no-print">
        <a href="/team/hyeonsu/resume/new" className={`n-tab ${current === 'hub' ? 'on' : ''}`}>전체</a>
        {NEW_SET.map((v) => (
          <a key={v.key} href={v.path} className={`n-tab ${current === v.key ? 'on' : ''}`} title={v.desc}>
            {v.name}
          </a>
        ))}
        <a href="/team/hyeonsu/resume" className="n-tab n-tab-sub">원본</a>
        <a href="/team/hyeonsu/resume/versions" className="n-tab n-tab-sub">이전 5종</a>
        <button type="button" className="n-tab n-print" onClick={() => window.print()}>
          <Printer size={13} /> 인쇄·PDF
        </button>
      </nav>
      <div className="n-body">{children}</div>
    </div>
  );
}
