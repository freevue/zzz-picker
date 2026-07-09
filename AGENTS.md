# AGENTS.md

## 프로젝트 룰 인덱스

| 대상 | 경로 | 설명 |
|------|------|------|
| Gemini (원본) | `.agent/rules/GEMINI.md` | 게임·밴픽·디자인·패키지 전체 룰 (수정 금지) |
| Cursor / Claude / Codex | `.cursor/rules/zzz-picker.mdc` | 위 룰의 읽기용 인덱스 + 모노레포 구조 |
| ZPDS UI 개발 | `.cursor/rules/zpds-components.mdc` | 디자인 리뉴얼 컴포넌트·스토리북 규칙 |

## 레포 공유 Skills

| Skill | 경로 | 설명 |
|------|------|------|
| R2 범용 업로드 | `.agent/skills/r2-upload/` | 매니페스트 JSON 기반 이미지/정적 파일 R2 업로드 (`node` 실행) |
| 에이전트 프로필 마이그레이션 | `.agent/skills/migrate-agent-profiles/` | 에이전트 프로필 이미지 R2 이관 + SQL 생성 |

## Cursor Cloud specific instructions

`zzz-picker`는 pnpm 워크스페이스 모노레포입니다. 의존성 설치는 시작 시 `pnpm install`(update script)로 자동 처리됩니다.

### 런타임 / 툴체인

- Node는 PATH 선두에 고정된 `/exec-daemon/node`(v22)가 항상 사용됩니다. `.mise.toml`은 node 24를 명시하지만 강제되지 않으며, v22로 dev 서버·빌드·테스트 모두 정상 동작합니다. mise는 설치되어 있지 않습니다.
- pnpm은 베이스 이미지의 nvm 기본 버전에 포함되어 PATH에 있습니다. `nvm alias default`를 바꾸면 pnpm이 PATH에서 사라질 수 있으니 변경하지 마세요.

### 서비스 실행 방법

- **www** (메인 앱, Remix+Vite): `pnpm dev:www` → http://localhost:5173 . 핵심 기능은 `/original`(강습전 밴픽 플레이그라운드)입니다.
- **admin** (Remix+Vite, R2 파일 관리): `pnpm --filter @zzz-picker/admin dev` → http://localhost:3001 .
- **storybook**: `pnpm --filter storybook storybook` → http://localhost:6006 .

### 테스트 / 린트 / 빌드

- 테스트: `pnpm test run` (vitest). 참고: `packages/utils/src/getAgentTotalCost.test.ts`는 소스 모듈 `getAgentTotalCost.ts`가 저장소에 없어서 실패합니다 — 환경 문제가 아닌 기존 저장소 버그입니다(나머지 18개 통과).
- 린트: 별도 ESLint 설정/스크립트가 없습니다. 포맷 검사는 `pnpm exec prettier --check .`, 타입 검사는 앱 디렉터리에서 `pnpm exec tsc -b`로 수행합니다(빌드 `pnpm build:www`에 tsc -b가 포함됨).

### 환경변수 (중요·비자명)

- `apps/www`와 `apps/admin`의 vite는 `loadEnv`로 각 앱 디렉터리의 `.env`를 읽습니다. `.env` 파일들은 gitignore 대상입니다.
- `SUPABASE_URL`/`SUPABASE_ANON_KEY`가 **모듈 로드 시점에** Supabase 클라이언트 생성에 사용되므로, 값이 없으면 앱이 부팅 중 throw 합니다. 따라서 로컬 실행에는 최소한 플레이스홀더 값이라도 필요합니다.
- 캐릭터·보스·엔진(밴픽에 쓰이는 로스터) 데이터는 Supabase(`agents`/`boss`/`engines`/`deadly_assault` 테이블)에서 옵니다. 실제 자격증명이 없으면 밴픽 그리드가 비어 있습니다. 실제 백엔드 없이 UI를 검증하려면 `SUPABASE_URL`을 PostgREST 호환 로컬 목 서버(`/rest/v1/<table>` 경로에 JSON 배열 반환, CORS 허용)로 가리키면 캐릭터 선택 흐름을 그대로 테스트할 수 있습니다.
- 기타: `GEMINI_API_KEY`/`GOOGLE_API_KEY`(`/chat` Gemini), `GOOGLE_SHEET_ID`, `ROLE_TOKEN_SECRET`, admin의 `R2_*`(Cloudflare R2)는 해당 기능 사용 시에만 필요합니다.
