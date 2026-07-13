import type { BlogPost } from '../../data';

export const post03: BlogPost = {
    id: '3',
    package: 'min',
    title: '레이어드 아키텍처를 넘어, 프로젝트에 맞는 구조 선택하기',
    excerpt:
        'I-Poten에서 익숙하게 사용했던 레이어드 아키텍처를 출발점으로, 클린 아키텍처, 헥사고날 아키텍처, 모듈러 모놀리스, 마이크로서비스 등 다양한 구조를 비교하고 다음 프로젝트에 맞는 아키텍처를 선택하는 기준을 정리합니다.',
    category: 'Backend',
    authorOverride: {
        name: 'min',
        role: 'Fullstack Developer',
        accent: '#3B82F6',
    },
    publishedAt: '2026-07-13',
    readingMinutes: 18,
    cover: 'linear-gradient(135deg,#0F172A 0%,#334155 45%,#2563EB 100%)',
    coverImage: '/blog/min/03/architecture.png',
    tags: [
        'Software Architecture',
        'Layered Architecture',
        'Clean Architecture',
        'Hexagonal Architecture',
        'Modular Monolith',
        'Spring Boot',
    ],
    body: [
        { type: 'p', text: 'I-Poten 프로젝트를 개발하면서 백엔드 구조로 주로 레이어드 아키텍처를 사용했습니다.' },
        { type: 'p', text: 'Controller에서 요청을 받고, Service에서 비즈니스 로직을 처리한 뒤, Repository를 통해 데이터베이스에 접근하는 익숙한 구조였습니다.' },
        { type: 'p', text: '하지만 처음부터 여러 아키텍처를 비교하고 레이어드 아키텍처를 선택했던 것은 아니었습니다.' },
        { type: 'p', text: '수업과 예제 프로젝트에서 사용하던 구조였기 때문에 자연스럽게 따라 사용했고, 프로젝트에 왜 이 구조가 적합한지 깊게 고민하지는 못했습니다.' },
        { type: 'p', text: '앞으로 친구들과 새로운 프로젝트를 시작한다면, 단순히 익숙한 구조를 반복하기보다 프로젝트 특성과 팀 상황을 분석한 뒤 아키텍처를 선택해보고 싶었습니다.' },
        { type: 'p', text: '이번 글에서는 레이어드 아키텍처를 포함한 여러 소프트웨어 아키텍처의 특징과 장단점을 비교하고, 소규모 팀 프로젝트에서는 어떤 방식으로 접근하는 것이 현실적인지 정리해보려 합니다.' },

        { type: 'hr' },

        { type: 'h2', text: 'Part 1. 아키텍처를 왜 선택해야 할까' },

        { type: 'p', text: '아키텍처는 단순히 폴더를 나누는 규칙이 아닙니다.' },
        { type: 'p', text: '어떤 코드가 어떤 책임을 가지는지, 기능 사이의 의존성을 어떻게 통제할지, 시스템을 어떤 단위로 배포하고 확장할지를 결정하는 기준입니다.' },
        { type: 'p', text: '같은 기능을 구현하더라도 아키텍처에 따라 코드의 위치와 의존성 방향, 테스트 방법, 변경 범위가 달라집니다.' },
        { type: 'p', text: '예를 들어 소셜 로그인 기능을 구현한다고 가정해보겠습니다.' },
        {
            type: 'code',
            language: 'text',
            text:
                `단순한 구조
Controller
→ Service
→ Kakao API 직접 호출
→ AccountRepository 저장

경계를 분리한 구조
Controller
→ LoginUseCase
→ SocialAuthPort
→ KakaoAuthAdapter

LoginUseCase
→ AccountPort
→ JpaAccountAdapter`,
        },
        { type: 'p', text: '두 구조 모두 기능은 동작할 수 있습니다.' },
        { type: 'p', text: '하지만 카카오 로그인 외에 네이버, 구글, 애플 로그인이 추가되거나 외부 API 테스트가 필요해지면 두 번째 구조가 변경에 더 유리할 수 있습니다.' },
        { type: 'p', text: '반대로 소셜 로그인 제공자가 하나뿐이고 프로젝트 규모가 작다면, 처음부터 많은 인터페이스와 어댑터를 만드는 것이 불필요한 복잡성이 될 수도 있습니다.' },
        { type: 'p', text: '따라서 좋은 아키텍처는 가장 유명하거나 가장 복잡한 구조가 아니라, **현재 프로젝트의 문제를 적절한 비용으로 해결하는 구조**라고 볼 수 있습니다.' },

        { type: 'hr' },

        { type: 'h2', text: 'Part 2. 아키텍처는 같은 기준에서 비교할 수 없다' },

        { type: 'p', text: '아키텍처를 공부할 때 처음 혼란스러웠던 점은 MVC, 레이어드, 클린 아키텍처, 마이크로서비스, CQRS 같은 용어가 모두 비슷한 선택지처럼 보인다는 것이었습니다.' },
        { type: 'p', text: '하지만 이 용어들은 서로 해결하려는 문제가 다릅니다.' },
        {
            type: 'table',
            headers: ['관점', '결정하는 내용', '대표적인 구조'],
            rows: [
                ['애플리케이션 내부 구조', '코드를 어떤 책임과 방향으로 나눌 것인가', '레이어드, 클린, 헥사고날, 어니언, 버티컬 슬라이스'],
                ['시스템 배포 구조', '서비스를 하나로 배포할지 여러 서비스로 나눌지', '모놀리스, 모듈러 모놀리스, 마이크로서비스'],
                ['데이터와 통신 구조', '기능과 서비스가 어떤 방식으로 정보를 주고받을지', '이벤트 기반, 메시지 기반, CQRS'],
                ['사용자 인터페이스 구조', '입력과 화면 표현을 어떻게 분리할지', 'MVC, MVVM'],
            ],
        },
        { type: 'p', text: '따라서 실제 프로젝트에서는 하나만 선택하는 것이 아니라 여러 구조를 조합할 수 있습니다.' },
        {
            type: 'code',
            language: 'text',
            text:
                `배포 구조
→ 모듈러 모놀리스

모듈 내부 구조
→ 레이어드 또는 헥사고날

기능 구성 방식
→ 버티컬 슬라이스

후속 처리 방식
→ 이벤트 기반`,
        },
        { type: 'p', text: '이 관점을 이해하면 “MVC와 마이크로서비스 중 무엇을 선택해야 하나”처럼 서로 다른 수준의 개념을 직접 비교하는 혼란을 줄일 수 있습니다.' },

        { type: 'hr' },

        { type: 'h2', text: 'Part 3. I-Poten에서 사용한 레이어드 아키텍처' },

        { type: 'p', text: 'I-Poten에서는 Spring Boot 기반의 일반적인 레이어드 아키텍처를 사용했습니다.' },
        {
            type: 'code',
            language: 'text',
            text:
                `Controller
→ Service
→ Repository
→ Database`,
        },
        { type: 'p', text: '조금 더 역할을 나누면 다음과 같이 볼 수 있습니다.' },
        {
            type: 'table',
            headers: ['계층', '주요 역할', 'I-Poten 예시'],
            rows: [
                ['Presentation', 'HTTP 요청과 응답 처리', 'TermController, QuizController'],
                ['Application 또는 Service', '유스케이스와 비즈니스 흐름 처리', 'TermService, QuizService'],
                ['Domain', '핵심 상태와 규칙 표현', 'Term, QuizQuestion, Account'],
                ['Persistence 또는 Infrastructure', '데이터 저장과 외부 기술 연결', 'JpaRepository, MySQL'],
            ],
        },
        { type: 'p', text: '이 구조는 포텐워드 등록, 포텐퀴즈 조회, 단어장 저장처럼 CRUD 중심 기능을 빠르게 개발하는 데 도움이 됐습니다.' },
        { type: 'p', text: 'Spring Boot 예제와 자료가 많고, 팀원 모두 Controller, Service, Repository의 역할을 쉽게 이해할 수 있다는 점도 장점이었습니다.' },
        { type: 'p', text: '초기 프로젝트에서는 복잡한 구조보다 기능을 빠르게 구현하고 검증하는 것이 중요했기 때문에 레이어드 아키텍처는 충분히 합리적인 선택이었습니다.' },

        { type: 'hr' },

        { type: 'h2', text: 'Part 4. 레이어드 아키텍처의 장점과 한계' },

        { type: 'p', text: '레이어드 아키텍처의 가장 큰 장점은 단순하고 익숙하다는 점입니다.' },
        {
            type: 'table',
            headers: ['장점', '설명'],
            rows: [
                ['이해하기 쉬움', 'Controller, Service, Repository의 책임이 널리 알려져 있음'],
                ['CRUD 개발이 빠름', '일반적인 등록, 조회, 수정, 삭제 기능에 적합'],
                ['팀 적응이 쉬움', '신규 팀원이 코드 위치를 예상하기 쉬움'],
                ['자료가 많음', 'Spring Boot 예제와 학습 자료 대부분이 비슷한 구조 사용'],
                ['초기 설계 비용이 낮음', '복잡한 경계와 추상화를 먼저 설계하지 않아도 됨'],
            ],
        },
        { type: 'p', text: '하지만 프로젝트가 커지면 레이어드 아키텍처의 한계도 드러날 수 있습니다.' },
        {
            type: 'table',
            headers: ['한계', '설명'],
            rows: [
                ['Service 비대화', '회원과 관련된 여러 정책이 하나의 AccountService에 몰릴 수 있음'],
                ['기술 중심 분리', '하나의 기능을 수정하려면 Controller, Service, Repository를 모두 이동해야 함'],
                ['형식적인 계층 통과', '각 계층이 단순 전달만 수행하는 코드가 늘어날 수 있음'],
                ['외부 기술 종속', 'JPA Entity가 API 응답과 비즈니스 모델 역할까지 맡기 쉬움'],
                ['도메인 경계 부족', '회원, 인증, 혜택처럼 다른 책임이 하나의 서비스에 섞일 수 있음'],
            ],
        },
        { type: 'p', text: '중요한 점은 레이어드 아키텍처 자체가 나쁜 것이 아니라는 점입니다.' },
        { type: 'p', text: '문제는 프로젝트의 복잡도가 높아졌는데도 모든 기능을 동일한 Controller, Service, Repository 구조에만 끼워 맞추는 경우에 발생합니다.' },
        { type: 'p', text: '즉, 레이어드 아키텍처는 단순한 서비스에 적합하지만, 복잡한 정책과 외부 연동이 많아질수록 추가적인 경계 설계가 필요합니다.' },

        { type: 'hr' },

        { type: 'h2', text: 'Part 5. 클린 아키텍처와 의존성 방향' },

        { type: 'p', text: '클린 아키텍처의 핵심은 폴더 이름보다 **의존성의 방향**에 있습니다.' },
        { type: 'p', text: '안쪽에 있는 비즈니스 규칙은 바깥쪽의 데이터베이스, 웹 프레임워크, 외부 API를 직접 알지 않아야 합니다.' },
        {
            type: 'code',
            language: 'text',
            text:
                `Frameworks and Drivers
→ Interface Adapters
→ Use Cases
→ Entities and Domain Rules`,
        },
        { type: 'p', text: '예를 들어 회원가입 유스케이스가 JPA Repository 구현체를 직접 의존하는 대신, 필요한 기능을 인터페이스로 정의할 수 있습니다.' },
        {
            type: 'code',
            language: 'java',
            text:
                `public interface AccountRepository {
    Account save(Account account);
    boolean existsByEmail(String email);
}`,
        },
        { type: 'p', text: '애플리케이션의 회원가입 로직은 이 인터페이스만 사용하고, 실제 JPA 구현체는 바깥쪽 인프라 계층에서 제공합니다.' },
        {
            type: 'table',
            headers: ['장점', '설명'],
            rows: [
                ['비즈니스 로직 보호', 'DB와 프레임워크가 바뀌어도 핵심 규칙에 미치는 영향이 작음'],
                ['테스트 용이성', '실제 DB 없이 가짜 Repository로 유스케이스 테스트 가능'],
                ['의존성 통제', '외부 기술이 내부 도메인을 의존하도록 방향을 제한'],
                ['장기 유지보수', '핵심 정책이 Controller나 JPA 코드에 묻히는 것을 방지'],
            ],
        },
        { type: 'p', text: '반면 간단한 CRUD에도 모든 계층과 인터페이스를 적용하면 클래스 수가 지나치게 많아질 수 있습니다.' },
        { type: 'p', text: '프로젝트 규모가 작거나 비즈니스 규칙이 단순하다면, 구조를 유지하는 비용이 얻는 이점보다 더 클 수 있습니다.' },

        { type: 'hr' },

        { type: 'h2', text: 'Part 6. 헥사고날 아키텍처와 포트, 어댑터' },

        { type: 'p', text: '헥사고날 아키텍처는 Ports and Adapters Architecture라고도 부릅니다.' },
        { type: 'p', text: '애플리케이션을 중심에 두고, 외부 요청이 들어오는 부분과 외부 기술을 호출하는 부분을 포트와 어댑터로 구분합니다.' },
        {
            type: 'code',
            language: 'text',
            text:
                `REST Controller
→ Inbound Port
→ Application Service
→ Outbound Port
→ JPA Adapter

Application Service
→ Outbound Port
→ Email Adapter

Application Service
→ Outbound Port
→ Social Login Adapter`,
        },
        {
            type: 'table',
            headers: ['구성 요소', '역할', '예시'],
            rows: [
                ['Inbound Adapter', '애플리케이션을 호출하는 외부 요소', 'REST Controller, Message Consumer'],
                ['Inbound Port', '외부에 제공하는 유스케이스 인터페이스', 'SignUpUseCase, CreateOrderUseCase'],
                ['Application', '유스케이스 실행과 흐름 제어', 'SignUpService, CreateOrderService'],
                ['Outbound Port', '외부 기술에 요구하는 기능 정의', 'AccountRepository, MailSender'],
                ['Outbound Adapter', '포트를 실제 기술로 구현', 'JpaAccountRepository, SmtpMailSender'],
            ],
        },
        { type: 'p', text: '헥사고날 아키텍처는 데이터베이스, 소셜 로그인, 결제, 이메일, 파일 저장처럼 외부 연동이 많은 기능에 특히 유용합니다.' },
        { type: 'p', text: '반면 단순한 카테고리 조회 기능까지 포트와 어댑터로 세분화하면 개발 속도와 가독성이 오히려 나빠질 수 있습니다.' },
        { type: 'p', text: '클린 아키텍처와 헥사고날 아키텍처는 서로 완전히 다른 구조라기보다, 핵심 로직을 외부 기술로부터 보호한다는 공통된 철학을 가진다고 이해했습니다.' },

        { type: 'hr' },

        { type: 'h2', text: 'Part 7. 어니언 아키텍처와 도메인 중심 설계' },

        { type: 'p', text: '어니언 아키텍처는 도메인 모델을 가장 안쪽에 두고, 그 바깥에 도메인 서비스, 애플리케이션 서비스, 인프라 계층을 배치합니다.' },
        {
            type: 'code',
            language: 'text',
            text:
                `Infrastructure
→ Application Services
→ Domain Services
→ Domain Model`,
        },
        { type: 'p', text: '의존성은 바깥에서 안쪽으로 향하며, 도메인 모델은 데이터베이스나 웹 프레임워크를 알지 않습니다.' },
        { type: 'p', text: '이 구조는 주문, 결제, 혜택, 회원 상태처럼 규칙과 상태 전이가 복잡한 시스템에 적합합니다.' },
        { type: 'p', text: '다만 도메인 모델링 경험이 부족한 팀이 형식만 따라 하면, 실제 규칙은 Service에 남고 Entity는 getter와 setter만 가진 빈약한 도메인 모델이 될 수 있습니다.' },
        { type: 'p', text: '따라서 어니언 아키텍처를 적용할 때는 계층보다 먼저 도메인의 책임과 규칙을 충분히 이해해야 합니다.' },

        { type: 'hr' },

        { type: 'h2', text: 'Part 8. 기능 단위로 묶는 버티컬 슬라이스' },

        { type: 'p', text: '전통적인 레이어드 구조는 기술 역할에 따라 코드를 나눕니다.' },
        {
            type: 'code',
            language: 'text',
            text:
                `controller
├── AccountController
└── ProductController

service
├── AccountService
└── ProductService

repository
├── AccountRepository
└── ProductRepository`,
        },
        { type: 'p', text: '버티컬 슬라이스 아키텍처는 하나의 기능을 구현하는 코드를 가까이 모읍니다.' },
        {
            type: 'code',
            language: 'text',
            text:
                `account
├── signup
│   ├── SignUpRequest
│   ├── SignUpHandler
│   └── SignUpValidator
└── withdraw
    ├── WithdrawRequest
    └── WithdrawHandler

product
├── create
└── search`,
        },
        { type: 'p', text: '회원가입 기능을 수정할 때 여러 기술 계층을 이동하지 않고 signup 슬라이스를 중심으로 확인할 수 있다는 것이 장점입니다.' },
        {
            type: 'table',
            headers: ['장점', '주의점'],
            rows: [
                ['기능 관련 코드가 가까이 있어 변경 범위를 파악하기 쉬움', '슬라이스마다 비슷한 검증 코드가 중복될 수 있음'],
                ['여러 개발자가 기능별로 병렬 작업하기 좋음', '공통 코드 추출 기준을 합의해야 함'],
                ['거대한 Service 클래스를 줄일 수 있음', '팀원마다 슬라이스 구조가 달라지지 않도록 규칙 필요'],
                ['기능 삭제와 교체가 비교적 쉬움', '전통적인 계층 구조에 익숙한 개발자에게 낯설 수 있음'],
            ],
        },
        { type: 'p', text: '버티컬 슬라이스는 레이어드나 헥사고날 아키텍처와 함께 사용할 수도 있습니다.' },
        { type: 'p', text: '예를 들어 모듈은 회원, 상품, 주문으로 나누고, 각 모듈 안에서는 회원가입, 탈퇴, 프로필 수정 같은 유스케이스별 슬라이스를 구성할 수 있습니다.' },

        { type: 'hr' },

        { type: 'h2', text: 'Part 9. 모놀리스, 모듈러 모놀리스, 마이크로서비스' },

        { type: 'p', text: '애플리케이션 내부 코드 구조와 별개로, 시스템을 어떤 단위로 배포할지도 결정해야 합니다.' },

        { type: 'h3', text: '1. 모놀리스' },
        { type: 'p', text: '모놀리스는 회원, 상품, 주문, 결제 같은 기능을 하나의 애플리케이션에 포함하고 하나의 단위로 배포하는 구조입니다.' },
        {
            type: 'code',
            language: 'text',
            text:
                `Account
Product
Order
Payment
Quiz
Term
→ 하나의 Spring Boot 애플리케이션
→ 하나의 배포 단위`,
        },
        { type: 'p', text: '로컬 실행과 배포가 단순하고, 기능 사이의 호출이 일반적인 메서드 호출이기 때문에 개발이 쉽습니다.' },
        { type: 'p', text: '같은 데이터베이스를 사용하면 트랜잭션 처리도 상대적으로 단순합니다.' },
        { type: 'p', text: '하지만 모듈 경계를 관리하지 않으면 모든 기능이 서로 직접 참조하는 거대한 코드베이스가 될 수 있습니다.' },

        { type: 'h3', text: '2. 모듈러 모놀리스' },
        { type: 'p', text: '모듈러 모놀리스는 하나의 애플리케이션으로 배포하지만, 내부 기능을 업무 도메인별 모듈로 명확하게 분리합니다.' },
        {
            type: 'code',
            language: 'text',
            text:
                `modules
├── account
│   ├── domain
│   ├── application
│   └── infrastructure
├── term
├── quiz
├── order
└── benefit`,
        },
        { type: 'p', text: '핵심은 폴더만 나누는 것이 아니라 다른 모듈의 내부 구현에 직접 접근하지 않는 것입니다.' },
        {
            type: 'code',
            language: 'text',
            text:
                `잘못된 접근
Order 모듈
→ AccountRepository 직접 호출

경계를 지킨 접근
Order 모듈
→ Account 모듈이 공개한 AccountReader 호출

또는
AccountChangedEvent 발행
→ 필요한 모듈이 이벤트 처리`,
        },
        { type: 'p', text: '모놀리스의 단순한 개발과 배포 방식을 유지하면서도 도메인 경계를 연습할 수 있다는 점이 가장 큰 장점입니다.' },
        { type: 'p', text: '소규모 팀 프로젝트에서는 마이크로서비스보다 훨씬 적은 운영 비용으로 구조적인 이점을 얻을 수 있습니다.' },

        { type: 'h3', text: '3. 마이크로서비스' },
        { type: 'p', text: '마이크로서비스 아키텍처는 업무 영역별 기능을 독립적인 애플리케이션과 데이터 저장소로 분리합니다.' },
        {
            type: 'code',
            language: 'text',
            text:
                `Account Service → Account DB
Product Service → Product DB
Order Service   → Order DB
Payment Service → Payment DB`,
        },
        { type: 'p', text: '서비스별 독립 배포와 확장이 가능하고, 여러 팀이 각 서비스를 자율적으로 운영할 수 있습니다.' },
        { type: 'p', text: '하지만 일반 메서드 호출이 네트워크 호출로 바뀌면서 새로운 문제가 발생합니다.' },
        {
            type: 'code',
            language: 'text',
            text:
                `네트워크 장애
서비스 간 인증
API 버전 관리
분산 로그 추적
분산 트랜잭션
데이터 최종적 일관성
재시도와 중복 요청
서비스 모니터링
배포 파이프라인 증가`,
        },
        { type: 'p', text: '따라서 개발자 수가 적고 하나의 서비스로 운영할 수 있는 프로젝트라면, 처음부터 마이크로서비스를 선택하는 것이 오히려 과도한 설계가 될 수 있습니다.' },

        { type: 'hr' },

        { type: 'h2', text: 'Part 10. 이벤트 기반 아키텍처와 CQRS' },

        { type: 'h3', text: '1. 이벤트 기반 아키텍처' },
        { type: 'p', text: '이벤트 기반 아키텍처는 어떤 일이 발생했음을 이벤트로 표현하고, 필요한 기능이 해당 이벤트를 받아 처리하는 방식입니다.' },
        {
            type: 'code',
            language: 'text',
            text:
                `OrderCompletedEvent
├── 재고 차감
├── 이메일 발송
├── 포인트 적립
└── 통계 기록`,
        },
        { type: 'p', text: '주문 서비스가 이메일과 통계 기능을 직접 호출하지 않아도 되므로 기능 사이의 결합도를 낮출 수 있습니다.' },
        { type: 'p', text: '새로운 후속 기능이 추가될 때 기존 주문 로직을 크게 수정하지 않고 이벤트 소비자를 추가할 수도 있습니다.' },
        { type: 'p', text: '반면 이벤트 처리 흐름이 코드에 직접 드러나지 않아 디버깅과 추적이 어려울 수 있습니다.' },
        { type: 'p', text: '중복 이벤트, 처리 순서, 실패 재시도, 최종적 일관성도 함께 고려해야 합니다.' },
        { type: 'p', text: '초기 프로젝트라면 Kafka부터 도입하기보다 Spring Application Event처럼 단순한 내부 이벤트로 시작하는 방법도 있습니다.' },

        { type: 'h3', text: '2. CQRS' },
        { type: 'p', text: 'CQRS는 데이터를 변경하는 Command와 데이터를 조회하는 Query의 책임을 분리하는 방식입니다.' },
        {
            type: 'code',
            language: 'text',
            text:
                `Command
├── CreateAccountCommand
├── WithdrawAccountCommand
└── CreateOrderCommand

Query
├── GetAccountQuery
├── SearchTermQuery
└── GetOrderDetailQuery`,
        },
        { type: 'p', text: '조회와 변경 로직의 성격이 크게 다를 때 각각을 독립적으로 설계하고 최적화할 수 있습니다.' },
        { type: 'p', text: '하지만 읽기 데이터베이스와 쓰기 데이터베이스까지 처음부터 분리하면 데이터 동기화와 운영 복잡도가 크게 증가합니다.' },
        { type: 'p', text: '소규모 프로젝트에서는 같은 데이터베이스를 사용하면서 Command Handler와 Query Handler 정도만 분리하는 가벼운 방식으로 시작할 수 있습니다.' },

        { type: 'hr' },

        { type: 'h2', text: 'Part 11. 아키텍처별 특징 비교' },

        {
            type: 'table',
            headers: ['구조', '핵심 목적', '장점', '주요 단점', '적합한 상황'],
            rows: [
                ['레이어드', '기술 역할별 계층 분리', '쉽고 빠르게 개발 가능', 'Service 비대화와 기술 중심 분리', 'CRUD 중심 서비스'],
                ['클린', '핵심 규칙과 외부 기술 분리', '테스트와 기술 교체에 유리', '인터페이스와 클래스 증가', '장기 운영, 복잡한 정책'],
                ['헥사고날', '포트와 어댑터로 외부 연동 격리', 'DB와 외부 API 교체에 유리', '단순 기능에는 과도할 수 있음', '외부 연동이 많은 서비스'],
                ['어니언', '도메인을 구조의 중심에 배치', '도메인 규칙 보호', '높은 모델링과 학습 비용', '복잡한 도메인 시스템'],
                ['버티컬 슬라이스', '기능별 코드 응집', '기능 변경과 병렬 개발에 유리', '중복과 공통화 기준 필요', '기능 추가가 잦은 서비스'],
                ['모놀리스', '하나의 애플리케이션과 배포 단위', '개발과 운영이 단순', '규모 증가 시 결합도 상승', '초기 및 소규모 서비스'],
                ['모듈러 모놀리스', '단일 배포와 도메인 경계 결합', '단순성과 확장성의 균형', '모듈 경계를 지속적으로 통제해야 함', '소규모와 중간 규모 팀'],
                ['마이크로서비스', '서비스별 독립 배포와 확장', '팀 자율성과 독립 확장', '분산 시스템 운영 복잡성', '큰 조직과 대규모 서비스'],
                ['이벤트 기반', '이벤트로 느슨한 연결', '비동기 처리와 기능 확장에 유리', '추적과 일관성 관리 어려움', '알림, 통계, 후속 처리'],
                ['CQRS', '조회와 변경 책임 분리', '각 흐름을 독립적으로 최적화', '구조와 데이터 동기화 복잡성', '조회와 변경 성격이 크게 다른 경우'],
            ],
        },

        { type: 'hr' },

        { type: 'h2', text: 'Part 12. I-Poten의 구조를 다시 본다면' },

        { type: 'p', text: 'I-Poten의 초기 구조에 레이어드 아키텍처를 적용한 것은 잘못된 선택이 아니었습니다.' },
        { type: 'p', text: '포텐워드, 포텐퀴즈, 포텐노트 기능을 빠르게 구현하고 전체 학습 흐름을 검증해야 했기 때문에, 익숙하고 단순한 구조가 프로젝트 속도에 도움이 됐습니다.' },
        { type: 'p', text: '다만 프로젝트가 계속 성장한다면 다음과 같은 개선을 검토할 수 있습니다.' },
        {
            type: 'table',
            headers: ['현재 또는 예상 문제', '개선 방향'],
            rows: [
                ['TermService와 QuizService에 기능이 계속 추가됨', '등록, 검색, 문제 출제 같은 유스케이스별 버티컬 슬라이스 적용'],
                ['회원, 인증, 프로필, 혜택 책임이 섞임', 'Account, Authentication, Profile, Benefit 모듈 분리'],
                ['외부 소셜 로그인 구현이 Service에 직접 연결됨', 'SocialAuthPort와 Provider Adapter 적용'],
                ['이메일과 통계 처리 때문에 핵심 로직이 복잡해짐', '도메인 이벤트 또는 애플리케이션 이벤트로 후속 처리 분리'],
                ['다른 도메인의 Repository를 직접 참조함', '모듈이 공개한 인터페이스 또는 이벤트를 통해 통신'],
            ],
        },
        { type: 'p', text: '모든 기능을 한 번에 클린 아키텍처로 변경할 필요는 없습니다.' },
        { type: 'p', text: '변경이 잦거나 외부 의존성이 많은 부분부터 경계를 분리하고, 단순한 CRUD 기능은 기존 레이어드 구조를 유지하는 점진적인 접근이 더 현실적입니다.' },

        { type: 'hr' },

        { type: 'h2', text: 'Part 13. 다음 팀 프로젝트에서의 추천 구조' },

        { type: 'p', text: '친구들과 Spring Boot 기반의 새로운 프로젝트를 진행한다면, 첫 번째 후보로 모듈러 모놀리스를 검토하려 합니다.' },
        {
            type: 'code',
            language: 'text',
            text:
                `com.example.project
├── account
│   ├── domain
│   ├── application
│   ├── infrastructure
│   └── presentation
├── product
│   ├── domain
│   ├── application
│   ├── infrastructure
│   └── presentation
├── order
├── payment
└── common`,
        },
        { type: 'p', text: '배포 단위는 하나로 유지하면서 회원, 상품, 주문, 결제 같은 업무 경계를 명확히 나누는 방식입니다.' },
        { type: 'p', text: '그리고 각 모듈의 복잡도에 따라 내부 구조를 다르게 선택할 수 있습니다.' },
        {
            type: 'table',
            headers: ['기능 또는 모듈', '추천 구조', '이유'],
            rows: [
                ['단순 카테고리와 공지 조회', '레이어드', '복잡한 추상화 없이 빠르게 개발 가능'],
                ['회원가입과 회원 탈퇴', '유스케이스 중심 또는 버티컬 슬라이스', '정책별 변경 범위를 명확히 구분'],
                ['소셜 로그인과 파일 저장', '헥사고날', '외부 제공자와 저장 기술을 어댑터로 격리'],
                ['주문과 결제', '도메인 중심 레이어드 또는 헥사고날', '상태 전이와 외부 결제 연동을 분리'],
                ['알림과 통계', '이벤트 기반', '핵심 요청과 후속 처리를 느슨하게 연결'],
            ],
        },
        { type: 'p', text: '이 방식은 레이어드 아키텍처의 익숙함을 버리지 않으면서도, 도메인 경계와 의존성 관리 방법을 연습할 수 있다는 장점이 있습니다.' },
        { type: 'p', text: '또한 실제로 특정 모듈의 트래픽이나 배포 주기가 달라졌을 때 해당 모듈을 마이크로서비스로 분리할 수 있는 기반도 마련할 수 있습니다.' },

        { type: 'hr' },

        { type: 'h2', text: 'Part 14. 아키텍처를 선택할 때 확인할 질문' },

        { type: 'p', text: '새 프로젝트를 시작할 때는 아키텍처 이름부터 결정하기보다 프로젝트의 조건을 먼저 확인해야 합니다.' },
        {
            type: 'code',
            language: 'text',
            text:
                `1. 프로젝트의 핵심 도메인은 무엇인가?
2. 어떤 기능과 정책이 자주 변경될 것인가?
3. 외부 API와 인프라 연동은 얼마나 많은가?
4. 반드시 하나의 트랜잭션으로 처리해야 하는 범위는 어디까지인가?
5. 조회와 변경의 복잡도가 크게 다른가?
6. 기능별 독립 배포가 실제로 필요한가?
7. 팀이 분산 시스템을 운영할 수 있는가?
8. 테스트에서 격리해야 할 외부 기술은 무엇인가?
9. 현재 필요한 구조인가, 미래를 예상한 과도한 구조인가?
10. 팀원 모두가 구조의 이유와 규칙을 이해하고 있는가?`,
        },
        { type: 'p', text: '예를 들어 개발자 네 명이 하나의 서버로 서비스를 운영하면서 기능별 독립 배포가 필요하지 않다면, 마이크로서비스보다 모듈러 모놀리스가 더 적절할 가능성이 높습니다.' },
        { type: 'p', text: '반대로 결제 제공자가 여러 개이고 외부 연동 테스트가 중요하다면, 결제 모듈에는 헥사고날 아키텍처를 적용할 이유가 생깁니다.' },
        { type: 'p', text: '아키텍처 선택은 정답을 맞히는 문제가 아니라, 프로젝트 조건과 비용 사이에서 근거 있는 결정을 내리는 과정입니다.' },

        { type: 'hr' },

        { type: 'h2', text: 'Part 15. Architecture Decision Record로 결정 남기기' },

        { type: 'p', text: '팀에서 아키텍처를 탐구하고 선택했다면, 결정의 이유를 문서로 남기는 것이 좋습니다.' },
        { type: 'p', text: 'Architecture Decision Record, 줄여서 ADR은 하나의 기술 결정을 짧게 기록하는 문서입니다.' },
        {
            type: 'code',
            language: 'text',
            text:
                `제목
모듈러 모놀리스 구조를 선택한다

상황
개발 인원은 4명이다.
회원, 상품, 주문, 결제 기능을 개발한다.
초기에는 하나의 서버로 배포한다.
업무 영역별 코드 결합은 낮추고 싶다.

검토한 대안
일반 모놀리스
모듈러 모놀리스
마이크로서비스

결정
모듈러 모놀리스를 선택한다.

이유
하나의 배포 단위로 운영 복잡도를 낮출 수 있다.
업무 모듈별 경계를 연습할 수 있다.
필요해지면 특정 모듈을 별도 서비스로 분리할 수 있다.

감수할 단점
모듈 간 직접 참조를 개발 규칙으로 통제해야 한다.
하나의 모듈만 독립적으로 배포할 수 없다.`,
        },
        { type: 'p', text: 'ADR을 작성하면 시간이 지난 뒤에도 왜 해당 구조를 선택했는지 확인할 수 있습니다.' },
        { type: 'p', text: '면접이나 포트폴리오에서도 단순히 특정 아키텍처를 사용했다는 설명보다, 검토한 대안과 선택 이유를 구체적으로 말할 수 있습니다.' },
        {
            type: 'quote',
            text: '초기 팀 규모와 운영 역량을 고려해 마이크로서비스 대신 모듈러 모놀리스를 선택했고, 외부 연동이 많은 결제 모듈에만 포트와 어댑터 구조를 적용했습니다.',
        },

        { type: 'hr' },

        { type: 'h2', text: 'Part 16. 아키텍처를 적용할 때 주의할 점' },

        { type: 'p', text: '아키텍처를 공부하다 보면 더 복잡한 구조가 더 좋은 구조처럼 느껴질 수 있습니다.' },
        { type: 'p', text: '하지만 필요하지 않은 추상화와 계층은 개발 속도를 늦추고 코드를 이해하기 어렵게 만들 수 있습니다.' },
        {
            type: 'table',
            headers: ['주의할 점', '설명'],
            rows: [
                ['폴더만 나누지 않기', '모듈을 나눠도 내부 클래스를 서로 직접 참조하면 경계가 생기지 않음'],
                ['모든 기능에 같은 구조를 강요하지 않기', '단순 CRUD와 복잡한 결제 정책은 필요한 구조가 다름'],
                ['미래 확장만을 이유로 과도하게 설계하지 않기', '실제 요구가 없는 메시지 브로커와 분산 DB는 유지 비용만 높일 수 있음'],
                ['도메인보다 패턴 이름에 집중하지 않기', '클린 아키텍처 폴더를 만들어도 책임이 섞이면 목적을 달성하지 못함'],
                ['팀 규칙을 자동으로 검증하기', '필요하면 패키지 접근 제한이나 ArchUnit으로 모듈 의존성 검사'],
                ['변경 비용을 지속적으로 확인하기', '구조가 실제 변경과 테스트를 쉽게 만드는지 회고해야 함'],
            ],
        },
        { type: 'p', text: '아키텍처는 한 번 정하면 바꿀 수 없는 고정된 정답이 아닙니다.' },
        { type: 'p', text: '프로젝트가 성장하면서 복잡도가 높아진 부분은 더 강한 경계를 적용하고, 불필요하게 복잡한 부분은 다시 단순화할 수 있어야 합니다.' },

        { type: 'hr' },

        { type: 'h2', text: 'Part 17. 이 탐구에서 배운 점' },

        { type: 'p', text: '이번 아키텍처 탐구를 통해 배운 점은 크게 네 가지입니다.' },
        { type: 'p', text: '첫 번째, 익숙한 구조를 사용하는 것과 근거 없이 사용하는 것은 다르다는 점입니다.' },
        { type: 'p', text: 'I-Poten 초기 단계에서 레이어드 아키텍처는 빠른 기능 개발과 팀 적응에 적합했습니다. 이제는 그 선택의 장점과 한계를 설명할 수 있게 됐습니다.' },
        { type: 'p', text: '두 번째, 아키텍처는 하나만 고르는 문제가 아니라는 점입니다.' },
        { type: 'p', text: '모듈러 모놀리스 안에 레이어드와 헥사고날 구조를 함께 적용하고, 필요한 후속 처리만 이벤트 기반으로 분리할 수 있습니다.' },
        { type: 'p', text: '세 번째, 복잡한 구조는 실제 문제를 해결할 때만 가치가 있다는 점입니다.' },
        { type: 'p', text: '외부 기술 교체 가능성, 복잡한 정책, 독립 배포 필요성 같은 구체적인 이유가 없다면 단순한 구조가 더 좋은 선택일 수 있습니다.' },
        { type: 'p', text: '네 번째, 선택한 구조보다 선택 과정과 팀의 합의가 중요하다는 점입니다.' },
        { type: 'p', text: '아키텍처의 이름을 사용하는 것만으로는 코드 품질이 보장되지 않습니다. 각 경계의 책임과 의존 규칙을 팀원 모두가 이해하고 지켜야 합니다.' },

        { type: 'hr' },

        { type: 'h2', text: '마치며 — 가장 복잡한 구조보다 가장 적절한 구조' },

        { type: 'p', text: 'I-Poten에서는 수업과 예제에서 익숙했던 레이어드 아키텍처로 프로젝트를 시작했습니다.' },
        { type: 'p', text: '그 구조 덕분에 포텐워드와 포텐퀴즈 같은 핵심 기능을 빠르게 만들고 서비스 흐름을 검증할 수 있었습니다.' },
        { type: 'p', text: '하지만 프로젝트를 진행하면서 회원, 인증, 혜택, 데이터 적재처럼 책임이 복잡해지는 영역에서는 단순한 계층 분리만으로 부족할 수 있다는 점도 알게 됐습니다.' },
        { type: 'p', text: '앞으로 새로운 프로젝트를 시작할 때는 먼저 도메인과 변경 가능성, 외부 연동, 팀 규모, 운영 역량을 살펴본 뒤 구조를 선택하려 합니다.' },
        { type: 'p', text: '현재 소규모 팀 프로젝트에 가장 현실적인 출발점은 모듈러 모놀리스라고 생각합니다.' },
        { type: 'p', text: '하나의 애플리케이션으로 개발과 배포를 단순하게 유지하면서, 업무 모듈별 경계를 만들고 필요한 영역에만 헥사고날, 버티컬 슬라이스, 이벤트 기반 구조를 적용하는 방식입니다.' },
        { type: 'p', text: '한 문장으로 정리하면 다음과 같습니다.' },
        {
            type: 'quote',
            text: '좋은 아키텍처는 가장 복잡하고 멋진 구조가 아니라, 현재 팀이 감당할 수 있으면서 중요한 변경으로부터 핵심 코드를 보호하는 가장 단순한 구조다.',
        },
        { type: 'p', text: '이번 탐구는 특정 아키텍처의 정답을 찾는 과정이라기보다, 프로젝트 상황에 따라 구조를 비교하고 선택할 수 있는 기준을 만드는 과정이었습니다.' },
        { type: 'p', text: '다음 프로젝트에서는 구조를 먼저 따라 하기보다, 우리가 해결해야 하는 문제와 선택의 이유를 ADR로 남기며 아키텍처를 적용해보려 합니다.' },
    ],
};