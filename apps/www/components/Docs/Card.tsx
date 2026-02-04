type Props = {
  children: React.ReactNode
}

const Card: React.FC<Props> = (props) => {
  return <div className="flex flex-col gap-2.5 bg-base/70 p-6 card">{props.children}</div>
}

export default Card
