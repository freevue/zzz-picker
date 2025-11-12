import { Outlet } from '@remix-run/react'

const Realtime: React.FC = () => {
  return (
    <div className="size-full flex flex-col justify-center gap-10 overflow-y-auto">
      <div className="w-max mx-auto p-10">
        <Outlet />
      </div>
    </div>
  )
}

export default Realtime
