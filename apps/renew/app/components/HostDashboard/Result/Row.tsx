import { concat, join, pipe } from '@fxts/core'

type Props = {
  title: string
  value: [number, number]
  primary?: boolean
  append?: React.ReactNode
  error?: (value: number) => boolean
}

const Row: React.FC<Props> = (props) => {
  return (
    <div className="flex w-full justify-center gap-8 ft-pre items-center flex-1 relative">
      <p
        className={pipe(
          ['flex-1', 'text-right', 'ft-ria'],
          concat(props.primary ? ['text-2xl', 'text-primary'] : ['text-xl']),
          concat(props.error?.(props.value[0]) ? ['text-tertiary'] : []),
          join(' ')
        )}
      >
        {props.value[0].toLocaleString()}
      </p>
      <p
        className={pipe(
          ['w-60', 'text-center'],
          concat(props.primary ? ['text-xl', 'font-bold'] : ['text-lg', 'font-medium']),
          join(' ')
        )}
      >
        {props.title}
      </p>
      <p
        className={pipe(
          ['flex-1', 'text-left', 'ft-ria'],
          concat(props.primary ? ['text-2xl', 'text-primary'] : ['text-xl']),
          concat(props.error?.(props.value[1]) ? ['text-tertiary'] : []),
          join(' ')
        )}
      >
        {props.value[1].toLocaleString()}
      </p>
      {props.append && (
        <p className="absolute -bottom-2 ft-pre text-lg opacity-70">{props.append}</p>
      )}
    </div>
  )
}

export default Row
