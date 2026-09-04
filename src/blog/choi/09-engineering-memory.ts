import type { BlogPost } from '../../data';

export const post09: BlogPost = {
  id: '9',
  package: 'choi',
  title: 'AI 바이브 코딩, 그다음 — AI와 "협업"이 되려면 무엇이 필요할까',
  excerpt:
    'AI에게 말로 시키는 코딩은 이미 일상이 됐습니다. 그런데 대화가 끝나면 그 맥락은 전부 사라지죠. 바이브 코딩이 일회성 지시를 넘어 진짜 협업이 되려면 무엇이 필요할까 — 저희가 상상해 본 구조를 그림으로 풀어놓고, 함께 이야기해보고 싶어 쓰는 글입니다.',
  category: 'Product',
  authorOverride: { name: 'Mr.Choi', role: 'I-Poten Backend Developer', accent: '#0EA5E9' },
  publishedAt: '2026-08-05',
  readingMinutes: 16,
  cover: 'linear-gradient(135deg,#0EA5E9 0%,#7C3AED 60%,#0F172A 100%)',
  tags: ['Vibe Coding', 'AI', 'Collaboration', 'Engineering Memory', 'Product'],
  body: [
    // ── 도입 ──
    {
      type: 'p',
      text: '요즘 코딩하는 모습을 떠올려보면, 꽤 많은 시간을 AI와 대화하며 보냅니다. "이 기능 이렇게 만들어줘", "Redis랑 DB 중에 뭐가 나을까?" — 말로 시키고, 논의하고, 코드를 받는 이른바 **바이브 코딩(Vibe Coding)**이 이미 일상이 됐죠. 저희도 그렇습니다.',
    },
    {
      type: 'p',
      text: '그런데 쓰면 쓸수록 이상한 지점이 하나 보입니다. 6개월 전에 AI와 한참 논의해서 세션 저장소를 Redis로 정했는데, 지금 남은 건 `feat: 세션 저장소 Redis 적용`이라는 커밋 한 줄뿐입니다. **"왜 Redis였지?"** — 그때 DB와 비교했던 근거, 기각한 이유, 그 모든 대화는 대화창 스크롤 저편으로 증발했습니다. AI와 그렇게 많은 이야기를 나눴는데, **남은 게 없습니다.**',
    },
    {
      type: 'image',
      src: '/blog/choi/09/01-why-memory.svg',
      alt: '일반 개발은 커밋만 남아 6개월 뒤 왜 Redis를 썼는지 아무도 모르지만, 기억하는 개발은 이유까지 남아 기록이 답한다',
      caption: '커밋은 "무엇을 했는가"만 남깁니다. 정작 필요한 건 "왜 그렇게 했는가"인데요.',
    },
    {
      type: 'p',
      text: '여기서 저희의 질문이 시작됐습니다. **지금의 바이브 코딩은 "일회성 지시"에 가깝지, "협업"은 아니지 않나?** 협업이라면 함께 논의한 것이 팀의 기억으로 남아야 하니까요. 그래서 이 글은 정답 발표가 아니라 방향 제안입니다 — AI와의 개발이 협업이 되려면 어떤 구조가 필요할지 저희가 상상해 본 그림을 펼쳐놓고, 같이 이야기해보고 싶어서 씁니다. 기준 문장은 하나입니다. *"AI는 제안하고, 개발자는 결정하고, 시스템은 그 과정을 기억한다."*',
    },

    { type: 'hr' },

    // ── Part 1 ──
    { type: 'h2', text: 'Part 1. 담는 그릇 — Workspace, Feature, Task' },
    {
      type: 'p',
      text: 'AI와의 협업을 남기려면, 먼저 어디에 담을지부터 정해야 합니다. 저희가 상상한 그림은 폴더처럼 안으로 들어가는 3층 구조입니다.',
    },
    {
      type: 'image',
      src: '/blog/choi/09/02-nesting.svg',
      alt: 'Workspace I-Poten 안에 로그인 Feature와 AI 면접 Feature가 있고, 각 Feature 안에 JWT 적용, Refresh Token 같은 Task가 들어 있는 중첩 구조',
      caption: 'Workspace(제품) → Feature(기능) → Task(구현 단위). I-Poten의 실제 예시.',
    },
    {
      type: 'list',
      items: [
        '**Workspace** — 하나의 개발 공간 전체. 예) `I-Poten`(AI 모의면접 서비스). 제품 하나에 공간 하나입니다.',
        '**Feature** — 하나의 기능. 예) `로그인`, `AI 면접`, `결제`.',
        '**Task** — 실제 구현 단위. 예) `JWT 적용`, `Refresh Token`, `비밀번호 암호화`.',
      ],
    },
    {
      type: 'p',
      text: '여기서 놓치면 안 되는 게 하나 있습니다. **Feature는 폴더가 아닙니다.** Task를 묶으려고 만든 그릇이 아니라, *"왜 이 기능이 존재하는가"*를 담는 그릇입니다. 그래서 Feature에는 항상 목표·범위·의도가 따라붙습니다. 로그인 Feature는 "JWT랑 OAuth 태스크가 들어있는 폴더"가 아니라 "안전한 사용자 인증을 제공한다는 목적"인 거죠.',
    },

    { type: 'hr' },

    // ── Part 2 ──
    { type: 'h2', text: 'Part 2. 기획은 맨 위에서 한 번만 하는 게 아니다' },
    {
      type: 'p',
      text: '가장 자주 놓치는 부분이자, 이 구조의 핵심입니다. **기획(Planning)은 층마다 하나씩 있습니다.** 층이 다르면 답해야 할 질문 자체가 다르기 때문입니다.',
    },
    {
      type: 'image',
      src: '/blog/choi/09/03-planning-layers.svg',
      alt: 'Workspace planning은 무엇을 만들 서비스인가, Feature planning은 왜 이 기능이 필요한가, Task planning은 어떻게 구현할 것인가에 답한다',
      caption: '같은 "기획"이라도 층마다 답하는 질문이 다릅니다.',
    },
    {
      type: 'p',
      text: '지도의 축척을 떠올리면 쉽습니다. 세계지도와 동네 지도는 담는 정보가 다르죠. 마찬가지로 *"기술 스택을 왜 이걸로 골랐지?"* 는 **Workspace의 기획**이고, *"왜 OAuth 말고 JWT지?"* 는 **Feature의 기획**이며, *"세션을 Redis에 넣을까 DB에 넣을까?"* 는 **Task의 기획**입니다. 이걸 한 곳에 몰아넣으면 나중에 아무것도 못 찾습니다.',
    },
    {
      type: 'image',
      src: '/blog/choi/09/04-hierarchy.svg',
      alt: 'Workspace-Feature-Task-Workflow 각 계층에 planning이 붙어 있는 전체 계층 구조',
      caption: '전체 그림 — 모든 층에 자기 기획이 붙고, 맨 아래에 시간의 축(Workflow)이 놓입니다.',
    },
    {
      type: 'p',
      text: '전체를 놓고 보면 층이 하나 더 있습니다. Task 아래의 **Workflow** — 시간의 축인데, 이건 Part 4에서 따로 다루겠습니다.',
    },

    { type: 'hr' },

    // ── Part 3 ──
    { type: 'h2', text: 'Part 3. 그 기획은 어떻게 만들어지나 — 논의에서 태어난다' },
    {
      type: 'p',
      text: '기획이 층마다 있다는 건 알았는데, 그 기획은 어디서 오는 걸까요? 혼자 앉아서 문서를 쓰는 게 아닙니다. **AI와 대화하다가 굳어집니다.**',
    },
    {
      type: 'image',
      src: '/blog/choi/09/05-planning-created.svg',
      alt: '사람의 제안과 AI의 되묻기가 오가며 논의가 쌓이고, AI가 초안으로 정리한 뒤 사람이 고쳐 확정하면 Planning V1이 되며 출처 논의가 링크로 붙는다',
      caption: '논의 → AI 초안 → 사람이 확정. 완성된 기획에는 "이 기획이 나온 대화" 링크가 붙습니다.',
    },
    {
      type: 'p',
      text: '흐름은 이렇습니다. 사람이 *"이렇게 하고 싶은데"* 하고 던지면, AI가 *"이 경우는 어떻게 하죠?"* 하고 되묻습니다. 그렇게 오간 대화가 그대로 쌓이고(**논의**), AI가 그걸 목표·범위·대안·근거로 정리해 초안을 냅니다. **사람이 고치고 확정해야 비로소 기획이 됩니다.**',
    },
    {
      type: 'p',
      text: '마지막 줄이 중요합니다. 완성된 기획에는 항상 **"이 기획이 나온 대화" 링크**가 붙습니다. 그래서 나중에 *"왜 이 기획이 이렇게 됐지?"* 를 물으면 그때의 대화로 바로 갈 수 있습니다. (물론 AI 없이 사람이 직접 써도 됩니다. 논의 없이 기획만 생기는 경우인데, 그것도 정상입니다.)',
    },
    { type: 'h3', text: '논의와 기획은 한 쌍 — 그리고 층마다 있다' },
    {
      type: 'table',
      headers: ['', '무엇', '성격'],
      rows: [
        ['논의 (Discussion)', 'AI와 주고받은 대화 그 자체', '과정 · 지저분함 · 계속 늘어남'],
        ['기획 (Planning)', '거기서 합의된 현재 방향', '결론 · 정리됨 · 버전으로 관리'],
      ],
    },
    {
      type: 'p',
      text: '논의가 재료고, 기획이 결과물입니다. 그리고 이 짝이 **계층마다 하나씩** 존재합니다. Task 밑에만 대화창이 있으면 안 됩니다 — 어느 층의 이야기냐에 따라 붙는 자리가 다르니까요.',
    },
    {
      type: 'image',
      src: '/blog/choi/09/06-pair-every-layer.svg',
      alt: 'Workspace, Feature, Task 각 층마다 논의와 기획이 한 쌍으로 존재하는 구조',
      caption: '전략 회의는 Workspace에, 대안 비교는 Feature에, Redis냐 DB냐는 Task에.',
    },

    { type: 'hr' },

    // ── Part 4 ──
    { type: 'h2', text: 'Part 4. 여기까지가 구조, 이제부터는 시간 — Workflow' },
    {
      type: 'p',
      text: '현실에서 Task 하나는 하루에 안 끝납니다. 오늘 Claude로 짜고, 내일 GPT로 고치고, 모레 버그를 잡죠. **그 한 번의 작업 덩어리가 Workflow입니다.**',
    },
    {
      type: 'image',
      src: '/blog/choi/09/07-workflow-cycles.svg',
      alt: 'JWT 적용 Task가 1일차 Claude 구조 논의, 2일차 GPT 구조 개선, 5일차 만료 버그 수정이라는 3개의 Workflow로 나뉜 모습',
      caption: '"JWT 적용" 하나가 실제로는 3번의 작업 사이클로 이뤄집니다.',
    },
    {
      type: 'p',
      text: '칸반 보드는 이걸 담지 못합니다. 보드에서 `JWT 적용`은 카드 하나가 왼쪽에서 오른쪽으로 옮겨간 것뿐이니까요. 하지만 실제로는 저 5일 사이에 **생각이 바뀌었고**, 그 변화가 진짜 자산입니다. 그래서 Workflow를 1급 개념으로 올렸습니다.',
    },
    {
      type: 'p',
      text: '그럼 Workflow 하나의 안쪽은 어떻게 생겼을까요? 생각이 결과가 되는 흐름이 통째로 들어 있습니다.',
    },
    {
      type: 'image',
      src: '/blog/choi/09/08-single-cycle.svg',
      alt: 'Workflow 하나의 내부: Planning, AI Run, Discussion, Decision, Artifact, Knowledge로 이어지는 흐름',
      caption: '한 사이클 안에서 생각(보라) → 자동 수집(회색) → 남는 결과물(청록)로 흐릅니다.',
    },
    {
      type: 'list',
      items: [
        '**Planning** — 이번 사이클에 뭘 할지',
        '**AI Run** — Claude·GPT와 앉아 있던 세션 기록',
        '**Discussion** — 주고받은 대화 그 자체',
        '**Decision** — 선택 · 버린 대안 · 이유',
        '**Artifact** — 커밋 · PR · 문서',
        '**Knowledge** — 다음에 재사용할 규칙',
      ],
    },

    { type: 'hr' },

    // ── Part 5 ──
    { type: 'h2', text: 'Part 5. 하나의 대화에서 두 가지가 나온다' },
    {
      type: 'p',
      text: '논의에서 뽑히는 건 하나가 아니라 둘입니다. 위로는 **기획**, 아래로는 **결정**이 나옵니다.',
    },
    {
      type: 'image',
      src: '/blog/choi/09/09-two-branches.svg',
      alt: '논의 한 덩어리에서 앞으로의 방향인 기획과 이미 고른 결정이 두 갈래로 갈라져 나오는 그림',
      caption: '같은 대화에서 둘 다 나오는 게 정상입니다.',
    },
    {
      type: 'p',
      text: '시제로 구분하면 쉽습니다. **기획은 미래형("~하자"), 결정은 과거형("~했다")**입니다. 그럼 결정은 구체적으로 어떻게 뽑힐까요? 첫 질문의 주인공, Redis 사례로 보겠습니다.',
    },
    {
      type: 'image',
      src: '/blog/choi/09/10-decision-extract.svg',
      alt: 'Redis 어때, TTL은, Cluster까지 필요할까, DB는 느려서 기각이라는 대화에서 AI가 후보를 추출해 선택 Redis, 조건 TTL 7일, 기각 DB 저장, 승인 개발자 본인이라는 Decision이 만들어지는 흐름',
      caption: 'AI가 후보를 뽑고, 승인 도장은 항상 사람이 찍습니다.',
    },
    {
      type: 'p',
      text: 'Discussion은 노션 문서가 아니라 **AI와 실제로 주고받은 대화 그 자체**입니다. *"세션 저장 Redis 어때?" → "TTL은 며칠이 적당?" → "Cluster까지 필요할까?" → "DB 저장은 느려서 기각"* — 이 전체가 Discussion이고, 거기서 짧은 Decision 한 줄이 추출됩니다.',
    },
    {
      type: 'quote',
      text: '여기서 가장 값진 건 "기각: DB 저장" 한 줄입니다. 보통 이건 안 남습니다. 그래서 6개월 뒤 후배가 똑같이 DB 저장을 제안하고, 똑같은 논의를 처음부터 다시 합니다.',
    },
    {
      type: 'p',
      text: '그리고 승인란을 보세요. **`승인: 개발자 본인`** — AI가 후보를 추출하지만, 도장은 반드시 사람이 찍습니다. 그래야 이 기록을 믿을 수 있습니다.',
    },

    { type: 'hr' },

    // ── Part 6 ──
    { type: 'h2', text: 'Part 6. 절대 규칙 — 아무것도 덮어쓰지 않는다' },
    {
      type: 'p',
      text: '이게 이 구상의 정체성입니다. 기획을 네 번 고쳤으면 **네 개가 전부 남습니다.**',
    },
    {
      type: 'image',
      src: '/blog/choi/09/11-version-history.svg',
      alt: 'Planning V1 OpenAI 사용, V2 Gemini 검토, V3 RAG 추가, V4 current 튜닝 제거 — V1부터 V3까지 모두 지우지 않고 남긴다',
      caption: '현재 쓰이는 V4에만 current 깃발이 꽂힐 뿐, V1~V3도 그대로 조회됩니다.',
    },
    {
      type: 'p',
      text: '왜 이렇게까지 할까요? 6개월 뒤 *"왜 Fine-tuning 안 썼지?"* 라는 질문의 답이 **V3와 V4 사이**에 있기 때문입니다. 최종본만 남기면 결론은 알아도 이유는 영영 모릅니다. Workflow도, Decision도 전부 같은 규칙입니다.',
    },
    {
      type: 'p',
      text: '그리고 기획이 바뀌는 경로도 정해져 있습니다. 그냥 고치는 게 아니라, **다시 논의를 거칩니다.**',
    },
    {
      type: 'image',
      src: '/blog/choi/09/12-revision-loop.svg',
      alt: 'Planning V1 Redis 단일에서 작업 중 부하 문제가 생겨 다시 AI와 논의한 뒤 V2 Cluster 전환으로 이어지고, V1과 그때의 논의는 그대로 남는 순환',
      caption: '작업 중 문제 → 다시 논의 → V2. V1과 그때의 대화도 함께 남습니다.',
    },
    {
      type: 'p',
      text: '`Redis 단일`로 시작했다가 부하를 못 버텨 `Cluster 전환`으로 간 경로 — 이게 *"왜 Cluster로 갔나"* 의 답입니다. 결과만 보면 절대 알 수 없죠.',
    },

    { type: 'hr' },

    // ── Part 7 ──
    { type: 'h2', text: 'Part 7. 그래서 무엇을 얻나 — 6개월 뒤의 역추적' },
    {
      type: 'p',
      text: '지금까지 쌓은 게 여기서 한 번에 회수됩니다. 글머리의 그 질문, **"왜 Redis 썼지?"** 로 돌아가 봅시다.',
    },
    {
      type: 'image',
      src: '/blog/choi/09/13-reverse-nav.svg',
      alt: '질문 왜 Redis 썼지에서 Decision Redis 사용, Discussion 그때의 대화, Task JWT 적용, Commit a3f9c1로 이어지는 역추적 사슬',
      caption: '질문 하나로 결정 → 그때의 대화 → Task → 커밋까지 거꾸로 따라갑니다.',
    },
    {
      type: 'p',
      text: '질문 → **Decision**(Redis 사용) → **Discussion**(TTL 논의와 DB 기각 이유) → **Task**(JWT 적용) → **Commit**(`a3f9c1`). 6개월 전의 나를 만나 직접 물어보는 것과 같습니다.',
    },
    {
      type: 'p',
      text: '반대 방향도 됩니다. 낯선 커밋 하나를 보고 *"이 코드 왜 이래?"* → Task → Decision → 그때의 대화까지. **코드와 이유가 양방향으로 연결돼 있는 것**이 핵심입니다.',
    },

    { type: 'hr' },

    // ── Part 8 ──
    { type: 'h2', text: 'Part 8. 마지막 조각 — Knowledge, 그리고 닫히는 고리' },
    {
      type: 'p',
      text: 'Decision은 *"그때 그 상황의 선택"*입니다. 그런데 같은 선택이 반복되면 그건 **규칙**이 됩니다. 그게 Knowledge입니다.',
    },
    {
      type: 'table',
      headers: ['위치', '무엇이 쌓이나'],
      rows: [
        ['Workspace Knowledge', '회사 규칙, 코딩 컨벤션, 아키텍처 원칙 — 어떤 기능에도 속하지 않는 것'],
        ['Feature Knowledge', '이 기능 특유의 주의사항 ("이 API는 응답이 느리니 캐시 필수")'],
      ],
    },
    {
      type: 'p',
      text: '차이를 한 줄로 보면 — Decision이 *"이번엔 Redis"* 라면, Knowledge는 *"우리 팀은 세션 저장에 Redis를 쓴다"* 입니다. Decision이 쌓여서 Knowledge가 되고, **그 Knowledge가 다음 Planning의 재료가 됩니다.** 여기서 고리가 닫힙니다.',
    },
    {
      type: 'code',
      language: 'text',
      text: `Workspace   →  무슨 서비스를 만드는가        (+ Planning, Knowledge)
  Feature   →  왜 이 기능이 필요한가          (+ Planning, Knowledge)
    Task    →  어떻게 구현할 것인가            (+ Planning)
      Workflow  →  이번 사이클에 실제로 한 일
        AI Run     →  AI와 앉아 있던 세션
        Discussion →  주고받은 대화 그대로
        Decision   →  거기서 뽑은 선택 + 버린 대안
        Artifact   →  커밋 · PR · 문서`,
    },

    { type: 'hr' },

    // ── 정직성: 아직 정하지 못한 것 ──
    { type: 'h2', text: '아직 정하지 못한 것들 — 같이 이야기해보고 싶은 지점' },
    {
      type: 'p',
      text: '구상 단계라 정직하게 비어 있는 곳도 적어둡니다. 사실 이 글을 쓴 이유가 여기에 있습니다 — 저희끼리 결론 내리기보다, 바이브 코딩을 쓰고 계신 분들의 생각이 궁금한 지점들입니다.',
    },
    {
      type: 'list',
      items: [
        '**논의를 언제 기획으로 굳힐 것인가** — 사람이 매번 "이제 확정" 버튼을 누를지, AI가 "슬슬 정리할까요?"라고 먼저 제안할지. 여기서 사용 경험이 꽤 달라집니다.',
        '**Workflow의 시작과 끝을 무엇으로 판단할 것인가** — 하루 단위인지, 커밋 묶음인지, 사람이 직접 닫는 것인지.',
        '**Decision이 나중에 뒤집힐 때** — "Redis 쓰기로 했다가 6개월 뒤 DB로 돌아왔다"를 어떻게 기록할지. 새 Decision인지, 기존 것의 무효화인지.',
        '**기록의 부담** — 개발자가 기록을 위해 따로 일하면 안 됩니다. 대화·커밋·세션은 알아서 쌓이고, 사람은 "이거 결정 맞아?"에 하루 몇 번만 답하면 되는 수준이어야 합니다. 이 전제가 무너지면 구조가 아무리 좋아도 아무도 안 씁니다.',
      ],
    },

    { type: 'hr' },

    // ── 마치며 ──
    { type: 'h2', text: '마치며 — 바이브 코딩이 협업이 되는 순간' },
    {
      type: 'quote',
      text: '바이브 코딩의 다음 단계는 더 좋은 프롬프트가 아니라, 대화가 사라지지 않는 구조라고 생각합니다. "무엇을 했는가"를 넘어 "왜 그렇게 했는가"가 남을 때, AI는 도구에서 동료가 됩니다.',
    },
    {
      type: 'p',
      text: '구조가 복잡해 보여도, 저희가 흔들리면 안 된다고 생각하는 원칙은 셋뿐입니다. **① 기획은 층마다 있다** — 한 곳에 몰면 나중에 못 찾습니다. **② 덮어쓰지 않는다** — 바뀐 과정 자체가 자산이고, current 깃발만 옮깁니다. **③ 승인은 사람이 한다** — AI는 후보를 제안할 뿐, 도장은 개발자가 찍습니다. 그래야 기록을 믿을 수 있습니다.',
    },
    {
      type: 'p',
      text: '처음의 질문으로 돌아가면 — 6개월 뒤 *"왜 Redis를 썼지?"* 라고 물었을 때, Git 로그가 아니라 **그때의 대화와 기각된 대안까지** 돌려주는 것. AI와의 개발이 일회성 지시가 아니라 협업이 되는 순간은 거기서 시작된다고 믿습니다.',
    },
    {
      type: 'p',
      text: '여러분은 어떠신가요 — AI와 나눈 대화, 어떻게 남기고 계신가요? 그냥 흘려보내고 계시다면 공감하실 테고, 나름의 방법이 있으시다면 그 이야기가 무척 궁금합니다. 가볍게라도 의견 나눠주시면 감사하겠습니다.',
    },
  ],
};
