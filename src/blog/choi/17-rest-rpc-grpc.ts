import type { BlogPost } from '../../data';

export const post17: BlogPost = {
  id: '17',
  package: 'choi',
  title: 'REST, RPC, gRPC — 명사로 말할까, 동사로 말할까',
  excerpt:
    '이름은 비슷한데 층위가 다른 셋을 짧게 정리했습니다. REST는 명사로, RPC는 동사로 말하는 방식이고, gRPC는 그 RPC를 빠르고 엄격하게 만든 구현체입니다. 스트리밍과 모바일 앱 이야기, 언제 무엇을 쓰는지까지 한 번에.',
  category: 'Backend',
  authorOverride: { name: 'Mr.Choi', role: 'I-Poten Backend Developer', accent: '#0EA5E9' },
  publishedAt: '2026-08-21',
  readingMinutes: 10,
  cover: 'linear-gradient(135deg,#0EA5E9 0%,#1E3A8A 60%,#0F172A 100%)',
  tags: ['REST', 'RPC', 'gRPC', 'API', 'Protobuf'],
  body: [
    {
      type: 'p',
      text: '"1001번 주문을 취소해줘." 서버에 이 일을 시키는 방법은 하나가 아닙니다. 그리고 셋 중 무엇을 고르냐에 따라 주소의 생김새부터 달라집니다.',
    },
    {
      type: 'image',
      src: '/blog/choi/17/three-ways.svg',
      alt: '같은 주문 취소를 REST는 DELETE /orders/1001로, RPC는 POST /cancelOrder로, gRPC는 OrderService.CancelOrder 바이너리 호출로 표현한다',
      caption: '같은 일인데 말투가 다릅니다. 이 차이가 전부라고 해도 과언이 아닙니다.',
    },
    {
      type: 'p',
      text: '먼저 층위 정리부터 하고 가겠습니다. 셋이 나란한 선택지처럼 보이지만 그렇지 않습니다. **REST와 RPC는 "어떻게 말할까"에 대한 스타일이고, gRPC는 RPC를 실제로 구현한 제품**입니다. "한식이냐 양식이냐" 옆에 "특정 브랜드 레스토랑"이 같이 놓인 셈이죠.',
    },

    { type: 'hr' },

    { type: 'h2', text: 'REST — 명사로 말한다' },
    {
      type: 'p',
      text: 'REST는 세상을 **자원(명사)**으로 봅니다. 주문, 사용자, 상품처럼요. 주소는 그 자원이 어디 있는지를 가리키고, 무엇을 할지는 HTTP가 원래 갖고 있던 **표준 메서드**로 표현합니다.',
    },
    {
      type: 'code',
      language: 'text',
      text: `GET    /orders/1001    조회
POST   /orders         생성
PUT    /orders/1001    수정
DELETE /orders/1001    삭제

주소 = 무엇을(명사) · 메서드 = 어떻게(동사)`,
    },
    {
      type: 'p',
      text: '장점은 **누구나 읽을 수 있다**는 것입니다. `GET /orders/1001`을 보면 설명 없이도 무슨 뜻인지 압니다. 게다가 GET은 캐시되고, 브라우저·프록시·CDN 같은 웹 인프라 전체가 이 규칙을 이미 알고 있어 그대로 얹혀 갑니다. 데이터를 JSON으로 주고받으니 눈으로 보고 디버깅하기도 쉽고요.',
    },
    {
      type: 'p',
      text: '단점은 **모든 일이 명사로 잘 표현되지는 않는다**는 점입니다. "주문 취소", "메일 발송", "재고 일괄 조정" 같은 건 애초에 동사죠. 억지로 자원처럼 만들다 보면 오히려 어색해집니다. (이 고민은 이전 글 "RESTful API, 어디까지 지켜야 할까?"에서 길게 다뤘습니다.)',
    },

    { type: 'hr' },

    { type: 'h2', text: 'RPC — 동사로 말한다' },
    {
      type: 'p',
      text: 'RPC(Remote Procedure Call)는 발상이 정반대입니다. 이름 그대로 **원격에 있는 함수를 부르는 것**입니다. 자원이 어디 있는지는 관심 없고, "이 함수를 실행해줘"라고 말합니다.',
    },
    {
      type: 'code',
      language: 'text',
      text: `POST /cancelOrder      { "orderId": 1001 }
POST /sendEmail        { "to": "...", "subject": "..." }

주소 = 함수 이름(동사) · 메서드는 대부분 POST 하나`,
    },
    {
      type: 'p',
      text: '목표는 **원격 호출을 로컬 함수 호출처럼 느끼게 하는 것**입니다. 서버 어딘가에 있는 코드를 마치 내 코드처럼 부르는 거죠. 그래서 행위 중심 작업에 자연스럽고, 이름만 봐도 무슨 일이 벌어지는지 명확합니다. Slack API가 `chat.postMessage`처럼 부르는 게 딱 이 스타일입니다.',
    },
    {
      type: 'p',
      text: '대신 잃는 것도 분명합니다. 전부 POST라 **캐시를 못 쓰고**, 함수 이름을 팀이 알아서 정해야 하니 **일관성을 스스로 지켜야** 합니다. `cancelOrder`인지 `orderCancel`인지 `deleteOrder`인지는 아무도 정해주지 않으니까요.',
    },

    { type: 'hr' },

    { type: 'h2', text: 'gRPC — RPC를 빠르고 엄격하게' },
    {
      type: 'p',
      text: 'gRPC는 구글이 만든 RPC 구현체입니다. RPC의 "함수를 부른다"는 발상은 그대로 두고, 두 가지를 더했습니다.',
    },
    {
      type: 'p',
      text: '**첫째, 계약서를 먼저 나눠 갖습니다.** `.proto`라는 파일에 어떤 함수가 있고 무엇을 주고받는지 미리 정의합니다. 그러면 서버 코드와 클라이언트 코드가 이 파일에서 **자동으로 생성**됩니다.',
    },
    {
      type: 'code',
      language: 'text',
      text: `service OrderService {
  rpc CancelOrder (CancelRequest) returns (CancelResponse);
}

message CancelRequest {
  int64 order_id = 1;
}`,
    },
    {
      type: 'p',
      text: '덕분에 **오타가 컴파일 단계에서 걸립니다.** JSON은 필드 이름을 잘못 써도 실행해봐야 알지만, gRPC는 코드가 생성된 시점부터 타입이 맞춰져 있습니다.',
    },
    {
      type: 'p',
      text: '**둘째, 사람이 읽는 텍스트 대신 바이너리로 보냅니다.** JSON은 `{"orderId": 1001}`처럼 필드 이름까지 전부 글자로 실려 가지만, gRPC는 미리 계약서를 공유했으니 "1번 필드는 1001"이라고만 보내면 됩니다. 여기에 HTTP/2를 써서 한 연결로 여러 요청을 동시에 흘려보냅니다. 그래서 **작고 빠릅니다.**',
    },
    {
      type: 'p',
      text: '문제는 그 대가입니다. 바이너리라 **사람이 눈으로 못 읽습니다.** `curl`로 찔러보거나 브라우저 개발자 도구로 확인하는 게 안 되고, 전용 도구가 필요합니다. 그리고 **브라우저에서 직접 호출할 수 없어서** 중간에 gRPC-Web 같은 변환 계층을 둬야 합니다. 계약서를 바꿀 때마다 서버·클라이언트가 함께 다시 생성해야 하는 것도 부담이고요.',
    },

    { type: 'hr' },

    { type: 'h2', text: '스트리밍 — gRPC의 진짜 무기' },
    {
      type: 'p',
      text: 'REST는 기본이 **"한 번 묻고 한 번 답한다"** 입니다. 그래서 실시간으로 뭔가를 계속 받아야 하면 방법이 궁색해집니다. 몇 초마다 "새 거 있어요?"라고 계속 물어보거나(폴링), WebSocket 같은 걸 따로 붙여야 하죠.',
    },
    {
      type: 'p',
      text: 'gRPC는 **네 가지 통신 방식이 처음부터 들어 있습니다.** 따로 붙일 필요 없이 `.proto`에 적기만 하면 됩니다.',
    },
    {
      type: 'image',
      src: '/blog/choi/17/streaming-modes.svg',
      alt: 'gRPC의 네 가지 통신 방식 — 단일은 1요청 1응답, 서버 스트리밍은 1요청 N응답, 클라이언트 스트리밍은 N요청 1응답, 양방향은 양쪽이 계속 주고받는다',
      caption: '"한 번 묻고 한 번 답한다"는 그중 하나일 뿐입니다.',
    },
    {
      type: 'code',
      language: 'text',
      text: `// stream 키워드 하나로 방식이 바뀐다
rpc GetOrder    (Request)        returns (Response);          // 단일
rpc WatchOrders (Request)        returns (stream Response);   // 서버 스트리밍
rpc UploadFile  (stream Request) returns (Response);          // 클라 스트리밍
rpc Chat        (stream Request) returns (stream Response);   // 양방향`,
    },
    {
      type: 'p',
      text: '차이를 한마디로 하면 — **폴링은 "아직이야? 아직이야?" 하고 계속 물어보는 것**이고, **스트리밍은 "생기면 알려줘" 하고 한 번만 말해두는 것**입니다. 물어보는 횟수가 사라지니 서버 부하도, 배터리도, 응답 지연도 함께 줄어듭니다. 그래서 채팅·실시간 상담, 알림, 위치 공유, 그리고 AI 답변이 한 글자씩 흘러나오는 화면 같은 곳에서 gRPC가 자연스럽게 선택됩니다.',
    },

    { type: 'hr' },

    { type: 'h2', text: '모바일 앱에서 유독 사랑받는 이유' },
    {
      type: 'p',
      text: '서버끼리 쓰는 것 말고도, gRPC는 모바일 앱과 서버 사이에서도 많이 쓰입니다. 이유는 **모바일의 사정이 서버와 다르기 때문**입니다. 망이 느리고 자주 끊기고, 데이터 요금과 배터리가 비싸죠.',
    },
    {
      type: 'list',
      items: [
        '**적게 보내니 싸고 빠르다** — JSON은 `{"orderId": 1001}`처럼 필드 이름까지 매번 글자로 실려 갑니다. gRPC는 계약서를 미리 나눠 가졌으니 "1번 필드는 1001"만 보내면 됩니다. 같은 데이터가 몇 배 작아지고, 지하철처럼 느린 망에서 체감 차이가 큽니다.',
        '**배터리를 덜 쓴다** — 데이터가 작으면 통신 모듈이 켜져 있는 시간이 짧아집니다. 게다가 HTTP/2로 **연결 하나를 계속 재사용**하니, 요청마다 연결을 새로 맺는 비용도 사라집니다.',
        '**앱과 서버의 타입이 어긋나지 않는다** — 같은 `.proto` 하나로 Android(Kotlin)·iOS(Swift)·서버 코드가 **자동 생성**됩니다. "서버는 `orderId`로 보냈는데 앱은 `order_id`로 읽고 있었다" 같은 사고가 구조적으로 사라집니다.',
        '**끊겼다 붙는 상황에 강하다** — 스트리밍이 내장돼 있어 실시간 알림이나 채팅을 별도 기술 없이 같은 연결로 처리할 수 있습니다.',
      ],
    },
    {
      type: 'p',
      text: '다만 앞서 말한 대로 **브라우저에서는 바로 못 씁니다.** 그래서 실무에서 흔한 그림은 — 웹은 REST, 앱은 gRPC, 서버끼리도 gRPC입니다.',
    },

    { type: 'hr' },

    { type: 'h2', text: '그래서 언제 무엇을 쓰나' },
    {
      type: 'table',
      headers: ['', 'REST', 'RPC', 'gRPC'],
      rows: [
        ['중심', '자원(명사)', '함수(동사)', '함수(동사)'],
        ['데이터', 'JSON — 읽힘', 'JSON — 읽힘', '바이너리 — 안 읽힘'],
        ['속도', '보통', '보통', '빠름'],
        ['타입 안전', '없음', '없음', '계약서로 보장'],
        ['캐시', 'GET은 됨', '어려움', '어려움'],
        ['브라우저', '바로 됨', '바로 됨', '변환 계층 필요'],
      ],
    },
    {
      type: 'p',
      text: '표만 보면 gRPC가 이기는 것 같지만, 실무의 답은 "구간마다 다르다"입니다.',
    },
    {
      type: 'image',
      src: '/blog/choi/17/where-to-use.svg',
      alt: '브라우저와 앱에서 서버로 들어오는 바깥 구간은 REST를, 서버 내부 서비스끼리는 gRPC를 쓰는 구조',
      caption: '바깥은 REST, 안쪽은 gRPC — 가장 흔한 조합입니다.',
    },
    {
      type: 'list',
      items: [
        '**외부에 공개하는 API → REST** — 누가 언제 부를지 모릅니다. 설명 없이 이해되고, 브라우저에서 바로 되고, 문서화 생태계가 성숙한 쪽이 유리합니다.',
        '**서버 내부 서비스끼리 → gRPC** — 호출하는 쪽도 받는 쪽도 우리 팀입니다. 전역적인 이해 가능성이 필요 없으니, 대신 속도와 타입 안전을 챙기는 게 이득입니다.',
        '**행위 중심 작업 몇 개만 있다면 → REST에 동사 얹기** — 굳이 갈아탈 필요 없이 `POST /orders/1001/cancel`처럼 필요한 곳에만 동사 엔드포인트를 두면 됩니다.',
      ],
    },

    { type: 'hr' },

    { type: 'h2', text: '마치며' },
    {
      type: 'quote',
      text: 'REST는 명사로, RPC는 동사로 말합니다. gRPC는 그 동사를 계약서와 바이너리로 다듬은 것이고요. 셋 중 하나를 고르는 게 아니라, 구간마다 맞는 말투를 쓰는 문제입니다.',
    },
    {
      type: 'p',
      text: '한 줄씩 다시 정리하면 — REST는 **누구나 읽을 수 있어서** 바깥에 강하고, RPC는 **하려는 일이 그대로 드러나서** 행위 중심 작업에 자연스럽고, gRPC는 **미리 약속했기 때문에** 빠르고 안전합니다. 각 방식이 무엇을 얻으려고 무엇을 포기했는지만 알면, 선택은 어렵지 않습니다.',
    },
    {
      type: 'p',
      text: '부족한 글 읽어주셔서 감사합니다. 피드백은 언제든 환영합니다.',
    },
  ],
};
