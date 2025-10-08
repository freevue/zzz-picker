import { UI } from '@/components'

type Props = {
  onClose: () => void
}

const Information: React.FC<Props> = (props) => {
  return (
    <UI.Dialog onClose={props.onClose}>
      <div className="bg-base dark:text-white w-xl p-4">
        <h2 className="text-3xl font-black italic mb-10">Information</h2>
        <ul className="flex flex-col gap-2">
          <li className="flex gap-2 text-lg">
            <span className="font-bold">호요랩:</span>
            <a className="hover:underline" href="https://www.hoyolab.com/home" target="_blank">
              https://www.hoyolab.com/home
            </a>
          </li>
          <li className="flex gap-2 text-lg">
            <span className="font-bold">시청자 참여:</span>
            <a
              className="hover:underline"
              href="https://playsquad.gg/p/nzoetv/home"
              target="_blank"
            >
              https://playsquad.gg/p/nzoetv/home
            </a>
          </li>
          <li className="flex gap-2 text-lg">
            <span className="font-bold">쉘터:</span>
            <a
              className="hover:underline"
              href="https://shelter.id/MChIkVLcTWWBohXm0"
              target="_blank"
            >
              https://shelter.id/MChIkVLcTWWBohXm0
            </a>
          </li>
          <li className="flex gap-2 text-lg">
            <span className="font-bold">버그 제보:</span>
            <a
              className="hover:underline"
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
