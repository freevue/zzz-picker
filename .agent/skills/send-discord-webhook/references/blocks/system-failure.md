# 블록 규격: `system-failure` (시스템 작업 실패 알림)

데이터 동기화, R2 업로드, 배치 처리 등 시스템 백그라운드 작업이 실패했을 때 **어떤 작업을 실패했는지와 그 원인을 명확하게 디스코드에 알리는 전용 실패 블록**입니다.

---

## 1. 블록 메타데이터

- **블록 타입 식별자**: `system-failure`
- **임베드 색상**: `15158332` (선명한 레드, `#E74C3C`)
- **기본 제목**: `🚨 [작업 실패] {taskName}`
- **프로필**: `username: "페어리"`, `avatar_url: "https://images.zzz.freevue.dev/agents/profile/fairy.webp"`

---

## 2. 입력 데이터 스키마 (TypeScript)

```typescript
export interface SystemFailureBlockData {
  /** 실패한 작업/태스크명 (필수, 예: "경기 데이터 무결성 동기화", "R2 이미지 업로드") */
  taskName: string;

  /** 실패 원인 및 에러 요약 메시지 (필수) */
  errorMessage: string;

  /** 실패 발생 단계/컨텍스트 (선택, 예: "2-Pass 트랜잭션 실행 중", "Cloudflare API 호출 중") */
  stage?: string;

  /** 상세 오류 로그 또는 에러 스택 트레이스 (선택, 코드 블록 서식 지원) */
  errorDetail?: string;

  /** 시도 횟수 또는 재시도 여부 (선택, 예: 3) */
  retryCount?: number;
}
```

---

## 3. 필드 상세 명세

| 필드명 | 타입 | 필수 여부 | 설명 |
| :--- | :---: | :---: | :--- |
| `taskName` | `string` | **필수** | 실패가 발생한 구체적인 작업/기능 이름 |
| `errorMessage` | `string` | **필수** | 실패 원인 및 사용자/운영자가 인지해야 할 핵심 오류 메시지 |
| `stage` | `string` | 선택 | 실패가 일어난 세부 단계/위치 |
| `errorDetail` | `string` | 선택 | 디버깅용 스택 트레이스 또는 시스템 출력 (최대 1,000자 자동 절삭) |
| `retryCount` | `number` | 선택 | 실패 전 시도한 총 횟수 |

---

## 4. 전송 JSON 예시

```json
{
  "taskName": "경기 데이터 무결성 동기화 (sync-match-integrity)",
  "stage": "2-Pass 트랜잭션 커밋 단계",
  "errorMessage": "PostgreSQL 외래 키 제약 조건 위반으로 동기화 쿼리가 롤백되었습니다.",
  "retryCount": 3,
  "errorDetail": "error: update or delete on table \"match\" violates foreign key constraint \"fk_play_match\"\nDetail: Key (id)=(...) is still referenced from table \"play\"."
}
```

---

## 5. 생성되는 Discord Embed 구조

```
┌─ 🤖 페어리 시스템 로그 ───────────────────────────────────────────┐
│  🚨 [작업 실패] 경기 데이터 무결성 동기화 (sync-match-integrity)    │
│  PostgreSQL 외래 키 제약 조건 위반으로 동기화 쿼리가 롤백되었습니다.  │
│                                                                   │
│  • 📌 실패 단계: 2-Pass 트랜잭션 커밋 단계  • 🔄 시도 횟수: 3회     │
│                                                                   │
│  • 📋 상세 오류 로그:                                              │
│    ```                                                            │
│    error: update or delete on table "match" violates ...          │
│    ```                                                            │
│                                                                   │
│  zzz-picker System Monitor • 오늘 18:48                           │
└───────────────────────────────────────────────────────────────────┘
```
