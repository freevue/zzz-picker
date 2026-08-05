type Props = React.HTMLAttributes<HTMLSpanElement>

const Strong: React.FC<Props> = (props) => {
  return <span className="text-primary font-bold" {...props} />
}

export default Strong
