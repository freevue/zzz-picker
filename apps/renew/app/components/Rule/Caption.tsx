type Props = React.HTMLAttributes<HTMLSpanElement>

const Caption: React.FC<Props> = (props) => {
  return <span className="body-sm text-ink/70 bg-content p-1 rounded-md" {...props} />
}

export default Caption
