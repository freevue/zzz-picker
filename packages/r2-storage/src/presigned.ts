import { PutObjectCommand, type S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { v4 as uuidv4 } from 'uuid'

export interface PresignedUrlOptions {
  bucket: string
  path: string
  contentType: string
  expiresIn?: number
}

export interface PresignedUrlResult {
  uploadUrl: string
  fileKey: string
  publicUrl: string
}

const CONTENT_TYPE_EXTENSION_MAP: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/gif': '.gif',
  'image/webp': '.webp',
  'image/svg+xml': '.svg',
  'image/avif': '.avif',
  'image/bmp': '.bmp',
  'image/tiff': '.tiff',
}

export const getExtensionFromContentType = (contentType: string): string => {
  return CONTENT_TYPE_EXTENSION_MAP[contentType] ?? ''
}

export const generateFileKey = (path: string, contentType: string): string => {
  const fileExtension = getExtensionFromContentType(contentType)
  const fileName = `${uuidv4()}${fileExtension}`
  const normalizedPath = path.replace(/^\/+|\/+$/g, '')
  return normalizedPath ? `${normalizedPath}/${fileName}` : fileName
}

export const generatePresignedUrl = async (
  client: S3Client,
  options: PresignedUrlOptions,
  publicBaseUrl: string
): Promise<PresignedUrlResult> => {
  const fileKey = generateFileKey(options.path, options.contentType)

  const command = new PutObjectCommand({
    Bucket: options.bucket,
    Key: fileKey,
    ContentType: options.contentType,
  })

  const uploadUrl = await getSignedUrl(client, command, {
    expiresIn: options.expiresIn ?? 3600,
  })

  const normalizedBaseUrl = publicBaseUrl.replace(/\/+$/, '')
  const publicUrl = `${normalizedBaseUrl}/${fileKey}`

  return { uploadUrl, fileKey, publicUrl }
}
