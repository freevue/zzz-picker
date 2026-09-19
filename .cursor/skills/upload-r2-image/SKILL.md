---
name: upload-r2-image
description: 로컬 파일 또는 웹(http/https) 이미지를 Cloudflare R2에 단건·다건 업로드하고 공개 URL을 반환한다. S3 호환 API(@aws-sdk/client-s3)를 사용한다. 사용자가 이미지를 R2 경로에 올려 달라고 하거나, 업로드 결과 URL을 요청할 때 사용한다. 자격증명은 Cursor Cloud Secrets에서 읽는다.
---

# R2 이미지 단건·다건 업로드

로컬 파일 경로 또는 **웹 서버 이미지 URL**을 Cloudflare R2 버킷에 업로드한다. **경로(prefix)는 사용자가 지정**하고, **파일명은 항상 UUID**로 바꾼다.

프로젝트 `.env`에 의존하지 않는다. 자격증명은 **Cursor Cloud Secrets**에 등록된 환경변수만 사용한다.

## Cursor Cloud Secrets 설정

[Cloud Agents 대시보드](https://cursor.com/dashboard/cloud-agents) → Secrets 탭에 아래를 등록한다.

| 이름                   | 타입                 | 필수 | 설명                                                   |
| ---------------------- | -------------------- | ---- | ------------------------------------------------------ |
| `R2_ACCOUNT_ID`        | Environment Variable | ✅   | Cloudflare Account ID (`CLOUDFLARE_ACCOUNT_ID`도 허용) |
| `R2_ACCESS_KEY_ID`     | Runtime Secret       | ✅   | R2 S3 호환 Access Key ID                               |
| `R2_SECRET_ACCESS_KEY` | Runtime Secret       | ✅   | R2 S3 호환 Secret Access Key                           |
| `R2_BUCKET_NAME`       | Environment Variable | ❌   | 기본값 `zzz-picker`                                    |
| `R2_PUBLIC_URL`        | Environment Variable | ❌   | 기본값 `https://images.zzz.freevue.dev`                |

- Secrets 변경 후 Cloud Agent 환경을 **Update Existing Env** 또는 **Start Fresh**로 갱신해야 반영된다
- `.env` / `--env-file`은 사용하지 않는다. `process.env`에 주입된 값만 읽는다

## 기본값

| 항목       | 기본값                           | 환경변수                                     |
| ---------- | -------------------------------- | -------------------------------------------- |
| 버킷       | `zzz-picker`                     | `R2_BUCKET_NAME`                             |
| Account ID | (필수)                           | `R2_ACCOUNT_ID` 또는 `CLOUDFLARE_ACCOUNT_ID` |
| Access Key | (필수)                           | `R2_ACCESS_KEY_ID`                           |
| Secret Key | (필수)                           | `R2_SECRET_ACCESS_KEY`                       |
| 공개 URL   | `https://images.zzz.freevue.dev` | `R2_PUBLIC_URL`                              |

인증은 **S3 호환 API** (`@zzz-picker/r2-storage`의 `createR2Client`)를 사용한다. admin 앱·`migrate-agent-profiles` skill과 동일한 자격증명이다.

## 소스 종류

| 소스      | 예시                               | 비고               |
| --------- | ---------------------------------- | ------------------ |
| 로컬 파일 | `./images/a.webp`                  | 디스크에서 읽음    |
| 웹 URL    | `https://cdn.example.com/boss.png` | 다운로드 후 업로드 |
| file URL  | `file:///tmp/a.webp`               | 로컬과 동일        |

원격 URL은 `Content-Type` 헤더 → URL 경로 확장자 순으로 확장자·MIME을 결정한다.

## 키 규칙

```
{사용자지정경로}/{uuid}.{원본확장자}
```

- 경로: 사용자가 명명한 prefix (예: `boss`, `agents/profile`)
- 파일명: `crypto.randomUUID()` + 확장자 (`.webp`, `.png`, `.jpg` 등)
- 경로에 파일명이 포함되어 있으면 **디렉터리 부분만** 쓰고 파일명은 버린다

## 워크플로우

1. 사용자 요청에서 `(로컬 경로 또는 웹 URL, R2 경로)` 쌍을 추출한다.
2. `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`가 `process.env`에 있는지 확인한다. 없으면 Cursor Cloud Secrets 등록을 안내하고 중단한다.
3. 아래 스크립트로 업로드한다 (한 번에 여러 쌍 가능). 웹 URL이면 먼저 다운로드한 뒤 R2에 PUT한다.
4. 성공한 항목의 **공개 URL**을 사용자에게 표로 보여준다. 실패한 항목은 이유를 함께 표시한다.

### 실행 명령

프로젝트 루트에서 실행한다. `--env-file`은 붙이지 않는다. `--file` / `--url` / `--source`는 동일하게 로컬·URL을 받는다.

```bash
npx tsx .cursor/skills/upload-r2-image/scripts/upload.ts \
  --file ./path/to/a.webp --path boss \
  --url https://cdn.example.com/b.png --path agents/profile
```

구현 세부사항은 `scripts/lib.ts`, `scripts/source.ts`를 참고한다.

### 출력

```json
[
  {
    "ok": true,
    "source": "https://cdn.example.com/b.png",
    "path": "agents/profile",
    "key": "agents/profile/550e8400-e29b-41d4-a716-446655440000.png",
    "url": "https://images.zzz.freevue.dev/agents/profile/550e8400-e29b-41d4-a716-446655440000.png"
  }
]
```

### 사용자 응답 형식

| 소스                          | R2 경로        | 공개 URL                                                 |
| ----------------------------- | -------------- | -------------------------------------------------------- |
| https://cdn.example.com/b.png | agents/profile | https://images.zzz.freevue.dev/agents/profile/{uuid}.png |

## API

S3 호환 `PutObject` (`https://{account_id}.r2.cloudflarestorage.com`)

- `packages/r2-storage`의 `createR2Client` + `@aws-sdk/client-s3` `PutObjectCommand` 사용
- admin 앱 presigned URL 업로드와 동일한 R2 자격증명

## 제약

- Cloudflare REST API (`CLOUDFLARE_API_TOKEN`)는 사용하지 않는다.
- 파일명은 절대 원본명을 유지하지 않는다 (항상 UUID).
- 프로젝트 `.env`에 의존하지 않는다.
- DB(`agent_images` 등) 갱신은 이 스킬 범위 밖이다. URL만 반환한다.
