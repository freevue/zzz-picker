import { ImageGallery } from '~/components/Happy'

const Happy: React.FC = () => {
  return (
    <div className="size-full bg-base overflow-auto scrollbar-hidden">
      <div className="max-w-7xl mx-auto py-20">
        <p className="text-ink/70 body-sm mb-4 px-4 sm:p-6">
          해당 이미지들은 AI를 활용하여 제작된 2차 창작물입니다.
        </p>
        <ImageGallery />
      </div>
    </div>
  )
}

export default Happy
