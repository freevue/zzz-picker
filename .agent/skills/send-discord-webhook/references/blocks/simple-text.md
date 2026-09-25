# 블록 규격: `simple-text` (단순 텍스트 메시지)

가장 기본적이고 직관적인 텍스트 알림 블록입니다. 일반 안내, 공지, 또는 테스트 메시지 발송에 사용됩니다.

---

## 1. 블록 메타데이터

- **블록 타입 식별자**: `simple-text`
- **프로필**: `username: "페어리"`, `avatar_url: "https://images.zzz.freevue.dev/agents/profile/fairy.webp"`

---

## 2. 입력 데이터 스키마 (TypeScript)

```typescript
export interface SimpleTextBlockData {
  /** 전송할 텍스트 본문 (마크다운 지원) */
  content: string;

  /** 메시지 앞머리에 붙일 접두사/태그 (선택) */
  prefix?: string;
}
```

---

## 3. 필드 상세 명세

| 필드명 | 타입 | 필수 여부 | 설명 |
| :--- | :---: | :---: | :--- |
| `content` | `string` | **필수** | 전송할 메시지 내용 (최대 2,000자, Discord 마크다운 지원) |
| `prefix` | `string` | 선택 | 메시지 앞머리에 붙일 태그 (예: `[공지]`, `[안내]`, 기본값 없음) |

---

## 4. 전송 JSON 예시

```json
{
  "content": "안녕하세요. 페어리입니다. 시스템이 정상 가동 중입니다.",
  "prefix": "[시스템 안내]"
}
```
