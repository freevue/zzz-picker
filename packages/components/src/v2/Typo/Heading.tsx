import { pipe, concat, join } from '@fxts/core'

type Props = {
  heading?: 1 | 2 | 3 | 4 | 5 | 6
  children: React.ReactNode
  className?: string
}

const Heading: React.FC<Props> = (props) => {
  const Tag = `h${props.heading || 1}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

  return (
    <Tag className={pipe(['text-ink'], concat([props.className || '']), join(' '))}>
      {props.children}
    </Tag>
  )
}

export default Heading
