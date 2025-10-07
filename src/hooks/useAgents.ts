import { AgentsContext } from '../provider/Agents'
import { useContext } from 'react'

const useAgents = () => {
  return useContext(AgentsContext)
}

export default useAgents
