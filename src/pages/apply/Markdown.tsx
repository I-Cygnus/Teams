import { Fragment, type ReactNode } from 'react';

/**
 * 제출 원고를 그대로 보여주기 위한 최소 마크다운 렌더러.
 * 원본이 마크다운 파일이라 별도 변환 단계 없이 파일을 그대로 화면에 올린다.
 * 지원 범위는 원고가 실제로 쓰는 문법(제목·목록·표·인용·구분선·강조)으로 한정했다.
 */

export const slug = (text: string) =>
  text.trim().toLowerCase().replace(/[^\w가-힣]+/g, '-').replace(/^-|-$/g, '');

/** 사이드바 목차용 — 본문을 훑어 h2만 뽑는다. */
export function headings(md: string) {
  return md
    .split('\n')
    .filter((l) => l.startsWith('## '))
    .map((l) => {
      const text = l.slice(3).trim();
      return { id: slug(text), text };
    });
}

/** **굵게** · `코드` · [링크](url) · *기울임* */
function inline(src: string, key: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\)|\*[^*]+\*)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;

  while ((m = re.exec(src))) {
    if (m.index > last) out.push(src.slice(last, m.index));
    const t = m[0];
    const k = `${key}-${i++}`;

    if (t.startsWith('**')) {
      out.push(
        <strong key={k} className="font-semibold text-[var(--ink)]">
          {t.slice(2, -2)}
        </strong>,
      );
    } else if (t.startsWith('`')) {
      out.push(
        <code
          key={k}
          className="rounded border border-[var(--line)] bg-[#f2f4f7] px-[5px] py-[1px] font-mono text-[0.86em] text-[#7a2f5a]"
        >
          {t.slice(1, -1)}
        </code>,
      );
    } else if (t.startsWith('[')) {
      const [, label, href] = /\[([^\]]+)\]\(([^)]+)\)/.exec(t)!;
      out.push(
        <a
          key={k}
          href={href}
          target="_blank"
          rel="noreferrer"
          className="text-[var(--accent)] underline underline-offset-2 hover:text-[var(--accent-strong)]"
        >
          {label}
        </a>,
      );
    } else {
      out.push(
        <em key={k} className="italic">
          {t.slice(1, -1)}
        </em>,
      );
    }
    last = m.index + t.length;
  }
  if (last < src.length) out.push(src.slice(last));
  return out;
}

const isTableRow = (l: string) => l.trim().startsWith('|') && l.trim().endsWith('|');
const cells = (l: string) =>
  l.trim().slice(1, -1).split('|').map((c) => c.trim());

export default function Markdown({ md }: { md: string }) {
  const lines = md.split('\n');
  const blocks: ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const key = `b${i}`;

    // 빈 줄
    if (!line.trim()) {
      i++;
      continue;
    }

    // 구분선
    if (/^---+$/.test(line.trim())) {
      blocks.push(<hr key={key} className="my-10 border-0 border-t border-[var(--line)]" />);
      i++;
      continue;
    }

    // 제목
    const h = /^(#{1,4})\s+(.*)$/.exec(line);
    if (h) {
      const level = h[1].length;
      const text = h[2].trim();
      const id = slug(text);
      const note = /^[✍⚠]/.test(text);

      if (level === 1) {
        blocks.push(
          <h1
            key={key}
            id={id}
            className="mt-2 mb-6 text-[clamp(1.7rem,3.6vw,2.3rem)] font-bold leading-[1.2] tracking-[-0.03em] text-[var(--ink)]"
          >
            {inline(text, key)}
          </h1>,
        );
      } else if (level === 2) {
        blocks.push(
          <h2
            key={key}
            id={id}
            className={`scroll-mt-24 mt-14 text-[19px] font-bold tracking-[-0.02em] ${
              note
                ? 'mb-3 text-[#8a5a00]'
                : 'mb-5 border-b border-[var(--line)] pb-2.5 text-[var(--ink)]'
            }`}
          >
            {inline(text, key)}
          </h2>,
        );
      } else if (level === 3) {
        blocks.push(
          <h3
            key={key}
            id={id}
            className={`scroll-mt-24 text-[16px] font-bold tracking-[-0.015em] ${
              note
                ? 'mt-10 mb-3 rounded-t-md bg-[#fff8e6] px-4 pt-3.5 pb-1 text-[#8a5a00]'
                : 'mt-9 mb-3 text-[var(--ink)]'
            }`}
          >
            {inline(text, key)}
          </h3>,
        );
      } else {
        blocks.push(
          <h4 key={key} id={id} className="mt-7 mb-2 text-[14.5px] font-bold text-[var(--ink-soft)]">
            {inline(text, key)}
          </h4>,
        );
      }
      i++;
      continue;
    }

    // 표
    if (isTableRow(line) && isTableRow(lines[i + 1] ?? '') && /^[\s|:-]+$/.test(lines[i + 1])) {
      const head = cells(line);
      i += 2;
      const rows: string[][] = [];
      while (i < lines.length && isTableRow(lines[i])) {
        rows.push(cells(lines[i]));
        i++;
      }
      blocks.push(
        <div key={key} className="my-6 overflow-x-auto rounded-lg border border-[var(--line)]">
          <table className="w-full border-collapse text-[13.5px]">
            <thead>
              <tr className="bg-[#f2f4f7]">
                {head.map((c, ci) => (
                  <th
                    key={ci}
                    className="border-b border-[var(--line)] px-3.5 py-2.5 text-left font-semibold text-[var(--ink)] whitespace-nowrap"
                  >
                    {inline(c, `${key}-h${ci}`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, ri) => (
                <tr key={ri} className={ri % 2 ? 'bg-[#fbfcfd]' : ''}>
                  {r.map((c, ci) => (
                    <td
                      key={ci}
                      className="border-t border-[var(--line)] px-3.5 py-2.5 align-top leading-[1.65] text-[var(--ink-soft)]"
                    >
                      {inline(c, `${key}-${ri}-${ci}`)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      );
      continue;
    }

    // 인용
    if (line.startsWith('>')) {
      const buf: string[] = [];
      while (i < lines.length && lines[i].startsWith('>')) {
        buf.push(lines[i].replace(/^>\s?/, ''));
        i++;
      }
      blocks.push(
        <blockquote
          key={key}
          className="my-5 border-l-[3px] border-[#c8d2e4] bg-[#f7f9fc] px-5 py-3.5 text-[14.5px] leading-[1.8] text-[var(--ink-soft)]"
        >
          {buf.map((b, bi) => (
            <p key={bi} className={bi ? 'mt-2' : ''}>
              {inline(b, `${key}-q${bi}`)}
            </p>
          ))}
        </blockquote>,
      );
      continue;
    }

    // 체크리스트 — 제출 전 점검 항목이라 목록과 다르게 보여준다
    if (/^-\s\[[ x]\]\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^-\s\[[ x]\]\s/.test(lines[i])) {
        items.push(lines[i].replace(/^-\s\[[ x]\]\s/, ''));
        i++;
      }
      blocks.push(
        <ul key={key} className="my-4 space-y-2 rounded-b-md bg-[#fff8e6] px-4 py-3.5">
          {items.map((t, ti) => (
            <li key={ti} className="flex gap-2.5 text-[14px] leading-[1.7] text-[#6b4b12]">
              <span className="mt-[3px] block h-[13px] w-[13px] shrink-0 rounded-[3px] border border-[#d8bb7a] bg-white" />
              <span>{inline(t, `${key}-c${ti}`)}</span>
            </li>
          ))}
        </ul>,
      );
      continue;
    }

    // 목록 (- / 숫자.)
    if (/^(\s*)([-*]|\d+\.)\s+/.test(line)) {
      const ordered = /^\s*\d+\.\s/.test(line);
      const items: { depth: number; text: string }[] = [];
      while (i < lines.length && /^(\s*)([-*]|\d+\.)\s+/.test(lines[i])) {
        const indent = /^(\s*)/.exec(lines[i])![1].length;
        items.push({
          depth: indent >= 2 ? 1 : 0,
          text: lines[i].replace(/^(\s*)([-*]|\d+\.)\s+/, ''),
        });
        i++;
      }
      const Tag = ordered ? 'ol' : 'ul';
      blocks.push(
        <Tag key={key} className="my-4 space-y-[7px] pl-1">
          {items.map((it, ii) => (
            <li
              key={ii}
              className="flex gap-2.5 text-[14.8px] leading-[1.78] text-[var(--ink-soft)]"
              style={{ paddingLeft: it.depth * 18 }}
            >
              <span className="mt-[9px] block h-[3px] w-[3px] shrink-0 rounded-full bg-[var(--ink-faint)]" />
              <span>{inline(it.text, `${key}-l${ii}`)}</span>
            </li>
          ))}
        </Tag>,
      );
      continue;
    }

    // 본문 — 연속된 줄을 한 문단으로 묶는다
    const para: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^(#{1,4}\s|>|---+$)/.test(lines[i]) &&
      !/^(\s*)([-*]|\d+\.)\s+/.test(lines[i]) &&
      !isTableRow(lines[i])
    ) {
      para.push(lines[i]);
      i++;
    }
    blocks.push(
      <p key={key} className="my-3.5 text-[15px] leading-[1.85] text-[var(--ink-soft)]">
        {para.map((p, pi) => (
          <Fragment key={pi}>
            {pi > 0 && <br />}
            {inline(p, `${key}-p${pi}`)}
          </Fragment>
        ))}
      </p>,
    );
  }

  return <div className="apply-doc">{blocks}</div>;
}
