type Props = {
  className?: string
}

const Infinity: React.FC<Props> = (props) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={props.className || ''} viewBox="0 0 100 100">
      <path
        d="M10 50
           C10 20 40 20 50 50
           C60 80 90 80 90 50
           C90 20 60 20 50 50
           C40 80 10 80 10 50"
        fill="none"
        stroke="currentColor"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default Infinity
