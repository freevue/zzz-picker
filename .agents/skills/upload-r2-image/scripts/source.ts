import { readFile, access } from 'node:fs/promises'
import { extname } from 'node:path'
import { fileURLToPath } from 'node:url'

export type LoadedSource = {
  body: Buffer
  contentType: string
  extension: string
}

const CONTENT_TYPE_BY_EXT: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.avif': 'image/avif',
  '.bmp': 'image/bmp',
  '.tiff': 'image/tiff',
  '.tif': 'image/tiff',
}

const EXT_BY_CONTENT_TYPE: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/jpg': '.jpg',
  'image/png': '.png',
  'image/gif': '.gif',
  'image/webp': '.webp',
  'image/svg+xml': '.svg',
  'image/avif': '.avif',
  'image/bmp': '.bmp',
  'image/tiff': '.tiff',
}

export const isRemoteUrl = (source: string): boolean => {
  try {
    const parsed = new URL(source)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

const normalizeContentType = (raw: string | null): string => {
  if (!raw) return 'application/octet-stream'
  return raw.split(';')[0]?.trim().toLowerCase() || 'application/octet-stream'
}

const extensionFromPath = (filePath: string): string => {
  const extension = extname(filePath).toLowerCase()
  return extension || '.bin'
}

const contentTypeFromExtension = (extension: string): string =>
  CONTENT_TYPE_BY_EXT[extension] ?? 'application/octet-stream'

const resolveExtension = (
  contentType: string,
  pathHint: string,
): string => {
  const fromType = EXT_BY_CONTENT_TYPE[contentType]
  if (fromType) return fromType
  return extensionFromPath(pathHint)
}

const loadLocal = async (filePath: string): Promise<LoadedSource> => {
  await access(filePath)
  const extension = extensionFromPath(filePath)
  return {
    body: await readFile(filePath),
    contentType: contentTypeFromExtension(extension),
    extension,
  }
}

const loadRemote = async (sourceUrl: string): Promise<LoadedSource> => {
  const response = await fetch(sourceUrl)
  if (!response.ok) {
    throw new Error(`원격 이미지 다운로드 실패: HTTP ${response.status}`)
  }

  const contentType = normalizeContentType(response.headers.get('content-type'))
  const pathHint = new URL(sourceUrl).pathname
  const extension = resolveExtension(contentType, pathHint)
  const resolvedType =
    contentType === 'application/octet-stream'
      ? contentTypeFromExtension(extension)
      : contentType

  return {
    body: Buffer.from(await response.arrayBuffer()),
    contentType: resolvedType,
    extension,
  }
}

/** 로컬 경로 또는 http(s) / file:// URL에서 이미지 바이트를 로드한다. */
export const loadSource = async (source: string): Promise<LoadedSource> => {
  if (isRemoteUrl(source)) return loadRemote(source)
  if (source.startsWith('file:')) return loadLocal(fileURLToPath(source))
  return loadLocal(source)
}
