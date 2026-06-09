import type { MetaFunction } from '@remix-run/node'
import { useStore } from '@zzz-picker/provider/hooks'
import { useEffect, useMemo, useState } from 'react'
import { usePickupCanvas } from '~/app/hooks/usePickupCanvas'
import { AgentGrid, PreviewModal } from '~/components/PickupPlan'

export const meta: MetaFunction = ({ matches }) => {
  const parentMeta = matches.flatMap((match) => match.meta ?? [])

  const filteredParentMeta = parentMeta.filter((m: any) => {
    if ('title' in m) return false
    if (
      'name' in m &&
      typeof m.name === 'string' &&
      ['description', 'twitter:title', 'twitter:description'].includes(m.name)
    )
      return false
    if (
      'property' in m &&
      typeof m.property === 'string' &&
      ['og:title', 'og:description'].includes(m.property)
    )
      return false
    return true
  })

  return [
    ...filteredParentMeta,
    { title: 'ZZZ 픽업 플랜 | zzz-picker' },
    { name: 'description', content: '여러분의 픽업 플랜을 보여주세요!' },
    { property: 'og:title', content: 'ZZZ 픽업 플랜 | zzz-picker' },
    { property: 'og:description', content: '여러분의 픽업 플랜을 보여주세요!' },
    { name: 'twitter:title', content: 'ZZZ 픽업 플랜 | zzz-picker' },
    { name: 'twitter:description', content: '여러분의 픽업 플랜을 보여주세요!' },
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
    <div className="w-full h-screen bg-[var(--color-base)] text-[var(--color-ink)] p-4 font-sans select-none relative overflow-y-auto scrollbar-hidden">
      <div className="max-w-[720px] w-full pb-20">
        {/* 캐릭터 그리드 영역 */}
        <AgentGrid
          pickupAgents={pickupAgents}
          clickStates={clickStates}
          onClickAgent={onClickAgent}
        />

        {/* 저장 버튼 영역 (하단 고정) */}
        <div className="p-4 fixed left-0 bottom-0 right-0">
          <button
            onClick={onClickPreview}
            disabled={isCapturing}
            className={`w-full py-3.5 rounded-lg font-black tracking-wider text-sm transition-all flex items-center justify-center gap-2 ${
              isCapturing ? 'bg-neutral text-ink/30 cursor-not-allowed' : 'bg-primary text-base'
            }`}
          >
            {isCapturing ? (
              <>
                <span className="w-4 h-4 border-2 border-ink/30 border-t-ink rounded-full animate-spin" />
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
