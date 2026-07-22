import type { BlogPost } from '../../data';

export const post02: BlogPost = {
  id: '2',
  package: 'sk',
  title: '브라우저 요청은 어떻게 웹서버까지 도착할까',
  excerpt:
    'HTTP 요청이 브라우저를 떠나 커널, 포트, 소켓, TCP 연결을 거쳐 웹서버 애플리케이션에 도착하기까지의 흐름을 단계별로 정리합니다.',
  category: 'Backend',
  authorOverride: {
    name: 'sk',
    role: 'I-Poten AI Developer',
    accent: '#22C55E',
  },
  publishedAt: '2026-06-12',
  readingMinutes: 9,
  cover: 'linear-gradient(135deg,#0F172A 0%,#2563EB 48%,#22C55E 100%)',
  tags: ['Network', 'TCP/IP', 'Socket', 'HTTP', 'Web Server'],
  body: [
    { type: 'p', text: '웹 개발을 하다 보면 HTTP, TCP, 포트, 소켓이라는 단어를 자주 만납니다. 하지만 이 개념들을 하나의 덩어리로 이해하면 네트워크 문제를 디버깅할 때 어디에서 무슨 일이 일어나는지 헷갈리기 쉽습니다.' },
    { type: 'p', text: '브라우저가 보낸 HTTP 요청은 문자열처럼 보이지만, 실제 네트워크에서는 바이트 스트림으로 이동합니다. 서버에 도착한 뒤에도 웹서버가 곧바로 패킷 전체를 읽는 것이 아니라, 커널이 네트워크 헤더를 처리하고 TCP Payload만 소켓 버퍼에 넣어 둡니다.' },

    { type: 'hr' },

    { type: 'h2', text: '1. HTTP와 TCP는 서로 다른 계층에서 처리된다' },
    { type: 'p', text: 'TCP/IP 4계층으로 보면 HTTP는 애플리케이션 계층, TCP는 전송 계층에 속합니다. 브라우저와 웹서버는 HTTP 메시지의 의미를 다루고, 운영체제 커널은 TCP 연결, 순서 보장, 포트 기반 전달을 처리합니다.' },
    { type: 'table',
      headers: ['계층', '대표 프로토콜', '핵심 역할', '처리 주체'],
      rows: [
        ['애플리케이션 계층', 'HTTP, FTP, DNS', '요청과 응답의 의미 처리', '브라우저, 웹서버'],
        ['전송 계층', 'TCP, UDP', '포트, 연결, 신뢰성 처리', '운영체제 커널'],
        ['인터넷 계층', 'IP, ICMP', 'IP 주소 기반 라우팅', '운영체제 커널'],
        ['네트워크 인터페이스 계층', 'Ethernet, Wi-Fi', '실제 프레임 전송', 'NIC, 드라이버'],
      ],
    },
    { type: 'p', text: '핵심은 커널과 사용자 공간의 경계입니다. 커널은 TCP/IP 계층까지 책임지고, 웹서버 애플리케이션은 커널이 넘겨준 데이터를 HTTP 요청으로 해석합니다. 즉, 커널이 `GET /index.html HTTP/1.1`의 의미를 파싱하는 것은 아닙니다.' },

    { type: 'hr' },

    { type: 'h2', text: '2. 포트는 주소이고, 소켓은 통신 인터페이스다' },
    { type: 'p', text: '포트는 특정 컴퓨터 안에서 어떤 네트워크 프로그램이 요청을 받을지 찾기 위한 번호입니다. IP 주소가 어느 컴퓨터인지 가리킨다면, 포트 번호는 그 컴퓨터 안의 어떤 프로세스로 전달할지 가리킵니다.' },
    { type: 'p', text: '반면 소켓은 커널과 애플리케이션 사이에서 실제 데이터 송수신에 사용하는 인터페이스입니다. 그래서 "포트로 데이터를 주고받는다"보다 "포트로 프로세스를 찾고, 소켓으로 데이터를 주고받는다"가 더 정확합니다.' },
    { type: 'table',
      headers: ['상황', '포트의 역할', '소켓의 역할'],
      rows: [
        ['패킷 도착', '목적지 프로세스 식별', '아직 직접 사용되지 않음'],
        ['연결 수락', '리스닝 소켓이 연결 요청을 받음', 'accept()가 연결 소켓 생성'],
        ['데이터 수신', '역할 종료', 'recv()로 데이터 읽기'],
        ['응답 전송', '직접 관여하지 않음', 'send() 또는 sendall()로 전송'],
      ],
    },
    { type: 'h3', text: '리스닝 소켓과 연결 소켓' },
    { type: 'p', text: '서버는 먼저 특정 포트에 바인딩한 뒤 연결을 기다리는 리스닝 소켓을 만듭니다. 클라이언트가 접속하면 `accept()`를 통해 실제 데이터 송수신에 사용할 연결 소켓이 새로 만들어집니다.' },
    { type: 'code', language: 'python', text:
`server_socket.bind((HOST, PORT))
server_socket.listen(5)

conn, addr = server_socket.accept()
data = conn.recv(1024)` },
    { type: 'p', text: '하나의 서버 포트에 여러 클라이언트가 동시에 연결될 수 있는 이유가 여기에 있습니다. 포트는 같아도 연결마다 별도의 연결 소켓이 생기고, 커널은 각 연결의 상태를 분리해서 관리합니다.' },

    { type: 'hr' },

    { type: 'h2', text: '3. TCP 3-Way Handshake는 번호를 맞추는 과정이다' },
    { type: 'p', text: 'TCP 연결 수립은 단순한 인사 절차가 아닙니다. 클라이언트와 서버가 서로의 초기 Sequence Number를 확인하고, 앞으로 어떤 바이트 번호부터 주고받을지 동기화하는 과정입니다.' },
    { type: 'code', language: 'text', text:
`1. Client -> Server: SYN, Seq = x
2. Server -> Client: SYN + ACK, Seq = y, Ack = x + 1
3. Client -> Server: ACK, Seq = x + 1, Ack = y + 1` },
    { type: 'p', text: 'Sequence Number는 내가 보내는 바이트의 번호이고, Acknowledgment Number는 상대방으로부터 다음에 받고 싶은 바이트 번호입니다. 예를 들어 클라이언트가 `Seq = 1001`로 300바이트를 보내면, 서버는 다음 바이트를 기다린다는 의미로 `Ack = 1301`을 보냅니다.' },
    { type: 'table',
      headers: ['패킷 종류', 'Seq 증가', '이유'],
      rows: [
        ['SYN', '+1', '연결 시작 표시도 시퀀스 공간에서 1바이트로 간주'],
        ['FIN', '+1', '연결 종료 표시도 1바이트로 간주'],
        ['순수 ACK', '+0', 'Payload가 없음'],
        ['데이터 전송', '+N', '보낸 데이터 N바이트만큼 증가'],
      ],
    },
    { type: 'p', text: '이 규칙 때문에 3-way handshake의 마지막 ACK와 그 직후 전송되는 HTTP 요청이 같은 Seq 번호를 가질 수 있습니다. 마지막 ACK는 Payload가 없는 순수 ACK이므로 Seq가 증가하지 않기 때문입니다.' },

    { type: 'hr' },

    { type: 'h2', text: '4. 웹서버가 읽는 것은 TCP 패킷 전체가 아니라 Payload다' },
    { type: 'p', text: '브라우저가 보낸 HTTP 요청은 네트워크를 지나면서 여러 계층의 헤더로 감싸집니다. 서버 NIC가 프레임을 받으면 커널 네트워크 스택이 Ethernet, IP, TCP 헤더를 차례로 처리하고, 최종적으로 TCP Payload만 소켓 버퍼에 저장합니다.' },
    { type: 'code', language: 'text', text:
`[Ethernet Header][IP Header][TCP Header][Payload: HTTP Request]` },
    { type: 'h3', text: '서버 내부 처리 흐름' },
    { type: 'list', items: [
      'NIC가 네트워크 프레임을 수신한다',
      '커널 네트워크 스택이 Ethernet, IP, TCP 헤더를 처리한다',
      '목적지 포트를 기준으로 대상 소켓을 식별한다',
      'TCP Payload를 socket buffer에 저장한다',
      '웹서버가 recv() 또는 read()로 Payload를 읽는다',
      '웹서버가 바이트 스트림을 HTTP 요청 문자열로 디코딩하고 파싱한다',
    ]},
    { type: 'p', text: '따라서 웹서버 애플리케이션은 TCP 헤더를 직접 보지 않습니다. 웹서버가 `recv()`로 읽는 데이터는 커널이 헤더를 제거한 뒤 소켓 버퍼에 넣어 둔 Payload입니다.' },
    { type: 'code', language: 'http', text:
`GET /index.html HTTP/1.1
Host: example.com
User-Agent: curl/7.68.0` },
    { type: 'p', text: '이 HTTP 요청은 사람이 읽을 수 있는 문자열처럼 보이지만, 실제 전송 시에는 ASCII 또는 UTF-8 바이트 스트림입니다. 웹서버는 그 바이트를 읽어 HTTP 문법에 맞게 파싱하고, 라우팅과 비즈니스 로직을 실행한 뒤 응답을 다시 소켓으로 보냅니다.' },

    { type: 'hr' },

    { type: 'h2', text: '한 장으로 정리하기' },
    { type: 'code', language: 'text', text:
`[Browser]
   |
   | HTTP 요청 문자열
   v
[TCP/IP 계층]
   |
   | Ethernet/IP/TCP Header + Payload
   v
[Server Kernel]
   |
   | Header 제거, 포트 기반 소켓 식별
   v
[Socket Buffer]
   |
   | Payload만 저장
   v
[Web Server Application]
   |
   | recv(), read()로 읽고 HTTP 파싱
   v
[Business Logic / Response]` },
    { type: 'p', text: '네트워크 요청을 이해할 때 가장 중요한 구분은 책임의 경계입니다. IP 주소는 컴퓨터를 찾고, 포트는 프로세스를 찾고, 소켓은 데이터를 주고받는 인터페이스가 됩니다. TCP는 연결과 신뢰성을 보장하고, HTTP의 의미 해석은 웹서버 애플리케이션이 담당합니다.' },
    { type: 'p', text: '이 경계를 알고 있으면 "서버가 요청을 받았다"는 말을 더 정확히 나눠 볼 수 있습니다. 커널이 패킷을 처리했는지, 소켓 버퍼에 데이터가 쌓였는지, 웹서버가 Payload를 읽었는지, HTTP 파싱 이후 애플리케이션 로직에서 문제가 생겼는지를 단계별로 추적할 수 있습니다.' },
  ],
};
