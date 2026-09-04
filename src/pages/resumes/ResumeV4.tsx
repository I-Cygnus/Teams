// V4 스토리텔링형 — 경력기술서 (근거: CJ그룹 합격 경력기술서의 문제정의→주요역할→주요성과 3단 반복)
// 대표 스토리 4편을 깊게. 각 스토리가 서로 다른 역량을 증명한다.
import { ResumeShell, Contacts, EducationBlock } from './shared';
import { PROFILE, LINKS } from './data';

export default function ResumeV4() {
  return (
    <ResumeShell current="v4">
      <div className="rv-name-row">
        <span className="rv-name">{PROFILE.nameKr}</span>
        <span className="rv-role-tag">경력기술서 · Backend Developer</span>
      </div>
      <h1 className="rv-headline">네 개의 이야기로 증명합니다.</h1>
      <p className="rv-sub">
        기술 목록 대신, 문제를 정의하고 해결한 과정을 배경부터 결과까지 기술합니다.
        각 이야기는 서로 다른 역량 — <b>장애 분석</b> · <b>구조 설계</b> · <b>서비스 구축</b> · <b>판단과 철회</b> — 를 증명합니다.
      </p>
      <Contacts />

      <div className="rv-story">
        <h3><span className="tag">STORY 1</span>"0이 무제한이 되던 날" — 오진을 뒤집은 장애 분석</h3>
        <div className="rv-story-meta">엔코아 · 민감데이터 탐지 엔진 (Java 21 · Spring Boot · Rust · PostgreSQL)</div>
        <dl className="rv-3step">
          <dt>문제정의</dt>
          <dd>920만 행 컬럼 분석 중 JVM OOM이 발생했습니다. 손에 쥔 것은 모니터 사진 두 장을 판독한 초기 분석서뿐이었고, 그것은 스택 최상단의 Producer 문자열 연결을 범인으로 지목하고 있었습니다. 그러나 RMI idle 스레드와 HttpClient 셀렉터까지 동시에 OOM이 났다는 것은 힙 전체가 이미 고갈됐다는 뜻이었고, Producer는 마지막으로 할당을 요청했다 거절당한 피해자였습니다.</dd>
          <dt>주요역할</dt>
          <dd>질문을 "누가 힙을 점유했나"로 바꿔 Consumer를 열자 <code>DATA_SAVE_CNT == 0</code>이면 무제한 적재되는 조건이 있었습니다. git 이력을 따라가 과거 "결과 미적재 버그"를 고치면서 한도를 풀어버린 회귀 커밋을 특정했습니다. 이어진 커넥션 타임아웃은 증설이 아니라 공급 N과 수요 2N+2의 불일치라는 구조 결함으로 진단했습니다.</dd>
          <dt>주요성과</dt>
          <dd>결과 버퍼를 설정 오입력을 포함한 모든 경우에 100건 이하로 보장하고, 분석 JVM에 힙 상한과 OOM 힙덤프 자동 확보를 적용했습니다. 배포 검증 중 제가 작성한 폴백 코드의 결함(<code>Math.max(0,1)=1</code>)까지 "정확히 1건"이라는 증상에서 역추적해 자체 수정했으며, MySQL <code>useCursorFetch</code> 부재로 인한 동일 OOM 제2 경로를 포함해 잠재 리스크 9건을 사전 차단했습니다.</dd>
        </dl>
      </div>

      <div className="rv-story">
        <h3><span className="tag">STORY 2</span>"300GB인데 유실은 없다" — 스캔 없이 내린 확정 판정</h3>
        <div className="rv-story-meta">엔코아 · 운영 PostgreSQL 16</div>
        <dl className="rv-3step">
          <dt>문제정의</dt>
          <dd>프로파일링 상세 테이블이 300GB를 점유하는데 요약 테이블은 22MB였습니다. "데이터가 날아갔다"는 의심이 먼저 나왔고, 운영 DB라 전체 스캔으로 검증할 수도 없는 상황이었습니다.</dd>
          <dt>주요역할</dt>
          <dd>dead tuple이 0인데 살아있는 행이 31만 개뿐이라는 모순에서 출발해 heap·TOAST·index를 분해했고, 결정타는 <code>pg_class</code>였습니다 — relpages 3,662만 장에 행 31만 개, 페이지당 0.009행. 테이블을 읽지 않고 99.9%가 빈 페이지임을 확정했습니다. 요약 40,082건은 정상이고 상세는 고아 1건뿐이라는 사실에서 디스크풀 크래시의 잔해임을 시점 증거와 함께 규명했습니다.</dd>
          <dt>주요성과</dt>
          <dd>DELETE와 VACUUM FULL로 300GB를 회수했습니다. 같은 일이 반복되지 않도록 원인 컬럼(고유값 폭발) 식별 쿼리와 모니터링 지표 5종을 정의하고, 이를 [테이블 운영 지표] 화면과 API로 직접 구현해 상시 조회가 가능하게 만들었습니다.</dd>
        </dl>
      </div>

      <div className="rv-story">
        <h3><span className="tag">STORY 3</span>"71곳의 인증 로직을 지웠다" — 서비스 구조 설계와 팀 리딩</h3>
        <div className="rv-story-meta">I-Poten · AI 면접 플랫폼 (3인 팀장, MAU 600+, 2025.10 – 운영 중)</div>
        <dl className="rv-3step">
          <dt>문제정의</dt>
          <dd>SPA 라우팅마다 로그인 상태 조회가 발생했고, 컨트롤러 71곳에 인증 로직이 중복되어 있었습니다. 동시에 AI 추론 요청이 Spring 스레드를 점유해 일반 API까지 느려지는 문제가 겹쳐 있었으며, PM 없이 3인이 병렬 개발하는 환경이라 코드 충돌도 잦았습니다.</dd>
          <dt>주요역할</dt>
          <dd>인증을 Interceptor + 커스텀 어노테이션 + ArgumentResolver 파이프라인으로 일원화하고, 상태 조회는 HttpOnly 쿠키와 Nginx 정책으로 앞단에서 차단했습니다. AI 추론은 FastAPI로 분리해 Spring이 오케스트레이션만 담당하도록 재구성했고, 면접 유형은 Strategy 패턴과 Bean 이름 매핑으로 분리했습니다. 도메인 60개를 피처 단위로 수직 분할하고 백로그 500여 건과 매일의 스프린트 플래닝을 직접 관리했습니다.</dd>
          <dt>주요성과</dt>
          <dd>인증 상태 조회 평균 2ms, 컨트롤러 인증 로직 0곳, 분기문 없이 클래스 추가만으로 면접 유형이 확장되는 구조를 확보했습니다. 오픈 1개월 만에 회원 500명을 넘겼고 현재 MAU 600+로 운영 중이며, 웹과 iOS·Android 앱을 함께 배포했습니다.</dd>
        </dl>
        <div className="rv-links">
          <a href={LINKS.ipoten} target="_blank" rel="noopener noreferrer">i-poten.com</a>
          <a href={LINKS.play} target="_blank" rel="noopener noreferrer">Google Play</a>
          <a href={LINKS.appstore} target="_blank" rel="noopener noreferrer">App Store</a>
          <a href={LINKS.ipotenDeck} target="_blank" rel="noopener noreferrer">아키텍처 자료</a>
        </div>
      </div>

      <div className="rv-story">
        <h3><span className="tag">STORY 4</span>"설계를 만들고, 스스로 되돌리다" — 판단과 철회</h3>
        <div className="rv-story-meta">엔코아 · 개선활동 상태 진행단계</div>
        <dl className="rv-3step">
          <dt>문제정의</dt>
          <dd>개선활동의 [진행단계]를 "끝난 것 → 남은 것" 형태로 보여주려면, 상태코드만으로는 부정확했습니다. 요청 하나에 개선계획이 여러 개일 때 계획별 진행 상황이 뭉개지는 문제가 있었습니다.</dd>
          <dt>주요역할</dt>
          <dd>상태코드가 아니라 각 행이 자기 컬럼에 남긴 흔적(승인일·조치일·확인일)으로 서버가 판정하는 구조를 설계하고, 판정 코드 11종과 설계 판단 7가지를 문서로 남겼습니다. 그러나 기존 [오류데이터 개선활동] 화면과 표기가 달라지면 사용자가 혼란스럽다고 판단해, 완성된 설계를 기존 표기에 맞추는 쪽으로 되돌렸습니다.</dd>
          <dt>주요성과</dt>
          <dd>기술적으로 더 정확한 안이라도 사용자 일관성을 해치면 채택하지 않는다는 기준을 세웠습니다. 다만 되돌린 설계를 통째로 백업하고, 배경·설계근거·코드·검증방법을 담아 <b>그 문서만 보고 완전 복원이 가능한 README</b>를 함께 남겨 조직의 자산으로 보존했습니다.</dd>
        </dl>
      </div>

      <h2 className="rv-h2">그 외 경험 요약</h2>
      <div className="rv-proj">
        <ul>
          <li><b>엔코아 DataWare 7.0</b> (2026.02–) — 신규 화면 2건·API 2건 단독 개발, 운영 이슈 10건+ 규명, 운영 SQL 9종(멱등+롤백), 폐쇄망 설치 자동화 5종, 아키텍처 문서 93KB·96KB 작성</li>
          <li><b>AsianMart</b> — 24개 도메인 122개 API 설계, 발주·입고·재고 6개 도메인 신규 설계, 비관적 락 동시성 제어, 상태 전이 규칙 엔티티 캡슐화, 관리자 21개 화면</li>
          <li><b>I-Fence</b> — 워크스페이스와 Git 1:1 매핑, 커밋→AI→백로그 자동 생성, 15개 기능군 단독 개발 (팀 실사용)</li>
          <li><b>IntellyCosm</b> (2인 팀장) — Redis 캐싱 120ms→11ms, 적중률 88% · <b>TTP</b> — WebSocket 실시간 게임, 실사용자 220명</li>
        </ul>
      </div>

      <EducationBlock />
    </ResumeShell>
  );
}
