import AllowAgent from './AllowAgent'
import BanAgent from './BanAgent'

const Ban: React.FC = () => {
  return (
    <div className="flex justify-end gap-4">
      <AllowAgent />
      <BanAgent />
    </div>
  )
}

export default Ban
