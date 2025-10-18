import { DEADLY_ASSAULT_KEY, API_KEY, BASE_URL, SHEET_ID, SHEET_RANGE } from './constant'
import { setSheetValues } from './utils'
import { pipe } from '@fxts/core'

function getDeadlyAssault() {
  return pipe(
    `${BASE_URL}/${SHEET_ID}/values/${SHEET_RANGE.DEADLY_ASSAULT}?key=${API_KEY}`,
    (url) => fetch(url),
    (response) => response.json() as Promise<{ values: Array<Array<string>> }>,
    ({ values }) => values,
    setSheetValues(DEADLY_ASSAULT_KEY)
  )
}

export default getDeadlyAssault
