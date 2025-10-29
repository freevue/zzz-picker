import App from './App.tsx'
import './index.css'
import { Store, Apollo } from '@zzz-picker/provider'
import { createRoot } from 'react-dom/client'

createRoot(document.getElementById('root')!).render(
  <Apollo>
    <Store>
      <App />
    </Store>
  </Apollo>
)
