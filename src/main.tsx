import App from './App.tsx'
import './index.css'
import { AgentsProvider, BanProvider } from './provider'
import { createRoot } from 'react-dom/client'

createRoot(document.getElementById('root')!).render(
  <AgentsProvider>
    <BanProvider>
      <App />
    </BanProvider>
  </AgentsProvider>
)
