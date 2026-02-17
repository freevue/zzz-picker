import { ImageGallery } from '~/components/Happy'

const Happy: React.FC = () => {
  return (
    <div className="size-full bg-base overflow-auto scrollbar-hidden">
      <div className="max-w-7xl mx-auto">
        <ImageGallery />
      </div>
    </div>
  )
}

export default Happy
