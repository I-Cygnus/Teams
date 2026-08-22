import type { BlogPost } from '../../data';

export const post07: BlogPost = {
    id: '7',
    package: 'min',
    title: 'AWS를 계속 쓸까, 자체 서버를 구축할까?',
    excerpt:
        '3~5개의 소규모 프로젝트를 운영한다고 가정했을 때 AWS와 자체 서버의 비용, 운영 부담, 확장성, TCO를 비교합니다.',
    category: 'Infrastructure',
    authorOverride: {
        name: 'min',
        role: 'Fullstack Developer',
        accent: '#6366F1',
    },
    publishedAt: '2026-08-14',
    readingMinutes: 10,
    cover: 'linear-gradient(135deg,#0F172A 0%,#2563EB 55%,#38BDF8 100%)',
    coverImage: '/blog/min/07/aws-vs-on-premise.png',
    tags: [
        'AWS',
        'Cloud',
        'On-Premise',
        'Server',
        'Infrastructure',
        'Docker',
        'TCO',
    ],

    body: [
        {
            type: 'p',
            text: '현재 작은 웹서비스를 AWS에서 운영하고 있다고 가정해 보겠습니다.',
        },
        {
            type: 'p',
            text: '현재 사용하는 서버는 RAM 4GB 정도이고, 관련 비용은 한 달에 약 6만 원 정도입니다.',
        },
        {
            type: 'p',
            text: '지금은 프로젝트가 많지 않지만 앞으로 **3~5개 정도의 소규모 프로젝트를 운영할 가능성**이 있다고 해보겠습니다.',
        },
        {
            type: 'quote',
            text: '프로젝트가 3~5개로 늘어나면 AWS 비용은 얼마나 늘어날까? 자체 서버 한 대를 구매해서 여러 프로젝트를 함께 운영하는 방법은 어떨까?',
        },
        {
            type: 'p',
            text: '이번 글에서는 이 상황을 기준으로 AWS를 계속 사용하는 경우와 자체 서버를 구축하는 경우를 비교해봅니다.',
        },
        {
            type: 'p',
            text: '다만 프로젝트 수와 비용은 1:1로 증가하지 않습니다. AWS에서도 하나의 서버에 여러 프로젝트를 운영할 수 있기 때문에, 프로젝트별 서버를 따로 두는 경우와 자원을 통합해서 사용하는 경우를 함께 생각해야 합니다.',
        },
        {
            type: 'p',
            text: '글에 등장하는 금액과 사양은 이해를 돕기 위한 예시이며, 실제 비용은 프로젝트 특성, 트래픽, 인스턴스 종류, 스토리지, DB 구성 등에 따라 달라질 수 있습니다.',
        },

        { type: 'hr' },

        {
            type: 'h2',
            text: 'Part 1. AWS는 필요한 서버 자원을 빌려 쓰는 방식이다',
        },

        {
            type: 'p',
            text: 'AWS의 EC2 같은 서비스를 아주 단순하게 설명하면 **서버 장비를 직접 구매하는 대신 필요한 컴퓨팅 자원을 빌려 사용하는 방식**입니다.',
        },

        {
            type: 'code',
            language: 'text',
            text: `AWS

물리 서버를 직접 구매하지 않음
        ↓
CPU / RAM 등의 자원을 선택
        ↓
가상 서버 생성
        ↓
사용한 자원에 따라 비용 지불`,
        },

        {
            type: 'p',
            text: '쉽게 비유하면 AWS는 **서버 월세**와 비슷합니다.',
        },

        {
            type: 'p',
            text: 'AWS는 데이터센터, 물리 서버, 전력, 물리 네트워크 같은 기반 인프라를 관리합니다.',
        },
        {
            type: 'p',
            text: '하지만 EC2 위에 설치한 운영체제, Docker, 애플리케이션, 웹 서버, DB 설정 등은 여전히 사용자가 관리해야 합니다.',
        },

        {
            type: 'code',
            language: 'text',
            text: `AWS가 주로 관리

물리 서버
데이터센터
전력
물리 네트워크

사용자가 관리

OS
Docker
nginx
애플리케이션
DB
보안 설정`,
        },

        {
            type: 'quote',
            text: 'AWS는 서버 운영 전체를 대신해주는 것이 아니라 물리 인프라를 직접 보유하고 관리해야 하는 부담을 줄여주는 방식이다.',
        },

        { type: 'hr' },

        {
            type: 'h2',
            text: 'Part 2. 자체 서버는 물리 장비까지 직접 보유하고 운영하는 방식이다',
        },

        {
            type: 'p',
            text: '반대로 자체 서버는 서버 장비를 직접 구매해서 회사나 별도의 공간에 설치하고 운영하는 방식입니다.',
        },

        {
            type: 'p',
            text: 'AWS가 서버 월세라면 자체 서버는 **서버 자가**에 가깝습니다.',
        },

        {
            type: 'code',
            language: 'text',
            text: `자체 서버

서버 장비 구매
    ↓
회사 / 서버실 설치
    ↓
OS와 서비스 구성
    ↓
직접 운영`,
        },

        {
            type: 'p',
            text: '예를 들어 RAM 32GB 또는 64GB 정도의 장비에 Ubuntu Server와 Docker를 설치하고 여러 프로젝트를 운영하는 방식도 생각할 수 있습니다.',
        },

        {
            type: 'p',
            text: '다만 자체 서버에서는 애플리케이션뿐 아니라 물리 장비, 전원, 디스크, 네트워크 장애까지 관리 범위에 들어옵니다.',
        },

        { type: 'hr' },

        {
            type: 'h2',
            text: 'Part 3. Web, API, DB는 역할의 구분이지 물리 서버의 개수를 의미하지 않는다',
        },

        {
            type: 'p',
            text: '웹서비스 구조를 설명할 때 Web, API, DB라는 구분을 자주 사용합니다.',
        },

        {
            type: 'code',
            language: 'text',
            text: `사용자
  ↓
Web
  ↓
API
  ↓
DB`,
        },

        {
            type: 'p',
            text: '하지만 이것은 각각의 역할을 구분한 것이지 반드시 컴퓨터 세 대를 사용해야 한다는 의미는 아닙니다.',
        },

        {
            type: 'p',
            text: '소규모 서비스라면 하나의 서버에서 여러 역할을 함께 실행할 수도 있습니다.',
        },

        {
            type: 'code',
            language: 'text',
            text: `서버 1대

├─ nginx / Web
├─ Spring Boot API
└─ MySQL`,
        },

        {
            type: 'p',
            text: 'Docker를 사용한다면 각각을 컨테이너로 구분해서 운영할 수도 있습니다.',
        },

        {
            type: 'quote',
            text: 'Web, API, DB를 구분하는 것과 물리 서버를 각각 분리하는 것은 서로 다른 문제다.',
        },

        { type: 'hr' },

        {
            type: 'h2',
            text: 'Part 4. 프로젝트가 3~5개라고 서버도 3~5대 필요한 것은 아니다',
        },

        {
            type: 'p',
            text: '이번에는 실제로 프로젝트가 3~5개 정도로 늘어나는 상황을 생각해보겠습니다.',
        },

        {
            type: 'p',
            text: '프로젝트가 5개라고 해서 서버가 반드시 5대 필요한 것은 아닙니다.',
        },

        {
            type: 'code',
            language: 'text',
            text: `프로젝트 5개

잘못 생각하기 쉬운 구조

Project A → Server A
Project B → Server B
Project C → Server C
Project D → Server D
Project E → Server E`,
        },

        {
            type: 'p',
            text: '각 프로젝트의 트래픽과 자원 사용량이 작다면 하나의 서버에서 여러 프로젝트를 함께 운영할 수 있습니다.',
        },

        {
            type: 'code',
            language: 'text',
            text: `서버 1대

├─ Project A
├─ Project B
├─ Project C
├─ Project D
└─ Project E`,
        },

        {
            type: 'p',
            text: 'AWS에서도 같은 방식으로 하나의 EC2 인스턴스에 여러 프로젝트를 배치할 수 있고, 자체 서버에서도 Docker 등을 활용해 프로젝트별 환경을 구분할 수 있습니다.',
        },

        {
            type: 'p',
            text: '따라서 프로젝트 수보다 더 중요한 것은 CPU, 메모리, DB 부하, Disk I/O, 네트워크 사용량입니다.',
        },

        {
            type: 'quote',
            text: '프로젝트가 5개라는 사실보다 그 5개 프로젝트가 실제로 얼마나 많은 자원을 사용하는지가 더 중요하다.',
        },

        { type: 'hr' },

        {
            type: 'h2',
            text: 'Part 5. 프로젝트별로 AWS 서버를 사용하면 비용은 빠르게 늘어날 수 있다',
        },

        {
            type: 'p',
            text: '현재와 비슷한 AWS 환경이 프로젝트마다 하나씩 필요하다고 단순하게 가정해보겠습니다.',
        },

        {
            type: 'code',
            language: 'text',
            text: `현재 기준

프로젝트 1개
월 약 6만원


프로젝트 3개
월 약 18만원
연 약 216만원
3년 약 648만원


프로젝트 5개
월 약 30만원
연 약 360만원
3년 약 1,080만원`,
        },

        {
            type: 'p',
            text: '이렇게 계산하면 프로젝트가 많아질수록 자체 서버가 훨씬 저렴해 보입니다.',
        },

        {
            type: 'p',
            text: '하지만 이 계산은 **프로젝트마다 별도의 AWS 서버를 사용한다는 단순 가정**입니다.',
        },

        {
            type: 'p',
            text: '실제로는 여러 프로젝트를 하나의 EC2에 통합하거나 조금 더 큰 인스턴스를 사용하는 방법도 있습니다.',
        },

        {
            type: 'code',
            language: 'text',
            text: `AWS 구성 예시

큰 EC2 1대

├─ Project A
├─ Project B
├─ Project C
├─ Project D
└─ Project E`,
        },

        {
            type: 'quote',
            text: '프로젝트 수가 늘어난다고 AWS 비용이 반드시 같은 비율로 증가하는 것은 아니다.',
        },

        { type: 'hr' },

        {
            type: 'h2',
            text: 'Part 6. 자체 서버도 장비 가격만 보면 안 된다',
        },

        {
            type: 'p',
            text: '반대로 자체 서버도 장비 한 대 가격만 보고 판단하면 안 됩니다.',
        },

        {
            type: 'p',
            text: '3~5개의 프로젝트를 운영하기 위해 RAM 32GB 또는 64GB급 장비를 구매한다고 해도 실제 운영에는 다른 요소들이 필요합니다.',
        },

        {
            type: 'list',
            items: [
                '서버 장비',
                '인터넷 회선과 네트워크 구성',
                '공인 IP',
                'UPS 등 전원 대책',
                '백업 장비와 백업 정책',
                '디스크와 부품 교체',
                '모니터링',
                '장애 대응',
                '관리 시간',
            ],
        },

        {
            type: 'p',
            text: '예를 들어 서버 한 대에 5개의 프로젝트를 모두 올렸는데 해당 서버가 고장 나면 5개의 프로젝트가 동시에 영향을 받을 수 있습니다.',
        },

        {
            type: 'code',
            language: 'text',
            text: `자체 서버 장애
      ↓

Project A 장애
Project B 장애
Project C 장애
Project D 장애
Project E 장애`,
        },

        {
            type: 'p',
            text: '따라서 자체 서버의 비용을 계산할 때는 장비 가격뿐 아니라 장애가 발생했을 때의 영향과 대응 방식도 함께 봐야 합니다.',
        },

        {
            type: 'quote',
            text: '자체 서버 한 대에 여러 프로젝트를 모을수록 자원 활용은 좋아지지만 장애의 영향 범위도 함께 커질 수 있다.',
        },

        { type: 'hr' },

        {
            type: 'h2',
            text: 'Part 7. 기업용 서버는 왜 일반 PC보다 비쌀까?',
        },

        {
            type: 'p',
            text: '자체 서버를 알아보다 보면 일반 PC와 기업용 서버의 가격 차이가 상당히 큰 경우가 있습니다.',
        },

        {
            type: 'p',
            text: '기업용 서버는 단순한 CPU와 RAM 성능뿐 아니라 안정적인 장시간 운영과 장애 대응을 위한 기능을 제공하는 경우가 많습니다.',
        },

        {
            type: 'code',
            language: 'text',
            text: `기업용 서버에서 고려할 수 있는 요소

ECC Memory
RAID
Hot Swap Disk
이중화 전원
원격 관리
제조사 유지보수`,
        },

        {
            type: 'p',
            text: '그래서 동일한 CPU나 RAM만 비교하면 일반 PC보다 기업용 서버가 훨씬 비싸게 느껴질 수 있습니다.',
        },

        { type: 'hr' },

        {
            type: 'h2',
            text: 'Part 8. 개발·테스트 중심이라면 일반 장비도 선택지가 될 수 있다',
        },

        {
            type: 'p',
            text: '3~5개의 프로젝트가 모두 중요한 운영 서비스인 것은 아닐 수도 있습니다.',
        },

        {
            type: 'p',
            text: '개발, 테스트, PoC, Jenkins, 사내 서비스처럼 장애 영향이 상대적으로 작은 환경이라면 일반 고사양 PC나 워크스테이션을 서버로 활용하는 방법도 고려할 수 있습니다.',
        },

        {
            type: 'code',
            language: 'text',
            text: `자체 서버 예시

CPU    Ryzen / Intel
RAM    32GB ~ 64GB
SSD    NVMe 1~2TB
OS     Ubuntu Server

Docker

├─ Project A
├─ Project B
├─ Project C
├─ Jenkins
└─ 테스트 환경`,
        },

        {
            type: 'p',
            text: '반대로 3~5개 프로젝트가 모두 실제 고객이 사용하는 중요한 서비스라면 서버 장비 수준과 장애 대응 요구도 훨씬 높아집니다.',
        },

        {
            type: 'quote',
            text: '서버 사양을 결정할 때는 프로젝트 개수보다 서비스 중단을 어느 정도까지 허용할 수 있는지가 중요하다.',
        },

        { type: 'hr' },

        {
            type: 'h2',
            text: 'Part 9. AWS도 서버를 통합하면 비용 구조가 달라진다',
        },

        {
            type: 'p',
            text: 'AWS에서도 프로젝트마다 별도 EC2를 만드는 것이 유일한 방법은 아닙니다.',
        },

        {
            type: 'p',
            text: '3~5개의 프로젝트가 모두 트래픽이 크지 않다면 조금 더 큰 EC2 한 대나 두 대에 프로젝트를 통합하는 방법도 있습니다.',
        },

        {
            type: 'code',
            language: 'text',
            text: `방식 A

Project A → EC2
Project B → EC2
Project C → EC2
Project D → EC2
Project E → EC2


방식 B

EC2 1대

├─ Project A
├─ Project B
├─ Project C
├─ Project D
└─ Project E`,
        },

        {
            type: 'p',
            text: '따라서 AWS와 자체 서버를 비교할 때는 프로젝트별 EC2 구성만 볼 것이 아니라 AWS 안에서 자원을 통합했을 때의 비용도 같이 비교해야 합니다.',
        },

        { type: 'hr' },

        {
            type: 'h2',
            text: 'Part 10. AWS의 강점은 프로젝트가 늘어날 때 자원을 쉽게 조정할 수 있다는 것이다',
        },

        {
            type: 'p',
            text: '3개의 프로젝트로 시작했는데 나중에 5개, 7개로 늘어날 수도 있습니다.',
        },

        {
            type: 'p',
            text: 'AWS에서는 필요한 시점에 인스턴스 크기를 조정하거나 서버를 추가하는 방식으로 비교적 빠르게 대응할 수 있습니다.',
        },

        {
            type: 'code',
            language: 'text',
            text: `초기

Project A
Project B
Project C

        ↓

프로젝트 증가

Project A
Project B
Project C
Project D
Project E

        ↓

필요한 만큼
서버 자원 추가`,
        },

        {
            type: 'p',
            text: '트래픽 변화가 큰 서비스라면 Auto Scaling으로 서버 수를 조정하고 Load Balancer로 요청을 분산하는 구조도 만들 수 있습니다.',
        },

        {
            type: 'quote',
            text: '클라우드는 처음부터 최대 용량의 장비를 구매하지 않고 필요에 따라 자원을 조정할 수 있다는 장점이 있다.',
        },

        { type: 'hr' },

        {
            type: 'h2',
            text: 'Part 11. 다만 AWS에서도 장애 대응 구조는 별도로 설계해야 한다',
        },

        {
            type: 'p',
            text: 'AWS에 5개의 프로젝트를 하나의 EC2에 모두 올리면 자체 서버와 비슷한 문제가 생길 수 있습니다.',
        },

        {
            type: 'code',
            language: 'text',
            text: `EC2 한 대

├─ Project A
├─ Project B
├─ Project C
├─ Project D
└─ Project E

EC2 장애
    ↓
여러 프로젝트 동시 영향`,
        },

        {
            type: 'p',
            text: 'AWS라고 해서 자동으로 고가용성이 만들어지는 것은 아닙니다.',
        },

        {
            type: 'p',
            text: '중요한 서비스라면 여러 인스턴스를 사용하거나 여러 Availability Zone에 분산하는 등의 별도 설계가 필요합니다.',
        },

        {
            type: 'quote',
            text: '한 서버에 여러 프로젝트를 통합하면 비용은 줄일 수 있지만 장애 범위가 커진다는 점은 AWS와 자체 서버 모두 동일하다.',
        },

        { type: 'hr' },

        {
            type: 'h2',
            text: 'Part 12. 프로젝트가 늘어나면 데이터 전송 비용도 함께 봐야 한다',
        },

        {
            type: 'p',
            text: '프로젝트가 3~5개로 늘어나면 서버 자원뿐 아니라 전체 데이터 전송량도 늘어날 수 있습니다.',
        },

        {
            type: 'p',
            text: '특히 이미지, 영상, 파일 다운로드가 많은 프로젝트가 포함되어 있다면 네트워크 비용이 중요한 항목이 될 수 있습니다.',
        },

        {
            type: 'code',
            language: 'text',
            text: `AWS 비용

Compute
Storage
Database
Network
Load Balancer
기타 서비스`,
        },

        {
            type: 'p',
            text: '따라서 프로젝트 수가 늘어날 때는 EC2 가격만이 아니라 전체 AWS 비용 구조를 함께 확인해야 합니다.',
        },

        { type: 'hr' },

        {
            type: 'h2',
            text: 'Part 13. AWS 안에서도 여러 구성 방법을 비교할 수 있다',
        },

        {
            type: 'p',
            text: '자체 서버를 검토하기 전에 현재 AWS를 유지하는 방법도 여러 가지로 나누어 볼 수 있습니다.',
        },

        {
            type: 'code',
            language: 'text',
            text: `선택지 A

프로젝트별 EC2 사용


선택지 B

여러 프로젝트를
하나의 EC2에 통합


선택지 C

중요도에 따라
EC2를 2~3개로 분리`,
        },

        {
            type: 'p',
            text: '예를 들어 실제 사용량에 맞게 인스턴스 크기를 조정하거나, 사용하지 않는 EBS나 스냅샷 같은 리소스를 정리하는 방법도 있습니다.',
        },

        {
            type: 'p',
            text: '3~5개의 프로젝트가 모두 작은 규모라면 서버 자원을 함께 활용할 수 있는지도 검토해볼 수 있습니다.',
        },

        {
            type: 'quote',
            text: '자체 서버와 비교할 때는 현재 AWS 비용뿐 아니라 AWS 안에서 구성을 조정했을 때의 비용도 함께 비교해야 한다.',
        },

        { type: 'hr' },

        {
            type: 'h2',
            text: 'Part 14. 3~5개의 작은 프로젝트라면 자체 서버도 충분히 검토할 만하다',
        },

        {
            type: 'p',
            text: '프로젝트가 3~5개 정도이고 모두 사용량이 비교적 일정하다면 자체 서버는 현실적인 선택지가 될 수 있습니다.',
        },

        {
            type: 'code',
            language: 'text',
            text: `자체 서버가 적합할 가능성이 높은 상황

프로젝트 3~5개

트래픽 변화가 크지 않음

CPU / 메모리 사용량이
비교적 일정함

서버를 관리할 수 있음

개발 / 테스트 비중이 높음`,
        },

        {
            type: 'p',
            text: '예를 들어 32GB 또는 64GB급 서버 한 대를 여러 프로젝트가 공유한다면 남는 자원을 효율적으로 활용할 수 있습니다.',
        },

        {
            type: 'p',
            text: '다만 모든 프로젝트가 하나의 장비에 의존하게 되므로 운영 중요도가 높은 서비스라면 백업이나 이중화도 함께 검토해야 합니다.',
        },

        { type: 'hr' },

        {
            type: 'h2',
            text: 'Part 15. 반대로 프로젝트별 중요도와 트래픽 차이가 크다면 AWS의 장점이 커질 수 있다',
        },

        {
            type: 'p',
            text: '3~5개의 프로젝트라고 해도 모두 같은 성격일 필요는 없습니다.',
        },

        {
            type: 'code',
            language: 'text',
            text: `Project A
사용자 많음

Project B
사용자 적음

Project C
개발용

Project D
이벤트성 트래픽

Project E
내부 서비스`,
        },

        {
            type: 'p',
            text: '이처럼 프로젝트별 사용량이나 중요도가 크게 다르다면 필요한 자원을 프로젝트별로 조정할 수 있는 AWS의 유연성이 더 유리할 수 있습니다.',
        },

        {
            type: 'quote',
            text: '프로젝트 개수가 같더라도 각각의 사용량과 중요도가 다르면 적절한 인프라 구성도 달라질 수 있다.',
        },

        { type: 'hr' },

        {
            type: 'h2',
            text: 'Part 16. 현실적으로는 하이브리드도 좋은 선택지가 될 수 있다',
        },

        {
            type: 'p',
            text: '3~5개의 프로젝트를 모두 AWS에 두거나 모두 자체 서버에 둘 필요도 없습니다.',
        },

        {
            type: 'p',
            text: '프로젝트의 중요도에 따라 나누는 방법도 있습니다.',
        },

        {
            type: 'code',
            language: 'text',
            text: `[자체 서버]

개발
테스트
Jenkins
PoC
내부 서비스


[AWS]

실제 운영 서비스
중요한 운영 DB
트래픽 변화가 큰 서비스`,
        },

        {
            type: 'p',
            text: '이렇게 하면 반복적으로 사용하는 개발·테스트 자원은 자체 서버에서 활용하고, 장애 대응과 확장성이 중요한 서비스는 AWS에 유지할 수 있습니다.',
        },

        {
            type: 'quote',
            text: '작업실은 자체 서버에 두고 실제 고객이 사용하는 매장은 AWS에 두는 방식으로 생각할 수 있다.',
        },

        { type: 'hr' },

        {
            type: 'h2',
            text: 'Part 17. 우리 팀이라면 먼저 세 가지 시나리오를 비교해볼 수 있다',
        },

        {
            type: 'p',
            text: '프로젝트가 3~5개 정도로 늘어날 예정이라면 바로 자체 서버를 구매하기보다 세 가지 시나리오를 먼저 비교해볼 수 있습니다.',
        },

        {
            type: 'code',
            language: 'text',
            text: `① AWS 유지 / 확장

3~5개 프로젝트를
AWS에서 계속 운영


② AWS 자원 통합

여러 프로젝트를
한두 개 EC2에 통합


③ 자체 서버 또는 하이브리드

일부 또는 전체 프로젝트를
자체 서버에서 운영`,
        },

        {
            type: 'p',
            text: '이 세 가지를 비교하려면 먼저 현재 AWS 비용과 자원 사용량을 확인해야 합니다.',
        },

        {
            type: 'list',
            items: [
                '현재 AWS 비용이 어디에서 발생하는지',
                '현재 CPU와 메모리를 얼마나 사용하고 있는지',
                '프로젝트 3~5개가 되었을 때 예상 자원 사용량',
                '각 프로젝트의 트래픽 특성',
                '각 프로젝트의 장애 허용 수준',
                '자체 서버를 관리할 수 있는 운영 여력',
            ],
        },

        {
            type: 'p',
            text: '이 정보를 알아야 AWS 유지, AWS 통합, 자체 서버, 하이브리드 중 어느 쪽이 적절한지 비교할 수 있습니다.',
        },

        { type: 'hr' },

        {
            type: 'h2',
            text: 'Part 18. 결국 비교해야 하는 것은 3~5개 프로젝트의 TCO다',
        },

        {
            type: 'p',
            text: '결국 비교해야 하는 것은 서버 한 대 가격이 아니라 **3~5개의 프로젝트를 몇 년 동안 운영할 때 드는 전체 비용**입니다.',
        },

        {
            type: 'code',
            language: 'text',
            text: `AWS

EC2
Storage
Database
Network
Load Balancer
기타 서비스

VS

자체 서버

서버 장비
전기
인터넷
네트워크
UPS
백업
부품 교체
장애 대응
관리 시간`,
        },

        {
            type: 'p',
            text: '이렇게 전체 기간 동안 발생하는 비용을 TCO(Total Cost of Ownership, 총소유비용)라고 합니다.',
        },

        {
            type: 'p',
            text: '예를 들어 프로젝트별로 AWS 서버를 따로 사용하면 비용이 빠르게 증가할 수 있지만, AWS 자원을 통합한다면 그보다 낮아질 수 있습니다.',
        },

        {
            type: 'p',
            text: '반대로 자체 서버는 초기 장비 비용은 크지만 3~5개의 프로젝트가 지속적으로 자원을 공유한다면 시간이 지날수록 비용 면에서 유리해질 가능성이 있습니다.',
        },

        {
            type: 'quote',
            text: '3~5개의 프로젝트를 운영할 때는 AWS 한 대와 자체 서버 한 대를 비교하는 것이 아니라, 각 방식을 실제로 구성했을 때의 전체 비용과 운영 위험을 비교해야 한다.',
        },

        { type: 'hr' },

        {
            type: 'h2',
            text: '마치며 — 3~5개의 프로젝트라면 이제 실제 비교를 해볼 시점이다',
        },

        {
            type: 'p',
            text: '프로젝트가 하나일 때는 AWS를 사용하는 것이 간단하고 편리할 수 있습니다.',
        },

        {
            type: 'p',
            text: '하지만 프로젝트가 3~5개 정도로 늘어날 예정이라면 비용과 자원 활용 측면에서 다른 선택지도 충분히 비교해볼 만합니다.',
        },

        {
            type: 'list',
            items: [
                '프로젝트별 AWS 서버를 사용하면 비용이 빠르게 증가할 수 있습니다.',
                '하지만 AWS에서도 여러 프로젝트를 하나의 서버에 통합할 수 있습니다.',
                '자체 서버는 여러 프로젝트가 자원을 공유할수록 비용 면에서 유리해질 수 있습니다.',
                '반면 한 서버 장애가 여러 프로젝트에 영향을 줄 수 있다는 위험이 있습니다.',
                '개발·테스트는 자체 서버, 중요한 운영 서비스는 AWS에 두는 하이브리드 방식도 가능합니다.',
                '결국 프로젝트 개수보다 각 프로젝트의 실제 자원 사용량과 장애 허용 수준이 중요합니다.',
            ],
        },

        {
            type: 'p',
            text: '그래서 현재 상황에서 바로 “AWS가 비싸다” 또는 “자체 서버가 더 싸다”라고 결론내리기보다는,',
        },

        {
            type: 'quote',
            text: '3~5개의 프로젝트를 AWS에서 운영했을 때의 비용, AWS 자원을 통합했을 때의 비용, 자체 서버를 구축했을 때의 TCO를 실제 숫자로 비교해보는 것이 다음 단계다.',
        },

        {
            type: 'p',
            text: '그 비교 결과에 따라 AWS 유지, AWS 자원 통합, 자체 서버 도입, 하이브리드 중 우리 팀에 가장 적합한 방법을 선택할 수 있습니다.',
        },
    ],
};