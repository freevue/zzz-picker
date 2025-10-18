type Props = {
  className?: string
}

const Save: React.FC<Props> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className || ''}
    >
      <path d="M17 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7z" />
      <path d="M17 3v4H7V3" />
      <rect x="9" y="13" width="6" height="4" rx="1" />
    </svg>
  )
}

export default Save
