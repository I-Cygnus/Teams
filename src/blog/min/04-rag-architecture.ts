import type { BlogPost } from '../../data';

export const post04: BlogPost = {
    id: '4',
    package: 'min',
    title: 'RAG는 필요한 문서를 찾아 답하는 구조다',
    excerpt:
        'RAG가 문서를 준비하고 검색한 뒤, LLM으로 답변을 만드는 전체 흐름과 오래된 문서를 구분하는 방법을 쉽게 정리합니다.',
    category: 'AI',
    authorOverride: {
        name: 'min',
        role: 'Fullstack Developer',
        accent: '#6366F1',
    },
    publishedAt: '2026-07-27',
    readingMinutes: 8,
    cover: 'linear-gradient(135deg,#6366F1 0%,#2563EB 55%,#0F172A 100%)',
    coverImage: '/blog/min/04/rag-architecture.png',
    tags: ['RAG', 'LLM', 'Embedding', 'Vector Search'],

    body: [
        {
            type: 'p',
            text: '사내 규정이나 업무 매뉴얼을 AI에 등록하면, AI가 그 내용을 모두 외우고 답한다고 생각하기 쉽습니다.',
        },
        {
            type: 'p',
            text: '하지만 일반적인 RAG는 문서를 AI 모델에 다시 학습시키는 방식이 아닙니다.',
        },
        {
            type: 'p',
            text: '문서를 검색할 수 있도록 미리 정리해 두고, 사용자의 질문과 관련된 내용을 찾아 LLM에 전달하는 구조입니다.',
        },
        {
            type: 'p',
            text: '이번 글에서는 **문서 등록부터 검색, 답변 생성까지의 흐름과 오래된 자료가 검색되는 문제를 어떻게 줄일 수 있는지** 정리합니다.',
        },

        { type: 'hr' },

        {
            type: 'h2',
            text: 'Part 1. RAG는 문서를 외우는 AI가 아니다',
        },

        {
            type: 'p',
            text: '문서를 RAG에 등록하는 일을 흔히 “AI에게 학습시킨다”고 표현합니다.',
        },
        {
            type: 'p',
            text: '하지만 실제로는 문서를 검색 저장소에 넣는 과정에 가깝습니다.',
        },

        {
            type: 'code',
            language: 'text',
            text: `문서 등록
    → 문서 내용 정리
    → 작은 단위로 나누기
    → 검색 저장소에 보관`,
        },

        {
            type: 'p',
            text: '질문이 들어오면 관련 문서를 찾아 LLM에 전달합니다.',
        },

        {
            type: 'code',
            language: 'text',
            text: `사용자 질문
    → 관련 문서 검색
    → 검색 결과를 LLM에 전달
    → 답변 생성`,
        },

        {
            type: 'quote',
            text: 'RAG의 핵심은 문서를 얼마나 많이 넣었는지가 아니라, 필요한 문서를 얼마나 정확하게 찾는가에 있다.',
        },

        { type: 'hr' },

        {
            type: 'h2',
            text: 'Part 2. 전체 흐름은 준비와 검색으로 나뉜다',
        },

        {
            type: 'p',
            text: 'RAG의 전체 구조는 크게 두 단계로 나눌 수 있습니다.',
        },

        {
            type: 'h3',
            text: '1. 문서를 준비하는 단계',
        },

        {
            type: 'code',
            language: 'text',
            text: `PDF·HWP·DOC 문서
    → 텍스트 추출
    → 불필요한 내용 제거
    → 문서를 작은 조각으로 분할
    → 문서 정보 등록
    → 임베딩 생성
    → 벡터 저장소에 보관`,
        },

        {
            type: 'h3',
            text: '2. 질문을 처리하는 단계',
        },

        {
            type: 'code',
            language: 'text',
            text: `사용자 질문
    → 현재 사용할 수 있는 문서만 선택
    → 관련 문서 검색
    → 검색 결과 정리
    → LLM에 전달
    → 답변과 출처 제공`,
        },

        {
            type: 'p',
            text: '첫 번째 단계에서는 문서를 검색하기 좋은 데이터로 만들고, 두 번째 단계에서는 질문에 필요한 자료를 찾아 사용합니다.',
        },

        { type: 'hr' },

        {
            type: 'h2',
            text: 'Part 3. 문서를 정리하고 작은 단위로 나눈다',
        },

        {
            type: 'p',
            text: '원본 문서에는 본문뿐 아니라 페이지 번호, 목차, 머리말, 표, 이미지 같은 내용이 함께 들어 있습니다.',
        },
        {
            type: 'p',
            text: '검색에 불필요한 내용을 제거하고 문서 구조를 정리하는 과정을 전처리라고 합니다.',
        },

        {
            type: 'code',
            language: 'text',
            text: `원본 문서
    → 텍스트 추출
    → 페이지 번호와 반복 문구 제거
    → 제목·본문·표 구분
    → 검색 가능한 형태로 변환`,
        },

        {
            type: 'p',
            text: '정리한 문서는 다시 작은 단위로 나눕니다. 이를 청킹이라고 합니다.',
        },

        {
            type: 'code',
            language: 'text',
            text: `사내 업무규정
    ├─ 근무시간
    ├─ 연차휴가
    ├─ 재택근무
    ├─ 경조휴가
    └─ 퇴직 절차`,
        },

        {
            type: 'p',
            text: '사용자가 연차에 관해 질문하면 전체 업무규정이 아니라 연차휴가 부분만 검색하는 방식입니다.',
        },
        {
            type: 'p',
            text: '문서를 너무 크게 나누면 불필요한 내용이 함께 검색되고, 너무 작게 나누면 앞뒤 문맥이 끊길 수 있습니다.',
        },

        { type: 'hr' },

        {
            type: 'h2',
            text: 'Part 4. 메타데이터로 문서의 상태를 관리한다',
        },

        {
            type: 'p',
            text: '문서 조각에는 해당 문서를 설명하는 정보가 함께 저장되어야 합니다. 이를 메타데이터라고 합니다.',
        },

        {
            type: 'code',
            language: 'json',
            text: `{
  "documentNumber": "HR-LEAVE-001",
  "title": "휴가 운영규정",
  "category": "인사",
  "version": "3.0",
  "effectiveFrom": "2026-07-01",
  "effectiveTo": null,
  "status": "ACTIVE"
}`,
        },

        {
            type: 'p',
            text: '메타데이터를 사용하면 현재 적용 중인 인사규정만 검색하는 것처럼 검색 범위를 제한할 수 있습니다.',
        },

        {
            type: 'table',
            headers: ['항목', '의미'],
            rows: [
                ['documentNumber', '같은 종류의 문서를 구분하는 번호'],
                ['version', '문서의 개정 버전'],
                ['effectiveFrom', '문서 적용 시작일'],
                ['effectiveTo', '문서 적용 종료일'],
                ['status', '현재 사용·검토 중·폐기 상태'],
            ],
        },

        {
            type: 'p',
            text: '특히 시스템에 문서를 넣은 날짜와 실제로 문서가 적용된 날짜는 구분해야 합니다.',
        },

        {
            type: 'quote',
            text: '오래된 문서를 오늘 등록했다고 해서 오늘부터 적용되는 최신 문서가 되는 것은 아니다.',
        },

        { type: 'hr' },

        {
            type: 'h2',
            text: 'Part 5. 임베딩으로 의미가 비슷한 문서를 찾는다',
        },

        {
            type: 'p',
            text: '키워드 검색은 같은 단어가 들어 있는 문서를 찾는 데 유용합니다.',
        },
        {
            type: 'p',
            text: '하지만 사용자가 다른 표현으로 질문하면 원하는 문서를 찾지 못할 수 있습니다.',
        },

        {
            type: 'code',
            language: 'text',
            text: `사용자 질문:
신입 직원도 연차를 쓸 수 있나요?

문서 내용:
입사 1년 미만 근로자는
1개월 개근 시 1일의 유급휴가를 사용할 수 있다.`,
        },

        {
            type: 'p',
            text: '두 문장은 표현이 다르지만 의미는 서로 관련되어 있습니다.',
        },
        {
            type: 'p',
            text: '임베딩은 문장의 의미를 숫자 형태로 바꾸는 과정입니다.',
        },

        {
            type: 'code',
            language: 'text',
            text: `신입 직원도 연차를 쓸 수 있나요?
→ [0.12, 0.83, 0.31, ...]

입사 1년 미만 근로자의 유급휴가
→ [0.15, 0.79, 0.34, ...]`,
        },

        {
            type: 'p',
            text: '숫자의 위치가 가까울수록 의미가 비슷한 문장으로 판단합니다.',
        },
        {
            type: 'p',
            text: '이 숫자 묶음을 벡터라고 하며, 벡터 저장소에 보관해 의미 기반 검색에 사용합니다.',
        },

        { type: 'hr' },

        {
            type: 'h2',
            text: 'Part 6. 오래된 문서는 검색 전에 제외한다',
        },

        {
            type: 'p',
            text: 'RAG는 문서의 업로드 순서만 보고 어떤 자료가 최신인지 판단하지 않습니다.',
        },
        {
            type: 'p',
            text: '오래된 문서와 현재 문서를 같은 날 등록하면 두 문서가 모두 검색될 수 있습니다.',
        },

        {
            type: 'code',
            language: 'text',
            text: `이전 규정
- 버전: 1.0
- 적용 종료일: 2026-06-30
- 상태: 폐기

현재 규정
- 버전: 3.0
- 적용 시작일: 2026-07-01
- 상태: 현재 사용`,
        },

        {
            type: 'p',
            text: '따라서 전체 문서를 검색한 뒤 LLM에게 최신 문서를 고르게 해서는 안 됩니다.',
        },
        {
            type: 'p',
            text: '검색을 시작하기 전에 현재 적용 중인 문서만 먼저 선택해야 합니다.',
        },

        {
            type: 'code',
            language: 'java',
            text: `public boolean isActive(LocalDate referenceDate) {
    boolean started =
            !effectiveFrom.isAfter(referenceDate);

    boolean notExpired =
            effectiveTo == null ||
            !effectiveTo.isBefore(referenceDate);

    return status == DocumentStatus.ACTIVE
            && started
            && notExpired;
}`,
        },

        {
            type: 'p',
            text: '질문에 별도의 과거 시점이 없다면 현재 사용 중인 문서만 검색하는 것이 안전합니다.',
        },

        {
            type: 'table',
            headers: ['사용자 질문', '검색 대상'],
            rows: [
                [
                    '현재 연차 신청 방법은 무엇인가요?',
                    '현재 적용 중인 문서',
                ],
                [
                    '2024년 연차 신청 방법은 무엇이었나요?',
                    '2024년에 적용되던 문서',
                ],
                [
                    '연차 규정이 어떻게 바뀌었나요?',
                    '현재 문서와 이전 문서',
                ],
            ],
        },

        { type: 'hr' },

        {
            type: 'h2',
            text: 'Part 7. 충돌하는 문서는 사람이 확인한다',
        },

        {
            type: 'p',
            text: '현재 사용 상태인 문서끼리도 내용이 다를 수 있습니다.',
        },

        {
            type: 'code',
            language: 'text',
            text: `문서 A
재택근무는 주 2회까지 가능하다.

문서 B
재택근무는 주 1회까지 가능하다.`,
        },

        {
            type: 'p',
            text: '이 경우 AI가 검색 점수가 높은 문서를 임의로 선택하면 잘못된 답변이 만들어질 수 있습니다.',
        },
        {
            type: 'p',
            text: '충돌이 발견되면 관리자가 어떤 문서가 우선하는지 확인해야 합니다.',
        },

        {
            type: 'code',
            language: 'text',
            text: `현재 사용 중인 두 문서의 내용이 다릅니다.

- 재택근무 운영지침: 주 2회
- 인사 운영공지: 주 1회

담당자의 기준 문서 확인이 필요합니다.`,
        },

        {
            type: 'p',
            text: 'AI가 하나의 답을 임의로 만드는 것보다, 충돌한 문서와 내용을 사용자에게 안내하는 것이 안전합니다.',
        },

        { type: 'hr' },

        {
            type: 'h2',
            text: 'Part 8. 검색 시스템과 LLM의 역할은 다르다',
        },

        {
            type: 'table',
            headers: ['구분', '역할'],
            rows: [
                [
                    '검색 시스템',
                    '현재 유효하고 관련 있는 문서를 선택',
                ],
                [
                    'LLM',
                    '전달받은 문서를 읽기 쉬운 답변으로 작성',
                ],
                [
                    '관리자',
                    '문서 승인, 버전 관리, 충돌 해결',
                ],
                [
                    '사용자',
                    '답변의 출처와 기준일 확인',
                ],
            ],
        },

        {
            type: 'code',
            language: 'text',
            text: `사용자 질문
    → 현재 유효한 자료 선택
    → 관련 문서 검색
    → 중복과 충돌 확인
    → LLM에 근거자료 전달
    → 답변과 출처 제공`,
        },

        {
            type: 'p',
            text: '검색 시스템이 오래되거나 잘못된 자료를 전달하면 LLM은 그 내용을 자연스러운 문장으로 작성할 수 있습니다.',
        },
        {
            type: 'p',
            text: '따라서 LLM에게 최신 문서를 잘 판단하라고 지시하는 것보다, 검색 단계에서 올바른 문서만 전달하는 것이 중요합니다.',
        },

        { type: 'hr' },

        {
            type: 'h2',
            text: '마치며 — RAG는 필요한 지식을 고르는 구조다',
        },

        {
            type: 'p',
            text: '오늘 내용을 세 가지로 정리할 수 있습니다.',
        },
        {
            type: 'list',
            items: [
                'RAG는 문서를 AI에 다시 학습시키는 방식이 아니라 관련 문서를 검색해 전달하는 구조입니다.',
                '오래된 문서와 현재 문서는 버전, 적용 기간, 상태를 기준으로 구분해야 합니다.',
                '최신성 판단을 LLM에 맡기지 말고 검색 단계에서 현재 유효한 문서만 선택해야 합니다.',
            ],
        },
        {
            type: 'p',
            text: '한 문장으로 정리하면 다음과 같습니다.',
        },
        {
            type: 'quote',
            text: 'RAG는 문서를 많이 저장하는 시스템이 아니라, 질문에 맞는 현재 유효한 문서를 골라 LLM과 연결하는 검색 구조다.',
        },
    ],
};