// ④ 역량 매트릭스 — 역량 × 수준 × 증거 격자. 채용공고와 1:1 대조하기 위한 포맷.
// 설계: 리크루터가 JD 요건을 훑으며 체크할 수 있게. 모든 역량에 반드시 증거가 붙는다.
import { NewShell } from './shell';
import { PROFILE, LINKS } from '../data';

type Row = { cap: string; lv: 'a' | 'b'; evidence: React.ReactNode; src: string };

const CORE: Row[] = [
  {
    cap: '장애 분석 (RCA)', lv: 'a', src: '엔코아 · 실무',
    evidence: <>JVM OOM에서 초기 분석의 오진을 반박하고 <b>`0=무제한` 회귀 커밋</b>을 git 이력으로 특정 · 커넥션 고갈을 공급/수요 불일치로 구조 진단 · 배포 후 자기 폴백 코드 결함까지 자체 발견</>,
  },
  {
    cap: '데이터베이스', lv: 'a', src: '엔코아 · AsianMart',
    evidence: <>운영 PostgreSQL <b>300GB 부풀림을 메타데이터만으로 판정</b>(relpages 3,662만 : 행 31만) 후 회수 · pgstattuple 기반 감시 화면 개발 · Oracle 이관 호환성 29곳+ 감사 · 1,289테이블 로컬 복제 키트</>,
  },
  {
    cap: '동시성 · 리소스 제어', lv: 'a', src: '엔코아 · AsianMart',
    evidence: <>수요 모델(2N+2) 기반 커넥션 풀 산정식 설계 + 3계층 거버넌스로 <b>총량 72 고정</b> · 입고 확정에 비관적 락(PESSIMISTIC_WRITE)으로 재고 중복 반영 차단</>,
  },
  {
    cap: '성능 최적화', lv: 'a', src: 'IntellyCosm · I-Poten',
    evidence: <>2만 건 반복 조회 패턴 계측 후 Redis 도입 — <b>120ms → 11ms(91%↓)</b>, 적중률 88%, DB 조회 88%↓ · 인증 상태 조회 <b>평균 2ms</b> · 집계 DB 위임으로 N+1 제거</>,
  },
  {
    cap: 'API · 도메인 설계', lv: 'a', src: 'AsianMart · I-Poten',
    evidence: <><b>24개 도메인 122개 REST API</b>를 4계층으로 설계 · 발주 5단계 상태 기계와 엔티티 캡슐화(세터 제거·의도 기반 메서드) · 78개 에러코드 응답 규격 통일 · Strategy 패턴 확장 구조</>,
  },
  {
    cap: '인증 · 인가', lv: 'b', src: 'I-Poten · AsianMart',
    evidence: <>Interceptor+어노테이션+ArgumentResolver 파이프라인으로 <b>컨트롤러 71곳 중복 제거</b> · JWT Access/Refresh(DB 저장으로 무효화 가능) · 업무영역+담당자 4역할 조회범위 제어</>,
  },
];

const BUILD: Row[] = [
  {
    cap: '서비스 구축·운영', lv: 'a', src: 'I-Poten',
    evidence: <>Spring 58개 도메인 + FastAPI + React 모노레포 3-Tier를 설계·배포하고 <b>MAU 600+</b>로 운영 · 웹·iOS·Android 동시 서비스 · 오픈 1개월 회원 500명</>,
  },
  {
    cap: '인프라 · 배포', lv: 'b', src: '엔코아 · I-Poten',
    evidence: <>Docker Compose 멀티 컨테이너 + GitHub Actions 자동 배포 · <b>폐쇄망 온프렘 설치 자동화 5종</b> · Oracle 12c/19c Docker 구축 · 레거시(Java 7·Ant) 기동 환경 복원</>,
  },
  {
    cap: '프론트엔드', lv: 'b', src: 'AsianMart · I-Fence',
    evidence: <>React 19 + TypeScript strict로 관리자 <b>21개 화면</b> · 발주 분석 대시보드 4탭을 차트 라이브러리 없이 <b>SVG 직접 구현</b> · CSS 변수 디자인 토큰으로 156개 모듈 일괄 교체</>,
  },
  {
    cap: 'AI 연동', lv: 'b', src: 'I-Poten · AsianMart',
    evidence: <>GPT-4.1 질문 생성 / GPT-4o 평가 / Whisper STT / ChromaDB RAG 파이프라인 · 4개국어 자동 번역(스키마 고정 프롬프트 + <b>검토 후 저장</b>으로 LLM 오류 완화)</>,
  },
];

const WORK: Row[] = [
  {
    cap: '팀 리딩', lv: 'a', src: 'I-Poten · IntellyCosm',
    evidence: <>PM 부재 환경에서 <b>백로그 500여 건</b> 관리와 매일 스프린트 플래닝 주도(3인 팀장) · 도메인 60개 수직 분할로 병렬 개발 충돌 최소화 · IntellyCosm 2인 팀장</>,
  },
  {
    cap: '문서화', lv: 'a', src: '엔코아',
    evidence: <>3개 저장소 전수 분석 후 아키텍처 문서 <b>93KB·96KB</b> · <b>인수인계 1종으로 업무 인계가 가능한</b> 통합 문서 · 워크숍 자료를 기술편 30장 / 업무편 45장으로 이원화</>,
  },
  {
    cap: '운영 안정성', lv: 'a', src: '엔코아',
    evidence: <>운영 이슈 <b>10건+ 근본 원인 규명</b>(선분이력 갱신, status NULL 오판정, 엑셀 권한 등) · 운영 SQL 9종 <b>전부 멱등 + 롤백 포함</b> 작성</>,
  },
  {
    cap: '자기주도 학습', lv: 'a', src: '개인',
    evidence: <>학원·과외 없이 자기주도 학습으로 편입 성공 · 부트캠프 <b>최우수 팀·최우수 수료생</b> · 필요한 도구는 직접 제작(원격 AI 제어 패널, SNS 콘텐츠 생성기)</>,
  },
];

function Table({ title, rows }: { title: string; rows: Row[] }) {
  return (
    <>
      <h2>{title}</h2>
      <table>
        <thead>
          <tr><th>역량</th><th style={{ width: 74, textAlign: 'center' }}>수준</th><th>증거 — 실제로 무엇을 했는가</th><th style={{ width: 118 }}>출처</th></tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.cap}>
              <td className="c-cap">{r.cap}</td>
              <td className="c-lv"><span className={`lv ${r.lv}`}>{r.lv === 'a' ? '주력' : '보유'}</span></td>
              <td>{r.evidence}</td>
              <td className="c-src">{r.src}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default function Matrix() {
  return (
    <NewShell current="matrix" theme="matrix">
      <div className="n-sheet np-matrix">
        <div className="mx-top">
          <div>
            <div className="mx-name">{PROFILE.nameKr}<span>Backend · FullStack Developer</span></div>
            <p className="mx-lead">
              채용공고 요건과 바로 대조하실 수 있도록 <b>역량 × 증거</b> 격자로 정리했습니다.
              증거 없는 역량은 넣지 않았고, 수준은 주력(단독 수행 가능) / 보유(협업 하 수행 가능)로만 구분했습니다.
            </p>
          </div>
          <div className="mx-contact">
            {PROFILE.phone}<br />{PROFILE.email}<br />
            <a href={PROFILE.github} target="_blank" rel="noopener noreferrer">GitHub</a> ·{' '}
            <a href={LINKS.ipoten} target="_blank" rel="noopener noreferrer">i-poten.com</a> ·{' '}
            <a href={PROFILE.portfolio} target="_blank" rel="noopener noreferrer">포트폴리오</a>
          </div>
        </div>

        <div className="stats">
          <div className="stat"><b>MAU 600+</b><span>운영 중인 서비스 (3인 팀장)</span></div>
          <div className="stat"><b>3건</b><span>운영 장애 근본 원인 규명</span></div>
          <div className="stat"><b>122</b><span>설계·구현한 REST API</span></div>
          <div className="stat"><b>300GB</b><span>디스크 진단 후 회수</span></div>
        </div>

        <Table title="Core — 백엔드 핵심" rows={CORE} />
        <Table title="Build — 만들고 운영하기" rows={BUILD} />
        <Table title="Work — 일하는 방식" rows={WORK} />

        <div className="mx-2col" style={{ marginTop: 28 }}>
          <div>
            <h2>경력 · 프로젝트</h2>
            <ul className="mini">
              <li><b>엔코아</b> (2026.02–) — DataWare 7.0 데이터 거버넌스 플랫폼, DQ·SDX 담당</li>
              <li><b>I-Poten</b> (2025.10–) — AI 모의면접 플랫폼, 3인 팀장, 운영 중 <a className="ev" href={LINKS.ipoten} target="_blank" rel="noopener noreferrer">보기</a></li>
              <li><b>AsianMart</b> — 커머스+구매관리 운영 시스템 (팀 협업 + 개인 확장)</li>
              <li><b>I-Fence</b> — 개발팀 협업 워크스페이스, 단독 개발, 팀 실사용</li>
              <li><b>IntellyCosm</b> — AI 성분 분석, 2인 팀장 · <b>TTP</b> — 실시간 게임, 단독, 220명</li>
            </ul>
            <div className="mx-note">
              <b>범위 표기</b> — AsianMart의 커머스 기반(상품·주문·배송)은 팀 협업 구간이고,
              구매관리 6개 도메인과 관리자 UI 전면 개편은 개인 확장 구간입니다.
            </div>
          </div>
          <div>
            <h2>기술 스택</h2>
            <ul className="mini">
              <li><b>Language</b> — Java 17/21, TypeScript, JavaScript, Python</li>
              <li><b>Backend</b> — Spring Boot 3.x, JPA · QueryDSL, MyBatis, FastAPI</li>
              <li><b>Database</b> — MySQL · MariaDB, PostgreSQL 16, Oracle 12c/19c, Redis</li>
              <li><b>Frontend</b> — React 19, Vite, Tailwind, ExtJS</li>
              <li><b>Infra</b> — Docker, AWS(EC2·RDS·ALB), Nginx, GitHub Actions</li>
            </ul>
            <h2 style={{ marginTop: 22 }}>학력 · 교육</h2>
            <ul className="mini">
              <li>가천대학교 컴퓨터공학과 (편입) — 3.87 / 4.5</li>
              <li>군산대학교 소프트웨어공학과 — 4.03 / 4.5</li>
              <li>플레이데이터 풀스택 백엔드 과정 — <b>최우수 팀 · 최우수 수료생</b></li>
              <li>교내 해커톤·졸업프로젝트 최우수 TOP 5</li>
            </ul>
          </div>
        </div>
      </div>
    </NewShell>
  );
}
