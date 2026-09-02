import { concat, join, map, pipe, toArray } from '@fxts/core'
import { useEffect, useMemo, useState } from 'react'

type Props = {
  year: number
  month: number
  active: boolean
  onActive: (value: string) => void
  onClose: () => void
}

const WALLPAPER_HOST = 'https://images.zzz.freevue.dev/images/wallpaper'
const CANDIDATE_EXTENSIONS = ['jpg', 'png']
const WALLPAPER_TRANSITION_API_CLASS = 'wallpaper-top'
const WallpaperImage: React.FC<Props> = (props) => {
  const [extIndex, setExtIndex] = useState<number>(0)
  const src = useMemo(() => {
    return `${WALLPAPER_HOST}/${props.year}/${props.month}/pc.${CANDIDATE_EXTENSIONS[extIndex]}`
  }, [extIndex])
  const viewTransitionName = useMemo(() => {
    return `wallpaper-${props.year}-${props.month}`
  }, [props.year, props.month])

  useEffect(() => {
    const image = new Image()

    image.onerror = () => {
      setExtIndex((prev) => (prev < CANDIDATE_EXTENSIONS.length - 1 ? prev + 1 : prev))
    }
    image.src = src
  }, [src])

  const onActive = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    pipe(event.currentTarget, ({ value }) => {
      document.startViewTransition(() => props.onActive(value))
    })
  }
  const onClose = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    document.startViewTransition(() => props.onClose())
  }

  return (
    <div
      className={pipe(
        ['w-dvw', 'max-w-lg', 'snap-center', 'snap-always', 'px-8'],
        concat([]),
        join(' ')
      )}
    >
      {/* TODO: 활성화되는 카드에 대해 z-index값확인 필요. (가끔 z-index가 적용이 안되는 경우가 있음) */}
      {props.active ? (
        <button
          type="button"
          onClick={onClose}
          className={pipe(
            ['rounded-2xl', 'overflow-hidden', 'aspect-video', 'bg-accent', 'w-5xl', 'block'],
            concat(['fixed-center', 'z-50']),
            join(' ')
          )}
          style={{
            viewTransitionName: viewTransitionName,
            viewTransitionClass: WALLPAPER_TRANSITION_API_CLASS,
          }}
        >
          <img className="block w-full" src={src} alt="" />
        </button>
      ) : (
        <button
          type="button"
          onClick={onActive}
          value={`${props.year}-${props.month}`}
          className={pipe(
            ['rounded-2xl', 'overflow-hidden', 'aspect-video', 'bg-accent'],
            concat([]),
            join(' ')
          )}
          style={{ viewTransitionName: viewTransitionName }}
        >
          <img className="block w-full" src={src} alt="" />
        </button>
      )}
    </div>
  )
}
const Wallpaper: React.FC = () => {
  const [active, setActive] = useState<string>('')
  const onWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    event.currentTarget.scrollBy({ left: event.deltaY * 2.5, behavior: 'smooth' })
  }

  return (
    <div className="w-dvw h-dvh flex-center overflow-hidden">
      <div
        className={pipe(
          ['w-full', 'h-full', 'scrollbar-hidden', 'overflow-auto', 'snap-mandatory', 'snap-x'],
          join(' ')
        )}
        onWheel={onWheel}
      >
        <div className="flex w-fit h-full items-center px-[50vw]">
          {/* TODO: 연도 및 월 별 정렬기준 추가. */}
          {pipe(
            [9, 8, 7, 6, 5],
            map((month) => (
              <WallpaperImage
                key={month}
                year={2026}
                month={month}
                active={active === `${2026}-${month}`}
                onActive={setActive}
                onClose={() => setActive('')}
              />
            )),
            toArray
          )}
        </div>
      </div>
    </div>
  )
}

export default Wallpaper
