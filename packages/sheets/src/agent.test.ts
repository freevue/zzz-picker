import getAgentData from './agent'
import { NAVER_GAME_API_URL, HOYOVERSE_ZZZ_API_URL, NAVER_CHZZK_API_URL } from './constant'
import { isNull, map, pipe, toArray } from '@fxts/core'
import { readFileSync } from 'fs'
import { join } from 'path'
import { describe, test, expect } from 'vitest'

const sheets = await getAgentData()
const [agents, { avatar_icon, buddy_icon }] = pipe(
  ['agents.mock.json', 'icons.mock.json'],
  map((fileName) => join(__dirname, '__tests__', fileName)),
  map((path) => readFileSync(path, 'utf-8')),
  map((data) => JSON.parse(data)),
  toArray
)
const naverDB = await pipe(
  NAVER_GAME_API_URL,
  fetch,
  (response) => response.json(),
  ({ result: { character } }) => character
)
const hoyoverseZZZDB = await pipe(
  HOYOVERSE_ZZZ_API_URL,
  fetch,
  (response) => response.json(),
  ({ data: { list } }) => list
)

describe('에지전트 데이터 무결성 확인', () => {
  describe.each(sheets)('$nameKo 데이터 무결성 확인', async (data) => {
    if (!isNull(data.hoyolabId)) {
      const { square_avatar, vertical_painting, vertical_painting_color } =
        avatar_icon[data.hoyolabId]

      test('호요랩 프로필 이미지 검증', () => {
        expect(data.labSquareImage).toBe(square_avatar)
      })
      test('호요랩 배너 이미지 검증', () => {
        expect(data.labVerticalImage).toBe(vertical_painting)
      })
      test('호요랩 색상 검증', () => {
        expect(data.color).toBe(vertical_painting_color)
      })
    }
    if (!isNull(data.naverChzzkId)) {
      const { profileImage, bannerImage } = await pipe(
        `${NAVER_CHZZK_API_URL}/${data.naverChzzkId}`,
        fetch,
        (response) => response.json(),
        ({ intro }) => ({
          profileImage: intro.imageUrl,
          bannerImage: intro.images[0].imageUrl,
        })
      )

      test('치지직 프로필 이미지 검증', () => {
        expect(data.chzzkSquareImage).toBe(profileImage)
      })
      test('치지직 배너 이미지 검증', () => {
        expect(data.chzzkBannerImage).toBe(bannerImage)
      })
    }

    expect(typeof data.nameKo === 'string').toBe(true)
  })
})
