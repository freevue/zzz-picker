import Book from './Book'
import { Dialog } from '@zzz-picker/components/v2'
import { useState } from 'react'

const Rule: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="text-ink/70 body-lg hover:text-primary cursor-pointer focus:outline-none"
      >
        경기 룰
      </button>
      <Dialog isOpen={isOpen} onClose={() => setIsOpen(false)} closeable>
        <Book className="flex flex-col gap-4 max-w-2xl w-full" />
      </Dialog>
    </>
  )
}

export default Rule
