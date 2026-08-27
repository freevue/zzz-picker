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
  toArray,
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

export function calcTimeScore(time: number) {
  if (time === 0) return 0

  const MAX_TIME = 180
  const BONUSE_SCORE = 333

  return pipe([MAX_TIME - time, 0], max, (value) => value * BONUSE_SCORE)
}

export function calcCostBonuse(MAX_COST: number = 24, minusRate: number = SETTING.MINUS_RATE) {
  return (cost: number) => {
    if (cost > MAX_COST) return (MAX_COST - cost) * minusRate

    return (MAX_COST - cost) * 0.05
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
