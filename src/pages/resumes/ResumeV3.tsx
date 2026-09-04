// V3 클래식 제출형 — 대기업·SI·금융 인쇄 제출용 (근거: 카카오VX 표 기반 클래식 양식)
// 완결형 문장, 네이비 헤더 표, 과장 없는 서술. 레거시·폐쇄망 경험을 전면 배치(SI 희소가치).
import { ResumeShell } from './shared';
import { PROFILE, EDUCATION } from './data';

export default function ResumeV3() {
  return (
    <ResumeShell current="v3">
      <div className="rv-c-title">이 력 서</div>

      <div className="rv-c-head">
        <table className="rv-c-table" style={{ marginBottom: 0 }}>
          <tbody>
            <tr><th>성명</th><td>{PROFILE.nameKr} ({PROFILE.nameEn})</td><th>생년월일</th><td>{PROFILE.birth}</td></tr>
            <tr><th>연락처</th><td>{PROFILE.phone}</td><th>이메일</th><td>{PROFILE.email}</td></tr>
            <tr><th>지원 직무</th><td>백엔드 / 풀스택 개발</td><th>포트폴리오</th><td>github.com/IMCODER0000 · i-poten.com</td></tr>
          </tbody>
        </table>
        <div className="rv-c-photo"><img src="/team/hyeonsu-resume.jpeg" alt="증명사진" /></div>
      </div>

      <h2 className="rv-h2">학력사항</h2>
      <table className="rv-c-table">
        <thead><tr><th style={{ width: 170 }}>기간</th><th style={{ width: 'auto' }}>학교 / 전공</th><th style={{ width: 110 }}>학점</th></tr></thead>
        <tbody>
          {EDUCATION.map((e) => (
            <tr key={e.school}><td>{e.date}</td><td>{e.school}</td><td>{e.score}</td></tr>
          ))}
        </tbody>
      </table>

      <h2 className="rv-h2">경력사항</h2>
      <table className="rv-c-table">
        <thead><tr><th style={{ width: 170 }}>기간</th><th>회사 / 소속</th><th style={{ width: 190 }}>담당 업무</th></tr></thead>
        <tbody>
          <tr><td>2026.02 – 재직 중</td><td>엔코아 · DataWare 7.0 데이터 거버넌스 플랫폼</td><td>데이터 품질(DQ)·민감데이터 검출(SDX) 개발</td></tr>
        </tbody>
      </table>
      <div className="rv-proj">
        <ul>
          <li>데이터 품질 모듈에 <b>[개선활동 상태]</b> 화면을 신설하였습니다. 개선대상 전체를 진단규칙·원인분석·개선계획 3계층 트리로 조회하며, 진행상태 5분류와 12종 필터, 업무영역 권한 및 담당자 4역할 기반 조회범위 제어를 포함하여 프론트엔드·백엔드·엔진 3개 저장소에 걸쳐 단독으로 수행하였습니다.</li>
          <li>디스크풀 장애의 재발 방지책으로 <b>[테이블 운영 지표]</b> 화면과 REST API를 신규 개발하였습니다. PostgreSQL 시스템 정보를 이용해 테이블별 사용 용량과 낭비공간 비율을 조회하며, 정확도 대비 부하를 검토하여 근사 함수를 채택한 근거를 문서화하였습니다.</li>
          <li>민감데이터 탐지 엔진의 <b>JVM OOM 장애 근본 원인</b>을 규명하였습니다. 초기 분석의 오진을 스택 트레이스 해석 원리로 교정하고, 설정 누락 시 결과 버퍼가 무제한으로 적재되는 결함을 코드로 입증하여 모든 경우에 100건 이하를 보장하도록 수정하였습니다.</li>
          <li>커넥션 풀 사이징 결함(공급 N 대비 수요 2N+2)을 구조적으로 진단하고, 수요 모델에서 풀 크기를 유도하는 산정식과 3계층 총량 거버넌스를 설계하여 최대 커넥션을 72로 고정하였습니다.</li>
          <li>운영 PostgreSQL의 300GB 디스크 점유 원인을 메타데이터 분석으로 규명하여 데이터 유실이 아닌 부풀림임을 확정하고, 300GB를 회수하였습니다.</li>
          <li>운영 이슈 10건 이상의 근본 원인을 코드·SQL 레벨로 추적하여 규명하고, 멱등성과 롤백을 보장하는 운영 SQL 스크립트 9종을 작성하였습니다.</li>
          <li>레거시 시스템(Java 7 · Ant · Oracle) 3층 구조의 빌드 순서와 연결 고리를 규명하여 Tomcat 8.5 환경에서 기동을 검증하였고, Oracle 12c/19c Docker 환경 구축 및 스키마 이관을 수행하였습니다.</li>
          <li><b>폐쇄망 온프렘 환경</b>의 설치 자동화 스크립트 5종(통합 설치·사전점검, 서버 IP 자동 치환, JDK 환경 설정, 이미지 일괄 로드, DB 마이그레이션)과 설치 가이드를 제작하였습니다.</li>
          <li>3개 저장소(모듈 20여 개, 화면 1,000여 파일)를 전수 분석하여 아키텍처 문서 2종(93KB·96KB)과 인수인계 통합 문서를 작성하였으며, 워크숍 발표자료를 기술편 30장·업무편 45장으로 이원화하여 제작하였습니다.</li>
        </ul>
      </div>

      <h2 className="rv-h2">기술 스택</h2>
      <table className="rv-c-table">
        <tbody>
          <tr><th>Backend</th><td>Java 17/21, Spring Boot 3.x, JPA · QueryDSL, MyBatis, FastAPI</td></tr>
          <tr><th>Database</th><td>MySQL · MariaDB, PostgreSQL 16, Oracle 12c/19c, Redis</td></tr>
          <tr><th>Frontend</th><td>React 19, TypeScript, JavaScript, ExtJS</td></tr>
          <tr><th>Infra · Tool</th><td>Docker, AWS(EC2·RDS·ALB), Nginx, GitHub Actions, Git, Maven · Ant</td></tr>
          <tr><th>전문 영역</th><td>근본원인분석(RCA), 커넥션 풀 사이징, PostgreSQL bloat·VACUUM, 데이터 거버넌스, 레거시 마이그레이션</td></tr>
        </tbody>
      </table>

      <h2 className="rv-h2">주요 프로젝트</h2>
      <table className="rv-c-table">
        <tbody>
          <tr>
            <th>I-Poten</th>
            <td>
              <b>AI 모의면접 · IT 학습 플랫폼 · 3인 팀 팀장 · 2025.10 – 운영 중 (MAU 600+)</b><br />
              Spring Boot 58개 도메인 규모의 모놀리스와 FastAPI AI 엔진, React 모노레포로 구성된 3-Tier 서비스를 설계·운영하였습니다.
              인증을 Interceptor 및 커스텀 어노테이션 기반 파이프라인으로 일원화하여 컨트롤러 71곳의 중복 로직을 제거하였고,
              HttpOnly 쿠키와 Nginx 정책으로 인증 상태 조회 평균 응답 2ms를 달성하였습니다.
              Docker와 GitHub Actions로 배포를 자동화하였으며, PM 부재 환경에서 백로그 약 500건의 관리와 스프린트 플래닝을 주도하였습니다.
            </td>
          </tr>
          <tr>
            <th>AsianMart</th>
            <td>
              <b>커머스 · 구매관리 통합 운영 시스템 · 팀 협업 및 개인 확장</b><br />
              Spring Boot 기반 24개 도메인 122개 REST API를 4계층으로 설계하고 관리자 콘솔 21개 화면을 구현하였습니다.
              발주·입고·재고 6개 도메인을 신규 설계(개인 확장 구간)하여 5단계 상태 기계와 재고 원장·가중 이동평균가 기반 매입 단가 추적을 구현하였고,
              입고 확정 트랜잭션에 비관적 락을 적용하여 재고 중복 반영을 방지하였습니다.
            </td>
          </tr>
          <tr>
            <th>I-Fence</th>
            <td>
              <b>개발팀용 협업 워크스페이스 · 단독 개발 (팀 실사용)</b><br />
              워크스페이스를 Git 저장소·브랜치·커밋과 1:1로 매핑하고, 커밋 기반 AI 백로그 자동 생성 파이프라인을 구축하였습니다.
              칸반·문서·회의·OKR·마일스톤·근태 등 15개 기능군을 백엔드·프론트엔드 전 영역에서 구현하였습니다.
            </td>
          </tr>
          <tr>
            <th>IntellyCosm</th>
            <td>
              <b>AI(OCR+LLM) 화장품 성분 분석 플랫폼 · 2인 팀 팀장</b><br />
              약 2만 건 성분사전의 반복 조회 패턴을 분석하여 Redis 캐싱 레이어를 도입, 평균 응답 시간을 120ms에서 11ms로 91% 단축하고
              캐시 적중률 88%, DB 조회 요청 88% 감소를 달성하였습니다.
            </td>
          </tr>
          <tr>
            <th>TTP</th>
            <td>
              <b>WebSocket 실시간 멀티플레이 게임 플랫폼 · 단독 개발</b><br />
              기획부터 개발·배포·운영까지 전 과정을 수행하여 실사용자 220명을 달성하였습니다.
            </td>
          </tr>
        </tbody>
      </table>

      <h2 className="rv-h2">교육 및 수상</h2>
      <table className="rv-c-table">
        <tbody>
          <tr><th>2025.04 – 2025.10</th><td>플레이데이터 풀스택 백엔드 개발자 양성 과정 수료 — <b>최우수 팀 · 최우수 수료생 선정</b></td></tr>
          <tr><th>2024</th><td>교내 해커톤 및 졸업프로젝트 최우수 프로젝트 TOP 5 선정</td></tr>
        </tbody>
      </table>

      <p className="rv-c-sign">위의 모든 기재 사항은 사실과 다름이 없습니다.</p>
    </ResumeShell>
  );
}
