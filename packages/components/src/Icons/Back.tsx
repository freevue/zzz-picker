type Props = {
  className?: string
}

const Back: React.FC<Props> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={props.className || ''}
      role="img"
      stroke="currentColor"
    >
      <path
        d="M15 18l-6-6 6-6"
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default Back
