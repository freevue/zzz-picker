type Props = {
  className?: string
}

const Edit: React.FC<Props> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={props.className}
    >
      <rect x="3" y="4" width="14" height="17" rx="2" ry="2"></rect>
      <line x1="6" y1="8" x2="14" y2="8"></line>
      <line x1="6" y1="12" x2="12" y2="12"></line>
      <path d="M16 16l5-5a1 1 0 0 0-1.41-1.41L14.5 14.5l-.5 2 2-.5z"></path>
    </svg>
  )
}

export default Edit
