import type { BlogPost } from '../../data';

export const post01: BlogPost = {
  id: '1',
  package: 'choi',
  title: 'Spring Security, 정말 필요할까?',
  excerpt:
    'Spring Security 대신 5개 클래스로 인증을 직접 만들고, Nginx 설정 몇 줄로 인증 트래픽의 90%를 줄인 여정. I-Poten 백엔드 인증 아키텍처를 공유합니다.',
  category: 'Backend',
  authorOverride: {
    name: 'Mr.Choi',
    role: 'I-Poten Backend Developer',
    accent: '#0EA5E9',
  },
  publishedAt: '2026-04-19',
  readingMinutes: 14,
  cover: 'linear-gradient(135deg,#0EA5E9 0%,#1E3A8A 60%,#0F172A 100%)',
  tags: ['Spring Boot', 'Auth', 'Nginx', 'Architecture'],
  body: [
    { type: 'p', text: '여러분은 로그인 기능을 만들 때 어떤 선택을 하시나요?' },
    { type: 'p', text: 'Spring Boot 프로젝트라면 대부분 Spring Security를 도입합니다. 검증된 프레임워크니까요. 저도 처음엔 그랬습니다.' },
    { type: 'p', text: '그런데 실제로 적용하려고 보니, FilterChain → AuthenticationManager → AuthenticationProvider → UserDetailsService → SecurityContext. 이 긴 추상화 체인을 따라가면서 "우리 프로젝트에 이게 다 필요한가?" 하는 의문이 들었습니다.' },
    { type: 'p', text: '이번 프로젝트의 인증 요구사항은 이랬습니다.' },
    { type: 'list', items: [
      '소셜 OAuth 6종은 프로바이더에 직접 토큰 교환 (Spring Security OAuth2 Client 미사용)',
      '세션 관리는 Redis에 userToken → accountId 매핑으로 충분',
      '권한은 USER / ADMIN 딱 2가지',
      'CSRF는 HttpOnly 쿠키 + SameSite=Strict로 충분',
    ]},
    { type: 'p', text: '이 정도 규모에 Spring Security의 추상화 레이어를 전부 얹는 건, 솔직히 오버엔지니어링이었습니다.' },
    { type: 'p', text: '그래서 결론부터 말씀드리면, **Spring Security 대신 5개 클래스로 전체 인증을 직접 만들었습니다.** 그리고 Nginx 설정 몇 줄로 인증 트래픽의 90%까지 줄였어요. 오늘은 그 여정을 공유드리고 싶습니다.' },

    { type: 'hr' },

    { type: 'h2', text: 'Part 1. 5개 클래스로 만든 인증 파이프라인' },

    { type: 'h3', text: '어노테이션 3개면 충분하다' },
    { type: 'p', text: 'Spring Security의 permitAll(), @AuthenticationPrincipal을 대체할 커스텀 어노테이션 3개를 정의했습니다.' },
    { type: 'code', language: 'java', text:
`@PublicEndpoint   // 인증 불필요 (= permitAll 대체)
@LoginUser        // 로그인된 유저 ID 주입 (= @AuthenticationPrincipal 대체)
@LoginToken       // 토큰 원본 주입 (로그아웃 등 토큰 직접 조작 시)`
    },

    { type: 'h3', text: '인터셉터 하나가 모든 인증을 처리한다' },
    { type: 'p', text: '핵심은 AuthenticationInterceptor입니다. 모든 요청이 여기를 거칩니다.' },
    { type: 'code', language: 'java', text:
`@Override
public boolean preHandle(HttpServletRequest request,
                         HttpServletResponse response,
                         Object handler) {

    // 1. @PublicEndpoint → 검증 없이 통과
    if (isPublicEndpoint(method)) return true;

    // 2. HttpOnly 쿠키에서 userToken 추출
    String userToken = CookieUtil.extract(request, "userToken");

    // 3. 토큰 없음 / 빈 값 / 임시 토큰 → 401
    if (userToken == null || userToken.isBlank()
        || userToken.startsWith("Temporary_"))
        return sendUnauthorized(response);

    // 4. Redis에서 accountId 조회 (만료 시 null)
    Long accountId = redisCacheService.getValueByKey(userToken, Long.class);
    if (accountId == null) return sendUnauthorized(response);

    // 5. request attribute에 저장 → ArgumentResolver가 읽어감
    request.setAttribute("_accountId", accountId);
    request.setAttribute("_userToken", userToken);
    return true;
}`
    },
    { type: 'p', text: '그리고 ArgumentResolver가 컨트롤러에 값을 주입합니다. 이게 전부입니다.' },

    { type: 'h3', text: '인증 범위는 WebConfig 한 곳에서 관리한다' },
    { type: 'p', text: '"어떤 API에 인증을 걸고, 어떤 API는 빼는가"도 한 파일에서 선언적으로 관리합니다.' },
    { type: 'code', language: 'java', text:
`@Override
public void addInterceptors(InterceptorRegistry registry) {
    registry.addInterceptor(authenticationInterceptor)
            .addPathPatterns(          // 인증이 필요한 경로
                    "/api/**",
                    "/account-profile/**",
                    "/credit/**"
            )
            .excludePathPatterns(      // OAuth는 자체 인증 사용
                    "/authentication/**",
                    "/kakao-authentication/**",
                    "/google-authentication/**",
                    "/naver-authentication/**",
                    "/github-authentication/**",
                    "/apple-authentication/**",
                    "/meta-authentication/**"
            );
}`
    },
    { type: 'p', text: 'OAuth 6종의 인증 경로는 프로바이더가 직접 토큰을 교환하는 구조라, 인터셉터를 타면 안 됩니다. 이걸 Spring Security의 SecurityFilterChain 설정 대신 **WebConfig의 path 패턴 3줄**로 끝냈습니다. 새 API 경로가 추가되어도 여기만 보면 됩니다.' },

    { type: 'h3', text: '컨트롤러 코드가 이렇게 달라졌습니다' },
    { type: 'code', language: 'java', text:
`// Before: Spring Security 사용 시
public ResponseEntity<?> getProfile(HttpServletRequest request) {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    UserDetails user = (UserDetails) auth.getPrincipal();
    Long accountId = Long.parseLong(user.getUsername());
    return ResponseEntity.ok(profileService.getProfile(accountId));
}

// After: 커스텀 어노테이션 적용
public ResponseEntity<?> getProfile(@LoginUser Long accountId) {
    return ResponseEntity.ok(profileService.getProfile(accountId));
}`
    },
    { type: 'p', text: '4줄이 1줄이 되었습니다. @LoginUser만 보면 "이 API는 인증이 필요하고, accountId가 주입되는구나"가 바로 보입니다.' },
    { type: 'p', text: '인증 불필요한 API는 더 간단합니다.' },
    { type: 'code', language: 'java', text:
`@PublicEndpoint
@PostMapping("/interview/callback")
public ResponseEntity<?> interviewCallback(@RequestBody CallbackForm form) {
    return ResponseEntity.ok(interviewService.processCallback(form));
}`
    },
    { type: 'p', text: '어노테이션 하나면 끝이죠.' },

    { type: 'h3', text: '트레이드오프도 인지하고 있습니다' },
    { type: 'p', text: 'Spring Security를 뺐다고 무조건 좋은 건 아닙니다. 전환 기준을 명확히 정했습니다.' },
    { type: 'table',
      headers: ['항목', '현재 (커스텀)', 'Spring Security 전환 시점'],
      rows: [
        ['역할 체계', 'USER / ADMIN 2가지', '5개 이상으로 세분화 시'],
        ['권한 체크', 'URL 패턴 기반 (인터셉터)', '메서드 레벨 @PreAuthorize 필요 시'],
        ['보안 검증', '직접 구현 (5개 클래스)', '커뮤니티 검증 보안 레이어 필요 시'],
      ],
    },
    { type: 'p', text: '기술 선택은 "이게 좋은가 나쁜가"가 아니라, **"지금 이 맥락에서 최선인가"**의 문제입니다.' },

    { type: 'hr' },

    { type: 'h2', text: 'Part 2. 즉시 로그아웃이 가능한 세션 설계' },

    { type: 'h3', text: 'JWT로는 풀 수 없는 문제' },
    { type: 'p', text: '소셜 로그인 6종(Google, Kakao, Naver, GitHub, Apple, Meta) × 웹/모바일 2가지 플로우 = **12가지 인증 경로**. 이 모든 경로에서 일관된 토큰 관리가 필요했습니다.' },
    { type: 'p', text: '특히 이 세 가지 요구사항이 동시에 충돌했습니다.' },
    { type: 'list', items: [
      '토큰을 JavaScript에서 접근 불가능하게 (XSS 방어)',
      '로그아웃 시 즉시 무효화 (JWT로는 불가능)',
      '회원가입 중간 단계에서 임시 인증 상태 필요',
    ]},
    { type: 'p', text: 'JWT를 선택했다면 두 번째가 불가능합니다. 토큰 만료까지 로그아웃을 할 수 없으니까요. **이게 Redis 세션을 선택한 가장 큰 이유입니다.**' },

    { type: 'h3', text: 'HttpOnly 쿠키 + Redis 세션' },
    { type: 'p', text: '로그인 플로우는 이렇습니다.' },
    { type: 'code', language: 'text', text:
`사용자 소셜 로그인
  → OAuth 콜백으로 인가 코드 도착
  → Spring Boot → 프로바이더에 액세스 토큰 교환
  → 사용자 정보 조회 + 계정 생성/조회
  → UUID로 userToken 생성
  → Redis에 저장: userToken → accountId (TTL 6시간)
  → HttpOnly 쿠키로 응답에 실어서 전달`
    },
    { type: 'p', text: '쿠키에 보안 플래그 3개를 달았습니다.' },
    { type: 'table',
      headers: ['플래그', '역할', '방어 대상'],
      rows: [
        ['HttpOnly', 'JavaScript에서 document.cookie 접근 불가', 'XSS'],
        ['Secure', 'HTTPS에서만 쿠키 전송', '중간자 공격'],
        ['SameSite=Strict', '외부 사이트에서 쿠키 전송 차단', 'CSRF'],
      ],
    },
    { type: 'p', text: '실제 코드에서는 이렇게 설정합니다.' },
    { type: 'code', language: 'java', text:
`// CookieUtil.java
public static void addUserToken(HttpServletResponse response, String token) {
    response.addHeader("Set-Cookie", String.format(
        "userToken=%s; Max-Age=%d; Path=/; HttpOnly; Secure; SameSite=Strict",
        token, 21600  // 6시간
    ));
}`
    },
    { type: 'p', text: '로그아웃은 Redis 키 삭제 한 줄입니다. 즉시 무효화.' },
    { type: 'code', language: 'java', text:
`public void logout(String userToken) {
    redisCacheService.deleteByKey(userToken);        // 토큰 삭제
    redisCacheService.deleteByKey(accountId + "");   // 연관 데이터 삭제
    CookieUtil.clearUserToken(response);             // 쿠키 제거 (Max-Age=0)
}`
    },

    { type: 'h3', text: '회원가입 중간 단계라는 애매한 상태' },
    { type: 'p', text: 'OAuth 로그인 후 신규 회원인 경우, 프로필 입력까지 완료해야 진짜 토큰을 발급해야 합니다. 그 사이에 **"인증도 아니고 비인증도 아닌"** 상태가 필요했습니다.' },
    { type: 'p', text: '해결은 단순합니다. 접두사 하나를 붙였습니다.' },
    { type: 'code', language: 'java', text:
`// 임시 토큰 (5분 TTL) — "Temporary_" 접두사
String tempToken = "Temporary_" + UUID.randomUUID();
redisCacheService.setKeyAndValue(tempToken, accountId, 5, TimeUnit.MINUTES);

// 프로필 입력 완료 후 → 정식 토큰 (6시간 TTL)으로 교체
String realToken = UUID.randomUUID().toString();
redisCacheService.deleteByKey(tempToken);
redisCacheService.setKeyAndValue(realToken, accountId, 6, TimeUnit.HOURS);`
    },
    { type: 'p', text: '인터셉터에서는 Temporary_로 시작하는 토큰을 만나면 보호된 API 접근을 차단합니다. if문 하나로요.' },
    { type: 'p', text: '12가지 인증 경로가 전부 이 하나의 플로우를 공유합니다. Google이든 Apple이든 Kakao든, 토큰 발급 구조는 동일합니다.' },

    { type: 'hr' },

    { type: 'h2', text: 'Part 3. 인증 트래픽의 90%는 필요 없었다' },
    { type: 'p', text: '그리고 여기서부터가, 개인적으로 흥미로운 부분입니다.' },

    { type: 'h3', text: '로컬 테스트 중 발견한 이상한 패턴' },
    { type: 'p', text: '개발 중 서버 로그를 살펴보다가 이런 패턴이 눈에 띄었습니다.' },
    { type: 'code', language: 'text', text:
`GET /api/authentication/token/verification - 200 OK
GET /api/authentication/token/verification - 200 OK
GET /api/authentication/token/verification - 200 OK
GET /api/authentication/token/verification - 200 OK
...`
    },
    { type: 'p', text: 'SPA 특성상 페이지 전환 시 새로고침이 없습니다. 브라우저는 로그인 상태를 모르니까, 네비게이션 바의 useEffect에서 **매 라우트 전환마다** 토큰 검증 API를 호출하고 있었습니다.' },
    { type: 'p', text: '숫자로 보면 이렇습니다.' },
    { type: 'list', items: [
      '사용자 1명이 10페이지 이동 → 토큰 검증 API 10번 호출',
      '각 호출마다: 쿠키 파싱 → Redis 조회 → DB 조회 → JSON 응답 = ~200ms',
      '이미 로그인된 사용자인데, 결과는 매번 똑같습니다',
    ]},
    { type: 'p', text: '동시 접속자 100명이 각각 10페이지를 이동한다고 가정하면, 1,000번의 완전히 동일한 검증이 반복되는 셈이죠.' },

    { type: 'h3', text: '핵심 인사이트 하나' },
    { type: 'quote', text: 'HttpOnly 쿠키는 JavaScript가 못 읽지만, Nginx는 읽을 수 있다.' },
    { type: 'p', text: 'JavaScript가 document.cookie로 HttpOnly 쿠키에 접근할 수 없으니, 프론트엔드는 백엔드에 물어볼 수밖에 없었습니다.' },
    { type: 'p', text: '그런데 Nginx는 HTTP 요청의 Cookie 헤더를 그대로 읽을 수 있습니다. **그러면 Nginx가 판단하면 됩니다.**' },

    { type: 'h3', text: 'Nginx 설정으로 해결' },
    { type: 'code', language: 'nginx', text:
`location /spring/api/authentication/token/verification {

    # userToken 쿠키가 존재하면 → 백엔드까지 안 가고 429 반환
    if ($cookie_userToken != "") {
        return 429;
    }

    # 쿠키 없으면 → 진짜로 백엔드에 물어봄
    proxy_pass http://spring-backend:8080/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}`
    },
    { type: 'p', text: '프론트엔드에서는 429를 "쿠키 있음 = 로그인 상태"로 해석합니다.' },
    { type: 'code', language: 'tsx', text:
`try {
    const result = await tokenVerificationRequest();
    setIsLoggedIn(result.status === true);
} catch (err: any) {
    if (err.response?.status === 429) {
        setIsLoggedIn(true);   // Nginx 429 = 쿠키 있음 = 로그인 상태
    } else {
        setIsLoggedIn(false);
    }
}`
    },

    { type: 'h3', text: 'Before vs After' },
    { type: 'code', language: 'text', text:
`[Before] 매 페이지 이동마다:
Nginx → Spring Boot → Redis → DB → JSON 응답 (~200ms)

[After] 쿠키가 있는 사용자:
Nginx → return 429 (<1ms)
    Spring Boot는 잠도 안 깼습니다. Redis도요. DB도요.

[After] 쿠키가 없는 사용자 (최초 접속):
Nginx → proxy_pass → Spring Boot → Redis → DB → 정상 검증`
    },
    { type: 'table',
      headers: ['항목', 'Before', 'After', '개선률'],
      rows: [
        ['응답 시간', '~200ms', '<1ms', '99.5% 단축'],
        ['인증 트래픽', '100%', '~10%', '90% 감소'],
        ['백엔드 부하', '매 페이지 이동마다', '최초 접속만', '—'],
      ],
    },
    { type: 'p', text: '같은 가정(동접 100명 × 10페이지) 기준으로 계산해보면, 토큰 검증 1,000회 중 **900회를 Nginx에서 차단**하고, 백엔드는 100회만 처리하게 됩니다.' },

    { type: 'h3', text: '이 최적화의 한계도 압니다' },
    { type: 'p', text: '이 방식은 **"쿠키가 있으면 로그인된 것"**이라는 가정에 기반합니다. 쿠키는 있지만 Redis에서 만료된 극단적 케이스가 존재하죠.' },
    { type: 'p', text: '방어는 이렇게 합니다.' },
    { type: 'list', items: [
      '쿠키 Max-Age와 Redis TTL을 동일하게 6시간으로 맞춤',
      '만약 Redis가 먼저 만료되면 → Nginx는 429를 반환하지만',
      '사용자가 실제 API를 호출하는 순간 → 인터셉터에서 Redis 조회 실패 → 401 Unauthorized',
      '프론트엔드가 401을 받고 로그아웃 처리',
    ]},
    { type: 'p', text: '토큰 검증 시점에서는 틈이 생길 수 있지만, **실제 API 호출 시점에서 인터셉터가 잡아냅니다.** 보안 위험은 없습니다.' },

    { type: 'hr' },

    { type: 'h2', text: '전체 아키텍처 한눈에 보기' },
    { type: 'code', language: 'text', text:
`┌──────────────────────────────────────────────────┐
│  Layer 1: Nginx (트래픽 최적화)                    │
│  token/verification 요청 시:                       │
│  쿠키 있음 → 429 반환 (<1ms)                       │
│  쿠키 없음 → Spring Boot로 프록시                  │
└─────────────────────┬────────────────────────────┘
                      │
┌─────────────────────┴────────────────────────────┐
│  Layer 2: AuthenticationInterceptor (인증)         │
│  @PublicEndpoint → 바로 통과                       │
│  쿠키 추출 → Temporary_ 체크 → Redis 조회          │
│  → request.setAttribute("_accountId")              │
└─────────────────────┬────────────────────────────┘
                      │
┌─────────────────────┴────────────────────────────┐
│  Layer 3: ArgumentResolver (주입)                  │
│  @LoginUser Long accountId → 자동 주입             │
│  @LoginToken String userToken → 자동 주입          │
└─────────────────────┬────────────────────────────┘
                      │
┌─────────────────────┴────────────────────────────┐
│  Layer 4: Controller (비즈니스 로직)              │
│  getProfile(@LoginUser Long accountId)             │
│  → accountId = 42 자동 주입                        │
└──────────────────────────────────────────────────┘`
    },

    { type: 'hr' },

    { type: 'h2', text: '결국 핵심은 "지금 이 맥락에서 최선인가"' },
    { type: 'p', text: 'Spring Security가 나쁜 게 아닙니다. 이 프로젝트에 과했을 뿐입니다. 그리고 그 판단 덕분에 5개 클래스로 인증을 만들 수 있었고, Nginx 설정 몇 줄로 트래픽의 90%를 줄일 수 있었습니다.' },
    { type: 'p', text: '설정이든 인증이든 인프라든, 결국 핵심은 같다고 생각합니다. **"지금 이 맥락에서 최선인가."**' },

    { type: 'hr' },

    { type: 'h2', text: '마치며 — 아직 배울 게 많습니다' },
    { type: 'p', text: '이번 프로젝트에서 인증 시스템을 직접 설계해보며, 기술 선택이란 결국 **"상황에 맞는 최소한을 고르는 감각"**이라는 걸 배웠습니다.' },
    { type: 'p', text: '앞으로 사용자 수가 늘어나거나 권한 체계가 복잡해지면, 지금의 선택들도 다시 점검해야 할 거예요. 그때는 또 그때의 최선을 찾아 진화시키면 된다고 생각합니다.' },
    { type: 'p', text: '부족한 글 읽어주셔서 감사합니다. 더 좋은 아이디어나 피드백은 언제든 환영합니다.' },
  ],
};
