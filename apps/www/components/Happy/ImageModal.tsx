import { motion, AnimatePresence } from 'motion/react'
import { useEffect, useCallback } from 'react'

type AgentImage = {
  id: number
  url: string
  description: string
  agent_id: number
  agents: {
    name_ko: string
    name_en: string
  }
}

type ImageModalProps = {
  image: AgentImage | null
  onClose: () => void
}

const ImageModal: React.FC<ImageModalProps> = ({ image, onClose }) => {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose]
  )

  const handleDownload = useCallback(async () => {
    if (!image) return
    try {
      const response = await fetch(image.url)
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${image.agents.name_ko}_${image.description}.jpg`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch {
      window.open(image.url, '_blank')
    }
  }, [image])

  useEffect(() => {
    if (image) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [image, handleKeyDown])

  return (
    <AnimatePresence>
      {image && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* 오버레이 */}
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* 이미지 컨테이너 */}
          <motion.div
            className="relative z-10 flex flex-col items-center gap-4 max-h-[90vh] max-w-[90vw]"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <img
              src={image.url}
              alt={image.agents.name_ko}
              className="max-h-[80vh] max-w-[85vw] w-auto h-auto object-cover card shadow-2xl"
              style={{ aspectRatio: '2/3' }}
            />

            {/* 다운로드 버튼 */}
            <button
              onClick={handleDownload}
              className="absolute top-2 right-12 w-8 h-8 rounded-full bg-content text-white flex items-center justify-center transition-colors cursor-pointer"
              type="button"
            >
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
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </button>

            {/* 닫기 버튼 */}
            <button
              onClick={onClose}
              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-content text-white flex items-center justify-center transition-colors cursor-pointer"
              type="button"
            >
              ✕
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ImageModal
