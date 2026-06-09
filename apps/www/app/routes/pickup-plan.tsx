import type { MetaFunction } from '@remix-run/node'
import { useStore } from '@zzz-picker/provider/hooks'
import { useEffect, useMemo, useState } from 'react'
import { usePickupCanvas } from '~/app/hooks/usePickupCanvas'
import { AgentGrid, PreviewModal } from '~/components/PickupPlan'

export const meta: MetaFunction = () => {
  return [
    { title: 'ZZZ 픽업 플랜 | zzz-picker' },
    { name: 'description', content: '여러분의 픽업 플랜을 보여주세요!' },
  ]
}

type Agent = {
  id: number
  nameKo: string
  profile: {
    url: string
  }
  rarity: string
  isPickup: boolean
  isTeaser: boolean
  engine?: Array<{
    iconUrl?: string
    imageUrl: string
    nameKo: string
  }>
}

const PickupPlanPage: React.FC = () => {
  const { agents } = useStore()

  // v2 다크테마 바인딩
  useEffect(() => {
    document.documentElement.classList.add('v2')
    return () => {
      document.documentElement.classList.remove('v2')
    }
  }, [])

  // 캐릭터별 클릭 상태 저장 (0: 비활성 회색, 1: 컬러 활성, 2: 컬러 + 무기)
  const [clickStates, setClickStates] = useState<Record<number, number>>({})

  // 미리보기 이미지 URL 상태 (null이 아니면 모달 팝업 오픈)
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null)
  const [isCapturing, setIsCapturing] = useState(false)

  // S급 isPickup 캐릭터만 필터링 (최신 캐릭터순 정렬)
  const pickupAgents = useMemo(() => {
    return Array.from(agents.values())
      .filter((agent) => agent.rarity === 'S' && agent.isPickup)
      .sort((first, second) => second.id - first.id) as Agent[]
  }, [agents])

  // 현재 활성화된 에이전트만 필터링 (상태가 1 또는 2인 에이전트)
  const activeAgents = useMemo(() => {
    return pickupAgents.filter((agent) => (clickStates[agent.id] || 0) > 0)
  }, [pickupAgents, clickStates])

  const onClickAgent = (agentId: number) => {
    setClickStates((prev) => {
      const current = prev[agentId] || 0
      return {
        ...prev,
        [agentId]: (current + 1) % 3,
      }
    })
  }

  const onStartCapture = () => {
    setIsCapturing(true)
  }

  const onEndCapture = () => {
    setIsCapturing(false)
  }

  const onSuccessCapture = (dataUrl: string) => {
    setPreviewImageUrl(dataUrl)
  }

  // HTML5 Canvas를 이용해 활성화된 캐릭터 이미지 직접 그리기 및 다운로드 제어 훅
  const { generateImage, downloadImage } = usePickupCanvas({
    activeAgents,
    clickStates,
    onStartCapture,
    onEndCapture,
    onSuccess: onSuccessCapture,
  })

  const onClickPreview = () => {
    generateImage()
  }

  const onClickCloseModal = () => {
    setPreviewImageUrl(null)
  }

  const onClickDownload = () => {
    downloadImage(previewImageUrl)
  }

  return (
    <div className="w-full h-screen bg-[var(--color-base)] text-[var(--color-ink)] p-4 font-sans select-none flex flex-col items-center justify-between relative">
      <div className="max-w-[720px] w-full flex-1 flex flex-col gap-4 overflow-hidden">
        
        {/* 캐릭터 그리드 영역 */}
        <AgentGrid
          pickupAgents={pickupAgents}
          clickStates={clickStates}
          onClickAgent={onClickAgent}
        />

        {/* 저장 버튼 영역 (하단 고정) */}
        <div className="w-full py-4 border-t border-[var(--color-netural)]/20 flex justify-end items-center bg-[var(--color-base)]">
          <button
            onClick={onClickPreview}
            disabled={isCapturing}
            className={`w-full py-3.5 rounded-lg font-black tracking-wider text-sm transition-all flex items-center justify-center gap-2 shadow-lg ${
              isCapturing
                ? 'bg-[var(--color-netural)] text-[var(--color-ink)]/30 cursor-not-allowed'
                : 'bg-[var(--color-primary)] text-[var(--color-base)] hover:opacity-90 active:scale-95 shadow-[var(--color-primary)]/10'
            }`}
          >
            {isCapturing ? (
              <>
                <span className="w-4 h-4 border-2 border-[var(--color-ink)]/30 border-t-[var(--color-ink)] rounded-full animate-spin" />
                이미지 생성 중...
              </>
            ) : (
              <span>이미지 저장하기</span>
            )}
          </button>
        </div>

      </div>

      {/* 미리보기 팝업 모달 */}
      {previewImageUrl && (
        <PreviewModal
          imageUrl={previewImageUrl}
          onClose={onClickCloseModal}
          onDownload={onClickDownload}
        />
      )}
    </div>
  )
}

export default PickupPlanPage
