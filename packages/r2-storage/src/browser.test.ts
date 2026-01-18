import { extractFolderName, browseBucket } from './browser'
import { describe, it, expect, vi } from 'vitest'

describe('extractFolderName', () => {
  it('should extract folder name from prefix', () => {
    expect(extractFolderName('images/', '')).toBe('images')
    expect(extractFolderName('path/to/folder/', 'path/to/')).toBe('folder')
  })

  it('should handle nested paths', () => {
    expect(extractFolderName('a/b/c/', 'a/b/')).toBe('c')
  })
})

describe('browseBucket', () => {
  it('should parse folders and files from response', async () => {
    const mockClient = {
      send: vi.fn().mockResolvedValue({
        CommonPrefixes: [{ Prefix: 'folder1/' }, { Prefix: 'folder2/' }],
        Contents: [
          { Key: 'file1.png', Size: 1024, LastModified: new Date('2024-01-01') },
          { Key: 'file2.jpg', Size: 2048, LastModified: new Date('2024-01-02') },
        ],
      }),
    }

    const result = await browseBucket(mockClient as any, {
      bucket: 'test-bucket',
      prefix: '',
    })

    expect(result.folders).toEqual(['folder1', 'folder2'])
    expect(result.files).toHaveLength(2)
    expect(result.files[0]).toEqual({
      key: 'file1.png',
      size: 1024,
      lastModified: new Date('2024-01-01'),
    })
  })

  it('should handle empty bucket', async () => {
    const mockClient = {
      send: vi.fn().mockResolvedValue({
        CommonPrefixes: undefined,
        Contents: undefined,
      }),
    }

    const result = await browseBucket(mockClient as any, {
      bucket: 'empty-bucket',
    })

    expect(result.folders).toEqual([])
    expect(result.files).toEqual([])
  })

  it('should normalize prefix with trailing slash', async () => {
    const mockClient = {
      send: vi.fn().mockResolvedValue({
        CommonPrefixes: [{ Prefix: 'images/photos/' }],
        Contents: [],
      }),
    }

    const result = await browseBucket(mockClient as any, {
      bucket: 'test-bucket',
      prefix: 'images',
    })

    expect(result.prefix).toBe('images/')
    expect(result.folders).toEqual(['photos'])
  })

  it('should filter out the prefix itself from files', async () => {
    const mockClient = {
      send: vi.fn().mockResolvedValue({
        CommonPrefixes: [],
        Contents: [
          { Key: 'folder/', Size: 0, LastModified: new Date() },
          { Key: 'folder/file.png', Size: 100, LastModified: new Date() },
        ],
      }),
    }

    const result = await browseBucket(mockClient as any, {
      bucket: 'test-bucket',
      prefix: 'folder',
    })

    expect(result.files).toHaveLength(1)
    expect(result.files[0].key).toBe('folder/file.png')
  })
})
