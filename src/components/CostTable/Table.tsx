import { pipe, concat, join } from '@fxts/core'

type Props = {
  children: React.ReactNode
  className?: string
}

const Table: React.FC<Props> = (props) => {
  return (
    <table className={pipe(['w-full'], concat([props.className || '']), join(' '))}>
      <colgroup>
        <col width="*" />
        <col width="40%" />
        <col width="40%" />
      </colgroup>
      <tbody>{props.children}</tbody>
    </table>
  )
}

export default Table
