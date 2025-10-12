import { UI } from '@/components'

type Props = {
  onClose: () => void
}

const Information: React.FC<Props> = (props) => {
  return (
    <UI.Dialog onClose={props.onClose}>
      <div className="bg-bg-content dark:text-white w-xl p-4 border-1 border-secondary">
        <UI.Typo.Heading primary>Information</UI.Typo.Heading>
        <ul className="flex flex-col gap-4 mt-10">
          <li className="flex gap-4 w-full text-lg">
            <span className="font-bold w-1/5 text-right">호요랩</span>
            <a
              className="hover:underline flex-1"
              href="https://www.hoyolab.com/home"
              target="_blank"
            >
              https://www.hoyolab.com/home
            </a>
          </li>
          <li className="flex gap-4 w-full text-lg">
            <span className="font-bold w-1/5 text-right">시청자 참여</span>
            <a
              className="hover:underline flex-1"
              href="https://playsquad.gg/p/nzoetv/home"
              target="_blank"
            >
              https://playsquad.gg/p/nzoetv/home
            </a>
          </li>
          <li className="flex gap-4 w-full text-lg">
            <span className="font-bold w-1/5 text-right">쉘터</span>
            <a
              className="hover:underline flex-1"
              href="https://shelter.id/MChIkVLcTWWBohXm0"
              target="_blank"
            >
              https://shelter.id/MChIkVLcTWWBohXm0
            </a>
          </li>
          <li className="flex gap-4 w-full text-lg">
            <span className="font-bold w-1/5 text-right">버그 제보</span>
            <a
              className="hover:underline flex-1"
              href="https://github.com/freevue/zzz-picker/issues"
              target="_blank"
            >
              https://github.com/freevue/zzz-picker/issues
            </a>
          </li>
        </ul>
      </div>
    </UI.Dialog>
  )
}

export default Information
