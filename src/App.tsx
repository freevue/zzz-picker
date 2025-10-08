import { Header, Side, RuleBook } from './components'
import { ScoreProvider } from './provider'

function App() {
  return (
    <>
      <Header />
      <div className="pt-16 h-full ml-auto w-fit flex">
        <RuleBook />
        <ScoreProvider>
          <Side />
        </ScoreProvider>
      </div>
    </>
  )
}

export default App
