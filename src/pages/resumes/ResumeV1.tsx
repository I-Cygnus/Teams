// V1 임팩트형 — 첫 화면 5줄 전부 숫자 (근거: 빗썸 백엔드 요약5줄 + Before/After 표)
// 원본 이력서의 프로필 사진 · Skills 3단계 구조는 유지하고, 요약부만 숫자 중심으로 교체.
import { ResumeShell, Contacts, EducationBlock } from './shared';
import { PROFILE, SKILLS, LINKS } from './data';

export default function ResumeV1() {
  return (
    <ResumeShell current="v1">
      {/* 프로필 — 원본 2단 레이아웃(좌 정보 / 우 사진) 유지 */}
      <section className="profile-section rv-profile">
        <div className="profile-info">
          <div className="profile-name-area">
            <h1 className="profile-name-kr">{PROFILE.nameKr}</h1>
            <span className="profile-name-en" style={{ fontSize: '1.25rem' }}>{PROFILE.role}</span>
          </div>
          <div className="profile-title-line" />
          <div className="profile-motto">숫자로 먼저 말하는 개발자</div>
          <div className="rv-nums">
            <div className="rv-num-line"><span className="n">MAU 600+</span><span>AI 면접 플랫폼 <b>I-Poten</b>을 3인 팀장으로 구축·운영 — 오픈 1개월 회원 500명, 웹·iOS·Android 배포</span></div>
            <div className="rv-num-line"><span className="n">300GB 회수</span><span>운영 PostgreSQL 테이블 부풀림을 <b>스캔 없이 메타데이터만으로</b> 진단하고 회수, 재발 감시 화면까지 구현</span></div>
            <div className="rv-num-line"><span className="n">120ms → 11ms</span><span>2만 건 성분사전 반복 조회에 Redis 캐싱 도입 — 응답 <b>91% 단축</b>, 적중률 88%, DB 조회 88% 감소</span></div>
            <div className="rv-num-line"><span className="n">71곳 → 0곳</span><span>인증 파이프라인 일원화로 컨트롤러 중복 로직 제거, 인증 상태 조회 <b>평균 2ms</b></span></div>
            <div className="rv-num-line"><span className="n">무제한 → 72</span><span>탐지 엔진 DB 커넥션 총량을 <b>수요 모델 산정식(2N+2)</b>과 3계층 상한으로 수학적 고정</span></div>
          </div>
          <Contacts />
        </div>
        <div className="profile-image-container">
          <img src="/team/hyeonsu-resume.jpeg" alt="프로필" className="profile-image" />
        </div>
      </section>

      <h2 className="rv-h2">Experience <span className="rv-dim">엔코아 · DataWare 7.0 데이터 거버넌스 플랫폼 · 2026.02 –</span></h2>
      <table className="rv-ba">
        <thead><tr><th>영역</th><th>Before</th><th>After</th></tr></thead>
        <tbody>
          <tr><td>탐지 엔진 결과 버퍼</td><td>설정 누락 시 무제한 적재 → OOM</td><td className="after">모든 경우 ≤ 100건 보장</td></tr>
          <tr><td>분석 JVM 힙</td><td>무제한, 장애 시 덤프 없음</td><td className="after">-Xmx 2GB + OOM 힙덤프 자동 확보</td></tr>
          <tr><td>메타 DB 커넥션 총량</td><td>무제한 (작업 수에 비례 증가)</td><td className="after">≤ 72 (수학적 보장)</td></tr>
          <tr><td>프로파일링 결과 테이블</td><td>300GB (99.9%가 빈 페이지)</td><td className="after">수십 MB + 상시 감시 화면</td></tr>
          <tr><td>개선활동 진행 현황</td><td>처리 대상만 보임, 전체 파악 불가</td><td className="after">5분류 · 3계층 트리 신규 화면</td></tr>
        </tbody>
      </table>
      <div className="rv-proj">
        <ul>
          <li><b>운영 장애 3건 근본 원인 규명</b> — JVM OOM(오진 교정 후 `0=무제한` 회귀 버그 특정), 커넥션 풀 고갈(공급 N vs 수요 2N+2 불일치), 300GB 디스크 부풀림</li>
          <li><b>신규 화면 2건 · REST API 2건 단독 개발</b> — [개선활동 상태] 3계층 트리(진행상태 5분류·12종 필터·권한 4역할 조회범위 제어), [테이블 운영 지표](pgstattuple 기반) — 프론트·백엔드·엔진 3개 저장소에 걸쳐 수행</li>
          <li><b>운영 이슈 10건+ 규명</b> · 운영 SQL 9종 작성(전부 멱등 + 롤백 포함)</li>
          <li><b>코드베이스 전수 분석</b> — 3개 저장소(모듈 20여 개, 화면 1,000+ 파일)를 분석해 93KB·96KB 아키텍처 문서 작성, 인수인계 1종으로 업무 인계 가능한 통합 문서 구축</li>
          <li><b>인프라</b> — 폐쇄망 온프렘 설치 자동화 스크립트 5종, Oracle 12c/19c Docker 구축, 운영 PostgreSQL 로컬 복제 키트(1,289테이블/1,401인덱스 실측 재현)</li>
        </ul>
      </div>

      <h2 className="rv-h2">Projects</h2>
      <div className="rv-proj">
        <div className="rv-proj-head">
          <h3>I-Poten</h3>
          <span className="meta">AI 모의면접 · IT 학습 플랫폼 · 3인 팀장 · 2025.10 – 운영 중</span>
        </div>
        <div className="rv-links">
          <a href={LINKS.ipoten} target="_blank" rel="noopener noreferrer">i-poten.com</a>
          <a href={LINKS.play} target="_blank" rel="noopener noreferrer">Google Play</a>
          <a href={LINKS.appstore} target="_blank" rel="noopener noreferrer">App Store</a>
          <a href={LINKS.org} target="_blank" rel="noopener noreferrer">GitHub</a>
        </div>
        <ul>
          <li>Spring Boot <b>58개 도메인 · 43개 Controller</b> 규모 모놀리스와 FastAPI AI 엔진, React 모노레포(8앱)로 구성된 3-Tier 서비스를 팀장으로 설계·운영</li>
          <li>인증을 Interceptor + 커스텀 어노테이션 + ArgumentResolver 파이프라인으로 일원화 — <b>컨트롤러 71곳의 중복 로직 제거</b>, HttpOnly 쿠키+Nginx 정책으로 상태 조회 <b>평균 2ms</b></li>
          <li>AI 추론이 Spring 스레드를 점유하던 구조를 <b>FastAPI 분리</b>로 해소 (GPT-4.1 질문 생성 / GPT-4o 평가 / Whisper STT / ChromaDB RAG)</li>
          <li>면접 유형·질문 순서를 <b>Strategy 패턴 + Bean 매핑</b>으로 분리 — 분기문 없이 클래스 추가만으로 확장</li>
          <li>도메인 60개 수직 분할로 3인 병렬 개발 충돌 최소화, Docker + GitHub Actions 배포 자동화, <b>백로그 500여 건</b> 관리 및 스프린트 주도(PM 부재)</li>
        </ul>
      </div>

      <div className="rv-proj">
        <div className="rv-proj-head">
          <h3>AsianMart</h3>
          <span className="meta">커머스 + 구매관리 통합 운영 시스템 · 팀 협업 + 개인 확장</span>
        </div>
        <ul>
          <li>Spring Boot <b>24개 도메인 · 122개 REST API</b>를 4계층으로 설계, 관리자 콘솔 <b>21개 화면</b> 구현 (백 15.2K LOC / 프론트 14.9K LOC)</li>
          <li><b>발주·입고·재고 6개 도메인을 신규 설계</b>(개인 확장 구간) — 5단계 상태 기계, 재고 원장 + 가중 이동평균가로 매입 단가 추적</li>
          <li>엔티티에서 세터를 제거하고 의도 기반 메서드만 노출해 <b>상태 전이 규칙을 도메인에 캡슐화</b>, 78개 에러 코드로 응답 규격 통일</li>
          <li>입고 확정에 <b>비관적 락</b> 적용해 동시 확정 시 재고 중복 반영 차단, 금액 연산 전반 BigDecimal</li>
          <li>집계를 JPQL GROUP BY로 DB에 위임하고 목록/상세 조회를 분리해 <b>N+1 제거</b>, 발주 분석 대시보드 4탭을 차트 라이브러리 없이 SVG로 직접 구현</li>
        </ul>
      </div>

      <div className="rv-proj">
        <div className="rv-proj-head">
          <h3>I-Fence · IntellyCosm · TTP</h3>
          <span className="meta">협업툴 / AI 성분분석 / 실시간 게임</span>
        </div>
        <ul>
          <li><b>I-Fence</b> — 워크스페이스를 Git(레포·브랜치·커밋)과 1:1 매핑하고 커밋→AI→백로그 자동 생성 파이프라인 구축, 15개 기능군을 단독 개발 (팀 실사용)</li>
          <li><b>IntellyCosm</b> — 반복 조회 패턴 분석 후 Redis 캐싱 도입, <b>120ms→11ms(91%↓)</b>·적중률 88% (2인 팀장)</li>
          <li><b>TTP</b> — WebSocket 실시간 멀티플레이 구조 단독 설계·운영, <b>실사용자 220명</b></li>
        </ul>
      </div>

      <h2 className="rv-h2">Skills</h2>
      <div className="skills-list">
        {SKILLS.map((cat) => (
          <div className="skill-row" key={cat.level}>
            <div className="skill-level"><span className="skill-title">{cat.level}</span></div>
            <div className="tag-list">
              {cat.items.map((s) => <span className="tag" key={s}>{s}</span>)}
            </div>
          </div>
        ))}
      </div>

      <EducationBlock />
    </ResumeShell>
  );
}
