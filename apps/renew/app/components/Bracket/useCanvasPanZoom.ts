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

  const onWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault()
    if (event.deltaY === 0) return

    const zoomFactor = event.deltaY < 0 ? 1.08 : 0.92
    setTransform((prev) => ({
      ...prev,
      scale: Math.min(Math.max(prev.scale * zoomFactor, 0.4), 2.5),
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
