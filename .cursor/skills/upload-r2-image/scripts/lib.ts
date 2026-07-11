import { dirname, extname } from 'node:path'
import { randomUUID } from 'node:crypto'
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

type CloudflareUploadResponse = {
  success: boolean
  errors?: Array<{ message: string }>
}

const DEFAULT_BUCKET = 'zzz-picker'
const DEFAULT_PUBLIC_URL = 'https://images.zzz.freevue.dev'

export const getAccountId = (): string =>
  process.env.R2_ACCOUNT_ID ?? process.env.CLOUDFLARE_ACCOUNT_ID ?? ''

export const getApiToken = (): string => process.env.CLOUDFLARE_API_TOKEN ?? ''

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

/** `/`는 그대로 두고 세그먼트만 encodeURIComponent */
export const encodeObjectKey = (objectKey: string): string =>
  objectKey.split('/').map(encodeURIComponent).join('/')

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
  const encodedKey = encodeObjectKey(objectKey)
  const endpoint =
    `https://api.cloudflare.com/client/v4/accounts/${getAccountId()}` +
    `/r2/buckets/${getBucketName()}/objects/${encodedKey}`

  const response = await fetch(endpoint, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${getApiToken()}`,
      'Content-Type': contentType,
    },
    body,
  })

  const payload = (await response.json()) as CloudflareUploadResponse

  if (!response.ok || !payload.success) {
    const message =
      payload.errors?.map((error) => error.message).join('; ') ||
      `HTTP ${response.status}`

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
