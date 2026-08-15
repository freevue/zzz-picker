import { CostDashboard } from '@/components'
import { Store } from '~/provider'

const Cost: React.FC = () => {
  return (
    <Store>
      <CostDashboard />
    </Store>
  )
}

export default Cost
