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
    <table
      className={pipe(
        ['w-full', 'overflow-hidden', 'rounded-bl-3xl', 'rounded-tr-3xl'],
        concat([props.className || '']),
        join(' ')
      )}
    >
      <colgroup>
        <col width="*" />
        <col width="40%" />
        <col width="40%" />
      </colgroup>
      <tbody>{props.children}</tbody>
    </table>
  )
}

Table.Td = Td
Table.Th = Th

export default Table
