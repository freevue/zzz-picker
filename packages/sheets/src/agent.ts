import { AGENT_KEY, API_KEY, BASE_URL, SHEET_ID, SHEET_RANGE } from './constant'
import type { Agent } from './types.d'
import { setSheetValues } from './utils'
import { pipe } from '@fxts/core'

function getAgent() {
  return pipe(
    `${BASE_URL}/${SHEET_ID}/values/${SHEET_RANGE.AGENT}?key=${API_KEY}`,
    (url) => fetch(url),
    (response) => response.json() as Promise<{ values: Array<Array<string>> }>,
    ({ values }) => values,
    setSheetValues(AGENT_KEY)
  ) as Promise<Agent[]>
}

export default getAgent
