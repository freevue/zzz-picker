import { UI } from '@/components'

type Props = {
  onClose: () => void
}

const Information: React.FC<Props> = (props) => {
  return (
    <UI.Dialog onClose={props.onClose}>
      <div className="bg-base dark:text-white w-96 p-4">
        <h2 className="text-3xl font-black">Information</h2>
        <p className="text-sm">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
        </p>
        <p className="text-sm">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
        </p>
        <p className="text-sm">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
        </p>
      </div>
    </UI.Dialog>
  )
}

export default Information
