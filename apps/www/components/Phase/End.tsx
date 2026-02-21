import { Typo } from '@zzz-picker/components/v2'

const End: React.FC = () => {
  return (
    <div className="size-full flex flex-col items-center justify-center p-4">
      <div className="card w-full max-w-md bg-content p-8 flex flex-col items-center gap-6">
        <Typo.Heading heading={1} className="heading-3xl font-black text-primary text-center">
          그로기 상태에 진입합니다.
        </Typo.Heading>

        <button
          type="button"
          onClick={() => window.close()}
          className="card py-3 w-full bg-primary text-ink heading-xl hover:opacity-90 transition-opacity"
        >
          나가기
        </button>
      </div>
    </div>
  )
}

export default End
