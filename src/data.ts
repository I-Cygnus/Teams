export type MemberId = 'hyeonsu' | 'member-b' | 'member-c';
export type Gender = 'male' | 'female';

export interface Project {
  id: string;
  title: string;
  period: string;
  role: string;
  summary: string;
  tags: string[];
}

export interface TeamMember {
  id: MemberId;
  name: string;
  role: string;
  gender: Gender;
  tagline: string;
  taglineExt: string;
  brief: string;
  bio: string;
  tags: string[];
  quote: string;
  accent: string;
  image?: string;
  projects: Project[];
}

export const teamMembers: TeamMember[] = [
  {
    id: 'hyeonsu',
    name: '최현수',
    role: 'Frontend Developer',
    gender: 'male',
    tagline: '경험을 설계하는 개발자',
    taglineExt: ' — 픽셀과 밀리초 사이에서 감도를 다듬는 사람.',
    brief: '사용자 경험에 집착하는 프론트엔드 개발자',
    bio: '매끄러운 인터랙션과 성능 최적화를 통해 "느껴지는" 품질을 만듭니다. 코드는 결국 사용자를 위해 존재한다고 믿으며, 기술적 완성도와 사용자 경험 사이의 균형을 찾아갑니다.',
    tags: ['React', 'TypeScript', 'Animation', 'Performance'],
    quote: '코드는 결국 사용자를 위해 존재합니다.',
    accent: '#4C6EF5',
    image: '/team/hyeonsu.png',
    projects: [
      {
        id: 'cygnus-web',
        title: 'Team Cygnus 웹사이트',
        period: '2025',
        role: 'Lead Frontend',
        summary: 'Framer Motion 기반의 유기적 인터랙션과 공유 레이아웃 트랜지션으로 팀 아이덴티티를 웹으로 구현.',
        tags: ['React', 'TypeScript', 'Framer Motion', 'Tailwind'],
      },
      {
        id: 'realtime-dashboard',
        title: '실시간 관제 대시보드',
        period: '2024',
        role: 'Frontend Engineer',
        summary: '초당 수백 건의 이벤트를 렌더링 지연 없이 가시화한 실시간 모니터링 UI. LCP 0.8초 달성.',
        tags: ['React', 'WebSocket', 'Canvas', 'Optimization'],
      },
      {
        id: 'design-system',
        title: '사내 디자인 시스템 구축',
        period: '2024',
        role: 'Design Engineer',
        summary: '30+ 컴포넌트 토큰화, Figma-Code 동기화 파이프라인을 설계해 디자인 핸드오프 비용 60% 절감.',
        tags: ['Design System', 'Storybook', 'Tokens'],
      },
    ],
  },
  {
    id: 'member-b',
    name: '팀원 B',
    role: 'Product Designer',
    gender: 'male',
    tagline: '문제를 시각 언어로 바꾸는 디자이너',
    taglineExt: ' — 감각적인 결정을 논리로 설명하는 시선.',
    brief: '문제를 시각적 해결책으로 번역하는 디자이너',
    bio: '심미성과 사용성 사이에서 최적의 균형점을 찾아내며, 사용자가 의식하지 못하는 수준의 자연스러운 경험을 설계합니다. 아름다움은 기능을 따라간다고 믿습니다.',
    tags: ['Figma', 'Prototyping', 'Design System', 'User Research'],
    quote: '아름다움은 기능을 따라갑니다.',
    accent: '#F59E0B',
    projects: [
      {
        id: 'cygnus-brand',
        title: 'Team Cygnus 브랜드 시스템',
        period: '2025',
        role: 'Brand Designer',
        summary: '"시골쥐 × 서울쥐"의 대비를 모티브로 한 타이포그래피와 컬러 팔레트, 모션 가이드라인 정의.',
        tags: ['Brand', 'Typography', 'Motion Guide'],
      },
      {
        id: 'onboarding-redesign',
        title: 'B2B SaaS 온보딩 리디자인',
        period: '2024',
        role: 'Product Designer',
        summary: '6단계 가입 플로우를 3단계로 압축하고 컨텍스트 기반 튜토리얼 도입, 첫 주 활성화율 2.1배.',
        tags: ['UX', 'Onboarding', 'A/B Test'],
      },
    ],
  },
  {
    id: 'member-c',
    name: '팀원 C',
    role: 'PM · Strategist',
    gender: 'female',
    tagline: '데이터와 공감으로 길을 찾는 전략가',
    taglineExt: ' — 숫자와 이야기 사이에서 팀의 방향을 설계하는.',
    brief: '데이터로 이야기하고 공감으로 설계하는 전략가',
    bio: '팀의 방향을 잡고 사용자의 목소리를 제품에 담습니다. 좋은 기획은 좋은 질문에서 시작된다는 철학으로, 끊임없이 묻고 검증합니다.',
    tags: ['Strategy', 'User Research', 'Data Analysis', 'Agile'],
    quote: '좋은 기획은 좋은 질문에서 시작됩니다.',
    accent: '#8B5CF6',
    projects: [
      {
        id: 'roadmap-2025',
        title: '2025 프로덕트 로드맵',
        period: '2025',
        role: 'Product Strategy',
        summary: '3개 분기에 걸친 OKR 설계와 우선순위 프레임워크를 수립, 팀의 집중도와 실행 속도를 동시에 높임.',
        tags: ['Strategy', 'OKR', 'Roadmap'],
      },
      {
        id: 'user-insight',
        title: '사용자 인사이트 리서치',
        period: '2024',
        role: 'Research Lead',
        summary: '심층 인터뷰 24회 + 정량 분석을 결합, 핵심 페르소나 3종을 정의하고 제품 방향을 재정렬.',
        tags: ['Research', 'Interview', 'Persona'],
      },
      {
        id: 'process-reform',
        title: '프로세스 개선 프로젝트',
        period: '2024',
        role: 'Program Manager',
        summary: '재작업률 30% → 8%로 낮춘 커뮤니케이션 구조 재설계. 스프린트 완료율 90% 달성.',
        tags: ['Process', 'Agile', 'Communication'],
      },
    ],
  },
];

export type BlogCategory = 'Frontend' | 'Design' | 'Product' | 'Culture' | 'Backend';

export type BlogPackage = 'choi' | 'common';

export interface BlogBlock {
  type: 'h2' | 'h3' | 'p' | 'quote' | 'list' | 'code' | 'table' | 'hr';
  text?: string;
  items?: string[];
  language?: string;
  headers?: string[];
  rows?: string[][];
}

export interface BlogAuthorOverride {
  name: string;
  role: string;
  accent: string;
}

export interface BlogPost {
  id: string;
  package: BlogPackage;
  title: string;
  excerpt: string;
  category: BlogCategory;
  authorId?: MemberId;
  authorOverride?: BlogAuthorOverride;
  publishedAt: string;
  readingMinutes: number;
  cover: string;
  tags: string[];
  body: BlogBlock[];
}

export const troubleshootings = [
  {
    id: 'loading-optimization',
    category: '성능 최적화',
    title: '초기 로딩 속도 3초 → 0.8초',
    summary: '번들 사이즈 비대화로 인한 사용자 이탈 문제를 근본적으로 해결한 과정',
    problem:
      '프로젝트 초기, 번들 사이즈가 비대해지면서 첫 로딩에 3초 이상이 소요되었습니다. 라이트하우스 분석 결과 LCP 3.2초, 불필요한 라이브러리 포함과 이미지 미최적화가 원인이었습니다.',
    solution:
      'Tree shaking과 Code splitting을 적용하고, 이미지를 WebP로 전환. Critical CSS 인라인화와 폰트 로딩 최적화를 병행했습니다.',
    result:
      'LCP 0.8초 달성, 라이트하우스 성능 점수 94점. 사용자 이탈률 40% 감소.',
  },
  {
    id: 'design-system',
    category: '디자인 시스템',
    title: 'UI 일관성 붕괴 → 토큰 기반 시스템 구축',
    summary: '팀원마다 다른 스타일을 사용하던 혼란을 디자인 시스템으로 정리한 이야기',
    problem:
      '12개의 버튼 스타일, 5가지 다른 색상 팔레트가 공존. 새 화면을 만들 때마다 "어떤 스타일을 따라야 하지?"라는 질문이 반복되었습니다.',
    solution:
      'Color, Typography, Spacing 토큰을 정의하고 Figma와 코드 양쪽에서 동기화되는 단일 소스(Single Source of Truth)를 구축했습니다.',
    result:
      '디자인 핸드오프 시간 60% 단축, UI 버그 리포트 70% 감소, 새 화면 제작 속도 2배 향상.',
  },
  {
    id: 'communication',
    category: '프로세스 개선',
    title: '재작업률 30% → 8%로 감소',
    summary: '기획-디자인-개발 간 커뮤니케이션 병목을 구조적으로 해소한 방법',
    problem:
      '비동기 커뮤니케이션으로 요구사항 누락과 재작업이 빈번. 한 스프린트에서 전체 업무의 30%가 재작업이었습니다.',
    solution:
      '데일리 싱크 15분 구조화, 피그마 코멘트 + 깃허브 이슈 연동 워크플로우 도입, ADR 문서화 문화를 정착시켰습니다.',
    result:
      '재작업률 30% → 8%, 스프린트 완료율 65% → 90%.',
  },
];
