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
          시즌1은 순수 통계 데이터만 소개해 드렸습니다.
        </Typo.Body>
        <Typo.Body className="text-ink body-3xl text-center">
          시즌2는 조금 다른 통계를 가지고 왔습니다.
        </Typo.Body>
        <Typo.Body className="text-ink body-3xl text-center">
          (그저 100% 개발자 취향 데이터)
        </Typo.Body>
      </History.AppleSection>
      <History.AppleTitle title="이런 방식으로 사용이 가능하군요." />
      <History.AppleSection>
        <Typo.Body className="text-ink body-3xl text-center">
          강습전에 인기 있는 캐릭터는 정해져있습니다.
        </Typo.Body>
        <Typo.Body className="text-ink body-3xl text-center">
          자연스럽게 그 캐릭터들은 밴율이 올라갑니다.
        </Typo.Body>
        <div className="flex flex-col gap-3 items-center">
          <img className="w-lg block" src={agents.get(125210)!.banner.url} alt="카이사르" />
          <Typo.Body className="text-ink body-3xl text-center">
            카이사르는 총 3회 밴으로 가장 높은 밴율을 기록했습니다.
            <br />
            (심지어 단독임..)
          </Typo.Body>
        </div>
      </History.AppleSection>
      <History.AppleTitle title="휴고의 봄은 왔는가?" />
      <History.AppleSection>
        <Typo.Body className="text-ink body-3xl text-center">
          휴고는 이번에 픽업 기간을 가지게 되었습니다.
        </Typo.Body>
        <Typo.Body className="text-ink body-3xl text-center">
          다이아린과 같이 활용하는 방법으로 많은 기대감을 모았습니다.
        </Typo.Body>
        <Typo.Body className="text-ink body-3xl text-center">
          '결산' 매커니즘으로 굉장히 재미있게 게임을 즐길 수 있는 캐릭터죠.
        </Typo.Body>
        <div className="flex flex-col gap-3 items-center">
          <img className="w-lg block" src={agents.get(154609)!.banner.url} alt="휴고" />
          <Typo.Body className="text-ink body-3xl text-center">
            13경기 중 총 1번 선택받았습니다. (픽률: 7.69%)
          </Typo.Body>
        </div>
      </History.AppleSection>
      <History.AppleTitle title="그렇다면 다이아린은?" />
      <History.AppleSection>
        <Typo.Body className="text-ink body-3xl text-center">
          이번 신규 캐릭터로 나온 다이아린입니다.
        </Typo.Body>
        <Typo.Body className="text-ink body-3xl text-center">
          그런데... 다이아린 진짜 너무 이쁘게 나왔음...
        </Typo.Body>
        <Typo.Body className="text-ink body-3xl text-center">
          진짜... 진짜 디자인부터 성능이랑 재미까지 너무 매력적임...
        </Typo.Body>
        <div className="flex flex-col gap-3 items-center">
          {/* <img className="w-lg block" src={agents.get(160142)!.banner.url} alt="다이아린" /> */}
          <img
            className="w-6xl block rounded-tr-4xl rounded-bl-4xl overflow-hidden"
            src="/images/Dialyn/09.png"
            alt="다이아린"
          />
          <Typo.Body className="text-ink body-3xl text-center">
            13경기 중 총 11번 선택받았습니다. (픽률: 84.62%)
          </Typo.Body>
        </div>
      </History.AppleSection>
      <History.AppleTitle title="흠..." />
      <History.AppleSection>
        <div className="flex flex-col gap-3 items-center">
          <img className="w-lg block" src={agents.get(156728)!.banner.url} alt="앨리스" />
          <Typo.Body className="text-ink body-3xl text-center">
            앨리스는 13경기 중 총 4번 선택받았습니다.
          </Typo.Body>
        </div>
        <div className="flex flex-col gap-3 items-center">
          <img
            className="w-6xl block rounded-tr-4xl rounded-bl-4xl overflow-hidden"
            src="/images/04.jpg"
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
            src="/images/15.jpg"
            alt="앨리스"
          />
          <Typo.Body className="text-ink body-3xl text-center">끗! 모두 3영창 받으세요~</Typo.Body>
        </div>
        <div className="flex gap-10 items-center">
          <img
            className="w-lg block rounded-tr-4xl rounded-bl-4xl overflow-hidden"
            src="/images/100.jpeg"
            alt="앨리스"
          />
          <Typo.Heading className="text-primary text-left heading-huge italic">
            Happy <br />
            New Year!!
          </Typo.Heading>
        </div>
      </History.AppleSection>
    </div>
  )
}

export default HistoryPage
