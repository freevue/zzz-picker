import { ScoreContext } from '../provider/Score'
import { useContext } from 'react'

const useScore = () => {
  return useContext(ScoreContext)
}

export default useScore
