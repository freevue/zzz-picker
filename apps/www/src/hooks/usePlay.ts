import { PlayContext } from '@/provider/Play'
import { useContext } from 'react'

const usePlay = () => {
  return useContext(PlayContext)
}

export default usePlay
