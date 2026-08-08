import { filter, map, pipe, toArray } from '@fxts/core'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useStore } from '~/hooks'

const DISPLAY_DURATION_MS = 5000
const FADE_DURATION_MS = 1200

// 필요 시점에 순차적으로 1개 이미지만 비동기 prefetch (깜빡임 방지 & 메모리 최적화)
const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve()
    img.onerror = () => resolve()
    img.src = src
  })
}

// 이전 출현 이미지와 중복되지 않는 무작위 다음 인덱스 추출
const getNextRandomIndex = (currentIndex: number, totalLength: number): number => {
  if (totalLength <= 1) return 0
  let nextIndex = currentIndex
  while (nextIndex === currentIndex) {
    nextIndex = Math.floor(Math.random() * totalLength)
  }
  return nextIndex
}

// 줌인/줌아웃, 방향, 축소/확대, 회전 등 완벽 무작위 모션 매개변수 생성
const generateRandomMotion = () => {
  const startScale = (1.0 + Math.random() * 0.15).toFixed(3)
  const endScale = (1.0 + Math.random() * 0.15).toFixed(3)

  const startX = ((Math.random() - 0.5) * 10).toFixed(2)
  const startY = ((Math.random() - 0.5) * 10).toFixed(2)
  const endX = ((Math.random() - 0.5) * 10).toFixed(2)
  const endY = ((Math.random() - 0.5) * 10).toFixed(2)

  const startRotate = ((Math.random() - 0.5) * 3).toFixed(2)
  const endRotate = ((Math.random() - 0.5) * 3).toFixed(2)

  return {
    start: `scale(${startScale}) translate(${startX}%, ${startY}%) rotate(${startRotate}deg)`,
    end: `scale(${endScale}) translate(${endX}%, ${endY}%) rotate(${endRotate}deg)`,
  }
}

// 이중 레이어 무작위 슬라이더 커스텀 훅
const useUnlimitedSlideshow = () => {
  const store = useStore()

  // fxts pipe를 활용한 에이전트 이미지 추출
  const imageUrls = useMemo(() => {
    return pipe(
      store.agents.values(),
      map((agent) => agent.banner),
      filter((url): url is string => Boolean(url)),
      toArray
    )
  }, [store.agents])

  const [activeLayer, setActiveLayer] = useState<'A' | 'B'>('A')
  const [urlA, setUrlA] = useState<string | null>(null)
  const [urlB, setUrlB] = useState<string | null>(null)

  const activeLayerRef = useRef<'A' | 'B'>('A')
  activeLayerRef.current = activeLayer

  const currentIndexRef = useRef<number>(0)
  const isTransitioningRef = useRef<boolean>(false)

  useEffect(() => {
    if (imageUrls.length === 0) return

    let isMounted = true
    let timerId: NodeJS.Timeout

    const initFirstImage = async () => {
      const initialIndex = Math.floor(Math.random() * imageUrls.length)
      const firstUrl = imageUrls[initialIndex]
      await preloadImage(firstUrl)
      if (!isMounted) return

      setUrlA(firstUrl)
      currentIndexRef.current = initialIndex
    }

    initFirstImage()

    const interval = setInterval(async () => {
      if (imageUrls.length <= 1 || isTransitioningRef.current) return

      isTransitioningRef.current = true

      // 무작위 다음 이미지 인덱스 선별
      const nextIndex = getNextRandomIndex(currentIndexRef.current, imageUrls.length)
      const nextUrl = imageUrls[nextIndex]

      await preloadImage(nextUrl)
      if (!isMounted) return

      currentIndexRef.current = nextIndex

      const currentActive = activeLayerRef.current
      if (currentActive === 'A') {
        setUrlB(nextUrl)
        setActiveLayer('B')
      } else {
        setUrlA(nextUrl)
        setActiveLayer('A')
      }

      timerId = setTimeout(() => {
        if (isMounted) {
          isTransitioningRef.current = false
        }
      }, FADE_DURATION_MS)
    }, DISPLAY_DURATION_MS)

    return () => {
      isMounted = false
      clearInterval(interval)
      if (timerId) clearTimeout(timerId)
    }
  }, [imageUrls])

  return { urlA, urlB, activeLayer }
}

type SlideItemProps = {
  url: string
  isActive: boolean
}

// 각 슬라이드 레이어별 다채로운 무작위 Ken Burns 애니메이션 컴포넌트
const SlideItem: React.FC<SlideItemProps> = (props) => {
  const [startAnimation, setStartAnimation] = useState(false)

  // 이미지 렌더링 시마다 고유한 무작위 시작/종료 transform 생성
  const motion = useMemo(() => generateRandomMotion(), [props.url])

  useEffect(() => {
    setStartAnimation(false)
    const timer = setTimeout(() => {
      setStartAnimation(true)
    }, 50)
    return () => clearTimeout(timer)
  }, [props.url])

  return (
    <div
      className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
        props.isActive ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <img
        src={props.url}
        alt="Unlimited Card Background Slide"
        className="w-full h-full object-cover transition-transform duration-[6500ms] ease-out"
        style={{
          transform: startAnimation ? motion.end : motion.start,
        }}
      />
    </div>
  )
}

const UnlimitedCard: React.FC = () => {
  const slideshow = useUnlimitedSlideshow()

  return (
    <div className="absolute inset-0 overflow-hidden card pointer-events-none -z-0">
      {slideshow.urlA && (
        <SlideItem url={slideshow.urlA} isActive={slideshow.activeLayer === 'A'} />
      )}
      {slideshow.urlB && (
        <SlideItem url={slideshow.urlB} isActive={slideshow.activeLayer === 'B'} />
      )}
    </div>
  )
}

export default UnlimitedCard
