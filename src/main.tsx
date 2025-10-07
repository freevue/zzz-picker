import App from './App.tsx'
import './index.css'
import { AgentsProvider } from './provider'
import { createRoot } from 'react-dom/client'

createRoot(document.getElementById('root')!).render(
  <AgentsProvider>
    <App />
  </AgentsProvider>
)
