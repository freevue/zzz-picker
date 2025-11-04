import { Agent } from '../'
import { Icons } from '../../'
import { pipe, concat, join, map, toArray, zipWithIndex } from '@fxts/core'
import { useAgent } from '@zzz-picker/provider/hooks'

type AgentValue = {
  id: number
  url: string
  color?: string
}
type Props = {
  value: (AgentValue | null)[]
  className?: string
  children?: React.ReactNode
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  onClick?: (index: number) => void
}

const Party: React.FC<Props> = (props) => {
  const agent = useAgent(1)

  const onClick = (index: number) => () => {
    props.onClick?.(index)
  }

  return (
    <div className={pipe(['flex'], concat([]), join(' '))}>
      {pipe(
        props.value,
        zipWithIndex,
        map(([index, agent]) => (
          <div
            className={pipe(
              ['group', 'relative'],
              concat([
                'not-last:after:content-[""]',
                'not-last:after:block',
                'not-last:after:absolute',
                'not-last:after:w-0.5',
                'not-last:after:rounded-full',
                'not-last:after:h-2/3',
                'not-last:after:bg-foreground',
                'not-last:after:right-0',
                'not-last:after:top-1/2',
                'not-last:after:translate-x-1/2',
                'not-last:after:-translate-y-1/2',
                'not-last:after:z-10',
              ]),
              join(' ')
            )}
          >
            <Agent.Button
              onClick={onClick(index)}
              value={agent?.id}
              className={pipe(
                ['group-not-first:rounded-bl-none', 'group-not-last:rounded-tr-none'],
                join(' ')
              )}
              key={index}
              url={agent?.url || undefined}
              size={props.size}
              color={agent?.color || undefined}
            >
              <Icons.Plus className="size-2/3 stroke-foreground" />
            </Agent.Button>
          </div>
        )),
        toArray
      )}
    </div>
  )
}

export default Party
