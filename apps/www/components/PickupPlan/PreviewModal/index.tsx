import React from 'react'

type Props = {
  imageUrl: string
  onClose: () => void
  onDownload: () => void
}

const PreviewModal: React.FC<Props> = (props) => {
  const onClickClose = () => {
    props.onClose()
  }

  const onClickDownload = () => {
    props.onDownload()
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn"
    >
      <div className="bg-[var(--color-content)] rounded-xl border border-[var(--color-netural)] max-w-[580px] w-full p-6 flex flex-col gap-4 shadow-2xl max-h-[90vh] overflow-y-auto animate-scaleIn">
        
        {/* 상단 ✕ 버튼 */}
        <div className="flex justify-between items-center">
          <h2 id="modal-title" className="text-sm font-black text-[var(--color-ink)]">
            픽업 플랜 이미지 미리보기
          </h2>
          <button
            onClick={onClickClose}
            aria-label="미리보기 모달 닫기"
            className="text-[var(--color-ink)]/50 hover:text-[var(--color-ink)] text-lg font-bold py-1 px-2"
          >
            ✕
          </button>
        </div>

        {/* 캡처된 미리보기 이미지 */}
        <div className="w-full flex items-center justify-center bg-[var(--color-base)] p-3 rounded-lg">
          <img
            src={props.imageUrl}
            alt="생성된 픽업 플랜 결과물 미리보기"
            className="max-w-full h-auto rounded shadow"
          />
        </div>

        {/* 모달 하단 버튼 제어 영역 */}
        <div className="flex gap-3 mt-2">
          <button
            onClick={onClickClose}
            className="flex-1 py-3 bg-[var(--color-netural)] text-[var(--color-ink)]/80 hover:bg-[var(--color-netural)]/80 rounded-lg text-xs font-black tracking-wider transition-all"
          >
            닫기
          </button>
          <button
            onClick={onClickDownload}
            className="flex-1 py-3 bg-[var(--color-primary)] text-[var(--color-base)] hover:opacity-90 rounded-lg text-xs font-black tracking-wider transition-all shadow-[var(--color-primary)]/10 shadow-lg"
          >
            이미지 저장
          </button>
        </div>
      </div>
    </div>
  )
}

export default PreviewModal
