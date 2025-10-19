type Props = {
  className?: string
}

const Refresh: React.FC<Props> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
      className={props.className || ''}
    >
      <path fill="none" d="M21 12a9 9 0 1 1-2.6-6.1" />
      <path fill="none" d="M21 3v6h-6" />
    </svg>
  )
}

export default Refresh
