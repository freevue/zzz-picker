import { Agent, RineUp, Ban, Header } from './components'

function App() {
  return (
    <>
      <Header />
      <div className="dark:text-white fixed top-0 left-0 w-[300px] h-full pt-16">
        <h2>Rule</h2>
        <div>
          <p>lorem ipsum dolor sit amet</p>
          <p>lorem ipsum dolor sit amet</p>
          <p>오늘은 여기까지</p>
        </div>
      </div>
      <div className="p-4 w-fit ml-auto mr-[300px] pt-16">
        <div className="flex items-center gap-10">
          <RineUp />
          <RineUp />
        </div>
        <Ban />
      </div>
      <div className="fixed top-0 right-0 w-[300px] h-full bg-base z-20">
        <Agent.List />
      </div>
    </>
  )
}

export default App
