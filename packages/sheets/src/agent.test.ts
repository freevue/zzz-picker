import getAgentData from './agent'

describe('getAgentData', () => {
  test('should return agent data', async () => {
    const data = await getAgentData()

    console.log(data)
  })
})
