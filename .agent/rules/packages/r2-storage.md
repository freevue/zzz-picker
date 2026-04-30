---
triger: model_decision
tags: [package, storage, cloudflare-r2, aws-sdk]
aliases: [r2-package, storage-service]
---

# R2 Storage GUIDE

## Purpose

- Cloudflare R2 버킷과 상호작용하기 위한 클라이언트 설정 및 파일 관리 유틸리티(업로드 경로 생성, 파일 브라우징 등)를 제공합니다.

## Files (Original)

- `client.ts`
- `presigned.ts`
- `browser.ts`
- `index.ts`

## Exports

- **createR2Client**: AWS SDK S3 클라이언트를 R2 설정에 맞춰 생성합니다.
- **generatePresignedUrl**: 프론트엔드에서 직접 업로드할 수 있는 업로드 전용 URL을 생성합니다.
- **browseBucket / createFolder**: 버킷 내의 파일 리스트를 조회하거나 가상 폴더를 생성합니다.

## Dependencies

### External

- [@aws-sdk/client-s3](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/welcome.html)
- [@aws-sdk/s3-request-presigner](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/Package/-aws-sdk-s3-request-presigner/)

## Example

```typescript
import { generatePresignedUrl } from '@zzz-picker/r2-storage'

const { url, key } = await generatePresignedUrl({ contentType: 'image/png' })
```
