import { Header, Side, RuleBook } from './components'
import { ScoreProvider, PickProvider } from './provider'

function App() {
  return (
    <>
      <Header />
      <PickProvider>
        <div className="pt-16 h-full ml-auto w-fit flex">
          <RuleBook />
          <ScoreProvider>
            <Side />
          </ScoreProvider>
        </div>
      </PickProvider>
    </>
  )
}

export default App
