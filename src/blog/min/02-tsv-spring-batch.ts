import type { BlogPost } from '../../data';

export const post02: BlogPost = {
    id: '2',
    package: 'min',
    title: 'TSV 데이터 적재, 단순 Import에서 Batch 파이프라인으로 바라보기',
    excerpt:
        'I-Poten의 포텐워드와 포텐퀴즈 데이터를 TSV로 적재했던 방식과 Runner 기반 구조의 한계, 그리고 Spring Batch로 확장할 수 있는 개선 방향을 정리합니다.',
    category: 'Backend',
    authorOverride: {
        name: 'min',
        role: 'Fullstack Developer',
        accent: '#3B82F6',
    },
    publishedAt: '2026-05-16',
    readingMinutes: 13,
    cover: 'linear-gradient(135deg,#3B82F6 0%,#6366F1 50%,#0F172A 100%)',
    tags: ['Spring Boot', 'Spring Batch', 'TSV', 'Data Import', 'MySQL'],
    body: [
        { type: 'p', text: 'I-Poten은 IT 개발자 취업 준비생을 위한 용어 학습과 퀴즈 기반 학습 서비스입니다.' },
        { type: 'p', text: '서비스 안에는 포텐워드, 포텐노트, 포텐퀴즈 같은 학습 기능이 있고, 이 기능들이 제대로 동작하려면 먼저 충분한 양의 기준 데이터가 필요했습니다.' },
        { type: 'p', text: '특히 포텐워드는 개발 면접에 자주 나오는 용어와 설명을 제공해야 했고, 포텐퀴즈는 해당 용어를 기반으로 객관식, OX, 초성 문제를 출제해야 했습니다.' },
        { type: 'p', text: '즉, 기능을 구현하는 것만큼 중요한 일이 있었습니다. 바로 **학습 데이터를 어떻게 안정적으로 서비스 DB에 넣을 것인가**였습니다.' },
        { type: 'p', text: '이번 글에서는 I-Poten에서 TSV 기반 데이터를 적재한 방식과, 이후 Spring Batch를 적용한다면 어떤 구조로 개선할 수 있을지 정리해보려 합니다.' },

        { type: 'hr' },

        { type: 'h2', text: 'Part 1. 처음에는 TSV 파일과 SQL dump로 데이터를 옮겼다' },

        { type: 'p', text: '초기에는 포텐워드와 포텐퀴즈 데이터를 TSV 형태로 정리했습니다.' },
        { type: 'p', text: 'TSV는 Tab Separated Values의 약자로, 컬럼 사이를 탭 문자로 구분하는 파일 형식입니다. 엑셀이나 스프레드시트에서 데이터를 관리한 뒤 텍스트 파일로 내보내기 좋고, 쉼표가 설명 문장 안에 들어가도 CSV보다 비교적 안전하게 다룰 수 있다는 장점이 있습니다.' },
        { type: 'p', text: '초기 데이터 적재 흐름은 대략 다음과 같았습니다.' },
        {
            type: 'code',
            language: 'text',
            text:
                `TSV 파일 준비
→ 로컬 DB에 데이터 적재
→ 로컬 DB에서 SQL dump 생성
→ EC2 서버에 SQL 파일 업로드
→ EC2 MySQL에 반영
→ count 쿼리로 결과 확인`,
        },
        { type: 'p', text: '이 방식은 빠르게 데이터를 넣기에는 괜찮았습니다.' },
        { type: 'p', text: '특히 개발 초기에는 운영 자동화보다 “일단 데이터를 넣고 기능을 확인하는 것”이 더 중요했습니다. 포텐워드 검색, 단어장 저장, 퀴즈 출제 흐름을 검증하려면 실제 데이터가 필요했기 때문입니다.' },
        { type: 'p', text: '하지만 데이터 양이 늘어나면서 이 방식의 한계도 점점 명확해졌습니다.' },

        { type: 'hr' },

        { type: 'h2', text: 'Part 2. 현재 코드에서는 Runner 기반으로 TSV를 읽고 있다' },

        { type: 'p', text: '현재 프로젝트에는 데이터 적재를 위한 Runner 코드가 존재합니다.' },
        { type: 'p', text: '확인된 적재 Runner는 크게 네 가지입니다.' },
        {
            type: 'table',
            headers: ['구분', '클래스', '실행 방식', '주요 역할'],
            rows: [
                ['포텐워드 적재', 'TermImportRunner', 'CommandLineRunner', 'TSV를 읽어 term, tag, term_tag 저장'],
                ['포텐퀴즈 문제은행 적재', 'QuizTsvImportRunner', 'CommandLineRunner', '문제, 보기, 정답, 라벨 저장'],
                ['퀴즈 세트 적재', 'QuizSetTsvImportRunner', 'CommandLineRunner', '퀴즈 세트와 문제 연결'],
                ['직무 추천 용어 적재', 'JobRecommendedTermTsvImportRunner', 'ApplicationRunner', '직무별 추천 용어 적재'],
            ],
        },
        { type: 'p', text: '포텐워드 적재는 `--file=...` 인자를 받아 실행됩니다.' },
        { type: 'p', text: '예를 들어 다음과 같은 방식입니다.' },
        {
            type: 'code',
            language: 'bash',
            text: `./gradlew bootRun --args="--file=C:/uploads/terms_category10-169.txt"`,
        },
        { type: 'p', text: '포텐워드 TSV 파일은 탭으로 구분되어 있고, 코드에서는 다음 컬럼을 사용합니다.' },
        {
            type: 'code',
            language: 'text',
            text:
                `cols[0] = categoryId
cols[2] = title
cols[3] = description
cols[4] = tags`,
        },
        { type: 'p', text: '그리고 각 row를 읽은 뒤 `CreateTermRequest`를 만들고 `TermService.register()`를 호출합니다.' },
        {
            type: 'code',
            language: 'java',
            text:
                `CreateTermRequest request =
        new CreateTermRequest(categoryId, title, description, tags);

termService.register(request);`,
        },
        { type: 'p', text: '여기서 중요한 점은 TSV 적재 코드가 직접 `term`, `tag`, `term_tag`를 각각 저장하지 않는다는 것입니다.' },
        { type: 'p', text: '대신 기존 도메인 서비스인 `TermService.register()`를 재사용합니다.' },
        { type: 'p', text: '덕분에 관리자 화면에서 용어를 등록하든, TSV 파일로 용어를 적재하든 같은 규칙을 탈 수 있습니다.' },
        {
            type: 'code',
            language: 'text',
            text:
                `카테고리 확인
→ 같은 카테고리 내 용어 중복 확인
→ 태그 문자열 파싱
→ 기존 태그 재사용
→ 없는 태그 생성
→ TermTag 연결`,
        },
        { type: 'p', text: '이 부분은 단순히 데이터를 넣는 코드가 아니라, **도메인 규칙을 재사용한 적재 구조**라고 볼 수 있습니다.' },

        { type: 'hr' },

        { type: 'h2', text: 'Part 3. 포텐퀴즈 적재는 더 복잡했다' },

        { type: 'p', text: '포텐퀴즈 데이터는 포텐워드보다 더 복잡합니다.' },
        { type: 'p', text: '용어 하나만 저장하는 것이 아니라, 문제 유형과 보기, 정답, 해설, 라벨까지 함께 관리해야 하기 때문입니다.' },
        { type: 'p', text: '퀴즈 TSV는 대략 다음과 같은 데이터를 포함합니다.' },
        {
            type: 'code',
            language: 'text',
            text:
                `question_temp_key
term_title
term_id
term_category
term_category_id
question_type
difficulty
question_text
explanation
text_answer
choice_1
choice_2
choice_3
choice_4
label_1
label_2
label_3
label_4`,
        },
        { type: 'p', text: '이 데이터는 여러 테이블에 나뉘어 저장됩니다.' },
        {
            type: 'code',
            language: 'text',
            text:
                `quiz_question
quiz_choice
quiz_text_answer
quiz_label
quiz_question_label`,
        },
        { type: 'p', text: '포텐퀴즈 적재 코드에서는 필수 헤더를 검증하고, 문제 유형과 난이도, 문제 내용을 확인한 뒤 저장합니다.' },
        { type: 'p', text: '또한 `questionType + questionText + termId` 기준으로 기존 문제가 있는지 확인하고, 이미 존재하는 문제라면 새로 insert하는 대신 update하는 방식으로 처리합니다.' },
        { type: 'p', text: '포텐워드 적재보다 나아진 점도 있었습니다.' },
        { type: 'p', text: '포텐퀴즈 문제은행 적재는 row 단위 트랜잭션을 사용하고 있어서, 특정 row에서 실패가 발생해도 전체 적재가 바로 중단되지 않고 다음 row를 계속 처리할 수 있습니다.' },
        {
            type: 'code',
            language: 'text',
            text:
                `1번 문제 성공
2번 문제 성공
3번 문제 실패 → warn 로그
4번 문제 계속 처리
...
최종 ok / skip / err 로그 출력`,
        },
        { type: 'p', text: '이 구조는 대량 데이터를 다룰 때 꽤 중요한 차이를 만듭니다.' },

        { type: 'hr' },

        { type: 'h2', text: 'Part 4. 현재 방식의 장점' },

        { type: 'p', text: '현재 Runner 기반 적재 방식에도 장점은 있습니다.' },
        { type: 'p', text: '첫 번째는 구현이 단순하다는 점입니다.' },
        { type: 'p', text: '별도의 관리자 API나 복잡한 배치 시스템을 만들지 않아도, 애플리케이션 실행 인자만으로 TSV 파일을 읽어 DB에 넣을 수 있습니다.' },
        { type: 'p', text: '두 번째는 기존 도메인 로직을 재사용할 수 있다는 점입니다.' },
        { type: 'p', text: '포텐워드 적재에서는 `TermService.register()`를 호출하기 때문에, 기존에 구현한 중복 검사와 태그 저장 규칙을 그대로 사용할 수 있습니다.' },
        { type: 'p', text: '세 번째는 빠르게 데이터를 반영하고 검증할 수 있다는 점입니다.' },
        { type: 'p', text: '초기 개발 단계에서는 완벽한 배치 시스템보다 빠른 실험이 더 중요할 때가 있습니다. TSV를 만들고, 실행하고, DB count를 확인하는 방식은 기능 검증 속도를 높여줬습니다.' },
        { type: 'p', text: '정리하면 현재 방식의 장점은 다음과 같습니다.' },
        {
            type: 'table',
            headers: ['장점', '설명'],
            rows: [
                ['구현이 단순함', '별도 배치 인프라 없이 Runner로 실행 가능'],
                ['실행이 쉬움', '--file, --quiz, --set 같은 인자로 파일 경로 전달 가능'],
                ['도메인 로직 재사용', '포텐워드는 TermService.register()를 통해 등록 규칙 공유'],
                ['초기 데이터 검증에 적합', '빠르게 데이터를 넣고 기능 동작 확인 가능'],
                ['퀴즈 적재 일부 안정성 확보', 'row 단위 트랜잭션으로 일부 실패 후 계속 진행 가능'],
            ],
        },

        { type: 'hr' },

        { type: 'h2', text: 'Part 5. 하지만 Runner 방식에는 한계가 있다' },

        { type: 'p', text: '데이터 양이 적을 때는 Runner 방식도 충분합니다.' },
        { type: 'p', text: '하지만 포텐워드와 포텐퀴즈처럼 수만 건의 데이터를 다루기 시작하면 한계가 보이기 시작합니다.' },

        { type: 'h3', text: '1. 애플리케이션 실행과 데이터 적재 책임이 섞인다' },
        { type: 'p', text: '`CommandLineRunner`는 애플리케이션이 실행될 때 함께 동작합니다.' },
        { type: 'p', text: '즉, 서버를 실행하는 책임과 데이터를 적재하는 책임이 같은 실행 흐름 안에 섞일 수 있습니다.' },
        { type: 'p', text: '개발 환경에서는 괜찮지만, 운영 환경에서는 조심해야 합니다.' },
        { type: 'p', text: '잘못된 인자나 잘못된 파일 경로가 전달되면 운영 DB에 의도하지 않은 데이터가 들어갈 수 있기 때문입니다.' },

        { type: 'h3', text: '2. 실행 이력 관리가 부족하다' },
        { type: 'p', text: 'Spring Batch를 사용하지 않는 Runner 방식에서는 다음과 같은 정보를 체계적으로 관리하기 어렵습니다.' },
        {
            type: 'code',
            language: 'text',
            text:
                `이번 적재가 언제 실행되었는지
몇 건을 읽었는지
몇 건이 성공했는지
몇 건이 실패했는지
실패한 row는 무엇인지
중간 실패 후 어디서부터 다시 시작해야 하는지`,
        },
        { type: 'p', text: '물론 로그를 남길 수는 있습니다.' },
        { type: 'p', text: '하지만 로그는 실행 이력을 관리하기 위한 구조화된 저장소가 아닙니다.' },
        { type: 'p', text: '특히 실패 row를 다시 처리해야 할 때, 로그만 보고 재처리 대상을 찾는 것은 번거롭고 실수 가능성도 있습니다.' },

        { type: 'h3', text: '3. 포텐워드 적재는 중간 실패에 약하다' },
        { type: 'p', text: '포텐퀴즈 적재는 row 단위 트랜잭션으로 일부 실패를 건너뛰는 구조가 있지만, 포텐워드 적재는 row별 예외 격리가 충분하지 않습니다.' },
        { type: 'p', text: '즉, 특정 row에서 예외가 발생하면 Runner 전체가 중단될 수 있습니다.' },
        { type: 'p', text: '예를 들어 4만 건 중 3만 번째 row에서 문제가 생기면 다음과 같은 고민이 생깁니다.' },
        {
            type: 'code',
            language: 'text',
            text:
                `앞의 29,999건은 정상적으로 들어갔나?
중단된 row는 어떤 데이터였나?
다시 실행하면 중복 데이터는 어떻게 처리되나?
어디서부터 다시 넣어야 하나?`,
        },
        { type: 'p', text: '이런 문제는 대량 데이터 적재에서 매우 중요합니다.' },

        { type: 'h3', text: '4. 로컬 DB dump 후 EC2 반영 방식은 환경 차이에 취약하다' },
        { type: 'p', text: '초기에는 로컬 DB에 데이터를 넣고 SQL dump를 뽑아 EC2 MySQL에 반영했습니다.' },
        { type: 'p', text: '이 방식은 단순하지만 운영 관점에서는 위험 요소가 있습니다.' },
        {
            type: 'code',
            language: 'text',
            text:
                `로컬과 서버의 auto increment 값 차이
문자셋 차이로 인한 한글 깨짐
FK 또는 unique 제약 충돌
운영 데이터 덮어쓰기 위험
일부 SQL만 반영된 경우 추적 어려움
롤백과 감사 로그 부족`,
        },
        { type: 'p', text: '실제로 한글 데이터가 많은 서비스에서는 문자셋 문제가 특히 중요합니다.' },
        { type: 'p', text: 'UTF-8로 읽는 코드가 있더라도, 원본 TSV가 엑셀에서 CP949나 ANSI 형태로 저장되어 있으면 한글이 깨질 수 있습니다.' },

        { type: 'hr' },

        { type: 'h2', text: 'Part 6. Spring Batch를 적용한다면 어떻게 바꿀 수 있을까' },

        { type: 'p', text: 'Spring Batch를 적용하면 데이터 적재를 하나의 “작업 단위”로 관리할 수 있습니다.' },
        { type: 'p', text: 'Spring Batch의 기본 구조는 다음과 같습니다.' },
        {
            type: 'code',
            language: 'text',
            text:
                `Job
└── Step
    ├── ItemReader
    ├── ItemProcessor
    └── ItemWriter`,
        },
        { type: 'p', text: 'I-Poten의 포텐워드 적재에 적용하면 이렇게 나눌 수 있습니다.' },
        {
            type: 'table',
            headers: ['구성 요소', '역할', 'I-Poten 적용 예시'],
            rows: [
                ['Job', '하나의 배치 작업', 'termTsvImportJob'],
                ['Step', 'Job 안의 세부 단계', 'termTsvImportStep'],
                ['ItemReader', '파일 읽기', 'TSV 파일을 TermTsvRow로 변환'],
                ['ItemProcessor', '검증 및 가공', 'category 존재 여부, title 필수값, 중복 여부 확인'],
                ['ItemWriter', '저장', 'TermService.register() 호출 또는 JDBC batch insert'],
                ['JobRepository', '실행 이력 관리', '성공, 실패, 재실행 상태 저장'],
            ],
        },

        { type: 'hr' },

        { type: 'h2', text: 'Part 7. 포텐워드 Batch 설계' },

        { type: 'p', text: '포텐워드 적재는 다음과 같이 설계할 수 있습니다.' },
        {
            type: 'code',
            language: 'text',
            text:
                `Job: termTsvImportJob
Step: termTsvImportStep

Reader:
- TSV 파일을 한 줄씩 읽는다.
- categoryId, title, description, tags를 TermTsvRow로 매핑한다.

Processor:
- categoryId가 비어 있는지 확인한다.
- title이 비어 있는지 확인한다.
- description을 trim한다.
- tags를 정리한다.
- category가 실제로 존재하는지 확인한다.
- 중복 용어 여부를 확인한다.

Writer:
- 초기에는 TermService.register()를 재사용한다.
- 대량 적재 성능이 필요하면 JdbcBatchItemWriter로 확장한다.`,
        },
        { type: 'p', text: '예시 코드는 다음과 같습니다.' },
        {
            type: 'code',
            language: 'java',
            text:
                `@Configuration
@RequiredArgsConstructor
public class TermImportJobConfig {

    private final JobRepository jobRepository;
    private final PlatformTransactionManager transactionManager;
    private final TermService termService;

    @Bean
    Job termTsvImportJob(Step termTsvImportStep) {
        return new JobBuilder("termTsvImportJob", jobRepository)
                .start(termTsvImportStep)
                .build();
    }

    @Bean
    Step termTsvImportStep(
            ItemReader<TermTsvRow> termTsvReader,
            ItemProcessor<TermTsvRow, CreateTermRequest> termProcessor
    ) {
        return new StepBuilder("termTsvImportStep", jobRepository)
                .<TermTsvRow, CreateTermRequest>chunk(100, transactionManager)
                .reader(termTsvReader)
                .processor(termProcessor)
                .writer(items -> {
                    for (CreateTermRequest request : items) {
                        termService.register(request);
                    }
                })
                .faultTolerant()
                .skip(IllegalArgumentException.class)
                .skipLimit(100)
                .retry(TransientDataAccessException.class)
                .retryLimit(3)
                .build();
    }
}`,
        },
        { type: 'p', text: '여기서 핵심은 `chunk`입니다.' },
        { type: 'p', text: '기존 Runner 방식은 파일을 한 줄씩 읽고 저장하는 흐름에 가깝습니다.' },
        { type: 'p', text: '반면 Spring Batch에서는 데이터를 일정 단위로 묶어서 처리할 수 있습니다.' },
        {
            type: 'code',
            language: 'text',
            text:
                `100개 읽기
→ 100개 검증
→ 100개 저장
→ 다음 100개 처리`,
        },
        { type: 'p', text: '이렇게 하면 트랜잭션 범위를 조절할 수 있고, 대량 데이터 처리 시 메모리와 성능을 더 안정적으로 관리할 수 있습니다.' },

        { type: 'hr' },

        { type: 'h2', text: 'Part 8. 포텐퀴즈 Batch 설계' },

        { type: 'p', text: '포텐퀴즈는 포텐워드보다 더 신중하게 설계해야 합니다.' },
        { type: 'p', text: '저장 대상 테이블이 많고, 문제 유형별 검증 규칙도 다르기 때문입니다.' },
        {
            type: 'code',
            language: 'text',
            text:
                `Job: quizQuestionTsvImportJob
Step: quizQuestionTsvImportStep

Reader:
- TSV 또는 CSV 파일을 읽는다.
- question_temp_key, term_id, question_type, difficulty, question_text 등을 Row 객체로 매핑한다.

Processor:
- 필수 헤더가 있는지 확인한다.
- question_type이 유효한 enum인지 확인한다.
- difficulty 값이 유효한지 확인한다.
- term_id가 실제 term 테이블에 존재하는지 확인한다.
- CHOICE 문제라면 보기와 정답이 정상인지 확인한다.
- OX 문제라면 정답이 O 또는 X인지 확인한다.
- INITIALS 문제라면 text_answer가 존재하는지 확인한다.
- label 값을 정규화한다.

Writer:
- quiz_question 저장 또는 update
- quiz_choice 저장
- quiz_text_answer 저장
- quiz_label 저장
- quiz_question_label 연결`,
        },
        { type: 'p', text: '포텐퀴즈는 기존 코드의 로직이 많기 때문에, 처음부터 `JdbcBatchItemWriter`로 바꾸기보다는 기존 import 로직을 서비스로 분리한 뒤 Batch Writer에서 재사용하는 편이 안전합니다.' },
        {
            type: 'code',
            language: 'java',
            text:
                `@Component
@RequiredArgsConstructor
public class QuizQuestionItemWriter implements ItemWriter<QuizQuestionTsvRow> {

    private final QuizQuestionImportService quizQuestionImportService;

    @Override
    public void write(Chunk<? extends QuizQuestionTsvRow> chunk) {
        for (QuizQuestionTsvRow row : chunk) {
            quizQuestionImportService.upsert(row);
        }
    }
}`,
        },
        { type: 'p', text: '이렇게 하면 기존에 검증된 저장 로직을 최대한 유지하면서도, 실행 이력과 실패 처리, 재시작 가능성은 Spring Batch 쪽으로 가져올 수 있습니다.' },

        { type: 'hr' },

        { type: 'h2', text: 'Part 9. 실패 row를 관리해야 한다' },

        { type: 'p', text: '대량 데이터 적재에서 중요한 것은 “성공”보다 “실패를 어떻게 다루는가”입니다.' },
        { type: 'p', text: '데이터가 많아지면 실패 row는 거의 반드시 나옵니다.' },
        {
            type: 'code',
            language: 'text',
            text:
                `필수값이 비어 있는 row
존재하지 않는 categoryId
존재하지 않는 termId
잘못된 questionType
객관식 보기 개수 부족
중복 데이터
인코딩이 깨진 데이터`,
        },
        { type: 'p', text: 'Runner 방식에서는 이런 실패를 로그로만 남기기 쉽습니다.' },
        { type: 'p', text: '하지만 Spring Batch를 적용하면 실패 row를 별도 테이블이나 파일로 남길 수 있습니다.' },
        { type: 'p', text: '예를 들어 다음과 같은 테이블을 둘 수 있습니다.' },
        {
            type: 'code',
            language: 'text',
            text:
                `batch_import_failure

id
job_name
file_path
line_no
raw_row
error_message
created_at`,
        },
        { type: 'p', text: '그러면 적재가 끝난 뒤 실패 데이터만 다시 확인할 수 있습니다.' },
        {
            type: 'code',
            language: 'sql',
            text:
                `SELECT *
FROM batch_import_failure
WHERE job_name = 'quizQuestionTsvImportJob'
ORDER BY line_no;`,
        },
        { type: 'p', text: '이 방식은 운영과 유지보수 관점에서 큰 차이를 만듭니다.' },
        { type: 'p', text: '단순히 “에러가 났다”가 아니라, “어떤 파일의 몇 번째 줄이 왜 실패했는지”를 추적할 수 있기 때문입니다.' },

        { type: 'hr' },

        { type: 'h2', text: 'Part 10. 기존 방식과 Spring Batch 방식 비교' },

        {
            type: 'table',
            headers: ['구분', '기존 Runner 방식', 'Spring Batch 방식'],
            rows: [
                ['실행 구조', '애플리케이션 기동 인자 기반', 'Job, Step 기반'],
                ['데이터 읽기', '직접 파일 읽기', 'ItemReader'],
                ['검증과 가공', '코드 내부에서 직접 처리', 'ItemProcessor로 분리'],
                ['저장', 'Service 또는 Repository 직접 호출', 'ItemWriter'],
                ['트랜잭션', '직접 관리 또는 row 단위 처리', 'chunk 단위 처리'],
                ['실패 처리', '로그 중심', 'skip, retry, failure table 가능'],
                ['실행 이력', '별도 관리 어려움', 'JobRepository로 관리'],
                ['재실행', '수동 판단 필요', '재시작 지점 관리 가능'],
                ['운영 안정성', '실행 인자 실수 위험', '파라미터, 이력, 권한 관리 가능'],
                ['확장성', 'Runner가 커지기 쉬움', 'Job/Step 단위로 분리 가능'],
            ],
        },

        { type: 'hr' },

        { type: 'h2', text: 'Part 11. 바로 Spring Batch로 바꿔야 했을까?' },

        { type: 'p', text: '이 질문에는 “상황에 따라 다르다”고 생각합니다.' },
        { type: 'p', text: '초기 개발 단계에서는 Runner 방식도 충분히 의미가 있었습니다.' },
        { type: 'p', text: '서비스의 핵심 도메인이 아직 바뀌고 있고, 데이터 구조도 계속 수정되는 상황에서는 무거운 배치 구조보다 단순한 Runner가 더 빠를 수 있습니다.' },
        { type: 'p', text: '하지만 데이터가 많아지고, 운영 서버에 반복적으로 반영해야 하며, 실패 데이터 추적이 중요해지는 시점부터는 Spring Batch 도입을 검토할 필요가 있습니다.' },
        { type: 'p', text: '정리하면 다음과 같습니다.' },
        {
            type: 'code',
            language: 'text',
            text:
                `초기 개발 단계
→ Runner 방식으로 빠르게 적재

데이터 규모 증가
→ row별 실패 처리 필요

운영 반영 반복
→ 실행 이력과 재실행 관리 필요

데이터 품질 관리 필요
→ Spring Batch 기반 파이프라인으로 전환`,
        },
        { type: 'p', text: '중요한 것은 처음부터 완벽한 구조를 만드는 것이 아니라, 현재 단계에 맞는 구조를 선택하고 다음 단계의 개선 방향을 알고 있는 것이라고 생각합니다.' },

        { type: 'hr' },

        { type: 'h2', text: 'Part 12. 이 경험에서 배운 점' },

        { type: 'p', text: '이번 데이터 적재 경험을 통해 배운 점은 크게 세 가지입니다.' },
        { type: 'p', text: '첫 번째, 데이터 적재도 하나의 백엔드 기능이라는 점입니다.' },
        { type: 'p', text: '처음에는 TSV를 DB에 넣는 일을 단순한 작업으로 봤습니다. 하지만 실제로는 파일 포맷, 인코딩, 중복 처리, FK 검증, 트랜잭션, 운영 반영 방식까지 고려해야 했습니다.' },
        { type: 'p', text: '두 번째, 도메인 규칙을 우회하지 않는 것이 중요하다는 점입니다.' },
        { type: 'p', text: '포텐워드 적재에서 `TermService.register()`를 재사용한 것은 좋은 선택이었습니다. 데이터가 어떤 경로로 들어오든 같은 등록 규칙을 거치기 때문에 데이터 일관성을 지킬 수 있었습니다.' },
        { type: 'p', text: '세 번째, 대량 데이터에서는 실패를 전제로 설계해야 한다는 점입니다.' },
        { type: 'p', text: '소량 데이터에서는 실패가 나면 다시 실행하면 됩니다. 하지만 수만 건의 데이터에서는 어느 row가 실패했는지, 어디까지 성공했는지, 다시 실행해도 안전한지가 중요해집니다.' },
        { type: 'p', text: '그래서 Spring Batch의 Job, Step, chunk, skip, retry, JobRepository 같은 개념이 왜 필요한지 더 잘 이해할 수 있었습니다.' },

        { type: 'hr' },

        { type: 'h2', text: '마치며 — 데이터 적재도 서비스 설계의 일부다' },

        { type: 'p', text: 'I-Poten의 포텐워드와 포텐퀴즈 데이터는 단순한 샘플 데이터가 아니었습니다.' },
        { type: 'p', text: '서비스의 검색, 학습, 복습, 퀴즈 출제 흐름을 지탱하는 기준 데이터였습니다.' },
        { type: 'p', text: '초기에는 TSV와 Runner 기반 import로 빠르게 데이터를 적재했고, 이를 통해 서비스 기능을 검증할 수 있었습니다.' },
        { type: 'p', text: '하지만 데이터 규모가 커지고 운영 반영을 고려하면서, 단순 import 방식만으로는 부족한 지점도 보였습니다.' },
        { type: 'p', text: '한 문장으로 정리하면 이렇습니다.' },
        { type: 'quote', text: 'TSV 적재는 단순히 파일을 DB에 넣는 작업이 아니라, 서비스 기준 데이터를 안전하게 운영 DB로 옮기는 데이터 파이프라인 설계 문제였다.' },
        { type: 'p', text: '앞으로 이 구조를 Spring Batch 기반으로 개선한다면, Reader, Processor, Writer를 분리하고 chunk 단위 저장, 실패 row 기록, 재실행 가능성을 확보할 수 있습니다.' },
        { type: 'p', text: '이번 경험은 단순히 데이터를 넣어본 경험이 아니라, 대량 데이터를 다루는 백엔드 시스템에서 안정성, 추적 가능성, 운영 리스크를 어떻게 고려해야 하는지 배운 과정이었습니다.' },
    ],
};