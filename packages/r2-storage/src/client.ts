import { S3Client } from '@aws-sdk/client-s3'

export interface R2Config {
  accountId: string
  accessKeyId: string
  secretAccessKey: string
}

export const createR2Client = (config: R2Config): S3Client => {
  return new S3Client({
    endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
    region: 'auto',
  })
}
