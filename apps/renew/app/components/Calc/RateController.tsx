import { isNumber } from '@fxts/core'

type Props = {
  rate: number | null
  onSubmit: (event: React.MouseEvent<HTMLButtonElement>) => void
  onChange: (event: React.MouseEvent<HTMLButtonElement>) => void
}

const RateController: React.FC<Props> = (props) => {
  return (
    <div className="sticky bottom-4 left-0 right-0 max-w-lg mx-auto mt-auto z-10">
      {isNumber(props.rate) && (
        <div className="flex justify-between mb-4 bg-accent rounded-full">
          <button
            type="button"
            value="-1"
            onClick={props.onChange}
            className="cursor-pointer size-18 bg-primary text-6xl rounded-full"
          >
            -
          </button>
          <p className="text-5xl ft-ria flex items-center justify-center px-4 text-primary">
            {props.rate}
          </p>
          <button
            type="button"
            value="1"
            onClick={props.onChange}
            className="cursor-pointer size-18 bg-primary text-6xl rounded-full"
          >
            +
          </button>
        </div>
      )}
      <button
        type="button"
        onClick={props.onSubmit}
        className="h-18 ft-ria cursor-pointer block text-3xl z-20 rounded-full bg-primary text-accent w-full ft-pre font-black"
      >
        확인
      </button>
    </div>
  )
}

export default RateController
