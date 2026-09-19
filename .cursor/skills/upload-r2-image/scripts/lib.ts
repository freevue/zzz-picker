import { randomUUID } from 'node:crypto'
import { dirname, extname } from 'node:path'
import {
  createR2Client,
  PutObjectCommand,
} from '../../../../packages/r2-storage/src/index.ts'
import { loadSource } from './source'

export type UploadItem = {
  source: string
  path: string
}

export type UploadResult = {
  ok: boolean
  source: string
  path: string
  key?: string
  url?: string
  error?: string
}

const DEFAULT_BUCKET = 'zzz-picker'
const DEFAULT_PUBLIC_URL = 'https://images.zzz.freevue.dev'

export const getAccountId = (): string =>
  process.env.R2_ACCOUNT_ID ?? process.env.CLOUDFLARE_ACCOUNT_ID ?? ''

export const getAccessKeyId = (): string => process.env.R2_ACCESS_KEY_ID ?? ''

export const getSecretAccessKey = (): string => process.env.R2_SECRET_ACCESS_KEY ?? ''

export const hasR2Credentials = (): boolean =>
  Boolean(getAccountId() && getAccessKeyId() && getSecretAccessKey())

export const getBucketName = (): string =>
  process.env.R2_BUCKET_NAME ?? DEFAULT_BUCKET

export const getPublicUrlBase = (): string =>
  (process.env.R2_PUBLIC_URL ?? DEFAULT_PUBLIC_URL).replace(/\/$/, '')

export const normalizePathPrefix = (rawPath: string): string => {
  const trimmed = rawPath.trim().replace(/^\/+|\/+$/g, '')
  if (!trimmed) return ''
  if (extname(trimmed) === '') return trimmed

  const directory = dirname(trimmed)
  if (directory === '.' || directory === '') return ''
  return directory.replace(/^\/+|\/+$/g, '')
}

export const buildObjectKey = (pathPrefix: string, extension: string): string => {
  const fileName = `${randomUUID()}${extension}`
  return pathPrefix ? `${pathPrefix}/${fileName}` : fileName
}

export const parseArgs = (argv: string[]): UploadItem[] => {
  const items: UploadItem[] = []

  for (let index = 0; index < argv.length; index += 1) {
    const flag = argv[index]
    if (flag !== '--file' && flag !== '--url' && flag !== '--source') continue

    const source = argv[index + 1]
    const pathFlag = argv[index + 2]
    const pathValue = argv[index + 3]

    if (!source || pathFlag !== '--path' || pathValue === undefined) {
      throw new Error(
        'Usage: --file|--url|--source <local-or-url> --path <r2-prefix> [...pairs]',
      )
    }

    items.push({ source, path: pathValue })
    index += 3
  }

  return items
}

export const uploadOne = async (item: UploadItem): Promise<UploadResult> => {
  const pathPrefix = normalizePathPrefix(item.path)

  let body: Buffer
  let contentType: string
  let extension: string

  try {
    const loaded = await loadSource(item.source)
    body = loaded.body
    contentType = loaded.contentType
    extension = loaded.extension
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    return {
      ok: false,
      source: item.source,
      path: pathPrefix,
      error: message,
    }
  }

  const objectKey = buildObjectKey(pathPrefix, extension)
  const client = createR2Client({
    accountId: getAccountId(),
    accessKeyId: getAccessKeyId(),
    secretAccessKey: getSecretAccessKey(),
  })

  try {
    await client.send(
      new PutObjectCommand({
        Bucket: getBucketName(),
        Key: objectKey,
        Body: body,
        ContentType: contentType,
      }),
    )
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)

    return {
      ok: false,
      source: item.source,
      path: pathPrefix,
      key: objectKey,
      error: message,
    }
  }

  return {
    ok: true,
    source: item.source,
    path: pathPrefix || '(root)',
    key: objectKey,
    url: `${getPublicUrlBase()}/${objectKey}`,
  }
}
