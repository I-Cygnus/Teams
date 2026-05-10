export type MemberId = 'hyeonsu' | 'member-b' | 'min';
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
    id: 'min',
    name: 'min',
    role: 'Fullstack Developer',
    gender: 'female',
    tagline: '아이디어와 구현 사이를 잇는 개발자',
    taglineExt: ' — 기획의 흐름을 코드와 데이터로 연결하는 사람.',
    brief: '서비스 흐름을 이해하고 직접 구현하는 풀스택 개발자',
    bio: '콘텐츠 기획과 운영 경험을 바탕으로 사용자의 흐름과 서비스 정책을 이해하고, 이를 실제 기능과 데이터 구조로 구현하는 개발자입니다.',
    tags: ['Java', 'Spring Boot', 'JPA', 'MySQL', 'React', 'TypeScript'],
    quote: '좋은 서비스는 사용자의 흐름을 이해하는 것에서 시작됩니다.',
    accent: '#8B5CF6',
    projects: [
      {
        id: 'ipoten-learning-platform',
        title: 'I-Poten 학습 플랫폼',
        period: '2025',
        role: 'Fullstack Developer',
        summary: 'IT 개발자 취업 준비생을 위한 학습 플랫폼에서 용어 검색, 개인 단어장 저장, 복습, 퀴즈 기능을 구현하며 화면과 API, 데이터베이스 흐름을 연결했습니다.',
        tags: ['Spring Boot', 'JPA', 'MySQL', 'React', 'TypeScript'],
      },
      {
        id: 'potenword-domain',
        title: 'PotenWord 용어 도메인',
        period: '2025',
        role: 'Backend Developer',
        summary: '약 4만 개 이상의 IT 용어 데이터를 카테고리별로 관리하고, 사용자가 필요한 용어를 검색해 개인 단어장에 저장할 수 있도록 Term, Category, Wordbook 관련 도메인 흐름을 구현했습니다.',
        tags: ['Domain Modeling', 'JPA', 'MySQL', 'REST API'],
      },
      {
        id: 'potenquiz-flow',
        title: 'PotenQuiz 퀴즈 기능',
        period: '2025',
        role: 'Fullstack Developer',
        summary: '저장한 용어와 학습 데이터를 바탕으로 퀴즈를 풀고 복습할 수 있는 기능을 구현했습니다. 오늘의 퀴즈, 객관식·OX·초성 문제, 오답 복습 흐름을 통해 사용자가 학습한 개념을 다시 확인할 수 있도록 구성했습니다.',
        tags: ['Quiz', 'Learning Flow', 'Session', 'Review'],
      },
      {
        id: 'wordbook-save-flow',
        title: '개인 단어장 저장 기능 개선',
        period: '2025',
        role: 'Backend Developer',
        summary: '같은 용어를 서로 다른 단어장에 저장할 때 발생하던 중복 판단 문제를 SQL 데이터 확인과 제약조건 재설계를 통해 해결했습니다.',
        tags: ['Troubleshooting', 'SQL', 'Constraint', 'Data Flow'],
      },
    ],
  }
];

export type BlogCategory = 'Frontend' | 'Design' | 'Product' | 'Culture' | 'Backend';

export interface BlogBlock {
  type: 'h2' | 'p' | 'quote' | 'list';
  text?: string;
  items?: string[];
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: BlogCategory;
  authorId: MemberId;
  publishedAt: string;
  readingMinutes: number;
  cover: string;
  tags: string[];
  body: BlogBlock[];
}

export const blogPosts: BlogPost[] = [
  {
    id: 'react-19-transitions',
    title: 'React 19의 useTransition으로 다듬은 페이지 전환',
    excerpt:
      '레이아웃 점프와 깜빡임을 없애기 위해 라우팅 단위에 useTransition을 적용하면서 배운 것들을 정리합니다.',
    category: 'Frontend',
    authorId: 'hyeonsu',
    publishedAt: '2025-04-12',
    readingMinutes: 8,
    cover: 'linear-gradient(135deg,#4C6EF5 0%,#15AABF 100%)',
    tags: ['React', 'Performance', 'Animation'],
    body: [
      { type: 'p', text: '페이지 전환은 작은 디테일처럼 보이지만, 실제로는 사용자가 가장 자주 마주치는 인터랙션입니다. 클릭과 화면 사이의 60~120ms를 어떻게 다루느냐에 따라 제품의 인상은 완전히 달라집니다.' },
      { type: 'h2', text: '문제: 라우팅이 끝난 뒤에야 데이터가 도착한다' },
      { type: 'p', text: '기존 구조에서는 링크를 클릭하면 즉시 새 화면이 마운트되었고, 그 안에서 데이터를 fetch했습니다. 결과적으로 "빈 화면이 잠깐 보였다가 콘텐츠가 채워지는" 전형적인 깜빡임이 발생했습니다.' },
      { type: 'h2', text: '해결: 전환을 "보류"하는 useTransition' },
      { type: 'p', text: 'React 19의 useTransition은 상태 업데이트의 우선순위를 낮춰, 데이터가 준비될 때까지 이전 화면을 유지할 수 있게 해줍니다. 이를 라우터의 navigate 호출과 묶으면, 사용자에게는 마치 "다음 화면이 자연스럽게 페이드되어 들어오는" 것처럼 보입니다.' },
      { type: 'list', items: [
        '클릭 → isPending = true (이전 화면 유지)',
        '데이터 로딩 → 기존 화면을 살짝 dim 처리',
        '준비 완료 → 새 화면으로 부드럽게 교체',
      ]},
      { type: 'h2', text: '결과' },
      { type: 'p', text: 'TTI 체감 시간이 약 35% 줄었고, "어디로 이동했는지 모르겠다"는 사용자 리포트가 사라졌습니다. 코드는 더 단순해졌고, Suspense와도 자연스럽게 결합됩니다.' },
      { type: 'quote', text: '좋은 전환은 사용자가 의식하지 못하는 전환입니다.' },
    ],
  },
  {
    id: 'design-tokens-v2',
    title: '디자인 토큰을 다시 설계한 이야기',
    excerpt:
      '12개의 버튼 스타일이 공존하던 카오스에서 단일 소스(Single Source of Truth) 기반의 토큰 시스템으로 옮긴 과정.',
    category: 'Design',
    authorId: 'member-b',
    publishedAt: '2025-03-28',
    readingMinutes: 10,
    cover: 'linear-gradient(135deg,#F59E0B 0%,#EF4444 100%)',
    tags: ['Design System', 'Tokens', 'Figma'],
    body: [
      { type: 'p', text: '디자인 시스템은 "예쁜 컴포넌트 라이브러리"가 아니라, 결정의 비용을 낮추는 도구입니다. 토큰을 다시 설계하면서 이 사실을 다시 확인했습니다.' },
      { type: 'h2', text: '왜 다시 설계했나' },
      { type: 'p', text: '1년간 누적된 변형들을 헤아려보니 버튼 스타일만 12개, 카드 컴포넌트는 6개의 다른 그림자 값을 갖고 있었습니다. 새 화면을 만들 때마다 "어떤 스타일이 정답인가?"라는 질문이 반복되었고, 이건 명백히 시스템의 실패였습니다.' },
      { type: 'h2', text: '3-Tier 토큰 구조' },
      { type: 'list', items: [
        'Primitive: #4C6EF5, 16px 같은 원시 값',
        'Semantic: color.primary, spacing.md 같은 의미 기반 별칭',
        'Component: button.primary.background 같은 컴포넌트 전용 토큰',
      ]},
      { type: 'p', text: '이 구조 덕분에 다크 모드를 추가할 때 Primitive와 Component는 손대지 않고 Semantic 매핑만 교체할 수 있었습니다.' },
      { type: 'h2', text: '결과' },
      { type: 'p', text: 'Figma의 변수와 코드의 토큰이 같은 이름으로 동기화되어, 디자인 핸드오프 시간이 60% 줄었습니다. 더 중요한 것은, "어떤 색을 쓸까?"라는 질문이 사라졌다는 점입니다.' },
    ],
  },
  {
    id: 'okr-as-conversation',
    title: 'OKR을 "체크리스트"가 아닌 "대화"로 만드는 법',
    excerpt:
      '분기마다 OKR을 세우지만 실행과 따로 노는 팀이 많습니다. OKR을 살아있는 문서로 만들기 위해 우리가 시도한 것들.',
    category: 'Product',
    authorId: 'min',
    publishedAt: '2025-03-15',
    readingMinutes: 7,
    cover: 'linear-gradient(135deg,#8B5CF6 0%,#EC4899 100%)',
    tags: ['Strategy', 'OKR', 'Process'],
    body: [
      { type: 'p', text: 'OKR은 적는 게 어려운 게 아니라, 살아있게 만드는 게 어렵습니다. 분기 시작에 정성껏 적어두고 분기말에 다시 꺼내보는 문서가 되어선 안 됩니다.' },
      { type: 'h2', text: 'OKR이 죽는 가장 흔한 패턴' },
      { type: 'list', items: [
        '목표가 너무 많아 우선순위가 사라진다',
        'Key Result가 결과가 아닌 활동(activity)이다',
        '주간 회의에서 OKR을 언급하지 않는다',
      ]},
      { type: 'h2', text: '주간 OKR 리뷰: 15분이면 충분합니다' },
      { type: 'p', text: '매주 월요일, 15분만 OKR 진척도를 함께 봅니다. 형식은 단 세 줄: "이번 주 무엇을 했는가 / 무엇이 막혔는가 / 다음 주 어디에 베팅할 것인가". 길어지는 순간 죽습니다.' },
      { type: 'quote', text: 'OKR은 적는 도구가 아니라 대화의 매개체입니다.' },
      { type: 'h2', text: '결과' },
      { type: 'p', text: '한 분기 동안 시도한 결과, 스프린트 완료율이 65%에서 90%로 올랐습니다. 무엇을 하지 않을지 결정하는 데 더 많은 시간을 쓰게 되었습니다.' },
    ],
  },
  {
    id: 'animation-budget',
    title: '애니메이션에도 예산이 있다',
    excerpt:
      'Framer Motion을 마음껏 쓰다 보면 페이지가 무거워집니다. 60fps를 지키면서 인상적인 모션을 유지하는 우리의 규칙.',
    category: 'Frontend',
    authorId: 'hyeonsu',
    publishedAt: '2025-02-28',
    readingMinutes: 6,
    cover: 'linear-gradient(135deg,#10B981 0%,#06B6D4 100%)',
    tags: ['Performance', 'Framer Motion', 'UX'],
    body: [
      { type: 'p', text: '모션은 강력한 표현 도구지만, 동시에 가장 비싼 표현 도구입니다. 모든 요소가 동시에 움직이는 페이지는 "고급스럽다"가 아니라 "느리다"는 인상을 남깁니다.' },
      { type: 'h2', text: '우리의 3가지 규칙' },
      { type: 'list', items: [
        '한 화면에서 동시에 움직이는 "주요" 모션은 최대 3개',
        'transform과 opacity 외 속성은 가능하면 애니메이트하지 않는다',
        '300ms를 넘기지 않는다 — 사용자는 기다리고 있다',
      ]},
      { type: 'h2', text: '레이아웃 애니메이션의 함정' },
      { type: 'p', text: 'layout 속성은 매력적이지만 비쌉니다. 사용 전에 "정말 이 요소가 위치를 바꿔야 하는가?"를 물어보세요. 보통은 transform으로도 충분합니다.' },
      { type: 'p', text: '저희는 layout 애니메이션을 "주인공" 요소(아바타, 카드 전환 등)에만 쓰고, 나머지는 transform-only로 통일했습니다. 결과적으로 모바일에서도 일관되게 60fps가 나옵니다.' },
    ],
  },
  {
    id: 'small-team-rituals',
    title: '3인 팀이 지키는 작은 의식들',
    excerpt:
      '문서 없는 팀은 빠르지만 사라집니다. 3인 팀이 의사결정을 잃지 않기 위해 만든 4가지 의식.',
    category: 'Culture',
    authorId: 'min',
    publishedAt: '2025-02-10',
    readingMinutes: 5,
    cover: 'linear-gradient(135deg,#F472B6 0%,#A78BFA 100%)',
    tags: ['Team', 'Process', 'Culture'],
    body: [
      { type: 'p', text: '작은 팀의 강점은 속도지만, 약점도 속도입니다. 결정이 너무 빠르면 기록이 사라지고, 6개월 뒤 "왜 이렇게 만들었지?"라는 질문에 답할 수 없게 됩니다.' },
      { type: 'h2', text: '우리가 지키는 4가지' },
      { type: 'list', items: [
        '월요일 30분 — 이번 주의 단 하나의 목표를 정한다',
        '결정에는 항상 3줄 ADR을 남긴다 (배경 / 결정 / 트레이드오프)',
        '금요일 회고 — "다시 한다면 무엇을 다르게 할까?"만 묻는다',
        '분기마다 리츄얼 자체를 회고한다 — 의식이 의식 자체로 굳지 않게',
      ]},
      { type: 'p', text: '의식은 도구입니다. 도구는 일을 위해 존재하지, 일이 도구를 위해 존재하지 않습니다.' },
    ],
  },
  {
    id: 'image-pipeline',
    title: '이미지 파이프라인을 다시 만들면서 배운 것',
    excerpt:
      'CDN, WebP/AVIF, 반응형 이미지를 묶은 파이프라인을 새로 짜면서 LCP를 절반으로 줄인 과정.',
    category: 'Frontend',
    authorId: 'hyeonsu',
    publishedAt: '2025-01-22',
    readingMinutes: 9,
    cover: 'linear-gradient(135deg,#0EA5E9 0%,#6366F1 100%)',
    tags: ['Performance', 'CDN', 'Image'],
    body: [
      { type: 'p', text: '이미지는 가장 무거운 자산이면서도 가장 손이 덜 가는 자산입니다. 파이프라인을 다시 짜면서 LCP를 1.6초에서 0.8초로 줄였습니다.' },
      { type: 'h2', text: '단계별 최적화' },
      { type: 'list', items: [
        '원본은 한 곳(원본 버킷)에만 둔다',
        '요청 시 변환(on-the-fly transform)으로 width/format을 결정',
        '<picture>로 AVIF → WebP → JPEG 폴백 체인을 명시',
        'srcset과 sizes를 항상 함께 쓴다',
      ]},
      { type: 'h2', text: 'fetchpriority="high"는 마법이 아니다' },
      { type: 'p', text: 'LCP 이미지에 fetchpriority="high"를 붙이는 것은 효과적이지만, 동시에 prefetch link를 남용하면 의미가 사라집니다. 브라우저의 우선순위 큐를 이해하지 않고 사용하면 오히려 느려질 수 있습니다.' },
      { type: 'quote', text: '성능 최적화는 도구의 문제가 아니라 우선순위의 문제입니다.' },
    ],
  },
];

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
