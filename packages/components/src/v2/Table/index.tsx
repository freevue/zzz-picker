import Td from './Td'
import Th from './Th'
import { pipe, concat, join } from '@fxts/core'

type Props = {
  children: React.ReactNode
  className?: string
}
type TableType = React.FC<Props> & {
  Td: typeof Td
  Th: typeof Th
}

const Table: TableType = (props) => {
  return (
    <div
      className={pipe(
        ['w-full', 'card-2', 'border', 'border-solid', 'border-secondary'],
        concat([props.className || '']),
        join(' ')
      )}
    >
      <table className="w-full">
        <colgroup>
          <col width="*" />
          <col width="40%" />
          <col width="40%" />
        </colgroup>
        <tbody>{props.children}</tbody>
      </table>
    </div>
  )
}

Table.Td = Td
Table.Th = Th

export default Table
