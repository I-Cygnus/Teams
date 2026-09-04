import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DOCS, GROUPS } from './registry';

/** 이 세트가 무엇을 근거로 만들어졌는지 — 숫자가 곧 신뢰도라서 앞에 둔다 */
const SOURCES = [
  {
    n: '159',
    unit: '건',
    label: '합격 서류 아카이브',
    desc: '자소서 90 · 후기 27 · GitHub 이력서 18 · 포트폴리오 16 · 가이드 8건을 전수 분석',
  },
  {
    n: '16',
    unit: '편',
    label: '기술 블로그',
    desc: '최근 6편이 엔코아 실무 기반 — 서류의 주장을 뒷받침하는 증거 링크로 사용',
  },
  {
    n: '11',
    unit: '종',
    label: '엔코아 작업 정리',
    desc: '신규 화면 2건 · 운영 장애 2건 · 이슈 10건+의 사실 관계와 수치',
  },
  {
    n: '9',
    unit: '종',
    label: '실물 합격 서류',
    desc: '카카오·삼성·CJ·쿠팡 등 합격 이력서·자소서·면접 복기록 원문',
  },
];

/** 문서를 나란히 놓고 대조했을 때 나온 불일치 — 고치기 전에는 제출하지 않는다 */
const BLOCKERS = [
  {
    t: 'MAU 표기',
    d: '이력서·플레이북은 600+, 포트폴리오 사이트는 3곳 모두 500+',
    fix: '최신 실측값 하나로 통일 (이번 세트는 600+ 기준)',
  },
  {
    t: '학점',
    d: '가천대 3.81(기제출본) vs 3.87(웹 이력서) / 군산대 3.60 vs 4.03',
    fix: '증명서 기준으로 확정 후 전 문서 수정',
  },
  {
    t: '영문 성명',
    d: 'HyunSoo · HyenSoo · Hyeon Su 3종이 문서마다 다르게 표기됨',
    fix: '여권 표기로 통일',
  },
  {
    t: '인증 중복 제거 수',
    d: '컨트롤러 71곳(이력서) vs 76곳(블로그 07편)',
    fix: '71곳은 컨트롤러 기준, 76곳은 복사본 전체 기준으로 설명 준비',
  },
  {
    t: '링크 4종',
    d: 'i-poten.com · GitHub · 블로그 · 포트폴리오',
    fix: '접속 확인 + 한글 도메인은 영문 미러 병기',
  },
  {
    t: '저장소 시크릿',
    d: 'I-Poten·I-Fence 저장소에 .env와 Firebase 키가 커밋되어 있음',
    fix: 'GitHub 링크를 걸기 전 제거 + 키 전량 로테이션 (필수)',
  },
];

const STEPS = [
  { t: '공고를 먼저 읽는다', d: '주요업무·우대사항에서 키워드 5~8개를 뽑는다. 이력서는 내 언어가 아니라 공고의 언어로 쓴다.' },
  { t: '이력서 버전을 고른다', d: '스타트업이면 V1, 데이터·플랫폼 기업이면 V2, 대기업·금융·SI면 V3. 뽑은 키워드와 겹치는 불릿을 최상단으로 올린다.' },
  { t: '자소서를 조립한다', d: '소재 뱅크의 매핑표에서 문항별 소재를 고른다. 새로 쓰는 것은 회사 리서치 문단 하나뿐이다.' },
  { t: '리서치 문단을 검사한다', d: '회사명을 다른 회사로 바꿔도 문장이 성립하면 실패다. 사업·기술 고유명사가 들어가야 한다.' },
  { t: '조정 메모를 처리한다', d: '각 문서 하단의 ✍ 블록을 처리하고 삭제한다. 수치는 전 문서가 같은지 마지막으로 대조한다.' },
];

const PRINCIPLES = [
  { t: '첫 화면에서 승부', d: '이력서는 첫 5줄에 숫자, 자소서는 첫 문장에 결론. 서류 한 건에 주어지는 시간은 6~10초라는 전제.' },
  { t: '판단의 근거를 쓴다', d: '"했습니다"가 아니라 "~라고 판단했습니다". 합격 자소서 90건을 관통하는 단 하나의 공통 골격.' },
  { t: '전후 대비 수치', d: '"개선했다"가 아니라 "120ms → 11ms". 다만 측정하지 못한 것에는 숫자를 붙이지 않는다.' },
  { t: '무기는 하나', d: '역량을 나열하지 않고 근본원인분석 하나로 서류부터 면접까지 반복한다.' },
  { t: '증거는 외주화', d: '형용사 대신 링크. 블로그 글·서비스 URL·저장소가 주장을 대신 증명한다.' },
  { t: '경계를 자진 신고', d: 'AsianMart의 팀 구간과 개인 확장 구간을 먼저 밝힌다. 과장 의심을 차단하는 가장 싼 보험.' },
  { t: '성장형이 아니라 기여형', d: '"성장하겠습니다"는 아직 투입 불가로 읽힌다. "부족하지만", "최고의"도 쓰지 않는다.' },
];

export default function ApplyHub() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-[var(--bg)] px-4 pt-24 pb-32 sm:pt-32"
    >
      <div className="mx-auto max-w-5xl">
        {/* ── 헤더 ─────────────────────────────────────────── */}
        <header>
          <p className="font-mono text-[12px] tracking-[0.14em] text-[var(--ink-faint)] uppercase">
            Application Set · 2026.08.18
          </p>
          <h1 className="display mt-4 text-[clamp(2.4rem,5.6vw,3.6rem)] leading-[1.05] font-bold tracking-[-0.035em] text-[var(--ink)]">
            제출 서류 세트
          </h1>
          <p className="mt-6 max-w-[62ch] text-[16.5px] leading-[1.8] text-[var(--ink-soft)]">
            이력서 3종, 경력기술서, 포트폴리오 케이스북, 자기소개서 4종.
            같은 경력을 회사 유형에 따라 다시 조립할 수 있도록 나눠 두었습니다.
            모든 수치는 실제 작업 기록에서 확인된 값만 썼고, 각 문서 하단에는 제출 전 조정 메모를 남겼습니다.
          </p>
        </header>

        {/* ── 근거 ─────────────────────────────────────────── */}
        <section className="mt-16">
          <h2 className="text-[13px] font-bold tracking-[0.1em] text-[var(--ink-faint)] uppercase">
            무엇을 근거로 만들었나
          </h2>
          <div className="mt-5 grid gap-px overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--line)] sm:grid-cols-2 lg:grid-cols-4">
            {SOURCES.map((s) => (
              <div key={s.label} className="bg-[var(--card)] p-5">
                <div className="flex items-baseline gap-1">
                  <span className="text-[30px] leading-none font-bold tracking-[-0.04em] text-[var(--ink)]">
                    {s.n}
                  </span>
                  <span className="text-[13px] font-medium text-[var(--ink-faint)]">{s.unit}</span>
                </div>
                <p className="mt-2.5 text-[14px] font-semibold text-[var(--ink)]">{s.label}</p>
                <p className="mt-1.5 text-[13px] leading-[1.65] text-[var(--ink-faint)]">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 제출 전 필수 점검 ────────────────────────────── */}
        <section className="mt-14">
          <div className="overflow-hidden rounded-xl border border-[#f0dfae] bg-[#fffdf6]">
            <div className="border-b border-[#f0dfae] bg-[#fff8e6] px-6 py-4">
              <h2 className="text-[16px] font-bold text-[#8a5a00]">제출 전 반드시 통일할 것</h2>
              <p className="mt-1.5 text-[13.5px] leading-[1.7] text-[#6b4b12]">
                읽는 사람은 이력서와 포트폴리오, 지원서를 나란히 놓고 봅니다.
                하나가 어긋나면 나머지 수치까지 의심받기 때문에, 아래 6건은 내용을 고치기 전에 먼저 맞춰야 합니다.
              </p>
            </div>
            <ul className="divide-y divide-[#f2e6c9]">
              {BLOCKERS.map((b, i) => (
                <li key={b.t} className="flex gap-4 px-6 py-4">
                  <span className="mt-[2px] font-mono text-[12px] text-[#c0a161]">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[14.5px] font-semibold text-[#6b4b12]">{b.t}</p>
                    <p className="mt-1 text-[13.5px] leading-[1.7] text-[#7a5e2a]">{b.d}</p>
                    <p className="mt-1.5 text-[13px] leading-[1.7] text-[#9a7c3e]">→ {b.fix}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── 문서 9종 ─────────────────────────────────────── */}
        <section className="mt-20">
          <h2 className="text-[13px] font-bold tracking-[0.1em] text-[var(--ink-faint)] uppercase">
            문서 구성
          </h2>

          {GROUPS.map((g) => {
            const docs = DOCS.filter((d) => d.group === g.id);
            return (
              <div key={g.id} className="mt-10">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-[var(--line)] pb-3">
                  <h3 className="text-[17px] font-bold tracking-[-0.02em] text-[var(--ink)]">
                    {g.label}
                  </h3>
                  <p className="text-[13.5px] text-[var(--ink-faint)]">{g.desc}</p>
                </div>

                <div className="mt-5 space-y-4">
                  {docs.map((d) => (
                    <Link
                      key={d.id}
                      to={`/apply/${d.id}`}
                      className="group block rounded-xl border border-[var(--line)] bg-[var(--card)] p-6 transition-colors hover:border-[#c9d3e8]"
                    >
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <span className="font-mono text-[12px] text-[var(--ink-faint)]">{d.no}</span>
                        <h4 className="text-[17px] font-bold tracking-[-0.02em] text-[var(--ink)] group-hover:text-[var(--accent-strong)]">
                          {d.title}
                        </h4>
                        <span className="rounded border border-[var(--line)] bg-[#f2f4f7] px-2 py-[3px] text-[11.5px] font-medium text-[var(--ink-soft)]">
                          {d.subtitle}
                        </span>
                      </div>

                      <p className="mt-3 text-[15px] leading-[1.75] text-[var(--ink-soft)]">
                        {d.tagline}
                      </p>

                      <div className="mt-4 grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto]">
                        <ul className="space-y-[7px]">
                          {d.points.map((p) => (
                            <li key={p} className="flex gap-2.5 text-[13.8px] leading-[1.7] text-[var(--ink-soft)]">
                              <span className="mt-[9px] block h-[3px] w-[3px] shrink-0 rounded-full bg-[var(--ink-faint)]" />
                              <span>{p}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 border-t border-[var(--line)] pt-4 text-[12.5px] leading-[1.6]">
                        <p className="text-[var(--ink-faint)]">
                          <span className="font-semibold text-[var(--ink-soft)]">언제 쓰나</span>
                          <span className="mx-1.5 text-[var(--line)]">/</span>
                          {d.when}
                        </p>
                        <p className="text-[var(--ink-faint)]">
                          <span className="font-semibold text-[var(--ink-soft)]">근거</span>
                          <span className="mx-1.5 text-[var(--line)]">/</span>
                          {d.basis}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </section>

        {/* ── 조립 순서 ────────────────────────────────────── */}
        <section className="mt-20">
          <h2 className="text-[13px] font-bold tracking-[0.1em] text-[var(--ink-faint)] uppercase">
            새 공고가 나왔을 때 — 30분 조립 순서
          </h2>
          <ol className="mt-6 space-y-px overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--line)]">
            {STEPS.map((s, i) => (
              <li key={s.t} className="flex gap-4 bg-[var(--card)] px-6 py-4">
                <span className="mt-[1px] flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#eef2fb] font-mono text-[12px] font-semibold text-[var(--accent-strong)]">
                  {i + 1}
                </span>
                <div>
                  <p className="text-[15px] font-semibold text-[var(--ink)]">{s.t}</p>
                  <p className="mt-1 text-[14px] leading-[1.75] text-[var(--ink-soft)]">{s.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* ── 작성 원칙 ────────────────────────────────────── */}
        <section className="mt-20">
          <h2 className="text-[13px] font-bold tracking-[0.1em] text-[var(--ink-faint)] uppercase">
            적용한 작성 원칙
          </h2>
          <div className="mt-6 grid gap-px overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--line)] sm:grid-cols-2">
            {PRINCIPLES.map((p) => (
              <div key={p.t} className="bg-[var(--card)] p-5">
                <p className="text-[14.5px] font-semibold text-[var(--ink)]">{p.t}</p>
                <p className="mt-1.5 text-[13.5px] leading-[1.7] text-[var(--ink-faint)]">{p.d}</p>
              </div>
            ))}
          </div>
        </section>

        <p className="mt-16 text-[13px] leading-[1.8] text-[var(--ink-faint)]">
          원본 마크다운 — <code className="font-mono">~/rjob/산출물_20260818/</code>
          <br />
          이 페이지는 원본을 복사해 렌더링합니다. 원고를 고친 뒤에는 두 곳을 함께 갱신해 주세요.
        </p>
      </div>
    </motion.div>
  );
}
