type Props = {
  children: React.ReactNode
}

const Strong: React.FC<Props> = (props) => {
  return <strong className="text-primary font-bold">{props.children}</strong>
}

export default Strong
