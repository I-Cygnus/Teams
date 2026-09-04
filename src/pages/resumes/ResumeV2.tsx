// V2 스페셜리스트형 — 무기 하나(근본원인분석)로 전체 관통 (근거: 향로의 역량축 재편집 + LINE 합격자의 무기 반복)
// 모든 경험을 "발생 지점 ≠ 원인 지점"이라는 축으로 재배열한다.
import { ResumeShell, Contacts, EducationBlock } from './shared';
import { PROFILE, LINKS } from './data';

export default function ResumeV2() {
  return (
    <ResumeShell current="v2">
      <section className="profile-section rv-profile">
        <div className="profile-info">
          <div className="rv-name-row">
            <span className="rv-name">{PROFILE.nameKr}</span>
            <span className="rv-role-tag">Backend Developer</span>
          </div>
          <h1 className="rv-headline"><b>발생 지점</b>과 <b>원인 지점</b>을 구분합니다.</h1>
          <p className="rv-sub">
            스택 트레이스 최상단은 마지막으로 메모리를 요청했다 거절당한 <em>피해자</em>일 수 있습니다.
            운영 중인 데이터 거버넌스 플랫폼에서 OOM·커넥션 풀 고갈·300GB 디스크 부풀림의 원인을
            코드와 DB 레벨로 규명하고, 같은 일이 반복되지 않는 구조까지 만들었습니다.
          </p>
          <Contacts />
        </div>
        <div className="profile-image-container">
          <img src="/team/hyeonsu-resume.jpeg" alt="프로필" className="profile-image" />
        </div>
      </section>

      <div className="rv-weapon">
        <div className="w-title">근본원인분석 — 세 단계로 일합니다</div>
        <p><b>① 오진을 의심한다</b> — 초기 분석서가 지목한 범인을 스택 해석 원리로 반박하고, 진범(설정 누락 시 `0=무제한`으로 해석되는 버퍼)을 코드로 입증했습니다.</p>
        <p><b>② 스캔하지 않고 판정한다</b> — 운영 DB를 건드리지 않고 `pg_class` 메타데이터 3단 분해만으로 "유실이 아니라 99.9% 빈 페이지"를 확정했습니다.</p>
        <p><b>③ 내 수정을 의심한다</b> — 배포 직후 제가 작성한 폴백 코드의 결함을 "정확히 1건"이라는 증상에서 역추적해 자체 발견·수정했습니다.</p>
      </div>

      <h2 className="rv-h2">엔코아 · DataWare 7.0 데이터 거버넌스 플랫폼 <span className="rv-dim">2026.02 – 재직 중</span></h2>

      <div className="rv-proj">
        <div className="rv-proj-head"><h3>① 민감데이터 탐지 엔진 OOM — 오진을 뒤집다</h3><span className="meta">Java 21 · Spring Boot · Rust · PostgreSQL</span></div>
        <ul>
          <li>920만 행 컬럼 분석 중 OOM 발생. 초기 분석서는 스택 최상단 <b>Producer의 문자열 연결</b>을 원인으로 지목했으나, <b>RMI idle 스레드와 HttpClient 셀렉터까지 동시 OOM</b>인 점에서 힙 전체 고갈로 판단 — Producer는 피해자였습니다</li>
          <li>질문을 "누가 마지막에 호출됐나"에서 <b>"누가 힙을 점유했나"</b>로 전환해 Consumer 추적, <code>DATA_SAVE_CNT == 0</code>이 무제한 적재로 해석되는 코드를 발견하고 git 이력에서 <b>한도를 풀어버린 회귀 커밋을 특정</b></li>
          <li>2차 증상인 커넥션 타임아웃은 단순 증설이 아니라 <b>풀 사이징 결함(공급 N vs 수요 2N+2)</b>으로 구조 진단 — 스레드 모델에서 풀 크기를 유도하는 산정식을 설계·구현</li>
          <li>총량이 <code>(2N+2)×M</code>으로 증가하는 문제에 <b>거버넌스 3계층</b>(작업당 병렬수 상한 → 동시 작업 수 상한 → DB 계정 CONNECTION LIMIT)을 설계해 최악 시나리오를 <b>상수 72로 고정</b></li>
          <li>구현 후 <b>적대적 자체 재검토</b>로 심각 결함 1건 추가 발견 — 매니저가 clamp한 병렬수를 자식 프로세스가 DB 재조회(<code>COALESCE</code>)로 우회하는 문제를, 값이 흐르는 전 구간(Manager→CLI 인자→매퍼→핸들러) 추적으로 검증·차단</li>
          <li><b>대용량 잠재 리스크 9건 사전 발굴</b> — 특히 MySQL JDBC가 <code>useCursorFetch</code> 없이는 fetchSize를 무시하고 전체 ResultSet을 적재하는 함정을 찾아 동일 OOM의 제2 경로를 사전 차단</li>
          <li>메타 저장소 Oracle 전환 대비 <b>호환성 전수 감사</b> — PostgreSQL 전용 요소 29곳+(<code>::</code> 캐스팅, <code>NOW()</code>, <code>NULLIF(x,'')</code>의 ORA-00932 등) 식별 및 포팅 로드맵 작성</li>
        </ul>
      </div>

      <div className="rv-proj">
        <div className="rv-proj-head"><h3>② 300GB 디스크 미스터리 — 스캔 없이 내린 확정 판정</h3><span className="meta">PostgreSQL 16 · pgstattuple</span></div>
        <ul>
          <li>상세 테이블 300GB vs 요약 22MB. "데이터 유실" 의심이 먼저 제기됐고, 운영 DB라 전체 스캔 검증은 불가한 상황</li>
          <li><code>pg_stat_user_tables</code> → heap/TOAST/index 분해 → <b><code>pg_class.relpages</code> vs <code>reltuples</code></b> 3단계로 접근. 결정타는 <b>relpages 3,662만 장에 유효 행 31만 개(페이지당 0.009행)</b> — 읽지 않고 빈 페이지를 확정</li>
          <li>요약 40,082건은 정상, 상세는 고아 1건뿐 — <b>디스크풀 크래시의 잔해</b>임을 시점 증거로 규명하고 DELETE + VACUUM FULL로 <b>300GB 회수</b></li>
          <li>재발이 보이도록 <b>[테이블 운영 지표] 화면·API를 신규 개발</b> — 정확도 vs 부하 트레이드오프를 검토해 근사 함수 채택 근거를 문서화하고, 원인 컬럼(고유값 폭발) 식별 쿼리와 모니터링 지표 5종을 정의</li>
        </ul>
      </div>

      <div className="rv-proj">
        <div className="rv-proj-head"><h3>③ 데이터 품질(DQ5) — 신규 화면과 운영 이슈</h3><span className="meta">프론트·백엔드·엔진 3개 저장소 단독 수행</span></div>
        <ul>
          <li><b>[개선활동 상태] 화면 신설</b> — 개선대상 전체를 <code>진단규칙 → 원인분석 → 개선계획</code> 3계층 트리로 조회. 진행상태 5분류 + 지표 타일, 12종 필터, <b>업무영역 권한 + 담당자 4역할 조회범위 제어</b>, 진단규칙상세 팝업(4탭)</li>
          <li><b>운영 이슈 10건+ 근본 원인 규명</b> — "설명만 수정했는데 재실행 상태로 변경"(선분이력 <code>aval_st_dt</code> 갱신), "진단만 실행해도 진행중 오판정"(엔진 INSERT 시 <code>status</code> NULL을 조회 쿼리가 진행중으로 해석), "엑셀 업로드 권한 오류"(업로더와 엑셀 기재자가 서로 다른 권한을 요구) 등</li>
          <li>운영 스크립트 9종 작성 — <b>전부 멱등 + 롤백문 포함</b>, DB 밖 원본 파일 처리 안내까지 포함</li>
          <li>설계를 만들고 <b>스스로 되돌린 경험</b> — 진행단계 서버 판정 구조를 설계했으나 기존 화면과 표기가 달라 사용자 혼란이 예상되어 철회. 대신 배경·설계근거·코드·검증방법을 담아 <b>이 문서만으로 완전 복원이 가능한 백업</b>을 남김</li>
        </ul>
      </div>

      <h2 className="rv-h2">같은 태도로 만든 것들</h2>
      <div className="rv-proj">
        <ul>
          <li><b>I-Poten</b> (AI 면접 플랫폼, 3인 팀장, MAU 600+) — AI 추론이 Spring 스레드를 점유하는 <b>구조적 원인</b>을 진단해 FastAPI로 분리, 인증 중복 71곳을 파이프라인으로 흡수
            <span className="rv-links" style={{ display: 'inline-flex', marginLeft: 8 }}>
              <a href={LINKS.ipoten} target="_blank" rel="noopener noreferrer">서비스</a>
              <a href={LINKS.org} target="_blank" rel="noopener noreferrer">GitHub</a>
            </span>
          </li>
          <li><b>IntellyCosm</b> — "느리다"가 아니라 "어디가 왜 느린가"부터. 반복 조회 패턴을 계측한 뒤 Redis 도입 (120ms→11ms, 적중률 88%)</li>
          <li><b>AsianMart</b> — 동시 확정 시 재고 중복 반영이라는 <b>동시성 결함</b>을 예측해 비관적 락을 선제 적용, 24개 도메인 122개 API 설계</li>
          <li><b>TTP</b> — WebSocket 유령 연결이 상태 동기화를 깨뜨리는 원인을 추적해 연결 수명 관리로 해결 (실사용자 220명)</li>
        </ul>
      </div>

      <h2 className="rv-h2">장애가 가르쳐 준 원칙</h2>
      <table className="rv-principles">
        <tbody>
          <tr><td>발생 지점과 원인 지점을 구분한다</td><td>OOM 오진 교정에서</td></tr>
          <tr><td>"0 = 무제한" 같은 매직 값을 만들지 않는다</td><td>설정 누락이 곧 장애가 되는 구조 제거</td></tr>
          <tr><td>리소스 한도는 수요 모델에서 계산하고, 통제는 입력에 건다</td><td>풀을 직접 자르면 스레드와 어긋난다</td></tr>
          <tr><td>내가 방금 고친 코드가 다음 버그의 1순위 용의자다</td><td>배포 직후 폴백 버그 자체 발견</td></tr>
          <tr><td>모든 운영 스크립트는 멱등 + 롤백 포함</td><td>WHERE 없는 UPDATE 사고 이후</td></tr>
          <tr><td>문서는 독자별로 이원화한다</td><td>기술편/업무편, AI용/사람용</td></tr>
          <tr><td>되돌린 작업도 복원 가능하게 남긴다</td><td>진행단계 설계 백업</td></tr>
        </tbody>
      </table>

      <EducationBlock />
    </ResumeShell>
  );
}
