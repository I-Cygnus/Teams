import type { BlogPost } from '../../data';

export const post03: BlogPost = {
    id: '3',
    package: 'min',
    project: 'i-poten',
    title: '레이어드 아키텍처를 넘어, 프로젝트에 맞는 구조 선택하기',
    excerpt:
        'I-Poten 백엔드의 실제 구조를 분석하며 레이어드 아키텍처를 사용한 이유와 DDD의 연관성을 살펴보고, 클린 아키텍처와 헥사고날 아키텍처를 포함해 다음 프로젝트에 적합한 구조를 선택하는 기준을 정리합니다.',
    category: 'Backend',
    authorOverride: {
        name: 'min',
        role: 'Fullstack Developer',
        accent: '#3B82F6',
    },
    publishedAt: '2026-07-13',
    readingMinutes: 14,
    cover: 'linear-gradient(135deg,#0F172A 0%,#334155 45%,#2563EB 100%)',
    coverImage: '/blog/min/03/architecture.png',
    tags: [
        'Software Architecture',
        'Layered Architecture',
        'Clean Architecture',
        'Hexagonal Architecture',
        'DDD',
        'Modular Monolith',
        'Spring Boot',
    ],
    body: [
        { type: 'p', text: 'I-Poten 프로젝트를 개발하면서 백엔드 구조로 주로 레이어드 아키텍처를 사용했습니다.' },
        {
            type: 'code',
            language: 'text',
            text:
                `Controller
→ Service
→ Repository
→ Database`,
        },
        { type: 'p', text: 'Controller에서 요청을 받고, Service에서 업무 흐름을 처리한 뒤, Repository를 통해 데이터베이스에 접근하는 익숙한 구조였습니다.' },
        { type: 'p', text: '하지만 처음부터 여러 아키텍처를 비교하고 I-Poten에 가장 적합한 구조로 선택했던 것은 아니었습니다.' },
        { type: 'p', text: '수업과 예제 프로젝트에서 자주 사용하던 구조였기 때문에 자연스럽게 적용했고, 당시에는 왜 이 구조가 적합한지 깊게 고민하지 못했습니다.' },
        {
            type: 'quote',
            text: '우리는 왜 레이어드 아키텍처를 사용했을까? 현재 I-Poten의 구조는 무엇이며, 다음 프로젝트에서도 같은 선택이 적절할까?',
        },
        { type: 'p', text: '이 질문에 답하기 위해 I-Poten-Backend의 패키지 구조, 의존 관계, 주요 요청 흐름과 외부 시스템 연동 방식을 다시 살펴봤습니다.' },
        { type: 'p', text: '이번 글에서는 I-Poten의 현재 구조와 장단점을 분석하고, 다음 프로젝트에서 아키텍처를 선택할 때 고려해야 할 기준을 정리합니다.' },

        { type: 'hr' },

        { type: 'h2', text: 'Part 1. 아키텍처가 필요한 이유' },

        { type: 'p', text: '소프트웨어 아키텍처는 단순히 폴더를 보기 좋게 나누는 규칙이 아닙니다.' },
        { type: 'p', text: '각 코드의 책임과 의존 방향을 정하고, 변경이 발생했을 때 수정 범위를 제한하는 기준입니다.' },
        {
            type: 'code',
            language: 'text',
            text:
                `비즈니스 규칙은 어디에 작성할 것인가?
데이터베이스 접근은 누가 담당할 것인가?
외부 API가 바뀌면 어느 코드까지 수정해야 하는가?
다른 도메인의 내부 코드에 직접 접근해도 되는가?`,
        },
        { type: 'p', text: '기능이 적을 때는 하나의 Controller나 Service에 여러 로직을 작성해도 동작할 수 있습니다.' },
        { type: 'p', text: '하지만 기능이 늘어나면 채점 정책 하나를 수정했는데 오답노트와 통계 코드까지 영향을 받거나, 외부 서비스 변경 때문에 핵심 업무 흐름까지 수정해야 할 수 있습니다.' },
        {
            type: 'quote',
            text: '아키텍처의 핵심 목적은 변경이 발생했을 때 수정해야 하는 범위를 제한하고, 각 코드가 자신의 책임에 집중하도록 만드는 것입니다.',
        },
        { type: 'p', text: 'I-Poten은 MySQL, Redis, FastAPI, Google TTS, AWS S3, AWS SES, Firebase FCM, OAuth 공급자와 PDF 라이브러리 등 다양한 외부 기술을 사용합니다.' },
        { type: 'p', text: '이런 기술은 교체되거나 정책이 바뀔 수 있으므로, 변화가 핵심 업무 규칙에 직접 번지지 않도록 경계를 둘 필요가 있습니다.' },

        { type: 'hr' },

        { type: 'h2', text: 'Part 2. 아키텍처는 같은 기준에서 비교할 수 없다' },

        { type: 'p', text: '레이어드, 클린, 헥사고날, 모놀리스, 마이크로서비스와 CQRS는 모두 아키텍처 용어이지만 해결하려는 문제가 다릅니다.' },
        {
            type: 'table',
            headers: ['관점', '결정하는 내용', '대표적인 구조'],
            rows: [
                ['애플리케이션 내부 구조', '코드를 어떤 책임과 의존 방향으로 나눌 것인가', '레이어드, 클린, 헥사고날, 버티컬 슬라이스'],
                ['시스템 배포 구조', '하나의 애플리케이션으로 배포할지 여러 서비스로 나눌지', '모놀리스, 모듈러 모놀리스, 마이크로서비스'],
                ['데이터와 통신 구조', '기능과 서비스가 정보를 어떤 방식으로 주고받을지', '이벤트 기반, 메시지 기반, CQRS'],
                ['사용자 인터페이스 구조', '입력과 화면 표현, 상태를 어떻게 분리할지', 'MVC, MVVM'],
            ],
        },
        { type: 'p', text: '따라서 실제 프로젝트에서는 하나만 선택하는 것이 아니라 서로 다른 관점의 구조를 조합할 수 있습니다.' },
        {
            type: 'code',
            language: 'text',
            text:
                `배포 구조
→ 모듈러 모놀리스

모듈 내부 구조
→ 레이어드 또는 헥사고날

후속 처리
→ 이벤트 기반`,
        },
        { type: 'p', text: '예를 들어 하나의 Spring Boot 모놀리스 안에서 기본 기능은 레이어드로 구현하고, 외부 API 연동 영역에만 헥사고날 구조를 적용할 수 있습니다.' },

        { type: 'hr' },

        { type: 'h2', text: 'Part 3. 레이어드 아키텍처란 무엇인가' },

        { type: 'p', text: '레이어드 아키텍처는 애플리케이션을 역할에 따라 여러 계층으로 나누는 구조입니다.' },
        {
            type: 'code',
            language: 'text',
            text:
                `Client
  ↓
Controller
  ↓
Service
  ↓
Repository
  ↓
Database`,
        },
        {
            type: 'table',
            headers: ['계층', '주요 역할', 'I-Poten 예시'],
            rows: [
                ['Controller', 'HTTP 요청과 응답, 입력값 검증', 'TermController, QuizSessionController'],
                ['Service', '유스케이스와 트랜잭션 흐름 조율', 'TermServiceImpl, SignupServiceImpl'],
                ['Repository', '데이터베이스 조회와 저장', 'TermRepository, AccountRepository'],
                ['Entity', '식별자와 상태를 가진 객체', 'Term, Account, QuizSession'],
                ['DTO', 'API 요청·응답과 내부 모델 분리', 'RequestForm, ResponseForm'],
            ],
        },
        { type: 'p', text: 'Controller는 HTTP 요청을 해석하고 Service를 호출하며, Service는 유스케이스의 전체 순서를 조율합니다.' },
        { type: 'p', text: 'Repository는 데이터 접근을 담당하고, Entity는 자신의 상태와 업무 규칙을 표현합니다.' },
        {
            type: 'code',
            language: 'java',
            text:
                `quizSession.start();
quizSession.submit();
quizSession.expire();`,
        },
        { type: 'p', text: '단순 setter보다 업무 의미가 드러나는 메서드를 사용하면 상태 변경 규칙을 객체 안에서 보호할 수 있습니다.' },
        { type: 'p', text: 'DTO를 사용하면 외부 API 형식과 JPA Entity를 분리하고, 내부 데이터 구조가 응답에 그대로 노출되는 문제를 줄일 수 있습니다.' },

        { type: 'hr' },

        { type: 'h2', text: 'Part 4. I-Poten은 어떤 아키텍처인가' },

        { type: 'p', text: 'I-Poten-Backend는 Controller, Service와 Repository를 각각 하나의 전역 패키지에 모아 둔 전통적인 계층 우선 구조는 아닙니다.' },
        { type: 'p', text: '먼저 기능 또는 도메인별로 패키지를 나누고, 각 패키지 안에 필요한 계층을 배치합니다.' },
        {
            type: 'code',
            language: 'text',
            text:
                `com.cygnus.ipoten
├── account
│   ├── controller
│   ├── service
│   ├── repository
│   └── entity
├── term
│   ├── controller
│   ├── service
│   ├── repository
│   └── entity
├── quiz_session
├── wordbook
└── interview`,
        },
        { type: 'p', text: '또한 하나의 Spring Boot 애플리케이션과 하나의 JAR로 배포되며, 기능별 독립 서버와 독립 데이터베이스는 존재하지 않습니다.' },
        {
            type: 'quote',
            text: 'I-Poten은 기능과 도메인별 패키지 내부에 Controller, Service, Repository와 Entity를 배치한 도메인형 레이어드 모놀리스입니다.',
        },
        { type: 'p', text: '다만 기능별 패키지가 있다고 해서 바로 모듈러 모놀리스가 되는 것은 아닙니다.' },
        { type: 'p', text: '다른 기능의 Entity와 Repository를 직접 참조하거나 Controller가 Repository를 직접 호출하는 부분이 있어, 내부 접근 규칙과 의존 경계가 강제된 구조는 아닙니다.' },

        { type: 'hr' },

        { type: 'h2', text: 'Part 5. I-Poten은 왜 레이어드 아키텍처로 시작했을까' },

        { type: 'p', text: 'I-Poten 저장소에는 아키텍처 선택 이유를 기록한 ADR이나 별도의 설계 문서가 없습니다.' },
        { type: 'p', text: '따라서 처음부터 명확한 근거를 가지고 레이어드 아키텍처를 선택했다고 단정할 수는 없지만, 당시의 조건을 통해 이유를 추론할 수 있습니다.' },
        {
            type: 'table',
            headers: ['당시의 조건', '레이어드 구조가 적합했던 이유'],
            rows: [
                ['Spring 학습 경험', 'Controller, Service, JpaRepository 구조가 팀에 익숙했음'],
                ['빠른 기능 검증', 'CRUD와 일반적인 API를 짧은 시간에 구현하기 쉬웠음'],
                ['낮은 초기 설계 비용', '복잡한 Port, Adapter와 모듈 경계를 먼저 설계하지 않아도 됐음'],
                ['하나의 애플리케이션', '여러 데이터를 하나의 트랜잭션으로 처리하기 쉬웠음'],
                ['단순한 운영', '하나의 JAR과 서버로 개발·배포할 수 있었음'],
            ],
        },
        { type: 'p', text: '초기에는 완벽한 경계를 만드는 것보다 서비스를 완성하고 사용자 흐름을 검증하는 것이 중요했습니다.' },
        {
            type: 'quote',
            text: 'I-Poten은 DDD를 적용하기 위해 레이어드 아키텍처를 선택한 것이 아니라, 익숙하고 빠르게 개발하기 좋은 구조로 시작한 뒤 복잡한 영역에 도메인 설계 요소를 점진적으로 추가한 프로젝트에 가깝습니다.',
        },

        { type: 'hr' },

        { type: 'h2', text: 'Part 6. 레이어드 아키텍처와 DDD의 관계' },

        {
            type: 'table',
            headers: ['개념', '핵심 질문'],
            rows: [
                ['레이어드 아키텍처', '코드를 어떤 역할의 계층으로 나눌 것인가'],
                ['DDD', '실제 업무와 규칙을 어떤 모델과 경계로 표현할 것인가'],
            ],
        },
        { type: 'p', text: 'DDD는 실제 업무에서 사용하는 용어를 코드에 반영하고, 서로 다른 업무 영역의 경계를 구분하며, 중요한 규칙을 도메인 객체에 표현하는 설계 접근입니다.' },
        {
            type: 'code',
            language: 'text',
            text:
                `Controller가 존재한다
Service가 존재한다
Repository가 존재한다
Entity가 존재한다

≠ DDD를 적용했다`,
        },
        { type: 'p', text: '레이어드는 책임을 나누는 방식이고, DDD는 업무 모델과 경계를 설계하는 접근이므로 서로 반대되거나 상하 관계인 개념은 아닙니다.' },
        { type: 'p', text: '레이어드 아키텍처 위에서도 DDD를 적용할 수 있고, 클린 또는 헥사고날 아키텍처와 함께 사용할 수도 있습니다.' },

        { type: 'hr' },

        { type: 'h2', text: 'Part 7. I-Poten은 DDD를 적용한 프로젝트인가' },

        { type: 'p', text: 'I-Poten은 처음부터 완전한 DDD 구조를 목표로 만든 프로젝트는 아니었습니다.' },
        { type: 'p', text: '다만 일부 영역에서는 도메인의 개념과 규칙을 코드로 표현하려는 전술적 DDD 요소가 나타납니다.' },
        {
            type: 'table',
            headers: ['DDD 요소', 'I-Poten에서 확인된 모습'],
            rows: [
                ['유비쿼터스 언어', 'Account, Rejoin, QuizSession, WrongNote, LearningProgress 같은 업무 용어 사용'],
                ['도메인 메서드', 'Account의 탈퇴·재가입, QuizSession의 시작·제출·만료를 의미 있는 메서드로 표현'],
                ['Value Object', 'ScopeCondition, WrongNoteScope처럼 퀴즈 범위와 조건을 객체로 표현'],
                ['도메인 이벤트', 'AccountSignedUpEvent 발행 후 Listener가 가입 크레딧 지급'],
                ['전략 패턴', '면접 유형과 질문 순서에 따라 서로 다른 Strategy 사용'],
            ],
        },
        { type: 'p', text: '한편 본격적인 DDD에서는 패키지 이름뿐 아니라 업무 경계와 객체의 변경 규칙도 함께 설계합니다.' },
        {
            type: 'table',
            headers: ['구조적 기준', '쉬운 설명', 'I-Poten의 현재 모습'],
            rows: [
                ['Bounded Context', '용어, 퀴즈, 단어장처럼 모델의 의미가 유지되는 업무 범위', '패키지는 나뉘었지만 서로의 Entity를 직접 참조하는 부분이 있음'],
                ['Aggregate와 Root', '함께 일관성을 지켜야 하는 객체 묶음과 그 대표 객체', 'QuizSession에 상태 변경 메서드는 있지만 답안과 오답노트가 별도로 처리됨'],
                ['Aggregate 중심 Repository', '테이블보다 대표 객체를 중심으로 조회하고 저장하는 방식', 'Entity와 테이블별 Repository를 각각 사용하는 경우가 많음'],
                ['Service 역할 구분', '유스케이스 조율과 순수 업무 규칙 계산을 구분하는 것', '조회, 저장, 계산과 외부 호출이 하나의 Service에 섞이는 경우가 있음'],
                ['순수 Domain Model', 'Spring, JPA와 외부 API를 모르는 비즈니스 객체', '대부분의 Entity가 JPA에 의존함'],
                ['도메인 간 접근 규칙', '다른 도메인의 내부 코드 대신 공개 인터페이스로 협력하는 것', '다른 기능의 Entity와 Repository를 직접 참조하는 사례가 있음'],
            ],
        },

        { type: 'h3', text: '퀴즈 세션으로 이해하는 Aggregate' },
        {
            type: 'code',
            language: 'text',
            text:
                `QuizSession
├── 제출한 답안
├── 점수
└── 세션 상태`,
        },
        { type: 'p', text: '이 객체들을 하나의 묶음으로 관리한다면 QuizSession을 대표 객체로 두고, 답안 제출과 상태 변경을 QuizSession을 통해 처리할 수 있습니다.' },
        {
            type: 'code',
            language: 'java',
            text:
                `QuizSession session =
        quizSessionRepository.findById(sessionId);

session.submit(gradingResult);

quizSessionRepository.save(session);`,
        },
        { type: 'p', text: '현재 I-Poten에도 QuizSession.submit() 같은 도메인 메서드가 있지만, 모든 관련 변경이 QuizSession을 통해 통제되는 구조는 아닙니다.' },
        {
            type: 'quote',
            text: 'I-Poten은 익숙한 레이어드 구조로 서비스를 완성한 뒤, 복잡도가 높아진 영역부터 필요한 도메인 설계 요소를 적용해온 프로젝트에 가깝습니다.',
        },

        { type: 'hr' },

        { type: 'h2', text: 'Part 8. 현재 구조에서 얻은 장점과 한계' },

        { type: 'h3', text: '레이어드 모놀리스로 얻은 장점' },
        {
            type: 'table',
            headers: ['장점', 'I-Poten에서 얻은 효과'],
            rows: [
                ['역할 구분', 'HTTP 처리, 유스케이스와 데이터 접근을 나눌 수 있었음'],
                ['빠른 기능 개발', 'Spring MVC와 Spring Data JPA로 API를 빠르게 추가'],
                ['코드 탐색', 'account, term, quiz와 wordbook 등 기능명을 기준으로 코드를 찾기 쉬움'],
                ['트랜잭션 관리', '여러 데이터 변경을 하나의 트랜잭션에서 처리하기 쉬움'],
                ['단순한 운영', '하나의 JAR과 배포 단위를 유지해 운영 복잡도를 낮춤'],
            ],
        },

        { type: 'h3', text: '프로젝트가 커지며 드러난 한계' },
        {
            type: 'table',
            headers: ['한계', 'I-Poten에서 확인된 모습'],
            rows: [
                ['계층 우회', '일부 Controller가 Service를 거치지 않고 Repository를 직접 호출'],
                ['Service 비대화', '검증, 계산, 저장, DTO 조립과 외부 호출이 하나의 Service에 집중'],
                ['도메인 간 결합', '서로 다른 기능이 다른 영역의 Entity와 Repository를 직접 참조'],
                ['의존성 순환', '일부 Service와 Strategy가 서로 참조하며 @Lazy로 문제를 완화'],
                ['외부 기술 결합', 'FastAPI, TTS, S3와 알림 호출이 핵심 흐름에 함께 포함'],
                ['구조 검증 부재', '계층과 패키지 의존 규칙을 자동으로 검사하는 테스트가 없음'],
            ],
        },
        { type: 'p', text: '이 문제들은 레이어드 아키텍처 자체가 잘못돼서 생긴 것이 아닙니다.' },
        { type: 'p', text: '프로젝트가 성장하는 동안 계층과 도메인 경계를 지키는 규칙이 코드와 테스트로 강제되지 않았기 때문에 나타난 문제에 가깝습니다.' },

        { type: 'hr' },

        { type: 'h2', text: 'Part 9. 클린과 헥사고날 아키텍처는 무엇을 해결하는가' },

        {
            type: 'table',
            headers: ['아키텍처', '핵심 관심사', '대표 질문'],
            rows: [
                ['레이어드', '역할에 따른 계층 분리', 'HTTP, 업무 흐름과 데이터 접근을 어떻게 나눌 것인가'],
                ['클린', '핵심을 향하는 의존성 방향', 'Domain이 Spring, JPA와 외부 API를 몰라도 되는가'],
                ['헥사고날', 'Port와 Adapter를 통한 내부·외부 분리', '외부 공급자를 바꿔도 Application을 유지할 수 있는가'],
            ],
        },
        { type: 'p', text: '세 구조는 비슷한 목표를 공유하지만, 레이어드에서 클린과 헥사고날로 발전하는 일렬의 단계는 아닙니다.' },

        { type: 'h3', text: '클린 아키텍처' },
        {
            type: 'code',
            language: 'text',
            text:
                `Frameworks and Drivers
→ Interface Adapters
→ Application Use Cases
→ Domain Rules`,
        },
        { type: 'p', text: '핵심 업무 규칙이 Spring, JPA, MySQL이나 외부 SDK를 직접 알지 않도록 의존성을 안쪽으로 향하게 합니다.' },

        { type: 'h3', text: '헥사고날 아키텍처' },
        {
            type: 'code',
            language: 'text',
            text:
                `REST Controller
→ Application Service
→ Outbound Port
→ External Adapter`,
        },
        {
            type: 'code',
            language: 'text',
            text:
                `InterviewService
→ AiInterviewPort
→ FastApiInterviewAdapter`,
        },
        { type: 'p', text: 'Application Service는 필요한 기능을 Port로 정의하고, FastAPI와 Google TTS 같은 실제 기술은 Adapter가 구현합니다.' },
        { type: 'p', text: '헥사고날 아키텍처는 MSA에서만 사용하는 구조가 아닙니다. Spring 모놀리스에서도 외부 기술을 격리할 필요가 있다면 적용할 수 있습니다.' },
        { type: 'p', text: '다만 단순한 CRUD까지 모두 Port와 Adapter로 나누면 클래스 수와 이해 비용만 커질 수 있으므로 필요한 영역에 선택적으로 적용하는 편이 좋습니다.' },

        { type: 'hr' },

        { type: 'h2', text: 'Part 10. I-Poten에 가장 현실적인 발전 방향' },

        { type: 'p', text: 'I-Poten의 문제를 해결하기 위해 전체 프로젝트를 클린 또는 헥사고날 아키텍처로 다시 작성할 필요는 없습니다.' },
        {
            type: 'quote',
            text: '아키텍처의 목적은 더 많은 패키지와 인터페이스를 만드는 것이 아니라, 현재 발생하는 문제를 해결할 만큼의 경계를 만드는 것입니다.',
        },
        {
            type: 'code',
            language: 'text',
            text:
                `도메인형 레이어드 모놀리스 유지
+
외부 연동 영역에 헥사고날 적용
+
유스케이스 단위 Service 분리
+
점진적으로 모듈 경계 강화`,
        },

        { type: 'h3', text: '1. 외부 연동부터 Port와 Adapter로 분리한다' },
        {
            type: 'table',
            headers: ['외부 기능', 'Port', 'Adapter 예시'],
            rows: [
                ['AI 면접', 'AiInterviewPort', 'FastApiInterviewAdapter'],
                ['음성 생성', 'TextToSpeechPort', 'GoogleTtsAdapter'],
                ['파일 저장', 'ObjectStoragePort', 'AwsS3Adapter'],
                ['이메일', 'EmailSender', 'AwsSesEmailAdapter'],
                ['푸시 알림', 'PushNotifier', 'FirebaseFcmAdapter'],
                ['PDF 생성', 'PdfRenderer', 'OpenPdfRenderer'],
            ],
        },
        { type: 'p', text: 'I-Poten의 PDF 기능에는 이미 PdfRenderer와 OpenPdfRenderer가 존재해 이와 비슷한 분리가 일부 적용돼 있습니다.' },

        { type: 'h3', text: '2. Controller는 Service만 호출한다' },
        {
            type: 'code',
            language: 'text',
            text:
                `Controller
→ Application Service 또는 Query Service
→ Repository`,
        },
        { type: 'p', text: 'Controller가 Repository를 직접 사용하지 않도록 하고, 단순 조회도 필요한 경우 Query Service를 통해 처리합니다.' },

        { type: 'h3', text: '3. Service를 유스케이스 기준으로 나눈다' },
        {
            type: 'code',
            language: 'text',
            text:
                `QuizSessionService 하나

→ QuizSessionStarter
→ QuizSubmissionService
→ QuizRetryService
→ QuizSessionQueryService
→ QuizGradingPolicy`,
        },
        { type: 'p', text: '클래스의 줄 수가 아니라 변경 이유와 트랜잭션 경계를 기준으로 역할을 나눕니다.' },

        { type: 'h3', text: '4. 다른 도메인의 내부 구현을 직접 참조하지 않는다' },
        {
            type: 'code',
            language: 'text',
            text:
                `지양할 접근
Quiz → TermRepository 직접 호출

개선할 접근
Quiz → TermReader
Quiz → Term 모듈의 Application API`,
        },
        { type: 'p', text: '다른 도메인의 Entity와 Repository 대신 공개된 API, 조회 인터페이스, ID 또는 이벤트를 사용합니다.' },

        { type: 'h3', text: '5. 아키텍처 규칙을 자동으로 확인한다' },
        { type: 'p', text: '아키텍처 규칙은 문서로만 남기면 개발 과정에서 쉽게 무너질 수 있습니다.' },
        { type: 'p', text: 'ArchUnit을 사용하면 Controller의 Repository 직접 호출이나 패키지 순환 의존을 테스트로 확인할 수 있습니다.' },
        {
            type: 'code',
            language: 'text',
            text:
                `지키려는 구조
Controller → Service → Repository

규칙을 어긴 구조
Controller → Repository

순환 의존
quiz → term → quiz`,
        },
        {
            type: 'quote',
            text: 'ArchUnit은 팀에서 정한 아키텍처 규칙을 코드가 지키고 있는지 자동으로 검사하는 도구입니다.',
        },

        { type: 'h3', text: '6. 점진적으로 모듈러 모놀리스에 가까워진다' },
        {
            type: 'code',
            language: 'text',
            text:
                `com.cygnus.ipoten
├── identity
├── terminology
├── quiz
├── wordbook
├── interview
├── notification
└── shared`,
        },
        { type: 'p', text: '처음부터 Gradle 멀티모듈로 모두 나누기보다 패키지 수준에서 상위 도메인 경계와 공개 API를 먼저 정하는 것이 현실적입니다.' },

        { type: 'hr' },

        { type: 'h2', text: 'Part 11. 다음 프로젝트에서 아키텍처를 선택하는 기준' },

        { type: 'p', text: '다음 프로젝트에서는 아키텍처 이름부터 정하기보다 프로젝트의 조건을 먼저 살펴봐야 합니다.' },
        {
            type: 'code',
            language: 'text',
            text:
                `1. 핵심 도메인과 복잡한 업무 규칙은 무엇인가?
2. 자주 변경될 기능은 무엇인가?
3. 외부 API와 인프라 연동은 얼마나 많은가?
4. 하나의 트랜잭션으로 처리해야 하는 범위는 어디까지인가?
5. 기능별 독립 배포가 실제로 필요한가?
6. 팀이 선택한 구조를 이해하고 운영할 수 있는가?`,
        },
        {
            type: 'table',
            headers: ['상황', '우선 검토할 구조'],
            rows: [
                ['단순한 CRUD와 짧은 개발 기간', '레이어드 아키텍처'],
                ['도메인 경계를 나누되 하나의 서버로 운영', '모듈러 모놀리스'],
                ['외부 공급자와 저장 기술의 교체 가능성이 높음', '헥사고날의 Port와 Adapter'],
                ['복잡한 상태 전이와 업무 규칙이 많음', '도메인 중심 레이어드 또는 DDD'],
                ['후속 알림과 통계를 핵심 요청에서 분리', '애플리케이션 이벤트'],
                ['독립 배포와 조직별 소유권이 실제로 필요함', '마이크로서비스 검토'],
            ],
        },
        { type: 'p', text: '모든 기능에 같은 수준의 구조를 적용할 필요는 없습니다.' },
        {
            type: 'code',
            language: 'text',
            text:
                `단순 CRUD
→ 일반 레이어드

AI 면접 외부 연동
→ Port와 Adapter

복잡한 Quiz 상태 전이
→ 도메인 모델과 Policy

가입 후 크레딧과 알림
→ 애플리케이션 이벤트`,
        },

        { type: 'hr' },

        { type: 'h2', text: 'Part 12. Architecture Decision Record로 선택 이유 남기기' },

        { type: 'p', text: '이번 분석에서 가장 아쉬웠던 점은 I-Poten이 왜 현재 구조를 선택했는지 기록한 문서가 없다는 것이었습니다.' },
        { type: 'p', text: 'Architecture Decision Record, 줄여서 ADR은 기술 결정을 내린 상황과 이유, 대안과 단점을 짧게 기록하는 문서입니다.' },
        {
            type: 'code',
            language: 'text',
            text:
                `제목
모듈러 모놀리스를 선택한다

상황
4명이 하나의 서버로 서비스를 개발한다.
기능별 코드 결합은 낮추고 싶다.

검토한 대안
일반 모놀리스
모듈러 모놀리스
마이크로서비스

결정과 이유
운영 복잡도를 낮추면서 업무 경계를 나눌 수 있는
모듈러 모놀리스를 선택한다.

감수할 단점
모듈 간 직접 참조를 규칙과 테스트로 통제해야 한다.`,
        },
        { type: 'p', text: 'ADR을 남기면 시간이 지난 뒤에도 선택 이유를 확인할 수 있고, 면접이나 포트폴리오에서도 검토한 대안과 판단 근거를 구체적으로 설명할 수 있습니다.' },
        { type: 'p', text: '다만 모든 기능에 같은 구조를 강요하거나 미래의 확장만을 예상해 과도하게 설계할 필요는 없습니다.' },
        { type: 'p', text: '복잡해진 영역에는 더 강한 경계를 적용하고, 불필요하게 복잡한 영역은 다시 단순화할 수 있어야 합니다.' },

        { type: 'hr' },

        { type: 'h2', text: '마치며 — 가장 복잡한 구조보다 가장 적절한 구조' },

        { type: 'p', text: 'I-Poten은 수업과 예제에서 익숙했던 레이어드 아키텍처로 시작했습니다.' },
        { type: 'p', text: '그 덕분에 포텐워드, 포텐퀴즈, 포텐노트와 AI 면접 같은 핵심 기능을 빠르게 구현하고 서비스 흐름을 검증할 수 있었습니다.' },
        { type: 'p', text: '프로젝트가 성장하면서 Controller의 Repository 직접 접근, 비대한 Service, 도메인 간 결합과 외부 기술 종속 같은 개선점도 나타났습니다.' },
        { type: 'p', text: '따라서 다음 단계는 전체 프로젝트를 새로운 구조로 다시 작성하는 것이 아니라, 문제가 드러난 영역부터 점진적으로 경계를 강화하는 것입니다.' },
        {
            type: 'code',
            language: 'text',
            text:
                `레이어드 구조의 책임 명확화
→ Controller의 Repository 접근 제거
→ 유스케이스 단위 Service 분리
→ 외부 시스템 Port와 Adapter 적용
→ 도메인 간 직접 참조 감소
→ 아키텍처 규칙 자동 검증
→ 점진적인 모듈러 모놀리스`,
        },
        { type: 'p', text: '다음 프로젝트에서는 도메인의 복잡도, 변경 가능성, 외부 연동, 팀 규모와 운영 역량을 먼저 살펴보고 검토한 대안과 선택 이유를 ADR로 남기려 합니다.' },
        {
            type: 'quote',
            text: '좋은 아키텍처는 가장 복잡하고 멋진 구조가 아니라, 현재 팀이 감당할 수 있으면서 중요한 변경으로부터 핵심 코드를 보호하는 가장 단순한 구조입니다.',
        },
    ],
};