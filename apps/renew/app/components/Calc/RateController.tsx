import { isNumber } from '@fxts/core'
import { Plus, Minus } from 'lucide-react'

type Props = {
  rate: number | null
  onSubmit: (event: React.MouseEvent<HTMLButtonElement>) => void
  onChange: (event: React.MouseEvent<HTMLButtonElement>) => void
}

const RateController: React.FC<Props> = (props) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 max-w-lg mx-auto z-10">
      {isNumber(props.rate) && (
        <div className="flex justify-between mb-4 bg-accent rounded-full">
          <button
            type="button"
            value="-1"
            onClick={props.onChange}
            className="cursor-pointer size-14 bg-primary text-6xl rounded-full text-content"
          >
            <Minus className="mx-auto size-10" strokeWidth={3} />
          </button>
          <p className="text-4xl ft-ria flex items-center justify-center px-4 text-primary">
            {props.rate}
          </p>
          <button
            type="button"
            value="1"
            onClick={props.onChange}
            className="cursor-pointer size-14 bg-primary text-6xl rounded-full text-content"
          >
            <Plus className="mx-auto size-10" strokeWidth={3} />
          </button>
        </div>
      )}
      <button
        type="button"
        onClick={props.onSubmit}
        className="h-14 ft-ria cursor-pointer block text-3xl z-20 rounded-full bg-primary text-accent w-full ft-pre font-black"
      >
        확인
      </button>
    </div>
  )
}

export default RateController
