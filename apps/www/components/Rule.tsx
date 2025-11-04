import { Dialog, Typo } from '@zzz-picker/components/v2'
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
        룰 설명서
      </button>
      <Dialog isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="flex flex-col gap-4 w-2xl">
          <Typo.Heading className="heading-4xl text-primary">Rule</Typo.Heading>
          <div>
            <Typo.Body className="text-lg">룰은 정리되면 추가될 예정입니다.</Typo.Body>
          </div>
        </div>
      </Dialog>
    </>
  )
}

export default Rule
