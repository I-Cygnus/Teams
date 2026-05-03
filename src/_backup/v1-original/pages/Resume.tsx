import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Phone, Mail, Code, ExternalLink, Printer } from 'lucide-react';
import Memoji from '../components/Memoji';

const ease = [0.22, 1, 0.36, 1] as const;
const ACCENT = '#4C6EF5';

const fade = {
  hidden: { opacity: 0, y: 18 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.06, ease },
  }),
};

type Project = {
  title: string;
  subtitle?: string;
  period: string;
  link?: string;
  stack: string[];
  bullets: string[];
};

const projects: Project[] = [
  {
    title: 'I-Poten (Job-Spoon)',
    period: '2025.08 ~ 2026.02',
    link: 'https://i-poten.com',
    stack: ['Spring Boot', 'Redis', 'AWS', 'FastAPI', 'JPA', 'MFE', 'Django', 'React', 'CloudFront', 'OAuth2.0'],
    bullets: [
      'DDD 기반 도메인 중심 설계 Spring 기반 API 구현',
      'PM 부재 환경에서 500여 개 백로그 관리 및 스프린트 플래닝 주도',
      'RAG + Agent 기반 AI 면접 파이프라인 설계 및 구현',
      '멀티 컨테이너 아키텍처 구축 (Spring · FastAPI · Frontend)',
      'Django → Spring Boot 전환 및 도메인 구조 재설계',
      'Spring Security 없이 Interceptor + 커스텀 어노테이션으로 인증 파이프라인 구현',
      'HttpOnly 쿠키 특성을 활용한 Nginx 레벨 차단 정책 설계·적용 — 인증 트래픽 약 90% 감소, 응답 시간 ~200ms → <1ms',
      'OAuth2 기반 6개 소셜 로그인 (Google · Kakao · Naver · GitHub · Apple · Meta)',
      'AWS · Docker · CI/CD 기반 서비스 배포 및 운영',
      'Spring 반복 폴링 → FastAPI · SES 비동기 알림 전환으로 서버 리소스 절감',
    ],
  },
  {
    title: 'I-Fence (Core-Sync)',
    subtitle: 'HR + Agile 협업 툴, Cygnus 팀이 실제로 사용 중인 협업 플랫폼',
    period: '2025.10.10 ~ 2025.10.23',
    stack: ['Spring Boot', 'Redis', 'AWS', 'WebSocket', 'JPA', 'React'],
    bullets: [
      '프로젝트 A–Z 전 과정 수행 및 REST API 구축',
      'Notion 기반 애자일 프로세스와 협업 환경을 직접 구현',
      'MSA 구조 → 모노 기반 전환 후 실제 서비스 배포 · 팀 내 사용',
      'AWS Route53, CloudFront, ALB, S3, EC2 기반 HTTPS 실도메인 배포',
      '부트캠프 최단기간 · 최소인원 최우수 프로젝트 선정',
    ],
  },
  {
    title: 'TTP (Time To Play)',
    subtitle: '웹소켓 기반 실시간 멀티플레이 게임 플랫폼 · 개인 프로젝트',
    period: '2024.11 ~ 진행중',
    stack: ['Spring Boot', 'Redis', 'AWS', 'WebSocket', 'JPA', 'React'],
    bullets: [
      '실 사용자 140명 달성',
      'WebSocket 기반 실시간 멀티 게임 상호작용 구조 설계 및 구현',
      '콘텐츠 생성 · 게임 · 통계까지 단일 사용자 흐름으로 연결',
      '브라우저 ID 기반 사용자 간 실시간 상태 동기화 안정화',
      '웹소켓 최적화로 불필요한 연결 감소 및 성능 개선',
      'End-to-End: 기획 · 개발 · 배포 · 개선 전 과정 수행',
    ],
  },
  {
    title: 'IntellyCosm',
    subtitle: 'AI 기반 화장품 성분 분석 및 맞춤 추천 플랫폼',
    period: '2024.03 ~ 2024.06',
    stack: ['Spring Boot', 'JPA', 'MySQL', 'Redis', 'AWS', 'Kafka', 'React'],
    bullets: [
      'Java 백엔드 ↔ Python AI 스크립트 ↔ OpenAI API AI 파이프라인 구축',
      '피부 타입별 성분 적합도 점수 알고리즘 설계',
      '배치 크기 / 스레드 수 조합 테스트로 처리량 2.4배 향상',
      'Redis TTL 차별화 + 캐시 무효화 정책 설계',
      'Auto Scaling + ALB + RDS + ElastiCache 기반 AWS 인프라 운영',
      '전체 76개 REST API Spec 설계 및 구현',
      'Python 기반 OCR 모듈 통합, 대량 성분 데이터 Redis 캐싱 레이어 도입',
    ],
  },
];

const education = [
  {
    school: '가천대학교 (편입)',
    major: '컴퓨터공학과 · 학사',
    period: '2023.03 ~ 2025.02',
    gpa: '3.87 / 4.5',
  },
  {
    school: '군산대학교',
    major: '소프트웨어공학과 · 학사',
    period: '2018.03 ~ 2020.02',
    gpa: '4.03 / 4.5',
  },
  {
    school: '엔코아 플레이데이터',
    major: '풀스택 개발자 양성과정 10회차',
    period: '2025.04 ~ 2025.10 수료',
  },
];

const about = [
  {
    heading: '저는 이런 사람이에요',
    body: [
      '어릴 때부터 선택과 책임을 중요하게 생각하며, 스스로 길을 찾고 만들어가는 삶을 살아왔습니다. 학원이나 과외 없이 방법을 고민하고 직접 실행하며 성장했고, 그 과정에서 얻은 경험들이 지금의 저를 만들었습니다. 정해진 방식에 의존하지 않고 스스로 해결해 나가는 힘을 기를 수 있었습니다.',
      '20살부터는 등록금과 생활비를 스스로 해결해왔습니다. 조금 다른 길을 걸으며 어려움도 겪었지만, 그 경험 덕분에 누구보다 당당하고 강한 마음을 가질 수 있었습니다. 스스로 선택한 길에 책임을 지는 것이 결국 저를 더 단단하게 만들었다고 생각합니다.',
      '저는 새로운 도전을 즐깁니다. 실패를 두려워하지 않으며, 작은 성공들이 쌓여 큰 변화를 만든다고 믿습니다. 편입, 대학 우수 프로젝트 선정, 교내 프로젝트 심사위원 개인 초청까지 — 하나하나의 성취가 더 큰 도약의 발판이 되었습니다.',
    ],
  },
  {
    heading: '저는 이렇게 어려움을 해결해나가요',
    body: [
      '프로젝트를 진행하며 팀워크와 리더십의 어려움을 직접 경험하고, 이를 극복하기 위해 노력해왔습니다. 초기 프로젝트에서 리더로서 일정 계획과 업무 분배를 맡았지만, 참여도 낮은 팀원들로 인해 진행이 지연되는 상황이 있었습니다. 포기할 수 없었던 저는 부족한 부분을 직접 메우기 위해 새로운 기술을 익히고 밤을 새워 개발을 완수했고, 좋은 평가를 받을 수 있었습니다.',
      '이후 『장사의 신』을 비롯한 리더십 서적과 조언을 참고하며 "사람에게 주인의식을 느끼게 하는 것"의 중요성을 깨달았습니다. 내가 만드는 서비스에 애정을 가지는 태도가 당연한 것이 아니라 저의 강점임을 인식하게 되었고, 이를 팀원들과 공유하며 모두가 주인의식을 가질 수 있도록 이끄는 리더십의 중요성을 이해하게 되었습니다.',
      'I-Poten 등 이후 프로젝트에서는 프로젝트 핵심 목표와 필수 기능을 명확히 정의하고, 서비스 관점에서 정기적으로 논의하는 시간을 마련했습니다. 아이디어 → 구현 → 사용자 관점 개선 → 기술적 개선의 플로우로 진행하며, 팀원들이 개인 성과가 아닌 서비스 완성도와 사용자 경험을 최우선으로 고려하도록 유도했습니다.',
    ],
  },
  {
    heading: '저는 이렇게 성장해요',
    body: [
      '여러 서비스를 직접 만들며 제게 가장 부족한 부분이 협업·소통·기초라는 것을 깨달았습니다. 항상 혼자 공부하던 저는, 누군가에게 배우고 평가받으며 함께 성장하고 싶었고, 이를 위해 엔코아 부트캠프에 참여했습니다.',
      '부트캠프에서 4번의 팀 프로젝트에서 팀장을 맡으며 많은 호평을 받았고, 별도로 동료들과 진행한 프로젝트에서는 팔로워로서의 연구·협업을 경험하며 균형 잡힌 역량을 쌓았습니다. 서비스 완성에만 급급하지 않고 백로그 관리와 코드 리뷰를 통해 코드 품질과 재사용성을 높이는 법을 배웠습니다.',
      '또한 Eddi 개발자 그룹에서 매일 평균 다섯 건 이상의 질문과 토론을 이어가며, 선생님·선배 개발자분들에게 배우는 과정은 제게 큰 즐거움과 빠른 성장을 가능하게 했습니다.',
      '저는 단순히 개발자가 되는 것을 넘어, 인정받고 누군가에게 인사이트를 줄 수 있는 개발자로 성장하기 위해 앞으로도 꾸준히 배우고 도전할 것입니다.',
    ],
  },
];

export default function Resume() {
  return (
    <div className="pt-24 sm:pt-28 pb-32 px-6 bg-[#fafafa]">
      <div className="max-w-3xl mx-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-14 print:hidden">
          <motion.div initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, ease }}>
            <Link
              to="/team/hyeonsu"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#999] hover:text-[#111] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> 프로필로 돌아가기
            </Link>
          </motion.div>
          <motion.button
            type="button"
            onClick={() => window.print()}
            initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, ease }}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#555] hover:text-[#111] px-3 py-1.5 rounded-md border border-[#e5e5e5] hover:border-[#ccc] bg-white transition-colors"
          >
            <Printer className="w-3.5 h-3.5" /> 인쇄 · PDF 저장
          </motion.button>
        </div>

        {/* Header */}
        <motion.header
          initial="hidden" animate="visible" custom={0} variants={fade}
          className="relative mb-16 sm:mb-20"
        >
          <div className="flex flex-col sm:flex-row sm:items-end gap-8">
            <div className="flex-shrink-0 mx-auto sm:mx-0">
              <Memoji id="hyeonsu" size={120} />
            </div>
            <div className="flex-1 min-w-0 text-center sm:text-left">
              <p className="text-[11px] font-medium tracking-[0.28em] uppercase mb-3" style={{ color: ACCENT }}>
                Resume
              </p>
              <h1 className="text-[clamp(2.25rem,5vw,3.25rem)] font-bold tracking-tight leading-[1.05] text-[#0b0b0d] mb-2">
                최현수
              </h1>
              <p className="text-base text-[#555] font-medium mb-4">Backend Developer</p>
              <p className="text-sm text-[#888] font-mono tracking-tight" style={{ fontStyle: 'italic' }}>
                <span style={{ color: ACCENT }}>{'<>'}</span> 이유를 찾고 이유를 만들어가는 개발자 <span style={{ color: ACCENT }}>{'</>'}</span>
              </p>
            </div>
          </div>

          {/* Contact row */}
          <motion.div
            initial="hidden" animate="visible" custom={1} variants={fade}
            className="mt-10 pt-8 border-t border-[#ececec] grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm"
          >
            <ContactItem icon={<Phone className="w-3.5 h-3.5" />} label="Phone" value="010-2651-9025" />
            <ContactItem icon={<Mail className="w-3.5 h-3.5" />} label="Email" value="gustn9025@naver.com" href="mailto:gustn9025@naver.com" />
            <ContactItem icon={<Code className="w-3.5 h-3.5" />} label="Channel" value="GitHub · Notion · Portfolio" />
          </motion.div>
        </motion.header>

        {/* Intro */}
        <motion.section initial="hidden" animate="visible" custom={2} variants={fade} className="mb-20">
          <div className="space-y-5 text-[15px] text-[#444] leading-[1.85]">
            <p>
              사용자 관점에서 문제를 바라보고 개선을 고민하는 개발자 <strong className="text-[#111]">최현수</strong>입니다.
              다양한 생각과 기술을 수용하는 자세로 배우며, 이유를 찾고 더 나아가 <em className="not-italic" style={{ color: ACCENT }}>이유를 만드는 개발자</em>가 되고 싶습니다.
            </p>
            <p>
              MAU 100+ 규모 서비스를 기획 · 디자인 · 개발 · 팀 운영까지 함께하며 성장시키고 있습니다.
              현재는 B2B 환경의 데이터 보안 신규 서비스 MVP 개발을 담당하며, 사용자 플로우 기반으로 데이터 탐지부터 결과 시각화까지의 전 과정을 설계하고 구현하고 있습니다.
            </p>
          </div>
        </motion.section>

        {/* Skills */}
        <Section title="Skills" index={3}>
          <div className="space-y-6">
            <SkillGroup label="Main" items={['Java', 'Spring', 'MySQL (MariaDB)', 'JPA', 'MyBatis']} strong />
            <SkillGroup
              label="Knowledgeable"
              items={['JavaScript', 'React', 'AWS · CloudFront · RDS · EC2 · ALB · Route53', 'Redis', 'Docker', 'Flutter']}
            />
          </div>
        </Section>

        {/* Current */}
        <Section title="Current" index={4}>
          <div className="rounded-2xl border border-[#ececec] bg-white p-6 sm:p-7">
            <p className="text-[11px] font-medium tracking-[0.22em] uppercase mb-3" style={{ color: ACCENT }}>
              B2B · 데이터 보안 신규 서비스 MVP
            </p>
            <ul className="space-y-2 text-sm text-[#555] leading-relaxed">
              {[
                '사용자 플로우 기반 전 과정 설계 및 구현',
                'React + Spring 기반 백엔드 API 설계 · 개발 포함 풀스택 수행',
                '검출 결과를 직관적으로 전달하기 위한 대시보드 및 리포트 개발',
                '기존 서비스 구조를 분석하며 유지보수 프로세스를 학습',
              ].map((t) => (
                <li key={t} className="flex gap-2">
                  <span className="flex-shrink-0 mt-2 w-1 h-1 rounded-full" style={{ background: ACCENT }} />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </Section>

        {/* Projects */}
        <Section title="Projects" index={5}>
          <div className="space-y-5">
            {projects.map((p, i) => (
              <motion.article
                key={p.title}
                initial="hidden" animate="visible" custom={6 + i} variants={fade}
                className="relative rounded-2xl border border-[#ececec] bg-white p-6 sm:p-7"
              >
                <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold tracking-tight text-[#111]">{p.title}</h3>
                      {p.link && (
                        <a
                          href={p.link}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-0.5 text-[11px] text-[#888] hover:text-[#111] transition-colors"
                        >
                          {p.link.replace(/^https?:\/\//, '')} <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                    </div>
                    {p.subtitle && <p className="text-xs text-[#888] leading-relaxed">{p.subtitle}</p>}
                  </div>
                  <span className="text-[11px] font-medium text-[#aaa] tracking-tight whitespace-nowrap">{p.period}</span>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-5">
                  {p.stack.map((s) => (
                    <span
                      key={s}
                      className="text-[10px] font-medium text-[#666] px-2 py-0.5 rounded-full bg-[#f4f4f6]"
                    >
                      #{s}
                    </span>
                  ))}
                </div>

                <ul className="space-y-1.5 text-sm text-[#555] leading-relaxed">
                  {p.bullets.map((b) => (
                    <li key={b} className="flex gap-2.5">
                      <span className="flex-shrink-0 text-[#ccc] leading-relaxed">—</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </motion.article>
            ))}
          </div>
        </Section>

        {/* Education */}
        <Section title="Education" index={10}>
          <div className="divide-y divide-[#ececec] border-y border-[#ececec]">
            {education.map((e) => (
              <div key={e.school} className="py-5 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                <div>
                  <h3 className="text-base font-semibold text-[#111]">
                    {e.school}
                    {e.gpa && <span className="ml-2 text-xs font-medium text-[#888]">{e.gpa}</span>}
                  </h3>
                  <p className="text-sm text-[#777]">{e.major}</p>
                </div>
                <span className="text-[11px] font-medium text-[#aaa] tracking-tight whitespace-nowrap">{e.period}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* About / self-intro */}
        <Section title="About" index={11}>
          <div className="space-y-12">
            {about.map((a) => (
              <div key={a.heading}>
                <h3 className="text-lg font-bold tracking-tight text-[#111] mb-5 flex items-center gap-2">
                  <span className="inline-block w-1 h-4 rounded-full" style={{ background: ACCENT }} />
                  {a.heading}
                </h3>
                <div className="space-y-4 text-[15px] text-[#555] leading-[1.85] pl-3">
                  {a.body.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Footer */}
        <motion.div
          initial="hidden" animate="visible" custom={14} variants={fade}
          className="mt-24 pt-10 border-t border-[#ececec] text-center"
        >
          <p className="text-xs text-[#aaa]">
            읽어주셔서 감사합니다. <span style={{ color: ACCENT }}>—</span> 최현수
          </p>
        </motion.div>
      </div>
    </div>
  );
}

function Section({ title, index, children }: { title: string; index: number; children: React.ReactNode }) {
  return (
    <motion.section
      initial="hidden" animate="visible" custom={index} variants={fade}
      className="mb-20"
    >
      <div className="flex items-baseline justify-between mb-8">
        <h2 className="text-[11px] font-medium tracking-[0.32em] uppercase text-[#999]">{title}</h2>
        <div className="flex-1 ml-5 h-px bg-[#ececec]" />
      </div>
      {children}
    </motion.section>
  );
}

function SkillGroup({ label, items, strong }: { label: string; items: string[]; strong?: boolean }) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
      <div className="sm:w-32 flex-shrink-0">
        <span className="text-[11px] font-medium tracking-[0.22em] uppercase text-[#999]">{label}</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {items.map((s) => (
          <span
            key={s}
            className={`text-xs px-2.5 py-1 rounded-full ${
              strong ? 'bg-[#111] text-white font-medium' : 'bg-white border border-[#e5e5e5] text-[#555]'
            }`}
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}

function ContactItem({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <div className="flex items-start gap-2.5">
      <div className="mt-0.5 text-[#aaa]">{icon}</div>
      <div className="min-w-0">
        <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-[#aaa] mb-0.5">{label}</p>
        <p className="text-sm text-[#333] truncate">{value}</p>
      </div>
    </div>
  );
  if (href) {
    return (
      <a href={href} className="hover:opacity-70 transition-opacity">
        {content}
      </a>
    );
  }
  return content;
}
