import { CalcBoard } from '@/components'
import { Store } from '~/provider'

const Calc = () => {
  return (
    <Store>
      <CalcBoard />
    </Store>
  )
}

export default Calc
