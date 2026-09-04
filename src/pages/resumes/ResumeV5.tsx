// V5 에비던스형 — 증거의 외주화 (근거: 당근 JSpiner의 동료평가 PR 링크 전략)
// 모든 주장 옆에 검증 가능한 링크. 링크가 불가한 것은 불가하다고 명시한다.
import { ResumeShell, Contacts, EducationBlock } from './shared';
import { PROFILE, LINKS, SKILLS } from './data';

function Ev({ href, label }: { href: string; label: string }) {
  return <a className="rv-ev" href={href} target="_blank" rel="noopener noreferrer">↗ {label}</a>;
}

export default function ResumeV5() {
  return (
    <ResumeShell current="v5">
      <section className="profile-section rv-profile">
        <div className="profile-info">
          <div className="rv-name-row">
            <span className="rv-name">{PROFILE.nameKr}</span>
            <span className="rv-role-tag">{PROFILE.role}</span>
          </div>
          <h1 className="rv-headline">읽지 말고 <b>눌러서 확인</b>하세요.</h1>
          <p className="rv-sub">
            이 이력서의 주장에는 지금 바로 열어볼 수 있는 증거를 달았습니다 — 운영 중인 서비스, 스토어 등록 정보,
            공개 저장소, 발표 자료. 링크로 증명할 수 없는 사내 업무는 <b>그렇다고 표시</b>했습니다.
          </p>
          <Contacts />
        </div>
        <div className="profile-image-container">
          <img src="/team/hyeonsu-resume.jpeg" alt="프로필" className="profile-image" />
        </div>
      </section>

      <h2 className="rv-h2">지금 접속할 수 있는 것 <span className="rv-dim">직접 가입해 사용해 보실 수 있습니다</span></h2>
      <div className="rv-proj">
        <div className="rv-proj-head"><h3>I-Poten — AI 모의면접 · IT 학습 플랫폼</h3><span className="meta">3인 팀장 · 2025.10 – 운영 중</span></div>
        <ul>
          <li>웹 서비스 운영 중 — 오픈 1개월 회원 500명, <b>MAU 600+</b>
            <Ev href={LINKS.ipoten} label="i-poten.com" /></li>
          <li>모바일 앱 양대 스토어 배포 (RefreshToken 인증 · FCM 푸시 · 소셜 로그인)
            <Ev href={LINKS.play} label="Google Play" /><Ev href={LINKS.appstore} label="App Store" /></li>
          <li>코드·커밋 이력 공개 — Spring Boot 58개 도메인 / FastAPI AI 엔진 / React 모노레포 8앱
            <Ev href={LINKS.org} label="GitHub (I-Cygnus)" /><Ev href={LINKS.ipotenDeck} label="아키텍처 발표자료" /></li>
          <li><b>기술 요점</b> — 인증 파이프라인 일원화로 컨트롤러 71곳 중복 제거 · HttpOnly 쿠키+Nginx로 상태 조회 평균 2ms · AI 추론 FastAPI 분리 · Strategy 패턴 면접 유형 확장 · Docker + GitHub Actions 자동 배포</li>
        </ul>
      </div>

      <div className="rv-proj">
        <div className="rv-proj-head"><h3>TTP — 실시간 멀티플레이 게임 플랫폼</h3><span className="meta">단독 개발 · 실사용자 220명</span></div>
        <ul>
          <li>기획→개발→배포→개선 전 과정 단독 수행, WebSocket 상태 동기화·유령 연결 정리 구조
            <Ev href={LINKS.ttp} label="프로젝트 문서" /></li>
        </ul>
      </div>

      <div className="rv-proj">
        <div className="rv-proj-head"><h3>I-Fence — 개발팀 협업 워크스페이스</h3><span className="meta">단독 개발 · 팀 실사용 중</span></div>
        <ul>
          <li>워크스페이스를 <b>Git 저장소·브랜치·커밋과 1:1 매핑</b>하고, 커밋 기반 AI 백로그 자동 생성 파이프라인 구축
            <Ev href={LINKS.org} label="GitHub" /><Ev href={LINKS.ifenceDeck} label="개요 자료" /></li>
          <li>칸반·문서·회의·OKR·마일스톤·근태·ERD 에디터 등 <b>15개 기능군</b>을 백엔드·프론트 전 영역에서 구현</li>
        </ul>
      </div>

      <div className="rv-proj">
        <div className="rv-proj-head"><h3>AsianMart — 커머스 + 구매관리 운영 시스템</h3><span className="meta">팀 협업 + 개인 확장</span></div>
        <ul>
          <li>Spring Boot <b>24개 도메인 122개 API</b>, 관리자 21개 화면 (백 15.2K LOC / 프론트 14.9K LOC)</li>
          <li><b>구분 표기</b> — 커머스 기반(상품·주문·장바구니·배송)은 팀 협업 구간, <b>구매관리 6개 도메인과 관리자 UI 전면 개편은 개인 확장</b> 구간입니다</li>
          <li>발주 5단계 상태 기계 · 재고 원장과 가중 이동평균가 · 비관적 락 동시성 제어 · 78개 에러코드 응답 규격 통일</li>
        </ul>
      </div>

      <div className="rv-proj">
        <div className="rv-proj-head"><h3>개인 도구 — Claude Control · Content Engine</h3><span className="meta">직접 만들어 매일 사용</span></div>
        <ul>
          <li>원격 AI CLI 제어 패널(웹에서 PC의 Claude Code·Codex 조작), 한국어 SNS 텍스트 카드 생성기 — 필요한 도구는 직접 만듭니다
            <Ev href={PROFILE.github} label="GitHub 프로필" /></li>
        </ul>
      </div>

      <h2 className="rv-h2">실무 — 엔코아 DataWare 7.0 <span className="rv-dim">2026.02 – 재직 중</span></h2>
      <div className="rv-ev-note" style={{ background: '#f7f8fa', borderColor: '#d0d5db', color: '#4a5160' }}>
        <b>공개 불가 영역</b> — 사내 코드베이스라 링크를 제공할 수 없습니다. 대신 면접 자리에서 분석 문서와 실제 화면을 시연할 수 있습니다.
      </div>
      <div className="rv-proj">
        <ul>
          <li><b>운영 장애 3건 근본 원인 규명</b> — JVM OOM(오진 교정 후 `0=무제한` 회귀 커밋 특정, 결과 버퍼 ≤100건 보장), 커넥션 풀 고갈(수요 모델 2N+2 산정식 + 3계층 거버넌스로 총량 72 고정), 300GB 디스크 부풀림(메타데이터 진단 후 회수)</li>
          <li><b>신규 화면 2건 · REST API 2건</b> 단독 개발 — [개선활동 상태] 3계층 트리(5분류·12종 필터·권한 4역할), [테이블 운영 지표](pgstattuple)</li>
          <li><b>운영 이슈 10건+ 규명</b>, 운영 SQL 9종(전부 멱등+롤백), 폐쇄망 설치 자동화 5종</li>
          <li><b>문서화</b> — 3개 저장소 전수 분석 후 93KB·96KB 아키텍처 문서, 인수인계 1종으로 업무 인계가 가능한 통합 문서, 워크숍 발표자료 기술편 30장·업무편 45장</li>
        </ul>
      </div>

      <h2 className="rv-h2">Skills</h2>
      <div className="skills-list">
        {SKILLS.map((cat) => (
          <div className="skill-row" key={cat.level}>
            <div className="skill-level"><span className="skill-title">{cat.level}</span></div>
            <div className="tag-list">{cat.items.map((s) => <span className="tag" key={s}>{s}</span>)}</div>
          </div>
        ))}
      </div>

      <h2 className="rv-h2">기록하는 습관</h2>
      <div className="rv-proj">
        <ul>
          <li>기술 기록 · 포트폴리오
            <Ev href={PROFILE.notion} label="Notion" /><Ev href={PROFILE.portfolio} label="포트폴리오 사이트" /></li>
          <li>실무에서도 독자별로 문서를 이원화합니다 — 기술편/업무편, AI용/사람용. 되돌린 설계조차 복원 가능한 형태로 남깁니다</li>
        </ul>
      </div>

      <EducationBlock />
    </ResumeShell>
  );
}
