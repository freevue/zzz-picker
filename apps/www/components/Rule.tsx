import { List, Strong, Text, Wrapper, Caption } from './Docs'
import { Dialog, Typo, Tabs, Table } from '@zzz-picker/components/v2'
import { useState, Activity } from 'react'

const Rule: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [gameRuleTab, setGameRuleTab] = useState('정식 로프꾼 경기')
  const [commonRuleTab, setCommonRuleTab] = useState('참가신청')

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="text-ink/70 body-lg hover:text-primary cursor-pointer focus:outline-none"
      >
        경기 룰
      </button>
      <Dialog isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="flex flex-col gap-4 w-2xl">
          <Typo.Heading className="heading-4xl text-primary">Rule</Typo.Heading>
          <div className="flex flex-col gap-8">
            <Wrapper title="엔강대는 3개의 경기로 분류됩니다.">
              <List
                className="list-disc"
                list={[
                  <Text>
                    <Strong>정식 로프꾼 경기</Strong>
                  </Text>,
                  <Text>
                    <Strong>레전드 로프꾼 경기</Strong>
                  </Text>,
                  <Text>
                    <Strong>언리미티드(UL) 공허사냥꾼 경기</Strong>
                  </Text>,
                ]}
              />
              <Text>
                선수는 A와 B로 구분되며, A선수가 먼저 진행합니다. <br /> 모든 경기는{' '}
                <Strong>총 2라운드</Strong>로 구성되며, 각각 강습전을 진행합니다.
              </Text>
              <Text>각각의 경기에 따라, 별도의 룰이 적용 됩니다.</Text>
            </Wrapper>
            <Wrapper title="주의 사항">
              <Text>
                참가자 (선수) 분들은, 디스코드 화면 <Strong>공유(송출)</Strong>이 가능해야 합니다.
                <br />
                송출이 가능하다면, 모바일/PC 유저 구분 없이 참여 가능합니다.
              </Text>
              <Text>
                다만, 화면 송출이 불가할 정도의 렉이 있거나 진행에 어려움이 있다면{' '}
                <Strong>판정패</Strong> 처리 될 수 있습니다.
              </Text>
            </Wrapper>
            <Tabs
              list={['참가신청', 'Cost 사용', '캐릭터 밴', '공용무대', '점수']}
              value={commonRuleTab}
              onChange={setCommonRuleTab}
            />
            <Activity mode={commonRuleTab === '참가신청' ? 'visible' : 'hidden'}>
              <Wrapper title="참가신청">
                <List
                  className="list-decimal"
                  list={[
                    <Text>
                      참가 신청은{' '}
                      <Strong>
                        <a
                          href="https://playsquad.gg/p/nzoetv/home"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          [플레이 스쿼드]
                        </a>
                      </Strong>{' '}
                      사이트의 <Strong>[스쿼드]</Strong>를 통해서 신청 가능합니다.
                    </Text>,
                    <Text>
                      룰렛을 통해 모집되며, 처음 뽑힌 선수가 <Strong>A선수</Strong>, 두 번째로 뽑힌
                      선수가 <Strong>B선수</Strong>로 구분 됩니다.
                    </Text>,
                    <Text>
                      모집 된 참가자는 자동으로 <Strong>nZoe 방송 디스코드</Strong>에 초대되며,
                      <Strong>시참 대기방</Strong>으로 참여하게 됩니다.
                    </Text>,
                    <Text>시참 대기방에서 채팅을 통해 다음 단계가 진행됩니다.</Text>,
                  ]}
                />
              </Wrapper>
            </Activity>
            <Activity mode={commonRuleTab === 'Cost 사용' ? 'visible' : 'hidden'}>
              <Wrapper title="Cost 사용">
                <Table>
                  <tr>
                    <Table.Th>캐릭터 구분</Table.Th>
                    <Table.Th>사용</Table.Th>
                    <Table.Th>돌파당</Table.Th>
                  </tr>
                  <tr>
                    <Table.Th>S급 픽업</Table.Th>
                    <Table.Td value={1} name="sPickAgent.used" />
                    <Table.Td value={1} name="sPickAgent.rate" />
                  </tr>
                  <tr>
                    <Table.Th>S급 상시</Table.Th>
                    <Table.Td value={0} name="sAlwaysAgent.used" />
                    <Table.Td value={0} name="sAlwaysAgent.rate" />
                  </tr>
                  <tr>
                    <Table.Th>A급 상시</Table.Th>
                    <Table.Td value={0} name="aAlwaysAgent.used" />
                    <Table.Td value={0} name="aAlwaysAgent.rate" />
                  </tr>
                </Table>
                <Table className="mt-4">
                  <tr>
                    <Table.Th>엔진 구분</Table.Th>
                    <Table.Th>사용</Table.Th>
                    <Table.Th>돌파당</Table.Th>
                  </tr>
                  <tr>
                    <Table.Th>전용 무기</Table.Th>
                    <Table.Td value={1} name="sExclusiveEngine.used" />
                    <Table.Td value={0.5} name="sExclusiveEngine.rate" />
                  </tr>
                  <tr>
                    <Table.Th>S급</Table.Th>
                    <Table.Td value={0} name="sEngine.used" />
                    <Table.Td
                      value={1}
                      name="sEngine.rate"
                      append={<Caption>돌파가 4 ~ 5인 경우 +1</Caption>}
                    />
                  </tr>
                  <tr>
                    <Table.Th>A급</Table.Th>
                    <Table.Td value={0} name="aEngine.used" />
                    <Table.Td value={0} name="aEngine.rate" />
                  </tr>
                </Table>
              </Wrapper>
            </Activity>
            <Activity mode={commonRuleTab === '캐릭터 밴' ? 'visible' : 'hidden'}>
              <Wrapper title="캐릭터 밴">
                <List
                  className="list-decimal"
                  list={[
                    <Text>
                      <Strong>A선수</Strong>가 먼저 진행합니다. <Strong>S급픽업 캐리터 2개</Strong>
                      를 선택합니다. <br />
                      <Caption>이때 글로벌 노밴 캐릭터는 선택할 수 없습니다.</Caption>
                    </Text>,
                    <Text>
                      <Strong>B선수</Strong>는 선택된 캐릭터중 하나를 선택하여 밴합니다.
                    </Text>,
                    <Text>
                      <Strong>B선수</Strong>는 이전에 밴이 된 캐릭터와 다른 포지션의{' '}
                      <Strong>S급픽업 캐리터 2개</Strong>를 선택합니다.
                      <Caption>
                        딜러 포지션 (강공, 이상, 명파) | 서포터 포지션 (지원, 격파, 방어)
                      </Caption>
                    </Text>,
                    <Text>
                      <Strong>A선수</Strong>는 이 중 한가지를 선택하여 최종 밴을 완성합니다.
                      <br />
                    </Text>,
                  ]}
                />
                <Text>
                  캐릭터는 <Strong>총 2개</Strong>가 밴이 됩니다.
                </Text>
              </Wrapper>
            </Activity>
            <Activity mode={commonRuleTab === '공용무대' ? 'visible' : 'hidden'}>
              <Wrapper title="공용무대란?">
                <Text>참가자는 총 2개의 라운드를 진행하게 됩니다.</Text>
                <Text>
                  이때 <Strong>2라운드</Strong>의 경우 참가자들은 같은 무대를 사용하여 강습전을
                  진행해야합니다. <br />
                  공용무대의 경우 <Strong>언리미티드(UL) 공허사냥꾼 경기</Strong>에서는 진행하지
                  않습니다.
                </Text>
              </Wrapper>
            </Activity>
            <Activity mode={commonRuleTab === '점수' ? 'visible' : 'hidden'}>
              <Wrapper title="점수계산">
                <Text>아래 조건에 따라 추가 보너스를 지급합니다.</Text>
                <List
                  className="list-decimal"
                  list={[
                    <Text>
                      각 라운드를 <Strong>3분 이내</Strong> 클리어시 1초당 <Strong>333점</Strong>{' '}
                      보너스를 지급합니다.
                    </Text>,
                    <Text>
                      사용하고 남은 잔여 Cost당 <Strong>5%</Strong>의 보너스를 지급합니다. <br />
                      <Caption>
                        기준은 라운드 점수 합산이며, 정식 로프꾼 경기에만 적용됩니다.
                      </Caption>
                    </Text>,
                  ]}
                />
                <Text>
                  최종 계산 방식은 아래와 같습니다. <br />(<Caption>1라운드 점수</Caption> +{' '}
                  <Caption>2라운드 점수</Caption>) x <Caption>Cost 보너스 배율</Caption> +{' '}
                  <Caption>시간 보너스</Caption> = <Strong>총점</Strong>
                </Text>
              </Wrapper>
            </Activity>
            <Tabs
              list={['정식 로프꾼 경기', '레전드 로프꾼 경기', '언리미티드(UL) 공허사냥꾼 경기']}
              value={gameRuleTab}
              onChange={setGameRuleTab}
            />
            <Activity mode={gameRuleTab === '정식 로프꾼 경기' ? 'visible' : 'hidden'}>
              <Wrapper title="정식 로프꾼 경기">
                <List
                  className="list-decimal"
                  list={[
                    <Text>
                      참가자는 <Strong>24 Cost</Strong>를 가지고 파티를 조합합니다.
                    </Text>,
                    <Text>
                      <Strong>B선수</Strong>가 <Strong>공용무대</Strong>를 선택합니다.
                    </Text>,
                    <Text>
                      참가자는 <Strong>캐릭터 밴</Strong>을 진행합니다.
                    </Text>,
                  ]}
                />
              </Wrapper>
            </Activity>
            <Activity mode={gameRuleTab === '레전드 로프꾼 경기' ? 'visible' : 'hidden'}>
              <Wrapper title="레전드 로프꾼 경기">
                <List
                  className="list-decimal"
                  list={[
                    <Text>
                      참가자는 <Strong>Cost제한 없이</Strong> 파티구성을 할 수 있습니다.
                    </Text>,
                    <Text>
                      <Strong>B선수</Strong>가 <Strong>공용무대</Strong>를 선택합니다.
                    </Text>,
                    <Text>
                      참가자는 <Strong>캐릭터 밴</Strong>을 진행합니다.
                    </Text>,
                  ]}
                />
              </Wrapper>
            </Activity>
            <Activity
              mode={gameRuleTab === '언리미티드(UL) 공허사냥꾼 경기' ? 'visible' : 'hidden'}
            >
              <Wrapper title="언리미티드(UL) 공허사냥꾼 경기">
                <List
                  className="list-disc"
                  list={[
                    <Text>
                      참가자는 <Strong>Cost제한 없이</Strong> 파티구성을 할 수 있습니다.
                    </Text>,
                    <Text>
                      참가자는 <Strong>캐릭터 제한 없이</Strong> 파티구성을 할 수 있습니다.
                    </Text>,
                    <Text>참가자는 2라운드의 무대를 원하는 무대로 선택할 수 있습니다.</Text>,
                    <Text>
                      단, 경기의 퀄리티 유지를 위해 해당 경기에는 <Strong>[실력]</Strong>,{' '}
                      <Strong>[과금]</Strong>에 자신이 있는 선수만이 출전 가능합니다.
                    </Text>,
                    <Text>
                      예능식 참가자는 선발과정 및 진행과정에서 <Strong>판정패</Strong> 될 수
                      있습니다.
                    </Text>,
                  ]}
                />
              </Wrapper>
            </Activity>
          </div>
        </div>
      </Dialog>
    </>
  )
}

export default Rule
