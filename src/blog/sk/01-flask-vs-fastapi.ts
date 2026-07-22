import type { BlogPost } from '../../data';

export const post01: BlogPost = {
  id: '1',
  package: 'sk',
  title: 'Flask VS FastAPI',
  excerpt:
    'AI 서비스가 급증하면서 Python 웹 프레임워크 선택이 곧 서비스 경쟁력이 되었습니다. Flask의 한계와 FastAPI의 등장 배경, 그리고 왜 FastAPI가 AI 서빙의 표준이 되었는지 살펴봅니다.',
  category: 'Backend',
  authorOverride: {
    name: 'sk',
    role: 'I-Poten AI Developer',
    accent: '#22C55E',
  },
  publishedAt: '2026-05-11',
  readingMinutes: 10,
  cover: 'linear-gradient(135deg,#22C55E 0%,#0EA5E9 60%,#6366F1 100%)',
  tags: ['Python', 'Flask', 'FastAPI', 'ASGI', 'AI Serving'],
  body: [
    { type: 'p', text: 'AI 서비스가 급증하면서 Python 웹 프레임워크 선택이 곧 서비스 경쟁력이 되었습니다. Flask의 한계와 FastAPI의 등장 배경을 이해하면 왜 FastAPI가 AI 서빙의 표준이 되었는지 알 수 있습니다.' },

    { type: 'hr' },

    { type: 'h2', text: '1. Flask' },
    { type: 'p', text: 'Flask는 2010년 Armin Ronacher가 개발한 Python 마이크로 웹 프레임워크입니다. "마이크로"라는 이름처럼, 핵심 기능만 제공하고 나머지는 개발자가 필요에 따라 확장하는 설계 철학을 가집니다.' },

    { type: 'h3', text: '특징' },
    { type: 'list', items: [
      'WSGI 기반: 전통적인 동기(Synchronous) 방식으로 동작. 요청 하나가 스레드 하나를 점유',
      '마이크로 프레임워크: 라우팅, 요청/응답 처리 등 최소한의 기능만 내장',
      '유연한 확장성: ORM, 인증, 직렬화 등 모든 것을 서드파티 라이브러리로 직접 구성',
      '낮은 학습 곡선: 간결한 문법, 방대한 레퍼런스와 성숙한 생태계',
    ]},

    { type: 'h3', text: '기본 예시' },
    { type: 'code', language: 'python', text:
`from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json
    result = model(data["input"])  # 동기 처리 — 완료될 때까지 블로킹
    return jsonify({"result": result})

if __name__ == "__main__":
    app.run()`
    },

    { type: 'h3', text: '한계' },
    { type: 'p', text: '요청 하나를 처리하는 동안 스레드가 블로킹되는 WSGI 특성상, AI 모델 추론처럼 처리 시간이 긴 작업이 들어오면 다른 요청을 대기시킵니다. 동시 요청이 많아질수록 병목이 심해지고, 이를 해결하려면 Gunicorn 워커 수를 늘리는 것 외에 뚜렷한 방법이 없습니다.' },

    { type: 'hr' },

    { type: 'h2', text: '2. FastAPI' },
    { type: 'p', text: 'FastAPI는 2018년 Sebastián Ramírez가 개발한 Python 웹 프레임워크로, Python의 타입 힌팅과 비동기 처리를 핵심 설계 원칙으로 삼습니다. 고성능 ASGI 프레임워크인 Starlette 위에 구축되어 있으며, Pydantic을 활용한 자동 데이터 검증과 OpenAPI 문서 자동 생성을 기본 제공합니다.' },

    { type: 'h3', text: '비동기(Async) 처리' },
    { type: 'p', text: 'Flask는 WSGI 기반의 동기 방식인 반면, FastAPI는 ASGI 기반의 async/await를 네이티브로 지원합니다. 이벤트 루프 위에서 수천 개의 요청을 동시에 처리할 수 있어, 모델 추론 대기 중에도 다른 요청을 받아 처리합니다.' },
    { type: 'code', language: 'python', text:
`from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class InputData(BaseModel):
    input: list[float]

@app.post("/predict")
async def predict(data: InputData):  # 비동기 처리 — 대기 중 다른 요청 수용
    result = await run_inference(model, data.input)
    return {"result": result}`
    },

    { type: 'h3', text: '타입 기반 데이터 검증 (Pydantic)' },
    { type: 'p', text: 'Flask에서는 요청 데이터 검증을 수동으로 처리하거나 별도의 라이브러리(marshmallow 등)를 사용해야 합니다. FastAPI는 Pydantic 모델을 선언하는 것만으로 타입 검증, 직렬화/역직렬화를 자동으로 처리합니다. 잘못된 타입의 데이터가 모델로 전달되는 것을 API 레벨에서 차단합니다.' },

    { type: 'h3', text: '자동 API 문서화' },
    { type: 'p', text: '별도 설정 없이 /docs(Swagger UI)와 /redoc(ReDoc) 엔드포인트가 자동으로 생성됩니다. 타입 정의가 곧 문서가 되어, 모델 입출력 스키마를 코드와 문서가 항상 동기화된 상태로 유지할 수 있습니다.' },

    { type: 'h3', text: '스트리밍 응답 지원' },
    { type: 'p', text: 'LLM의 토큰 스트리밍(SSE, WebSocket)을 StreamingResponse로 간단하게 구현할 수 있습니다. Flask에서는 flask-sse 같은 별도 라이브러리와 복잡한 설정이 필요합니다.' },

    { type: 'hr' },

    { type: 'h2', text: '3. 비교 지표' },

    { type: 'h3', text: '기능 비교' },
    { type: 'table',
      headers: ['항목', 'Flask', 'FastAPI'],
      rows: [
        ['출시연도', '2010', '2018'],
        ['서버 인터페이스', 'WSGI', 'ASGI'],
        ['비동기 지원', '제한적', '네이티브 async/await'],
        ['타입 검증', '수동 (marshmallow 등)', 'Pydantic 자동 검증'],
        ['API 문서화', '별도 라이브러리 필요', '자동 생성 (/docs, /redoc)'],
        ['WebSocket', '별도 라이브러리', '기본 지원'],
        ['Background Task', 'Celery 필수', '기본 지원 + Celery 선택'],
        ['학습 곡선', '낮음', '낮음'],
        ['생태계 성숙도', '매우 성숙', '빠르게 성장 중'],
      ],
    },

    { type: 'h3', text: 'AI 서빙 스택 비교' },
    { type: 'table',
      headers: ['구성 요소', 'Flask 스택', 'FastAPI 스택'],
      rows: [
        ['웹 서버', 'Gunicorn + Workers', 'Uvicorn + Gunicorn'],
        ['모델 서버', '직접 로드', 'vLLM / Triton 연동'],
        ['스트리밍', 'flask-sse (별도 설정)', 'StreamingResponse (내장)'],
        ['스키마 검증', 'marshmallow / wtforms', 'Pydantic (내장)'],
        ['API 문서', 'Flask-RESTX (별도 설치)', '자동 생성 (/docs)'],
        ['배포', 'Docker + Gunicorn', 'Docker + Uvicorn'],
      ],
    },

    { type: 'h3', text: '성능 비교 (실습 결과)' },
    { type: 'p', text: '실습 환경에서 측정한 벤치마크입니다. 조건: AI 추론 지연 100ms 시뮬레이션, 동시성 레벨별 총 100 요청. 동시 요청이 1개일 때는 차이가 없지만, 동시성이 높아질수록 ASGI(FastAPI)와 WSGI(Flask)의 격차가 극적으로 벌어집니다.' },
    { type: 'table',
      headers: ['동시 요청 수', 'Flask 총 소요 시간', 'FastAPI 총 소요 시간', 'FastAPI 속도'],
      rows: [
        ['1',  '10.770s', '10.679s', '1.01×'],
        ['5',  '10.522s', '2.198s',  '4.79×'],
        ['10', '10.515s', '1.121s',  '9.38×'],
        ['20', '10.485s', '0.593s',  '17.68×'],
        ['50', '10.530s', '0.260s',  '40.57×'],
      ],
    },

    { type: 'h3', text: '언제 무엇을 선택할까' },
    { type: 'p', text: 'Flask가 여전히 유효한 경우' },
    { type: 'list', items: [
      '팀이 Flask에 익숙하고 마이그레이션 비용이 큰 레거시 시스템',
      '동기 처리로 충분한 소규모 내부 도구',
      'Jinja2 템플릿을 활용하는 서버 사이드 렌더링 앱',
    ]},
    { type: 'p', text: 'FastAPI를 선택해야 하는 경우' },
    { type: 'list', items: [
      'LLM, 이미지 생성 등 AI/ML 모델 추론 API 서버',
      '높은 동시성이 요구되는 프로덕션 서비스',
      'LLM 스트리밍 응답(SSE, WebSocket)이 필요한 서비스',
      'OpenAPI 기반 클라이언트 자동 생성이 필요한 경우',
    ]},

    { type: 'hr' },

    { type: 'h2', text: '결론' },
    { type: 'p', text: 'Flask가 틀린 선택이 아닙니다. 단순한 용도에서는 지금도 충분히 유효합니다. 그러나 AI/ML 서빙이라는 새로운 패러다임에서는 FastAPI가 명확한 우위를 갖습니다. HuggingFace, OpenAI, Anthropic, LangServe 등 주요 AI 플랫폼이 공식 서빙 가이드에서 FastAPI를 기본으로 권장하는 이유가 여기에 있습니다.' },
    { type: 'p', text: '비동기 처리, 타입 안정성, 자동 문서화, 고성능 — 이 네 가지가 AI 서비스 개발 사이클을 단축시키고 프로덕션 안정성을 높입니다. 새로운 AI 서빙 프로젝트를 시작한다면, FastAPI는 선택이 아닌 기본값입니다.' },
  ],
};
