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
    <div className="flex flex-col h-dvh w-full p-4 px-4">
      <h1 className="ft-ria text-5xl text-primary">Cost 계산기</h1>
      <div className="flex-1 gap-6 flex h-full w-full flex-col justify-center">
        <AgentList key="1" onChange={onCostChange1} />
        <AgentList key="2" onChange={onCostChange2} />
      </div>
      <div className="fixed bottom-0 right-0 left-0 p-4">
        <p className="ft-pre text-ink text-xl font-black rounded-full bg-accent h-14 w-full mx-auto max-w-lg text-center leading-15">
          <span className="ft-ria text-primary text-3xl mx-2">{round1Cost + round2Cost}</span>
          <span>Co.</span>
        </p>
      </div>
    </div>
  )
}

export default Calc
