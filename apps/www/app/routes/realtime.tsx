import { Outlet } from '@remix-run/react'

export const Realtime: React.FC = () => {
  return (
    <div className="size-full">
      <Outlet />
    </div>
  )
}

export default Realtime
