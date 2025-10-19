import { usePlay } from '@/hooks'
import { Button, Icons } from '@zzz-picker/components'

const Reset: React.FC = () => {
  const { reset } = usePlay()

  return (
    <Button
      className="fixed right-4 bottom-4 size-12 rounded-full bg-primary flex items-center justify-center"
      onClick={reset}
    >
      <Icons.Refresh className="size-8 stroke-gray-50" />
    </Button>
  )
}

export default Reset
