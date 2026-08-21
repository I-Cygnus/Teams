import type { BlogPost } from '../../data';

export const post08: BlogPost = {
    id: '8',
    package: 'min',
    title: '자체 서버를 샀다면 이제 무엇을 관리해야 할까?',
    excerpt:
        '자체 서버를 실제로 운영할 때 관리해야 하는 하드웨어, 전원, 네트워크, 디스크, 백업, 보안, 모니터링, 장애 복구 요소를 정리합니다.',
    category: 'Infrastructure',
    authorOverride: {
        name: 'min',
        role: 'Fullstack Developer',
        accent: '#6366F1',
    },
    publishedAt: '2026-08-20',
    readingMinutes: 12,
    cover: 'linear-gradient(135deg,#0F172A 0%,#1E40AF 50%,#0EA5E9 100%)',
    coverImage: '/blog/min/08/on-premise-server-operation.png',
    tags: [
        'On-Premise',
        'Server',
        'Infrastructure',
        'Docker',
        'Backup',
        'Monitoring',
        'Security',
    ],

    body: [
        {
            type: 'p',
            text: '이전 글에서는 **AWS를 계속 사용할 것인지, 자체 서버를 구축할 것인지**를 비교해보았습니다.',
        },
        {
            type: 'p',
            text: '프로젝트가 3~5개 정도이고 트래픽이 크지 않으며 사용량도 비교적 일정하다면 자체 서버는 충분히 현실적인 선택지가 될 수 있습니다.',
        },
        {
            type: 'p',
            text: '하지만 서버를 직접 구매하는 순간부터 새로운 문제가 시작됩니다.',
        },
        {
            type: 'quote',
            text: '서버를 사는 것과 서버를 운영하는 것은 전혀 다른 문제다.',
        },
        {
            type: 'p',
            text: 'AWS에서는 데이터센터, 물리 서버, 전력, 물리 네트워크 같은 기반 인프라를 AWS가 관리하지만 자체 서버에서는 이러한 영역까지 직접 관리해야 합니다.',
        },
        {
            type: 'p',
            text: '이번 글에서는 실제로 자체 서버를 구매하고 3~5개의 프로젝트를 운영한다고 가정했을 때 어떤 것들을 관리해야 하는지 살펴보겠습니다.',
        },

        { type: 'hr' },

        {
            type: 'h2',
            text: 'Part 1. 자체 서버는 설치가 끝이 아니라 운영의 시작이다',
        },

        {
            type: 'p',
            text: '처음 서버를 구축하면 Ubuntu Server를 설치하고 Docker와 nginx를 구성한 뒤 프로젝트를 올리는 것부터 시작할 수 있습니다.',
        },

        {
            type: 'code',
            language: 'text',
            text: `Physical Server

Ubuntu Server

Docker

├─ nginx
├─ Project A
├─ Project B
├─ Project C
├─ MySQL
└─ Jenkins`,
        },

        {
            type: 'p',
            text: '서비스가 정상적으로 접속되면 서버 구축이 끝난 것처럼 느껴질 수 있습니다.',
        },

        {
            type: 'p',
            text: '하지만 실제 운영에서는 그 이후부터 지속적으로 관리해야 할 요소들이 생깁니다.',
        },

        {
            type: 'code',
            language: 'text',
            text: `자체 서버 운영

├─ Hardware
├─ Power
├─ Network
├─ CPU / Memory
├─ Disk
├─ Docker
├─ Database
├─ Backup
├─ Security
├─ SSL
├─ Monitoring
├─ Deployment
└─ Recovery`,
        },

        {
            type: 'quote',
            text: '자체 서버는 한 번 설치하고 끝나는 장비가 아니라 지속적으로 관리해야 하는 시스템이다.',
        },

        { type: 'hr' },

        {
            type: 'h2',
            text: 'Part 2. 먼저 CPU와 메모리 사용량을 확인해야 한다',
        },

        {
            type: 'p',
            text: '하나의 물리 서버에 여러 프로젝트를 올리면 모든 프로젝트가 같은 CPU와 메모리를 공유합니다.',
        },

        {
            type: 'code',
            language: 'text',
            text: `RAM 64GB Server

├─ Project A
├─ Project B
├─ Project C
├─ Project D
└─ Project E`,
        },

        {
            type: 'p',
            text: '평소에는 문제가 없더라도 특정 프로젝트에서 메모리 누수나 과도한 CPU 사용이 발생할 수 있습니다.',
        },

        {
            type: 'code',
            language: 'text',
            text: `Project C Memory

2GB
 ↓
8GB
 ↓
20GB
 ↓
40GB`,
        },

        {
            type: 'p',
            text: 'Project C 하나의 문제 때문에 Project A, Project B, Database 등 같은 서버를 사용하는 다른 서비스까지 느려질 수 있습니다.',
        },

        {
            type: 'p',
            text: 'Docker를 사용하는 경우 프로젝트별 CPU와 Memory Limit을 설정하여 하나의 서비스가 서버 전체 자원을 독점하지 못하도록 구성할 수 있습니다.',
        },

        {
            type: 'code',
            language: 'text',
            text: `Project A → RAM 4GB

Project B → RAM 4GB

Project C → RAM 8GB`,
        },

        {
            type: 'quote',
            text: 'Docker Container로 서비스를 나눴다고 해서 물리 자원까지 자동으로 완전히 격리되는 것은 아니다.',
        },

        { type: 'hr' },

        {
            type: 'h2',
            text: 'Part 3. 운영하다 보면 Disk가 생각보다 빠르게 차오를 수 있다',
        },

        {
            type: 'p',
            text: '서버 운영에서는 CPU와 RAM만큼 Disk 사용량도 중요합니다.',
        },

        {
            type: 'p',
            text: '서버에는 애플리케이션 데이터 외에도 다양한 파일이 계속 쌓입니다.',
        },

        {
            type: 'code',
            language: 'text',
            text: `Disk에 쌓일 수 있는 데이터

Application Log
nginx Log
Docker Log
MySQL Log
Docker Image
Docker Build Cache
Jenkins Artifact
DB Backup
사용자 업로드 파일`,
        },

        {
            type: 'p',
            text: '처음에는 충분해 보였던 SSD도 운영 기간이 길어지면서 사용량이 계속 증가할 수 있습니다.',
        },

        {
            type: 'code',
            language: 'text',
            text: `Disk Usage

50%
 ↓
70%
 ↓
85%
 ↓
95%
 ↓
100%`,
        },

        {
            type: 'p',
            text: 'Disk가 100%가 되면 단순히 새로운 파일을 저장하지 못하는 것에서 끝나지 않을 수 있습니다.',
        },

        {
            type: 'list',
            items: [
                'Database Write 실패',
                'Application 오류',
                'Docker 동작 오류',
                'Log 기록 실패',
                '배포 실패',
            ],
        },

        {
            type: 'p',
            text: '따라서 로그 보존 기간과 Docker Image, Build Cache, Backup 파일 정리 정책을 미리 정해두는 것이 좋습니다.',
        },

        {
            type: 'code',
            language: 'text',
            text: `Disk Monitoring 예시

70% → 정상

80% → 확인

90% → Alert

95% → 즉시 대응`,
        },

        {
            type: 'quote',
            text: 'Disk는 부족해진 다음 정리하는 것이 아니라 부족해지기 전에 관리해야 한다.',
        },

        { type: 'hr' },

        {
            type: 'h2',
            text: 'Part 4. 서버 자체가 고장날 수도 있다',
        },

        {
            type: 'p',
            text: '자체 서버는 결국 물리 장비이기 때문에 부품 고장을 피할 수 없습니다.',
        },

        {
            type: 'code',
            language: 'text',
            text: `Hardware 장애 가능 요소

SSD / HDD
RAM
Power Supply
Main Board
Cooling Fan
Network Interface`,
        },

        {
            type: 'p',
            text: '특히 여러 프로젝트를 서버 한 대에 통합한 경우 서버 장애의 영향 범위도 함께 커집니다.',
        },

        {
            type: 'code',
            language: 'text',
            text: `Physical Server 장애

        ↓

Project A 장애
Project B 장애
Project C 장애
Project D 장애
Project E 장애`,
        },

        {
            type: 'p',
            text: '그래서 서버를 운영할 때는 고장을 완전히 막으려고 하기보다 고장이 발생했을 때 어떻게 대응하고 복구할 것인지를 미리 생각하는 것이 중요합니다.',
        },

        {
            type: 'quote',
            text: '장애가 발생하지 않는 서버를 만드는 것보다 장애가 발생했을 때 복구할 수 있는 구조를 만드는 것이 현실적이다.',
        },

        { type: 'hr' },

        {
            type: 'h2',
            text: 'Part 5. 기업용 서버에는 장애 대응을 위한 기능들이 있다',
        },

        {
            type: 'p',
            text: '중요한 운영 서비스를 자체 서버에서 운영한다면 기업용 서버에서 제공하는 여러 기능을 고려할 수 있습니다.',
        },

        {
            type: 'code',
            language: 'text',
            text: `기업용 Server에서 고려할 수 있는 요소

ECC Memory
RAID
Hot Swap Disk
이중화 Power Supply
원격 관리
제조사 유지보수`,
        },

        {
            type: 'p',
            text: '**ECC Memory**는 메모리에서 발생하는 일부 오류를 감지하고 수정할 수 있도록 설계된 메모리입니다.',
        },

        {
            type: 'p',
            text: '**RAID**는 여러 디스크를 하나의 논리적인 저장공간처럼 구성하여 성능이나 장애 대응 능력을 높이는 방식입니다.',
        },

        {
            type: 'code',
            language: 'text',
            text: `RAID 1 예시

Disk A
   ↕
Disk B

동일한 데이터 저장`,
        },

        {
            type: 'p',
            text: '한 디스크가 고장나더라도 다른 디스크를 이용해 서비스를 계속 운영할 수 있습니다.',
        },

        {
            type: 'quote',
            text: 'RAID는 디스크 장애에 대비하는 방법이지 Backup을 대신하는 기술은 아니다.',
        },

        {
            type: 'p',
            text: '**Hot Swap**을 지원한다면 서버를 완전히 종료하지 않고도 일부 디스크를 교체할 수 있습니다.',
        },

        {
            type: 'p',
            text: '**이중화 Power Supply**를 사용하면 하나의 전원 공급 장치가 고장나더라도 다른 전원을 이용해 서버를 계속 운영할 수 있습니다.',
        },

        {
            type: 'p',
            text: '다만 이러한 기능이 모든 서버에 반드시 필요한 것은 아닙니다. 개발·테스트 서버인지 실제 고객이 사용하는 중요 운영 서버인지에 따라 필요한 수준을 결정하면 됩니다.',
        },

        { type: 'hr' },

        {
            type: 'h2',
            text: 'Part 6. 정전도 서버 장애가 될 수 있다',
        },

        {
            type: 'p',
            text: '클라우드에서는 데이터센터의 전력을 크게 신경 쓰지 않지만 회사에 자체 서버를 설치하면 회사 전기도 인프라의 일부가 됩니다.',
        },

        {
            type: 'code',
            language: 'text',
            text: `정전

↓

Server 강제 종료

↓

Application 작업 중단

↓

Database 작업 중단`,
        },

        {
            type: 'p',
            text: '특히 Database가 데이터를 기록하던 순간 갑작스럽게 서버가 종료되면 데이터 손상 위험도 고려해야 합니다.',
        },

        {
            type: 'p',
            text: '이런 상황에 대비하기 위해 UPS를 사용할 수 있습니다.',
        },

        {
            type: 'code',
            language: 'text',
            text: `정전 발생

↓

UPS가 임시 전력 공급

↓

Application 정상 종료

↓

Database 정상 종료

↓

OS Shutdown`,
        },

        {
            type: 'p',
            text: 'UPS는 반드시 몇 시간 동안 서비스를 계속 운영하기 위한 장비라고 생각할 필요는 없습니다.',
        },

        {
            type: 'quote',
            text: 'UPS는 정전이 발생했을 때 서버를 안전하게 종료할 시간을 확보하는 역할을 할 수 있다.',
        },

        {
            type: 'p',
            text: '서버뿐 아니라 Router, Switch 같은 네트워크 장비에도 전원이 필요하므로 함께 고려할 필요가 있습니다.',
        },

        { type: 'hr' },

        {
            type: 'h2',
            text: 'Part 7. 인터넷 회선이 끊기면 서버가 정상이어도 장애다',
        },

        {
            type: 'p',
            text: '자체 서버를 회사에 설치했다면 회사 인터넷 회선 역시 서비스 인프라에 포함됩니다.',
        },

        {
            type: 'code',
            language: 'text',
            text: `Server 정상

Docker 정상

Database 정상

        ↓

Internet 회선 장애

        ↓

외부 사용자 접속 불가`,
        },

        {
            type: 'p',
            text: '서버 자체에는 아무 문제가 없어도 사용자 입장에서는 서비스가 중단된 것입니다.',
        },

        {
            type: 'p',
            text: '따라서 다음과 같은 네트워크 요소도 관리해야 합니다.',
        },

        {
            type: 'list',
            items: [
                '인터넷 회선',
                '고정 공인 IP',
                'Router',
                'Switch',
                'Firewall',
                'DNS',
                'Port Forwarding',
            ],
        },

        {
            type: 'p',
            text: '서비스 중단 허용 시간이 짧다면 인터넷 회선을 두 개 사용하는 이중 회선 구성까지 고려할 수 있습니다.',
        },

        { type: 'hr' },

        {
            type: 'h2',
            text: 'Part 8. Application보다 Database 장애가 더 어려울 수 있다',
        },

        {
            type: 'p',
            text: '웹 애플리케이션은 프로세스나 Container가 종료되어도 다시 실행하면 복구되는 경우가 많습니다.',
        },

        {
            type: 'code',
            language: 'text',
            text: `Spring Boot Down

↓

Container Restart

↓

Application 복구`,
        },

        {
            type: 'p',
            text: '하지만 Database 장애는 단순히 다시 실행하는 문제로 끝나지 않을 수 있습니다.',
        },

        {
            type: 'code',
            language: 'text',
            text: `MySQL 장애

↓

데이터는 정상한가?

↓

마지막 Backup은 언제인가?

↓

Backup 이후의 데이터는?

↓

실제로 Restore 가능한가?`,
        },

        {
            type: 'p',
            text: '따라서 Database를 운영한다면 별도의 운영 정책이 필요합니다.',
        },

        {
            type: 'list',
            items: [
                'Backup 주기',
                'Backup 보존 기간',
                'Backup 저장 위치',
                'Database Data 저장 위치',
                'Restore 방법',
                '장애 발생 시 담당자',
            ],
        },

        {
            type: 'quote',
            text: 'Application을 다시 띄우는 것보다 데이터를 잃지 않는 것이 훨씬 중요할 수 있다.',
        },

        { type: 'hr' },

        {
            type: 'h2',
            text: 'Part 9. Backup 파일이 있다고 해서 안전한 것은 아니다',
        },

        {
            type: 'p',
            text: '매일 Database Backup을 하고 있다고 가정해보겠습니다.',
        },

        {
            type: 'code',
            language: 'text',
            text: `매일 03:00

MySQL

↓

Backup

↓

/backup/database.sql`,
        },

        {
            type: 'p',
            text: '문제는 Backup 파일을 운영 데이터와 같은 Disk에 저장하는 경우입니다.',
        },

        {
            type: 'code',
            language: 'text',
            text: `Server SSD

├─ Application
├─ MySQL
└─ Backup`,
        },

        {
            type: 'p',
            text: 'SSD 자체가 고장나면 운영 데이터와 Backup이 동시에 사라질 수 있습니다.',
        },

        {
            type: 'p',
            text: '따라서 Backup 데이터는 운영 Server와 물리적으로 분리하는 것이 좋습니다.',
        },

        {
            type: 'code',
            language: 'text',
            text: `Production Server
       │
       ├── Local Backup
       │
       ├── NAS
       │
       └── External Storage`,
        },

        {
            type: 'p',
            text: '중요한 데이터만 Cloud Storage 등에 추가로 Backup하는 하이브리드 방식도 생각할 수 있습니다.',
        },

        { type: 'hr' },

        {
            type: 'h2',
            text: 'Part 10. Backup보다 중요한 것은 Restore다',
        },

        {
            type: 'p',
            text: 'Backup 작업이 성공했다고 표시되더라도 실제로 복원이 되는지는 별개의 문제입니다.',
        },

        {
            type: 'code',
            language: 'text',
            text: `Backup 성공

≠

Restore 성공`,
        },

        {
            type: 'p',
            text: 'Backup 파일이 손상되었거나 설정이 빠졌거나 복원 절차를 아무도 모른다면 실제 장애 발생 시 Backup을 제대로 활용하지 못할 수 있습니다.',
        },

        {
            type: 'p',
            text: '따라서 테스트 환경에서 실제 Restore를 해보는 것이 중요합니다.',
        },

        {
            type: 'code',
            language: 'text',
            text: `DB Backup
   ↓
Test Server
   ↓
Restore
   ↓
Application 연결
   ↓
데이터 확인`,
        },

        {
            type: 'quote',
            text: 'Backup의 목적은 파일을 만드는 것이 아니라 서비스를 복구하는 것이다.',
        },

        { type: 'hr' },

        {
            type: 'h2',
            text: 'Part 11. Docker를 사용해도 관리할 것은 남아 있다',
        },

        {
            type: 'p',
            text: 'Docker를 사용하면 여러 프로젝트의 실행 환경을 나눠 관리하기 편리합니다.',
        },

        {
            type: 'code',
            language: 'text',
            text: `Docker

├─ Project A
├─ Project B
├─ Project C
├─ nginx
└─ MySQL`,
        },

        {
            type: 'p',
            text: '하지만 Docker를 사용한다고 서버 운영이 자동으로 이루어지는 것은 아닙니다.',
        },

        {
            type: 'list',
            items: [
                'Container 상태',
                'Docker Image',
                'Docker Volume',
                'Docker Network',
                'Container Log',
                'Restart Policy',
                'CPU / Memory 사용량',
            ],
        },

        {
            type: 'p',
            text: '프로젝트마다 Docker Compose 파일을 구분해두면 배포와 장애 대응 범위를 관리하기 쉬워집니다.',
        },

        {
            type: 'code',
            language: 'text',
            text: `/services

├─ project-a
│   └─ docker-compose.yml
│
├─ project-b
│   └─ docker-compose.yml
│
├─ project-c
│   └─ docker-compose.yml
│
└─ nginx`,
        },

        {
            type: 'p',
            text: '오래된 Image와 Build Cache, Container Log 역시 시간이 지날수록 Disk 용량을 차지할 수 있으므로 함께 관리해야 합니다.',
        },

        { type: 'hr' },

        {
            type: 'h2',
            text: 'Part 12. OS와 Software도 계속 업데이트해야 한다',
        },

        {
            type: 'p',
            text: '서버 구축 당시 설치한 Software를 계속 그대로 사용할 수 있는 것은 아닙니다.',
        },

        {
            type: 'code',
            language: 'text',
            text: `관리할 수 있는 Software

Ubuntu
Docker
nginx
OpenSSH
Java
MySQL`,
        },

        {
            type: 'p',
            text: '버그 수정이나 보안 취약점 대응을 위한 Update가 지속적으로 제공됩니다.',
        },

        {
            type: 'code',
            language: 'text',
            text: `Security Update 발생

↓

업데이트 적용

↓

서비스 영향 확인

↓

Reboot 필요 여부

↓

유지보수 시간 결정`,
        },

        {
            type: 'p',
            text: '따라서 자체 서버에서는 패치를 언제 적용하고 언제 서버를 재부팅할 것인지도 운영 정책이 됩니다.',
        },

        { type: 'hr' },

        {
            type: 'h2',
            text: 'Part 13. 외부에 공개하는 순간 Security도 직접 관리해야 한다',
        },

        {
            type: 'p',
            text: '서비스를 인터넷에 공개하면 서버 역시 외부에서 접근 가능한 대상이 됩니다.',
        },

        {
            type: 'p',
            text: '웹서비스에서 실제로 외부에 공개해야 하는 Port와 내부에서만 사용할 Port를 구분해야 합니다.',
        },

        {
            type: 'code',
            language: 'text',
            text: `Internet
   │
   ▼
Firewall
   │
   ├─ 80 HTTP
   └─ 443 HTTPS
       │
       ▼
     nginx
       │
       ▼
 Application
       │
       ▼
   Database

Database → 외부 직접 접근 X`,
        },

        {
            type: 'p',
            text: 'SSH 역시 서버 관리용으로 사용되기 때문에 별도의 보안 설정이 필요합니다.',
        },

        {
            type: 'list',
            items: [
                'Root Login 제한',
                'Password Login 제한',
                'SSH Key 사용',
                '접근 가능한 IP 제한',
                'Firewall 설정',
                '계정과 권한 관리',
            ],
        },

        {
            type: 'quote',
            text: '자체 서버 운영은 어떤 서비스에 누가 접근할 수 있는지를 직접 관리하는 일이기도 하다.',
        },

        { type: 'hr' },

        {
            type: 'h2',
            text: 'Part 14. SSL 인증서도 관리 대상이다',
        },

        {
            type: 'p',
            text: '웹서비스를 HTTPS로 제공한다면 SSL/TLS 인증서를 관리해야 합니다.',
        },

        {
            type: 'p',
            text: 'Let’s Encrypt와 Certbot 등을 사용하면 인증서를 자동 갱신할 수 있지만 자동 갱신 역시 실패할 수 있습니다.',
        },

        {
            type: 'code',
            language: 'text',
            text: `SSL Certificate

↓

자동 갱신 실패

↓

아무도 발견하지 못함

↓

Certificate 만료

↓

Browser Security Warning`,
        },

        {
            type: 'p',
            text: '따라서 인증서 만료일이나 갱신 실패 여부도 Monitoring 대상에 포함하는 것이 좋습니다.',
        },

        { type: 'hr' },

        {
            type: 'h2',
            text: 'Part 15. Monitoring이 없으면 사용자가 장애를 먼저 발견할 수 있다',
        },

        {
            type: 'p',
            text: '서버 운영에서 피하고 싶은 상황 중 하나는 사용자의 연락을 받고 나서야 서비스 장애를 알아차리는 것입니다.',
        },

        {
            type: 'quote',
            text: '사이트가 안 되는데요?',
        },

        {
            type: 'p',
            text: '최소한 Server, Docker, Application, Database의 주요 상태는 확인할 수 있는 것이 좋습니다.',
        },

        {
            type: 'code',
            language: 'text',
            text: `Server

CPU
Memory
Disk
Network
Temperature

↓

Docker

Container Status
Restart Count
CPU / Memory

↓

Application

HTTP Status
Response Time

↓

Database

Connection
Backup Status`,
        },

        {
            type: 'p',
            text: '처음부터 복잡한 Monitoring 시스템을 구축할 필요는 없습니다.',
        },

        {
            type: 'code',
            language: 'text',
            text: `초기 Monitoring 예시

CPU 90% 이상 → Alert

Memory 90% 이상 → Alert

Disk 80~90% 이상 → Alert

HTTP 요청 실패 → Alert

DB Backup 실패 → Alert`,
        },

        {
            type: 'p',
            text: '필요하다면 이후 Prometheus, Grafana 등의 Monitoring 환경을 추가할 수 있습니다.',
        },

        {
            type: 'quote',
            text: '장애가 발생하지 않게 만드는 것만큼 장애를 빠르게 발견하는 것도 중요하다.',
        },

        { type: 'hr' },

        {
            type: 'h2',
            text: 'Part 16. 여러 프로젝트를 운영하면 배포도 관리 대상이 된다',
        },

        {
            type: 'p',
            text: '하나의 서버에서 여러 프로젝트를 운영할 경우 잘못된 배포가 다른 서비스까지 영향을 줄 수 있습니다.',
        },

        {
            type: 'code',
            language: 'text',
            text: `Project A 배포

↓

nginx 설정 오류

↓

nginx Down

↓

Project A 장애
Project B 장애
Project C 장애`,
        },

        {
            type: 'p',
            text: '특히 여러 프로젝트가 하나의 nginx나 Database를 공유한다면 공통 인프라 변경에 더욱 주의해야 합니다.',
        },

        {
            type: 'p',
            text: '따라서 다음과 같은 운영 기준을 정해두는 것이 좋습니다.',
        },

        {
            type: 'list',
            items: [
                '누가 배포할 수 있는지',
                '배포 절차',
                '배포 전 확인 방법',
                'Rollback 방법',
                'Config 관리',
                'Environment Variable 관리',
            ],
        },

        {
            type: 'quote',
            text: '배포 과정 역시 특정 담당자의 기억에 의존하지 않도록 만드는 것이 중요하다.',
        },

        { type: 'hr' },

        {
            type: 'h2',
            text: 'Part 17. 서버가 완전히 사라졌을 때 다시 만들 수 있어야 한다',
        },

        {
            type: 'p',
            text: '자체 서버 운영에서 한 번쯤 해볼 만한 질문이 있습니다.',
        },

        {
            type: 'quote',
            text: '지금 이 서버가 완전히 고장난다면 새로운 서버에 서비스를 다시 만들 수 있을까?',
        },

        {
            type: 'p',
            text: '서버 설정이 특정 담당자의 기억에만 남아 있다면 실제 복구 과정은 매우 어려워질 수 있습니다.',
        },

        {
            type: 'code',
            language: 'text',
            text: `Server 완전 장애

↓

새 Server 준비

↓

Ubuntu 설치

↓

nginx 설정은?

↓

Environment Variable은?

↓

Database 계정은?

↓

Docker 설정은?

↓

SSL 설정은?`,
        },

        {
            type: 'p',
            text: '반대로 서버 설정을 코드와 문서로 관리한다면 복구 과정이 훨씬 단순해집니다.',
        },

        {
            type: 'code',
            language: 'text',
            text: `Git Repository
Docker Compose
nginx Config
Environment Variable 관리
DB Backup
Server Setup Document

        ↓

새 Server

        ↓

Ubuntu / Docker

        ↓

Git Clone

        ↓

Docker Compose

        ↓

DB Restore

        ↓

서비스 복구`,
        },

        {
            type: 'quote',
            text: '현재 서버를 잘 유지하는 것만큼 현재 서버를 다시 만들 수 있도록 준비하는 것도 중요하다.',
        },

        { type: 'hr' },

        {
            type: 'h2',
            text: 'Part 18. 결국 가장 중요한 것은 누가 서버를 관리할 것인가다',
        },

        {
            type: 'p',
            text: '자체 서버를 운영하다 보면 기술적인 문제만큼 운영 담당자 문제도 중요해집니다.',
        },

        {
            type: 'code',
            language: 'text',
            text: `CPU 100%

누가 확인하지?


Disk 95%

누가 정리하지?


DB Backup 실패

누가 대응하지?


SSL 만료

누가 확인하지?


Security Update

누가 적용하지?


Server Hardware 장애

누가 대응하지?`,
        },

        {
            type: 'p',
            text: '따라서 서버 장비를 구매할 때 Server 사양만 결정할 것이 아니라 실제 운영 역할도 함께 정해두는 것이 좋습니다.',
        },

        {
            type: 'list',
            items: [
                'Server 운영 담당',
                'Deployment 담당',
                'Backup 확인 담당',
                'Security Update 담당',
                '장애 연락 체계',
                'Server 운영 문서',
            ],
        },

        {
            type: 'p',
            text: '특히 특정 한 사람만 모든 서버 설정을 알고 있는 구조는 피하는 것이 좋습니다.',
        },

        {
            type: 'quote',
            text: '서버 운영 지식 역시 특정 개인에게만 존재하지 않도록 문서화해야 한다.',
        },

        { type: 'hr' },

        {
            type: 'h2',
            text: 'Part 19. 3~5개 프로젝트라면 이런 구조를 생각해볼 수 있다',
        },

        {
            type: 'p',
            text: '3~5개 정도의 소규모 프로젝트를 하나의 자체 서버에서 운영한다고 가정하면 다음과 같은 구조를 생각할 수 있습니다.',
        },

        {
            type: 'code',
            language: 'text',
            text: `Internet
   │
   ▼
Router / Firewall
   │
   ▼
┌────────────────────────────┐
│      Physical Server       │
│                            │
│ Ubuntu Server              │
│                            │
│ Docker                     │
│ ├─ nginx                   │
│ ├─ Project A               │
│ ├─ Project B               │
│ ├─ Project C               │
│ ├─ Project D               │
│ ├─ Project E               │
│ ├─ MySQL                   │
│ ├─ Jenkins                 │
│ └─ Monitoring              │
│                            │
└────────────────────────────┘
            │
            ├── NAS
            │
            └── External Backup


UPS
 │
 ├─ Server
 └─ Network Equipment`,
        },

        {
            type: 'p',
            text: '물론 모든 서비스를 반드시 하나의 서버에 구성해야 한다는 의미는 아닙니다.',
        },

        {
            type: 'p',
            text: '서비스 중요도와 트래픽, 장애 허용 수준에 따라 Database나 중요 서비스를 별도로 분리할 수도 있습니다.',
        },

        { type: 'hr' },

        {
            type: 'h2',
            text: 'Part 20. 처음부터 모든 것을 구축할 필요는 없다',
        },

        {
            type: 'p',
            text: '자체 서버를 처음 운영한다면 처음부터 대규모 기업 수준의 인프라를 구축할 필요는 없습니다.',
        },

        {
            type: 'p',
            text: '우선 필요한 것부터 단계적으로 구성할 수 있습니다.',
        },

        {
            type: 'code',
            language: 'text',
            text: `1단계

Physical Server
Ubuntu
Docker

↓

2단계

Project별
Docker Compose

↓

3단계

nginx
Domain
HTTPS

↓

4단계

Firewall
SSH Security

↓

5단계

Database Backup

↓

6단계

NAS / External Backup

↓

7단계

UPS

↓

8단계

CPU / RAM / Disk
Monitoring

↓

9단계

Log Rotation

↓

10단계

Server Recovery Document

↓

11단계

실제 Restore Test`,
        },

        {
            type: 'p',
            text: '서비스가 성장하고 중요도가 높아진다면 이후 RAID, 서버 이중화, 네트워크 이중화 등을 단계적으로 검토할 수 있습니다.',
        },

        { type: 'hr' },

        {
            type: 'h2',
            text: 'Part 21. 실제 운영에서 먼저 마주칠 가능성이 높은 문제는 무엇일까?',
        },

        {
            type: 'p',
            text: '자체 서버를 운영한다고 해서 처음부터 물리 서버가 고장나는 상황만 걱정할 필요는 없습니다.',
        },

        {
            type: 'p',
            text: '오히려 일상적인 운영 과정에서는 작은 관리 문제들이 먼저 발생할 가능성이 높습니다.',
        },

        {
            type: 'code',
            language: 'text',
            text: `초기에 마주칠 수 있는 문제

① Log / Docker Image 증가
       ↓
   Disk 부족

② Application 오류
       ↓
   CPU / Memory 과다 사용

③ Container Down
       ↓
   서비스 장애

④ Backup Script 실패
       ↓
   실제 Backup 없음

⑤ SSL 자동 갱신 실패
       ↓
   인증서 만료

⑥ OS Update 방치
       ↓
   보안 취약점 누적

⑦ 담당자 한 명에게 지식 집중
       ↓
   담당자 부재 시 대응 어려움`,
        },

        {
            type: 'quote',
            text: '자체 서버에서는 큰 장애뿐 아니라 작지만 반복적으로 발생하는 운영 문제를 관리하는 것이 중요하다.',
        },

        { type: 'hr' },

        {
            type: 'h2',
            text: 'Part 22. 자체 서버를 샀다고 AWS를 완전히 없앨 필요는 없다',
        },

        {
            type: 'p',
            text: '자체 서버를 구매하더라도 모든 시스템을 반드시 자체 서버로 이전해야 하는 것은 아닙니다.',
        },

        {
            type: 'p',
            text: '서비스의 중요도에 따라 AWS와 자체 서버를 함께 사용하는 하이브리드 구성도 가능합니다.',
        },

        {
            type: 'code',
            language: 'text',
            text: `[자체 Server]

Development
Test
Jenkins
PoC
Internal Service
트래픽이 일정한 서비스


[AWS]

중요한 운영 Service
중요한 Database
Traffic 변화가 큰 서비스`,
        },

        {
            type: 'p',
            text: '또한 운영 서비스는 자체 서버에 두더라도 Backup만 Cloud Storage에 보관하는 방식도 생각할 수 있습니다.',
        },

        {
            type: 'code',
            language: 'text',
            text: `On-Premise Server
       │
       ├── NAS Backup
       │
       └── Cloud Backup`,
        },

        {
            type: 'quote',
            text: '자체 서버와 Cloud는 반드시 둘 중 하나만 선택해야 하는 관계는 아니다.',
        },

        { type: 'hr' },

        {
            type: 'h2',
            text: 'Part 23. 결국 비용뿐 아니라 운영 Risk도 계산해야 한다',
        },

        {
            type: 'p',
            text: '자체 서버와 AWS를 비교할 때 서버 가격과 월 사용료만 비교해서는 부족합니다.',
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
기타 Cloud Service


VS


자체 Server

Server 장비
Electricity
Internet
UPS
Network
Backup
Disk 교체
Hardware 장애
Monitoring
관리 시간
장애 대응`,
        },

        {
            type: 'p',
            text: '자체 서버는 장기간 사용할수록 비용 측면에서 유리해질 수 있지만 그 대신 운영 업무와 장애 Risk를 직접 부담하게 됩니다.',
        },

        {
            type: 'quote',
            text: '자체 서버 도입은 Cloud 비용을 Hardware 비용으로 바꾸는 것만이 아니라 일부 운영 책임까지 함께 가져오는 선택이다.',
        },

        { type: 'hr' },

        {
            type: 'h2',
            text: 'Part 24. 서버를 구매하기 전에 확인할 것',
        },

        {
            type: 'p',
            text: '자체 서버 구매를 결정했다면 서버 사양뿐 아니라 실제 운영에 필요한 요소를 함께 확인하는 것이 좋습니다.',
        },

        {
            type: 'list',
            items: [
                'CPU / RAM / SSD 사양',
                'ECC Memory 필요 여부',
                'RAID 필요 여부',
                'Hot Swap 필요 여부',
                '이중화 Power 필요 여부',
                'UPS',
                '인터넷 회선',
                '고정 공인 IP',
                'Firewall',
                'Ubuntu Version',
                'Docker / Docker Compose',
                'nginx',
                'DB Backup 정책',
                'NAS 또는 외부 Backup',
                'Log Rotation',
                'CPU / RAM / Disk Monitoring',
                'SSL Certificate 관리',
                'Deployment / Rollback 방법',
                'Server 운영 담당자',
                '장애 대응 절차',
                'Server Recovery 문서',
            ],
        },

        { type: 'hr' },

        {
            type: 'h2',
            text: '마치며 — 자체 서버 운영의 핵심은 장애를 복구할 수 있는 구조다',
        },

        {
            type: 'p',
            text: '자체 서버를 구매하면 여러 프로젝트가 하나의 장비 자원을 공유하면서 비용을 효율적으로 사용할 수 있습니다.',
        },

        {
            type: 'p',
            text: '하지만 자체 서버를 도입하는 순간 Hardware, Power, Network, Backup, Security, Monitoring과 같은 영역이 새로운 관리 대상이 됩니다.',
        },

        {
            type: 'code',
            language: 'text',
            text: `AWS에서 줄어들던 관리 영역

Physical Server
Power
Data Center
Physical Network


        ↓


On-Premise에서는

Hardware
Power
Network
OS
Docker
Database
Backup
Security
Monitoring
Recovery

직접 관리`,
        },

        {
            type: 'p',
            text: '따라서 서버를 구매할 때 CPU와 RAM만 결정해서는 충분하지 않습니다.',
        },

        {
            type: 'list',
            items: [
                '서버가 죽으면 어떻게 복구할 것인가?',
                '데이터가 사라지면 어디에서 복원할 것인가?',
                'Disk가 가득 차기 전에 어떻게 알 것인가?',
                '정전이나 인터넷 장애가 발생하면 어떻게 대응할 것인가?',
                'Security Update와 SSL Certificate는 누가 관리할 것인가?',
                '장애가 발생했을 때 누가 확인하고 대응할 것인가?',
            ],
        },

        {
            type: 'quote',
            text: '자체 서버 운영의 핵심은 장애가 발생하지 않게 만드는 것이 아니라 장애를 빠르게 발견하고 복구할 수 있는 구조를 만드는 것이다.',
        },

        {
            type: 'p',
            text: '결국 서버를 구매하는 순간 인프라 구축이 끝나는 것이 아니라 **Monitoring → Backup → Security → 장애 대응 → Recovery → 운영 문서화**라는 실제 서버 운영이 시작됩니다.',
        },
    ],
};