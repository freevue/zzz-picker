import Table from './Table'
import Td from './Td'
import Th from './Th'
import { useSetting } from '@/hooks'
import { Icons, Typo } from '@zzz-picker/components'
import { DEFAULT_COST_RATE } from '@zzz-picker/constant'

const CostTable: React.FC = () => {
  const { state, costTable } = useSetting()

  return (
    <div className="p-4">
      <div className="flex items-end justify-between mb-4">
        <Typo.Heading primary>Cost</Typo.Heading>
        <p className="text-xl text-secondary font-bold flex items-end">
          <span>설정 Cost:</span>
          <span className="ml-1">
            {state.totalCost === Infinity ? (
              <Icons.Infinity className="size-7 stroke-secondary" />
            ) : (
              state.totalCost
            )}
          </span>
        </p>
      </div>
      <div className="flex flex-col gap-4 relative">
        <Table>
          <tr>
            <Th className="text-primary">캐릭터 구분</Th>
            <Th>사용</Th>
            <Th>돌파당</Th>
          </tr>
          <tr>
            <Th>S 픽업</Th>
            <Td name="sPickAgent.used" value={costTable.sPickAgent.used} />
            <Td name="sPickAgent.rate" value={costTable.sPickAgent.rate} />
          </tr>
          <tr>
            <Th>S 상시</Th>
            <Td name="sAlwaysAgent.used" value={costTable.sAlwaysAgent.used} />
            <Td name="sAlwaysAgent.rate" value={costTable.sAlwaysAgent.rate} />
          </tr>
          <tr>
            <Th>A 상시</Th>
            <Td name="aAlwaysAgent.used" value={costTable.aAlwaysAgent.used} />
            <Td name="aAlwaysAgent.rate" value={costTable.aAlwaysAgent.rate} />
          </tr>
        </Table>
        <Table>
          <tr>
            <Th className="text-primary">엔진 구분</Th>
            <Th>사용</Th>
            <Th>돌파당</Th>
          </tr>
          <tr>
            <Th>전용 무기</Th>
            <Td name="sExclusiveEngine.used" value={costTable.sExclusiveEngine.used} />
            <Td name="sExclusiveEngine.rate" value={costTable.sExclusiveEngine.rate} />
          </tr>
          <tr>
            <Th>S</Th>
            <Td name="sEngine.used" value={costTable.sEngine.used} />
            <Td
              name="sEngine.rate"
              value={costTable.sEngine.rate}
              append={
                <span className="text-sm block px-2 text-foreground/70 text-center">
                  4 ~ 5인 경우
                </span>
              }
            />
          </tr>
          <tr>
            <Th>A</Th>
            <Td name="aEngine.used" value={costTable.aEngine.used} />
            <Td name="aEngine.rate" value={costTable.aEngine.rate} />
          </tr>
        </Table>
        <p className="text-sm text-foreground/70">
          현재 Cost 배율은 1코스트당 {DEFAULT_COST_RATE * 100}% 입니다. (숫자를 클릭하면 수정이
          가능합니다.)
        </p>
      </div>
    </div>
  )
}

export default CostTable
