type Props = {
  children: React.ReactNode
}

const Caption: React.FC<Props> = (props) => {
  return <span className="body-sm text-ink/70 bg-content p-1 rounded-md">{props.children}</span>
}

export default Caption
