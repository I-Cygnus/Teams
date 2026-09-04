// ② 케이스북 — 컨설팅 리포트 형식. 상황·복잡성·핵심질문·해결·검증·남긴 것.
// 설계: 결과가 아니라 "어떻게 생각했는가"를 판다. 각 케이스 끝에 그 케이스가 증명하는 역량을 명시.
import { NewShell } from './shell';
import { PROFILE, LINKS } from '../data';

export default function CaseBook() {
  return (
    <NewShell current="casebook" theme="casebook">
      <div className="n-sheet np-case">
        <div className="cb-top">
          <div className="cb-kicker">Problem-Solving Casebook</div>
          <h1>{PROFILE.nameKr} · 백엔드 개발자</h1>
          <p className="cb-sub">
            무엇을 만들었는지가 아니라 <b>어떻게 판단했는지</b>를 담았습니다.
            운영 환경에서 실제로 마주친 문제 세 건을, 오판했던 지점과 그것을 뒤집은 근거까지 그대로 기술합니다.
          </p>
          <div className="cb-meta">
            <span>{PROFILE.phone}</span>
            <span>{PROFILE.email}</span>
            <a href={PROFILE.github} target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href={LINKS.ipoten} target="_blank" rel="noopener noreferrer">i-poten.com</a>
          </div>
        </div>

        {/* CASE 01 */}
        <section className="case">
          <div className="case-no">CASE 01</div>
          <h2>스택 트레이스 맨 위를 범인으로 지목한 분석서를 뒤집다</h2>
          <div className="case-tag">엔코아 · 민감데이터 탐지 엔진 (Java 21 · Spring Boot · Rust · PostgreSQL) · 2026</div>
          <dl className="scq">
            <dt>상황</dt>
            <dd>920만 행 규모의 컬럼 분석 작업 중 JVM OOM이 발생했습니다. 현장 접근이 제한된 상태라 손에 쥔 것은 모니터를 찍은 사진 두 장과 그것을 판독해 작성된 초기 분석서뿐이었고, 분석서는 스택 트레이스 최상단의 Producer 문자열 연결을 원인으로 지목하고 있었습니다.</dd>

            <dt>복잡성</dt>
            <dd>그 결론대로면 Producer만 고치면 됩니다. 그러나 같은 시각 <b>RMI idle 스레드와 HttpClient 셀렉터까지 동시에 OOM</b>이 났습니다. 메모리를 거의 쓰지 않는 유휴 스레드가 죽었다는 것은 특정 컴포넌트의 과다 할당이 아니라 힙 전체가 이미 고갈됐다는 뜻입니다. 즉 스택 최상단은 <b>마지막으로 할당을 요청했다 거절당한 피해자</b>일 가능성이 컸습니다.</dd>

            <dt>핵심 질문</dt>
            <dd>"누가 마지막에 호출됐는가"가 아니라 <b>"누가 힙을 점유하고 있었는가"</b>.</dd>

            <dt>해결</dt>
            <dd>질문을 바꿔 Consumer 측을 열자 <code>DATA_SAVE_CNT == 0</code>일 때 결과 버퍼가 무제한으로 적재되는 조건이 있었습니다. 설정이 누락되면 값이 0이 되고, 0이 "무제한"으로 해석되는 구조였습니다. git 이력을 따라가 보니 과거 "결과 미적재 버그"를 수정하면서 한도를 풀어버린 <b>회귀 커밋</b>이 원인이었습니다. 작은 버그 수정이 OOM 폭탄으로 치환된 것입니다.</dd>

            <dt>검증</dt>
            <dd>수정 후 2차 증상으로 커넥션 타임아웃이 남았습니다. 단순 증설 대신 <b>공급 N vs 수요 2N+2</b>라는 구조적 불일치로 진단하고 수요 모델에서 풀 크기를 유도하는 산정식을 설계했습니다. 이어 총량이 <code>(2N+2)×M</code>으로 증가하는 문제에 3계층 거버넌스(작업당 병렬수 → 동시 작업 수 → DB 계정 CONNECTION LIMIT)를 걸어 최악 시나리오를 상수 72로 고정했습니다. 구현 후 적대적 자체 재검토에서 <b>자식 프로세스가 DB 재조회로 clamp를 우회</b>하는 결함을 추가 발견해, 값이 흐르는 전 구간(Manager→CLI 인자→매퍼→핸들러)을 추적해 차단했습니다.</dd>

            <dt>남긴 것</dt>
            <dd>배포 검증 중 <b>제가 작성한 폴백 코드의 결함</b>(<code>Math.max(0,1)</code>로 설정값 0이 100이 아닌 1로 폴백)을 "정확히 1건만 저장된다"는 증상에서 역추적해 즉시 수정했습니다. 또한 MySQL JDBC가 <code>useCursorFetch</code> 없이는 fetchSize를 무시하고 전체 ResultSet을 적재하는 함정을 찾아 동일 OOM의 제2 경로를 사전 차단하는 등, 대용량 잠재 리스크 9건을 함께 정리했습니다.</dd>
          </dl>
          <div className="proof">
            <b>이 케이스가 증명하는 것</b> — 권위 있는 1차 분석을 근거로 반박하는 능력, 증상과 원인을 분리하는 사고, 그리고 수정 이후 자기 코드를 가장 먼저 의심하는 검증 습관.
          </div>
        </section>

        {/* CASE 02 */}
        <section className="case">
          <div className="case-no">CASE 02</div>
          <h2>300GB를 스캔하지 않고 "유실이 아니다"라고 확정하다</h2>
          <div className="case-tag">엔코아 · 운영 PostgreSQL 16 · 2026</div>
          <dl className="scq">
            <dt>상황</dt>
            <dd>프로파일링 상세 테이블이 300GB를 점유하는데 대응하는 요약 테이블은 22MB였습니다. 규모 차이가 네 자릿수라 "데이터가 날아갔다"는 의심이 먼저 제기됐습니다.</dd>

            <dt>복잡성</dt>
            <dd>운영 중인 DB였습니다. 300GB 테이블을 전체 스캔해 검증하는 순간 서비스에 영향이 갑니다. <b>읽지 않고 판정해야</b> 했습니다. 게다가 dead tuple은 0으로 보고되는데 살아있는 행은 31만 개뿐이라, 행당 1MB라는 말이 안 되는 수치가 나왔습니다.</dd>

            <dt>핵심 질문</dt>
            <dd>"데이터가 사라졌는가"가 아니라 <b>"이 300GB에 무엇이 들어 있는가"</b>.</dd>

            <dt>해결</dt>
            <dd><code>pg_stat_user_tables</code>로 시작해 heap·TOAST·index를 분해하니 heap이 거의 전부였습니다. 결정타는 <code>pg_class</code>였습니다 — <b>relpages 3,662만 장에 rows 31만 개, 페이지당 0.009행.</b> 메타데이터만으로 99.9%가 빈 페이지임을 확정했습니다. 요약 40,082건은 정상이고 상세에는 짝 없는 고아 1건뿐이라는 사실에서, 7월 디스크풀 크래시의 잔해임을 시점 증거와 함께 규명했습니다. 유실이 아니라 <b>부풀림(bloat)</b>이었습니다.</dd>

            <dt>검증</dt>
            <dd><code>DELETE + VACUUM FULL</code>로 300GB를 회수했습니다. 다만 회수는 증상 처리일 뿐이라, 부풀림을 유발한 원인 컬럼(고유값 폭발)을 식별하는 쿼리와 모니터링 지표 5종을 별도로 정의했습니다.</dd>

            <dt>남긴 것</dt>
            <dd>같은 사고가 다시 나면 사후 진단이 아니라 사전에 보이도록, <b>[테이블 운영 지표] 화면과 API를 신규 개발</b>했습니다. 이때 정확 측정 함수 대신 근사 함수(<code>pgstattuple_approx</code>)를 택했는데, 운영 부하 대비 정확도 손실이 판단에 영향을 주지 않는 수준임을 검증하고 그 근거를 문서로 남겼습니다. 필요 권한은 배포 절차에 명시했습니다.</dd>
          </dl>
          <div className="proof">
            <b>이 케이스가 증명하는 것</b> — 운영 제약 안에서 검증 경로를 설계하는 능력, DB 내부 구조에 대한 이해, 그리고 문제 해결을 일회성으로 끝내지 않고 가시성으로 전환하는 태도.
          </div>
        </section>

        {/* CASE 03 */}
        <section className="case">
          <div className="case-no">CASE 03</div>
          <h2>완성한 설계를 스스로 되돌리고, 되돌린 것을 자산으로 남기다</h2>
          <div className="case-tag">엔코아 · [개선활동 상태] 진행단계 · 2026</div>
          <dl className="scq">
            <dt>상황</dt>
            <dd>개선활동의 [진행단계]를 "끝난 것 → 남은 것" 형태로 보여줘야 했습니다. 그런데 상태코드만으로는 요청 하나에 개선계획이 여러 개일 때 계획별 진행 상황이 뭉개졌습니다.</dd>

            <dt>복잡성</dt>
            <dd>정확한 방법은 있었습니다. 상태코드가 아니라 <b>각 행이 자기 컬럼에 남긴 흔적</b>(승인일·조치일·확인일)으로 서버가 판정하면 계획별로 정확해집니다. 설계를 마치고 판정 코드 11종과 설계 판단 7가지를 문서화했습니다. 문제는 이 방식이 기존 [오류데이터 개선활동] 화면의 표기와 달라진다는 점이었습니다.</dd>

            <dt>핵심 질문</dt>
            <dd>"기술적으로 더 정확한 안"과 "사용자가 헷갈리지 않는 안"이 충돌할 때 <b>무엇을 우선하는가</b>.</dd>

            <dt>해결</dt>
            <dd>완성한 설계를 채택하지 않고 기존 표기에 맞추는 쪽으로 되돌렸습니다. 같은 데이터를 두 화면이 다르게 부르면, 정확도에서 얻는 이득보다 신뢰에서 잃는 것이 크다고 판단했습니다.</dd>

            <dt>남긴 것</dt>
            <dd>철회한 설계를 통째로 백업하고, 배경·설계근거·코드·검증방법을 담아 <b>그 문서만 보고 완전 복원이 가능한 README</b>를 함께 남겼습니다. 표기 통일 정책이 바뀌는 시점에 누구든 되살릴 수 있습니다.</dd>
          </dl>
          <div className="proof">
            <b>이 케이스가 증명하는 것</b> — 자기 결과물에 대한 집착보다 제품 일관성을 우선하는 판단, 그리고 폐기한 작업조차 조직의 자산으로 보존하는 문서화 습관.
          </div>
        </section>

        {/* 부록 */}
        <div className="cb-appendix">
          <h3>Appendix — 이력 요약</h3>
          <dl className="cb-rows">
            <dt>엔코아 (2026.02–)</dt>
            <dd>DataWare 7.0 데이터 거버넌스 플랫폼 · 데이터 품질(DQ)·민감데이터 검출(SDX) — 신규 화면 2건·API 2건 단독 개발, 운영 이슈 10건+ 규명, 운영 SQL 9종(멱등+롤백), 폐쇄망 설치 자동화 5종, 아키텍처 문서 93KB·96KB</dd>
            <dt>I-Poten (2025.10–)</dt>
            <dd>AI 모의면접 플랫폼 · 3인 팀장 · MAU 600+ — Spring 58개 도메인 + FastAPI + React 모노레포 3-Tier, 인증 파이프라인으로 컨트롤러 71곳 중복 제거(상태 조회 2ms), 백로그 500여 건 관리</dd>
            <dt>AsianMart</dt>
            <dd>24개 도메인·122개 API 4계층 설계, 발주·입고·재고 6개 도메인 신규 설계(개인 확장), 비관적 락 동시성 제어, 관리자 21개 화면</dd>
            <dt>그 외</dt>
            <dd>I-Fence(협업툴, 단독, Git 1:1 매핑) · IntellyCosm(Redis 120→11ms, 2인 팀장) · TTP(WebSocket 실시간, 실사용자 220명)</dd>
            <dt>학력</dt>
            <dd>가천대학교 컴퓨터공학과 편입 3.87/4.5 · 군산대학교 소프트웨어공학과 4.03/4.5 · 플레이데이터 풀스택 과정 최우수 팀·최우수 수료생</dd>
          </dl>
        </div>
      </div>
    </NewShell>
  );
}
