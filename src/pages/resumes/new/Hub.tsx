// 신규 5종 허브
import { NewShell, NEW_SET } from './shell';

const WHEN: Record<string, string> = {
  onepage: '분량 제한이 있거나 채용 포털에 첨부할 때',
  casebook: '기술 면접 전 사전 제출 · 시니어 면접관이 읽을 때',
  architect: '플랫폼 · 인프라 · 데이터 포지션',
  matrix: '요건이 촘촘한 공고와 대조할 때 · 리크루터 1차 스크리닝',
  narrative: '컬처핏을 중시하는 스타트업 · 자유 양식 요구 시',
};

const NUM = ['01', '02', '03', '04', '05'];

export default function Hub() {
  return (
    <NewShell current="hub" theme="hub">
      <div className="n-sheet np-hub">
        <h1>최현수 — 이력서 5종 (신규)</h1>
        <p className="hub-lead">
          같은 경력을 다섯 가지 방식으로 다시 썼습니다. 각 버전은 <b>서로 다른 축</b>을 택했습니다 —
          압축 / 사고 과정 / 시스템 구조 / 대조 / 사람. 형식뿐 아니라 문장과 시각 언어도 전부 다르게 구성했고,
          모든 수치는 실제 작업 기록에서 확인된 값만 사용했습니다.
        </p>

        <div className="hub-grid">
          {NEW_SET.map((v, i) => (
            <a className="hub-card" key={v.key} href={v.path}>
              <div className="num">{NUM[i]} · {v.tag}</div>
              <h3>{v.name}</h3>
              <p>{v.desc}</p>
              <div className="when">언제 쓰나 — {WHEN[v.key]}</div>
            </a>
          ))}
        </div>

        <h2 style={{ fontSize: 13, letterSpacing: 1.4, color: '#10386e', marginTop: 34, fontWeight: 800 }}>
          다섯 버전이 다루는 것
        </h2>
        <table className="hub-tbl">
          <tbody>
            <tr><td>원페이지 — 압축</td><td>모든 것을 A4 한 장에. 읽는 사람의 시간을 아끼는 버전</td></tr>
            <tr><td>케이스북 — 사고 과정</td><td>결과가 아니라 판단 과정. 오판했던 지점과 뒤집은 근거까지</td></tr>
            <tr><td>아키텍트 — 시스템 구조</td><td>구조도와 설계 결정 로그. 왜 그 대안을 버렸는지</td></tr>
            <tr><td>역량 매트릭스 — 대조</td><td>역량 × 증거 격자. 공고 요건에 체크하듯 맞춰볼 수 있게</td></tr>
            <tr><td>내러티브 — 사람</td><td>형용사 없이 장면으로. 어떤 순간에 무슨 판단을 하는지</td></tr>
          </tbody>
        </table>
      </div>
    </NewShell>
  );
}
