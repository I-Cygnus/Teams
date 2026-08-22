import type { BlogPost } from '../../data';

export const post09: BlogPost = {
    id: '9',
    package: 'min',
    title: '모두를 위한 첫걸음, 웹 접근성',
    excerpt:
        'KWCAG 2.2의 웹 접근성 검사 항목을 실제 웹사이트에서 자주 발생하는 위반 사례와 올바른 구현 예시를 통해 살펴봅니다.',
    category: 'Frontend',
    authorOverride: {
        name: 'min',
        role: 'Fullstack Developer',
        accent: '#6366F1',
    },
    publishedAt: '2026-08-22',
    readingMinutes: 15,
    cover: 'linear-gradient(135deg,#0F172A 0%,#4F46E5 50%,#22C55E 100%)',
    coverImage: '/blog/min/09/web-accessibility.png',
    tags: [
        'Web Accessibility',
        'KWCAG',
        'KWCAG 2.2',
        'Accessibility',
        'Frontend',
        'HTML',
        'ARIA',
    ],

    body: [
        {
            type: 'p',
            text: '웹사이트를 만들다 보면 한 번쯤 **웹 접근성(Web Accessibility)**이라는 말을 듣게 됩니다.',
        },
        {
            type: 'p',
            text: '특히 공공기관이나 공공 웹서비스를 개발하다 보면 이미지의 `alt` 속성, 키보드 접근, 명도 대비, 건너뛰기 링크 같은 요구사항을 자주 만나게 됩니다.',
        },
        {
            type: 'quote',
            text: '이미지에 alt 넣고, input에 label 붙이면 웹 접근성은 끝나는 것 아닐까?',
        },
        {
            type: 'p',
            text: '물론 이것들도 중요한 항목이지만 웹 접근성이 다루는 범위는 훨씬 넓습니다.',
        },
        {
            type: 'list',
            items: [
                '마우스를 사용하지 않고도 모든 기능을 이용할 수 있는가?',
                '색을 구분하기 어려운 사용자도 상태를 이해할 수 있는가?',
                '화면낭독프로그램이 페이지 구조를 올바르게 이해할 수 있는가?',
                '자동으로 움직이는 콘텐츠를 사용자가 멈출 수 있는가?',
                '입력 오류가 발생했을 때 어디가 잘못됐는지 알 수 있는가?',
                '스마트폰에서 버튼을 충분히 쉽게 누를 수 있는가?',
            ],
        },
        {
            type: 'p',
            text: 'KWCAG 2.2 기반 웹 접근성 품질인증 전문가심사에서는 **33개의 검사 항목**을 확인합니다.',
        },
        {
            type: 'p',
            text: '이번 글에서는 각 항목을 규정 자체보다 **실제 웹사이트에서 어떤 문제가 발생하고 어떻게 고칠 수 있는지**를 중심으로 살펴보겠습니다.',
        },

        { type: 'hr' },

        {
            type: 'h2',
            text: 'Part 1. 웹 접근성이란 무엇일까?',
        },
        {
            type: 'p',
            text: '웹 접근성을 쉽게 설명하면 사용자의 신체적 조건이나 사용하는 기기에 관계없이 웹사이트의 정보와 기능을 이용할 수 있도록 만드는 것입니다.',
        },
        {
            type: 'code',
            language: 'text',
            text: `웹 접근성

시각장애
→ 화면낭독프로그램

저시력
→ 확대 / 고대비

지체·상지 장애
→ 키보드 / 단일 터치

청각장애
→ 자막 / 대본

다양한 환경에서도
같은 정보와 기능에 접근`,
        },
        {
            type: 'p',
            text: '예를 들어 마우스를 사용할 수 없는 사용자는 키보드로 웹사이트를 사용할 수 있어야 하고, 화면을 볼 수 없는 사용자는 화면낭독프로그램을 통해 콘텐츠의 의미를 이해할 수 있어야 합니다.',
        },
        {
            type: 'quote',
            text: '웹 접근성은 특정 사용자를 위한 별도의 기능이라기보다 다양한 사용 방법을 허용하는 웹의 기본 원칙에 가깝다.',
        },

        { type: 'hr' },

        {
            type: 'h2',
            text: 'Part 2. 웹 접근성의 네 가지 원칙',
        },
        {
            type: 'p',
            text: 'KWCAG의 검사 항목은 크게 네 가지 원칙으로 나눌 수 있습니다.',
        },
        {
            type: 'code',
            language: 'text',
            text: `1. 인식의 용이성
Perceivable

사용자가 정보를
인식할 수 있는가?


2. 운용의 용이성
Operable

사용자가 기능을
조작할 수 있는가?


3. 이해의 용이성
Understandable

콘텐츠와 기능을
이해할 수 있는가?


4. 견고성
Robust

브라우저와 보조기술이
올바르게 해석할 수 있는가?`,
        },

        { type: 'hr' },

        {
            type: 'h2',
            text: 'Part 3. 적절한 대체 텍스트 제공',
        },
        {
            type: 'p',
            text: '이미지처럼 텍스트가 아닌 콘텐츠에는 그 의미나 용도를 이해할 수 있는 대체 텍스트를 제공해야 합니다.',
        },
        {
            type: 'p',
            text: '**❌ 위반 예시**',
        },
        {
            type: 'code',
            language: 'html',
            text: `<img src="search.png">`,
        },
        {
            type: 'p',
            text: '또는 alt를 넣었지만 이미지의 의미를 제대로 설명하지 못하는 경우도 문제가 됩니다.',
        },
        {
            type: 'code',
            language: 'html',
            text: `<img src="search.png" alt="이미지">`,
        },
        {
            type: 'p',
            text: '**✅ 좋은 예시**',
        },
        {
            type: 'code',
            language: 'html',
            text: `<img src="search.png" alt="검색">`,
        },
        {
            type: 'p',
            text: '단순한 장식용 이미지라면 오히려 화면낭독프로그램이 읽지 않도록 빈 대체 텍스트를 제공할 수 있습니다.',
        },
        {
            type: 'code',
            language: 'html',
            text: `<img src="dot.png" alt="">`,
        },
        {
            type: 'quote',
            text: '모든 이미지에 설명을 길게 작성하는 것이 아니라 이미지가 전달하는 의미와 기능을 텍스트로도 이해할 수 있도록 하는 것이 핵심이다.',
        },

        { type: 'hr' },

        {
            type: 'h2',
            text: 'Part 4. 자막 제공',
        },
        {
            type: 'p',
            text: '영상이나 음성 콘텐츠에는 내용을 동등하게 이해할 수 있도록 자막, 대본 또는 수어 등의 대체 수단을 제공해야 합니다.',
        },
        {
            type: 'p',
            text: '**❌ 위반 예시**',
        },
        {
            type: 'code',
            language: 'text',
            text: `[기관 소개 영상]

영상 재생 ▶

음성 설명 있음

자막 없음
대본 없음
수어 없음`,
        },
        {
            type: 'p',
            text: '**✅ 좋은 예시**',
        },
        {
            type: 'code',
            language: 'text',
            text: `[기관 소개 영상]

영상 재생 ▶

CC 자막 제공

또는

영상과 함께
전체 대본 제공`,
        },
        {
            type: 'p',
            text: '음성이 없는 영상이라도 영상 자체가 중요한 정보를 전달한다면 그 내용을 이해할 수 있는 설명이 필요합니다.',
        },

        { type: 'hr' },

        {
            type: 'h2',
            text: 'Part 5. 표의 구성',
        },
        {
            type: 'p',
            text: '표는 화면에서 보기 좋게 행과 열을 나누는 것뿐 아니라, **각 데이터가 어떤 제목과 연결되어 있는지 프로그램도 이해할 수 있도록 구조를 표현해야 합니다.**',
        },
        {
            type: 'p',
            text: '우리는 표를 눈으로 볼 때 위치만으로도 `100`이라는 값이 `2025년 회원 수`라는 것을 쉽게 알 수 있습니다.',
        },
        {
            type: 'code',
            language: 'text',
            text: `        2025    2026
          ↓       ↓
회원 수   100     150`,
        },
        {
            type: 'p',
            text: '하지만 화면낭독프로그램을 사용하는 사용자는 표 전체를 한눈에 볼 수 없기 때문에, HTML에 정의된 제목 셀과 데이터 셀의 관계를 통해 각 값의 의미를 파악합니다.',
        },
        {
            type: 'p',
            text: '**❌ 위반 예시**',
        },
        {
            type: 'code',
            language: 'html',
            text: `<table>
  <tr>
    <td>구분</td>
    <td>2025</td>
    <td>2026</td>
  </tr>
  <tr>
    <td>회원 수</td>
    <td>100</td>
    <td>150</td>
  </tr>
</table>`,
        },
        {
            type: 'p',
            text: '화면에서는 `구분`, `2025`, `2026`이 제목처럼 보이지만 코드에서는 모두 일반 데이터 셀인 `<td>`로 작성되어 있습니다. 따라서 프로그램 입장에서는 어떤 셀이 제목이고 어떤 셀이 실제 데이터인지 명확하게 구분하기 어렵습니다.',
        },
        {
            type: 'p',
            text: '**✅ 좋은 예시**',
        },
        {
            type: 'code',
            language: 'html',
            text: `<table>
  <caption>연도별 회원 수</caption>

  <thead>
    <tr>
      <th scope="col">구분</th>
      <th scope="col">2025</th>
      <th scope="col">2026</th>
    </tr>
  </thead>

  <tbody>
    <tr>
      <th scope="row">회원 수</th>
      <td>100</td>
      <td>150</td>
    </tr>
  </tbody>
</table>`,
        },
        {
            type: 'p',
            text: '`<caption>`은 **표 전체의 제목**을 나타냅니다. 이 예제에서는 이 표가 `연도별 회원 수`를 보여주는 표라는 것을 알려줍니다.',
        },
        {
            type: 'p',
            text: '`<th>`는 일반 데이터가 아니라 **제목 역할을 하는 셀**입니다. `2025`, `2026`처럼 각 열을 설명하는 제목에는 `scope="col"`을 사용하고, `회원 수`처럼 한 행을 설명하는 제목에는 `scope="row"`를 사용할 수 있습니다.',
        },
        {
            type: 'code',
            language: 'text',
            text: `caption
연도별 회원 수

              열 제목
            ↓        ↓
┌─────────┬──────┬──────┐
│ 구분    │ 2025 │ 2026 │
├─────────┼──────┼──────┤
│ 회원 수 │ 100  │ 150  │
└─────────┴──────┴──────┘
    ↑
  행 제목`,
        },
        {
            type: 'p',
            text: '이렇게 제목과 데이터의 관계를 마크업으로 표현하면 화면낭독프로그램에서도 `100`이라는 숫자가 단순한 숫자가 아니라 **2025년의 회원 수를 의미하는 값**이라는 것을 이해하는 데 도움을 받을 수 있습니다.',
        },
        {
            type: 'quote',
            text: '표는 화면에서 표처럼 보이게 만드는 것뿐 아니라, 제목 셀과 데이터 셀의 관계까지 HTML 구조로 표현하는 것이 중요하다.',
        },

        { type: 'hr' },

        {
            type: 'h2',
            text: 'Part 6. 콘텐츠의 선형 구조',
        },
        {
            type: 'p',
            text: 'CSS로 화면을 배치하기 전의 HTML 구조만 읽어도 콘텐츠의 순서와 계층 관계를 이해할 수 있어야 합니다.',
        },
        {
            type: 'p',
            text: '**❌ 위반 예시**',
        },
        {
            type: 'code',
            language: 'text',
            text: `화면에 보이는 순서

아이디
↓
비밀번호
↓
아이디 저장
↓
로그인


실제 HTML 순서

아이디
↓
비밀번호
↓
로그인
↓
아이디 저장`,
        },
        {
            type: 'p',
            text: '**✅ 좋은 예시**',
        },
        {
            type: 'code',
            language: 'text',
            text: `화면 순서

아이디
↓
비밀번호
↓
아이디 저장
↓
로그인

=

HTML의 논리적 순서`,
        },
        {
            type: 'p',
            text: '2단계 이상의 메뉴처럼 계층 구조가 있다면 `ul > li > ul > li`처럼 구조를 표현할 수 있는 마크업을 사용하는 것도 중요합니다.',
        },

        { type: 'hr' },

        {
            type: 'h2',
            text: 'Part 7. 명확한 지시사항 제공',
        },
        {
            type: 'p',
            text: '색상이나 위치, 방향, 모양, 소리 하나에만 의존하여 사용 방법을 안내해서는 안 됩니다.',
        },
        {
            type: 'p',
            text: '**❌ 위반 예시**',
        },
        {
            type: 'code',
            language: 'text',
            text: `오른쪽에 있는
빨간 버튼을 눌러주세요.`,
        },
        {
            type: 'p',
            text: '**✅ 좋은 예시**',
        },
        {
            type: 'code',
            language: 'text',
            text: `'신청하기' 버튼을
눌러주세요.`,
        },
        {
            type: 'quote',
            text: '색이나 위치를 보지 못하더라도 어떤 기능을 사용해야 하는지 알 수 있어야 한다.',
        },

        { type: 'hr' },

        {
            type: 'h2',
            text: 'Part 8. 색에 무관한 콘텐츠 인식',
        },
        {
            type: 'p',
            text: '정보나 상태를 색상만으로 구분하면 안 됩니다.',
        },
        {
            type: 'p',
            text: '**❌ 위반 예시**',
        },
        {
            type: 'code',
            language: 'text',
            text: `● 정상
● 오류

정상 = 초록색
오류 = 빨간색

색상만으로 상태 구분`,
        },
        {
            type: 'p',
            text: '**✅ 좋은 예시**',
        },
        {
            type: 'code',
            language: 'text',
            text: `✓ 정상

! 오류

색상
+
아이콘
+
텍스트`,
        },
        {
            type: 'p',
            text: '그래프나 지도, 활성·비활성 상태, 필수 입력 항목도 같은 원칙이 적용됩니다.',
        },

        { type: 'hr' },

        {
            type: 'h2',
            text: 'Part 9. 자동 재생 금지',
        },
        {
            type: 'p',
            text: '웹페이지에 접속하거나 요소에 초점이 이동했다는 이유만으로 3초 이상의 소리가 자동으로 재생되어서는 안 됩니다.',
        },
        {
            type: 'p',
            text: '**❌ 위반 예시**',
        },
        {
            type: 'code',
            language: 'text',
            text: `페이지 접속
   ↓
홍보 영상 자동 재생
   ↓
배경음 계속 재생`,
        },
        {
            type: 'p',
            text: '**✅ 좋은 예시**',
        },
        {
            type: 'code',
            language: 'text',
            text: `[▶ 홍보 영상 재생]

사용자가 선택했을 때
영상과 소리 재생`,
        },

        { type: 'hr' },

        {
            type: 'h2',
            text: 'Part 10. 텍스트 콘텐츠의 명도 대비',
        },
        {
            type: 'p',
            text: '텍스트와 배경 사이에는 충분한 명도 대비가 있어야 합니다.',
        },
        {
            type: 'p',
            text: '일반적인 텍스트는 **4.5:1 이상**, 큰 텍스트는 **3:1 이상**의 명도 대비가 요구됩니다.',
        },
        {
            type: 'p',
            text: '**❌ 위반 예시**',
        },
        {
            type: 'code',
            language: 'text',
            text: `연한 회색 배경

+

연한 회색 글씨

→ 글자 구분이 어려움`,
        },
        {
            type: 'p',
            text: '**✅ 좋은 예시**',
        },
        {
            type: 'code',
            language: 'text',
            text: `밝은 배경

+

충분히 어두운 텍스트

→ 명확하게 구분`,
        },
        {
            type: 'p',
            text: '특히 브랜드 컬러를 버튼이나 배경에 사용할 때 흰색 텍스트와의 명도 대비를 확인하는 것이 중요합니다.',
        },

        { type: 'hr' },

        {
            type: 'h2',
            text: 'Part 11. 콘텐츠 간의 구분',
        },
        {
            type: 'p',
            text: '서로 인접한 콘텐츠가 하나의 콘텐츠처럼 보이지 않도록 시각적으로 구분할 수 있어야 합니다.',
        },
        {
            type: 'p',
            text: '**❌ 위반 예시**',
        },
        {
            type: 'code',
            language: 'text',
            text: `공지사항FAQ민원신청자료실`,
        },
        {
            type: 'p',
            text: '**✅ 좋은 예시**',
        },
        {
            type: 'code',
            language: 'text',
            text: `공지사항 | FAQ | 민원신청 | 자료실

또는

충분한 여백
테두리
구분선
배경 차이`,
        },

        { type: 'hr' },

        {
            type: 'h2',
            text: 'Part 12. 키보드 사용 보장',
        },
        {
            type: 'p',
            text: '마우스로 사용할 수 있는 기능은 원칙적으로 키보드로도 접근하고 조작할 수 있어야 합니다.',
        },
        {
            type: 'p',
            text: '**❌ 위반 예시**',
        },
        {
            type: 'code',
            language: 'html',
            text: `<div onclick="openMenu()">
  메뉴
</div>`,
        },
        {
            type: 'p',
            text: '마우스로 클릭할 수는 있지만 기본적으로 키보드 초점을 받을 수 없습니다.',
        },
        {
            type: 'p',
            text: '**✅ 좋은 예시**',
        },
        {
            type: 'code',
            language: 'html',
            text: `<button
  type="button"
  onclick="openMenu()"
>
  메뉴
</button>`,
        },
        {
            type: 'quote',
            text: 'div를 버튼처럼 만드는 것보다 처음부터 button을 사용하는 것이 가장 간단한 접근성 개선 방법 중 하나다.',
        },

        { type: 'hr' },

        {
            type: 'h2',
            text: 'Part 13. 초점 이동과 표시',
        },
        {
            type: 'p',
            text: 'Tab 키로 이동하는 초점의 순서가 논리적이어야 하고 현재 초점이 어디에 있는지도 시각적으로 확인할 수 있어야 합니다.',
        },
        {
            type: 'p',
            text: '**❌ 위반 예시**',
        },
        {
            type: 'code',
            language: 'css',
            text: `*:focus {
  outline: none;
}`,
        },
        {
            type: 'p',
            text: '브라우저 기본 초점 표시까지 제거하면 키보드 사용자는 현재 위치를 알기 어렵습니다.',
        },
        {
            type: 'p',
            text: '**✅ 좋은 예시**',
        },
        {
            type: 'code',
            language: 'css',
            text: `button:focus-visible,
a:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 3px;
}`,
        },
        {
            type: 'p',
            text: '모달을 열고 닫을 때도 초점 흐름을 함께 고려해야 합니다.',
        },
        {
            type: 'code',
            language: 'text',
            text: `모달 열기 버튼
      ↓
모달 내부로 초점 이동
      ↓
모달 이용
      ↓
모달 닫기
      ↓
기존 버튼으로 초점 복귀`,
        },

        { type: 'hr' },

        {
            type: 'h2',
            text: 'Part 14. 조작 가능',
        },
        {
            type: 'p',
            text: '버튼과 링크 같은 컨트롤은 너무 작거나 서로 지나치게 붙어 있지 않아야 합니다.',
        },
        {
            type: 'p',
            text: '품질인증 심사 기준에서는 PC 웹은 **17×17px 이상**, 모바일 웹은 **24×24px 이상**이면 준수한 것으로 인정합니다.',
        },
        {
            type: 'p',
            text: '**❌ 위반 예시**',
        },
        {
            type: 'code',
            language: 'text',
            text: `x

아주 작은 닫기 버튼`,
        },
        {
            type: 'p',
            text: '**✅ 좋은 예시**',
        },
        {
            type: 'code',
            language: 'text',
            text: `┌─────────┐
│    ×    │
└─────────┘

아이콘은 작더라도
충분한 클릭 영역 제공`,
        },

        { type: 'hr' },

        {
            type: 'h2',
            text: 'Part 15. 문자 단축키',
        },
        {
            type: 'p',
            text: '문자 하나만 눌러 실행되는 단축키를 제공한다면 의도하지 않은 실행을 방지할 수 있어야 합니다.',
        },
        {
            type: 'p',
            text: '**❌ 위반 예시**',
        },
        {
            type: 'code',
            language: 'text',
            text: `S → 저장

D → 삭제

문자를 입력하다가
기능이 실행될 가능성`,
        },
        {
            type: 'p',
            text: '**✅ 좋은 예시**',
        },
        {
            type: 'code',
            language: 'text',
            text: `Ctrl + S
→ 저장

또는

단일 문자 단축키
비활성화 기능 제공`,
        },

        { type: 'hr' },

        {
            type: 'h2',
            text: 'Part 16. 응답시간 조절',
        },
        {
            type: 'p',
            text: '시간 제한이 있는 콘텐츠라면 사용자가 시간을 연장하거나 해제할 수 있는 방법을 제공해야 합니다.',
        },
        {
            type: 'p',
            text: '**❌ 위반 예시**',
        },
        {
            type: 'code',
            language: 'text',
            text: `로그인 시간이 만료됩니다.

5
4
3
2
1

자동 로그아웃

연장 방법 없음`,
        },
        {
            type: 'p',
            text: '**✅ 좋은 예시**',
        },
        {
            type: 'code',
            language: 'text',
            text: `로그인 시간이 곧 만료됩니다.

[로그인 연장]

[로그아웃]`,
        },
        {
            type: 'p',
            text: '심사 기준에서는 시간 만료 전에 충분한 안내 시간을 제공하고 사용자가 간단한 동작으로 제한 시간을 연장할 수 있도록 요구합니다.',
        },

        { type: 'hr' },

        {
            type: 'h2',
            text: 'Part 17. 정지 기능 제공',
        },
        {
            type: 'p',
            text: '자동으로 변경되거나 움직이는 콘텐츠는 사용자가 멈추거나 이동을 제어할 수 있어야 합니다.',
        },
        {
            type: 'p',
            text: '**❌ 위반 예시**',
        },
        {
            type: 'code',
            language: 'text',
            text: `배너 1
  ↓
배너 2
  ↓
배너 3
  ↓
배너 4
  ↓
계속 자동 변경

정지 기능 없음`,
        },
        {
            type: 'p',
            text: '**✅ 좋은 예시**',
        },
        {
            type: 'code',
            language: 'text',
            text: `[이전] [정지] [다음]

또는

[배너 전체보기]`,
        },

        { type: 'hr' },

        {
            type: 'h2',
            text: 'Part 18. 깜빡임과 번쩍임 사용 제한',
        },
        {
            type: 'p',
            text: '초당 3~50회 정도의 빠른 깜빡임이나 번쩍임이 있는 콘텐츠는 제한해야 합니다.',
        },
        {
            type: 'p',
            text: '**❌ 위반 예시**',
        },
        {
            type: 'code',
            language: 'text',
            text: `SALE!
SALE!
SALE!

빠른 속도로
계속 깜빡임`,
        },
        {
            type: 'p',
            text: '**✅ 좋은 예시**',
        },
        {
            type: 'code',
            language: 'text',
            text: `과도한 깜빡임 효과 제거

또는

사전 안내
+
회피 방법 제공`,
        },
        {
            type: 'p',
            text: '웹페이지의 효과뿐 아니라 동영상 안의 깜빡임도 검사 대상이 될 수 있습니다.',
        },

        { type: 'hr' },

        {
            type: 'h2',
            text: 'Part 19. 반복 영역 건너뛰기',
        },
        {
            type: 'p',
            text: '페이지마다 반복되는 메뉴를 매번 지나가지 않고 본문으로 바로 이동할 수 있는 건너뛰기 링크를 제공해야 합니다.',
        },
        {
            type: 'p',
            text: '**❌ 위반 예시**',
        },
        {
            type: 'code',
            language: 'text',
            text: `Tab
↓
로그인
↓
회원가입
↓
메뉴 1
↓
메뉴 2
↓
메뉴 3
↓
...
↓
본문`,
        },
        {
            type: 'p',
            text: '**✅ 좋은 예시**',
        },
        {
            type: 'code',
            language: 'html',
            text: `<a href="#content" class="skip">
  본문 바로가기
</a>

<main id="content">
  ...
</main>`,
        },
        {
            type: 'code',
            language: 'text',
            text: `Tab
↓
본문 바로가기
↓
Enter
↓
본문으로 이동`,
        },
        {
            type: 'p',
            text: '평소에는 화면에서 숨기더라도 키보드 초점을 받았을 때는 건너뛰기 링크가 보여야 합니다.',
        },

        { type: 'hr' },

        {
            type: 'h2',
            text: 'Part 20. 제목 제공',
        },
        {
            type: 'p',
            text: '페이지와 콘텐츠 영역에는 현재 어떤 내용을 보고 있는지 알 수 있는 적절한 제목을 제공해야 합니다.',
        },
        {
            type: 'p',
            text: '**❌ 위반 예시**',
        },
        {
            type: 'code',
            language: 'html',
            text: `<!-- 모든 페이지 -->

<title>OO시청</title>`,
        },
        {
            type: 'p',
            text: '**✅ 좋은 예시**',
        },
        {
            type: 'code',
            language: 'html',
            text: `<title>
  채용공고 | 시험·채용 | OO시청
</title>`,
        },
        {
            type: 'p',
            text: '본문에서도 제목 구조를 적절하게 표현하는 것이 좋습니다.',
        },
        {
            type: 'code',
            language: 'html',
            text: `<h1>채용공고</h1>

<h2>2026년 채용 일정</h2>`,
        },

        { type: 'hr' },

        {
            type: 'h2',
            text: 'Part 21. 적절한 링크 텍스트',
        },
        {
            type: 'p',
            text: '링크의 텍스트나 주변 문맥을 통해 링크가 어떤 목적으로 사용되는지 이해할 수 있어야 합니다.',
        },
        {
            type: 'p',
            text: '**❌ 위반 예시**',
        },
        {
            type: 'code',
            language: 'html',
            text: `<a href="/notice/123">
  여기
</a>`,
        },
        {
            type: 'p',
            text: '**✅ 좋은 예시**',
        },
        {
            type: 'code',
            language: 'html',
            text: `<a href="/notice/123">
  2026년 하반기 채용공고 보기
</a>`,
        },
        {
            type: 'p',
            text: '단, `더보기`, `다음`, `이전`처럼 짧은 링크도 주변 문맥을 통해 목적을 명확하게 이해할 수 있다면 사용할 수 있습니다.',
        },

        { type: 'hr' },

        {
            type: 'h2',
            text: 'Part 22. 고정된 참조 위치 정보',
        },
        {
            type: 'p',
            text: '웹페이지 형식의 전자출판문서에서는 화면 확대나 글자 크기 변경 등으로 서식이 달라져도 현재 위치 정보를 유지할 수 있어야 합니다.',
        },
        {
            type: 'p',
            text: '**❌ 위반 예시**',
        },
        {
            type: 'code',
            language: 'text',
            text: `현재 32페이지

↓ 글자 확대

현재 위치를
알 수 없음`,
        },
        {
            type: 'p',
            text: '**✅ 좋은 예시**',
        },
        {
            type: 'code',
            language: 'text',
            text: `32 / 120 페이지

[처음]
[이전]
[다음]
[끝]

화면 변경 후에도
현재 위치 유지`,
        },
        {
            type: 'p',
            text: '고정된 형태의 PDF 파일 등은 이 검사 항목의 대상이 아닐 수 있습니다.',
        },

        { type: 'hr' },

        {
            type: 'h2',
            text: 'Part 23. 단일 포인터 입력 지원',
        },
        {
            type: 'p',
            text: '핀치, 스와이프, Drag & Drop처럼 여러 손가락이나 특정 경로가 필요한 동작을 제공한다면 단순한 입력 방식도 함께 제공해야 합니다.',
        },
        {
            type: 'p',
            text: '**❌ 위반 예시**',
        },
        {
            type: 'code',
            language: 'text',
            text: `지도 확대

두 손가락으로
Pinch

유일한 조작 방법`,
        },
        {
            type: 'p',
            text: '**✅ 좋은 예시**',
        },
        {
            type: 'code',
            language: 'text',
            text: `Pinch 확대

또는

[ + 확대 ]
[ - 축소 ]`,
        },
        {
            type: 'quote',
            text: '복잡한 제스처가 있더라도 클릭이나 탭처럼 단순한 방법으로 같은 결과를 얻을 수 있도록 만드는 것이 핵심이다.',
        },

        { type: 'hr' },

        {
            type: 'h2',
            text: 'Part 24. 포인터 입력 취소',
        },
        {
            type: 'p',
            text: '마우스나 터치 입력을 실수했을 때 의도하지 않은 기능 실행을 취소할 수 있어야 합니다.',
        },
        {
            type: 'p',
            text: '**❌ 위반 예시**',
        },
        {
            type: 'code',
            language: 'text',
            text: `마우스 버튼 누름

mousedown
   ↓
즉시 회원 삭제`,
        },
        {
            type: 'p',
            text: '**✅ 좋은 예시**',
        },
        {
            type: 'code',
            language: 'text',
            text: `버튼을 누름
   ↓
버튼을 뗌
   ↓
기능 실행

또는

게시물을 삭제했습니다.

[실행 취소]`,
        },

        { type: 'hr' },

        {
            type: 'h2',
            text: 'Part 25. 레이블과 네임',
        },
        {
            type: 'p',
            text: '화면에서 보이는 UI의 이름과 보조기술이 인식하는 접근 가능한 이름이 서로 맞아야 합니다.',
        },
        {
            type: 'p',
            text: '**❌ 위반 예시**',
        },
        {
            type: 'code',
            language: 'html',
            text: `<button aria-label="조회 실행">
  검색
</button>`,
        },
        {
            type: 'p',
            text: '화면에는 `검색`이라고 보이지만 보조기술은 `조회 실행`이라고 인식합니다.',
        },
        {
            type: 'p',
            text: '**✅ 좋은 예시**',
        },
        {
            type: 'code',
            language: 'html',
            text: `<button aria-label="검색">
  검색
</button>`,
        },
        {
            type: 'p',
            text: '더 단순하게는 버튼 내부의 텍스트 자체를 접근 가능한 이름으로 사용할 수도 있습니다.',
        },
        {
            type: 'code',
            language: 'html',
            text: `<button>
  검색
</button>`,
        },

        { type: 'hr' },

        {
            type: 'h2',
            text: 'Part 26. 동작 기반 작동',
        },
        {
            type: 'p',
            text: '스마트폰을 흔들거나 기울이는 등 기기의 움직임으로 실행되는 기능은 일반적인 UI로도 실행할 수 있어야 합니다.',
        },
        {
            type: 'p',
            text: '**❌ 위반 예시**',
        },
        {
            type: 'code',
            language: 'text',
            text: `휴대폰 흔들기
      ↓
작성 내용 취소

다른 방법 없음`,
        },
        {
            type: 'p',
            text: '**✅ 좋은 예시**',
        },
        {
            type: 'code',
            language: 'text',
            text: `휴대폰 흔들기

또는

[작성 취소]`,
        },
        {
            type: 'p',
            text: '필요한 경우 동작 기반 기능 자체를 비활성화할 수 있는 방법도 제공해야 합니다.',
        },

        { type: 'hr' },

        {
            type: 'h2',
            text: 'Part 27. 기본 언어 표시',
        },
        {
            type: 'p',
            text: 'HTML 문서에는 페이지에서 기본적으로 사용하는 언어를 명시해야 합니다.',
        },
        {
            type: 'p',
            text: '**❌ 위반 예시**',
        },
        {
            type: 'code',
            language: 'html',
            text: `<html>`,
        },
        {
            type: 'p',
            text: '**✅ 좋은 예시**',
        },
        {
            type: 'code',
            language: 'html',
            text: `<html lang="ko">`,
        },
        {
            type: 'p',
            text: '영어 페이지라면 다음과 같이 표현할 수 있습니다.',
        },
        {
            type: 'code',
            language: 'html',
            text: `<html lang="en">`,
        },
        {
            type: 'p',
            text: '화면에서는 차이가 없지만 화면낭독프로그램이 적절한 언어와 발음 규칙을 선택하는 데 중요한 정보입니다.',
        },

        { type: 'hr' },

        {
            type: 'h2',
            text: 'Part 28. 사용자 요구에 따른 실행',
        },
        {
            type: 'p',
            text: '사용자가 요청하지 않았는데 새 창이 열리거나 페이지가 이동하는 등 예상하지 못한 기능이 실행되어서는 안 됩니다.',
        },
        {
            type: 'p',
            text: '**❌ 위반 예시**',
        },
        {
            type: 'code',
            language: 'text',
            text: `지역 선택

[서울 ▼]

서울 선택
   ↓
즉시 다른 페이지로 이동`,
        },
        {
            type: 'p',
            text: '**✅ 좋은 예시**',
        },
        {
            type: 'code',
            language: 'text',
            text: `지역 선택

[서울 ▼]

[검색]

사용자가
검색 버튼 실행
   ↓
결과 페이지 이동`,
        },
        {
            type: 'p',
            text: '새 창이 열리는 경우에도 사용자가 이를 예상할 수 있도록 정보를 제공하는 것이 중요합니다.',
        },

        { type: 'hr' },

        {
            type: 'h2',
            text: 'Part 29. 찾기 쉬운 도움 정보',
        },
        {
            type: 'p',
            text: '고객센터, FAQ, 챗봇 등 반복적으로 제공되는 도움 정보는 사이트 내에서 일관된 위치와 순서로 제공하는 것이 좋습니다.',
        },
        {
            type: 'p',
            text: '**❌ 위반 예시**',
        },
        {
            type: 'code',
            language: 'text',
            text: `페이지 A
고객센터 → 상단

페이지 B
고객센터 → 중간

페이지 C
고객센터 → 하단`,
        },
        {
            type: 'p',
            text: '**✅ 좋은 예시**',
        },
        {
            type: 'code',
            language: 'text',
            text: `모든 페이지

본문
...
고객센터
FAQ
챗봇
Footer

동일한 위치와
마크업 순서 유지`,
        },

        { type: 'hr' },

        {
            type: 'h2',
            text: 'Part 30. 오류 정정',
        },
        {
            type: 'p',
            text: '입력 오류가 발생했을 때 사용자가 무엇이 잘못됐는지 확인하고 다시 수정할 수 있어야 합니다.',
        },
        {
            type: 'p',
            text: '**❌ 위반 예시**',
        },
        {
            type: 'code',
            language: 'text',
            text: `회원가입 실패

오류가 발생했습니다.

어디가 잘못되었는지
알 수 없음`,
        },
        {
            type: 'p',
            text: '**✅ 좋은 예시**',
        },
        {
            type: 'code',
            language: 'text',
            text: `이메일 주소를 확인해주세요.

입력값
hello@

올바른 형식
hello@example.com`,
        },
        {
            type: 'p',
            text: '가능하다면 오류 내용을 알려준 뒤 해당 입력 요소로 초점을 이동시키는 것도 좋습니다.',
        },
        {
            type: 'quote',
            text: '오류가 있다는 사실만 알려주는 것이 아니라 어디가 잘못되었고 어떻게 수정해야 하는지 알려주는 것이 중요하다.',
        },

        { type: 'hr' },

        {
            type: 'h2',
            text: 'Part 31. 레이블 제공',
        },
        {
            type: 'p',
            text: '`input`, `textarea`, `select` 같은 입력 서식에는 어떤 정보를 입력해야 하는지 알 수 있는 레이블을 제공해야 합니다.',
        },
        {
            type: 'p',
            text: '**❌ 위반 예시**',
        },
        {
            type: 'code',
            language: 'html',
            text: `이름
<input type="text">`,
        },
        {
            type: 'p',
            text: '화면에서는 이름이라는 글자가 옆에 있지만 프로그램상 두 요소의 관계는 정의되어 있지 않습니다.',
        },
        {
            type: 'p',
            text: '**✅ 좋은 예시**',
        },
        {
            type: 'code',
            language: 'html',
            text: `<label for="name">
  이름
</label>

<input
  id="name"
  type="text"
/>`,
        },
        {
            type: 'p',
            text: '이렇게 구현하면 화면낭독프로그램에서도 `이름, 편집창`처럼 입력 목적을 함께 인식할 수 있습니다.',
        },

        { type: 'hr' },

        {
            type: 'h2',
            text: 'Part 32. 접근 가능한 인증',
        },
        {
            type: 'p',
            text: '로그인이나 본인인증 과정이 기억이나 퍼즐 해결 같은 인지 능력에만 의존해서는 안 됩니다.',
        },
        {
            type: 'p',
            text: '**❌ 위반 예시**',
        },
        {
            type: 'code',
            language: 'text',
            text: `다음 문자열을 기억하세요.

7FK82QXZ

↓ 다음 화면

방금 본 문자열을
입력하세요.`,
        },
        {
            type: 'p',
            text: '**✅ 좋은 예시**',
        },
        {
            type: 'code',
            language: 'text',
            text: `인증 방법

비밀번호 관리자 사용

인증번호
복사 / 붙여넣기

지문 / 얼굴 인증

휴대폰 인증

제3자 인증`,
        },
        {
            type: 'p',
            text: '사용자가 반드시 정보를 기억하거나 복잡한 퍼즐을 해결해야만 인증할 수 있는 구조는 피해야 합니다.',
        },

        { type: 'hr' },

        {
            type: 'h2',
            text: 'Part 33. 반복 입력 정보',
        },
        {
            type: 'p',
            text: '하나의 신청이나 가입 과정에서 이미 입력했던 정보를 다시 반복해서 입력하도록 하지 않아야 합니다.',
        },
        {
            type: 'p',
            text: '**❌ 위반 예시**',
        },
        {
            type: 'code',
            language: 'text',
            text: `1단계

이름
홍길동

전화번호
010-0000-0000

       ↓

3단계

이름
[           ]

전화번호
[           ]

같은 정보를
다시 입력`,
        },
        {
            type: 'p',
            text: '**✅ 좋은 예시**',
        },
        {
            type: 'code',
            language: 'text',
            text: `3단계

이름
홍길동

전화번호
010-0000-0000

[이전 입력 정보 사용]`,
        },
        {
            type: 'p',
            text: '브라우저의 자동완성 기능을 활용하는 방법도 있습니다.',
        },
        {
            type: 'code',
            language: 'html',
            text: `<input
  type="email"
  autocomplete="email"
/>`,
        },
        {
            type: 'p',
            text: '다만 비밀번호처럼 보안을 위해 재입력이 필요한 정보는 예외가 될 수 있습니다.',
        },

        { type: 'hr' },

        {
            type: 'h2',
            text: 'Part 34. 마크업 오류 방지',
        },
        {
            type: 'p',
            text: 'HTML 요소의 열고 닫기, 중첩 관계, 속성 선언 등에 오류가 없어야 합니다.',
        },
        {
            type: 'p',
            text: '**❌ 위반 예시**',
        },
        {
            type: 'code',
            language: 'html',
            text: `<div>
  <p>내용
</div>
</p>`,
        },
        {
            type: 'p',
            text: '같은 페이지에서 동일한 `id`를 여러 번 사용하는 것도 문제가 됩니다.',
        },
        {
            type: 'code',
            language: 'html',
            text: `<input id="userName">

<input id="userName">`,
        },
        {
            type: 'p',
            text: '**✅ 좋은 예시**',
        },
        {
            type: 'code',
            language: 'html',
            text: `<div>
  <p>내용</p>
</div>

<input id="userName">

<input id="userEmail">`,
        },

        { type: 'hr' },

        {
            type: 'h2',
            text: 'Part 35. 웹 애플리케이션 접근성 준수',
        },
        {
            type: 'p',
            text: '웹페이지 안에서 별도로 실행되는 지도, 예약 시스템, 뷰어, 위젯 같은 웹 애플리케이션 역시 접근성을 고려해야 합니다.',
        },
        {
            type: 'p',
            text: '**❌ 위반 예시**',
        },
        {
            type: 'code',
            language: 'text',
            text: `웹페이지

키보드 사용 가능
      ↓
예약 위젯 진입
      ↓
마우스로만 조작 가능`,
        },
        {
            type: 'p',
            text: '**✅ 좋은 예시**',
        },
        {
            type: 'code',
            language: 'text',
            text: `웹 애플리케이션

키보드 접근
대체 텍스트
초점 이동
레이블
명도 대비

접근성 제공

또는

동일한 기능을 수행하는
접근 가능한 대체 콘텐츠 제공`,
        },

        { type: 'hr' },

        {
            type: 'h2',
            text: 'Part 36. 33개 지표를 모두 외워야 할까?',
        },
        {
            type: 'p',
            text: '웹 접근성 지표를 처음 보면 33개라는 숫자 때문에 상당히 복잡해 보입니다.',
        },
        {
            type: 'p',
            text: '하지만 개발할 때 모든 번호를 외우기보다는 네 가지 질문으로 생각해보면 조금 쉬워집니다.',
        },
        {
            type: 'code',
            language: 'text',
            text: `① 인식할 수 있는가?

이미지를 보지 못해도?
소리를 듣지 못해도?
색을 구분하지 못해도?


② 조작할 수 있는가?

마우스 없이도?
키보드만으로도?
한 손가락만으로도?


③ 이해할 수 있는가?

무엇을 입력해야 하는지?
왜 오류가 발생했는지?
예상하지 못한 동작이 발생하지 않는지?


④ 기술적으로 해석 가능한가?

HTML 구조는 올바른지?
보조기술이 요소의 역할을 알 수 있는지?
웹 애플리케이션도 이용할 수 있는지?`,
        },
        {
            type: 'p',
            text: '이 네 가지 질문이 각각 인식의 용이성, 운용의 용이성, 이해의 용이성, 견고성과 연결됩니다.',
        },

        { type: 'hr' },

        {
            type: 'h2',
            text: 'Part 37. 개발하면서 자주 만나는 웹 접근성 문제',
        },
        {
            type: 'p',
            text: '33개 항목 가운데 실제 웹 개발 과정에서 특히 자주 만나는 문제를 추려보면 다음과 같습니다.',
        },
        {
            type: 'code',
            language: 'text',
            text: `이미지
→ alt

입력창
→ label

클릭 기능
→ button

키보드
→ Tab / Enter / Space

초점
→ focus 표시

색상
→ 색 하나에만 의존하지 않기

텍스트
→ 명도 대비

배너
→ 정지 / 이전 / 다음

페이지
→ 적절한 title

콘텐츠
→ heading 구조

링크
→ 목적을 알 수 있는 텍스트

오류
→ 원인과 수정 방법 안내

HTML
→ 올바른 마크업`,
        },

        { type: 'hr' },

        {
            type: 'h2',
            text: 'Part 38. Semantic HTML을 먼저 사용하자',
        },
        {
            type: 'p',
            text: '웹 접근성을 적용하다 보면 `role`, `aria-label`, `aria-hidden` 같은 WAI-ARIA 속성을 자주 만나게 됩니다.',
        },
        {
            type: 'p',
            text: '하지만 모든 요소에 ARIA를 많이 붙인다고 접근성이 좋아지는 것은 아닙니다.',
        },
        {
            type: 'p',
            text: '**복잡한 방법**',
        },
        {
            type: 'code',
            language: 'html',
            text: `<div
  role="button"
  tabindex="0"
  onclick="save()"
  onkeydown="..."
>
  저장
</div>`,
        },
        {
            type: 'p',
            text: '**더 간단한 방법**',
        },
        {
            type: 'code',
            language: 'html',
            text: `<button type="button">
  저장
</button>`,
        },
        {
            type: 'p',
            text: '브라우저는 이미 `button`이 버튼이라는 사실을 알고 있기 때문에 기본적인 키보드 동작과 의미를 제공합니다.',
        },
        {
            type: 'code',
            language: 'text',
            text: `Semantic HTML

button
nav
main
header
footer
label
table

      ↓

브라우저가 의미를 이해

      ↓

보조기술도 의미를 이해`,
        },
        {
            type: 'quote',
            text: 'ARIA로 HTML을 다시 만드는 것보다 의미에 맞는 HTML 요소를 먼저 사용하는 것이 좋다.',
        },

        { type: 'hr' },

        {
            type: 'h2',
            text: 'Part 39. 웹 접근성은 자동 검사만으로 끝나지 않는다',
        },
        {
            type: 'p',
            text: '웹 접근성 검사 도구를 이용하면 많은 문제를 빠르게 확인할 수 있습니다.',
        },
        {
            type: 'code',
            language: 'text',
            text: `자동 검사로
발견하기 좋은 문제

alt 누락

label 누락

중복 id

명도 대비

일부 ARIA 오류`,
        },
        {
            type: 'p',
            text: '하지만 모든 문제를 자동으로 찾을 수 있는 것은 아닙니다.',
        },
        {
            type: 'code',
            language: 'text',
            text: `직접 사용해야
발견하기 쉬운 문제

Tab 순서가 이상함

모달을 닫은 뒤
초점이 사라짐

키보드로
메뉴를 열 수 없음

스크린리더가
버튼 이름을 이상하게 읽음

자동 배너를
멈출 수 없음

오류가 발생했는데
어디를 수정해야 할지 모름`,
        },
        {
            type: 'p',
            text: '실제 웹 접근성 품질인증에서도 전문가심사뿐 아니라 장애 유형별 사용자가 실제 기능을 수행하는 사용자심사를 진행합니다.',
        },
        {
            type: 'quote',
            text: '웹 접근성은 코드가 규칙에 맞는지를 검사하는 것에서 끝나는 것이 아니라 실제 사용자가 서비스를 이용할 수 있는지를 확인하는 과정이다.',
        },

        { type: 'hr' },

        {
            type: 'h2',
            text: '마치며 — 좋은 웹 접근성은 결국 좋은 웹사이트에 가깝다',
        },
        {
            type: 'p',
            text: '웹 접근성을 처음 접하면 `alt`, `label`, `caption`, `focus`, `contrast`, `ARIA`처럼 지켜야 할 규칙이 굉장히 많아 보입니다.',
        },
        {
            type: 'p',
            text: '하지만 각 항목이 만들어진 이유를 살펴보면 결국 하나의 방향으로 이어집니다.',
        },
        {
            type: 'code',
            language: 'text',
            text: `보이지 않아도
이해할 수 있고

마우스가 없어도
조작할 수 있고

색을 구분하지 못해도
정보를 알 수 있고

실수하더라도
다시 수정할 수 있고

어떤 도구를 사용하더라도
콘텐츠의 의미를
전달받을 수 있도록 만드는 것`,
        },
        {
            type: 'p',
            text: '그리고 이런 웹사이트는 장애가 있는 사용자에게만 편리한 것이 아닙니다.',
        },
        {
            type: 'list',
            items: [
                '키보드로 빠르게 웹사이트를 사용하는 사용자',
                '햇빛 때문에 화면이 잘 보이지 않는 사용자',
                '작은 스마트폰 화면을 사용하는 사용자',
                '소리를 들을 수 없는 환경에서 영상을 보는 사용자',
                '일시적으로 마우스나 한 손을 사용하기 어려운 사용자',
            ],
        },
        {
            type: 'p',
            text: '모두에게 더 사용하기 쉬운 서비스가 될 수 있습니다.',
        },
        {
            type: 'quote',
            text: '웹 접근성은 품질인증을 통과하기 위한 체크리스트가 아니라 다양한 환경의 사용자가 같은 정보와 기능에 접근할 수 있도록 만드는 웹 개발의 기본 원칙이다.',
        },
        {
            type: 'p',
            text: '결국 웹 접근성을 지킨다는 것은 **더 많은 사람이 문제없이 사용할 수 있는 웹사이트를 만드는 것**이라고 볼 수 있습니다.',
        },
    ],
};