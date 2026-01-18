import * as React from 'react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { cn } from '~/lib/utils'

interface FolderTreeProps {
  folders: string[]
  files: { key: string; size: number }[]
  currentPath: string
  onNavigate: (path: string) => void
  onSelect: (path: string) => void
  onCreateFolder: (folderName: string) => void
  selectedPath: string
  isLoading?: boolean
  isCreatingFolder?: boolean
}

const FolderIcon = () => (
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
    className="text-amber-500"
  >
    <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
  </svg>
)

const FileIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-charade-500"
  >
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
  </svg>
)

const ChevronLeftIcon = () => (
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
    <path d="m15 18-6-6 6-6" />
  </svg>
)

const PlusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </svg>
)

const HomeIcon = () => (
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
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
)

const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const getParentPath = (path: string): string => {
  const parts = path.replace(/\/$/, '').split('/')
  parts.pop()
  return parts.join('/')
}

export const FolderTree = ({
  folders,
  files,
  currentPath,
  onNavigate,
  onSelect,
  onCreateFolder,
  selectedPath,
  isLoading = false,
  isCreatingFolder = false,
}: FolderTreeProps) => {
  const [newFolderName, setNewFolderName] = React.useState('')
  const [showNewFolderInput, setShowNewFolderInput] = React.useState(false)

  const canGoBack = currentPath !== ''

  const handleFolderClick = (folderName: string) => {
    const newPath = currentPath ? `${currentPath}/${folderName}` : folderName
    onNavigate(newPath)
  }

  const handleGoBack = () => {
    const parentPath = getParentPath(currentPath)
    onNavigate(parentPath)
  }

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      onCreateFolder(newFolderName.trim())
      setNewFolderName('')
      setShowNewFolderInput(false)
    }
  }

  return (
    <div className="rounded-xl border border-charade-800 bg-charade-900/40 backdrop-blur-sm overflow-hidden">
      <div className="flex items-center justify-between border-b border-charade-800 bg-charade-900/60 p-3 px-4">
        <div className="flex items-center gap-1 overflow-hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onNavigate('')}
            className={cn(
              'h-8 w-8 text-charade-400 hover:text-white transition-colors',
              currentPath === '' && 'text-primary bg-primary/10'
            )}
            title="루트로 이동"
          >
            <HomeIcon />
          </Button>

          {canGoBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleGoBack}
              className="h-8 w-8 text-charade-400 hover:text-white transition-colors ml-1"
              title="뒤로 가기"
            >
              <ChevronLeftIcon />
            </Button>
          )}

          <div className="flex items-center gap-1.5 ml-3 overflow-hidden">
            <span className="text-[10px] font-black text-charade-600 uppercase tracking-widest hidden sm:inline">
              BUCKET
            </span>
            <span className="text-xs font-mono text-charade-300 truncate select-none">
              /{currentPath || ''}
            </span>
          </div>
        </div>

        <div className="flex gap-2 flex-shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowNewFolderInput(!showNewFolderInput)}
            className={cn(
              'h-8 px-3 rounded-md transition-all duration-200 border-charade-700 hover:bg-charade-800',
              showNewFolderInput && 'bg-primary/20 text-primary border-primary/30'
            )}
          >
            <PlusIcon />
            <span className="ml-1.5 hidden sm:inline text-xs font-semibold">New Folder</span>
          </Button>
        </div>
      </div>

      {showNewFolderInput && (
        <div className="flex items-center gap-2 border-b border-charade-800 bg-charade-950/40 p-3 px-4">
          <div className="relative flex-1">
            <Input
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              placeholder="Folder name..."
              className="h-9 px-4 bg-charade-950 border-charade-700 text-sm focus:border-primary/50 focus:ring-0 rounded-md transition-all"
              autoFocus
              onKeyDown={(e) => {
                e.stopPropagation()
                if (e.key === 'Enter') handleCreateFolder()
              }}
            />
          </div>
          <div className="flex gap-1.5">
            <Button
              size="sm"
              onClick={handleCreateFolder}
              disabled={isCreatingFolder || !newFolderName.trim()}
              className="h-9 px-4 rounded-md bg-primary hover:bg-primary/90 text-white shadow-none"
            >
              {isCreatingFolder ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                'Create'
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowNewFolderInput(false)}
              className="h-9 px-3 rounded-md text-charade-400 hover:text-white"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="text-[10px] text-charade-500 font-bold uppercase tracking-widest">
              Loading bucket contents...
            </p>
          </div>
        ) : (
          <div className="p-1.5 space-y-px">
            {folders.length === 0 && files.length === 0 && !showNewFolderInput && (
              <div className="flex flex-col items-center justify-center py-20 text-center text-charade-600">
                <FolderIcon />
                <p className="mt-4 text-xs font-bold uppercase tracking-widest">Empty Directory</p>
                <p className="text-[10px] mt-1">Create a folder or upload an image above</p>
              </div>
            )}

            {folders.map((folder) => (
              <button
                key={folder}
                onClick={() => handleFolderClick(folder)}
                className={cn(
                  'group flex w-full items-center gap-4 rounded-md px-4 py-3 text-left text-sm transition-all hover:bg-charade-900 border border-transparent hover:border-charade-800'
                )}
              >
                <div className="text-amber-500/80 group-hover:text-amber-500 transition-colors">
                  <FolderIcon />
                </div>
                <div className="flex-1 overflow-hidden">
                  <span className="font-semibold text-charade-300 truncate block group-hover:text-white transition-colors">
                    {folder}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-charade-600 opacity-0 group-hover:opacity-100 uppercase tracking-widest transition-all">
                  Open
                </span>
              </button>
            ))}

            {folders.length > 0 && files.length > 0 && (
              <div className="h-px bg-charade-800/50 my-2 mx-4" />
            )}

            {files.map((file) => (
              <div
                key={file.key}
                className="group flex items-center justify-between rounded-md px-4 py-2.5 text-sm text-charade-400 hover:bg-charade-900/50 transition-colors"
              >
                <div className="flex items-center gap-4 overflow-hidden">
                  <div className="text-charade-600 group-hover:text-primary transition-colors">
                    <FileIcon />
                  </div>
                  <span className="truncate text-charade-400 group-hover:text-charade-200 transition-colors font-medium">
                    {file.key.split('/').pop()}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-charade-600 flex-shrink-0 ml-4">
                  {formatBytes(file.size)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
