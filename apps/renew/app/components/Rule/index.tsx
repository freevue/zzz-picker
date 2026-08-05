import { Dialog } from '..'
import Caption from './Caption'
import Card from './Card'
import OList from './OList'
import Strong from './Strong'
import UList from './UList'
import { join, map, pipe, toArray, zipWithIndex } from '@fxts/core'

type Props = {
  active: boolean
  onClose: () => void
}

const Title: React.FC<{ children: React.ReactNode }> = (props) => {
  return <p className="ft-pre text-xl text-ink font-bold mb-2">{props.children}</p>
}
const Typo: React.FC<{ children: React.ReactNode; className?: string }> = (props) => {
  return (
    <p className={pipe(['ft-pre text-lg text-ink font-medium', props.className || ''], join(' '))}>
      {props.children}
    </p>
  )
}
const Rule: React.FC<Props> = (props) => {
  return (
    <Dialog
      className="overflow-scroll scrollbar-hidden"
      active={props.active}
      onClose={props.onClose}
      bgClose
    >
      <div className="card max-w-2xl w-screen mx-auto my-40 p-8 rounded-3xl">
        <h1 className="ft-ria text-4xl text-primary mb-8">Rule</h1>
        <div className="mb-6">
          <Title>엔강대 경기 종류</Title>
          <Card>
            <UList
              list={[
                <Typo className="text-xl text-primary font-medium">정식 로프꾼</Typo>,
                <Typo className="text-xl text-primary font-medium">레전드 로프꾼</Typo>,
                <Typo className="text-xl text-primary font-medium">언리미티드(UL) 공허사냥꾼</Typo>,
              ]}
            />
            <Typo>
              선수는 A와 B로 구분되며, A선수가 먼저 진행합니다. <br />
              모든 경기는 <Strong>총 2라운드</Strong>로 구성되며, 각각 강습전을 진행합니다.
            </Typo>
            <Typo className="mt-4">각각의 경기에 따라, 별도의 룰이 적용됩니다.</Typo>
          </Card>
        </div>
        <div className="mb-6">
          <Title>주의 사항</Title>
          <Card>
            <Typo>
              참가자(선수)분들은 디스코드 화면 <Strong>공유(송출)</Strong>이 가능해야합니다.
              <br />
              송출이 가능하다면, 모바일/PC 유저 구분없이 참여가 가능합니다.
            </Typo>
            <Typo className="mt-4">
              다만, 화면 송출이 불가할 정도의 딜레이가 있거나 진행에 어려움이 있다면,{' '}
              <Strong>판정패</Strong> 처리될 수 있습니다.
            </Typo>
          </Card>
        </div>
        <div>
          <details open name="common-rule">
            <summary className="cursor-pointer ft-pre text-xl text-ink font-bold mb-2">
              참가신청
            </summary>
            <Card>
              <Typo>
                참가 신청은{' '}
                <a
                  href="https://playsquad.gg/p/nzoetv/home"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <Strong>[플레이 스쿼드]</Strong>
                </a>
                사이트의 <Strong>[스쿼드]</Strong>를 통해서 신청이 가능합니다.
              </Typo>
              <Typo className="mt-4">
                룰렛을 통해 모집되며, 처음 뽑힌 선수가 <Strong>A선수</Strong>, 두 번째로 뽑힌 선수가{' '}
                <Strong>B선수</Strong>로 구분 됩니다.
              </Typo>
              <Typo className="mt-4">
                모집 된 참가자는 자동으로 <Strong>nZoe 방송 디스코드</Strong>에 초대되며,
                <Strong>시참 대기방</Strong>으로 참여하게 됩니다.
              </Typo>
              <Typo className="mt-4">시참 대기방에서 채팅을 통해 다음 단계가 진행됩니다.</Typo>
            </Card>
          </details>
          <details name="common-rule" className="mt-4">
            <summary className="cursor-pointer ft-pre text-xl text-ink font-bold mb-2">
              캐릭터 밴
            </summary>
            <Card>
              <OList
                list={[
                  <Typo>
                    <Strong>A선수</Strong>가 먼저 진행합니다. <Strong>S급픽업 캐릭터 2개</Strong>
                    를 선택합니다. <br />
                    <Caption>이때 글로벌 노밴 캐릭터는 선택할 수 없습니다.</Caption>
                  </Typo>,
                  <Typo>
                    <Strong>B선수</Strong>는 선택된 캐릭터중 하나를 선택하여 밴합니다.
                  </Typo>,
                  <Typo>
                    <Strong>B선수</Strong>는 이전에 밴이 된 캐릭터와 다른 포지션의{' '}
                    <Strong>S급픽업 캐릭터 2개</Strong>를 선택합니다. <br />
                    <Caption>딜러 포지션 (강공, 이상, 명파)</Caption> <br />
                    <Caption>서포터 포지션 (지원, 격파, 방어)</Caption>
                  </Typo>,
                  <Typo>
                    <Strong>A선수</Strong>는 이 중 한가지를 선택하여 최종 밴을 완성합니다.
                  </Typo>,
                ]}
              />
              <Typo>
                캐릭터는 <Strong>총 2개</Strong>가 밴이 됩니다.
              </Typo>
            </Card>
          </details>
          <details name="common-rule" className="mt-4">
            <summary className="cursor-pointer ft-pre text-xl text-ink font-bold mb-2">
              점수
            </summary>
            <Card>
              <Typo>아래 조건에 따라 추가 보너스를 지급합니다.</Typo>
              <OList
                list={[
                  <Typo>
                    각 라운드를 <Strong>3분 이내</Strong> 클리어시 1초당 <Strong>333점</Strong>{' '}
                    보너스를 지급합니다.
                  </Typo>,
                  <Typo>
                    사용하고 남은 잔여 Cost당 <Strong>5%</Strong>의 보너스를 지급합니다. <br />
                    <Caption>기준은 라운드 점수 합산이며, 정식 로프꾼 경기에만 적용됩니다.</Caption>
                  </Typo>,
                ]}
              />
              <Typo className="mt-4">
                최종 계산 방식은 아래와 같습니다. <br />(<Caption>1라운드 점수</Caption> +{' '}
                <Caption>2라운드 점수</Caption>) x <Caption>Cost 보너스 배율</Caption> +{' '}
                <Caption>시간 보너스</Caption> = <Strong>총점</Strong>
              </Typo>
            </Card>
          </details>
        </div>
      </div>
    </Dialog>
  )
}

export default Rule
