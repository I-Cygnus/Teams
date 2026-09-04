// ③ 아키텍트 — 다크 기술문서. 만든 시스템을 구조도와 설계 결정 로그로 제시.
// 설계: "무엇을 했다"가 아니라 "어떤 구조를 왜 골랐다". 플랫폼·인프라 포지션용.
import { NewShell } from './shell';
import { PROFILE, LINKS } from '../data';

export default function Architect() {
  return (
    <NewShell current="architect" theme="architect">
      <div className="n-sheet np-arch">
        <div className="ar-top">
          <div className="ar-name">{PROFILE.nameKr}<span>backend · systems</span></div>
          <p className="ar-sub">
            제가 만든 시스템의 <b>구조</b>와, 그 구조를 그렇게 고른 <b>이유</b>를 정리했습니다.
            기술 스택 목록 대신 설계 결정과 그 결과를 봐 주십시오.
          </p>
          <div className="ar-links">
            <a href={LINKS.ipoten} target="_blank" rel="noopener noreferrer">i-poten.com</a>
            <a href={PROFILE.github} target="_blank" rel="noopener noreferrer">github.com/IMCODER0000</a>
            <a href={LINKS.org} target="_blank" rel="noopener noreferrer">github.com/I-Cygnus</a>
            <span style={{ color: '#6f7c8f' }}>{PROFILE.email}</span>
          </div>
        </div>

        {/* 1 */}
        <h2>System 01 — AI 면접 플랫폼 (설계·운영)</h2>
        <h3>I-Poten</h3>
        <div className="ar-meta">3인 팀장 · 2025.10 – 운영 중 · MAU 600+ · AWS EC2 t3.medium 단일 인스턴스</div>
        <div className="diagram">{`   [ Browser / iOS / Android ]
              │
        ┌─────▼─────┐   정적 서빙 + 리버스 프록시
        │   Nginx   │   ← 인증 상태 조회를 여기서 차단 (평균 2ms)
        └─────┬─────┘
     ┌────────┴────────┐
┌────▼─────────┐  ┌────▼──────────┐
│ Spring Boot  │  │   FastAPI     │  AI 추론 전담
│ 58 도메인    │─▶│ GPT-4.1 생성  │  ← Spring 스레드 점유 해소
│ 43 Controller│  │ GPT-4o  평가  │
│ 오케스트레이션│  │ Whisper STT   │
└────┬─────────┘  └────┬──────────┘
     │                 │
┌────▼────┐ ┌──────┐ ┌─▼─────────┐
│  MySQL  │ │Redis │ │ ChromaDB  │ RAG
└─────────┘ └──────┘ └───────────┘
        모두 docker-compose / ipoten-net`}</div>
        <table>
          <thead><tr><th style={{ width: '25%' }}>설계 결정</th><th style={{ width: '30%' }}>대안</th><th>선택 이유와 결과</th></tr></thead>
          <tbody>
            <tr>
              <td><b>인증을 파이프라인으로</b></td>
              <td>컨트롤러마다 검사 유지</td>
              <td>횡단 관심사를 Interceptor + 커스텀 어노테이션 + ArgumentResolver로 흡수. Filter가 아니라 Interceptor를 고른 이유는 핸들러 메타데이터(어노테이션) 접근이 필요했기 때문. → <b>컨트롤러 71곳의 중복 로직 제거</b>, 공개·내부호출·사용자요청을 어노테이션으로 명시화</td>
            </tr>
            <tr>
              <td><b>상태 조회를 앞단에서</b></td>
              <td>매 요청 백엔드 조회</td>
              <td>SPA 라우팅마다 발생하는 조회가 백엔드에 도달할 필요가 없다고 판단. HttpOnly 쿠키 + Nginx 정책으로 차단 → <b>평균 응답 2ms</b></td>
            </tr>
            <tr>
              <td><b>AI를 별도 프로세스로</b></td>
              <td>Spring 내부 비동기 처리</td>
              <td>추론이 수 초~수십 초 점유해 일반 API까지 지연. 언어 생태계(Whisper·Chroma)도 Python이 유리 → FastAPI 분리, Spring은 오케스트레이션만</td>
            </tr>
            <tr>
              <td><b>면접 유형 = Strategy</b></td>
              <td>조건 분기</td>
              <td>유형 추가가 잦을 것으로 예상 → Bean 이름 매핑으로 <b>분기문 수정 없이 클래스 추가만으로 확장</b></td>
            </tr>
            <tr>
              <td><b>도메인 수직 분할</b></td>
              <td>계층별 패키지</td>
              <td>3인 병렬 개발에서 계층 분할은 같은 파일 충돌을 유발 → 피처 단위 60개 수직 분할로 충돌 최소화</td>
            </tr>
          </tbody>
        </table>

        {/* 2 */}
        <h2>System 02 — 탐지 엔진 리소스 거버넌스 (재설계)</h2>
        <h3>엔코아 · 민감데이터 탐지 엔진</h3>
        <div className="ar-meta">Java 21 · Spring Boot · Rust CLI · PostgreSQL · 2026</div>
        <p style={{ color: '#8b97a8', margin: '4px 0 10px' }}>
          OOM과 커넥션 고갈의 공통 원인은 <b style={{ color: '#cdd6e3' }}>상한이 없는 것</b>이었습니다. 값 하나를 고치는 대신, 리소스가 늘어나는 모든 경로에 상한을 걸었습니다.
        </p>
        <div className="diagram">{`  요청 M개 (동시 작업)
        │
   ┌────▼─────────────────────────┐
   │ ① 작업당 병렬수 상한 (clamp) │  ← 자식 프로세스의
   └────┬─────────────────────────┘     DB 재조회 우회까지 차단
        │  작업 1개당 수요 = 2N + 2
   ┌────▼─────────────────────────┐
   │ ② 동시 작업 수 상한 (M)      │
   └────┬─────────────────────────┘
        │
   ┌────▼─────────────────────────┐
   │ ③ DB 계정 CONNECTION LIMIT   │  ← 최종 방어선
   └────┬─────────────────────────┘
        │
   최악 시나리오 총량 = 72 (상수)
   before: 무제한 → 커넥션 고갈`}</div>
        <ul>
          <li><b>공급 N vs 수요 2N+2</b> — 풀 크기를 감으로 잡지 않고 스레드 모델에서 역산하는 산정식을 유도. 통제는 풀이 아니라 <b>입력(병렬수)</b>에 걸어 스레드와 풀이 어긋나지 않게 함</li>
          <li><b>결과 버퍼 상한</b> — <code>DATA_SAVE_CNT == 0</code>이 무제한으로 해석되던 구조를 제거하고 설정 오입력을 포함한 모든 경우에 <b>≤ 100건 보장</b>. 분석 JVM에는 <code>-Xmx 2GB</code>와 OOM 힙덤프 자동 확보 적용</li>
          <li><b>자체 재검토</b> — 매니저에서 clamp한 값을 자식 프로세스가 <code>COALESCE</code>로 DB 재조회해 우회하는 결함을 발견, 값이 흐르는 전 구간(Manager→CLI 인자→매퍼→핸들러)을 추적해 검증</li>
          <li><b>이식성 감사</b> — 메타 저장소 Oracle 전환 대비 PostgreSQL 전용 요소 29곳+(<code>::</code> 캐스팅, <code>NOW()</code>, <code>NULLIF(x,'')</code>의 ORA-00932 등) 식별 및 포팅 로드맵 작성</li>
        </ul>

        {/* 3 */}
        <h2>System 03 — 구매관리 도메인 (신규 설계)</h2>
        <h3>AsianMart</h3>
        <div className="ar-meta">Spring Boot 3.5 · JPA/QueryDSL · PostgreSQL · React 19 · 24개 도메인 122개 API</div>
        <div className="diagram">{`발주 상태 기계 (잘못된 전이는 엔티티가 거부)

  발주완료 ──▶ 부분입고 ──▶ 입고완료
     │            │
     │            └──▶ 마감 (잔량 포기 종료)
     └──▶ 취소

입고 = 2단계로 분리
  DRAFT(검수) ──확정──▶ CONFIRMED(재고 반영)
                          │
                          ├─▶ 재고 원장 적재 (사유 기록)
                          └─▶ 가중 이동평균가 갱신 → 매입 단가 추적

동시성: 입고 확정 트랜잭션에 PESSIMISTIC_WRITE
        (더블클릭·동시 확정 시 재고 중복 반영 차단)`}</div>
        <ul>
          <li><b>세터를 없앴습니다</b> — 정적 팩토리와 의도 기반 메서드(<code>cancel</code>·<code>close</code>·<code>addReceivedQuantity</code>)만 노출해 상태 전이 규칙을 도메인 내부에 캡슐화. 잘못된 상태 변경이 서비스 레이어가 아니라 <b>엔티티에서 거부</b>됩니다</li>
          <li><b>스냅샷 저장</b> — 발주 시점의 물품명·단위·단가를 문서에 복사해 마스터 데이터 변경이 과거 문서를 오염시키지 않게 함</li>
          <li><b>조회 경로 분리</b> — 목록에서는 연관 라인을 제외하고 상세만 join fetch. 집계는 JPQL GROUP BY로 DB에 위임 → N+1 제거, 데이터 증가에 따른 지연 방지</li>
          <li><b>에러 규격</b> — 78개 도메인 에러를 ErrorCode enum에 HTTP 상태와 함께 정의하고 전역 핸들러로 일원화</li>
        </ul>

        {/* 4 */}
        <h2>System 04 — 개발 워크플로우 자체를 시스템으로</h2>
        <h3>I-Fence</h3>
        <div className="ar-meta">Spring Boot 3.5.7 모놀리스 + 회의 서비스(8004) + React 19 · MySQL · Redis · 단독 개발 · 팀 실사용</div>
        <div className="diagram">{`워크스페이스를 Git과 1:1로 맞물림

  프로젝트  ─┬─▶ 보드      = Git 레포
             ├─▶ Feature   = 브랜치
             └─▶ 백로그    = 커밋

  커밋 ──▶ AI ──▶ "변경점·기능·버그·다음단계" 백로그 자동 작성
                    │
                    └─▶ 티켓 ↔ 커밋 양방향 매핑 (업무-코드 추적성)

  AI_Vibe = Engineering Memory
    Feature / Task / Run / Discussion / Decision / Artifact
    "왜 이렇게 만들었는가"를 코드 밖에 남긴다`}</div>
        <ul>
          <li>칸반·문서·회의·OKR·마일스톤·근태·ERD 에디터 등 <b>15개 기능군</b>을 백엔드 40개 도메인과 프론트 전 영역에서 단독 구현</li>
          <li>계정 단위 <b>CLI 커넥터</b>(<code>ifence</code> / <code>ifence-vibe</code>)로 Claude Code 세션과 커밋을 자동 수집</li>
        </ul>

        <h2>Operations · Infra</h2>
        <ul>
          <li><b>폐쇄망 온프렘 설치 자동화 5종</b> — 통합 설치·사전점검, 서버 IP 자동 치환, JDK 환경 설정, tar 이미지 일괄 로드, DB 마이그레이션, 완전 초기화</li>
          <li><b>운영 DB 로컬 복제 키트</b> — PostgreSQL 16.14를 버전·libc·콜레이션·확장까지 맞춰 재현(1,289테이블 / 1,401인덱스 / 263함수 실측)</li>
          <li><b>레거시 복원</b> — Java 7 + Ant + Oracle 3층 구조의 빌드 순서와 연결 고리를 규명해 Tomcat 8.5 + Zulu 7 환경에서 기동 검증</li>
          <li><b>운영 SQL 9종</b> — 전부 멱등 + 롤백문 포함. <code>WHERE</code> 없는 UPDATE 사고를 겪은 뒤 세운 원칙입니다</li>
        </ul>

        <div className="ar-foot">
          <dt>experience</dt><dd>엔코아 · DataWare 7.0 데이터 거버넌스 플랫폼 (2026.02 – 재직 중)</dd>
          <dt>stack</dt><dd>Java 17/21 · Spring Boot 3.x · JPA/QueryDSL · MyBatis · MySQL · PostgreSQL 16 · Oracle 12c/19c · Redis · React 19 · TypeScript · Docker · AWS · Nginx · GitHub Actions</dd>
          <dt>education</dt><dd>가천대학교 컴퓨터공학과 편입 (3.87/4.5) · 군산대학교 소프트웨어공학과 (4.03/4.5) · 플레이데이터 풀스택 과정 최우수 팀·최우수 수료생</dd>
          <dt>contact</dt><dd>{PROFILE.phone} · {PROFILE.email}</dd>
        </div>
      </div>
    </NewShell>
  );
}
