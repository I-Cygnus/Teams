import type { BlogPost } from '../../data';

export const post13: BlogPost = {
  id: '13',
  package: 'choi',
  title: '300GB인데, 데이터 유실은 아닙니다 — 스캔 없이 내린 판정',
  excerpt:
    '상세 테이블은 300GB, 요약 테이블은 22MB. "데이터가 날아간 것 아니냐"는 의심이 먼저 나왔습니다. 운영 DB라 전체 스캔은 불가능한 상황 — pg_stat과 pg_class 메타데이터만으로 "유실이 아니라 99.9%가 빈 페이지"임을 확정하고, 300GB를 회수하고, 같은 사고가 보이는 화면까지 만든 과정입니다.',
  category: 'Backend',
  authorOverride: { name: 'Mr.Choi', role: 'Backend Developer', accent: '#1C7C46' },
  publishedAt: '2026-08-17',
  readingMinutes: 15,
  cover: 'linear-gradient(135deg,#1C7C46 0%,#14532D 60%,#0F172A 100%)',
  tags: ['PostgreSQL', 'VACUUM', 'Bloat', 'Troubleshooting', 'Backend'],
  body: [
    // ── 도입 ──
    {
      type: 'p',
      text: '운영 PostgreSQL에서 디스크가 이상하게 차오르고 있었습니다. 범인을 추적하니 프로파일링 상세 테이블 하나가 **300GB**. 그런데 이 테이블과 짝을 이루는 요약 테이블은 **22MB**였습니다. 네 자릿수 차이입니다.',
    },
    {
      type: 'p',
      text: '이 숫자를 본 첫 반응은 저를 포함해 모두 같았습니다 — "상세 데이터가 어디로 날아간 거 아니야?" 요약이 4만 건인데 상세가 이 정도 크기면, 비율이 어느 쪽으로든 크게 어긋나 있는 거니까요. **데이터 유실**이라는 단어가 회의에 등장하는 순간, 이건 디스크 문제가 아니라 신뢰 문제가 됩니다.',
    },
    {
      type: 'p',
      text: '문제는 검증 방법이었습니다. 운영 중인 DB에서 300GB 테이블을 `COUNT(*)`나 풀스캔으로 확인하는 순간 서비스에 영향이 갑니다. 그래서 이 사건의 제약 조건은 처음부터 명확했습니다 — **테이블을 읽지 않고 판정할 것.**',
    },

    { type: 'hr' },

    // ── Part 1 ──
    { type: 'h2', text: 'Part 1. 모순되는 통계 — dead는 0인데 크기는 300GB' },
    {
      type: 'p',
      text: 'PostgreSQL은 테이블을 읽지 않아도 볼 수 있는 통계를 꽤 많이 가지고 있습니다. 첫 번째로 연 것은 `pg_stat_user_tables`였습니다.',
    },
    {
      type: 'code',
      language: 'sql',
      text: `SELECT n_live_tup, n_dead_tup, last_autovacuum
FROM pg_stat_user_tables
WHERE relname = 'profiling_detail';

-- n_live_tup : 310,000   (살아있는 행 31만)
-- n_dead_tup : 0         (죽은 튜플 없음?)
-- 크기        : 300GB`,
    },
    {
      type: 'p',
      text: '이상하지 않나요? 행이 31만 개뿐인데 300GB면 **행 하나가 1MB**라는 계산이 나옵니다. 이 테이블의 행은 커봐야 수백 바이트입니다. 그리고 `n_dead_tup = 0` — 죽은 튜플이 없다는데 공간은 가득 차 있습니다. 통계 어딘가가 현실과 어긋나 있는 겁니다.',
    },
    {
      type: 'p',
      text: '다음으로 크기를 분해했습니다. 300GB가 **어디에** 있는지부터 좁혀야 하니까요.',
    },
    {
      type: 'code',
      language: 'sql',
      text: `SELECT pg_size_pretty(pg_relation_size(oid))        AS heap,   -- 본체
       pg_size_pretty(pg_indexes_size(oid))          AS index,  -- 인덱스
       pg_size_pretty(pg_total_relation_size(oid)
         - pg_relation_size(oid) - pg_indexes_size(oid)) AS toast -- 대형값 저장소
FROM pg_class WHERE relname = 'profiling_detail';
-- 결과: heap이 거의 전부. TOAST/인덱스는 정상 범위.`,
    },
    {
      type: 'p',
      text: 'TOAST(대형 값 별도 저장)도, 인덱스 비대도 아니었습니다. **heap 본체가 300GB.** 이제 용의자는 하나로 좁혀집니다 — 행은 적은데 heap이 크다면, 남는 건 "빈 공간이 반납되지 않은 상태", 즉 **bloat(부풀림)**입니다.',
    },

    { type: 'hr' },

    // ── Part 2 ──
    { type: 'h2', text: 'Part 2. 결정타 — 페이지당 0.009행' },
    {
      type: 'p',
      text: '확정 증거는 `pg_class`에 있었습니다. PostgreSQL은 테이블을 8KB 단위의 **페이지(page)**로 저장하는데, `relpages`(페이지 수)와 `reltuples`(추정 행 수)를 나눠보면 페이지당 행 밀도가 나옵니다.',
    },
    {
      type: 'code',
      language: 'sql',
      text: `SELECT relpages,                       -- 36,620,000 페이지 (8KB씩)
       reltuples,                      -- 310,000 행
       reltuples / relpages AS rows_per_page
FROM pg_class WHERE relname = 'profiling_detail';

-- rows_per_page = 0.009
-- 페이지 111장당 행 1개. 정상이라면 페이지당 수십 행.`,
    },
    {
      type: 'image',
      src: '/blog/choi/13/01-empty-pages.svg',
      alt: '8KB 페이지 3,662만 장 중 유효 행이 든 페이지는 극소수이고 나머지 99.9%는 빈 페이지임을 보여주는 격자 다이어그램',
      caption: 'relpages 3,662만 : rows 31만 = 페이지당 0.009행. 테이블을 읽지 않고도 "99.9%가 빈 페이지"가 확정됩니다.',
    },
    {
      type: 'p',
      text: '**페이지당 0.009행.** 페이지 111장에 행이 하나 꼴입니다. 이 숫자 하나로 판정이 끝났습니다 — 이 300GB는 데이터가 아니라 **비어 있는 페이지들**입니다. 유실된 게 아니라, 지워진 자리가 반납되지 않은 것. 메타데이터 세 개(`relpages`, `reltuples`, 크기 분해)만으로, 300GB를 단 한 바이트도 읽지 않고 결론에 도달했습니다.',
    },
    {
      type: 'p',
      text: '남은 퍼즐은 두 개였습니다. **왜 dead가 0인가?** — autovacuum이 이미 다녀갔기 때문입니다. VACUUM은 죽은 튜플을 "재사용 가능"으로 표시하지만, **한번 커진 파일을 OS에 돌려주지는 않습니다.** 그래서 dead는 0인데 파일은 300GB인 상태가 됩니다. **왜 이렇게 커졌나?** — 시점을 추적하니 몇 주 전 **디스크풀 크래시**와 겹쳤습니다. 대량 적재가 실패로 끝나며 남긴 잔해였고, 요약 테이블 4만 건은 전부 정상, 상세에는 짝 잃은 고아 행뿐이라는 대조가 이를 뒷받침했습니다.',
    },
    {
      type: 'quote',
      text: '"유실됐다"와 "부풀었다"는 대응이 정반대입니다. 전자는 복구 작전이고, 후자는 청소입니다. 판정을 서두르면 엉뚱한 작전을 시작하게 됩니다.',
    },

    { type: 'hr' },

    // ── Part 3 ──
    { type: 'h2', text: 'Part 3. 회수 — VACUUM FULL의 값을 치르고 300GB를 되찾다' },
    {
      type: 'p',
      text: '판정이 "잔해"이므로 대응은 청소입니다. 고아 데이터를 DELETE한 뒤, 공간을 OS에 반납하기 위해 `VACUUM FULL`을 실행했습니다. 여기서 흔한 오해 하나를 짚고 가야 합니다.',
    },
    {
      type: 'list',
      items: [
        '**일반 VACUUM** — 죽은 공간을 "재사용 가능"으로 표시. 파일 크기는 거의 안 줄어듭니다. 락이 가볍습니다.',
        '**VACUUM FULL** — 테이블을 새 파일로 다시 씁니다. 공간이 실제로 반납되지만, **ACCESS EXCLUSIVE 락**으로 그동안 읽기까지 막힙니다.',
      ],
    },
    {
      type: 'p',
      text: 'VACUUM FULL은 공짜가 아닙니다. 저희는 해당 테이블을 쓰는 기능이 멈춰도 되는 시간대를 골라 실행했고, **300GB가 수십 MB로** 돌아왔습니다. 만약 서비스를 멈출 수 없는 상황이라면 `pg_repack` 같은 온라인 재구성 도구가 대안입니다 — 핵심은 "무엇을 얻기 위해 어떤 락을 감수하는가"를 알고 선택하는 것입니다.',
    },

    { type: 'hr' },

    // ── Part 4 ──
    { type: 'h2', text: 'Part 4. 회수는 증상 처리다 — 보이게 만들어야 끝난다' },
    {
      type: 'p',
      text: '300GB를 되찾은 날 저녁에 든 생각은 "끝났다"가 아니라 **"다음엔 어떻게 미리 알지?"**였습니다. 이번 사고는 디스크가 다 차고 나서야 발견됐습니다. 사후 진단은 이제 할 수 있지만, 사전에 보이지 않으면 같은 일이 반복됩니다.',
    },
    {
      type: 'p',
      text: '그래서 테이블별 사용량·전체 대비 비율·**낭비공간(bloat) 비율**을 상시 조회하는 화면과 API를 새로 만들었습니다. 여기서 설계 판단이 하나 있었는데 — bloat 측정에 정확 함수(`pgstattuple`) 대신 **근사 함수(`pgstattuple_approx`)**를 채택한 것입니다.',
    },
    {
      type: 'image',
      src: '/blog/choi/13/02-approx-tradeoff.svg',
      alt: '정확 함수는 테이블 전체를 읽어 부하가 크고, 근사 함수는 visibility map을 활용해 일부만 읽으면서 오차 몇 퍼센트 수준의 추정치를 주는 트레이드오프 비교',
      caption: '모니터링의 목적은 "청소가 필요한가"의 판단 — 소수점 정확도가 아니라, 부하 없이 자주 볼 수 있는 것이 가치입니다.',
    },
    {
      type: 'p',
      text: '정확 함수는 테이블 전체를 읽습니다 — 300GB 사건을 감시하겠다고 300GB를 주기적으로 스캔하는 건 모순이죠. 근사 함수는 visibility map을 활용해 일부만 읽고 추정치를 줍니다. 오차는 있지만, **"청소가 필요한가"라는 판단에는 충분한 정확도**입니다. 이 채택 근거와 필요 권한까지 문서로 남겨, 다음 사람이 "왜 approx지?"라고 물을 때 답이 있게 했습니다.',
    },

    { type: 'hr' },

    // ── 마무리 ──
    { type: 'h2', text: '마치며 — 운영 DB는 읽지 않고 진단하는 기술' },
    {
      type: 'quote',
      text: '300GB를 판정하는 데 필요한 건 300GB를 읽는 것이 아니라, 메타데이터 세 줄이었습니다.',
    },
    {
      type: 'list',
      items: [
        '**크기 이상은 분해부터** — heap / TOAST / index 어디가 큰지에 따라 용의자가 달라집니다',
        '**`relpages` vs `reltuples`** — 페이지당 행 밀도는 스캔 없이 bloat를 확정하는 결정타',
        '**VACUUM은 공간을 OS에 돌려주지 않는다** — dead=0인데 파일이 큰 상태는 정상적인(그러나 오해받는) 결과',
        '**회수(VACUUM FULL)는 락 비용을 알고 선택** — 못 멈추면 pg_repack',
        '**사후 진단을 사전 가시성으로** — 사고에서 배운 지표는 화면이 되어야 끝난 것',
      ],
    },
    {
      type: 'p',
      text: '이 사건 이후로 저는 "디스크가 찼다"는 말을 들으면 데이터가 많은지부터 묻지 않습니다. **행이 몇 개인지, 페이지가 몇 장인지**부터 묻습니다. 둘의 비율이 어긋나 있다면 — 그건 데이터 문제가 아니라 공간 문제이고, 대응 작전이 완전히 달라지니까요. 여러분의 운영 DB에서 가장 큰 테이블, 페이지당 행 밀도를 한번 확인해 보시는 건 어떨까요?',
    },
  ],
};
