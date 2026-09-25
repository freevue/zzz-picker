import React from 'react'

const LINE_COLOR = 'rgba(255, 210, 21, 0.25)'

const BracketLines: React.FC = () => {
  return (
    <svg className="absolute inset-0 pointer-events-none w-full h-full -z-10">
      {/* QF 1 & QF 2 -> SF 1 */}
      <path
        d="M 288 88 H 336 V 218 H 384"
        fill="none"
        stroke={LINE_COLOR}
        strokeWidth="1.5"
      />
      <path
        d="M 288 348 H 336 V 218"
        fill="none"
        stroke={LINE_COLOR}
        strokeWidth="1.5"
      />

      {/* QF 3 & QF 4 -> SF 2 */}
      <path
        d="M 288 608 H 336 V 738 H 384"
        fill="none"
        stroke={LINE_COLOR}
        strokeWidth="1.5"
      />
      <path
        d="M 288 868 H 336 V 738"
        fill="none"
        stroke={LINE_COLOR}
        strokeWidth="1.5"
      />

      {/* SF 1 & SF 2 -> Finals */}
      <path
        d="M 672 218 H 720 V 478 H 768"
        fill="none"
        stroke={LINE_COLOR}
        strokeWidth="1.5"
      />
      <path
        d="M 672 738 H 720 V 478"
        fill="none"
        stroke={LINE_COLOR}
        strokeWidth="1.5"
      />
    </svg>
  )
}

export default BracketLines
