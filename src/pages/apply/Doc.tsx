import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Markdown, { headings } from './Markdown';
import { DOCS, byId } from './registry';

export default function ApplyDoc() {
  const { id } = useParams<{ id: string }>();
  const doc = byId(id);
  const [copied, setCopied] = useState(false);
  const [active, setActive] = useState<string>('');

  const toc = useMemo(() => (doc ? headings(doc.md) : []), [doc]);

  // 문서를 옮겨 다닐 때 스크롤이 중간에 걸려 있으면 첫 화면을 놓친다
  useEffect(() => {
    window.scrollTo(0, 0);
    setCopied(false);
  }, [id]);

  // 목차에서 현재 위치 표시 — 화면 상단 근처의 마지막 제목을 활성으로 본다
  useEffect(() => {
    if (!toc.length) return;
    const onScroll = () => {
      let current = toc[0].id;
      for (const h of toc) {
        const el = document.getElementById(h.id);
        if (el && el.getBoundingClientRect().top <= 140) current = h.id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [toc]);

  if (!doc) return <Navigate to="/apply" replace />;

  const idx = DOCS.findIndex((d) => d.id === doc.id);
  const prev = DOCS[idx - 1];
  const next = DOCS[idx + 1];

  const copy = async () => {
    await navigator.clipboard.writeText(doc.md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
      className="min-h-screen bg-[var(--bg)] px-4 pt-24 pb-32 sm:pt-28"
    >
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[220px_minmax(0,1fr)]">
        {/* ── 사이드바 ─────────────────────────────────────── */}
        <aside className="lg:sticky lg:top-24 lg:h-[calc(100vh-8rem)] lg:overflow-y-auto lg:pr-2">
          <Link
            to="/apply"
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--ink-faint)] transition-colors hover:text-[var(--ink)]"
          >
            <span aria-hidden>←</span> 전체 문서
          </Link>

          <nav className="mt-5 space-y-[3px]">
            {DOCS.map((d) => {
              const on = d.id === doc.id;
              return (
                <Link
                  key={d.id}
                  to={`/apply/${d.id}`}
                  className={`flex items-baseline gap-2 rounded-md px-2.5 py-[7px] text-[13px] leading-[1.5] transition-colors ${
                    on
                      ? 'bg-[#eef2fb] font-semibold text-[var(--accent-strong)]'
                      : 'text-[var(--ink-soft)] hover:bg-[#f0f2f5] hover:text-[var(--ink)]'
                  }`}
                >
                  <span className="font-mono text-[11px] text-[var(--ink-faint)]">{d.no}</span>
                  <span className="min-w-0">{d.title}</span>
                </Link>
              );
            })}
          </nav>

          {toc.length > 0 && (
            <div className="mt-8 border-t border-[var(--line)] pt-5">
              <p className="px-2.5 text-[11.5px] font-bold tracking-[0.1em] text-[var(--ink-faint)] uppercase">
                이 문서 안에서
              </p>
              <nav className="mt-2.5 space-y-[2px]">
                {toc.map((h) => (
                  <a
                    key={h.id}
                    href={`#${h.id}`}
                    className={`block rounded-md px-2.5 py-[5px] text-[12.5px] leading-[1.5] transition-colors ${
                      active === h.id
                        ? 'font-semibold text-[var(--ink)]'
                        : 'text-[var(--ink-faint)] hover:text-[var(--ink-soft)]'
                    }`}
                  >
                    {h.text}
                  </a>
                ))}
              </nav>
            </div>
          )}
        </aside>

        {/* ── 본문 ─────────────────────────────────────────── */}
        <div className="min-w-0">
          <header className="rounded-xl border border-[var(--line)] bg-[var(--card)] p-6 sm:p-7">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="font-mono text-[12px] text-[var(--ink-faint)]">{doc.no}</span>
              <span className="rounded border border-[var(--line)] bg-[#f2f4f7] px-2 py-[3px] text-[11.5px] font-medium text-[var(--ink-soft)]">
                {doc.subtitle}
              </span>
            </div>
            <h1 className="mt-3 text-[clamp(1.6rem,3.4vw,2.1rem)] leading-[1.2] font-bold tracking-[-0.03em] text-[var(--ink)]">
              {doc.title}
            </h1>
            <p className="mt-3 max-w-[60ch] text-[15px] leading-[1.8] text-[var(--ink-soft)]">
              {doc.tagline}
            </p>

            <dl className="mt-5 grid gap-x-8 gap-y-2.5 border-t border-[var(--line)] pt-4 text-[13px] leading-[1.7] sm:grid-cols-2">
              <div>
                <dt className="font-semibold text-[var(--ink-soft)]">언제 쓰나</dt>
                <dd className="mt-0.5 text-[var(--ink-faint)]">{doc.when}</dd>
              </div>
              <div>
                <dt className="font-semibold text-[var(--ink-soft)]">근거</dt>
                <dd className="mt-0.5 text-[var(--ink-faint)]">{doc.basis}</dd>
              </div>
            </dl>

            <div className="mt-5 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={copy}
                className="rounded-md border border-[var(--line)] bg-white px-3.5 py-2 text-[12.5px] font-medium text-[var(--ink-soft)] transition-colors hover:border-[#c9d3e8] hover:text-[var(--ink)]"
              >
                {copied ? '복사했습니다' : '원고 전체 복사'}
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="rounded-md border border-[var(--line)] bg-white px-3.5 py-2 text-[12.5px] font-medium text-[var(--ink-soft)] transition-colors hover:border-[#c9d3e8] hover:text-[var(--ink)]"
              >
                인쇄 · PDF
              </button>
            </div>
          </header>

          <article className="mt-8 rounded-xl border border-[var(--line)] bg-[var(--card)] px-6 py-8 sm:px-10 sm:py-10">
            <Markdown md={doc.md} />
          </article>

          {/* ── 이전 · 다음 ──────────────────────────────── */}
          <nav className="mt-8 grid gap-3 sm:grid-cols-2">
            {prev ? (
              <Link
                to={`/apply/${prev.id}`}
                className="rounded-xl border border-[var(--line)] bg-[var(--card)] p-4 transition-colors hover:border-[#c9d3e8]"
              >
                <p className="text-[11.5px] font-medium tracking-[0.08em] text-[var(--ink-faint)] uppercase">
                  이전
                </p>
                <p className="mt-1 text-[14.5px] font-semibold text-[var(--ink)]">{prev.title}</p>
              </Link>
            ) : (
              <span />
            )}
            {next && (
              <Link
                to={`/apply/${next.id}`}
                className="rounded-xl border border-[var(--line)] bg-[var(--card)] p-4 text-right transition-colors hover:border-[#c9d3e8]"
              >
                <p className="text-[11.5px] font-medium tracking-[0.08em] text-[var(--ink-faint)] uppercase">
                  다음
                </p>
                <p className="mt-1 text-[14.5px] font-semibold text-[var(--ink)]">{next.title}</p>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </motion.div>
  );
}
