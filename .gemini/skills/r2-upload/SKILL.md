---
name: r2-upload
description: 매니페스트 JSON에 정의된 이미지/정적 파일을 Cloudflare R2에 업로드합니다. 에이전트가 업로드 대상 목록을 준비한 뒤 범용 업로드를 실행할 때 사용합니다.
---

# R2 범용 업로드 스킬

이 스킬은 **업로드 실행기**입니다.

- 에이전트: Supabase MCP 등으로 업로드 대상 URL/경로를 조사하고 `upload-manifest.json` 작성
- 스킬: 매니페스트를 읽어 R2에 업로드하고 `upload-report.json` 생성
- 에이전트: 리포트의 `publicUrl`을 보고 DB UPDATE 등 후속 작업 수행

DB 스키마, SQL 생성, 엔진/에이전트 도메인 로직은 이 스킬 범위에 포함하지 않습니다.

---

## 파일 구성

```text
.gemini/skills/r2-upload/
├── SKILL.md
├── examples/
│   └── upload-manifest.json
└── scripts/
    └── upload.js
```

실행은 **TypeScript 없이** `node`로 바로 수행합니다.

---

## 매니페스트 형식

배열 형식:

```json
[
  {
    "key": "images/engines/1/icon.png",
    "sourceUrl": "https://example.com/icon.png"
  },
  {
    "key": "images/static/banner.webp",
    "sourcePath": "./assets/banner.webp",
    "contentType": "image/webp"
  }
]
```

객체 형식도 허용:

```json
{
  "items": [
    {
      "key": "images/engines/1/icon.png",
      "sourceUrl": "https://example.com/icon.png"
    }
  ]
}
```

### 필드

| 필드 | 필수 | 설명 |
|------|------|------|
| `key` | O | R2 object key (예: `images/engines/1/icon.png`) |
| `sourceUrl` | 택1 | 원격 URL에서 다운로드 |
| `sourcePath` | 택1 | 로컬 파일 경로 (`sourcePath`는 매니페스트 파일 기준 상대경로) |
| `contentType` | X | MIME 타입. 생략 시 응답 헤더 또는 확장자로 추론 |

`sourceUrl`과 `sourcePath`는 동시에 사용할 수 없습니다.

---

## 실행 방법

`packages/r2-storage` 디렉터리에서 실행합니다. (`@aws-sdk/client-s3` 의존성 사용)

### 1) 환경변수 기반 업로드

```bash
cd packages/r2-storage

node ../../.gemini/skills/r2-upload/scripts/upload.js \
  --manifest ../../.gemini/skills/r2-upload/examples/upload-manifest.json \
  --report ./upload-report.json
```

필요 환경변수:

- `R2_ACCOUNT_ID`
- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`
- `R2_BUCKET_NAME` (기본값: `zzz-picker`)
- `R2_PUBLIC_URL` (기본값: `https://images.zzz.freevue.dev`)

### 2) CLI 옵션 기반 업로드

```bash
cd packages/r2-storage

node ../../.gemini/skills/r2-upload/scripts/upload.js \
  --manifest ./upload-manifest.json \
  --report ./upload-report.json \
  --account-id <R2_ACCOUNT_ID> \
  --access-key-id <R2_ACCESS_KEY_ID> \
  --secret-access-key <R2_SECRET_ACCESS_KEY> \
  --bucket zzz-picker \
  --public-url https://images.zzz.freevue.dev
```

### 3) Dry Run (업로드 생략)

```bash
cd packages/r2-storage

node ../../.gemini/skills/r2-upload/scripts/upload.js \
  --manifest ./upload-manifest.json \
  --report ./upload-report.json \
  --dry-run
```

### 4) 첫 실패에서 중단

기본값은 실패해도 다음 항목을 계속 처리합니다. 첫 실패에서 멈추려면:

```bash
node ../../.gemini/skills/r2-upload/scripts/upload.js \
  --manifest ./upload-manifest.json \
  --fail-fast
```

---

## 출력 리포트

`upload-report.json` 예시:

```json
{
  "generatedAt": "2026-07-09T04:41:00.000Z",
  "dryRun": false,
  "bucket": "zzz-picker",
  "publicUrlBase": "https://images.zzz.freevue.dev",
  "summary": {
    "total": 2,
    "success": 2,
    "failed": 0
  },
  "results": [
    {
      "key": "images/engines/1/icon.png",
      "publicUrl": "https://images.zzz.freevue.dev/images/engines/1/icon.png",
      "contentType": "image/png",
      "bytes": 12345,
      "source": "https://example.com/icon.png",
      "status": "success"
    }
  ],
  "failures": []
}
```

에이전트는 `results[].publicUrl`을 사용해 후속 DB 업데이트를 수행합니다.

---

## 권장 워크플로우

1. 에이전트가 Supabase MCP 등으로 업로드 대상 조사
2. `upload-manifest.json` 작성
3. 이 스킬 실행
4. `upload-report.json` 확인
5. 에이전트가 필요한 테이블 UPDATE SQL 실행
6. 임시 manifest/report 파일 정리

---

## 주의사항

- 이 스크립트는 `node`만 필요합니다. `tsx`나 TypeScript 빌드는 필요 없습니다.
- 원격 이미지 fetch는 기본 User-Agent 헤더를 사용합니다.
- 일부 항목 실패 시 기본적으로 나머지 항목 업로드를 계속합니다.
- 실패가 1건이라도 있으면 종료 코드는 `1`입니다.
