// ① 원페이지 — A4 한 장. 대부분의 회사가 실제로 원하는 분량.
// 설계: 좌(경력·프로젝트) / 우(요약 지표·스킬·학력) 2단. 모든 항목 1~2줄. 형용사 0개.
import { NewShell } from './shell';
import { PROFILE, LINKS } from '../data';

export default function OnePage() {
  return (
    <NewShell current="onepage" theme="onepage">
      <div className="n-sheet np-one">
        <div className="h-top">
          <div>
            <div className="h-name">{PROFILE.nameKr}<span>Backend Developer</span></div>
          </div>
          <div className="h-contact">
            {PROFILE.phone} · {PROFILE.email}<br />
            <a href={PROFILE.github} target="_blank" rel="noopener noreferrer">github.com/IMCODER0000</a> ·{' '}
            <a href={LINKS.ipoten} target="_blank" rel="noopener noreferrer">i-poten.com</a> ·{' '}
            <a href={PROFILE.portfolio} target="_blank" rel="noopener noreferrer">포트폴리오</a>
          </div>
        </div>

        <div className="lead">
          운영 중인 데이터 거버넌스 플랫폼에서 <b>장애 3건의 근본 원인</b>을 규명하고 재발 방지 구조까지 만들었습니다.
          동시에 AI 면접 서비스(<b>MAU 600+</b>)를 3인 팀장으로 설계·운영하며 웹·iOS·Android에 배포했습니다.
        </div>

        <div className="cols">
          {/* ── 좌: 경력 · 프로젝트 ── */}
          <div>
            <h2>Experience</h2>
            <div className="item">
              <div className="it-h">
                <div className="it-t">엔코아 <em>DataWare 7.0 · 데이터 품질(DQ)·민감데이터 검출(SDX)</em></div>
                <div className="it-d">2026.02 – 재직 중</div>
              </div>
              <ul>
                <li><b>JVM OOM 근본 원인 규명</b> — 초기 분석의 오진(스택 최상단 Producer)을 반박하고 <code>설정 누락 시 0=무제한</code> 회귀 커밋을 특정, 결과 버퍼를 모든 경우 <b>100건 이하로 보장</b></li>
                <li><b>커넥션 풀 사이징 재설계</b> — 공급 N vs 수요 2N+2 불일치를 진단해 산정식을 유도하고, 3계층 총량 거버넌스로 최악 시나리오를 <b>72로 고정</b>(기존 무제한)</li>
                <li><b>300GB 디스크 회수</b> — 운영 DB 스캔 없이 <code>pg_class</code> 메타데이터(relpages 3,662만 : 행 31만)로 "유실 아닌 부풀림"을 확정하고 회수, 감시 화면까지 구현</li>
                <li><b>신규 화면 2건 · REST API 2건 단독 개발</b> — [개선활동 상태] 3계층 트리(5분류·12종 필터·권한 4역할 조회범위), [테이블 운영 지표](pgstattuple) — 프론트·백엔드·엔진 3개 저장소</li>
                <li><b>운영 이슈 10건+ 규명</b>(선분이력 갱신, status NULL 오판정, 엑셀 업로드 권한 등) · 운영 SQL 9종 전부 <b>멱등+롤백</b> 작성</li>
                <li>3개 저장소 전수 분석 후 아키텍처 문서 <b>93KB·96KB</b>와 인수인계 통합 문서 작성 · 폐쇄망 온프렘 설치 자동화 5종 · Oracle 12c/19c Docker 구축</li>
              </ul>
            </div>

            <h2>Projects</h2>
            <div className="item">
              <div className="it-h">
                <div className="it-t">I-Poten <em>AI 모의면접 플랫폼 · 3인 팀장</em></div>
                <div className="it-d">2025.10 – 운영 중</div>
              </div>
              <ul>
                <li>Spring Boot <b>58개 도메인·43개 Controller</b> + FastAPI AI 엔진 + React 모노레포(8앱) 3-Tier 설계·운영, AWS EC2 단일 인스턴스에 Docker Compose로 구성</li>
                <li>인증을 Interceptor+어노테이션+ArgumentResolver로 일원화 — <b>컨트롤러 71곳 중복 제거</b>, HttpOnly 쿠키+Nginx로 상태 조회 <b>평균 2ms</b></li>
                <li>AI 추론의 Spring 스레드 점유를 <b>FastAPI 분리</b>로 해소(GPT-4.1 생성 / GPT-4o 평가 / Whisper STT / ChromaDB RAG), 면접 유형은 Strategy 패턴으로 분기문 없이 확장</li>
                <li>도메인 60개 수직 분할로 3인 병렬 개발 충돌 최소화, GitHub Actions 배포 자동화, PM 부재 환경에서 <b>백로그 500여 건</b>·스프린트 주도</li>
              </ul>
            </div>

            <div className="item">
              <div className="it-h">
                <div className="it-t">AsianMart <em>커머스+구매관리 운영 시스템 · 팀 협업 + 개인 확장</em></div>
                <div className="it-d">2026</div>
              </div>
              <ul>
                <li>Spring Boot <b>24개 도메인·122개 REST API</b> 4계층 설계, 관리자 21개 화면(백 15.2K / 프론트 14.9K LOC)</li>
                <li><b>발주·입고·재고 6개 도메인 신규 설계</b>(개인 확장) — 5단계 상태 기계, 재고 원장+가중 이동평균가로 매입 단가 추적, 세터 제거·의도 기반 메서드로 상태 전이 캡슐화</li>
                <li>입고 확정에 <b>비관적 락</b>으로 동시 확정 중복 반영 차단, 집계 DB 위임·조회 분리로 <b>N+1 제거</b>, 78개 에러코드로 응답 규격 통일</li>
              </ul>
            </div>

            <div className="item">
              <div className="it-h">
                <div className="it-t">I-Fence · IntellyCosm · TTP <em>협업툴 / AI 성분분석 / 실시간 게임</em></div>
                <div className="it-d">2024 – 2026</div>
              </div>
              <ul>
                <li><b>I-Fence</b>(단독, 팀 실사용) — 워크스페이스를 Git 레포·브랜치·커밋과 <b>1:1 매핑</b>, 커밋→AI→백로그 자동 생성 파이프라인, 15개 기능군 구현</li>
                <li><b>IntellyCosm</b>(2인 팀장) — 2만 건 성분사전 반복 조회에 Redis 도입, <b>120ms→11ms(91%↓)</b>·적중률 88%·DB 조회 88%↓</li>
                <li><b>TTP</b>(단독) — WebSocket 실시간 멀티플레이 구조 설계·운영, <b>실사용자 220명</b></li>
              </ul>
            </div>
          </div>

          {/* ── 우: 지표 · 스킬 · 학력 ── */}
          <div>
            <h2>Key Metrics</h2>
            <div className="metric"><b>MAU 600+</b><span>I-Poten 운영</span></div>
            <div className="metric"><b>300GB</b><span>디스크 회수</span></div>
            <div className="metric"><b>91%↓</b><span>응답 120→11ms</span></div>
            <div className="metric"><b>71 → 0</b><span>인증 중복 제거</span></div>
            <div className="metric"><b>∞ → 72</b><span>커넥션 총량 고정</span></div>
            <div className="metric"><b>122</b><span>REST API 설계</span></div>

            <h2>Skills</h2>
            <div className="sk"><div className="lv">PROFICIENT</div><div className="vs">Java 17/21 · Spring Boot 3.x · JPA/MyBatis · MySQL · PostgreSQL</div></div>
            <div className="sk"><div className="lv">DEMONSTRATING</div><div className="vs">React 19 · TypeScript · Docker · AWS(EC2·RDS·ALB) · Redis · Nginx · GitHub Actions · QueryDSL</div></div>
            <div className="sk"><div className="lv">FAMILIAR</div><div className="vs">Oracle 12c/19c · FastAPI · Rust(분석) · ExtJS</div></div>

            <h2>Strength</h2>
            <div className="vs" style={{ fontSize: '10.4px', lineHeight: 1.6 }}>
              <b>근본원인분석</b> — 발생 지점과 원인 지점을 구분합니다.<br />
              <b>구조로 남기기</b> — 고친 뒤 같은 일이 반복되지 않는 장치를 만듭니다.<br />
              <b>자기 검증</b> — 방금 고친 코드를 가장 먼저 의심합니다.
            </div>

            <h2>Education</h2>
            <div className="edu-r"><div>가천대 컴퓨터공학 (편입) · 3.87</div><span>~2025.02</span></div>
            <div className="edu-r"><div>군산대 소프트웨어공학 · 4.03</div><span>~2020.02</span></div>
            <div className="edu-r"><div>플레이데이터 풀스택 — <b>최우수 팀·수료생</b></div><span>2025.10</span></div>

            <h2>Links</h2>
            <div className="vs" style={{ fontSize: '10.2px' }}>
              <a href={LINKS.play} target="_blank" rel="noopener noreferrer" style={{ color: '#1a5fb4' }}>Google Play</a> ·{' '}
              <a href={LINKS.appstore} target="_blank" rel="noopener noreferrer" style={{ color: '#1a5fb4' }}>App Store</a> ·{' '}
              <a href={LINKS.org} target="_blank" rel="noopener noreferrer" style={{ color: '#1a5fb4' }}>GitHub Org</a> ·{' '}
              <a href={PROFILE.notion} target="_blank" rel="noopener noreferrer" style={{ color: '#1a5fb4' }}>Notion</a>
            </div>
          </div>
        </div>
      </div>
    </NewShell>
  );
}
