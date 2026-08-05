import { pipe, map, zipWithIndex, toArray } from '@fxts/core'

type Props = {
  list: Array<React.ReactNode>
}

const UList: React.FC<Props> = (props) => {
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

export default UList
