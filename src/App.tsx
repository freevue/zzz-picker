import { Header, Playground, CostTable } from './components'
import { ScoreProvider, PickProvider } from './provider'

function App() {
  return (
    <div className="w-full h-full overflow-auto scrollbar-hidden">
      {/* <div className="min-w-xs w-lg h-full"></div> */}
      <PickProvider>
        <div className="h-full ml-auto w-fit flex z-10 relative flex-1 overflow-auto scrollbar-hidden">
          <div className="min-w-xl w-xl dark:text-white bg-bg-content flex flex-col gap-6 overflow-y-auto overflow-x-hidden scrollbar-hidden">
            <Header />
            <CostTable />
          </div>
          <ScoreProvider>
            <div className="min-w-4xl w-4xl overflow-auto scrollbar-hidden">
              <Playground />
            </div>
          </ScoreProvider>
        </div>
      </PickProvider>
    </div>
  )
}

export default App
