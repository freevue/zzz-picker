import { Agent, RineUp, Ban } from './components'

function App() {
  return (
    <>
      <div className="p-4 w-fit ml-auto mr-[300px]">
        <div className="flex items-center gap-10">
          <RineUp />
          <RineUp />
        </div>
        <Ban />
      </div>
      <div className="fixed top-0 right-0 w-[300px] h-full">
        <Agent.List />
      </div>
    </>
  )
}

export default App
