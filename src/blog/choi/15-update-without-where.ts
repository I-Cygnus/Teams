import type { BlogPost } from '../../data';

export const post15: BlogPost = {
  id: '15',
  package: 'choi',
  title: 'WHERE 없는 UPDATE를 날린 날 — 그 후 내 SQL이 바뀐 방식',
  excerpt:
    '운영 DB에서 UPDATE를 실행했는데 "3,847 rows affected"가 떴습니다. 예상은 1건이었습니다. 등에 식은땀이 흐르던 그 몇 분과, 사고를 수습한 과정, 그리고 그날 이후 모든 운영 SQL에 적용하게 된 세 가지 원칙 — 멱등성, 롤백문 동봉, 실행 전 SELECT 리허설을 이야기합니다.',
  category: 'Backend',
  authorOverride: { name: 'Mr.Choi', role: 'Backend Developer', accent: '#B91C1C' },
  publishedAt: '2026-08-18',
  readingMinutes: 11,
  cover: 'linear-gradient(135deg,#B91C1C 0%,#7F1D1D 60%,#1C1917 100%)',
  tags: ['SQL', 'Operations', 'Incident', 'Postmortem', 'Backend'],
  body: [
    // ── 도입 ──
    {
      type: 'p',
      text: '고백으로 시작하겠습니다. 운영 DB에 UPDATE를 실행했고, 결과 메시지에 이렇게 떴습니다 — **"3,847 rows affected."** 제가 바꾸려던 건 **1건**이었습니다.',
    },
    {
      type: 'p',
      text: '메뉴 설정 하나를 고치는 단순한 작업이었습니다. 에디터에서 쿼리를 다듬다가 WHERE 절을 지운 상태로 실행 버튼을 눌렀고, 커밋까지 나간 뒤에야 숫자가 눈에 들어왔습니다. 그 순간의 감각은 겪어본 분만 알 겁니다 — 손끝이 차가워지고, 머릿속에서 "이 테이블을 지금 몇 명이 쓰고 있지?"부터 돌아갑니다.',
    },
    {
      type: 'p',
      text: '이 글은 그 사고를 어떻게 수습했는지, 그리고 그날 이후 제 운영 SQL이 **구조적으로** 어떻게 바뀌었는지에 대한 기록입니다. "조심하자"는 다짐은 대책이 아니니까요.',
    },

    { type: 'hr' },

    // ── Part 1 ──
    { type: 'h2', text: 'Part 1. 수습 — 복구는 침착함이 아니라 준비가 한다' },
    {
      type: 'p',
      text: '다행이었던 건 두 가지였습니다. 첫째, 덮어쓴 컬럼이 코드성 값이라 **원래 값의 분포를 다른 소스(백업 스냅샷과 기준 테이블)에서 역산**할 수 있었습니다. 둘째, 변경 직전에 해당 테이블을 조회한 결과가 세션에 남아 있어 대조가 가능했습니다.',
    },
    {
      type: 'p',
      text: '그래서 복구는 됐습니다. 하지만 복구하는 내내 든 생각은 하나였습니다 — **이건 운이 좋았던 것이지, 잘한 것이 아니다.** 만약 덮어쓴 값이 역산 불가능한 데이터였다면? 조회 결과가 남아 있지 않았다면? "침착하게 잘 수습했다"로 끝내면 다음 사고 때는 운이 없을 수도 있습니다. 사고의 원인을 "부주의"로 결론 내리면 대책이 "더 조심하기"가 되는데, 사람의 조심성은 시스템이 아닙니다.',
    },
    {
      type: 'quote',
      text: '부주의를 원인으로 적는 순간 개선은 끝납니다. 원인은 "실수가 사고가 되도록 방치된 구조"에 있다고 적어야, 대책이 구조가 됩니다.',
    },

    { type: 'hr' },

    // ── Part 2 ──
    { type: 'h2', text: 'Part 2. 그날 이후의 세 가지 원칙' },
    {
      type: 'p',
      text: '이후 저는 운영에 나가는 모든 SQL 스크립트를 세 가지 원칙으로 작성합니다. 실제로 최근 운영 이관 작업에서 스크립트 9종을 전부 이 형식으로 만들었습니다.',
    },
    { type: 'h3', text: '원칙 1 — 실행 전 SELECT 리허설: 영향 범위를 먼저 눈으로 확인한다' },
    {
      type: 'code',
      language: 'sql',
      text: `-- 모든 UPDATE/DELETE 앞에는 같은 WHERE의 SELECT가 먼저 온다
SELECT menu_id, menu_nm, use_yn        -- ① 몇 건이 바뀔지 먼저 확인
FROM usr_menu
WHERE menu_id = 'M0231';
-- 기대: 1 row. 아니라면 여기서 멈춘다.

UPDATE usr_menu SET use_yn = 'N'       -- ② 확인한 그 WHERE를 그대로 사용
WHERE menu_id = 'M0231';`,
    },
    {
      type: 'p',
      text: '핵심은 SELECT와 UPDATE가 **같은 WHERE 절을 공유**한다는 것입니다. SELECT로 1건을 확인하고 UPDATE에서 WHERE를 새로 타이핑하면, 확인의 의미가 없습니다. 복사해서 재사용합니다.',
    },
    { type: 'h3', text: '원칙 2 — 멱등성: 두 번 실행해도 같은 결과여야 한다' },
    {
      type: 'code',
      language: 'sql',
      text: `-- 나쁜 예: 두 번 실행하면 중복 INSERT
INSERT INTO usr_menugrp (grp_id, menu_id) VALUES ('G01', 'M0231');

-- 좋은 예: 몇 번을 실행해도 결과는 하나
INSERT INTO usr_menugrp (grp_id, menu_id)
SELECT 'G01', 'M0231'
WHERE NOT EXISTS (
  SELECT 1 FROM usr_menugrp WHERE grp_id = 'G01' AND menu_id = 'M0231'
);`,
    },
    {
      type: 'p',
      text: '운영 스크립트는 이상하게 꼭 두 번 실행됩니다 — 네트워크가 끊겨서, 반영이 안 된 줄 알고, 다른 사람이 이미 실행한 줄 몰라서. **"한 번만 실행하세요"라는 주석은 방어가 아닙니다.** 두 번 실행해도 안전한 쿼리가 방어입니다.',
    },
    { type: 'h3', text: '원칙 3 — 롤백문 동봉: 되돌리는 방법을 실행 전에 작성한다' },
    {
      type: 'code',
      language: 'sql',
      text: `-- ▶ 적용
UPDATE mdq_code SET code_nm = '개선완료' WHERE code_id = 'C042';

-- ◀ 롤백 (적용 전 값 명시 — 실행 전에 미리 작성해 둔다)
-- UPDATE mdq_code SET code_nm = '조치완료' WHERE code_id = 'C042';`,
    },
    {
      type: 'p',
      text: '롤백문을 **사고가 난 뒤에** 쓰면 이미 늦습니다 — 원래 값이 뭐였는지 그때는 모르니까요. 적용 스크립트를 쓰는 시점이 원래 값을 알고 있는 마지막 순간입니다. 그래서 적용문과 롤백문은 항상 같은 파일에, 같은 커밋으로 들어갑니다. DB 밖의 것(오류데이터 원본 파일 등)까지 되돌려야 하는 작업이라면, 그 절차도 주석으로 함께 남깁니다.',
    },
    {
      type: 'image',
      src: '/blog/choi/15/01-three-rules.svg',
      alt: '운영 SQL의 세 가지 원칙 — 실행 전 SELECT 리허설로 영향 범위 확인, 멱등성으로 중복 실행 방어, 롤백문 동봉으로 되돌릴 방법을 실행 전에 확보',
      caption: '세 원칙의 공통점 — 사람의 조심성이 아니라 스크립트의 구조에 안전을 심는다.',
    },

    { type: 'hr' },

    // ── Part 3 ──
    { type: 'h2', text: 'Part 3. 도구 차원의 안전장치 — 습관을 시스템으로' },
    {
      type: 'p',
      text: '원칙은 사람이 지키는 것이라 결국 또 뚫립니다. 그래서 도구 차원의 안전장치도 몇 가지 얹었습니다.',
    },
    {
      type: 'list',
      items: [
        '**autocommit 끄기** — 운영 DB 접속 세션은 기본 `SET autocommit = off`. UPDATE 후 결과 건수를 보고 COMMIT/ROLLBACK을 선택할 기회가 생깁니다. 그 사고 때 이 설정 하나만 있었어도 "3,847"을 보고 ROLLBACK 했을 겁니다.',
        '**트랜잭션 블록 템플릿** — 스크립트 파일 맨 위에 `BEGIN;` 맨 아래에 `-- COMMIT; (건수 확인 후 수동으로)` 를 기본 포함',
        '**MySQL이라면 `sql_safe_updates=1`** — WHERE 없는 UPDATE/DELETE 자체를 세션에서 거부',
        '**계정 분리** — 조회용 읽기 계정으로 접속해 있는 것을 기본 상태로. 쓰기 계정은 스크립트 실행 순간에만',
      ],
    },

    { type: 'hr' },

    // ── 마무리 ──
    { type: 'h2', text: '마치며 — 사고는 자산이 될 때만 값을 한다' },
    {
      type: 'quote',
      text: '"다시는 실수하지 말자"는 대책이 아닙니다. 실수해도 사고가 되지 않는 구조 — 그것만이 대책입니다.',
    },
    {
      type: 'list',
      items: [
        '**SELECT 리허설** — 같은 WHERE로 영향 범위를 먼저 확인, WHERE는 복사해서 재사용',
        '**멱등성** — 두 번 실행해도 같은 결과. "한 번만 실행" 주석은 방어가 아니다',
        '**롤백문 동봉** — 원래 값을 아는 마지막 순간은 적용문을 쓰는 지금이다',
        '**도구로 이중화** — autocommit off, 트랜잭션 템플릿, safe updates, 계정 분리',
      ],
    },
    {
      type: 'p',
      text: '이 사고를 겪은 뒤로 작성한 운영 스크립트 9종은 전부 멱등+롤백 동봉 형식이고, 그중 몇 개는 실제로 두 번 실행됐지만 아무 일도 없었습니다. 그날의 식은땀이 시스템이 된 셈이죠. 여러분의 "아찔했던 쿼리" 이야기도 궁금합니다 — 그리고 그 뒤에 무엇을 바꾸셨는지도요.',
    },
  ],
};
