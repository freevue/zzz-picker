import { BanContext } from '../provider/Ban'
import { useContext } from 'react'

const useBan = () => {
  return useContext(BanContext)
}

export default useBan
