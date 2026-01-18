import { generateFileKey, getExtensionFromContentType, generatePresignedUrl } from './presigned'
import { describe, it, expect, vi } from 'vitest'

describe('getExtensionFromContentType', () => {
  it('should return .jpg for image/jpeg', () => {
    expect(getExtensionFromContentType('image/jpeg')).toBe('.jpg')
  })

  it('should return .png for image/png', () => {
    expect(getExtensionFromContentType('image/png')).toBe('.png')
  })

  it('should return .gif for image/gif', () => {
    expect(getExtensionFromContentType('image/gif')).toBe('.gif')
  })

  it('should return .webp for image/webp', () => {
    expect(getExtensionFromContentType('image/webp')).toBe('.webp')
  })

  it('should return .svg for image/svg+xml', () => {
    expect(getExtensionFromContentType('image/svg+xml')).toBe('.svg')
  })

  it('should return empty string for unknown content type', () => {
    expect(getExtensionFromContentType('application/json')).toBe('')
    expect(getExtensionFromContentType('text/plain')).toBe('')
  })
})

describe('generateFileKey', () => {
  it('should generate UUID-based filename with correct extension', () => {
    const fileKey = generateFileKey('uploads', 'image/png')

    expect(fileKey).toMatch(/^uploads\/[a-f0-9-]{36}\.png$/)
  })

  it('should handle empty path', () => {
    const fileKey = generateFileKey('', 'image/jpeg')

    expect(fileKey).toMatch(/^[a-f0-9-]{36}\.jpg$/)
  })

  it('should normalize path with leading/trailing slashes', () => {
    const fileKey = generateFileKey('/path/to/folder/', 'image/webp')

    expect(fileKey).toMatch(/^path\/to\/folder\/[a-f0-9-]{36}\.webp$/)
  })

  it('should generate unique file keys', () => {
    const fileKey1 = generateFileKey('test', 'image/png')
    const fileKey2 = generateFileKey('test', 'image/png')

    expect(fileKey1).not.toBe(fileKey2)
  })
})

describe('generatePresignedUrl', () => {
  it('should generate presigned URL with correct structure', async () => {
    const mockClient = {
      send: vi.fn(),
    }

    vi.mock('@aws-sdk/s3-request-presigner', () => ({
      getSignedUrl: vi.fn().mockResolvedValue('https://mock-presigned-url.com'),
    }))

    const { getSignedUrl } = await import('@aws-sdk/s3-request-presigner')
    vi.mocked(getSignedUrl).mockResolvedValue('https://mock-presigned-url.com')

    const result = await generatePresignedUrl(
      mockClient as any,
      {
        bucket: 'test-bucket',
        path: 'images',
        contentType: 'image/png',
        expiresIn: 3600,
      },
      'https://cdn.example.com'
    )

    expect(result.uploadUrl).toBe('https://mock-presigned-url.com')
    expect(result.fileKey).toMatch(/^images\/[a-f0-9-]{36}\.png$/)
    expect(result.publicUrl).toMatch(/^https:\/\/cdn\.example\.com\/images\/[a-f0-9-]{36}\.png$/)
  })

  it('should normalize public base URL with trailing slash', async () => {
    const mockClient = {
      send: vi.fn(),
    }

    const { getSignedUrl } = await import('@aws-sdk/s3-request-presigner')
    vi.mocked(getSignedUrl).mockResolvedValue('https://mock-presigned-url.com')

    const result = await generatePresignedUrl(
      mockClient as any,
      {
        bucket: 'test-bucket',
        path: 'test',
        contentType: 'image/jpeg',
      },
      'https://cdn.example.com/'
    )

    expect(result.publicUrl.replace('https://', '')).not.toContain('//')
    expect(result.publicUrl).toMatch(/^https:\/\/cdn\.example\.com\/test\/[a-f0-9-]{36}\.jpg$/)
  })
})
