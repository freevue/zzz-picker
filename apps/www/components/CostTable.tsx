import { Icons } from '@zzz-picker/components'
import { Table, Typo } from '@zzz-picker/components/v2'
import { DEFAULT_COST_RATE } from '@zzz-picker/constant'
import { useSetting } from '@zzz-picker/provider/hooks'

const CostTable: React.FC = () => {
  const { state, costTable, setCostTable } = useSetting()

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCostTable(event.target.name, Number(event.target.value))
  }

  return (
    <div className="p-4 mt-auto">
      <div className="flex items-end justify-between mb-4">
        <Typo.Heading className="heading-3xl text-primary">Cost</Typo.Heading>
        <Typo.Body className="body-xl text-secondary flex items-start">
          <span>설정 Cost:</span>
          <span className="ml-1">
            {state.totalCost === Infinity ? (
              <Icons.Infinity className="size-7 stroke-secondary" />
            ) : (
              state.totalCost
            )}
          </span>
        </Typo.Body>
      </div>
      <div className="flex flex-col gap-4 relative">
        <Table>
          <tr>
            <Table.Th className="text-primary">캐릭터 구분</Table.Th>
            <Table.Th>사용</Table.Th>
            <Table.Th>돌파당</Table.Th>
          </tr>
          <tr>
            <Table.Th>S 픽업</Table.Th>
            <Table.Td
              name="sPickAgent.used"
              value={costTable.sPickAgent.used}
              onChange={onChange}
            />
            <Table.Td
              name="sPickAgent.rate"
              value={costTable.sPickAgent.rate}
              onChange={onChange}
            />
          </tr>
          <tr>
            <Table.Th>S 상시</Table.Th>
            <Table.Td
              name="sAlwaysAgent.used"
              value={costTable.sAlwaysAgent.used}
              onChange={onChange}
            />
            <Table.Td
              name="sAlwaysAgent.rate"
              value={costTable.sAlwaysAgent.rate}
              onChange={onChange}
            />
          </tr>
          <tr>
            <Table.Th>A 상시</Table.Th>
            <Table.Td
              name="aAlwaysAgent.used"
              value={costTable.aAlwaysAgent.used}
              onChange={onChange}
            />
            <Table.Td
              name="aAlwaysAgent.rate"
              value={costTable.aAlwaysAgent.rate}
              onChange={onChange}
            />
          </tr>
        </Table>
        <Table>
          <tr>
            <Table.Th className="text-primary">엔진 구분</Table.Th>
            <Table.Th>사용</Table.Th>
            <Table.Th>돌파당</Table.Th>
          </tr>
          <tr>
            <Table.Th>전용 무기</Table.Th>
            <Table.Td
              name="sExclusiveEngine.used"
              value={costTable.sExclusiveEngine.used}
              onChange={onChange}
            />
            <Table.Td
              name="sExclusiveEngine.rate"
              value={costTable.sExclusiveEngine.rate}
              onChange={onChange}
            />
          </tr>
          <tr>
            <Table.Th>S</Table.Th>
            <Table.Td name="sEngine.used" value={costTable.sEngine.used} onChange={onChange} />
            <Table.Td
              name="sEngine.rate"
              value={costTable.sEngine.rate}
              onChange={onChange}
              append={
                <span className="text-sm block px-2 text-foreground/70 text-center">
                  4 ~ 5인 경우
                </span>
              }
            />
          </tr>
          <tr>
            <Table.Th>A</Table.Th>
            <Table.Td name="aEngine.used" value={costTable.aEngine.used} onChange={onChange} />
            <Table.Td name="aEngine.rate" value={costTable.aEngine.rate} onChange={onChange} />
          </tr>
        </Table>
        <Typo.Body className="body-sm text-ink">
          현재 Cost 배율은 1코스트당 {DEFAULT_COST_RATE * 100}% 입니다. (숫자를 클릭하면 수정이
          가능합니다.)
        </Typo.Body>
      </div>
    </div>
  )
}

export default CostTable
