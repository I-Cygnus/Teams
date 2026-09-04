// 이력서 버전 허브 — 5가지 전략 버전 선택 페이지
import { ResumeShell, VERSIONS } from './shared';

const BASIS: Record<string, string> = {
  v1: '근거: 빗썸 백엔드 — 요약 5줄 전부 숫자 + Before/After 표 · 원본의 사진·Skills 구조 유지',
  v2: '근거: 향로의 역량축 재편집 + LINE 합격자의 무기 반복 · OOM/커넥션/bloat 3대 RCA 전면',
  v3: '근거: 카카오VX 표 기반 클래식 · 레거시·폐쇄망 경험 전면(SI 희소가치)',
  v4: '근거: CJ그룹 합격 경력기술서의 문제정의→주요역할→주요성과 · 스토리 4편',
  v5: '근거: 당근 JSpiner의 증거 외주화 · 사내 비공개 영역은 명시',
};

export default function ResumeVersions() {
  return (
    <ResumeShell current="hub">
      <div className="rv-name-row">
        <span className="rv-name">최현수 — 이력서 5종</span>
        <span className="rv-role-tag">합격 서류 아카이브 151건 분석 기반</span>
      </div>
      <p className="rv-sub">
        같은 경력을 다섯 가지 전략으로 재조립했습니다. 모든 수치는 실제 작업 기록(hjob)에서 확인된 값만 사용했습니다.
      </p>
      <table className="rv-principles" style={{ marginTop: 18 }}>
        <tbody>
          <tr><td>스타트업 · 유니콘 (토스·당근·무신사)</td><td>V1 임팩트 / V5 에비던스</td></tr>
          <tr><td>플랫폼 · 데이터 기업 (네이버·카카오·라인)</td><td>V2 스페셜리스트</td></tr>
          <tr><td>대기업 · SI · 금융 IT (삼성SDS·LG CNS)</td><td>V3 클래식</td></tr>
          <tr><td>경력기술서 별도 제출 (CJ·롯데 계열)</td><td>V4 스토리</td></tr>
        </tbody>
      </table>
      <div className="rv-hub-grid">
        {VERSIONS.map((v) => (
          <a className="rv-hub-card" key={v.key} href={v.path}>
            <h3>{v.name}</h3>
            <p>{v.desc}</p>
            <div className="basis">{BASIS[v.key]}</div>
          </a>
        ))}
        <a className="rv-hub-card" href="/team/hyeonsu/resume">
          <h3>원본 이력서</h3>
          <p>기존 버전 (수정 없이 유지)</p>
        </a>
      </div>
    </ResumeShell>
  );
}
