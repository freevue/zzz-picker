import Item from './Item'
import Tip from './Tip'
import { pipe, map, toArray, zipWithIndex } from '@fxts/core'
import { Typo } from '@zzz-picker/components/v2'
import type { AgentId, SelectAgent } from '@zzz-picker/constant'

type Props = {
  banList: SelectAgent[]
  banCandidates: AgentId[]
}

/**
 * 밴의 상태를 보여주는 Host 전용 컴포넌트입니다.
 */

const Ban: React.FC<Props> = (props) => {
  return (
    <>
      <Typo.Heading className="heading-3xl text-primary mb-4">Ban Agent</Typo.Heading>
      <div className="w-fit mt-4 relative">
        <ul className="card bg-base min-h-24 flex w-fit">
          {pipe(
            props.banList,
            zipWithIndex,
            map(([index, id]) => <Item key={index} id={id} />),
            toArray
          )}
        </ul>
        <Tip list={props.banCandidates} />
      </div>
    </>
  )
}

export default Ban
