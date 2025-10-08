import { PickContext } from '../provider/Pick'
import { useContext } from 'react'

const usePick = () => {
  return useContext(PickContext)
}

export default usePick
