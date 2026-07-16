import { Boss } from '~/type'

type Props = {
  boss: Boss
}

const CommonBoss: React.FC<Props> = (props) => {
  return (
    <>
      <div className="card disabled:cursor-default focus:outline-0 active:outline-0 rounded-2xl size-48 overflow-hidden p-2 block">
        <div className="w-full h-full overflow-hidden rounded-xl">
          <img
            className="block w-full aspect-144/199 bg-ink"
            src={props.boss.src}
            alt={props.boss.nameKo}
          />
        </div>
      </div>
      {/* <div className="pt-4 flex-1">
        <h2 className="ft-ria text-xl">{props.boss.nameKo}</h2>
      </div> */}
    </>
  )
}

export default CommonBoss
