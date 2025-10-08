import AllowAgent from './AllowAgent'
import BanAgent from './BanAgent'

const Ban: React.FC = () => {
  return (
    <div className="flex mt-8 pt-8 border-t border-gray-300 gap-4">
      <AllowAgent />
      <BanAgent />
    </div>
  )
}

export default Ban
