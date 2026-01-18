import { ListObjectsV2Command, type S3Client } from '@aws-sdk/client-s3'

export interface BrowseOptions {
  bucket: string
  prefix?: string
  delimiter?: string
}

export interface FileInfo {
  key: string
  size: number
  lastModified: Date
}

export interface BrowseResult {
  folders: string[]
  files: FileInfo[]
  prefix: string
}

export const extractFolderName = (prefix: string, parentPrefix: string): string => {
  const relativePath = prefix.replace(parentPrefix, '')
  return relativePath.replace(/\/$/, '')
}

export const browseBucket = async (
  client: S3Client,
  options: BrowseOptions
): Promise<BrowseResult> => {
  const prefix = options.prefix ?? ''
  const normalizedPrefix = prefix && !prefix.endsWith('/') ? `${prefix}/` : prefix

  const command = new ListObjectsV2Command({
    Bucket: options.bucket,
    Prefix: normalizedPrefix,
    Delimiter: options.delimiter ?? '/',
  })

  const response = await client.send(command)

  const folders = (response.CommonPrefixes ?? [])
    .map((p) => p.Prefix ?? '')
    .filter(Boolean)
    .map((folderPrefix) => extractFolderName(folderPrefix, normalizedPrefix))

  const files: FileInfo[] = (response.Contents ?? [])
    .filter((obj) => obj.Key !== normalizedPrefix)
    .map((obj) => ({
      key: obj.Key ?? '',
      size: obj.Size ?? 0,
      lastModified: obj.LastModified ?? new Date(),
    }))

  return { folders, files, prefix: normalizedPrefix }
}

export const createFolder = async (
  client: S3Client,
  bucket: string,
  folderPath: string
): Promise<string> => {
  const { PutObjectCommand } = await import('@aws-sdk/client-s3')

  const normalizedPath = folderPath.replace(/^\/+|\/+$/g, '')
  const folderKey = `${normalizedPath}/`

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: folderKey,
    Body: '',
  })

  await client.send(command)
  return folderKey
}
