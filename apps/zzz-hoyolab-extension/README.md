# ZZZ 호요랩 Chrome 확장 프로그램

젠레스 존 제로(ZZZ) 호요랩 육성가이드 로그인 및 데이터를 **Supabase DB에 직접 동기화**하는 Chrome 확장 프로그램입니다.

## 아키텍처

```
호요랩 (육성가이드)
       ↓  [지금 동기화] 버튼 클릭 시 페이지 API 수집
Chrome Extension  ──→  Supabase DB
                              ↑
                        웹서비스 (읽기 전용 소비)
```

- **유저가 버튼을 눌렀을 때만** 닉네임·캐릭터/장비 데이터를 수집합니다.
- 페이지 same-origin `fetch`로 API를 호출하므로 **`cookies` 권한 불필요** (브라우저가 세션 쿠키를 자동 첨부).

- **웹서비스(`www` 등)와 직접 연동하지 않습니다.** 확장 프로그램은 DB만 씁니다.
- 웹서비스는 동일 DB를 조회해 데이터를 표시하는 구조입니다.
- 이 패키지는 `zzz-picker` 모노레포의 `packages/*`, 다른 `apps/*`와 **코드·의존성 연관이 없습니다.**

## 독립 패키지

| 항목 | 설명 |
|------|------|
| 워크스페이스 | `pnpm-workspace.yaml`에서 제외 (`!apps/zzz-hoyolab-extension`) |
| 의존성 | 모노레포 workspace 패키지 미사용, 전용 `pnpm-lock.yaml` |
| 실행 | 이 디렉터리에서만 `pnpm install` / `pnpm dev` |
| 추출 | 폴더만 복사해도 단독 레포로 운영 가능 |

루트 `pnpm install`·`pnpm test`·`pnpm build:www` 등은 이 확장 프로그램에 영향을 주지 않습니다.

## 시작하기

```bash
cd apps/zzz-hoyolab-extension
cp .env.example .env   # Supabase 자격증명 입력
pnpm install --ignore-workspace
pnpm dev
```

- `pnpm dev` — WXT 개발 모드
- `pnpm build` — 프로덕션 빌드
- `pnpm zip` — Chrome Web Store 업로드용 zip

Chrome → `chrome://extensions` → 개발자 모드 → `.output/chrome-mv3` 로드

## 환경 변수

| 변수 | 설명 |
|------|------|
| `WXT_SUPABASE_URL` | Supabase 프로젝트 URL |
| `WXT_SUPABASE_ANON_KEY` | Supabase anon key (RLS 정책 하에서 사용) |

## 디렉터리 구조

```
src/
  entrypoints/
    background.ts       # 서비스 워커
    content.hoyolab.ts  # 버튼 트리거 시 페이지 컨텍스트 수집
    popup/              # 팝업 UI
  lib/
    messaging.ts
    page-bridge.ts      # MAIN world 주입·postMessage 브릿지
    storage.ts
    supabase.ts         # DB 클라이언트 (모노레포 packages/supabase 미사용)
  types/
    hoyolab.ts
```

## 다음 단계 (미구현)

- 호요랩 ZZZ 육성가이드 API 연동
- Supabase 테이블 upsert (에이전트·엔진·디스크 스냅샷)
- 동기화 RLS·인증 정책 설계

## 기술 스택

- [WXT](https://wxt.dev/) — Manifest V3 + TypeScript
- [@supabase/supabase-js](https://supabase.com/docs/reference/javascript) — DB 직접 연동
- Chrome Extension APIs: `storage`, content scripts ( **`cookies` 미사용** )
