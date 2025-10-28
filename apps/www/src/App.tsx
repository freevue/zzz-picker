import { Main, OriginalPlay, LegendPlay, UnlimitedPlay } from './pages'
import { Router } from '@zzz-picker/provider'

const routes = {
  '/': <Main />,
  '/original': <OriginalPlay />,
  '/legend': <LegendPlay />,
  '/unlimited': <UnlimitedPlay />,
}

const App: React.FC = () => {
  return <Router routes={routes}>404 Not Found</Router>
}

export default App
