import * as React from 'react'
import { Button } from '~/components/ui/button'
import { cn } from '~/lib/utils'

interface ImagePreviewProps {
  imageUrl: string
  fileName: string
  onCopyUrl: () => void
  onClose: () => void
  isCopied: boolean
}

const CopyIcon = () => (
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
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </svg>
)

const CheckIcon = () => (
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
    <path d="M20 6 9 17l-5-5" />
  </svg>
)

const XIcon = () => (
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
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
)

export const ImagePreview = ({
  imageUrl,
  fileName,
  onCopyUrl,
  onClose,
  isCopied,
}: ImagePreviewProps) => {
  return (
    <div className="rounded-lg border border-charade-600 bg-charade-900 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-sm font-medium text-ink">업로드 완료</h4>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-7 w-7">
          <XIcon />
        </Button>
      </div>

      <div className="mb-4 overflow-hidden rounded-lg bg-charade-950">
        <img src={imageUrl} alt={fileName} className="mx-auto max-h-48 object-contain" />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={imageUrl}
            readOnly
            className="flex-1 rounded-md border border-charade-600 bg-charade-800 px-3 py-1.5 text-sm text-charade-200"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={onCopyUrl}
            className={cn(isCopied && 'text-green-500')}
          >
            {isCopied ? <CheckIcon /> : <CopyIcon />}
            {isCopied ? '복사됨' : '복사'}
          </Button>
        </div>
        <p className="text-xs text-charade-400">파일명: {fileName}</p>
      </div>
    </div>
  )
}
