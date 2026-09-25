# zzz-picker

젠레스 존 제로 강습전의 밴픽과 경기를 운영하는 pnpm 모노레포입니다. 실제 운영 중인 메인 애플리케이션은 [`apps/renew`](apps/renew)입니다.

## 시작하기

```bash
pnpm install
pnpm dev:renew
```

메인 앱은 `http://localhost:5173`에서 실행됩니다. 실행 전 `apps/renew/.env`에 `SUPABASE_URL`과 `SUPABASE_ANON_KEY`를 설정해야 합니다.

## 저장소 안내

| 경로 | 역할 |
| :--- | :--- |
| `apps/renew` | 메인 밴픽·경기 애플리케이션 |
| `apps/admin` | R2 파일 관리용 관리자 앱 |
| `apps/storybook` | 공유 UI 컴포넌트 미리보기 |
| `packages/` | Supabase, R2, UI 등 공유 워크스페이스 패키지 |
| `wiki/` | 프로젝트 도메인, 설계, 운영 문서 |
| `AGENTS.md` | 모든 코딩 에이전트가 따를 공용 지침 |

## 문서

- [에이전트 지침](AGENTS.md)
- [위키 인덱스](wiki/index.md)
- [메인 앱 아키텍처](wiki/architecture.md)
- [경기 규칙](wiki/game-rules.md)
- [밴픽 시스템](wiki/banpick-system.md)
