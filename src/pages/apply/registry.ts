import guide from './docs/guide.md?raw';
import resumeV1 from './docs/resume-v1.md?raw';
import resumeV2 from './docs/resume-v2.md?raw';
import resumeV3 from './docs/resume-v3.md?raw';
import career from './docs/career.md?raw';
import portfolio from './docs/portfolio.md?raw';
import letterA from './docs/letter-a.md?raw';
import letterB from './docs/letter-b.md?raw';
import letterC from './docs/letter-c.md?raw';
import bank from './docs/bank.md?raw';

export type Group = 'guide' | 'resume' | 'detail' | 'letter';

export interface Doc {
  id: string;
  no: string;
  group: Group;
  title: string;
  subtitle: string;
  /** 카드 한 줄 — 이 문서가 무엇인가 */
  tagline: string;
  /** 언제 꺼내 쓰는 문서인가 */
  when: string;
  /** 이 문서에서만 하는 일 (다른 문서와 겹치지 않는 지점) */
  points: string[];
  /** 근거로 삼은 것 */
  basis: string;
  md: string;
}

export const GROUPS: { id: Group; label: string; desc: string }[] = [
  { id: 'guide', label: '먼저 읽기', desc: '전체 지도와 제출 전 점검' },
  { id: 'resume', label: '이력서 3종', desc: '회사 유형에 따라 하나를 고른다' },
  { id: 'detail', label: '상세 문서', desc: '이력서가 건 주장을 검증하는 문서' },
  { id: 'letter', label: '자기소개서', desc: '문항형 2종 · 자유형 1종 · 조립용 1종' },
];

export const DOCS: Doc[] = [
  {
    id: 'guide',
    no: '00',
    group: 'guide',
    title: '전체 안내',
    subtitle: 'README',
    tagline: '9개 문서의 지도와, 제출 전에 반드시 통일해야 할 항목',
    when: '처음 열었을 때 · 새 공고에 지원하기 직전',
    points: [
      '문서 간 수치 불일치 6건을 P0으로 정리 (MAU·학점·영문명·중복 제거 수)',
      '새 공고가 나왔을 때 30분 안에 한 벌을 조립하는 순서',
      '아카이브 159건에서 실제로 적용한 작성 원칙 7가지',
    ],
    basis: '교차 검증 — 이력서·포트폴리오·기제출 지원서를 나란히 놓고 대조',
    md: guide,
  },
  {
    id: 'resume-v1',
    no: '10',
    group: 'resume',
    title: '이력서 V1 — 임팩트형',
    subtitle: '스타트업 · 유니콘 · 수시채용',
    tagline: '첫 5줄이 전부 숫자. "운영해 본 사람"을 축으로 세운 개조식 이력서',
    when: '토스·당근·무신사·컬리류. 링크로 즉시 검증이 가능한 곳',
    points: [
      'I-Poten(MAU 600+) 운영 성과를 최상단에 배치 — 검증 강도 순 정렬',
      '개인 도구 2종은 한 줄로 압축해 신호 희석을 제거',
      '엔코아 장애 2건은 결과 수치까지 붙여 6줄로',
    ],
    basis: '빗썸 고정완 요약 5줄 공식 + 오늘의집 신입 헤드라인 공식',
    md: resumeV1,
  },
  {
    id: 'resume-v2',
    no: '11',
    group: 'resume',
    title: '이력서 V2 — 스페셜리스트형',
    subtitle: '네이버 · 카카오 · 라인 · 데이터 플랫폼',
    tagline: '무기 하나(근본원인분석)로 문서 전체를 관통시킨 이력서',
    when: '대규모 데이터·트래픽을 다루는 기술 조직',
    points: [
      '코어 A(OOM 오진 교정) → B(커넥션 풀 2N+2) → C(300GB 무스캔 진단) 순서 고정',
      '각 장애를 상황 → 판단 → 행동 → 결과 4단으로 서술',
      '"왜 이 회사인가" 리서치 문단을 별도 블록으로 분리 (회사마다 교체)',
    ],
    basis: 'LINE Haon의 무기 단일화 전략 + GS네오텍 판단·조치·수치 3단',
    md: resumeV2,
  },
  {
    id: 'resume-v3',
    no: '12',
    group: 'resume',
    title: '이력서 V3 — 클래식형',
    subtitle: '대기업 · SI · 금융 IT · 공공',
    tagline: '완결형 문체와 표 양식. 자사 양식(hwp/docx)에 그대로 옮기는 원고',
    when: '삼성SDS·LG CNS·현대오토에버·은행 IT·공공 SI',
    points: [
      '신입급에서 희소한 조합을 전면에 — 레거시 복원(Java 7·Oracle) · 폐쇄망 설치 자동화',
      '운영 SQL을 멱등 + 롤백문으로 작성한다는 원칙을 업무 항목으로',
      '인적·학력·경력·병역까지 양식 항목을 그대로 채운 상태',
    ],
    basis: 'CJ프레시웨이·삼성전자 등 공채 지원서 실물 구조',
    md: resumeV3,
  },
  {
    id: 'career',
    no: '20',
    group: 'detail',
    title: '경력기술서',
    subtitle: '업무 상세 기술서',
    tagline: '프로젝트 블록 4개 + Trouble Shooting 6건. 이력서의 검증용 상세부',
    when: '경력기술서를 별도로 요구할 때 · 리크루터가 상세 문서를 요청할 때',
    points: [
      '프로젝트마다 개요 → 기술 스택 → 주요 업무 내용 규격 통일',
      'Trouble Shooting 섹션에 실패와 사고까지 포함 (WHERE 없는 UPDATE, 내 폴백 코드의 버그)',
      'SKILL을 나열이 아니라 "무엇을 할 수 있는가"로 서술',
    ],
    basis: 'CJ ENM 합격 경력기술서의 프로젝트 블록 + 트러블슈팅 구조',
    md: career,
  },
  {
    id: 'portfolio',
    no: '30',
    group: 'detail',
    title: '포트폴리오 케이스북',
    subtitle: '케이스 6건',
    tagline: '결과가 아니라 판단 과정. 대안 → 탈락 사유 → 채택 근거 → 측정 → 한계',
    when: '기술 면접 사전 제출 · 포트폴리오 사이트 원고',
    points: [
      '기존 포트폴리오에 없던 엔코아 실무 케이스 3건을 신규 추가',
      '모든 케이스에 기각된 대안과 그 이유를 명시 — 면접관이 가장 파고드는 지점',
      '케이스 4에는 보안 반론을 선제 방어하는 "보안 경계 명시" 문단 포함',
    ],
    basis: '기존 포트폴리오의 강점(아카이브 상위 5% 서술)을 전 케이스로 확장',
    md: portfolio,
  },
  {
    id: 'letter-a',
    no: '40',
    group: 'letter',
    title: '자기소개서 A',
    subtitle: '테크 · 데이터 플랫폼 4문항',
    tagline: '지원동기 · 문제해결 · 협업 · 포부. 판단의 근거를 남기는 서술',
    when: '네이버·카카오·토스 계열 문항형 자소서',
    points: [
      '지원동기는 "한계 고백형" — 성과를 먼저 말하고 병목을 정직하게 인정',
      '협업 문항에 "더 나은 설계를 스스로 되돌린 일"을 배치',
      '포부는 결의가 아니라 3개월 계획과 리스크 관리 문장으로 마무리',
    ],
    basis: '네이버 2025 합격 자소서의 한계 고백 구조',
    md: letterA,
  },
  {
    id: 'letter-b',
    no: '41',
    group: 'letter',
    title: '자기소개서 B',
    subtitle: '금융 IT · 대기업 공채 4문항',
    tagline: '성장과정 · 지원동기 · 직무역량 · 포부. 블라인드 대체 문단 포함',
    when: '은행·카드·보험 IT, 삼성·LG 계열 공채',
    points: [
      '전북은행 기제출본과 소재는 잇되 문장은 전부 새로 씀',
      '"고객은 잔액이 맞는지 검증할 수단이 없다"는 축으로 금융 IT를 재정의',
      '출신지·학교 단서를 지운 블라인드 대체 문단을 함께 제공',
    ],
    basis: '영원무역 필연성 도출 공식 + 기제출본에서 확정한 본인 문체',
    md: letterB,
  },
  {
    id: 'letter-c',
    no: '42',
    group: 'letter',
    title: '자기소개서 C',
    subtitle: '자유 양식',
    tagline: '2,000자 본편과 1,000자 축약본. 소제목만 읽어도 논증이 끝나게',
    when: '문항 없이 "자유롭게 기술"을 요구하는 수시채용·스타트업',
    points: [
      '소제목 3개로 축을 세움 — 범인은 맨 위에 없었다 / 판단은 기록한다 / 끝까지 운영한다',
      '분량 제한에 맞춰 바로 쓸 수 있는 축약본을 같은 파일에 수록',
      'AI 비용 121원처럼 면접에서 산식을 설명할 수 있는 수치만 사용',
    ],
    basis: '자유 양식은 소제목이 유일하게 확실히 읽히는 요소라는 분석',
    md: letterC,
  },
  {
    id: 'bank',
    no: '43',
    group: 'letter',
    title: '자소서 소재 뱅크',
    subtitle: '문항 유형 → 소재 매핑',
    tagline: '코어 스토리를 문항에 맞게 재조립하기 위한 부품 상자',
    when: '새 공고의 자소서를 30분 안에 조립할 때',
    points: [
      '소재 18종을 A~R로 코드화하고 문항 유형별 1·2순위를 표로 매핑',
      '지원동기 진입로 3종을 틀로 제공 (사업구조형 · 한계 고백형 · 직무 재정의형)',
      '같은 서류 안에서 한 소재를 두 문항에 쓰지 않는다는 규칙 명시',
    ],
    basis: '합격자 다수가 코어 스토리를 회사별로 재배열만 한다는 아카이브 결론',
    md: bank,
  },
];

export const byId = (id?: string) => DOCS.find((d) => d.id === id);
