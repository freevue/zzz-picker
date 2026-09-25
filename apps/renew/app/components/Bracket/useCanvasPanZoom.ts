import { useState, useRef } from 'react'

export const useCanvasPanZoom = () => {
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 })
  const [isDragging, setIsDragging] = useState(false)
  const dragStartRef = useRef({ x: 0, y: 0 })

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    // 마우스 좌클릭만 드래그 시작
    if (e.button !== 0) return
    setIsDragging(true)
    dragStartRef.current = {
      x: e.clientX - transform.x,
      y: e.clientY - transform.y,
    }
  }

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return
    setTransform((prev) => ({
      ...prev,
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y,
    }))
  }

  const onMouseUp = () => {
    setIsDragging(false)
  }

  const onWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    // Ctrl 키 또는 Meta(Mac Cmd) 키가 눌려있으면 줌 동작
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault()
      const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92
      setTransform((prev) => {
        const nextScale = Math.min(Math.max(prev.scale * zoomFactor, 0.4), 2.5)
        return {
          ...prev,
          scale: nextScale,
        }
      })
      return
    }

    // 일반 휠 스크롤 시 화면 상하/좌우 팬 이동
    setTransform((prev) => ({
      ...prev,
      x: prev.x - e.deltaX,
      y: prev.y - e.deltaY,
    }))
  }

  const onResetView = () => {
    setTransform({ x: 0, y: 0, scale: 1 })
  }

  return {
    transform,
    isDragging,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onWheel,
    onResetView,
  }
}
