import { Typo } from '@zzz-picker/components/v2'
import { useStore } from '@zzz-picker/provider/hooks'
import { History } from '~/components'

const HistoryPage: React.FC = () => {
  const { agents } = useStore()

  return (
    <div className="size-full snap-y overflow-auto scrollbar-hidden">
      <History.AppleTitle title="엔강대 시즌2" />
      <History.AppleSection>
        <Typo.Body className="text-ink body-3xl text-center">
          시즌1의 통계와는 다른 재미있는 부분을 가지고 왔습니다.
        </Typo.Body>
        <Typo.Body className="text-ink body-3xl text-center">
          시즌2에는 어떤 일이 있었는지 확인해보겠습니다.
        </Typo.Body>
        <Typo.Body className="text-ink body-3xl text-center">
          (개발자 취향 100% 존중 데이터)
        </Typo.Body>
      </History.AppleSection>
      <History.AppleTitle title="좀.. 너무하던데요?" />
      <History.AppleSection>
        <Typo.Body className="text-ink body-3xl text-center">
          주로 강습전에 사용되는 캐릭터는 정해져있습니다.
        </Typo.Body>
        <Typo.Body className="text-ink body-3xl text-center">
          그러다보니 벤 또한 정해져있습니다.
        </Typo.Body>
        <div className="flex flex-col gap-3 items-center">
          <img className="w-lg block" src={agents.get(125210)!.banner.url} alt="카이사르" />
          <Typo.Body className="text-ink body-3xl text-center">
            카이사르는 총 3번 버림받으면서 제일 많이 벤되었습니다.
          </Typo.Body>
        </div>
      </History.AppleSection>
      <History.AppleTitle title="드디어 휴고의 붐은 오나?" />
      <History.AppleSection>
        <Typo.Body className="text-ink body-3xl text-center">
          이번에 휴고는 픽업기간을 가졌습니다.
        </Typo.Body>
        <Typo.Body className="text-ink body-3xl text-center">
          다이아린이라는 버프도 받으며, 혹시나 하는 많은 기대감도 받았습니다.
        </Typo.Body>
        <Typo.Body className="text-ink body-3xl text-center">
          결산이라는 매커니즘이 참 재미있는 캐릭터이지요.
        </Typo.Body>
        <div className="flex flex-col gap-3 items-center">
          <img className="w-lg block" src={agents.get(154609)!.banner.url} alt="휴고" />
          <Typo.Body className="text-ink body-3xl text-center">
            총 13번의 경기중 1번 선택되었습니다. (픽율: 7.69%)
          </Typo.Body>
        </div>
      </History.AppleSection>
      <History.AppleTitle title="그러면 다이아린은?" />
      <History.AppleSection>
        <Typo.Body className="text-ink body-3xl text-center">
          휴고와 같은 픽업기간을 가진 귀염둥이 다이라린입니다.
        </Typo.Body>
        <Typo.Body className="text-ink body-3xl text-center">
          아... 그런데 다이아린... 진짜 너무 이쁘게 나왔음...
        </Typo.Body>
        <Typo.Body className="text-ink body-3xl text-center">다이아린... 진짜 이쁨...</Typo.Body>
        <div className="flex flex-col gap-3 items-center">
          <img className="w-lg block" src={agents.get(160142)!.banner.url} alt="다이아린" />
          <Typo.Body className="text-ink body-3xl text-center">
            총 13번의 경기중 11번 선택되었습니다. (픽율: 84.62%)
          </Typo.Body>
        </div>
      </History.AppleSection>
      <History.AppleTitle title="흠..." />
      <History.AppleSection>
        <div className="flex flex-col gap-3 items-center">
          <img className="w-lg block" src={agents.get(156728)!.banner.url} alt="앨리스" />
          <Typo.Body className="text-ink body-3xl text-center">
            그래도 얘가 제일 이쁘다. <br />총 13번의 경기중 4번 선택되었습니다. (픽율: 30.77%)
          </Typo.Body>
        </div>
        <div className="flex flex-col gap-3 items-center">
          <img
            className="w-lg block"
            src="https://act-webstatic.hoyoverse.com/event-static-hoyowiki-admin/2025/08/04/c59b51460d98d087a33ef9d73b554f71_1193586350942325219.png?x-oss-process=image%2Fformat%2Cwebp"
            alt="앨리스"
          />
          <Typo.Body className="text-ink body-3xl text-center">히히...</Typo.Body>
        </div>
        <div className="flex flex-col gap-3 items-center">
          <img
            className="w-6xl block rounded-tr-4xl rounded-bl-4xl overflow-hidden"
            src="/images/02.jpg"
            alt="앨리스"
          />
          <Typo.Body className="text-ink body-3xl text-center">헤헤...</Typo.Body>
        </div>
        <div className="flex flex-col gap-3 items-center">
          <img
            className="w-6xl block rounded-tr-4xl rounded-bl-4xl overflow-hidden"
            src="/images/14.jpg"
            alt="앨리스"
          />
          <Typo.Body className="text-ink body-3xl text-center">끗!! 모두 3영창 하시길</Typo.Body>
        </div>
      </History.AppleSection>
    </div>
  )
}

export default HistoryPage
