import Information from './Information'
import { Info, Setting } from '@/Icons'
import useSetting from '@/hooks/useSetting'
import { useState } from 'react'
import { createPortal } from 'react-dom'

const Header = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { onSettingToggle } = useSetting()

  const onInformationClick = () => {
    setIsOpen(true)
  }

  return (
    <>
      <div className="fixed z-10 top-0 left-0 w-full h-16 p-4 bg-base flex items-center">
        <ul className="flex gap-4 items-center">
          <li>
            <a
              href="https://www.youtube.com/@nZoeTV"
              target="_blank"
              className="w-8 cursor-pointer block"
            >
              <img src="/youtube.png" alt="youtube" className="block w-full" />
            </a>
          </li>
          <li>
            <a
              href="https://chzzk.naver.com/458928990cef07696074bb07ef9e93e0"
              target="_blank"
              className="w-8 cursor-pointer block"
            >
              <img src="/chzzk.png" alt="chzzk" className="block w-full" />
            </a>
          </li>
          <li className="border-l border-white/30 pl-4">
            <button
              className="size-5 block cursor-pointer focus:outline-none"
              type="button"
              onClick={onInformationClick}
            >
              <Info className="cursor-pointer stroke-white/70 block w-full" />
            </button>
          </li>
          <li>
            <button
              className="size-5 block cursor-pointer focus:outline-none"
              type="button"
              onClick={onSettingToggle}
            >
              <Setting className="cursor-pointer stroke-white/70 block w-full" />
            </button>
          </li>
        </ul>
      </div>
      {isOpen && createPortal(<Information onClose={() => setIsOpen(false)} />, document.body)}
    </>
  )
}

export default Header
