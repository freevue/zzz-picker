import App from './App.tsx'
import './index.css'
import { AgentsProvider, SettingProvider, BanProvider } from './provider'
import { createRoot } from 'react-dom/client'

createRoot(document.getElementById('root')!).render(
  <AgentsProvider>
    <SettingProvider>
      <BanProvider>
        <App />
      </BanProvider>
    </SettingProvider>
  </AgentsProvider>
)
