import * as React from 'react'
import { toast } from 'sonner'
import { FolderTree } from '~/components/folder-tree'
import { ImagePreview } from '~/components/image-preview'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Label } from '~/components/ui/label'
import { Progress } from '~/components/ui/progress'
import { cn } from '~/lib/utils'

interface UploadState {
  status: 'browsing' | 'uploading' | 'complete' | 'error'
  progress: number
  publicUrl: string | null
  fileKey: string | null
  error: string | null
  uploadFileName: string | null
}

interface BrowseData {
  folders: string[]
  files: { key: string; size: number }[]
}

interface PresignedResponse {
  uploadUrl: string
  fileKey: string
  publicUrl: string
}

const UploadIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" x2="12" y1="3" y2="15" />
  </svg>
)

const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']

export const ImageUploader = () => {
  const [uploadState, setUploadState] = React.useState<UploadState>({
    status: 'browsing',
    progress: 0,
    publicUrl: null,
    fileKey: null,
    error: null,
    uploadFileName: null,
  })

  const [currentBrowsePath, setCurrentBrowsePath] = React.useState<string>('')
  const [browseData, setBrowseData] = React.useState<BrowseData>({ folders: [], files: [] })
  const [isLoadingFolders, setIsLoadingFolders] = React.useState(false)
  const [isCreatingFolder, setIsCreatingFolder] = React.useState(false)
  const [isCopied, setIsCopied] = React.useState(false)

  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const loadFolders = React.useCallback(async (path: string) => {
    setIsLoadingFolders(true)
    try {
      const response = await fetch(`/api/browse?prefix=${encodeURIComponent(path)}`)
      if (response.ok) {
        const data: BrowseData = await response.json()
        setBrowseData(data)
      } else {
        const errorData = await response.json()
        console.error('Failed to load folders:', errorData.error)
        toast.error(`폴더 목록을 불러오지 못했습니다: ${errorData.error}`)
        setBrowseData({ folders: [], files: [] })
      }
    } catch (error) {
      console.error('Error loading folders:', error)
      setBrowseData({ folders: [], files: [] })
    } finally {
      setIsLoadingFolders(false)
    }
  }, [])

  React.useEffect(() => {
    if (uploadState.status === 'browsing') {
      loadFolders(currentBrowsePath)
    }
  }, [currentBrowsePath, uploadState.status, loadFolders])

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      toast.error('지원하지 않는 파일 형식입니다.')
      return
    }

    await startUpload(file)
  }

  const handleNavigate = (path: string) => {
    setCurrentBrowsePath(path)
  }

  const handleCreateFolder = async (folderName: string) => {
    setIsCreatingFolder(true)
    try {
      const formData = new FormData()
      formData.append('path', currentBrowsePath)
      formData.append('folderName', folderName)

      const response = await fetch('/api/create-folder', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        toast.success('폴더가 생성되었습니다.')
        await loadFolders(currentBrowsePath)
      } else {
        const errorData = await response.json()
        toast.error(`폴더 생성 실패: ${errorData.error}`)
      }
    } catch (error) {
      console.error('Error creating folder:', error)
      toast.error('폴더 생성 중 오류가 발생했습니다.')
    } finally {
      setIsCreatingFolder(false)
    }
  }

  const startUpload = async (file: File) => {
    setUploadState((prev) => ({
      ...prev,
      status: 'uploading',
      progress: 10,
      error: null,
      uploadFileName: file.name,
    }))

    try {
      const formData = new FormData()
      formData.append('path', currentBrowsePath)
      formData.append('contentType', file.type)

      const response = await fetch('/api/presigned-url', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to get presigned URL')
      }

      const presignedData: PresignedResponse = await response.json()
      setUploadState((prev) => ({ ...prev, progress: 30 }))

      await uploadToR2(file, presignedData)
    } catch (error: any) {
      setUploadState((prev) => ({
        ...prev,
        status: 'error',
        error: error.message || '업로드 URL 생성 실패',
      }))
      toast.error(`업로드 실패: ${error.message || 'URL 생성 오류'}`)
    }
  }

  const uploadToR2 = async (file: File, presignedData: PresignedResponse) => {
    const { uploadUrl, fileKey, publicUrl } = presignedData

    try {
      const xhr = new XMLHttpRequest()

      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 60) + 30
          setUploadState((prev) => ({ ...prev, progress: percentComplete }))
        }
      })

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          setUploadState({
            status: 'complete',
            progress: 100,
            publicUrl,
            fileKey,
            error: null,
            uploadFileName: file.name,
          })
          toast.success('이미지가 업로드되었습니다!')
        } else {
          setUploadState((prev) => ({
            ...prev,
            status: 'error',
            error: `R2 업로드 실패 (HTTP ${xhr.status})`,
          }))
          toast.error(`R2 업로드에 실패했습니다. (HTTP ${xhr.status})`)
        }
      })

      xhr.addEventListener('error', () => {
        setUploadState((prev) => ({
          ...prev,
          status: 'error',
          error: '네트워크 오류 (CORS 또는 연결 끊김)',
        }))
        toast.error('네트워크 오류가 발생했습니다. CORS 설정을 확인해주세요.')
      })

      xhr.open('PUT', uploadUrl)
      xhr.setRequestHeader('Content-Type', file.type)
      xhr.send(file)
    } catch (error) {
      setUploadState((prev) => ({
        ...prev,
        status: 'error',
        error: '업로드 시작 실패',
      }))
      toast.error('업로드에 실패했습니다.')
    }
  }

  const handleCopyUrl = async () => {
    if (!uploadState.publicUrl) return

    try {
      await navigator.clipboard.writeText(uploadState.publicUrl)
      setIsCopied(true)
      toast.success('URL이 복사되었습니다.')
      setTimeout(() => setIsCopied(false), 2000)
    } catch {
      toast.error('URL 복사에 실패했습니다.')
    }
  }

  const handleReset = () => {
    setUploadState({
      status: 'browsing',
      progress: 0,
      publicUrl: null,
      fileKey: null,
      error: null,
      uploadFileName: null,
    })
    setIsCopied(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    loadFolders(currentBrowsePath)
  }

  return (
    <Card className="w-full border-charade-800 bg-charade-900/10 shadow-none border-none overflow-hidden">
      <CardHeader className="px-0 pt-0 pb-8 flex flex-row items-end justify-between border-b border-charade-800/50 mb-8">
        <div>
          <CardTitle className="text-3xl font-black text-white tracking-tight">
            Image Management
          </CardTitle>
          <CardDescription className="text-charade-500 mt-2 font-medium">
            Explore bucker folders and manage your R2 storage assets.
          </CardDescription>
        </div>

        {uploadState.status === 'browsing' && (
          <div className="flex gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept={ALLOWED_FILE_TYPES.join(',')}
              onChange={handleFileChange}
              className="hidden"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="px-6 bg-primary hover:bg-primary/90 text-white font-bold h-11 rounded-lg transition-all"
            >
              <UploadIcon />
              <span className="ml-2">Upload Files</span>
            </Button>
          </div>
        )}
      </CardHeader>

      <CardContent className="px-0">
        <div className="min-h-[500px] flex flex-col">
          {uploadState.status === 'browsing' && (
            <div className="flex-1 space-y-6">
              <div className="flex items-center justify-between">
                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-charade-500">
                  Storage Explorer
                </Label>
                <div className="text-[10px] font-mono text-charade-600 bg-charade-900 px-2 py-1 rounded">
                  {browseData.folders.length} FOLDERS / {browseData.files.length} FILES
                </div>
              </div>
              <FolderTree
                folders={browseData.folders}
                files={browseData.files}
                currentPath={currentBrowsePath}
                onNavigate={handleNavigate}
                onSelect={() => {}}
                onCreateFolder={handleCreateFolder}
                selectedPath={currentBrowsePath}
                isLoading={isLoadingFolders}
                isCreatingFolder={isCreatingFolder}
              />
            </div>
          )}

          {uploadState.status === 'uploading' && (
            <div className="flex-1 flex flex-col items-center justify-center py-20 bg-charade-900/20 rounded-2xl border border-charade-800 border-dashed">
              <div className="relative mb-8">
                <div className="h-32 w-32 rounded-full border-4 border-charade-800" />
                <div
                  className="absolute inset-0 h-32 w-32 rounded-full border-4 border-primary border-t-transparent animate-spin"
                  style={{ animationDuration: '1s' }}
                />
                <div className="absolute inset-0 flex items-center justify-center font-black text-2xl text-white">
                  {uploadState.progress}%
                </div>
              </div>

              <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter">
                Uploading...
              </h3>
              <p className="text-charade-500 text-sm mb-8 font-medium">
                Sending <span className="text-primary">{uploadState.uploadFileName}</span> to R2
                cloud storage.
              </p>

              <div className="w-full max-w-sm px-6">
                <Progress value={uploadState.progress} className="h-1.5 bg-charade-800" />
              </div>
            </div>
          )}

          {uploadState.status === 'complete' && uploadState.publicUrl && (
            <div className="flex-1 animate-in zoom-in-95 duration-300">
              <div className="mb-8 flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="bg-emerald-500 p-1.5 rounded-full">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="4"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white tracking-tight leading-none">
                      Upload Completed
                    </h3>
                    <p className="text-xs font-medium text-emerald-500/70 mt-1 uppercase tracking-widest">
                      Your file is now live!
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                  className="text-charade-400 hover:text-white hover:bg-emerald-500/20"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <ImagePreview
                    imageUrl={uploadState.publicUrl}
                    fileName={uploadState.fileKey ?? ''}
                    onCopyUrl={handleCopyUrl}
                    onClose={handleReset}
                    isCopied={isCopied}
                  />
                </div>
                <div className="space-y-4">
                  <div className="p-6 bg-charade-900/50 rounded-2xl border border-charade-800 h-full flex flex-col">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-charade-500 mb-6 block">
                      Quick Actions
                    </Label>
                    <Button
                      onClick={handleCopyUrl}
                      className="w-full mb-3 h-12 font-bold bg-charade-800 hover:bg-charade-700 text-white border border-charade-700"
                    >
                      {isCopied ? 'URL Copied!' : 'Copy Public URL'}
                    </Button>
                    <Button
                      onClick={() => window.open(uploadState.publicUrl!, '_blank')}
                      variant="outline"
                      className="w-full mb-6 h-12 font-bold bg-transparent border-charade-700 text-charade-300 hover:text-white"
                    >
                      Preview in Browser
                    </Button>
                    <div className="mt-auto">
                      <Button
                        onClick={handleReset}
                        className="w-full h-12 font-black bg-white text-charade-950 hover:bg-charade-100 rounded-xl transition-transform active:scale-95"
                      >
                        Upload Another
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {uploadState.status === 'error' && (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-red-500/5 rounded-2xl border border-red-500/20">
              <div className="bg-red-500/20 p-5 rounded-full mb-8">
                <svg
                  className="w-16 h-16 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h3 className="text-3xl font-black text-white mb-3 tracking-tighter">
                UPLOAD FAILED
              </h3>
              <p className="text-charade-400 text-base max-w-md mb-10 font-medium leading-relaxed">
                {uploadState.error}
                <br />
                Please verify your environment variables or R2 Bucket's CORS policy settings.
              </p>
              <div className="flex gap-4 w-full max-w-sm">
                <Button
                  variant="ghost"
                  onClick={handleReset}
                  className="flex-1 h-12 font-bold text-charade-400 hover:text-white"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleReset}
                  className="flex-1 h-12 font-black bg-red-500 hover:bg-red-600 text-white shadow-xl shadow-red-500/20"
                >
                  Try Again
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
