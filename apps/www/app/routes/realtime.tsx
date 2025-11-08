import { Outlet } from '@remix-run/react'
import { Socket } from '@zzz-picker/provider'

const Realtime: React.FC = () => {
  return (
    <Socket>
      <div className="size-full flex flex-col justify-center gap-10 overflow-y-auto">
        <div className="w-max mx-auto p-10">
          <Outlet />
        </div>
      </div>
    </Socket>
  )
}

export default Realtime
