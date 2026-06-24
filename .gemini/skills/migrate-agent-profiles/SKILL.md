---
name: migrate-agent-profiles
description: 외부 도메인에 호스팅되어 있는 캐릭터(에이전트) 프로필 이미지를 Cloudflare R2 스토리지로 이전하고 Supabase 데이터베이스의 이미지 매핑 상태를 일괄 업데이트합니다. 사용자가 캐릭터 이미지의 외부 링크를 R2로 일괄 이관하려 할 때 실행합니다.
---

# 에이전트 프로필 이미지 R2 마이그레이션 스킬

이 스킬은 외부 도메인(예: 네이버 라운지 등)에 저장된 캐릭터 프로필 이미지를 R2 스토리지로 업로드하고, 데이터베이스의 프로필 이미지 ID 매핑 정보(`agent_images`, `agents` 테이블)를 업데이트하는 마이그레이션 절차를 제공합니다.

---

## 실행 프로세스 및 워크플로우

### [1단계] 마이그레이션 대상 데이터 추출하기
Supabase 데이터베이스에서 외부 도메인(`images.zzz.freevue.dev`가 아닌 주소)의 이미지 URL을 사용하는 캐릭터 목록을 JSON 형식으로 추출합니다.

1. **Supabase MCP `execute_sql` 도구**를 사용하여 아래 쿼리를 수행합니다.
   ```sql
   SELECT a.id, a.name_ko, ai.url AS profile_url, ai.source_id 
   FROM agents a
   LEFT JOIN agent_images ai ON a.profile_image_id = ai.id
   WHERE ai.url IS NULL OR ai.url NOT LIKE 'https://images.zzz.freevue.dev%';
   ```
2. 반환된 쿼리 결과(JSON 배열 형태)를 프로젝트 루트나 임시 폴더에 `agents-to-migrate.json` 파일로 저장합니다.

### [2단계] 마이그레이션 스크립트 실행하기
로컬 프로젝트의 pnpm 컨텍스트 하위(`packages/r2-storage`)에서 이 스킬에 포함된 `scripts/migrate.ts` 스크립트를 `tsx` 및 `.env` 파일과 함께 구동하여 이미지 업로드 및 업데이트용 SQL 문을 생성합니다.

1. 프로젝트 내 `packages/r2-storage` 디렉토리로 이동한 뒤, 아래 명령을 실행합니다. (이때 `.env` 경로와 JSON 파일 경로를 올바르게 맞춰줍니다.)
   ```bash
   npx tsx --env-file=../../.env <path-to-skill-directory>/scripts/migrate.ts <path-to-json>/agents-to-migrate.json ./update-profiles.sql
   ```
   * *참고: 만약 tsx 샌드박스 내부에서 모듈을 찾지 못할 경우, 임시 vitest 파일 혹은 프로젝트 `package.json` 컨텍스트를 활용해 구동할 수 있습니다.*
2. R2로의 업로드가 완료되면 최종 데이터베이스 적용을 위한 `./update-profiles.sql` 파일이 생성됩니다.

### [3단계] 데이터베이스에 SQL 쿼리 적용하기
생성된 `update-profiles.sql` 내부의 다중 쿼리문들을 Supabase DB에 실행합니다.

1. **Supabase MCP `execute_sql` 도구**를 통해 `update-profiles.sql` 파일에 기록된 SQL 쿼리문을 통째로 파라미터로 넘겨 실행합니다.
2. `agent_images`에 새로운 R2 URL을 가진 레코드가 `INSERT`되고, 그 ID가 `agents.profile_image_id`로 자동 `UPDATE` 됩니다.

### [4단계] 최종 검증 및 테스트 파일 정리하기
1. 아래 쿼리를 데이터베이스에서 실행하여 외부 링크 상태의 캐릭터 개수가 `0`인지 확인합니다.
   ```sql
   SELECT count(*) FROM agents a
   LEFT JOIN agent_images ai ON a.profile_image_id = ai.id
   WHERE ai.url NOT LIKE 'https://images.zzz.freevue.dev%';
   ```
2. 작업용으로 임시 생성했던 `agents-to-migrate.json` 및 `update-profiles.sql` 파일을 삭제하여 마무리합니다.
