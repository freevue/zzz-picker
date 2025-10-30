import Information from './Information'
import Setting from './Setting'
import { Info, Setting as SettingIcon } from '@/Icons'
import { Dialog } from '@zzz-picker/components'
import { useState } from 'react'

const Header = () => {
  const [isInformationOpen, setIsInformationOpen] = useState(false)
  const [isSettingOpen, setIsSettingOpen] = useState(false)

  const onInformationClick = () => {
    setIsInformationOpen(true)
  }
  const onSettingClick = () => {
    setIsSettingOpen(true)
  }

  return (
    <>
      <div className="sticky top-0 left-0 p-4 w-full z-20 h-16 flex items-center bg-content">
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
              onClick={onSettingClick}
            >
              <SettingIcon className="cursor-pointer stroke-white/70 block w-full" />
            </button>
          </li>
        </ul>
        <div className="ml-auto text-right">
          <p className="text-sm text-foreground/70">v3.0.0</p>
          <p className="hidden alice:block text-foreground">
            가독성? 앨리스가 잘보이니 가독성은 좋음.
          </p>
        </div>
      </div>
      <Dialog isOpen={isInformationOpen} onClose={() => setIsInformationOpen(false)}>
        <Information />
      </Dialog>
      <Dialog isOpen={isSettingOpen} onClose={() => setIsSettingOpen(false)}>
        <Setting />
      </Dialog>
    </>
  )
}

export default Header
