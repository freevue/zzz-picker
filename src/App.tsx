import { Agent, Ban, Header, RuleBook, Side } from './components'

function App() {
  return (
    <>
      <Header />
      {/* <div className="fixed top-0 left-0 w-[300px] h-full pt-16">
        <RuleBook />
      </div> */}
      <div className="pt-16 pr-[300px] ml-auto w-fit">
        <div className="flex p-4">
          <Side />
        </div>
        {/* <Ban /> */}
      </div>
      <div className="fixed top-0 right-0 w-[300px] h-full bg-base z-20">
        <Agent.List />
      </div>
    </>
  )
}

export default App
