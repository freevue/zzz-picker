import { CreateRoom } from '@/components'
import { useState } from 'react'

export default function Index() {
  const [active, setActive] = useState(false)
  const onClick = async () => {
    setActive((prev) => !prev)
  }

  return (
    <>
      <div className="flex h-full w-full flex-col items-center justify-center gap-10 p-6">
        <div className="flex gap-20">
          <button
            onClick={onClick}
            className="w-60 card p-3 rounded-3xl cursor-pointer text-2xl ft-ria"
            type="button"
          >
            <img
              className="block w-full rounded-2xl mb-4"
              src="https://images.zzz.freevue.dev/images/logo/ef9ec605-5fe4-4728-901b-af4f8790958b.webp"
              alt="강습전"
            />
            <span>강습전</span>
          </button>
          <button
            onClick={onClick}
            disabled
            className="w-60 card p-3 rounded-3xl cursor-not-allowed text-4xl ft-ria"
            type="button"
          >
            모의전투
            {/* <img
            className="block w-full rounded-2xl"
            src="https://images.zzz.freevue.dev/images/logo/ef9ec605-5fe4-4728-901b-af4f8790958b.webp"
            alt="강습전"
          /> */}
          </button>
        </div>
      </div>
      {active && <CreateRoom acvite={active} />}
    </>
  )
}
