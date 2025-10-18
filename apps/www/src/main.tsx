import App from './App.tsx'
import './index.css'
import { AgentsProvider, SettingProvider, BanProvider } from './provider'
import { Store } from '@zzz-picker/provider'
import { createRoot } from 'react-dom/client'

createRoot(document.getElementById('root')!).render(
  <Store>
    <AgentsProvider>
      <SettingProvider>
        <BanProvider>
          <App />
        </BanProvider>
      </SettingProvider>
    </AgentsProvider>
  </Store>
)
