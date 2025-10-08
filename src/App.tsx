import { Header, Side, RuleBook } from './components'
import { ScoreProvider } from './provider'

function App() {
  return (
    <>
      <Header />
      <div className="pt-16 h-full ml-auto w-fit flex">
        <RuleBook />
        <ScoreProvider>
          <div className="flex flex-col h-full p-4 gap-10 mb-auto overflow-auto scrollbar-hidden">
            <Side />
          </div>
        </ScoreProvider>
      </div>
      {/* <div className="fixed top-0 right-0 w-[300px] h-full bg-base z-20">
        <Agent.List />
      </div> */}
    </>
  )
}

export default App
