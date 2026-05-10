import type { BlogPost } from '../../data';

export const post01: BlogPost = {
    id: '1',
    package: 'min',
    title: 'Term은 단어 테이블이 아니라 기준 데이터다',
    excerpt:
        'I-Poten의 Term 도메인을 단어, 카테고리, 태그, 조인 엔티티로 분리한 이유와 이 구조가 검색, 단어장, 퀴즈, 추천 확장에 어떤 기반이 되었는지 공유합니다.',
    category: 'Backend',
    authorOverride: {
        name: 'min',
        role: 'Fullstack Developer',
        accent: '#10B981',
    },
    publishedAt: '2026-05-10',
    readingMinutes: 12,
    cover: 'linear-gradient(135deg,#10B981 0%,#0369A1 55%,#0F172A 100%)',
    tags: ['Spring Boot', 'JPA', 'Domain Design', 'Search'],
    body: [
        { type: 'p', text: '여러분은 "용어 사전" 기능을 만든다면 어떤 테이블부터 떠올리시나요?' },
        { type: 'p', text: '아마 가장 먼저 term 테이블 하나를 만들고, title, description, category, tags 컬럼을 넣는 방식을 생각할 수 있습니다. 작은 기능이라면 충분해 보입니다.' },
        { type: 'p', text: '그런데 I-Poten에서 Term은 단순한 사전 데이터가 아니었습니다. 검색, 카테고리 탐색, 태그 검색, 단어장 저장, 퀴즈 출제, 추천까지 여러 기능이 공통으로 참조하는 기준 데이터였습니다.' },
        { type: 'p', text: '그래서 이번 발표의 핵심은 기능 소개가 아닙니다. **왜 단어, 카테고리, 태그를 분리했는가. 그리고 그 선택이 이후 기능 확장에 어떤 영향을 주었는가**를 회고해보려 합니다.' },

        { type: 'hr' },

        { type: 'h2', text: 'Part 1. Term은 모든 학습 흐름의 출발점이다' },

        { type: 'p', text: 'I-Poten은 IT 개발자 취업 준비생을 위한 용어 학습과 퀴즈 기반 학습 플랫폼입니다.' },
        { type: 'p', text: '사용자는 용어를 검색해서 보고, 필요한 개념을 단어장에 저장한 뒤, 복습과 퀴즈로 학습을 이어갑니다.' },
        { type: 'code', language: 'text', text:
                `검색                                                                                                                                                                                                                             
    → 용어 상세 확인                                                                                                                                                                                                                
    → 단어장 저장                                                                                                                                                                                                                   
    → 복습                                                                                                                                                                                                                          
    → 퀴즈                                                                                                                                                                                                                          
    → 추천 학습`
        },
        { type: 'p', text: '이 흐름에서 모든 기능이 공통으로 참조하는 데이터가 Term입니다.' },
        { type: 'p', text: '그래서 Term을 단순히 "제목과 설명이 있는 테이블"로 보면 안 됐습니다. 여러 도메인이 안정적으로 공유할 수 있는 기준 데이터로 설계해야 했습니다.' },

        { type: 'h3', text: '처음부터 분리한 네 가지 책임' },
        { type: 'p', text: 'Term 도메인은 크게 네 개의 엔티티로 구성했습니다.' },
        { type: 'list', items: [
                'Term: 단어 본체',
                'TermCategory: 용어의 분류 체계',
                'Tag: 검색과 추천에 쓰이는 키워드 사전',
                'TermTag: Term과 Tag를 연결하는 조인 엔티티',
            ]},
        { type: 'code', language: 'text', text:
                `Term ── ManyToOne ── TermCategory                                                                                                                                                                                                
                                                                                                                                                                                                                                    
  Term ── OneToMany ── TermTag ── ManyToOne ── Tag`
        },
        { type: 'p', text: '이 구조의 핵심은 관심사 분리입니다. 단어 본체, 분류 체계, 키워드 사전, 연결 관계는 변경되는 이유가 서로 다릅니다.' },
        { type: 'p', text: '변경 이유가 다르면 엔티티도 분리하는 편이 이후 유지보수에 유리하다고 판단했습니다.' },

        { type: 'hr' },

        { type: 'h2', text: 'Part 2. Term은 화면 데이터가 아니라 기준 데이터다' },

        { type: 'p', text: 'Term은 단어 본체에 해당하는 엔티티입니다. 핵심 필드는 id, title, description, termCategory입니다.' },
        { type: 'code', language: 'java', text:
                `@Entity                                                                                                                                                                                                                          
  @Table(name = "term")                                                                                                                                                                                                             
  public class Term {                                                                                                                                                                                                               
                                                                                                                                                                                                                                    
      @Id                                                                                                                                                                                                                           
      @GeneratedValue(strategy = GenerationType.IDENTITY)                                                                                                                                                                           
      private Long id;                                                                                                                                                                                                              
                                                                                                                                                                                                                                    
      @Column(nullable = false)                                                                                                                                                                                                     
      private String title;                                                                                                                                                                                                         
                                                                                                                                                                                                                                    
      @Column(columnDefinition = "TEXT", nullable = false)                                                                                                                                                                          
      private String description;                                                                                                                                                                                                   
                                                                                                                                                                                                                                    
      @ManyToOne(fetch = FetchType.LAZY, optional = true)                                                                                                                                                                           
      @JoinColumn(name = "category_id", nullable = true)                                                                                                                                                                            
      private TermCategory termCategory;                                                                                                                                                                                            
  }`
        },
        { type: 'p', text: 'title과 description은 사용자가 직접 보는 핵심 콘텐츠입니다. termCategory는 이 용어가 어떤 분류에 속하는지 알려줍니다.' },
        { type: 'p', text: '카테고리는 ManyToOne LAZY로 연결했습니다. 모든 Term 조회에서 카테고리 정보가 항상 필요한 것은 아니기 때문입니다.' },
        { type: 'p', text: '중요한 점은 Term이 그 자체로 하나의 화면만을 위한 데이터가 아니라는 겁니다. 단어장, 퀴즈, 검색, 추천이 모두 같은 Term을 바라봅니다.' },

        { type: 'h3', text: '왜 category를 문자열로 넣지 않았나' },
        { type: 'p', text: '처음부터 카테고리를 문자열 컬럼으로 두지 않았습니다. 카테고리는 단순 표시값이 아니라 탐색 구조였기 때문입니다.' },
        { type: 'p', text: 'TermCategory는 type, groupName, name, depth, sortOrder를 가지고, parent로 자기 자신을 참조합니다.' },
        { type: 'code', language: 'java', text:
                `@Entity                                                                                                                                                                                                                          
  @Table(                                                                                                                                                                                                                           
      name = "term_category",                                                                                                                                                                                                       
      uniqueConstraints = @UniqueConstraint(                                                                                                                                                                                        
          name = "uk_category_parent_name",                                                                                                                                                                                         
          columnNames = {"parent_id", "name"}                                                                                                                                                                                       
      )                                                                                                                                                                                                                             
  )                                                                                                                                                                                                                                 
  public class TermCategory {                                                                                                                                                                                                       
                                                                                                                                                                                                                                    
      @Column(nullable = false)                                                                                                                                                                                                     
      private String type;                                                                                                                                                                                                          
                                                                                                                                                                                                                                    
      @Column(name = "group_name", nullable = false)                                                                                                                                                                                
      private String groupName;                                                                                                                                                                                                     
                                                                                                                                                                                                                                    
      @Column(nullable = false)                                                                                                                                                                                                     
      private String name;                                                                                                                                                                                                          
                                                                                                                                                                                                                                    
      @Column(nullable = false)                                                                                                                                                                                                     
      private Integer depth;                                                                                                                                                                                                        
                                                                                                                                                                                                                                    
      @Column(name = "sort_order", nullable = false)                                                                                                                                                                                
      private Integer sortOrder;                                                                                                                                                                                                    
                                                                                                                                                                                                                                    
      @ManyToOne(fetch = FetchType.LAZY)                                                                                                                                                                                            
      @JoinColumn(name = "parent_id")                                                                                                                                                                                               
      private TermCategory parent;                                                                                                                                                                                                  
  }`
        },
        { type: 'p', text: 'parent를 통해 대분류, 중분류, 소분류 같은 계층 구조를 표현할 수 있습니다. sortOrder로 UI 정렬 기준도 함께 관리합니다.' },
        { type: 'p', text: '또 parent_id와 name 조합에 유니크 제약을 걸었습니다. 같은 부모 아래에 같은 이름의 카테고리가 중복으로 들어가는 일을 막기 위해서입니다.' },
        { type: 'p', text: '이렇게 분리해두면 카테고리별 탐색, 계층 구조 관리, 정렬, 관리자 화면에서의 분류 편집이 자연스럽게 가능해집니다.' },

        { type: 'h3', text: '처음에는 CAT001로 카테고리를 관리하려고 했다' },
        { type: 'p', text: '사실 처음에는 카테고리를 CAT001, CAT002처럼 코드값으로 관리하려고 했습니다. 개발을 배운 지 얼마 되지 않았던 시점이라, 숫자 ID보다 사람이 봤을 때 의미가 있는 코드값이 더 관리하기 쉬워 보였습니다.' },
        { type: 'p', text: '하지만 팀 리더가 이 부분을 짚어주었습니다. 카테고리는 단순히 한 번 정해두고 끝나는 값이 아니라, 서비스가 커지면서 추가되거나 순서가 바뀌고, 대분류와 소분류처럼 계층 구조도 가질 수 있는 데이터였습니다.' },
        { type: 'p', text: '그 이야기를 듣고 보니 CAT001 같은 값에 식별자, 의미, 순서의 역할을 한꺼번에 담으려 했다는 걸 알게 되었습니다. 예를 들어 중간에 새로운 카테고리가 추가되거나 기존 카테고리의 위치가 바뀌면 코드 체계를 다시 고민해야 할 수 있었습니다.' },
        { type: 'p', text: '그래서 최종적으로는 카테고리의 기본키를 Long id로 두고, 카테고리의 의미와 구조는 type, groupName, name, depth, sortOrder, parent 같은 별도 필드로 관리하는 방식으로 수정했습니다.' },
        { type: 'p', text: '이 과정은 작은 설계 변경처럼 보였지만, 저에게는 꽤 중요한 경험이었습니다. 보기 편한 값과 변경에 강한 구조는 다를 수 있다는 점을 배웠고, 식별자와 비즈니스 의미를 분리하는 것이 유지보수에 더 유리하다는 것도 알게 되었습니다.' },
        { type: 'p', text: '무엇보다 혼자 생각한 구조를 그대로 확정하기보다, 팀원의 피드백을 통해 설계를 점검하고 더 안정적인 방향으로 바꿀 수 있었다는 점에서 협업의 중요성을 느낄 수 있었습니다.' },

        { type: 'hr' },

        { type: 'h2', text: 'Part 3. 태그는 문자열이 아니라 키워드 사전이다' },

        { type: 'p', text: '태그도 Term 안의 문자열 컬럼으로 두지 않았습니다.' },
        { type: 'p', text: '태그는 화면에 보이는 부가 정보이기도 하지만, 검색 보조 키워드이자 추천과 통계의 기준이 될 수 있는 데이터입니다.' },
        { type: 'code', language: 'java', text:
                `@Entity                                                                                                                                                                                                                          
  @Table(                                                                                                                                                                                                                           
      name = "tag",                                                                                                                                                                                                                 
      uniqueConstraints = @UniqueConstraint(                                                                                                                                                                                        
          name = "uk_tag_name",                                                                                                                                                                                                     
          columnNames = "name"                                                                                                                                                                                                      
      )                                                                                                                                                                                                                             
  )                                                                                                                                                                                                                                 
  public class Tag {                                                                                                                                                                                                                
                                                                                                                                                                                                                                    
      @Id                                                                                                                                                                                                                           
      @GeneratedValue(strategy = GenerationType.IDENTITY)                                                                                                                                                                           
      private Long id;                                                                                                                                                                                                              
                                                                                                                                                                                                                                    
      @Column(unique = true, nullable = false)                                                                                                                                                                                      
      private String name;                                                                                                                                                                                                          
  }`
        },
        { type: 'p', text: 'Tag는 단일 키워드 사전 역할을 합니다. name에 유니크 제약을 둬서 같은 태그가 중복으로 생기지 않도록 했습니다.' },
        { type: 'p', text: 'Term과 Tag는 N:M 관계입니다. 하나의 용어에는 여러 태그가 붙을 수 있고, 하나의 태그는 여러 용어에 연결될 수 있습니다.' },

        { type: 'h3', text: 'N:M을 직접 풀어낸 이유' },
        { type: 'p', text: 'JPA의 @ManyToMany를 바로 쓰지 않고 TermTag라는 조인 엔티티를 직접 만들었습니다.' },
        { type: 'code', language: 'java', text:
                `@Entity                                                                                                                                                                                                                          
  @IdClass(TermTagId.class)                                                                                                                                                                                                         
  @Table(                                                                                                                                                                                                                           
      name = "term_tag",                                                                                                                                                                                                            
      uniqueConstraints = @UniqueConstraint(                                                                                                                                                                                        
          name = "uk_term_tag",                                                                                                                                                                                                     
          columnNames = {"term_id", "tag_id"}                                                                                                                                                                                       
      )                                                                                                                                                                                                                             
  )                                                                                                                                                                                                                                 
  public class TermTag {                                                                                                                                                                                                            
                                                                                                                                                                                                                                    
      @Id                                                                                                                                                                                                                           
      @ManyToOne(fetch = FetchType.LAZY)                                                                                                                                                                                            
      @JoinColumn(name = "term_id", nullable = false)                                                                                                                                                                               
      private Term term;                                                                                                                                                                                                            
                                                                                                                                                                                                                                    
      @Id                                                                                                                                                                                                                           
      @ManyToOne(fetch = FetchType.LAZY)                                                                                                                                                                                            
      @JoinColumn(name = "tag_id", nullable = false)                                                                                                                                                                                
      private Tag tag;                                                                                                                                                                                                              
  }`
        },
        { type: 'p', text: '초기에는 TermTag를 "용어와 태그의 연결 자체"로 봤습니다. 같은 용어에 같은 태그가 두 번 붙으면 안 되므로 term_id와 tag_id 조합을 식별자로 삼았습니다.' },
        { type: 'p', text: '이 방식은 데이터 의미가 명확합니다. 중복 연결도 구조적으로 막을 수 있습니다.' },
        { type: 'p', text: '다만, JPA에서 복합키를 쓰려면 IdClass나 EmbeddedId가 필요하고, 조회나 삭제 로직에서도 복합키 객체를 다뤄야 해서 코드가 조금 복잡해질 수 있습니다.' },
        { type: 'p', text: '또 나중에 연결 시점, 생성 주체, 대표 태그 여부, 추천 가중치 같은 필드가 추가된다면 TermTag는 단순 연결 테이블이 아니라 관리 대상 엔티티가 됩니다.' },
        { type: 'p', text: '그 시점에는 별도 id를 기본키로 두고, term_id와 tag_id 조합에는 unique 제약만 거는 방식이 더 유지보수하기 좋을 수 있습니다.' },

        { type: 'h3', text: '카테고리와 태그는 비슷하지만 역할이 다르다' },
        { type: 'table',
            headers: ['구분', '카테고리', '태그'],
            rows: [
                ['역할', '정해진 분류 체계', '검색과 추천을 위한 키워드'],
                ['관계', 'Term 기준 보통 하나', 'Term 기준 여러 개 가능'],
                ['구조', 'Term ManyToOne TermCategory', 'Term N:M Tag'],
                ['활용', '트리 탐색, 정렬, 분류 관리', '태그 검색, 연관 용어, 추천'],
            ],
        },
        { type: 'p', text: '카테고리는 용어가 속한 주 분류입니다. 태그는 용어를 여러 관점에서 찾기 위한 보조 키워드입니다.' },
        { type: 'p', text: '이 차이를 분리해두면 카테고리는 탐색 구조로, 태그는 검색과 추천 구조로 자연스럽게 확장됩니다.' },

        { type: 'hr' },

        { type: 'h2', text: 'Part 4. 등록 경로가 달라도 같은 규칙을 태운다' },

        { type: 'p', text: 'Term은 관리자 화면에서 수동으로 등록될 수도 있고, 초기 데이터 적재용 TSV 배치로 들어올 수도 있습니다.' },
        { type: 'p', text: '중요한 건 입력 채널이 아니라 도메인 규칙입니다. 어떤 경로로 들어오든 같은 등록 규칙을 거쳐야 데이터가 일관됩니다.' },
        { type: 'code', language: 'text', text:
                `카테고리 존재 확인                                                                                                                                                                                                               
    → 같은 카테고리 안에서 동일 용어 중복 확인                                                                                                                                                                                      
    → 태그 문자열 파싱                                                                                                                                                                                                              
    → 기존 태그 재사용                                                                                                                                                                                                              
    → 없는 태그 생성                                                                                                                                                                                                                
    → TermTag로 연결`
        },
        { type: 'p', text: '실제 등록 서비스도 이 흐름을 따릅니다.' },
        { type: 'code', language: 'java', text:
                `TermCategory termCategory = termCategoryRepository.findById(request.getCategoryId())                                                                                                                                             
          .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 카테고리입니다."));                                                                                                                                        
                                                                                                                                                                                                                                    
  if (termRepository.existsByTermCategory_IdAndTitle(termCategory.getId(), request.getTitle())) {                                                                                                                                   
      Term existing = termRepository.findByTermCategoryIdAndTitle(                                                                                                                                                                  
              termCategory.getId(),                                                                                                                                                                                                 
              request.getTitle()                                                                                                                                                                                                    
      ).orElseThrow();                                                                                                                                                                                                              
                                                                                                                                                                                                                                    
      return CreateTermResponse.duplicate(existing, existingTags, termCategory);                                                                                                                                                    
  }                                                                                                                                                                                                                                 
                                                                                                                                                                                                                                    
  Term savedTerm = termRepository.save(request.toTerm(termCategory));                                                                                                                                                               
                                                                                                                                                                                                                                    
  List<String> tagNames = TagTextParser.parse(request.getTags())                                                                                                                                                                    
          .stream()                                                                                                                                                                                                                 
          .distinct()                                                                                                                                                                                                               
          .toList();                                                                                                                                                                                                                
                                                                                                                                                                                                                                    
  List<String> savedTagNames = tagNames.stream().map(tagName -> {                                                                                                                                                                   
      Tag tag = tagRepository.findByName(tagName)                                                                                                                                                                                   
              .orElseGet(() -> tagRepository.save(new Tag(null, tagName)));                                                                                                                                                         
                                                                                                                                                                                                                                    
      termTagRepository.save(new TermTag(savedTerm, tag));                                                                                                                                                                          
      return tag.getName();                                                                                                                                                                                                         
  }).toList();`
        },
        { type: 'p', text: 'TSV 배치도 직접 DB에 넣지 않고 TermService.register()를 호출합니다. 그래서 배치와 관리자 등록이 같은 중복 검사, 태그 파싱, 태그 재사용 규칙을 공유합니다.' },

        { type: 'hr' },

        { type: 'h2', text: 'Part 5. 검색 확장은 설계 결과물이다' },

        { type: 'p', text: 'I-Poten의 검색은 단순 title 검색이 아닙니다.' },
        { type: 'list', items: [
                'title 검색',
                'description 검색',
                'tag 포함 검색',
                'categoryId 기반 필터',
                '선택한 카테고리의 하위 범위 해석',
                '관련도 기반 정렬',
                '초성, 알파벳, 기호 prefix 검색',
            ]},
        { type: 'p', text: '검색 요청이 들어오면 먼저 선택된 카테고리의 검색 대상 범위를 계산합니다.' },
        { type: 'code', language: 'java', text:
                `public List<Long> resolveSearchTargetIds(Long selectedCategoryId) {                                                                                                                                                              
      TermCategory selected = termCategoryRepository.findById(selectedCategoryId)                                                                                                                                                   
              .orElse(null);                                                                                                                                                                                                        
                                                                                                                                                                                                                                    
      if (selected == null) return List.of();                                                                                                                                                                                       
                                                                                                                                                                                                                                    
      if (selected.getDepth() == 2) {                                                                                                                                                                                               
          return List.of(selected.getId());                                                                                                                                                                                         
      }                                                                                                                                                                                                                             
                                                                                                                                                                                                                                    
      if (selected.getDepth() == 1) {                                                                                                                                                                                               
          return termCategoryRepository.findAllByParent_Id(selected.getId())                                                                                                                                                        
                  .stream()                                                                                                                                                                                                         
                  .filter(category -> category.getDepth() == 2)                                                                                                                                                                     
                  .map(TermCategory::getId)                                                                                                                                                                                         
                  .toList();                                                                                                                                                                                                        
      }                                                                                                                                                                                                                             
                                                                                                                                                                                                                                    
      return List.of(selected.getId());                                                                                                                                                                                             
  }`
        },
        { type: 'p', text: '그 다음 title, description, tag를 조합해서 검색합니다. 관련도 정렬에서는 title 정확 일치, prefix 일치, 부분 일치, description 일치, tag 일치에 서로 다른 점수를 부여합니다.' },
        { type: 'code', language: 'sql', text:
                `CASE                                                                                                                                                                                                                             
    WHEN LOWER(t.title) = LOWER(:q) THEN 100                                                                                                                                                                                        
    WHEN LOWER(t.title) LIKE CONCAT(LOWER(:q), '%') THEN 80                                                                                                                                                                         
    WHEN LOWER(t.title) LIKE CONCAT('%', LOWER(:q), '%') THEN 60                                                                                                                                                                    
    ELSE 0                                                                                                                                                                                                                          
  END                                                                                                                                                                                                                               
  + description match score                                                                                                                                                                                                         
  + tag match score`
        },
        { type: 'p', text: '이 검색이 가능한 이유는 처음부터 Term, TermCategory, Tag, TermTag를 분리해두었기 때문입니다.' },
        { type: 'p', text: '만약 태그를 Term의 문자열 컬럼 하나에 넣었다면 태그 검색, 추천 태그, 연관 키워드 확장, 태그 통계는 훨씬 다루기 어려웠을 겁니다.' },

        { type: 'hr' },

        { type: 'h2', text: 'Part 6. 이 설계가 얻은 것' },

        { type: 'p', text: '이번 구조에서 얻은 장점은 크게 여섯 가지입니다.' },
        { type: 'list', items: [
                'Tag와 TermTag의 유니크 제약으로 중복 태그와 중복 연결을 구조적으로 방지했습니다.',
                'TermCategory의 self-reference로 카테고리 계층과 정렬을 한 엔티티 안에서 관리할 수 있습니다.',
                'Tag가 엔티티이기 때문에 역방향 검색, 태그 통계, 추천 태그 기능이 가능합니다.',
                'Term이 단어장, 퀴즈, 추천에서 공통 기준 데이터로 재사용됩니다.',
                'TSV 배치와 관리자 등록이 같은 등록 규칙을 거쳐 데이터 일관성을 유지합니다.',
                '검색 로그 기반 인기 용어, 연관 태그, 사용자 맞춤 추천으로 확장하기 좋습니다.',
            ]},

        { type: 'h3', text: '하지만 분리는 끝이 아니라 시작이다' },
        { type: 'p', text: '구조를 분리했다고 모든 문제가 해결되는 것은 아닙니다. 오히려 다음 고민이 더 명확해졌습니다.' },
        { type: 'list', items: [
                '데이터가 늘어날수록 검색 성능 최적화가 필요합니다.',
                '태그 검색과 카테고리 필터가 함께 들어오는 복합 조건에서는 인덱스 설계가 중요해집니다.',
                'Term이 여러 도메인에서 참조되기 때문에 삭제 정책을 신중히 설계해야 합니다.',
            ]},
        { type: 'p', text: '특히 Term은 단어장, 퀴즈, 검색 로그, 추천에서 참조됩니다. 그래서 단순히 delete를 호출하는 것이 아니라, 실제 서비스에서는 참조 관계와 이력 보존 정책을 함께 고려해야 합니다.' },

        { type: 'h3', text: '다음 단계' },
        { type: 'p', text: '앞으로는 이 구조를 기반으로 네 가지를 더 검토하려고 합니다.' },
        { type: 'list', items: [
                '검색 로그 기반 인기 용어 분석',
                '태그 추천 자동화',
                '카테고리별 용어 품질 관리',
                '사용자 생성 용어와 관리자 표준 용어의 분리',
            ]},

        { type: 'hr' },

        { type: 'h2', text: '마치며 — Term은 단어 저장소가 아니다' },

        { type: 'p', text: '오늘 내용을 정리하면 세 가지입니다.' },
        { type: 'list', items: [
                'Term 도메인은 I-Poten의 학습 흐름 전체를 떠받치는 기준 데이터입니다.',
                '단어, 카테고리, 태그를 분리한 덕분에 검색성과 확장성을 함께 확보할 수 있었습니다.',
                '이 작업은 단순 CRUD가 아니라 여러 기능이 공유할 수 있는 도메인 구조를 만드는 일이었습니다.',
            ]},
        { type: 'p', text: '한 문장으로 요약하면 이렇습니다.' },
        { type: 'quote', text: 'Term 도메인은 단어를 저장하는 테이블이 아니라, 검색과 학습 흐름을 연결하는 기준 데이터 구조다.' },
        { type: 'p', text: '이번 글은 Term 도메인을 설계하면서 고민했던 기준과 선택들을 정리한 기록입니다. 작은 테이블 하나처럼 보였던 구조도 서비스 흐름 안에서는 여러 기능을 연결하는 중요한 기준이 될 수 있다는 점을 배웠습니다. 앞으로도 I-Poten의 학습 흐름을 더 안정적으로 확장해 나가며, 설계 과정에서 얻은 고민과 개선 과정을 계속 기록해보겠습니다.' },
    ],
};