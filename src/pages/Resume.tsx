import { useEffect } from 'react';
import { Phone, Mail, BookOpen, Calendar, Briefcase, Printer } from 'lucide-react';
import './Resume.css';

function Github({ size = 18 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55 0-.27-.01-1.16-.02-2.11-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.27-1.69-1.27-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.25 3.33.96.1-.74.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.18.91-.25 1.89-.38 2.86-.38.97 0 1.95.13 2.86.38 2.18-1.49 3.14-1.18 3.14-1.18.62 1.58.23 2.75.11 3.04.74.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.39-5.26 5.68.41.36.78 1.06.78 2.14 0 1.55-.01 2.79-.01 3.17 0 .31.21.67.8.55C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z" />
    </svg>
  );
}

export default function Resume() {
  useEffect(() => {
    const prev = document.body.style.background;
    document.body.style.background = '#FAFBFC';
    return () => {
      document.body.style.background = prev;
    };
  }, []);

  return (
    <div className="resume-page">
      <button
        type="button"
        onClick={() => window.print()}
        className="print-toolbar"
        aria-label="인쇄 또는 PDF 저장"
      >
        <Printer size={14} />
        인쇄 · PDF
      </button>

      <div className="resume-container">
        <div className="resume-content">
          <main>
            <Profile />

            <div className="section-divider" />

            <section className="skills-section">
              <h2 className="section-title">
                Skills <span className="subtitle">| 기술 역량</span>
              </h2>
              <Skills />
            </section>

            <div className="section-divider" />

            <section className="experience-section">
              <h2 className="section-title">
                Experience <span className="subtitle">| 실무 경험</span>
              </h2>
              <Experience />
            </section>

            <div className="section-divider" />

            <section className="projects-section">
              <h2 className="section-title">
                Projects <span className="subtitle">| 주요 프로젝트</span>
              </h2>
              <Projects />
            </section>

            <div className="section-divider" />

            <section className="education-section">
              <Education />
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}

function Profile() {
  return (
    <section className="profile-section">
      <div className="profile-info">
        <div className="profile-name-area">
          <h1 className="profile-name-kr">최현수</h1>
          <span className="profile-name-en" style={{ fontSize: '1.4rem' }}>
            FullStack/Backend 개발자
          </span>
        </div>

        <div className="profile-title-line" />

        <div className="profile-motto">이유를 찾고 이유를 만들어가는 개발자</div>
        <div className="profile-motto-en">
          <p>트렌드에서 이유를 찾고, 트레이드오프에서 이유를 만들어가는 백엔드 개발자입니다.</p>
          <p>
            <strong>Spring Boot·React</strong> 기반으로 B2C 서비스(I-Poten)를 End-to-End로 구축해{' '}
            <strong>오픈 베타 1개월만에 누적 회원 500명 돌파 후 현재 MAU 600+ 를 유지하고 있습니다.</strong> AWS 인프라와 LLM 기반 기능 연동까지 경험했습니다.
          </p>
          <p>
            해당 프로젝트에서 <strong>500여 개 백로그 관리와 스프린트 플래닝</strong>을 주도하며{' '}
            <strong>실서비스 3회 배포·운영</strong>을 이어왔고, 현재는 기업 인턴으로{' '}
            <strong>B2B 데이터 검출 플랫폼의 MVP 개발</strong>을 담당하고 있습니다.
          </p>
        </div>

        <div className="profile-contact">
          <div className="contact-item">
            <Phone size={18} />
            <span>010-2651-9025</span>
          </div>
          <div className="contact-item">
            <Mail size={18} />
            <span>gustn9025@naver.com</span>
          </div>
          <div className="contact-item">
            <Calendar size={18} />
            <span>1999.08.23</span>
          </div>
          <a
            href="https://github.com/IMCODER0000"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-item"
          >
            <Github size={18} />
            <span>GitHub</span>
          </a>
          <a
            href="https://canary-marquis-2c0.notion.site/98adf07bd8c78273bd668192d126bb90?source=copy_link"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-item"
          >
            <BookOpen size={18} />
            <span>Notion</span>
          </a>
          <a
            href="https://xn--x-cc6e584ceubi3h0reda.com/choi"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-item"
          >
            <Briefcase size={18} />
            <span>포트폴리오</span>
          </a>
        </div>
      </div>

      <div className="profile-image-container">
        <img src="/team/hyeonsu-resume.jpeg" alt="프로필" className="profile-image" />
      </div>
    </section>
  );
}

function Skills() {
  const categories = [
    {
      title: 'PROFICIENT',
      skills: ['Java / Spring Boot', 'MySQL / MariaDB'],
    },
    {
      title: 'DEMONSTRATING',
      skills: ['Docker', 'AWS (EC2, RDS, ALB)', 'React / JavaScript', 'JPA', 'Git / GitHub', 'Redis'],
    },
    {
      title: 'BASIC',
      skills: ['MyBatis', 'Flutter'],
    },
  ];

  return (
    <div className="skills-list">
      {categories.map((cat) => (
        <div className="skill-row" key={cat.title}>
          <div className="skill-level">
            <span className="skill-title">{cat.title}</span>
          </div>
          <div className="tag-list">
            {cat.skills.map((skill) => (
              <span className="tag" key={skill}>
                {skill}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function Experience() {
  return (
    <div className="projects-container">
      <div className="project-card">
        <h3 className="project-title">
          신규 서비스 개발 <span className="project-role">엔코아</span>
        </h3>
        <div className="project-subtitle">2026.02 ~ </div>

        <div className="project-content">
          <div className="project-row">
            <div className="project-label">Role</div>
            <div className="project-desc">
              <ul>
                <li>B2B 신규 서비스 개발 담당</li>
                <li>사용자 플로우 기반 서비스 전 과정 설계 및 구현</li>
                <li>React + Spring 기반 풀스택 개발 수행 (API 설계·구현 포함)</li>
                <li>멀티 작업·DB 환경의 집계 정합성 정책 설계 및 대시보드 구현</li>
                <li>진행 과정을 사용자에게 실시간으로 전달하기 위해 SSE 기반 단방향 스트리밍 구조를 설계·구현</li>
                <li>기존 서비스 구조 분석을 통한 유지보수 프로세스 학습</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Projects() {
  return (
    <div className="projects-container">
      <div className="project-card">
        <h3 className="project-title">
          Claude Control <span className="project-role">개인 프로젝트 / Solo</span>
        </h3>
        <div className="project-subtitle">
          브라우저에서 원격 PC의 AI CLI(Claude Code · Codex)를 조작하는 웹 원격 제어 패널
        </div>

        <div className="project-content">
          <div className="project-row">
            <div className="project-label">소개</div>
            <div className="project-desc">
              <ul>
                <li>메인 PC에 설치된 AI 코딩 도구(Claude Code · Codex)를, 밖에서 다른 노트북이나 폰으로도 브라우저만 있으면 그대로 사용하기 위해 만든 개인용 원격 제어 도구</li>
                <li>윈도우 노트북 · 폰 · 태블릿 어디서든 접속해, 진행 중인 작업을 이어서 지시하고 결과를 실시간으로 확인</li>
                <li>Claude와 ChatGPT(Codex)를 한 화면에서 세션 단위로 전환하며 사용하고, 여러 계정도 나눠서 관리</li>
                <li>모든 대화가 자동 저장되어 다시 열면 그대로 복원되고, PC의 파일을 탐색해 작업 폴더를 고른 뒤 바로 새 작업을 시작</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="project-card">
        <h3 className="project-title">
          Content Engine <span className="project-role">개인 프로젝트 / Solo</span>
        </h3>
        <div className="project-subtitle">
          한국어 SNS용 글자 카드 · 캐러셀 이미지를 생성하는 콘텐츠 제작 도구
        </div>

        <div className="project-content">
          <div className="project-row">
            <div className="project-label">소개</div>
            <div className="project-desc">
              <ul>
                <li>문구만 입력하면 인스타그램 · 스레드에 올릴 글자 카드와 여러 장짜리 캐러셀 이미지를 자동으로 만들어 주는 개인 콘텐츠 제작 도구</li>
                <li>AI 이미지 생성과 달리 글자가 깨지지 않고 또렷하게 나오고, 한국어 줄바꿈 · 여백까지 다듬어 '템플릿 티' 없는 결과물을 제공</li>
                <li>색 · 서체 · 레이아웃 프리셋을 골라 원클릭으로 스타일을 바꾸고, 실시간 미리보기로 확인</li>
                <li>완성한 카드는 바로 저장하거나 이미지로 복사해 SNS에 업로드</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="project-card">
        <h3 className="project-title">
          I-Poten <span className="project-role">Fullstack 개발 / 팀장 (3인)</span>
        </h3>
        <div className="project-subtitle">
          2025.10 – 진행 중 |{' '}
          <a href="https://i-poten.com" target="_blank" rel="noopener noreferrer" className="project-link">
            https://i-poten.com
          </a>{' '}
          |{' '}
          <a
            href="https://play.google.com/store/apps/details?id=com.cygnus.i_poten_app"
            target="_blank"
            rel="noopener noreferrer"
            className="project-link"
          >
            Google Play
          </a>{' '}
          |{' '}
          <a
            href="https://apps.apple.com/kr/app/i-poten-ai-%EA%B0%9C%EB%B0%9C%EC%9E%90-%EB%A9%B4%EC%A0%91-%EC%BD%94%EC%B9%98/id6760929145"
            target="_blank"
            rel="noopener noreferrer"
            className="project-link"
          >
            App Store
          </a>{' '}
          |{' '}
          <a href="https://github.com/I-Cygnus" target="_blank" rel="noopener noreferrer" className="project-link">
            GitHub
          </a>{' '}
          |{' '}
          <a
            href="https://docs.google.com/presentation/d/12YWUWL9c0SISre9TtYxZrNucs6-bakej/edit?slide=id.p61#slide=id.p61"
            target="_blank"
            rel="noopener noreferrer"
            className="project-link"
          >
            개요
          </a>
          <br />
          AI 모의 면접, IT 용어 학습, 퀴즈·오답노트 기능을 갖춘 IT 취업 준비 플랫폼
        </div>

        <div className="project-content">
          <div className="project-row">
            <div className="project-label">Key Results</div>
            <div className="project-desc">
              <ul>
                <li>
                  세션 인증 구조에서 SPA 라우팅마다 발생하던 로그인 상태 조회를 HttpOnly 쿠키 기반 Nginx 차단 정책으로 처리
                  <ul>
                    <li>평균 응답 시간 약 2ms로 단축</li>
                  </ul>
                </li>
                <li>
                  Interceptor + 커스텀 어노테이션 + ArgumentResolver로 인증 파이프라인을 구현
                  <ul>
                    <li>컨트롤러 71곳의 인증 로직 제거, 공개·내부 호출·사용자 요청을 어노테이션으로 명시화</li>
                  </ul>
                </li>
                <li>
                  면접 종류와 질문 순서를 Strategy 패턴으로 분리하고 Spring Bean 이름으로 매핑
                  <ul>
                    <li>분기문 없이 클래스만 추가하면 확장되는 구조 설계 및 구현</li>
                  </ul>
                </li>
                <li>
                  Spring(오케스트레이션) ↔ FastAPI(AI 추론) 분리 구성
                  <ul>
                    <li>AI 추론 작업이 Spring 스레드를 점유하던 상황 개선</li>
                  </ul>
                </li>
                <li>
                  약 60여 개 도메인 피처 단위로 패키지 수직 분할, 계층 분리
                  <ul>
                    <li>팀원 간 병렬 개발 시 충돌 최소화</li>
                  </ul>
                </li>
                <li>Spring · FastAPI · Frontend 멀티 컨테이너로 구성, Docker + GitHub Actions로 배포 자동화</li>
                <li>
                  PM 부재 환경에서 스크럼 리드
                  <ul>
                    <li>약 500여 개 백로그 관리 및 매일 스프린트 플래닝 주도</li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="project-card">
        <h3 className="project-title">
          I-Fence (Core-Sync) <span className="project-role">End-to-End / Solo</span>
        </h3>
        <div className="project-subtitle">
          2025.09 ~ 2025.10 |{' '}
          <a href="https://github.com/I-Cygnus" target="_blank" rel="noopener noreferrer" className="project-link">
            GitHub
          </a>{' '}
          |{' '}
          <a
            href="https://docs.google.com/presentation/d/1Bb_VQojOtseq6GtjVtz6_Fsn3xMA42rm/edit?slide=id.p14#slide=id.p14"
            target="_blank"
            rel="noopener noreferrer"
            className="project-link"
          >
            개요
          </a>
          <br />
          Agile 프로세스 + HR기반 협업 툴
        </div>

        <div className="project-content">
          <div className="project-row">
            <div className="project-label">Key Results</div>
            <div className="project-desc">
              <ul>
                <li>팀에서 사용하는 협업툴 I-Fence를 백/프론트/인프라/AI 전부 직접 만들어 배포</li>
                <li>실제 운영을 위해 Spring Boot MSA 3개 서비스를 단일 모노로 재설계</li>
                <li>커밋 → AI → 백로그 자동 작성, 티켓 ↔ 커밋 양방향 매핑으로 업무-코드 추적성 확보</li>
                <li>
                  백로그 작성 시 또는 작성 후 Git 커밋을 기반으로 AI가 자동으로 '변경점·기능·버그·다음단계' 구조의 백로그 문서를 작성해주는 AI 파이프라인 설계
                </li>
                <li>
                  데일리스크럼·백로그·스프린트 등 애자일 프로세스를 실제 운용 가능한 도구로 프레임워크화
                  <ul>
                    <li>팀이 매일 쓰는 실전 프레임워크로 구현 — 칸반 7단계 상태(백로그→스프린트→진행→리뷰→완료) + 회의 관리 + AI 백로그 자동화를 유기적으로 연동</li>
                  </ul>
                </li>
                <li>
                  팀원별 회의 일정·출퇴근·연차·업무를 한 플랫폼에서 통합 관리하는 구조를 설계
                  <ul>
                    <li>'누가 언제 뭘 하는지' 공유 비용이 사라지며 실사용 중인 2인 팀의 협업 속도 실질 개선</li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="project-card">
        <h3 className="project-title">
          TTP (Time To Play) <span className="project-role">End-to-End / Solo</span>
        </h3>
        <div className="project-subtitle">
          2024.11 ~ 2025.02 |{' '}
          <a
            href="https://three-yarrow-9df.notion.site/TTP-project-194a23f0db9b806f8f7bf015def3f98c?source=copy_link"
            target="_blank"
            rel="noopener noreferrer"
            className="project-link"
          >
            개요 및 소개
          </a>
          <br />
          간단한 미니게임과 웹소켓 기반의 실시간 멀티플레이 게임 플랫폼
        </div>

        <div className="project-content">
          <div className="project-row">
            <div className="project-label">Key Results</div>
            <div className="project-desc">
              <ul>
                <li>실 사용자 220명 달성</li>
                <li>
                  WebSocket 기반 실시간 멀티플레이 구조 설계·구현
                  <ul>
                    <li>브라우저 ID 기반 사용자 간 상태 동기화, 불필요한 연결 정리로 안정성 개선</li>
                  </ul>
                </li>
                <li>
                  End-to-End 개발 경험
                  <ul>
                    <li>기획부터 개발, 배포, 개선까지 전 과정 수행</li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="project-card">
        <h3 className="project-title">
          IntellyCosm <span className="project-role">Full-stack / 팀장 (2인)</span>
        </h3>
        <div className="project-subtitle">
          2024.03 ~ 2024.07
          <br />
          AI(OCR+LLM) 기반 화장품 성분 분석 및 맞춤 추천 플랫폼
        </div>

        <div className="project-content">
          <div className="project-row">
            <div className="project-label">Key Results</div>
            <div className="project-desc">
              <ul>
                <li>화장품 성분표 사진을 찍으면 AI가 성분을 읽고 내 피부에 맞는지 점수로 알려주는 AI 백엔드 시스템 개발</li>
                <li>Java ↔ Python 프로세스 연동으로 AI 파이프라인 구축 (JSON 기반 데이터 교환)</li>
                <li>
                  약 2만 건 규모 성분사전의 반복 조회 패턴을 분석하여 Redis 캐싱 레이어 도입
                  <ul>
                    <li>캐시 적중률 약 88%, 평균 응답 시간 120ms → 11ms (약 91% 단축), DB 조회 요청 약 88% 감소</li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Education() {
  return (
    <div className="education-container">
      <section className="edu-section">
        <h2 className="edu-title">학력</h2>
        <div className="edu-list">
          <div className="edu-row">
            <div className="edu-info">
              <span className="edu-school">가천대학교 (편입) · 컴퓨터공학과</span>
              <span className="edu-score">3.87 / 4.5</span>
            </div>
            <div className="edu-date">2023.03 – 2025.02</div>
          </div>
          <div className="edu-row">
            <div className="edu-info">
              <span className="edu-school">군산대학교 · 소프트웨어공학과</span>
              <span className="edu-score">4.03 / 4.5</span>
            </div>
            <div className="edu-date">2018.03 – 2020.02</div>
          </div>
        </div>
      </section>

      <section className="edu-section">
        <h2 className="edu-title">교육</h2>
        <div className="edu-list">
          <div className="edu-bullet-row">
            <ul>
              <li>플레이데이터평생교육원 풀스택 백엔드 개발자 양성 과정 | 2025.04 - 2025.10 수료</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
