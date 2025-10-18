import { pipe, slice, map, toArray, isUndefined } from '@fxts/core'

type Sheet = Record<string, string | number | boolean | null>

function setSheetValues<
  T extends { [key: string]: string | number },
  E extends Array<Array<string>>,
>(list: T, keySet: E): Array<Sheet>
function setSheetValues<
  T extends { [key: string]: string | number },
  E extends Array<Array<string>>,
>(list: T): (keySet: E) => Array<Sheet>

function setSheetValues<
  T extends { [key: string]: string | number },
  E extends Array<Array<string>>,
>(keySet: T, list?: E) {
  if (isUndefined(list)) {
    return (currentList: E) => setSheetValues(keySet, currentList)
  }

  const sheetKeys = pipe(
    list[0],
    map((value) => keySet[value]),
    toArray
  )

  return pipe(
    list,
    slice(1),
    map((value) => {
      const agent: Sheet = {}

      for (let index = 0; index < sheetKeys.length; index++) {
        if (value[index] === '') {
          agent[sheetKeys[index]] = null

          continue
        }
        if (!isNaN(Number(value[index]))) {
          agent[sheetKeys[index]] = Number(value[index])

          continue
        }
        if (value[index] === 'TRUE') {
          agent[sheetKeys[index]] = true

          continue
        }
        if (value[index] === 'FALSE') {
          agent[sheetKeys[index]] = false

          continue
        }

        agent[sheetKeys[index]] = value[index]
      }

      return agent
    }),
    toArray
  )
}

export default setSheetValues
