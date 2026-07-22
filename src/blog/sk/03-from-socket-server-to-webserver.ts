import type { BlogPost } from '../../data';

export const post03: BlogPost = {
  id: '3',
  package: 'sk',
  title: '소켓 서버는 어떻게 웹서버가 될까',
  excerpt:
    '소켓에서 읽은 바이트 스트림을 HTTP 요청으로 파싱하고, 라우팅과 정적 파일 서빙, 동시성, 리버스 프록시 구조로 확장하는 웹서버의 내부 동작을 정리합니다.',
  category: 'Backend',
  authorOverride: {
    name: 'sk',
    role: 'I-Poten AI Developer',
    accent: '#22C55E',
  },
  publishedAt: '2026-07-10',
  readingMinutes: 11,
  cover: 'linear-gradient(135deg,#111827 0%,#7C3AED 50%,#22C55E 100%)',
  tags: ['Web Server', 'HTTP', 'Socket', 'Nginx', 'WAS'],
  body: [
    { type: 'p', text: '이전 네트워크 글에서는 브라우저 요청이 TCP/IP 계층을 지나 커널의 소켓 버퍼에 도착하고, 웹서버가 `recv()` 또는 `read()`로 TCP Payload를 읽는다는 점을 정리했습니다. 이번에는 그 다음 단계입니다. 웹서버는 소켓에서 읽은 바이트 스트림을 어떻게 HTTP 요청으로 이해하고, 어떤 응답을 만들어 다시 클라이언트로 보낼까요?' },
    { type: 'p', text: '결론부터 말하면 웹서버는 특별한 마법이 아닙니다. 소켓에서 읽은 바이트를 HTTP 규칙에 맞게 Request Line, Header, Body로 나누고, Method와 Path에 맞는 처리 결과를 HTTP Response 형식으로 다시 쓰는 프로그램입니다.' },

    { type: 'hr' },

    { type: 'h2', text: '1. 웹서버의 출발점은 TCP Payload다' },
    { type: 'p', text: '서버 커널은 Ethernet, IP, TCP 헤더를 처리한 뒤 Payload만 소켓 버퍼에 넣습니다. 웹서버 애플리케이션은 패킷 전체를 직접 읽는 것이 아니라, 커널이 정리해 둔 바이트 스트림을 소켓 API로 읽습니다.' },
    { type: 'code', language: 'text', text:
`[Ethernet Header][IP Header][TCP Header][Payload: HTTP Request]
                                      |
                                      v
                              Socket Buffer
                                      |
                                      v
                               Web Server recv()` },
    { type: 'p', text: '웹서버가 보는 데이터는 아래처럼 HTTP 메시지 형태입니다. 이 지점부터는 네트워크 계층이 아니라 애플리케이션 계층의 책임입니다.' },
    { type: 'code', language: 'http', text:
`GET /hello HTTP/1.1
Host: localhost:8080
User-Agent: curl/8.0.0
Accept: */*` },
    { type: 'p', text: '다만 중요한 점이 하나 있습니다. TCP는 메시지 단위가 아니라 바이트 스트림입니다. 그래서 `recv()` 한 번이 HTTP 요청 하나와 항상 정확히 일치하지 않습니다. 실습에서는 작은 요청이 한 번에 들어온다고 가정할 수 있지만, 실제 서버는 Header의 끝과 Body 길이를 기준으로 필요한 만큼 계속 읽어야 합니다.' },

    { type: 'hr' },

    { type: 'h2', text: '2. HTTP 요청은 정해진 구조를 가진다' },
    { type: 'p', text: 'HTTP/1.1 요청은 크게 Request Line, Header, Empty Line, Body로 구성됩니다. 단순 문자열처럼 보이지만 각 줄의 위치와 빈 줄의 의미가 명확하게 정해져 있습니다.' },
    { type: 'code', language: 'http', text:
`POST /users HTTP/1.1
Host: api.example.com
Content-Type: application/json
Content-Length: 19

{"name":"spring"}` },
    { type: 'table',
      headers: ['영역', '예시', '의미'],
      rows: [
        ['Request Line', 'POST /users HTTP/1.1', '메서드, 경로, HTTP 버전'],
        ['Header', 'Content-Type: application/json', '요청 부가 정보'],
        ['Empty Line', '빈 줄', 'Header와 Body의 경계'],
        ['Body', '{"name":"spring"}', '서버로 전달할 실제 데이터'],
      ],
    },
    { type: 'h3', text: 'Request Line' },
    { type: 'p', text: 'Request Line은 Method, Path, Version으로 나뉩니다. 웹서버나 프레임워크의 라우터는 보통 Method와 Path를 기준으로 어떤 처리 코드를 실행할지 결정합니다.' },
    { type: 'table',
      headers: ['요소', '예시', '의미'],
      rows: [
        ['Method', 'GET', '어떤 동작을 원하는가'],
        ['Path', '/posts/1', '어떤 리소스를 대상으로 하는가'],
        ['Version', 'HTTP/1.1', '어떤 HTTP 버전 규칙을 사용하는가'],
      ],
    },
    { type: 'h3', text: 'Header와 Body' },
    { type: 'p', text: 'Header는 요청 처리에 필요한 메타데이터입니다. `Host`, `User-Agent`, `Accept`, `Content-Type`, `Content-Length`, `Cookie`, `Origin` 같은 값들이 여기에 들어갑니다.' },
    { type: 'p', text: 'Body가 있는 요청에서는 `Content-Length`가 특히 중요합니다. TCP는 바이트 스트림이기 때문에 웹서버는 Body가 어디까지인지 스스로 알 수 없습니다. Header의 끝을 `\\r\\n\\r\\n`으로 찾고, 그 뒤에서 `Content-Length`만큼 추가 바이트를 읽어 Body로 해석합니다.' },

    { type: 'hr' },

    { type: 'h2', text: '3. 최소 HTTP 서버 만들기' },
    { type: 'p', text: '소켓 서버가 HTTP 요청 형식을 이해하고 HTTP 응답 형식으로 답하면 웹서버가 됩니다. 가장 단순한 흐름은 다음과 같습니다.' },
    { type: 'code', language: 'text', text:
`socket()
-> bind()
-> listen()
-> accept()
-> recv()
-> HTTP Request 파싱
-> HTTP Response 생성
-> sendall()
-> close()` },
    { type: 'code', language: 'python', text:
`import socket

HOST = "127.0.0.1"
PORT = 8080

server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
server_socket.bind((HOST, PORT))
server_socket.listen(5)

while True:
    conn, addr = server_socket.accept()
    with conn:
        data = conn.recv(4096)
        request_text = data.decode("utf-8")

        print("---- request ----")
        print(request_text)

        body = "Hello, Web Server"
        response = (
            "HTTP/1.1 200 OK\\r\\n"
            "Content-Type: text/plain; charset=utf-8\\r\\n"
            f"Content-Length: {len(body.encode('utf-8'))}\\r\\n"
            "Connection: close\\r\\n"
            "\\r\\n"
            f"{body}"
        )

        conn.sendall(response.encode("utf-8"))` },
    { type: 'h3', text: 'HTTP parser 구현하기' },
    { type: 'p', text: '위 예시는 요청 문자열을 출력만 합니다. 웹서버답게 동작하려면 최소한 Request Line에서 Method, Path, Version을 분리하고, Header를 딕셔너리 형태로 파싱한 뒤, Header와 Body의 경계를 찾아야 합니다.' },
    { type: 'code', language: 'python', text:
`def parse_http_request(data: bytes):
    request_text = data.decode("utf-8")

    header_text, _, body = request_text.partition("\\r\\n\\r\\n")
    lines = header_text.split("\\r\\n")

    request_line = lines[0]
    method, path, version = request_line.split(" ")

    headers = {}
    while i < len(lines) and lines[i] != '':
        name, value = line.split(":", 1)
        headers[name.strip().lower()] = value.strip()

    body = ''
        if i + 1 < len(lines):
            body = '\r\n'.join(lines[i + 1:])

    return {
        "method": method,
        "path": path,
        "version": version,
        "headers": headers,
        "body": body,
    }` },
    { type: 'p', text: '이제 서버 코드에서는 `request = read_http_request(conn)`처럼 요청을 구조화해서 다룰 수 있습니다. 라우팅 섹션에서 다루는 `method == "GET"` 또는 `path == "/health"` 같은 조건도 결국 이 parser가 만들어 준 구조화된 요청 객체를 사용하는 것입니다.' },

    { type: 'hr' },

    { type: 'h2', text: '4. 라우팅은 Method와 Path를 처리 코드에 연결한다' },
    { type: 'p', text: '라우팅은 요청의 Method와 Path를 보고 어떤 함수를 실행할지 결정하는 과정입니다. 프레임워크의 `@GetMapping`, `@app.get`, `router.get` 같은 기능도 본질적으로는 이 매핑을 더 편하게 제공하는 추상화입니다.' },
    { type: 'code', language: 'text', text:
`GET /          -> index handler
GET /health   -> health check handler
GET /users    -> user list handler
POST /users   -> user create handler` },
    { type: 'code', language: 'python', text:
`if method == "GET" and path == "/":
    return text_response("Home")
elif method == "GET" and path == "/health":
    return json_response('{"status":"ok"}')
else:
    return not_found_response()` },

    { type: 'hr' },

    { type: 'h2', text: '5. 정적 파일 서버는 파일을 HTTP Body로 보낸다' },
    { type: 'p', text: '정적 파일 서버는 URL Path를 파일 경로로 매핑하고, 파일 내용을 응답 Body로 전송합니다. HTML, CSS, JavaScript, 이미지 파일을 브라우저가 이해할 수 있도록 적절한 `Content-Type`도 함께 보내야 합니다.' },
    { type: 'code', language: 'text', text:
`GET /index.html  -> ./public/index.html
GET /style.css   -> ./public/style.css
GET /app.js      -> ./public/app.js` },
    { type: 'table',
      headers: ['파일 확장자', 'Content-Type'],
      rows: [
        ['.html', 'text/html; charset=utf-8'],
        ['.css', 'text/css; charset=utf-8'],
        ['.js', 'application/javascript; charset=utf-8'],
        ['.json', 'application/json; charset=utf-8'],
        ['.png', 'image/png'],
        ['.jpg', 'image/jpeg'],
      ],
    },
    { type: 'p', text: '정적 파일 서버를 직접 만들 때는 사용자가 요청한 Path를 그대로 파일 시스템 경로로 사용하면 위험합니다. `GET /../../etc/passwd` 같은 요청이 공개 디렉터리 밖의 파일을 노출할 수 있기 때문입니다. 실제 웹서버는 정규화된 경로가 허용된 루트 디렉터리 안에 있는지 확인합니다.' },

    { type: 'hr' },

    { type: 'h2', text: '6. 많은 연결을 처리하려면 동시성 모델이 필요하다' },
    { type: 'p', text: '가장 단순한 서버는 한 번에 하나의 연결만 처리합니다. 이 구조에서는 한 클라이언트 처리가 오래 걸리면 다음 클라이언트는 `accept()` 앞에서 기다려야 합니다.' },
    { type: 'code', language: 'text', text:
`accept()
-> recv()
-> handle()
-> send()
-> close()
-> 다음 accept()` },
    { type: 'table',
      headers: ['모델', '설명', '장점', '단점', '예시'],
      rows: [
        ['프로세스 기반', '요청 또는 연결을 여러 프로세스가 처리', '격리성이 좋음', '메모리 비용 큼', 'Apache Prefork'],
        ['스레드 기반', '연결마다 스레드 또는 스레드 풀 사용', '구현이 직관적', '스레드 수 증가 부담', 'Apache Worker, 전통적 WAS'],
        ['이벤트 기반', '이벤트 루프가 I/O 가능 상태를 감지해 처리', '높은 동시성', '비동기 흐름 이해 필요', 'Nginx, Node.js'],
        ['하이브리드', '프로세스, 스레드, 이벤트를 조합', '실무에 적합', '구조가 복잡함', '현대 웹서버, WAS'],
      ],
    },
    { type: 'h3', text: 'Keep-Alive' },
    { type: 'p', text: 'HTTP/1.1에서는 기본적으로 하나의 TCP 연결을 여러 요청에 재사용할 수 있습니다. 이것을 Keep-Alive라고 부릅니다. 요청마다 TCP handshake를 반복하지 않아도 되므로 성능상 유리하지만, 서버는 연결을 더 오래 유지해야 하므로 연결 수, 타임아웃, 리소스 관리가 중요해집니다.' },
    { type: 'code', language: 'text', text:
`TCP 연결 수립
-> HTTP 요청 1
-> HTTP 응답 1
-> HTTP 요청 2
-> HTTP 응답 2
-> 연결 종료` },

    { type: 'hr' },

    { type: 'h2', text: '7. Nginx, WAS, 프레임워크는 책임 범위가 다르다' },
    { type: 'p', text: '실무에서 "웹서버"라는 말은 문맥에 따라 좁게도, 넓게도 사용됩니다. Nginx와 Spring Boot가 둘 다 HTTP를 처리할 수 있지만, 운영 환경에서는 맡는 책임이 다릅니다.' },
    { type: 'table',
      headers: ['구분', '주요 역할', '예시'],
      rows: [
        ['웹서버', 'HTTP 요청 수신, 정적 파일, TLS, 압축, 프록시', 'Nginx, Apache'],
        ['WAS', '애플리케이션 코드 실행, 비즈니스 로직, DB 접근', 'Tomcat, Spring Boot 내장 서버, Gunicorn, Uvicorn'],
        ['프레임워크', '라우팅, 미들웨어, 요청/응답 추상화', 'Spring MVC, Express, FastAPI, Flask'],
      ],
    },
    { type: 'p', text: 'Spring Boot 애플리케이션을 실행하면 내장 Tomcat이 HTTP 요청을 받고, Spring MVC가 라우팅과 컨트롤러 호출을 처리합니다. FastAPI를 실행하면 Uvicorn 같은 ASGI 서버가 HTTP 요청을 받고, FastAPI가 라우팅, 의존성 주입, 응답 직렬화를 처리합니다.' },

    { type: 'h3', text: '리버스 프록시' },
    { type: 'p', text: '리버스 프록시는 클라이언트 앞에서는 서버처럼 보이고, 실제 애플리케이션 서버 앞에서는 클라이언트처럼 동작합니다. Nginx가 대표적인 예입니다.' },
    { type: 'code', language: 'text', text:
`[Browser]
   |
   v
[Nginx Reverse Proxy]
   |
   +--> [Spring Boot App 1]
   |
   +--> [Spring Boot App 2]
   |
   +--> [Static Files]` },
    { type: 'table',
      headers: ['목적', '설명'],
      rows: [
        ['정적 파일 처리', '이미지, CSS, JS를 애플리케이션 서버보다 효율적으로 제공'],
        ['TLS 종료', 'HTTPS 복호화를 앞단에서 처리'],
        ['로드 밸런싱', '여러 애플리케이션 서버로 요청 분산'],
        ['압축', 'gzip, brotli 등 응답 압축'],
        ['보안 정책', '요청 크기 제한, 특정 경로 차단, Header 조정'],
        ['장애 격리', '뒷단 서버 장애 시 에러 페이지나 다른 서버로 우회'],
      ],
    },
    { type: 'p', text: '예를 들어 브라우저가 `https://example.com/api/users`로 요청하면 Nginx가 TLS 연결을 종료하고 `/api` 경로를 Spring Boot 애플리케이션으로 프록시합니다. 이후 Spring MVC가 컨트롤러를 선택하고, Service와 Repository를 거쳐 JSON 응답을 만든 뒤 Nginx가 다시 브라우저로 전달합니다.' },

    { type: 'hr' },

    { type: 'h2', text: '결론' },
    { type: 'p', text: '웹서버는 TCP 연결 위에서 전달된 바이트 스트림을 HTTP 규칙에 따라 해석하고, 요청의 의미에 맞는 처리 결과를 다시 HTTP 응답 형식으로 만들어 보내는 애플리케이션입니다.' },
    { type: 'p', text: '이 관점으로 보면 Nginx, Apache, Spring Boot, FastAPI, Node.js도 더 명확하게 보입니다. 모두 HTTP를 다루지만 어떤 것은 앞단에서 연결과 정적 파일, 프록시를 담당하고, 어떤 것은 애플리케이션 로직과 라우팅을 담당합니다. 웹서버를 이해한다는 것은 결국 이 책임의 경계를 이해하는 일입니다.' },
  ],
};
