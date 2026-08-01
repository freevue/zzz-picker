import { Dialog } from '..'
import Card from './Card'
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
const UList: React.FC<{ list: Array<React.ReactNode> }> = (props) => {
  return (
    <ul className="list-disc pl-6 ft-pre mb-4">
      {pipe(
        props.list,
        zipWithIndex,
        map(([index, label]) => <li key={index}>{label}</li>),
        toArray
      )}
    </ul>
  )
}
const Rule: React.FC<Props> = (props) => {
  return (
    <Dialog active={props.active} onClose={props.onClose}>
      <div className="card max-w-xl mx-auto mt-40 p-8 rounded-3xl">
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
              모든 경기는 <span className="text-primary">총 2라운드</span>로 구성되며, 각각 강습전을
              진행합니다.
            </Typo>
            <Typo className="mt-4">각각의 경기에 따라, 별도의 룰이 적용됩니다.</Typo>
          </Card>
        </div>
        <div>
          <Title>주의 사항</Title>
          <Card>
            <Typo>
              참가자(선수)분들은 디스코드 화면 <span className="text-primary">공유(송출)</span>이
              가능해야합니다.
              <br />
              송출이 가능하다면, 모바일/PC 유저 구분없이 참여가 가능합니다.
            </Typo>
            <Typo className="mt-4">
              다만, 화면 송출이 불가할 정도의 딜레이가 있거나 진행에 어려움이 있다면,{' '}
              <span className="text-primary">판정패</span> 처리될 수 있습니다.
            </Typo>
          </Card>
        </div>
      </div>
    </Dialog>
  )
}

export default Rule
