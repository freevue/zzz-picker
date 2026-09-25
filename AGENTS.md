# zzz-picker 에이전트 안내

이 문서는 Codex, Cursor, Claude Code, Gemini 등 저장소에서 작업하는 모든 에이전트의 공용 진입점입니다. 프로젝트 지식과 도메인 규칙은 [`wiki/index.md`](wiki/index.md)를 기준으로 탐색합니다.

## 작업 원칙

- 대화, 주석, 문서, 작업 산출물은 한국어로 작성합니다. 코드 식별자와 통용 기술 용어는 영어를 사용합니다.
- 기존 코드와 패키지를 먼저 살펴보고, 요구된 범위에서 가장 단순한 변경을 합니다.
- TypeScript에서는 `any`와 한 글자 식별자를 사용하지 않고, 단일 파일은 150줄 이내로 유지합니다.
- 변수·상수·함수는 `camelCase`, 클래스는 `PascalCase`로 작성합니다. 폴더는 barrel export, 단일 파일은 named export를 사용합니다.
- Early Return, 불변성, 함수형 스타일을 우선하고 문자열 결합은 template literal을 사용합니다.
- UI 작업 전 [`apps/renew/DESIGN.md`](apps/renew/DESIGN.md) 또는 해당 패키지의 디자인 문서를 확인합니다.
- 중요한 도메인·아키텍처 결정을 대화에만 남기지 말고 관련 위키 문서에 반영합니다.
- 문서와 코드가 다르면 코드 및 운영 데이터의 현재 상태를 확인하고, 확인된 동작에 맞게 위키를 갱신합니다.

## 지식 탐색

1. [`wiki/index.md`](wiki/index.md)에서 작업 유형에 맞는 문서를 찾습니다.
2. UI·라우트는 [앱 개요](wiki/apps/renew/overview.md)와 [라우트 상세](wiki/apps/renew/routes.md), DB는 [`wiki/database.md`](wiki/database.md), 경기 규칙은 [`wiki/game-rules.md`](wiki/game-rules.md)와 [`wiki/banpick-system.md`](wiki/banpick-system.md)를 확인합니다.
3. 등록·운영 작업은 [`wiki/operations.md`](wiki/operations.md)와 관련 스킬 문서를 함께 읽습니다.

`wiki/`는 프로젝트 지식의 단일 문서 저장소입니다. `.agent/rules/`와 `.cursor/rules/`는 각 도구가 공용 안내를 자동으로 찾도록 연결하는 어댑터이며, 도메인 규칙을 복제하지 않습니다. 실행 절차는 스킬 디렉터리에 유지합니다.

## 레포 스킬

| 작업 | 스킬 |
| :--- | :--- |
| 에이전트 정보 취합/등록 | [register-agent](.agent/skills/register-agent/SKILL.md) |
| 보스 등록 | [register-boss](.agent/skills/register-boss/SKILL.md) |
| W-엔진 등록 | [register-engine](.agent/skills/register-engine/SKILL.md) |
| 경기 무결성 동기화 | [sync-match-integrity](.agent/skills/sync-match-integrity/SKILL.md) |
| 진영 등록 | [register-faction](.agent/skills/register-faction/SKILL.md) |
| 특성 등록 | [register-specialty](.agent/skills/register-specialty/SKILL.md) |
| 디스코드 웹훅 알림 | [send-discord-webhook](.agent/skills/send-discord-webhook/SKILL.md) |
| R2 이미지 업로드 | [upload-r2-image](.cursor/skills/upload-r2-image/SKILL.md) |
| 에이전트 프로필 마이그레이션(레거시) | [migrate-agent-profiles](.agent/skills/migrate-agent-profiles/SKILL.md) |

일반 Markdown 스킬을 실행할 때 현재 런타임이 제공하지 않는 DB·HTTP·파일·스토리지 권한을 가정하지 않습니다. 필요한 권한이 없으면 쓰기 작업 전에 보고합니다.

## 실행 환경

`zzz-picker`는 pnpm 워크스페이스 모노레포이며, 메인 서비스는 `apps/renew`입니다.

| 대상 | 명령 | 주소 |
| :--- | :--- | :--- |
| 메인 앱 | `pnpm dev:renew` | `http://localhost:5173` |
| 관리자 앱 | `pnpm --filter @zzz-picker/admin dev` | `http://localhost:3001` |
| Storybook | `pnpm --filter storybook storybook` | `http://localhost:6006` |

`apps/renew/.env`에는 Supabase 연동용 `SUPABASE_URL`, `SUPABASE_ANON_KEY`가 필요합니다.
