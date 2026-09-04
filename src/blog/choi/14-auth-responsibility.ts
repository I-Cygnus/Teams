import type { BlogPost } from '../../data';

export const post14: BlogPost = {
  id: '14',
  package: 'choi',
  project: 'i-poten',
  title: '컨트롤러 71곳에서 인증 코드를 지운 날 — 책임의 위치가 구조를 결정한다',
  excerpt:
    '쿠키 꺼내고, Redis 조회하고, 401 던지고 — 같은 코드가 컨트롤러 71곳에 살고 있었습니다. 문제를 "인증 로직이 중복된다"가 아니라 "인증의 책임이 잘못된 층에 있다"로 다시 정의하자, 답이 달라졌습니다. Filter·AOP·상속·Interceptor 네 가지 대안을 비교하고, 시그니처가 한 줄로 줄어들기까지의 과정입니다.',
  category: 'Backend',
  authorOverride: { name: 'Mr.Choi', role: 'I-Poten Backend Developer', accent: '#7C3AED' },
  publishedAt: '2026-08-18',
  readingMinutes: 13,
  cover: 'linear-gradient(135deg,#7C3AED 0%,#4C1D95 60%,#0F172A 100%)',
  tags: ['Spring', 'Interceptor', 'Architecture', 'Auth', 'Backend'],
  body: [
    // ── 도입 ──
    {
      type: 'p',
      text: 'I-Poten 백엔드를 리팩토링하다가 세어봤습니다. 쿠키에서 토큰을 꺼내고, Redis에서 사용자를 조회하고, 실패하면 401을 던지는 — 똑같은 코드가 **컨트롤러 메서드 71곳**에 살고 있었습니다. 복사-붙여넣기의 흔적이죠.',
    },
    {
      type: 'code',
      language: 'java',
      text: `// 71곳에 반복되던 패턴
@PostMapping("/interview/start")
public ResponseEntity<?> start(HttpServletRequest request, @RequestBody StartRequest req) {
    String token = CookieUtil.extract(request, "userToken");   // 1. 쿠키 추출
    Long accountId = redisService.findAccountId(token);        // 2. Redis 검증
    if (accountId == null) {                                   // 3. 실패 처리
        return ResponseEntity.status(401).build();
    }
    // ... 여기서부터가 진짜 비즈니스 로직
}`,
    },
    {
      type: 'p',
      text: '이걸 보고 "중복이니 유틸로 빼자"라고 하면 반쯤만 맞는 답입니다. 유틸 메서드로 빼도 **호출하는 코드 71곳**은 그대로 남으니까요. 진짜 질문은 이겁니다 — **인증이라는 책임이 왜 컨트롤러 안에 있는가?** 컨트롤러의 일은 "검증된 사용자의 요청을 비즈니스에 넘기는 것"이지, 사용자를 검증하는 것이 아닙니다. 문제를 "중복 제거"가 아니라 **"책임 재배치"**로 다시 정의하자, 후보지가 달라졌습니다.',
    },

    { type: 'hr' },

    // ── Part 1 ──
    { type: 'h2', text: 'Part 1. 네 곳의 후보지 — 어디서 검증할 것인가' },
    {
      type: 'p',
      text: '인증을 컨트롤러 밖으로 옮긴다면 갈 수 있는 곳은 네 군데입니다. 하나씩 따져봤습니다.',
    },
    {
      type: 'list',
      items: [
        '**(1) Servlet Filter** — 가장 바깥. 하지만 Spring 컨텍스트 밖이라 **핸들러 정보(어떤 메서드가 처리할지, 무슨 어노테이션이 붙었는지)를 모릅니다.** "이 엔드포인트는 공개"라는 정책을 코드에 명시하기 어렵습니다.',
        '**(2) AOP @Around** — 컨트롤러 메서드를 감쌀 수 있지만, AOP는 **메서드가 실행되는 시점**에 끼어듭니다. 인증은 컨트롤러에 닿기 전에 끊어야 하는 관심사입니다. 층이 맞지 않습니다.',
        '**(3) 베이스 컨트롤러 상속** — 모든 컨트롤러를 부모 클래스에 강제 결합시킵니다. 상속은 한 번뿐인 카드인데 인증에 써버리는 건 아깝고, 팀원이 상속을 빼먹으면 그대로 구멍입니다.',
        '**(4) HandlerInterceptor + 커스텀 어노테이션 + ArgumentResolver** — 요청이 컨트롤러에 도달하기 전 경계에서 검증하고, 핸들러의 어노테이션을 읽어 정책을 분기하고, 검증된 값은 파라미터로 주입. **채택.**',
      ],
    },
    {
      type: 'quote',
      text: 'Filter가 아니라 Interceptor를 고른 결정적 이유는 하나였습니다 — 핸들러 메타데이터(어노테이션)에 접근할 수 있는가. 정책을 코드에 명시하려면 그것이 필요했습니다.',
    },

    { type: 'hr' },

    // ── Part 2 ──
    { type: 'h2', text: 'Part 2. 3단계 파이프라인 — 공개, 내부, 사용자' },
    {
      type: 'p',
      text: '설계하면서 알게 된 사실인데, 이 서비스의 요청은 사실 세 종류였습니다. 그동안 71곳의 복붙 코드가 이 구분을 뭉개고 있었던 거죠.',
    },
    {
      type: 'image',
      src: '/blog/choi/14/01-pipeline.svg',
      alt: '모든 요청이 인터셉터에서 공개 엔드포인트, 내부 서비스 호출, 사용자 요청의 3단계로 분기되어 컨트롤러에는 검증된 사용자 ID만 전달되는 파이프라인',
      caption: '요청은 세 종류 — 각각 다른 검증을 받고, 컨트롤러는 결과만 받습니다.',
    },
    {
      type: 'list',
      items: [
        '**① 공개 요청** — `@PublicEndpoint`가 붙어 있으면 검증 없이 통과 (토큰 검증 API, 로그아웃, 공개 조회 등 26개)',
        '**② 내부 호출** — `X-Internal-Key` 헤더가 유효하면 통과 (FastAPI 등 내부 서비스의 콜백)',
        '**③ 사용자 요청** — 쿠키의 토큰을 Redis에서 검증. 실패 시 401, 성공 시 accountId를 요청에 실어 다음으로',
      ],
    },
    {
      type: 'p',
      text: '그리고 마지막 조각이 **ArgumentResolver**입니다. 인터셉터가 검증해 둔 accountId를 컨트롤러 파라미터로 주입해 주는 역할이죠. 이 조각까지 맞춰지면 컨트롤러는 이렇게 바뀝니다.',
    },
    {
      type: 'code',
      language: 'java',
      text: `// After — 71곳의 시그니처가 전부 이 모양이 됐다
@PostMapping("/interview/start")
public ResponseEntity<?> start(@LoginUser Long accountId, @RequestBody StartRequest req) {
    // 첫 줄부터 비즈니스 로직. 인증은 이미 끝나 있다.
}

// 공개 엔드포인트는 의도를 어노테이션으로 명시
@PublicEndpoint
@GetMapping("/terms/trending")
public ResponseEntity<?> trending() { ... }`,
    },
    {
      type: 'p',
      text: '적용 범위는 `WebConfig`에서 `/api/**` 등으로 한정하고, 자체 인증을 가진 OAuth 경로는 대상에서 제외했습니다. **모든 경로에 일괄 적용하지 않은 것도 의도적인 결정**입니다 — 인증 체계가 다른 구역까지 한 인터셉터로 덮으면, 예외 처리가 다시 조건문으로 자라나니까요.',
    },

    { type: 'hr' },

    // ── Part 3 ──
    { type: 'h2', text: 'Part 3. 무엇이 좋아졌나 — 줄 수보다 중요한 것' },
    {
      type: 'p',
      text: '컨트롤러 71곳에서 쿠키 추출·Redis 조회 코드가 사라지고 시그니처가 `@LoginUser Long accountId` 한 줄로 통일됐습니다. 그런데 줄 수 감소보다 중요한 변화가 두 가지 있었습니다.',
    },
    {
      type: 'list',
      items: [
        '**정책이 코드에 보이게 됐다** — 공개(`@PublicEndpoint`) / 내부(`X-Internal-Key`) / 사용자(토큰)가 코드 레벨에서 명시적으로 구분됩니다. 새 엔드포인트를 만들 때 "검증 정책을 정하지 않으면" 기본이 가장 엄격한 쪽(사용자 검증)이라, **정책 누락이 곧 구멍이 되지 않습니다.**',
        '**변경 비용이 한 점으로 모였다** — 토큰 정책이 바뀌면(예: Temporary 토큰 추가) 고칠 곳이 71곳이 아니라 인터셉터 한 곳입니다. 실제로 이후 토큰 정책 변경이 있었는데, 컨트롤러는 한 줄도 건드리지 않았습니다.',
      ],
    },
    {
      type: 'quote',
      text: '좋은 구조는 코드를 줄이는 구조가 아니라, 각 층이 자기 일만 알아도 되게 만드는 구조였습니다. 책임의 위치를 옮기자 컨트롤러는 비즈니스만 알면 되는 상태가 됐습니다.',
    },

    { type: 'hr' },

    // ── 마무리 ──
    { type: 'h2', text: '마치며 — 중복 제거와 책임 재배치는 다른 문제다' },
    {
      type: 'quote',
      text: '같은 코드가 71곳에 있다면, 그건 복붙의 문제가 아니라 그 코드가 잘못된 층에 살고 있다는 신호일 수 있습니다.',
    },
    {
      type: 'list',
      items: [
        '**문제 재정의가 답을 바꾼다** — "중복 제거"였다면 유틸을 만들었을 것이고, 71곳의 호출은 남았을 것',
        '**Filter vs Interceptor의 기준은 "핸들러 정보가 필요한가"** — 어노테이션 기반 정책이라면 Interceptor',
        '**요청의 종류를 먼저 분류하라** — 공개/내부/사용자를 뭉개면 어떤 구조를 써도 조건문이 자란다',
        '**적용 범위의 예외도 설계다** — OAuth처럼 다른 체계를 가진 구역은 밖에 두는 것이 맞다',
      ],
    },
    {
      type: 'p',
      text: '이 구조는 지금도 MAU 600+ 서비스에서 그대로 돌고 있습니다. 참고로 이 서비스가 JWT 대신 세션을 택한 이유는 예전 글(쿠키·세션·토큰 편)에서 다뤘으니, 인증 방식 선택이 궁금하신 분은 그쪽을 먼저 보셔도 좋습니다. 여러분의 컨트롤러 첫 줄은 지금 무엇을 하고 있나요?',
    },
  ],
};
