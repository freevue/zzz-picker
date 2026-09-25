---
name: r2-storage
description: Cloudflare R2 버킷과 상호작용하기 위한 클라이언트 설정 및 파일 관리 유틸리티입니다.
---

# R2 Storage 패키지 가이드 (`@zzz-picker/r2-storage`)

`packages/r2-storage`는 Cloudflare R2 스토리지 버킷에 캐릭터, 엔진, 보스 등의 이미지를 저장하고 관리하기 위한 AWS SDK S3 호환 클라이언트 및 유틸리티를 제공합니다.

---

## 1. 목적 (Purpose)

- **Cloudflare R2 연동**: AWS SDK S3 클라이언트를 R2 엔드포인트 및 자격증명에 맞춰 생성.
- **사전 서명된 URL (Presigned URL)**: 프론트엔드나 관리자 페이지에서 직접 이미지를 안전하게 업로드할 수 있는 Presigned URL 발급.
- **버킷 브라우징**: 버킷 내 파일 목록 조회, 가상 디렉토리 생성 및 관리.

---

## 2. 파일 구성 및 주요 Exports

```text
packages/r2-storage/src/
├── index.ts        # 엔트리 포인트
├── client.ts       # S3Client 기반 R2 클라이언트 생성기 (createR2Client)
├── presigned.ts    # Presigned URL 생성 및 파일 키 생성 함수
└── browser.ts      # 버킷 내 객체 탐색 및 폴더 생성 함수
```

### Exports
- **`createR2Client`**: Cloudflare R2 설정이 적용된 S3 클라이언트 인스턴스 반환.
- **`generatePresignedUrl`**: Content-Type 및 경로를 기반으로 업로드용 서명 URL 반환.
- **`generateFileKey`**: 파일 확장자 및 타임스탬프를 고려한 고유 S3 Key 생성.
- **`browseBucket`**: 지정된 Prefix의 파일 및 가상 폴더 목록 조회.
- **`createFolder`**: 지정된 Prefix에 빈 객체를 생성하여 가상 폴더 생성.

---

## 3. R2 이미지 업로드 Skill 연동

대량 이미지 또는 단건 이미지를 R2에 업로드할 때는 `.cursor/skills/upload-r2-image/` 스킬 스크립트를 사용합니다.

```bash
npx tsx .cursor/skills/upload-r2-image/scripts/upload.ts \
  --url <원본URL> --path <R2경로prefix>
```

- 기본 버킷: `zzz-picker`
- 퍼블릭 도메인: `https://images.zzz.freevue.dev`
