# ZZZ 호요랩 Chrome 확장 프로그램

젠레스 존 제로(ZZZ) 호요랩 육성가이드 로그인 및 데이터 연동용 Chrome 확장 프로그램입니다.

## 독립 패키지 구조

이 디렉터리는 **모노레포 워크스페이스에서 제외**된 독립 패키지입니다.

| 항목 | 설명 |
|------|------|
| 워크스페이스 | `pnpm-workspace.yaml`에서 `!apps/zzz-hoyolab-extension`으로 제외 |
| 의존성 | `packages/*`, 다른 `apps/*`와 **workspace 연결 없음** |
| lockfile | 이 폴더 전용 `pnpm-lock.yaml` |
| 추출 | 폴더만 복사해도 단독 레포로 운영 가능 |

루트 `pnpm install`은 이 패키지 의존성을 설치하지 않습니다. 아래처럼 이 디렉터리에서 직접 설치·실행하세요.

## 시작하기

```bash
cd apps/zzz-hoyolab-extension
pnpm install --ignore-workspace
pnpm dev
```

루트에서 실행:

```bash
pnpm dev:extension    # 개발
pnpm build:extension  # 빌드
```

- `pnpm dev` — WXT 개발 모드 (HMR, `.output/chrome-mv3` 빌드)
- `pnpm build` — 프로덕션 빌드
- `pnpm zip` — Chrome Web Store 업로드용 zip

Chrome에서 `chrome://extensions` → 개발자 모드 → **압축해제된 확장 프로그램 로드** → `.output/chrome-mv3` 선택.

## 디렉터리 구조

```
src/
  entrypoints/
    background.ts      # 서비스 워커 (메시지·스토리지)
    content.hoyolab.ts # 호요랩 페이지 쿠키·세션 감지
    popup/             # 확장 프로그램 팝업 UI
  lib/
    messaging.ts       # background ↔ popup 메시지
    storage.ts         # chrome.storage 래퍼
  types/
    hoyolab.ts         # 인증·동기화 타입
```

## 다음 단계 (미구현)

- 호요랩 ZZZ 육성가이드 API 연동 (`act.hoyolab.com/zzz/...`)
- zzz-picker `www` 앱과의 데이터 전송 (postMessage / 커스텀 프로토콜)
- 에이전트·엔진·디스크 상세 스냅샷 파싱

## 기술 스택

- [WXT](https://wxt.dev/) — Manifest V3 + TypeScript
- Chrome Extension APIs: `storage`, `cookies`, content scripts
