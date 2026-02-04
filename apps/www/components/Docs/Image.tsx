import { pipe, join, concat } from '@fxts/core'

type Props = {
  src: string
  alt: string
  className?: string
}

const Image: React.FC<Props> = (props) => {
  return (
    <div className={pipe(['w-full', 'card-2'], concat([props.className || '']), join(' '))}>
      <img src={props.src} alt={props.alt} className="block w-full" />
    </div>
  )
}

export default Image
