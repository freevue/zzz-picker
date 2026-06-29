import { useState } from 'react'

const Background: React.FC = () => {
  const [isRendering, setIsRendering] = useState(false)

  return (
    <div className="fixed inset-0 -z-10">
      <p className="ft-aggravo text-9xl font-black text-primary/10">nCore</p>
      <p className="ft-aggravo text-9xl font-black text-primary/10">엔코르</p>
    </div>
  )
}

export default Background
