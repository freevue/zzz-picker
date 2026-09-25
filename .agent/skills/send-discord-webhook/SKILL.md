---
name: send-discord-webhook
description: 지정된 디스코드 웹훅으로 정형화된 3대 블록 규격 메시지(무결성 동기화 브리핑, 단순 텍스트, 작업 실패 알림)를 검증 후 전송합니다. 디스코드 알림 발송, 무결성 검사 후 브리핑, 시스템 작업 실패 알림 시 사용합니다.
---

# 디스코드 웹훅 발송 스킬 (`send-discord-webhook`)

지정된 디스코드 웹훅 채널로 **사전 정의된 3대 블록 규격에 맞는 정형화된 메시지**를 안전하게 검증하여 전송하는 스킬입니다.  
임의의 비정형 메시지 남발을 방지하기 위해 **개별 규격 문서로 정의된 3종의 블록 타입만 전송이 허용**되며, 필수 필드가 누락된 경우 전송이 사전 차단됩니다.

---

## 1. 기본 설정 및 웹훅 대상

- **기본 웹훅 URL**:
  `https://discord.com/api/webhooks/1546091379917324349/wrIbtqEh1UapcimcL3SKeNYYFV_DV2wZvvTMFW-zcwQMYxXLEgO88bPlMuyu8XTvNo-x`
- **프로필**: `username: "페어리"`, 아바타는 페어리 프로필 이미지로 자동 주입됩니다.
- **환경 변수 오버라이드 (선택)**: `DISCORD_WEBHOOK_URL` 환경 변수가 설정되어 있으면 해당 URL을 우선 사용합니다. `--webhook <URL>` 플래그로 일회성 변경도 가능합니다.

---

## 2. 지원 블록 규격 목록 (3종)

각 블록은 `references/blocks/` 디렉터리에 개별 규격 문서로 관리되며, 정의된 필드 스펙을 엄격히 준수해야 합니다.

| 블록 타입 (`type`) | 규격 문서 링크 | 용도 | 주요 필수 필드 |
| :--- | :--- | :--- | :--- |
| **`match-integrity`** | [match-integrity.md](./references/blocks/match-integrity.md) | `sync-match-integrity` 사후 브리핑 | `promotedCount`, `hiddenCount`, `officialCount`, `activeCount`, `totalCount` |
| **`simple-text`** | [simple-text.md](./references/blocks/simple-text.md) | 일반 텍스트 알림/공지 | `content` |
| **`system-failure`** | [system-failure.md](./references/blocks/system-failure.md) | 시스템 작업 실패 알림 (어떤 작업을 실패했는지 명시) | `taskName`, `errorMessage` |

---

## 3. 실행 워크플로우

### 실행 명령어

프로젝트 루트에서 실행합니다 (Node.js v24 네이티브 또는 tsx 모두 지원):

```bash
# Node.js v24+ 내장 네이티브 실행 (권장, 의존성 불필요)
node --experimental-strip-types .agent/skills/send-discord-webhook/scripts/send.ts \
  --type <block-type> \
  --data '<json-string>'

# 또는 tsx 이용 시
npx tsx .agent/skills/send-discord-webhook/scripts/send.ts \
  --type <block-type> \
  --data '<json-string>'
```

---

### 블록별 실행 예시

#### 1) 경기 무결성 동기화 브리핑 (`match-integrity`)
`sync-match-integrity` 작업 직후 집계된 수치를 전달합니다.

```bash
node --experimental-strip-types .agent/skills/send-discord-webhook/scripts/send.ts \
  --type match-integrity \
  --data '{
    "promotedCount": 3,
    "hiddenCount": 12,
    "officialCount": 142,
    "activeCount": 4,
    "totalCount": 231,
    "executionMode": "manual"
  }'
```

#### 2) 단순 텍스트 발송 (`simple-text`)

```bash
node --experimental-strip-types .agent/skills/send-discord-webhook/scripts/send.ts \
  --type simple-text \
  --data '{"content": "시스템 정기 점검이 정상 완료되었습니다.", "prefix": "[점검 완료]"}'
```

#### 3) 시스템 작업 실패 알림 (`system-failure`)
백그라운드 동기화, R2 업로드 등 특정 작업이 실패했을 때 **실패한 작업명**과 원인을 명시해 보고합니다.

```bash
node --experimental-strip-types .agent/skills/send-discord-webhook/scripts/send.ts \
  --type system-failure \
  --data '{
    "taskName": "경기 데이터 무결성 동기화 (sync-match-integrity)",
    "stage": "2-Pass 트랜잭션 실행 단계",
    "errorMessage": "PostgreSQL 외래 키 제약 조건 위반으로 동기화 쿼리가 롤백되었습니다.",
    "retryCount": 3,
    "errorDetail": "error: update or delete on table \"match\" violates foreign key constraint"
  }'
```

---

## 4. 제약 및 안전 수칙

1. **지정된 3종 규격 외 블록 전송 불가**: `match-integrity`, `simple-text`, `system-failure` 외의 블록 타입을 지정하면 스크립트가 즉시 종료(`exit 1`)됩니다.
2. **필수 필드 누락 차단**: 각 블록의 스펙에 지정된 필수 필드(예: `taskName`, `errorMessage`)가 누락되면 네트워크 요청 전 클라이언트 단에서 사전 차단됩니다.
3. **토큰 불필요**: 봇 토큰이나 별도 로그인 없이, 웹훅 URL 하나만으로 안전하게 동작합니다.
