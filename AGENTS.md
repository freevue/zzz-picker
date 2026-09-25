# AGENTS.md

## 프로젝트 룰 인덱스

| 대상 | 경로 | 설명 |
| :--- | :--- | :--- |
| **LLM Wiki (도메인 지식 베이스)** | `wiki/index.md` | Andrej Karpathy 패턴 기반 컴파일 우선 도메인/시스템/운영 통합 지식 베이스 |
| **Gemini (최상위 루트)** | `.agent/rules/GEMINI.md` | `apps/renew` 기준 게임·밴픽·디자인·앱·패키지 전체 룰 (SSOT) |
| **Cursor / Claude / Codex** | `.cursor/rules/zzz-picker.mdc` | 위 룰의 읽기용 인덱스 + 모노레포 구조 |
| **ZPDS UI 개발** | `.cursor/rules/zpds-components.mdc` | 디자인 시스템 컴포넌트·스토리북 규칙 |

---

## 레포 Skills (에이전트 실행 가이드)

이미지·정적 파일을 R2에 올릴 때는 아래 skill 문서를 먼저 읽고 실행한다. 업로드 대상 조사·DB UPDATE는 에이전트가 담당하고, skill은 **업로드 + 공개 URL 반환**만 담당한다.

| Skill | 경로 | 용도 |
| :--- | :--- | :--- |
| **에이전트 정보 취합/등록** | `.agent/skills/register-agent/SKILL.md` | 호요버스 공식 API 및 Fandom Wiki URL 기반 에이전트 메타데이터 정밀 취합 및 등록 |
| **경기 무결성 동기화** | `.agent/skills/sync-match-integrity/SKILL.md` | 5대 체크리스트 기반 정상 경기 승격(`phase='done'`) 및 방치 세션 소프트 딜리트(`isHide=true`) |
| **진영 등록** | `.agent/skills/register-faction/SKILL.md` | 호요버스 Camp API 조회 기반 신규 진영 메타데이터 및 로고 자동 등록 |
| **특성 등록** | `.agent/skills/register-specialty/SKILL.md` | 호요랩 위키 필터 API 기반 신규 특성 메타데이터 및 아이콘 자동 동기화 |
| **디스코드 웹훅 알림** | `.agent/skills/send-discord-webhook/SKILL.md` | 규격화된 블록 기반 디스코드 알림 및 무결성 브리핑 전송 |
| **R2 이미지 업로드** | `.cursor/skills/upload-r2-image/SKILL.md` | 로컬/웹 URL 이미지를 R2에 단건·다건 업로드 (Cloudflare REST API) |
| 에이전트 프로필 마이그레이션 | `.agent/skills/migrate-agent-profiles/SKILL.md` | 에이전트 프로필 이미지 R2 이관 + SQL 생성 (레거시) |

### `upload-r2-image` 실행 요약

```bash
npx tsx .cursor/skills/upload-r2-image/scripts/upload.ts \
  --url <원본URL> --path <R2경로prefix>
```

- 자격증명: **Cursor Cloud Secrets** — `CLOUDFLARE_API_TOKEN`, `R2_ACCOUNT_ID`(또는 `CLOUDFLARE_ACCOUNT_ID`)
- 선택: `R2_BUCKET_NAME`(기본 `zzz-picker`), `R2_PUBLIC_URL`(기본 `https://images.zzz.freevue.dev`)
- `.env` / S3 Access Key는 사용하지 않음
- 대량 작업은 manifest 없이 **단건 skill을 반복 실행**

---

## 개발 환경 및 실행 가이드

`zzz-picker`는 pnpm 워크스페이스 모노레포입니다.

### 서비스 실행 방법

- **renew (메인 서비스 앱, Remix+Tailwind v4)**: `pnpm dev:renew` → http://localhost:5173  
  *현재 실제 운영 및 밴픽 경기가 진행되는 최신 메인 애플리케이션입니다.*
- **admin** (Remix+Vite, R2 파일 관리): `pnpm --filter @zzz-picker/admin dev` → http://localhost:3001
- **storybook**: `pnpm --filter storybook storybook` → http://localhost:6006

### 환경 변수 (중요)

- 각 앱 디렉터리(`apps/renew/.env` 등)에 Supabase 연동 환경변수가 필요합니다:
  - `SUPABASE_URL`: Supabase 프로젝트 URL
  - `SUPABASE_ANON_KEY`: Supabase 익명 API 키
- 모듈 로드 시점에 Supabase 클라이언트가 초기화되므로 유효한 값(로컬 테스트 시 플레이스홀더 가능)이 설정되어 있어야 부팅됩니다.
- 캐릭터, 보스, 엔진 데이터는 Supabase의 `agent`, `engine`, `boss`, `deadlyAssault` 테이블에서 실시간 조회됩니다.
