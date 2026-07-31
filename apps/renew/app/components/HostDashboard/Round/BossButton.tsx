import { concat, isUndefined, join, pipe } from '@fxts/core'
import { Boss } from '~/type'

type Props = {
  boss?: Boss
}

const BossButton: React.FC<Props> = (props) => {
  return (
    <button type="button" className={pipe(['rounded-2xl', 'size-20', 'bg-accent'], join(' '))}>
      {isUndefined(props.boss) ? (
        <></>
      ) : (
        <div className="rounded-xl w-full h-full overflow-hidden">
          <img className="w-full block bg-ink" src={props.boss.src} />
        </div>
      )}
    </button>
  )
}

export default BossButton
