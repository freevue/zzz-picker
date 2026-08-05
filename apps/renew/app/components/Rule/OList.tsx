import { pipe, map, zipWithIndex, toArray } from '@fxts/core'

type Props = {
  list: Array<React.ReactNode>
}

const OList: React.FC<Props> = (props) => {
  return (
    <ol className="list-decimal pl-6 ft-pre mb-4">
      {pipe(
        props.list,
        zipWithIndex,
        map(([index, label]) => <li key={index}>{label}</li>),
        toArray
      )}
    </ol>
  )
}

export default OList
