import App from './App.tsx'
import './index.css'
import { Setting, Store } from '@zzz-picker/provider'
import { createRoot } from 'react-dom/client'

createRoot(document.getElementById('root')!).render(
  <Store>
    <Setting>
      <App />
    </Setting>
  </Store>
)
