import AgentList from './AgentList'
import { useState } from 'react'

const Calc = () => {
  const [round1Cost, setRound1Cost] = useState(0)
  const [round2Cost, setRound2Cost] = useState(0)

  const onCostChange1 = (cost: number) => {
    setRound1Cost(cost)
  }
  const onCostChange2 = (cost: number) => {
    setRound2Cost(cost)
  }

  return (
    <div className="flex flex-col h-full w-full p-4">
      <h1 className="ft-ria text-5xl text-primary">Cost 계산기</h1>
      <div className="flex-1 gap-20 flex h-full w-full max-w-md mx-auto flex-col justify-center">
        <AgentList key="1" onChange={onCostChange1} />
        <AgentList key="2" onChange={onCostChange2} />
      </div>
      <p className="ft-pre h-18 leading-18 bg-accent rounded-full text-center font-bold text-2xl">
        총 <span className="ft-ria text-primary text-4xl">{round1Cost + round2Cost}</span> Cost
      </p>
    </div>
  )
}

export default Calc
