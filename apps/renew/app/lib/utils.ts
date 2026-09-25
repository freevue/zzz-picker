import type { Agent, Engine } from '@/type'
import {
  each,
  entries,
  filter,
  find,
  flat,
  flatMap,
  groupBy,
  includes,
  isArray,
  isObject,
  join,
  map,
  max,
  pipe,
  sort,
  sum,
  toAsync,
} from '@fxts/core'
import { DEALER, Position, Role, Specialty, SETTING } from '~/constant'

type OpponentMap = {
  [Role.A_SIDE]: Role.B_SIDE
  [Role.B_SIDE]: Role.A_SIDE
  [Role.HOST]: Role.HOST
}

export function hook(callback: (state: never) => void) {
  return <T>(state: T): T => {
    callback(state as never)

    return state
  }
}

export function replaceAt(index: number, value: unknown) {
  return function* <T>(iterable: Iterable<T>): Generator {
    for (const item of iterable) {
      yield index === 0 ? value : item

      index--
    }
  }
}

export function opponent<T extends Role>(role: T): OpponentMap[T] {
  const opponentMap: OpponentMap = {
    [Role.A_SIDE]: Role.B_SIDE,
    [Role.B_SIDE]: Role.A_SIDE,
    [Role.HOST]: Role.HOST,
  }

  return opponentMap[role]
}

export function isBanFix(
  proposeBan: Array<number | null>,
  selectBan: Array<number | null>
): boolean {
  if (includes(null, proposeBan)) return false

  return includes(null, selectBan)
}

export function getPosition(specialty: (typeof Specialty)[keyof typeof Specialty]) {
  if (includes(specialty, DEALER)) return Position.DEALER

  return Position.SUPPORT
}

export function agentCost(rate: Record<number, number>) {
  return (agents: Agent[]) => {
    const costMap = pipe(
      agents,
      map((agent) => agent.cost),
      map(sort((prev, cur) => prev.rate - cur.rate)),
      flat,
      groupBy((cost) => cost.agentId)
    )

    return pipe(
      rate,
      entries,
      filter(([agentId]) => isArray(costMap[agentId])),
      map(([agentId, value]) => find(({ rate }) => rate === value, costMap[agentId])),
      filter(isObject),
      map(({ cost }) => cost),
      sum
    )
  }
}

export function engineCost(rate: Record<string, number>) {
  return (engines: Engine[]) => {
    const costMap = pipe(
      engines,
      map((engine) => engine.cost),
      map(sort((prev, cur) => prev.rate - cur.rate)),
      flat,
      groupBy((cost) => cost.engineId)
    )

    return pipe(
      rate,
      entries,
      filter(([engineId]) => isArray(costMap[engineId])),
      map(([engineId, value]) => find(({ rate }) => rate === value, costMap[engineId])!),
      filter(isObject),
      map(({ cost }) => cost),
      sum
    )
  }
}

export function calcTimeScore(
  maxTime: number = SETTING.ROUND_TIME_LIMIT,
  bonus: number = SETTING.TIME_BONUS_PER_SECOND
) {
  return (time: number) => {
    if (time === 0) return 0

    return pipe([maxTime - time, 0], max, (value) => value * bonus)
  }
}

export function calcCostBonuse(
  maxCost: number = SETTING.TOTAL_COST,
  plusRate: number = SETTING.PLUS_RATE,
  minusRate: number = SETTING.MINUS_RATE
) {
  return (cost: number) => {
    if (cost > maxCost) return (maxCost - cost) * minusRate

    return (maxCost - cost) * plusRate
  }
}

export function fileReader(src: string) {
  return new Promise<string>((resolve) => {
    const reader = new FileReader()

    reader.onloadend = () => resolve(reader.result as string)
    pipe(
      src,
      fetch,
      (response) => response.blob(),
      (blob) => reader.readAsDataURL(blob)
    )
  })
}

export function getStyleText() {
  return pipe(
    Array.from(document.styleSheets),
    flatMap((sheet) => Array.from(sheet.cssRules)),
    map((rules) => rules.cssText),
    join('\n')
  )
}

export async function deepCloneElement<T extends HTMLElement>(element: T) {
  const changeUrl = (src: string) => {
    if (import.meta.env.DEV) {
      const url = new URL(src)

      return `/r2-proxy${url.pathname}`
    }

    return src
  }
  const clone = element.cloneNode(true) as T

  await pipe(
    Array.from(clone.querySelectorAll('img')),
    toAsync,
    each(async (image) => {
      image.src = await pipe(image.src, changeUrl, fileReader)
    })
  )

  return clone
}

export function elementToImage(gap: number = 0) {
  return async <T extends HTMLElement>(element: T): Promise<string> => {
    return await pipe(
      element,
      deepCloneElement,
      (deepCloneNode) => {
        const svg = document.createElement('svg')
        const foreignObject = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'foreignObject'
        )

        svg.setAttribute('width', '100%')
        svg.setAttribute('height', '100%')
        svg.setAttribute(
          'viewBox',
          `0 0 ${element.offsetWidth + gap * 2} ${element.offsetHeight + gap * 2}`
        )

        foreignObject.setAttribute('width', '100%')
        foreignObject.setAttribute('height', '100%')
        foreignObject.setAttribute('x', '0')
        foreignObject.setAttribute('y', '0')
        foreignObject.setAttribute('externalResourceRequired', 'true')

        svg.append(foreignObject)
        foreignObject.append(deepCloneNode)

        return svg
      },
      (svgElement) => new XMLSerializer().serializeToString(svgElement),
      (data) => encodeURIComponent(data),
      (html) => `data:image/svg+xml;base64,${html}`
    )
  }
}
